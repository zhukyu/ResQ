import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const CustomButton = ({
    title,
    handlePress,
    containerStyles,
    textStyles,
    isLoading,
    disabled,
}) => {
    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            className={`
            rounded-xl min-h-[50px] justify-center items-center 
            ${isLoading ? "opacity-50" : ""} ${
                disabled ? "bg-gray-200" : "bg-primary"
            } ${containerStyles}`}
            disabled={isLoading || disabled}
        >
            <Text className={`font-semibold text-lg text-white ${textStyles}`}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

export default CustomButton;
