import { View, Text, Image } from 'react-native'
import { Header } from '@react-navigation/elements';
import React from 'react'
import { images } from '../constants'

const CustomHeader = ({ ...props }) => {
    return (
        <View className="flex flex-row items-center justify-center">
            <View className="flex flex-row items-center justify-center gap-2">
                <Image source={images.resqlogoWhite} className="w-[30px] h-[30px]" resizeMode="contain" />
                <Text className='text-3xl font-archivobold text-white'>RESQ</Text>
            </View>
        </View>
    )
}

export default CustomHeader