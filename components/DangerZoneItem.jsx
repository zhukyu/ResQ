import { View, Text } from "react-native";
import React from "react";
import {
    FontAwesome,
    FontAwesome5,
    FontAwesome6,
    MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

const StatusBadge = ({ status }) => {
    const { t } = useTranslation();

    const getStatusProps = (status) => {
        switch (status) {
            case "active":
                return {
                    text: t("active"),
                    style: "border-green-500 bg-green-300",
                };
            case "deleted":
                return {
                    text: t("deleted"),
                    style: "border-gray-500 bg-gray-300",
                };
            default:
                return {
                    text: t("deleted"),
                    style: "border-gray-500 bg-gray-300",
                };
        }
    };

    const { text, style } = getStatusProps(status);

    return (
        <View
            className={`flex flex-row items-center justify-center rounded-full px-2 py-1 border ${style}`}
        >
            <Text className="text-xs font-rregular text-white">{text}</Text>
        </View>
    );
};

const DangerZoneItem = ({ item }) => {
    return (
        <View className="bg-white p-4 mb-2">
            <View className="flex flex-row items-center justify-between mb-1">
                <View className="flex flex-row items-center justify-start flex-grow">
                    <View className="w-8 h-8 flex items-start justify-center">
                        <FontAwesome6
                            name="location-dot"
                            size={22}
                            color="#F73334"
                        />
                    </View>
                    <Text className="text-sm font-rmedium text-gray-800 max-w-[70%]">
                        {item?.address}
                    </Text>
                </View>

                <View className="ml-1">
                    <StatusBadge status={item?.status} />
                </View>
            </View>
            <View className="flex flex-row items-center justify-between">
                <View className="flex flex-row items-center justify-start flex-grow">
                    <View className="w-8 h-8 flex items-start justify-center">
                        <FontAwesome name="warning" size={18} color="#F73334" />
                    </View>
                    <Text className="text-sm font-rregular text-gray-600 max-w-[70%]">
                        {item?.message}
                    </Text>
                </View>
                <View className="flex flex-row items-center justify-start">
                    <View className="w-8 h-8 flex items-start justify-center">
                        <FontAwesome5
                            name="dot-circle"
                            size={20}
                            color="#F73334"
                        />
                    </View>
                    <Text className="text-sm font-rregular text-gray-600">
                        {item?.radius} m
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default DangerZoneItem;
