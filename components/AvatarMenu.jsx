import { View, Text, Image, TouchableOpacity, TouchableHighlight } from 'react-native'
import React from 'react'
import { DrawerToggleButton } from '@react-navigation/drawer'
import { useNavigation } from "@react-navigation/native";

const AvatarMenu = ({ style }) => {
    const navigation = useNavigation();
    
    return (
        <TouchableHighlight
            className="flex flex-row items-center rounded-full border-2 border-white w-11 h-11"
            onPress={() => navigation.openDrawer()}
            style={style}
        >
            {/* <DrawerToggleButton /> */}
            <Image
                source={{ uri: 'https://randomuser.me/api/portraits/women/26.jpg' }}
                className="w-10 h-10 rounded-full"
            />
        </TouchableHighlight>
    )
}

export default AvatarMenu