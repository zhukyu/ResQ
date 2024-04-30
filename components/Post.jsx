import { View, Text, Image, TouchableNativeFeedback } from 'react-native'
import React, { useState } from 'react'
import { AntDesign, EvilIcons, Feather, FontAwesome, FontAwesome5, FontAwesome6, MaterialIcons } from '@expo/vector-icons'
import { icons } from '../constants'
import { router } from 'expo-router'
import { useNavigation } from '@react-navigation/native'

const Post = ({ id }) => {
    const [isEmergency, setIsEmergency] = useState(false)
    const navigation = useNavigation()

    const handlePostPress = () => {
        navigation.navigate(`stack`, {
            screen: `requestDetail`,
            param: { id: id }
        })
        // router.push(`../request/requestDetail`, { id: id })
    }
    return (
        <TouchableNativeFeedback
            delayPressIn={100}
            onPress={handlePostPress}
        >
            <View className={`bg-white w-full px-4 py-3 mb-1 flex flex-col ${isEmergency ? 'border-2 border-primary' : null}`}>
                <View className="flex flex-row justify-center w-full">
                    <Image
                        source={{ uri: 'https://randomuser.me/api/portraits/women/26.jpg' }}
                        className="w-9 h-9 rounded-full"
                    />
                    <View className="flex flex-col ml-2 flex-grow">
                        <Text className="text-sm font-semibold">Jane Doe</Text>
                        <Text className="text-xs text-gray-500">10km · 18:30</Text>
                    </View>
                    <View className="flex flex-row justify-center items-center gap-2">
                        <FontAwesome6 name="message" size={20} color="#F73334" />
                        <Feather name="map-pin" size={20} color="#F73334" />
                    </View>
                </View>
                <View className="flex flex-row justify-center items-center w-full mt-2">
                    <Text className="text-sm text-gray-500 w-full" numberOfLines={3}>
                        Urgent SOS! I'm trapped in my home due to severe flooding in the area. Water levels are rising rapidly,
                        and I fear for my safety. My address is 123 Main Street, Cityville. Please send help immediately.
                        My family and I are in desperate need of assistance. GPS coordinates attached for accurate location tracking.
                        Please hurry!
                    </Text>
                </View>

                <View className="flex flex-row justify-between items-center w-full mt-2">
                    <View className="flex flex-row justify-center items-center border-[1px] border-gray-300 rounded-2xl px-2 py-1">
                        <Image source={icons.upOutlined} className="w-5 h-5 mr-3" tintColor={'gray'} />
                        <Text className="text-sm font-medium text-gray-500 mr-2">12</Text>
                        <Image source={icons.line} className="w-[1px] h-4 mr-2" tintColor={'#DDDDDD'} />
                        <Image source={icons.downOutlined} className="w-5 h-5" tintColor={'gray'} />
                    </View>

                    <View className="flex flex-row justify-center items-center border-[1px] border-gray-300 rounded-2xl px-2 py-1">
                        <View className="mr-1">
                            <EvilIcons name="comment" size={20} color="gray" />
                        </View>
                        <Text className="text-sm font-medium text-gray-500 mr-2">12 comments</Text>
                    </View>
                </View>

            </View>
        </TouchableNativeFeedback>
    )
}

export default Post