import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'

import { icons } from '../constants'

const FormField = ({ title, name, value, placeholder, handeChangeText, otherStyles, showPassword, setShowPassword, required = false, error, ...props }) => {

    return (
        <View className={`space-y-2 ${otherStyles}`}>
            <Text className="text-base font-semibold">
                {required ? (
                    <>
                        {title}
                        <Text className="text-red-500"> *</Text>
                    </>
                ) : (
                    title
                )}
            </Text>

            <View className={`border-[1px] rounded-2xl px-4 h-14 w-full bg-gray-50 border-gray-300 
            focus:ring-secondary  focus:border-secondary flex flex-row items-center ${error ? "border-red-500" : ""}`}>
                <TextInput
                    className="flex-1 text-base font-medium text-gray-900"
                    value={value}
                    onChangeText={handeChangeText}
                    placeholder={placeholder}
                    cursorColor={'#000'}
                    secureTextEntry={(title === 'Password' || title === "Confirm Password") && !showPassword}
                    {...props}
                />

                {(name === 'password' || name === 'confirmPassword') && (
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Image source={showPassword ? icons.eye : icons.eyeHide} className="w-6 h-6" resizeMode="contain" />
                    </TouchableOpacity>
                )}
            </View>

            {error && <Text className="text-red-500 text-xs font-normal">{error}</Text>}
        </View>
    )
}

export default FormField