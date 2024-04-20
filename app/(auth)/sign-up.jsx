import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import DatePicker from '../../components/DatePicker'
import axiosInstance from '../../lib/AxiosInstance'
import { useGlobalContext } from '../../context/GlobalProvider'

const SignUp = () => {
    const { setToast } = useGlobalContext()
    const [form, setForm] = useState({
        email: '',
        password: '',
        repeatPassword: '',
        name: '',
        phoneNumber: '',
        dob: new Date(),
        address: '',
    })
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        repeatPassword: '',
        name: '',
        phoneNumber: '',
        dob: '',
    });
    const [isSubbmitting, setIsSubbmitting] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const setDate = (date) => {
        setForm({ ...form, dob: date })
    }

    const handleValidation = () => {
        let valid = true;
        const newErrors = {
            email: '',
            password: '',
            repeatPassword: '',
            name: '',
            phoneNumber: '',
            address: '',
            dob: ''
        };

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

        if (!form.repeatPassword) {
            newErrors.repeatPassword = 'Confirm password is required';
            valid = false;
        }

        if (form.password !== form.repeatPassword) {
            newErrors.repeatPassword = 'Passwords do not match';
            valid = false;
        }

        if (!form.name) {
            newErrors.name = 'Name is required';
            valid = false;
        }

        if (!form.phoneNumber.match(/^[0-9]{10,12}$/)) {
            newErrors.phoneNumber = 'Phone number is invalid';
            valid = false;
        }

        if (!form.phoneNumber) {
            newErrors.phoneNumber = 'Phone number is required';
            valid = false;
        }

        if (!form.dob) {
            newErrors.dob = 'Date of birth is required';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    }

    const submit = async () => {
        if (!handleValidation()) {
            return;
        }

        setIsSubbmitting(true)

        axiosInstance.post("/auth/register", {
            email: form.email.toLowerCase(),
            password: form.password,
            repeatPassword: form.repeatPassword,
            name: form.name,
            phoneNumber: form.phoneNumber,
            dob: form.dob,
            address: form.address
        }).then((res) => {
            setToast({
                type: 'success',
                text1: 'Success',
                text2: 'Account created successfully'
            })
            router.replace('/sign-in')
        }).catch((error) => {
            setToast({
                type: 'error',
                text1: 'Error',
                text2: error.response.data.message
            })
        }).finally(() => {
            setIsSubbmitting(false)
        })

        // router.replace('/sign-in')
        // } catch (error) {
        //     Alert.alert('Error', error.message)
        // } finally {
        //     setIsSubbmitting(false)
        // }
    }

    return (
        <SafeAreaView className="w-full flex flex-grow justify-center items-center bg-white">
            <ScrollView className="w-screen ">
                <View className=" justify-center py-7 px-6 rounded-xl shadow-xl bg-white flex-1">
                    <View className="flex-row items-center justify-start gap-1">
                        <Image source={images.resqlogo} className="w-8 h-[36px]" resizeMode="contain" />
                        <Text className='text-4xl font-archivobold text-primary'>RES<Text className="text-secondary-200">Q</Text></Text>
                    </View>

                    <Text className="text-2xl font-smibold mt-5 mb-3 font-psemibold">Sign up to ResQ</Text>

                    <FormField
                        title="Email"
                        value={form.email}
                        placeholder={"name@example.com"}
                        handeChangeText={(text) => setForm({ ...form, email: text })}
                        otherStyles="mt-4"
                        required="true"
                        keyboardType="email-address"
                        error={errors.email}
                    />
                    <FormField
                        title="Password"
                        value={form.password}
                        placeholder={"********"}
                        handeChangeText={(text) => setForm({ ...form, password: text })}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                        otherStyles="mt-4"
                        required={true}
                        error={errors.password}
                    />
                    <FormField
                        title="Confirm Password"
                        value={form.repeatPassword}
                        placeholder={"********"}
                        handeChangeText={(text) => setForm({ ...form, repeatPassword: text })}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                        otherStyles="mt-4"
                        required={true}
                        error={errors.repeatPassword}
                    />
                    <FormField
                        title="Name"
                        value={form.name}
                        placeholder={"John Doe"}
                        handeChangeText={(text) => setForm({ ...form, name: text })}
                        otherStyles="mt-4"
                        required={true}
                        error={errors.name}
                    />
                    <FormField
                        title="Phone Number"
                        value={form.phoneNumber}
                        placeholder={"08012345678"}
                        handeChangeText={(text) => setForm({ ...form, phoneNumber: text })}
                        otherStyles="mt-4"
                        required={true}
                        error={errors.phoneNumber}
                    />
                    <FormField
                        title="Address"
                        value={form.address}
                        placeholder={"123, Main Street"}
                        handeChangeText={(text) => setForm({ ...form, address: text })}
                        otherStyles="mt-4"
                        error={errors.address}
                    />
                    <DatePicker
                        title="Date of Birth"
                        date={form.dob}
                        setDate={setDate}
                        otherStyles="mt-4"
                        required={true}
                        error={errors.dob}
                    />
                    <CustomButton
                        title="Sign up"
                        handlePress={submit}
                        containerStyles="w-full mt-9"
                        isLoading={isSubbmitting}
                    />

                    <View className="justify-center pt-5 flex-row gap-2">
                        <Text className="text-light font-medium text-gray-700">Have an account already?</Text>
                        <Link href={'/sign-in'} className="text-primary font-semibold">Sign in</Link>
                    </View>

                </View>


            </ScrollView>
        </SafeAreaView>
    )
}

export default SignUp

const styles = StyleSheet.create({})