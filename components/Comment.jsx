import { View, Text } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { formatTime } from "../lib/helpers";

const Comment = ({ comments }) => {
    const renderComments = ({ comment }) => {
        const user = comment.user;
        return (
            <View className="flex flex-row items-start mt-2 w-full">
                <View className="w-9 h-9 rounded-full bg-[#CCCCCC] flex items-center justify-center">
                    <FontAwesome name="user" size={22} color="white" />
                </View>
                <View className="flex flex-col ml-2 bg-gray-200 px-3 py-2 rounded-xl max-w-[90%]">
                    <View className="flex flex-row items-center justify-start">
                        <Text className="text-sm font-semibold max-w-[80%]">
                            {user?.name}
                        </Text>
                        <Text className="text-xs text-gray-400 font-normal ml-2">
                            {formatTime(comment?.updatedAt)}
                        </Text>
                    </View>
                    <Text className="text-sm mt-1">{comment?.content}</Text>
                </View>
            </View>
        );
    };

    return (
        <View className="bg-white flex flex-col p-4">
            <Text className="text-sm font-semibold mb-2">Comments</Text>
            {comments.map((comment, index) => (
                <View key={index}>{renderComments({ comment })}</View>
            ))}
        </View>
    );
};

export default Comment;
