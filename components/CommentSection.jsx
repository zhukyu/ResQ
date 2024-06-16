import { View, Text } from "react-native";
import React, {useState, useEffect, memo} from "react";
import CommentSkeleton from "./CommentSkeleton";
import Comment from "./Comment";
import { socket } from "../lib/socketInstance";
import axiosInstance from "../lib/AxiosInstance";

const CommentSection = memo(({ requestId, setCommentCount }) => {
    const [comments, setComments] = useState([]);
    const [isLoadingComments, setIsLoadingComments] = useState(false);

    useEffect(() => {
        console.log("requestId", requestId);
    }, [requestId])

    const fetchComments = async () => {
        setIsLoadingComments(true);
        const response = await axiosInstance.get(
            `/requests/${requestId}/comments`
        );
        const result = await response.data;
        setComments(result);
        setIsLoadingComments(false);
    };

    useEffect(() => {
        fetchComments();

        socket.on("comment", (data) => {
            const { comment, commentCount } = data;
            console.log(data);
            setComments((prevData) => [comment, ...prevData]);
            if (setCommentCount) {
                setCommentCount(commentCount);
            }
        });

        return () => {
            socket.off("comment");
        };
    }, []);

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

export default CommentSection;
