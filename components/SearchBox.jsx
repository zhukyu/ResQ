import { View, Text, TouchableNativeFeedback } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

const SearchBox = ({ onPress }) => {
    const { t } = useTranslation();
    
    return (
        <View
            className="z-50 flex flex-row mx-4 my-[6] rounded-lg bg-red-100 overflow-hidden"
            style={{
                shadowOffset: {
                    width: 0,
                    height: 12,
                },
                shadowColor: "#7c828c",
                shadowOpacity: 1,
                shadowRadius: 1,
                elevation: 10,
            }}
        >
            <TouchableNativeFeedback
                onPress={onPress}
                className="rounded-lg"
                background={TouchableNativeFeedback.Ripple("#EEEEEE", true)}
            >
                <View className="bg-white py-2 px-3 rounded-lg flex-row items-center flex-1">
                    <View className="mr-3">
                        <FontAwesome name="search" size={18} color="gray" />
                    </View>
                    <Text className="flex-1 text-base font-medium text-gray-500">
                        {t("search")}
                    </Text>
                </View>
            </TouchableNativeFeedback>
        </View>
    );
};

export default SearchBox;
