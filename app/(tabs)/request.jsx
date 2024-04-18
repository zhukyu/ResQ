import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useGlobalContext } from '../../context/GlobalProvider'
import CustomButton from '../../components/CustomButton'
import axiosInstance from '../../lib/AxiosInstance'
import { refreshAccessToken } from '../../lib/appwrite'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'

const Request = () => {

    const { setUser, setIsLoggedIn, setToast } = useGlobalContext()

    const signOut = () => {
        axiosInstance.post("/auth/logout").then((res) => {
            if (res.status === 200) {
                setUser(null)
                setIsLoggedIn(false)

                AsyncStorage.removeItem("accessToken")
                AsyncStorage.removeItem("refreshToken")

                setToast({ type: "success", text1: "Success", text2: "Logged out successfully" })

                router.replace('/sign-in')
            }
        }).catch((error) => {
            console.error(error)
        })
    }

    const refresh = async () => {
        const accessToken = await refreshAccessToken();
        if (accessToken) {
            AsyncStorage.setItem("accessToken", accessToken)
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
        }
    }

    return (
        <View>
            <Text>Request</Text>
            <CustomButton title="Sign out" handlePress={signOut} />
            <CustomButton title="Refresh Token" handlePress={refresh} />
        </View>
    )
}

export default Request