import { StatusBar } from 'expo-status-bar';
import { Image, ScrollView, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { images, system } from '../constants';
import CustomButton from '../components/CustomButton';
import { useGlobalContext } from '../context/GlobalProvider';
import Toast from 'react-native-toast-message';
import { useEffect } from 'react';
import { getCurrentUser } from '../lib/appwrite';
import axiosInstance from '../lib/AxiosInstance';
import i18next from '../lang/i18n'
import * as Location from "expo-location";
import Geocoding from 'react-native-geocoding';

export default function App() {
    const {
        isLoading,
        isLoggedIn,
        setIsLoggedIn,
        setUser,
        setIsLoading,
        setExpirationTime
    } = useGlobalContext();

    const handleGetCurrentUser = async () => {
        const res = await getCurrentUser()
        // wait for logo screen
        // await new Promise(resolve => setTimeout(resolve, 2000));

        return res
    }

    const GOOGLE_MAPS_APIKEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY

    useEffect(() => {
        Location.requestForegroundPermissionsAsync();
        Geocoding.init(GOOGLE_MAPS_APIKEY);
    }, [])


    useEffect(() => {
        handleGetCurrentUser()
            .then((res) => {
                if (res) {
                    console.log("current user", res);
                    setIsLoggedIn(true)
                    setUser(res)

                    // set timer for refresh access token
                    const expiration = new Date(new Date().getTime() + system.refreshTime)
                    setExpirationTime(expiration)
                }
                else {
                    setIsLoggedIn(false)
                    setUser(null)
                }
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    setIsLoggedIn(false)
                    setUser(null)
                }
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [])

    useEffect(() => {
        if (!isLoading && isLoggedIn) {
            router.replace('/request')
        }
        else if (!isLoading && !isLoggedIn) {
            router.replace('/sign-in')
        }
    }, [isLoading, isLoggedIn])

    return (
        <SafeAreaView className="bg-white h-full">
            <ScrollView contentContainerStyle={{ height: '100%' }}>
                <View className='w-full justify-center items-center h-full flex p-4'>
                    <View className='w-full justify-center items-center flex flex-row gap-1'>
                        <View className=''>
                            <Image source={images.resqlogo} className='w-12 h-12' resizeMode='contain' />
                        </View>
                        <View className='flex justify-center items-start flex-col'>
                            <Text className='text-4xl font-archivobold text-primary'>RES<Text className="text-secondary-200">Q</Text></Text>
                            <Text className='text-xs font-psemibold text-secondary-200'>SECURE YOUR LIFE</Text>
                        </View>
                    </View>
                    {/* <CustomButton
                        title="Continue with email"
                        handlePress={() => router.push('/sign-in')}
                        containerStyles="w-full mt-7"
                    /> */}
                </View>
            </ScrollView>

            {/* <StatusBar backgroundColor='#161622' style='light'/> */}
        </SafeAreaView>
    );
}
