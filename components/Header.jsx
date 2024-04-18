import { View, Text, Image } from 'react-native'
import React from 'react'
import { images } from '../constants'

const Header = ({ ...props }) => {
    return (
        <View className="flex flex-row items-center justify-center">
            <View className="flex flex-row items-start justify-center gap-1">
                {/* <Image source={images.resqlogoWhite} className="w-7 h-[32px]" resizeMode="contain" /> */}
                <Text className='text-3xl font-archivobold text-white'>RESQ</Text>
            </View>
        </View>
    )
}

export default Header