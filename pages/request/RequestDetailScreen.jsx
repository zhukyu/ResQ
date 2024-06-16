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
import CommentInput from "../../components/CommentInput";
import CommentSection from "../../components/CommentSection";

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

    const fetchData = async () => {
        const response = await axiosInstance.get(`/requests/${id}`);
        const result = await response.data;
        setRequest(result);
        setVoteCount(result.voteCount);
        setCommentCount(result.commentCount);
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
    }, []);

    useEffect(() => {
        emitWithToken("joinRequestDetailRoom", { requestId: id });

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
                        <CommentSection requestId={id} setCommentCount={setCommentCount}/>
                    </ScrollView>
                    <CommentInput requestId={id} />
                </>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default RequestDetailScreen;
