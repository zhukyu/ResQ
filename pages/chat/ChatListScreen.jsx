import { View, Text, TextInput, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import SearchBox from "../../components/SearchBox";
import ChatListCard from "../../components/ChatListCard";
import axiosInstance from "../../lib/AxiosInstance";
import { socket } from "../../lib/socketInstance";
import { useIsFocused } from "@react-navigation/native";

const ChatListScreen = ({ navigation }) => {
    const [conversations, setConversations] = useState([]);
    const isFocused = useIsFocused();

    const fetchConversations = async () => {
        const response = await axiosInstance.get(`/conversation`);
        const data = await response.data;
        if (data) {
            setConversations(data);
        }
    };

    // useEffect(() => {
    //     fetchConversations();
    // }, []);

    useEffect(() => {
        if (isFocused) {
            fetchConversations();

            socket.on("newMessage", (data) => {
                console.log("message received in chat list");
                fetchConversations();
            });
        }

        return () => {
            socket.off("newMessage");
        };
    }, [isFocused]);

    useEffect(() => {}, [conversations]);

    const handleSearchBoxPress = () => {
        navigation.push(`stack`, {
            screen: `chatSearch`,
        });
    };

    return (
        <View className="h-full bg-white">
            {/* <View className="mb-4">
                <SearchBox onPress={handleSearchBoxPress} />
            </View> */}
            <FlatList
                ListHeaderComponent={
                    <View className="p-4 pt-2">
                        <SearchBox onPress={handleSearchBoxPress} />
                    </View>
                }
                data={conversations}
                renderItem={({ item }) => <ChatListCard item={item} />}
                keyExtractor={(item) => item?._id}
                refreshing={false}
                onRefresh={() => {}}
            />
        </View>
    );
};

export default ChatListScreen;
