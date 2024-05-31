import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const RequestTypeCard = ({ icon, name, onPress, ...props }) => {
    return (
        <TouchableOpacity
            className="w-full bg-white p-4 mb-4 rounded-xl flex flex-row items-center justify-between"
            style={{
                overflow: "visible",
                shadowOffset: {
                    width: 0,
                    height: 3,
                },
                shadowColor: "#9ca3af",
                shadowOpacity: 0.2,
                shadowRadius: 3.84,
                elevation: 15,
            }}
            activeOpacity={0.6}
            onPress={onPress}
        >
            <LinearGradient
                className="p-3 rounded-xl"
                colors={["#F73334", "#FF6173"]}
                start={{ x: 0.5, y: 0.5 }}
            >
                {/* <FontAwesome5 name="house-damage" size={24} color="white" /> */}
                <Image source={{ uri: icon }} style={{ width: 26, height: 26 }} tintColor="white" resizeMode="contain"/>
            </LinearGradient>
            <Text className="text-base font-semibold flex-1 ml-4">
                {name}
            </Text>
            <AntDesign name="arrowright" size={24} color="gray" />
        </TouchableOpacity>
    );
};

export default RequestTypeCard;
