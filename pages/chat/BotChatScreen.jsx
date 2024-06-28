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
import { Feather, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../lib/AxiosInstance";
import { emitWithToken, socket } from "../../lib/socketInstance";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useIsFocused } from "@react-navigation/native";
import { formatTime } from "../../lib/helpers";
import axios from "axios";
import { TypingAnimation } from "react-native-typing-animation";

const BotChatScreen = ({ navigation, route }) => {
    const { opponentId } = route.params || {};
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
    const [isTyping, setIsTyping] = useState(false);
    const scrollViewRef = useRef();

    const isScreenFocused = useIsFocused();

    const fetchConversation = async () => {
        try {
            const response = await axiosInstance.get(`/conversation/chatbot`);
            const data = await response.data;
            if (data) {
                setConversationId(data?._id);
                setMessages(data?.messages);
            } else {
                setMessages([
                    {
                        sender: "bot",
                        text: t("chatbot greeting"),
                        timestamp: new Date(),
                    },
                ]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchConversation();
    }, [isScreenFocused]);

    useEffect(() => {
        navigation.setOptions({
            title: "BotChat",
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
    }, [navigation]);

    useEffect(() => {
        setGroupedMessages(groupMessagesBySender(messages));
    }, [messages]);

    const groupMessagesBySender = (messages, timeGapInMinutes = 5) => {
        const groupedMessages = [];
        let currentGroup = [];
        let lastTimestamp = null;

        messages.forEach((message) => {
            const messageTimestamp = new Date(message.timestamp);
            const isNewSender =
                currentGroup.length === 0 ||
                message.sender !== currentGroup[currentGroup.length - 1].sender;
            const isNewGroup =
                lastTimestamp &&
                (messageTimestamp - lastTimestamp) / 60000 > timeGapInMinutes;

            if (isNewSender || isNewGroup) {
                if (currentGroup.length > 0) {
                    groupedMessages.push({
                        type: "group",
                        messages: currentGroup,
                    });
                }
                if (isNewGroup) {
                    groupedMessages.push({
                        type: "timestamp",
                        timestamp: message.timestamp,
                    });
                }
                currentGroup = [message];
            } else {
                currentGroup.push(message);
            }
            lastTimestamp = messageTimestamp;
        });

        if (currentGroup.length > 0) {
            groupedMessages.push({ type: "group", messages: currentGroup });
        }

        return groupedMessages;
    };

    const createChatbotConversation = async (sender, message) => {
        try {
            const response = await axiosInstance.post("/conversation/chatbot", {
                sender: sender,
                text: message,
            });
            const data = await response.data;
            return data;
        } catch (error) {
            console.error("Error creating chatbot conversation", error);
        }
    };

    const getMessage = async (query) => {
        try {
            const response = await axios.post(
                `https://chatbot.vantanhly.io.vn/api/conversations`,
                {
                    query: query,
                }
            );
            if (response.status === 200) {
                if (response.data.answer.answer) {
                    await createChatbotConversation(
                        "ai",
                        response.data.answer.answer
                    );
                }
                return response.data.answer.answer;
            }
        } catch (error) {
            console.error("Error getting messages", error);
        }
    };

    const sendMessage = async () => {
        const fetchChatbotResponse = async () => {
            try {
                setIsTyping(true);
                const response = await getMessage(message);
                if (response) {
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        {
                            sender: "ai",
                            text: response,
                        },
                    ]);
                }
                setIsTyping(false);
            } catch (error) {
                console.error("Error sending message", error);
            }
        };

        const createUserConversation = async (sender) => {
            try {
                const response = await createChatbotConversation(
                    sender,
                    message
                );
                if (response) {
                    setMessages([
                        ...messages,
                        {
                            sender: "user",
                            text: message,
                        },
                    ]);
                    setMessage("");
                    fetchChatbotResponse();
                }
            } catch (error) {
                console.error("Error creating user conversation", error);
            }
        };

        if (message) {
            createUserConversation("user");
        }
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
                <View className="w-9 h-9 rounded-full bg-[#CCCCCC] flex items-center justify-center">
                    <FontAwesome5 name="robot" size={22} color="white" />
                </View>
                <View className="flex flex-col ml-3">
                    <Text className="text-sm font-semibold">{t("bot")}</Text>
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
                    groupedMessages.map((group, index) =>
                        group.type === "timestamp" ? (
                            <View
                                key={index}
                                className="flex items-center my-2"
                            >
                                <Text className="text-gray-500 font-rregular text-sm">
                                    {formatTime(group.timestamp, "format")}
                                </Text>
                            </View>
                        ) : (
                            <View
                                key={index}
                                className={`flex flex-col px-4 py-2 ${
                                    group.messages[0].sender === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                }`}
                            >
                                <View className="flex flex-row items-end">
                                    {group.messages[0].sender !== "user" && (
                                        <View className="flex justify-end items-center mr-2 -ml-2 ">
                                            <View className="w-9 h-9 rounded-full bg-[#CCCCCC] flex items-center justify-center">
                                                <FontAwesome5
                                                    name="robot"
                                                    size={22}
                                                    color="white"
                                                />
                                            </View>
                                        </View>
                                    )}
                                    <View className="flex flex-col flex-grow">
                                        {group.messages.map(
                                            (item, itemIndex) => {
                                                const isFirst = itemIndex === 0;
                                                const isLast =
                                                    itemIndex ===
                                                    group.messages.length - 1;
                                                const senderIsUser =
                                                    item.sender === "user";
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
                                                                isFirst &&
                                                                !isLast // first message in group
                                                                    ? senderIsUser
                                                                        ? "rounded-tr-2xl"
                                                                        : "rounded-tl-2xl"
                                                                    : !isFirst &&
                                                                      isLast // last message in group
                                                                    ? senderIsUser
                                                                        ? "rounded-br-2xl"
                                                                        : "rounded-bl-2xl"
                                                                    : isFirst &&
                                                                      isLast // single message
                                                                    ? "rounded-2xl"
                                                                    : ""
                                                            } ${
                                                                !isFirst &&
                                                                "mt-[2]"
                                                            }`}
                                                        >
                                                            <Text
                                                                className={`font-rregular ${
                                                                    senderIsUser
                                                                        ? "text-white"
                                                                        : "text-gray-900"
                                                                }`}
                                                            >
                                                                {convertTextToJSX(
                                                                    item.text
                                                                )}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                );
                                            }
                                        )}
                                    </View>
                                </View>
                            </View>
                        )
                    )}
            </>
        );
    };

    const convertTextToJSX = (text) => {
        const lines = text.split("\n");
        return lines.map((line, index) => {
            const parts = line.split(/(\*\*.*?\*\*)/g).filter(Boolean);
            return (
                <Text key={index}>
                    {parts.map((part, i) => {
                        if (part.startsWith("**") && part.endsWith("**")) {
                            return (
                                <Text key={i} style={{ fontWeight: "bold" }}>
                                    {part.slice(2, -2)}
                                </Text>
                            );
                        }
                        return part;
                    })}
                    {/* Add a newline after each line except the last one */}
                    {index < lines.length - 1 ? "\n" : ""}
                </Text>
            );
        });
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
                        {isTyping && (
                            <View className="flex flex-row items-center justify-start px-2 py-2">
                                <View className="w-9 h-9 rounded-full bg-[#CCCCCC] flex items-center justify-center">
                                    <FontAwesome5
                                        name="robot"
                                        size={22}
                                        color="white"
                                    />
                                </View>
                                <View className="flex flex-col ml-2 ">
                                    <View className="flex flex-row items-center h-10 w-12 justify-start bg-gray-200 rounded-2xl">
                                        <View className="ml-2 mb-3">
                                            <TypingAnimation
                                                dotColor="gray"
                                                dotMargin={5}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}
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

export default BotChatScreen;
