import {
    View,
    Text,
    Image,
    TouchableNativeFeedback,
    TouchableOpacity,
} from "react-native";
import React, { memo, useState } from "react";
import {
    AntDesign,
    EvilIcons,
    Feather,
    FontAwesome,
    FontAwesome5,
    FontAwesome6,
    MaterialIcons,
} from "@expo/vector-icons";
import { icons } from "../constants";
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import ImageCollage from "./ImageCollage";
import { useGlobalContext } from "../context/GlobalProvider";
import { useTranslation } from "react-i18next";

const Post = ({ item }) => {
    const { user } = useGlobalContext();
    const navigation = useNavigation();
    const media = item.requestMedia;
    const { t } = useTranslation();

    const handlePostPress = () => {
        navigation.navigate(`stack`, {
            screen: `requestDetail`,
            params: { id: item.id },
        });
        // router.push(`../request/requestDetail`, { id: id })
    };

    const handleLocationPress = () => {
        navigation.navigate("map", { item: item });
    };

    return (
        <TouchableNativeFeedback delayPressIn={100} onPress={handlePostPress}>
            <View
                className={`bg-white w-full py-3 mb-1 flex flex-col ${
                    item?.isEmergency ? "border border-primary" : null
                }`}
            >
                <View className="flex flex-row justify-center w-full px-4">
                    {user && user?.avatar ? (
                        <Image
                            source={{
                                uri: user?.avatar,
                            }}
                            className="w-9 h-9 rounded-full"
                        />
                    ) : (
                        <View className="w-9 h-9 rounded-full bg-[#CCCCCC] flex items-center justify-center">
                            <FontAwesome name="user" size={22} color="white" />
                        </View>
                    )}
                    <View className="flex flex-col ml-2 flex-grow">
                        <Text className="text-sm font-semibold">
                            {user?.name}
                        </Text>
                        <Text className="text-xs text-gray-500">
                            10km · 18:30
                        </Text>
                    </View>
                    <View className="flex flex-row justify-center items-center gap-2">
                        <FontAwesome6
                            name="message"
                            size={20}
                            color="#F73334"
                        />
                        <TouchableOpacity onPress={handleLocationPress}>
                            <Feather name="map-pin" size={20} color="#F73334" />
                        </TouchableOpacity>
                    </View>
                </View>
                {/* {item?.isEmergency ? (
                    <View className="flex flex-row justify-start items-center w-full mt-3 px-4">
                        <Text className="text-sm font-semibold text-primary">
                            {t("EMERGENCY")}
                        </Text>
                    </View>
                ) : null} */}
                <View className="flex flex-col justify-center items-center w-full mt-3 px-4">
                    {item?.isEmergency ? (
                        <View className="flex justify-start items-center w-full flex-row mb-1">
                            <Text className="text-sm font-semibold text-primary">
                                ⚠️ {t("EMERGENCY")} ⚠️
                            </Text>
                        </View>
                    ) : null}
                    <Text
                        className="text-base text-gray-700 w-full"
                        numberOfLines={3}
                    >
                        {item.content}
                    </Text>
                </View>
                {media && media.length > 0 ? (
                    <View className="mt-2" pointerEvents="none">
                        <ImageCollage
                            images={media.map((image) => image.url)}
                        />
                    </View>
                ) : null}

                <View className="flex flex-row justify-between items-center w-full mt-3 px-4">
                    <View
                        className={`flex flex-row justify-center items-center border-[1px] border-gray-300 rounded-2xl px-2 py-1 ${
                            item?.isEmergency
                                ? "border-gray-300"
                                : "border-gray-300"
                        }`}
                    >
                        <Image
                            source={icons.upOutlined}
                            className="w-5 h-5 mr-3"
                            tintColor={"gray"}
                        />
                        <Text className="text-sm font-medium text-gray-500 mr-2">
                            12
                        </Text>
                        <Image
                            source={icons.line}
                            className="w-[1px] h-4 mr-2"
                            tintColor={"#DDDDDD"}
                        />
                        <Image
                            source={icons.downOutlined}
                            className="w-5 h-5"
                            tintColor={"gray"}
                        />
                    </View>

                    <View
                        className={`flex flex-row justify-center items-center border-[1px]  rounded-2xl px-2 py-1 ${
                            item?.isEmergency
                                ? "border-gray-300"
                                : "border-gray-300"
                        }`}
                    >
                        <View className="mr-1 w-5 h-5">
                            <FontAwesome
                                name="commenting-o"
                                size={18}
                                color="gray"
                            />
                        </View>
                        <Text className="text-sm font-medium text-gray-500 mr-2">
                            12 comments
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableNativeFeedback>
    );
};

export default memo(Post);
