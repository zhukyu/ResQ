import { View, Text, SafeAreaView, Image, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import { useGlobalContext } from '../../context/GlobalProvider';
import { getCurrentUser } from '../../lib/appwrite';
import * as Location from "expo-location";
import { CommonActions, useNavigation } from '@react-navigation/native';
import { images, system } from '../../constants';
import Geocoding from 'react-native-geocoding';

const SplashScreen = () => {
    const {
        isLoading,
        isLoggedIn,
        setIsLoggedIn,
        setUser,
        setIsLoading,
        setExpirationTime
    } = useGlobalContext();

    const navigation = useNavigation();

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
                    // console.log("current user", res);
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
                console.log("error", error);
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
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'drawer' }],
                })
            );
        }
        else if (!isLoading && !isLoggedIn) {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'auth' }],
                })
            );
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

export default SplashScreen