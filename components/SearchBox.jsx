import { View, Text, TouchableNativeFeedback } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

const SearchBox = ({ onPress }) => {
    const { t } = useTranslation();

    return (
        <View className="z-50 flex flex-row rounded-full overflow-hidden">
            <TouchableNativeFeedback
                onPress={onPress}
                className="rounded-lg"
            >
                <View className="bg-[#EEEEEE] py-3 px-4 rounded-full flex-row items-center flex-1">
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
