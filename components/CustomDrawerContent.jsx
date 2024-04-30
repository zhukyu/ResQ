import { View, Text, Alert, Image } from 'react-native'
import React from 'react'
import { useGlobalContext } from '../context/GlobalProvider';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../lib/AxiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Feather } from '@expo/vector-icons';
import CustomButton from './CustomButton';
import { CommonActions, useNavigation } from '@react-navigation/native';

const CustomDrawerContent = (props) => {
    const { setUser, setIsLoggedIn, setToast, setIsLoading } = useGlobalContext()
    const { t } = useTranslation();
    const navigation = useNavigation();

    const showAlert = () => {
        Alert.alert(
            t('logout'),
            t('logout confirmation'),
            [
                {
                    text: t('cancel'),
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                },
                { text: t('yes'), onPress: signOut }
            ],
            { cancelable: true }
        )
    }

    const signOut = () => {
        setIsLoading(true)
        axiosInstance.post("/auth/logout").then((res) => {
            if (res.status === 200) {
                setUser(null)
                setIsLoggedIn(false)

                AsyncStorage.removeItem("accessToken")
                AsyncStorage.removeItem("refreshToken")

                setToast({ type: "success", text1: t('success'), text2: t('logout success') })

                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'auth' }],
                    })
                );
            }
        }).catch((error) => {
            console.error(error)
        }).finally(() => {
            setIsLoading(false)
        })
    }

    return (
        <DrawerContentScrollView {...props}>
            <View className="flex flex-col items-center justify-center p-4">
                <Image
                    source={{ uri: 'https://randomuser.me/api/portraits/women/26.jpg' }}
                    className="w-28 h-28 rounded-full"
                />
                <Text className="text-lg font-semibold mt-2">Jane Doe</Text>
                <Text className="text-sm text-gray-500">User</Text>
            </View>
            <DrawerItem
                icon={({ color, size }) => (
                    <Feather
                        name="user"
                        size={size}
                        color="gray"
                    />
                )}
                label={t('profile')}
                labelStyle={{
                    marginLeft: -20,
                    fontSize: 16,
                    color: "gray",
                }}
                style={{
                    backgroundColor: 'transparent',
                    borderRadius: 10,
                }}
                onPress={() =>
                    navigation.navigate('profile')
                }
            />
            <DrawerItem
                icon={({ color, size }) => (
                    <Feather
                        name="settings"
                        size={size}
                        color='gray'
                    />
                )}
                label={t('setting')}
                labelStyle={{
                    marginLeft: -20,
                    fontSize: 16,
                    color: 'gray',
                }}
                style={{
                    backgroundColor: 'transparent',
                    borderRadius: 10,
                }}
                onPress={() =>
                    navigation.navigate('setting')
                }
            />
            <CustomButton
                title={t('logout')}
                handlePress={showAlert}
                containerStyles="m-7"
            />
        </DrawerContentScrollView>
    )
}

export default CustomDrawerContent