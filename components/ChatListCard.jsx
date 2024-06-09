import { View, Text, Image, TouchableNativeFeedback } from "react-native";
import React, { useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { formatTime } from "../lib/helpers";
import { useTranslation } from "react-i18next";

const ChatListCard = ({ item }) => {
    const opponent = item?.opponent;
    const lastMessage = item?.lastMessage;
    const navigation = useNavigation();
    const { t } = useTranslation();

    useEffect(() => {}, [opponent]);

    const handlePress = () => {
        navigation.navigate(`stack`, {
            screen: `chat`,
            params: {
                opponentId: opponent?.id,
            },
        });
    };

    return (
        <TouchableNativeFeedback onPress={handlePress} className="">
            <View className="flex w-full flex-row px-4 py-2 items-center">
                {opponent && opponent?.avatar ? (
                    <Image
                        source={{
                            uri: opponent?.avatar,
                        }}
                        className="w-14 h-14 rounded-full"
                    />
                ) : (
                    <View className="w-14 h-14 rounded-full bg-[#CCCCCC] flex items-center justify-center">
                        <FontAwesome name="user" size={30} color="white" />
                    </View>
                )}
                <View className="flex flex-col ml-3 flex-grow">
                    <View className="flex flex-row items-center justify-between">
                        <Text
                            className="text-base font-rbold text-gray-800"
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {opponent?.name}
                        </Text>
                        {item?.unreadCount > 0 && (
                            <View className="w-5 h-5 bg-primary rounded-full flex justify-center items-center">
                                <Text className="text-white font-medium text-sm">
                                    {item?.unreadCount}
                                </Text>
                            </View>
                        )}
                    </View>
                    <View className="flex flex-row items-center justify-start">
                        <Text
                            className="text-sm font-normal text-gray-500  max-w-[78%]"
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {lastMessage?.sender !== opponent?.id
                                ? `${t("you")}: `
                                : ""}
                            {lastMessage?.message}
                        </Text>
                        <Text className="text-sm font-rregular text-gray-500 mx-1">
                            ·
                        </Text>
                        <Text className="text-sm font-rregular text-gray-500">
                            {formatTime(lastMessage?.timestamp, "format")}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableNativeFeedback>
    );
};

export default ChatListCard;
