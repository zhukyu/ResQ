import {
    View,
    Text,
    Image,
    TouchableOpacity,
    KeyboardAvoidingView,
    Keyboard,
    TouchableWithoutFeedback,
    Platform,
    TextInput,
    ScrollView,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import CustomTitleHeader from "../../components/CustomTitleHeader";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../lib/AxiosInstance";
import { emitWithToken, socket } from "../../lib/socketInstance";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useIsFocused } from "@react-navigation/native";

const ChatScreen = ({ navigation, route }) => {
    const { opponentId } = route.params;
    const { user } = useGlobalContext();
    const { t } = useTranslation();
    const [opponent, setOpponent] = useState(null);
    const headerHeight = useHeaderHeight();
    const inputRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [groupedMessages, setGroupedMessages] = useState([]);
    const [conversationId, setConversationId] = useState(null);
    const scrollViewRef = useRef();

    const isScreenFocused = useIsFocused();

    const fetchConversation = async () => {
        try {
            const response = await axiosInstance.get(
                `/conversation/${opponentId}`
            );
            const data = await response.data;
            if (data) {
                setOpponent(data?.opponent);
                setConversationId(data?._id);
                setMessages(data?.messages);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchConversation();
    }, [opponentId]);

    useEffect(() => {
        if (isScreenFocused && conversationId) {
            emitWithToken("markAsRead", {
                conversationId,
            });
        }
    }, [isScreenFocused, conversationId]);

    useEffect(() => {
        navigation.setOptions({
            title: "Chat",
            header: (props) => (
                <CustomTitleHeader
                    {...props}
                    backIconColor="#F73334"
                    headerTitle={HeaderTitle}
                    headerRight={HeaderRight}
                    shadow={true}
                />
            ),
        });
    }, [navigation, opponent]);

    useEffect(() => {
        const handlePrivateMessage = (data) => {
            if (!isScreenFocused) return;

            console.log("message received", user.id);
            const msg = data?.message;
            emitWithToken("markAsRead", {
                conversationId: data?.conversationId,
            });
            setConversationId(data?.conversationId);
            setMessages((prevMessages) => [...prevMessages, msg]);
        };

        if (isScreenFocused) {
            console.log("listening to private message");
            socket.on("privateMessage", handlePrivateMessage);
        }

        return () => {
            socket.off("privateMessage", handlePrivateMessage);
        };
    }, [isScreenFocused]);

    useEffect(() => {
        setGroupedMessages(groupMessagesBySender(messages));
    }, [messages]);

    const groupMessagesBySender = (messages) => {
        const groupedMessages = [];
        let currentGroup = [];

        messages.forEach((message) => {
            if (
                currentGroup.length === 0 ||
                message.sender === currentGroup[currentGroup.length - 1].sender
            ) {
                currentGroup.push(message);
            } else {
                groupedMessages.push(currentGroup);
                currentGroup = [message];
            }
        });

        if (currentGroup.length > 0) {
            groupedMessages.push(currentGroup);
        }

        return groupedMessages;
    };

    const sendMessage = async () => {
        const receiverId = opponentId;
        await emitWithToken("privateMessage", {
            receiver: receiverId,
            message,
        });
        setMessage("");
        Keyboard.dismiss();
    };

    const handleOptionPress = () => {
        console.log("Option Pressed");
    };

    const handleSendPress = () => {
        sendMessage(message);
    };

    const HeaderTitle = () => {
        return (
            <View className="-ml-4 flex flex-row items-center w-full">
                {opponent && opponent?.avatar ? (
                    <Image
                        source={{
                            uri: opponent?.avatar,
                        }}
                        className="w-9 h-9 rounded-full"
                    />
                ) : (
                    <View className="w-9 h-9 rounded-full bg-[#CCCCCC] flex items-center justify-center">
                        <FontAwesome name="user" size={22} color="white" />
                    </View>
                )}
                <View className="flex flex-col ml-3">
                    <Text className="text-sm font-semibold">
                        {opponent?.name}
                    </Text>
                    <Text className="text-xs text-gray-500">Online</Text>
                </View>
            </View>
        );
    };

    const HeaderRight = () => {
        return (
            <TouchableOpacity onPress={handleOptionPress}>
                <View className="flex flex-row items-center p-4">
                    <Feather name="more-vertical" size={24} color="#F73334" />
                </View>
            </TouchableOpacity>
        );
    };

    const MessagesRender = () => {
        return (
            <>
                {groupedMessages.length > 0 &&
                    groupedMessages.map((group, index) => (
                        <View
                            key={index}
                            className={`flex flex-col px-4 py-2 ${
                                group[0].sender === user?.id
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >
                            <View className="flex flex-row items-end">
                                {group[0].sender !== user?.id && (
                                    <View className="flex justify-end items-center mr-2 -ml-2 ">
                                        {opponent && opponent?.avatar ? (
                                            <Image
                                                source={{
                                                    uri: opponent?.avatar,
                                                }}
                                                className="w-9 h-9 rounded-full"
                                            />
                                        ) : (
                                            <View className="w-9 h-9 rounded-full bg-[#CCCCCC] flex items-center justify-center">
                                                <FontAwesome
                                                    name="user"
                                                    size={22}
                                                    color="white"
                                                />
                                            </View>
                                        )}
                                    </View>
                                )}
                                <View className="flex flex-col flex-grow">
                                    {group.map((item, itemIndex) => {
                                        const isFirst = itemIndex === 0;
                                        const isLast =
                                            itemIndex === group.length - 1;
                                        const senderIsUser =
                                            item.sender === user?.id;
                                        return (
                                            <View
                                                key={itemIndex}
                                                className={`flex flex-row ${
                                                    senderIsUser
                                                        ? "justify-end"
                                                        : "justify-start"
                                                }`}
                                            >
                                                <View
                                                    className={`rounded-2xl p-3 max-w-[70%] ${
                                                        senderIsUser
                                                            ? "bg-primary rounded-r-md"
                                                            : "bg-gray-200 rounded-l-md"
                                                    } ${
                                                        isFirst && !isLast // first message in group
                                                            ? senderIsUser
                                                                ? "rounded-tr-2xl"
                                                                : "rounded-tl-2xl"
                                                            : !isFirst && isLast // last message in group
                                                            ? senderIsUser
                                                                ? "rounded-br-2xl"
                                                                : "rounded-bl-2xl"
                                                            : isFirst && isLast // single message
                                                            ? "rounded-2xl"
                                                            : ""
                                                    } ${!isFirst && "mt-[2]"}`}
                                                >
                                                    <Text
                                                        className={`font-rregular ${
                                                            senderIsUser
                                                                ? "text-white"
                                                                : "text-gray-900"
                                                        }`}
                                                    >
                                                        {item.message}
                                                    </Text>
                                                </View>
                                            </View>
                                        );
                                    })}
                                </View>
                            </View>
                        </View>
                    ))}
            </>
        );
    };

    return (
        <KeyboardAvoidingView
            className="flex h-full bg-white w-full"
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={headerHeight}
            // contentContainerStyle={{ height }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <>
                    <ScrollView
                        className="flex-grow"
                        ref={scrollViewRef}
                        onContentSizeChange={() =>
                            scrollViewRef.current.scrollToEnd({
                                animated: true,
                            })
                        }
                    >
                        <MessagesRender />
                    </ScrollView>
                    <View className="flex justify-between p-2 bg-white flex-row">
                        <View
                            className="border rounded-full px-4 h-11 flex-1 bg-gray-50 border-gray-300 
                            flex flex-row items-center"
                        >
                            <TextInput
                                ref={inputRef}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                className="flex-1 text-base font-medium text-gray-900"
                                placeholder={t("chat placeholder")}
                                cursorColor={"#000"}
                                value={message}
                                onChangeText={(text) => setMessage(text)}
                            />
                        </View>
                        {isFocused && message.length > 0 && (
                            <TouchableOpacity onPress={handleSendPress}>
                                <View className="flex items-center justify-center p-2">
                                    <FontAwesome
                                        name="send"
                                        size={24}
                                        color="#F73334"
                                    />
                                </View>
                            </TouchableOpacity>
                        )}
                        <View className="flex items-center justify-center"></View>
                    </View>
                </>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default ChatScreen;
