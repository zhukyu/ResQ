import { View, Text, TextInput } from "react-native";
import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import SearchBox from "../../components/SearchBox";

const ChatScreen = ({ navigation }) => {
    const handleSearchBoxPress = () => {
        navigation.push(`stack`, {
            screen: `chatSearch`,
        });
    };

    return (
        <View className="h-full bg-white">
            <SearchBox onPress={handleSearchBoxPress} />
            
        </View>
    );
};

export default ChatScreen;
