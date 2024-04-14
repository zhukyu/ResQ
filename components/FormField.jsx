import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'

import { icons } from '../constants'

const FormField = ({ title, value, placeholder, handeChangeText, otherStyles, ...props }) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <View className={`space-y-2 ${otherStyles}`}>
            <Text className="text-base font-pmedium">{title}</Text>

            <View className="border-2 rounded-2xl px-4 h-16 w-full bg-gray-50 border-gray-300 
            focus:ring-primary  focus:border-primary flex flex-row items-center">
                <TextInput
                    className="flex-1 text-base font-pmedium text-gray-900"
                    value={value}
                    onChangeText={handeChangeText}
                    placeholder={placeholder}
                    cursorColor={'#000'}
                    secureTextEntry={title === 'Password' && !showPassword}
                    {...props}
                />

                {title === 'Password' && (
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Image source={showPassword ? icons.eye : icons.eyeHide} className="w-6 h-6" resizeMode="contain" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )
}

export default FormField