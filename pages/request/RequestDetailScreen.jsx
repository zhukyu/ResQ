import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
    TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../../lib/AxiosInstance";
import { useHeaderHeight } from "@react-navigation/elements";
import Post from "../../components/Post";
import Comment from "../../components/Comment";
import { FontAwesome } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Facebook } from "react-content-loader/native";
import LoadingSkeleton from "../../components/LoadingSkeleton";

const RequestDetailScreen = ({ route }) => {
    const { id } = route.params;
    const { t } = useTranslation();
    const [request, setRequest] = useState(null);
    const headerHeight = useHeaderHeight();
    const { height } = Dimensions.get("window");
    const inputRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);

    const fetchData = async () => {
        const response = await axiosInstance.get(`/requests/${id}`);
        const result = await response.data;
        console.log(result);
        setRequest(result);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <KeyboardAvoidingView
            className="flex h-full"
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={headerHeight}
            // contentContainerStyle={{ height }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <>
                    <ScrollView className="">
                        {request ? (
                            <Post item={request} isFullView={true} />
                            // null
                        ) : (
                            <LoadingSkeleton />
                        )}
                        <View className="mt-1">
                            <Comment />
                        </View>
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
                                placeholder="Type your comment here"
                                cursorColor={"#000"}
                            />
                        </View>
                        {isFocused && (
                            <TouchableOpacity>
                                <View className="flex items-center justify-center p-2">
                                    <FontAwesome
                                        name="send"
                                        size={24}
                                        color="gray"
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

export default RequestDetailScreen;
