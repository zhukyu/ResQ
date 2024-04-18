import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import { signIn } from '../../lib/appwrite'
import axiosInstance from '../../lib/AxiosInstance'
import { useGlobalContext } from '../../context/GlobalProvider'
import AsyncStorage from '@react-native-async-storage/async-storage'

const SignIn = () => {
    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    const [isSubbmitting, setIsSubbmitting] = useState(false)
    const { setUser, setIsLoggedIn, setExpirationTime, setToast } = useGlobalContext()

    useEffect(() => {
        AsyncStorage.removeItem("accessToken")
        AsyncStorage.removeItem("refreshToken")
    }, [])

    const submit = async () => {
        if (!form.email || !form.password) {
            Alert.alert('Please fill all fields')
            return
        }

        setIsSubbmitting(true)

        const email = form.email.toLowerCase();
        const password = form.password;

        axiosInstance.post("/auth/login", {
            email: email,
            password: password
        }).then((res) => {
            setUser(res.data.user)
            setIsLoggedIn(true)
            AsyncStorage.setItem("accessToken", res.data.accessToken)
            AsyncStorage.setItem("refreshToken", res.data.refreshToken)
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`

            // set timer for refresh access token
            const expiration = new Date(new Date().getTime() + 15 * 1000)
            setExpirationTime(expiration)

            setToast({ type: "success", text1: "Success", text2: "Logged in successfully"})

            router.replace('/request')
        }).catch((error) => {
            console.error(error)
        }).finally(() => {
            setIsSubbmitting(false)
        })
    }

    return (
        <SafeAreaView className="h-full bg-white">
            <ScrollView>
                <View className="w-full justify-center h-full px-4 my-6">
                    <View className="flex-row items-center justify-start gap-1">
                        <Image source={images.resqlogo} className="w-8 h-[36px]" resizeMode="contain" />
                        <Text className='text-4xl font-archivobold text-primary'>RES
                            <Text className="text-secondary-200">Q</Text>
                        </Text>
                    </View>

                    <Text className="text-2xl font-smibold mt-10 font-psemibold">Log in to ResQ</Text>

                    <FormField
                        title="Email"
                        value={form.email}
                        handeChangeText={(text) => setForm({ ...form, email: text })}
                        otherStyles="mt-7"
                        keyboardType="email-address"
                    />
                    <FormField
                        title="Password"
                        value={form.password}
                        handeChangeText={(text) => setForm({ ...form, password: text })}
                        otherStyles="mt-7"
                    />

                    <CustomButton
                        title="Log in"
                        handlePress={submit}
                        containerStyles="w-full mt-7"
                        isLoading={isSubbmitting}
                    />

                    <View className="justify-center pt-5 flex-row gap-2">
                        <Text className="text-light font-pmedium text-gray-700">Don't have an account?</Text>
                        <Link href={'/sign-up'} className="text-primary font-psemibold">Sign up</Link>
                    </View>

                </View>


            </ScrollView>
        </SafeAreaView>
    )
}

export default SignIn

const styles = StyleSheet.create({})