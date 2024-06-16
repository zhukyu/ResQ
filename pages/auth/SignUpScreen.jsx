import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import DatePicker from '../../components/DatePicker'
import axiosInstance from '../../lib/AxiosInstance'
import { useGlobalContext } from '../../context/GlobalProvider'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'

const SignUpScreen = () => {
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
    const navigation = useNavigation();
    const { t } = useTranslation();

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
            newErrors.email = t('email must be valid');
            valid = false;
        }

        if (!form.email) {
            newErrors.email = t('email is required');
            valid = false;
        }

        if (form.password.length < 6) {
            newErrors.password = t('password must be at least 6 characters');
            valid = false;
        }

        if (!form.password) {
            newErrors.password = t('password is required');
            valid = false;
        }

        if (form.password !== form.repeatPassword) {
            newErrors.repeatPassword = t('passwords is not match');
            valid = false;
        }

        if (!form.repeatPassword) {
            newErrors.repeatPassword = t('password is required');
            valid = false;
        }

        if (!form.name) {
            newErrors.name = t('name is required');
            valid = false;
        }

        if (!form.phoneNumber.match(/^[0-9]{10,12}$/)) {
            newErrors.phoneNumber = t('phone number must be valid');
            valid = false;
        }

        if (!form.phoneNumber) {
            newErrors.phoneNumber = t('phone number is required');
            valid = false;
        }

        if (!form.dob) {
            newErrors.dob = t('dob is required');
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
                text1: t('success'),
                text2: t('signup success')
            })
            navigation.navigate('Sign In')
        }).catch((error) => {
            if (error.response.status === 400 && error.response.data.message === 'Email already exists') {
                setToast({
                    type: 'error',
                    text1: t('error'),
                    text2: t('email already exists')
                })
            }
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

                    <Text className="text-2xl mt-5 mb-3 font-rbold">{t('signup header')}</Text>

                    <FormField
                        title={t('email')}
                        name="email"
                        value={form.email}
                        placeholder={"name@example.com"}
                        handeChangeText={(text) => setForm({ ...form, email: text })}
                        otherStyles="mt-4"
                        required="true"
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
                        required={true}
                        error={errors.password}
                    />
                    <FormField
                        title={t('confirm password')}
                        name="confirmPassword"
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
                        title={t('name')}
                        name="name"
                        value={form.name}
                        placeholder={"John Doe"}
                        handeChangeText={(text) => setForm({ ...form, name: text })}
                        otherStyles="mt-4"
                        required={true}
                        error={errors.name}
                    />
                    <FormField
                        title={t('phone number')}
                        name="phoneNumber"
                        value={form.phoneNumber}
                        placeholder={"08012345678"}
                        handeChangeText={(text) => setForm({ ...form, phoneNumber: text })}
                        otherStyles="mt-4"
                        required={true}
                        error={errors.phoneNumber}
                    />
                    <FormField
                        title={t('address')}
                        name="address"
                        value={form.address}
                        placeholder={"123, Main Street"}
                        handeChangeText={(text) => setForm({ ...form, address: text })}
                        otherStyles="mt-4"
                        error={errors.address}
                    />
                    <DatePicker
                        title={t('dob')}
                        name="dob"
                        date={form.dob}
                        setDate={setDate}
                        otherStyles="mt-4"
                        required={true}
                        error={errors.dob}
                    />
                    <CustomButton
                        title={t('signup')}
                        handlePress={submit}
                        containerStyles="w-full mt-9"
                        isLoading={isSubbmitting}
                    />

                    <View className="justify-center pt-5 flex-row gap-2">
                        <Text className="text-light font-medium text-gray-700">{t('have account')}</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Sign In')}>
                            <Text className="text-primary font-semibold">{t('login')}</Text>
                        </TouchableOpacity>
                    </View>

                </View>


            </ScrollView>
        </SafeAreaView>
    )
}

export default SignUpScreen

const styles = StyleSheet.create({})