import { Alert, Image, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native'
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
import { useTranslation } from 'react-i18next'

const SignIn = () => {
    const [form, setForm] = useState({
        email: '',
        password: ''
    })
    const [errors, setErrors] = useState({
        email: '',
        password: ''
    })
    const [isSubbmitting, setIsSubbmitting] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const { setUser, setIsLoggedIn, setExpirationTime, setToast } = useGlobalContext()

    const { t } = useTranslation();

    useEffect(() => {
        AsyncStorage.removeItem("accessToken")
        AsyncStorage.removeItem("refreshToken")
    }, [])

    const handleValidation = () => {
        let valid = true;
        const newErrors = { ...errors };

        if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = 'Email is invalid';
            valid = false;
        }

        if (!form.email) {
            newErrors.email = 'Email is required';
            valid = false;
        }

        if (!form.password) {
            newErrors.password = 'Password is required';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    }

    const submit = async () => {
        if (!handleValidation()) return;

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
            const expiration = new Date(new Date().getTime() + 9 * 60 * 1000)
            setExpirationTime(expiration)

            setToast({ type: "success", text1: "Success", text2: "Logged in successfully" })

            router.replace('/request')
        }).catch((error) => {
            console.error(error)
        }).finally(() => {
            setIsSubbmitting(false)
        })
    }

    return (
        // <ImageBackground source={images.wallpaper} resizeMode="cover" style={{  }} className="w-full flex flex-grow justify-center items-center">
        <SafeAreaView className="w-full flex flex-grow justify-center items-center">
            <View className="w-full p-5 rounded-xl">
                <ScrollView className="" style={{
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 4,
                    },
                    shadowOpacity: 0.27,
                    shadowRadius: 2,

                    elevation: 7,
                }}>
                    <View
                        className="justify-center py-7 px-6 rounded-xl bg-white flex-1 overflow-visible shadow">
                        <View className="flex-row items-center justify-start gap-1">
                            <Image source={images.resqlogo} className="w-8 h-[36px]" resizeMode="contain" />
                            <Text className='text-4xl font-archivobold text-primary'>RES
                                <Text className="text-secondary-200">Q</Text>
                            </Text>
                        </View>

                        <Text className="text-2xl font-smibold mt-7 font-bold">{t('login header')}</Text>

                        <FormField
                            title={t('email')}
                            name="email"
                            value={form.email}
                            placeholder={"name@example.com"}
                            handeChangeText={(text) => setForm({ ...form, email: text })}
                            otherStyles="mt-4"
                            keyboardType="email-address"
                            error={errors.email}
                        />
                        <FormField
                            title={t('password')}
                            name="password"
                            value={form.password}
                            placeholder={"********"}
                            handeChangeText={(text) => setForm({ ...form, password: text })}
                            showPassword={showPassword}
                            setShowPassword={setShowPassword}
                            otherStyles="mt-4"
                            error={errors.password}
                        />

                        <CustomButton
                            title={t('login')}
                            handlePress={submit}
                            containerStyles="w-full mt-7"
                            isLoading={isSubbmitting}
                        />

                        <View className="justify-center pt-5 flex-row gap-2">
                            <Text className="text-light font-medium text-gray-700">{t('dont have account')}</Text>
                            <Link href={'/sign-up'} className="text-primary font-semibold">{t('signup')}</Link>
                        </View>

                    </View>


                </ScrollView>
            </View>
        </SafeAreaView >
        // </ImageBackground>
    )
}

export default SignIn

const styles = StyleSheet.create({})