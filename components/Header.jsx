import { View, Text, Image } from 'react-native'
import { Header } from '@react-navigation/elements';
import React from 'react'
import { images } from '../constants'
import AvatarMenu from './AvatarMenu';

const CustomHeader = ({ ...props }) => {
    return (
        <View className="flex flex-row items-center justify-between w-full">
            <View className="flex flex-row items-center justify-center gap-2">
                <Image source={images.resqlogo} className="w-[30px] h-[30px]" resizeMode="contain" />
                <Text className='text-3xl font-archivobold text-primary'>RESQ</Text>
            </View>
            <AvatarMenu {...props} />
        </View>
    )
}

export default CustomHeader