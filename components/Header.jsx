import { View, Text, Image } from 'react-native'
import { Header } from '@react-navigation/elements';
import React from 'react'
import { images } from '../constants'
import AvatarMenu from './AvatarMenu';

const CustomHeader = ({ ...props }) => {
    return (
        <Header
            headerTitle={() => (
                <View className="flex flex-row items-center justify-between w-full">
                    <View className="flex flex-row items-center justify-center gap-2">
                        <Image source={images.resqlogo} className="w-[30px] h-[30px]" resizeMode="contain" />
                        <Text className='text-3xl font-archivobold text-primary'>RESQ</Text>
                    </View>
                    <AvatarMenu {...props} />
                </View>
            )}
            headerStyle={{
                height: 89,
                // shadowOffset: {
                //     width: 0,
                //     height: 3,
                // },
                // shadowColor: '#171717',
                // shadowOpacity: 0.2,
                // shadowRadius: 3.84,
                // elevation: 6,
            }}
        />

        // <Header
        // title={title}
        // headerLeft={() => (
        //     <TouchableOpacity className="p-4" onPress={() => router.back()}>
        //         <View className="">
        //             <Ionicons name="arrow-back" size={24} color="black" />
        //         </View>
        //     </TouchableOpacity >
        // )}
        // headerTitleStyle={{
        //     marginLeft: -14,
        // }}
        // />
    )
}

export default CustomHeader