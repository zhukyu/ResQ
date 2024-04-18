import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import { signUp } from '../../lib/appwrite'

const SignUp = () => {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: ''
    })

    const [isSubbmitting, setIsSubbmitting] = useState(false)

    const submit = async () => {
        if (!form.username || !form.email || !form.password) {
            Alert.alert('Please fill all fields')
            return
        }

        setIsSubbmitting(true)

        try {
            const res = await signUp(form.email, form.password, form.username)
            console.log(res)

            // set to global state
            

            router.replace('/sign-in')
        } catch (error) {
            Alert.alert('Error', error.message)
        } finally {
            setIsSubbmitting(false)
        }
    }

    return (
        <SafeAreaView className="h-full bg-white">
            <ScrollView>
                <View className="w-full justify-center h-full px-4 my-6">
                    <View className="flex-row items-center justify-start gap-1">
                        <Image source={images.resqlogo} className="w-8 h-[36px]" resizeMode="contain" />
                        <Text className='text-4xl font-archivobold text-primary'>RES<Text className="text-secondary-200">Q</Text></Text>
                    </View>

                    <Text className="text-2xl font-smibold mt-10 font-psemibold">Sign up to ResQ</Text>

                    <FormField
                        title="Username"
                        value={form.username}
                        handeChangeText={(text) => setForm({ ...form, username: text })}
                        otherStyles="mt-7"
                    />
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
                        title="Sign up"
                        handlePress={submit}
                        containerStyles="w-full mt-7"
                        isLoading={isSubbmitting}
                    />

                    <View className="justify-center pt-5 flex-row gap-2">
                        <Text className="text-light font-pmedium text-gray-700">Have an account already?</Text>
                        <Link href={'/sign-in'} className="text-primary font-psemibold">Sign in</Link>
                    </View>

                </View>


            </ScrollView>
        </SafeAreaView>
    )
}

export default SignUp

const styles = StyleSheet.create({})