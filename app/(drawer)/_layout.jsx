import { View, Text, Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import CustomButton from '../../components/CustomButton';
import AvatarMenu from '../../components/AvatarMenu';
import CustomHeader from '../../components/Header';
import BackButtonHeader from '../../components/BackButtonHeader';
import { useGlobalContext } from '../../context/GlobalProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../../lib/AxiosInstance';

const CustomDrawerContent = (props) => {
    const { setUser, setIsLoggedIn, setToast } = useGlobalContext()
    const { t } = useTranslation();

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
        axiosInstance.post("/auth/logout").then((res) => {
            if (res.status === 200) {
                setUser(null)
                setIsLoggedIn(false)

                AsyncStorage.removeItem("accessToken")
                AsyncStorage.removeItem("refreshToken")

                setToast({ type: "success", text1: t('success'), text2: t('logout success') })

                router.replace('/sign-in')
            }
        }).catch((error) => {
            console.error(error)
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
                    router.push('profile')
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
                    router.push('setting')
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

const DrawerLayout = () => {
    const { t } = useTranslation()

    return (
        <Drawer
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerShown: true,
                swipeEdgeWidth: 0,
                drawerPosition: 'right',
                drawerType: 'front',
                headerTitle: (props) => <CustomHeader {...props} />,
                headerLeft: () => null,
                headerRight: (props) => <AvatarMenu {...props} />,
                headerStyle: {
                    backgroundColor: '#F73334',
                },
            }}
            backBehavior="history"
        >
            <Drawer.Screen
                name="profile"
                options={{
                    headerShown: true,
                    title: 'Profile',
                    header: (props) => <BackButtonHeader title={t('Profile')} />,
                    headerRight: () => null,
                    headerStyle: {
                        backgroundColor: '#fff',
                    },
                }}
            />
            <Drawer.Screen
                name="setting"
                options={{
                    headerShown: true,
                    title: 'Setting',
                    header: (props) => <BackButtonHeader title={t('Setting')} />,
                    headerRight: () => null,
                    headerStyle: {
                        backgroundColor: '#fff',
                    },
                }}
            />
        </Drawer>
    )
}

export default DrawerLayout