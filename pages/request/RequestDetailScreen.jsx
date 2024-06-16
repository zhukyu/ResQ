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
    FlatList,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState, memo } from "react";
import axiosInstance from "../../lib/AxiosInstance";
import { useHeaderHeight } from "@react-navigation/elements";
import Post from "../../components/Post";
import Comment from "../../components/Comment";
import { FontAwesome } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Facebook } from "react-content-loader/native";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import { emitWithToken, socket } from "../../lib/socketInstance";
import CommentSkeleton from "../../components/CommentSkeleton";
import { useFocusEffect } from "@react-navigation/native";

const CommentInput = ({ onSend }) => {
    const { t } = useTranslation();
    const inputRef = useRef(null);
    const [comment, setComment] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const handleSendPress = () => {
        onSend(comment);
        setComment("");
        Keyboard.dismiss();
    };

    return (
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
                    value={comment}
                    onChangeText={(text) => setComment(text)}
                />
            </View>
            {isFocused && comment.length > 0 && (
                <TouchableOpacity onPress={handleSendPress}>
                    <View className="flex items-center justify-center p-2">
                        <FontAwesome name="send" size={24} color="#F73334" />
                    </View>
                </TouchableOpacity>
            )}
            <View className="flex items-center justify-center"></View>
        </View>
    );
};

const CommentSection = memo(({ comments, isLoadingComments }) => {
    return (
        <View className="mt-1 bg-white">
            <View>
                {isLoadingComments ? (
                    <CommentSkeleton />
                ) : (
                    <Comment comments={comments} />
                )}
            </View>
        </View>
    );
});

const RequestDetailScreen = ({ route }) => {
    const { id, focusTextInput } = route.params;
    const { t } = useTranslation();
    const [request, setRequest] = useState(null);
    const headerHeight = useHeaderHeight();
    const { height } = Dimensions.get("window");
    const inputRef = useRef(null);
    const [comments, setComments] = useState([]);
    const [commentCount, setCommentCount] = useState(0);
    const [voteCount, setVoteCount] = useState(0);
    const [isLoadingComments, setIsLoadingComments] = useState(false);

    const fetchData = async () => {
        const response = await axiosInstance.get(`/requests/${id}`);
        const result = await response.data;
        setRequest(result);
        setVoteCount(result.voteCount);
        setCommentCount(result.commentCount);
    };

    const fetchComments = async () => {
        setIsLoadingComments(true);
        const response = await axiosInstance.get(`/requests/${id}/comments`);
        const result = await response.data;
        setComments(result);
        setIsLoadingComments(false);
    };

    const handleSendPress = (comment) => {
        emitWithToken("comment", { requestId: id, content: comment });
    };

    const openKeyboard = () => {
        setTimeout(() => {
            inputRef.current?.blur();
            inputRef.current?.focus();
        }, 100);
    };

    useFocusEffect(
        useCallback(() => {
            if (inputRef.current && focusTextInput) {
                openKeyboard();
            }
        }, [])
    );

    useEffect(() => {
        fetchData();
        fetchComments();
    }, []);

    useEffect(() => {
        emitWithToken("joinRequestDetailRoom", { requestId: id });
        socket.on("comment", (data) => {
            const { comment, commentCount } = data;
            console.log(data);
            setComments((prevData) => [comment, ...prevData]);
            setCommentCount(commentCount);
        });

        socket.on("newVoteUpdate", (data) => {
            const { voteCount } = data;
            setVoteCount(voteCount);
        });

        return () => {
            socket.off("comment");
            socket.off("newVoteUpdate");
            emitWithToken("leaveRequestDetailRoom", { requestId: id });
        };
    }, []);

    useEffect(() => {
        console.log("commentCount", commentCount);
    }, [commentCount]);

    const renderPost = useCallback(() => {
        if (request) {
            return (
                <Post
                    item={request}
                    isFullView={true}
                    initVoteCount={voteCount}
                    commentCount={commentCount}
                    onCommentPress={() => openKeyboard()}
                    initVoteType={request.votes?.[0]?.voteType}
                />
            );
        } else {
            return <LoadingSkeleton />;
        }
    }, [request, voteCount, commentCount]);

    return (
        <KeyboardAvoidingView
            className="flex h-full"
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={headerHeight}
            // contentContainerStyle={{ height }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <>
                    <ScrollView className="flex">
                        {renderPost()}
                        <CommentSection
                            comments={comments}
                            isLoadingComments={isLoadingComments}
                        />
                    </ScrollView>
                    <CommentInput onSend={handleSendPress} />
                </>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default RequestDetailScreen;
