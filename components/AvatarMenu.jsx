import {
    View,
    Text,
    Image,
    TouchableOpacity,
    TouchableHighlight,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useGlobalContext } from "../context/GlobalProvider";
import { FontAwesome } from "@expo/vector-icons";

const AvatarMenu = ({ style }) => {
    const navigation = useNavigation();
    const { user } = useGlobalContext();

    return (
        <TouchableHighlight
            className="flex flex-row items-center rounded-full border-2 border-white w-11 h-11"
            onPress={() => navigation.openDrawer()}
            style={style}
        >
            {user && user.avatar ? (
                <Image
                    source={{
                        uri: user.avatar,
                    }}
                    className="w-10 h-10 rounded-full"
                />
            ) : (
                <View className="w-10 h-10 rounded-full bg-[#CCCCCC] flex items-center justify-center">
                    <FontAwesome name="user" size={24} color="white" />
                </View>
            )}
        </TouchableHighlight>
    );
};

export default AvatarMenu;
