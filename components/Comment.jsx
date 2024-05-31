import { View, Text } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";

const Comment = () => {
    return (
        <View className="bg-white flex flex-col p-4">
            <Text className="text-sm font-semibold mb-2">Comments</Text>
            <View className="flex flex-row items-start mt-2 w-full">
                <View className="w-9 h-9 rounded-full bg-[#CCCCCC] flex items-center justify-center">
                    <FontAwesome name="user" size={22} color="white" />
                </View>
                <View className="flex flex-col ml-2 bg-gray-200 px-3 py-2 rounded-xl flex-1">
                    <Text className="text-sm font-semibold">John Doe</Text>
                    <Text className="text-sm mt-1">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Aenean euismod bibendum laoreet. Proin gravida dolor sit
                        amet lacus accumsan et viverra justo commodo.
                    </Text>
                </View>
            </View>
            <View className="flex flex-row items-start mt-2 w-full">
                <View className="w-9 h-9 rounded-full bg-[#CCCCCC] flex items-center justify-center">
                    <FontAwesome name="user" size={22} color="white" />
                </View>
                <View className="flex flex-col ml-2 bg-gray-200 px-3 py-2 rounded-xl flex-1">
                    <Text className="text-sm font-semibold">John Doe</Text>
                    <Text className="text-sm mt-1">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Aenean euismod bibendum laoreet. Proin gravida dolor sit
                        amet lacus accumsan et viverra justo commodo.
                    </Text>
                </View>
            </View>
            <View className="flex flex-row items-start mt-2 w-full">
                <View className="w-9 h-9 rounded-full bg-[#CCCCCC] flex items-center justify-center">
                    <FontAwesome name="user" size={22} color="white" />
                </View>
                <View className="flex flex-col ml-2 bg-gray-200 px-3 py-2 rounded-xl flex-1">
                    <Text className="text-sm font-semibold">John Doe</Text>
                    <Text className="text-sm mt-1">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Aenean euismod bibendum laoreet. Proin gravida dolor sit
                        amet lacus accumsan et viverra justo commodo.
                    </Text>
                </View>
            </View>
            <View className="flex flex-row items-start mt-2 w-full">
                <View className="w-9 h-9 rounded-full bg-[#CCCCCC] flex items-center justify-center">
                    <FontAwesome name="user" size={22} color="white" />
                </View>
                <View className="flex flex-col ml-2 bg-gray-200 px-3 py-2 rounded-xl flex-1">
                    <Text className="text-sm font-semibold">John Doe</Text>
                    <Text className="text-sm mt-1">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Aenean euismod bibendum laoreet. Proin gravida dolor sit
                        amet lacus accumsan et viverra justo commodo.
                    </Text>
                </View>
            </View>
            <View className="flex flex-row items-start mt-2 w-full">
                <View className="w-9 h-9 rounded-full bg-[#CCCCCC] flex items-center justify-center">
                    <FontAwesome name="user" size={22} color="white" />
                </View>
                <View className="flex flex-col ml-2 bg-gray-200 px-3 py-2 rounded-xl flex-1">
                    <Text className="text-sm font-semibold">John Doe</Text>
                    <Text className="text-sm mt-1">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Aenean euismod bibendum laoreet. Proin gravida dolor sit
                        amet lacus accumsan et viverra justo commodo.
                    </Text>
                </View>
            </View>
            <View className="flex flex-row items-start mt-2 w-full">
                <View className="w-9 h-9 rounded-full bg-[#CCCCCC] flex items-center justify-center">
                    <FontAwesome name="user" size={22} color="white" />
                </View>
                <View className="flex flex-col ml-2 bg-gray-200 px-3 py-2 rounded-xl flex-1">
                    <Text className="text-sm font-semibold">John Doe</Text>
                    <Text className="text-sm mt-1">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Aenean euismod bibendum laoreet. Proin gravida dolor sit
                        amet lacus accumsan et viverra justo commodo.
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default Comment;
