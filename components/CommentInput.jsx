import { View, Text, TouchableOpacity, TextInput, Keyboard } from "react-native";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesome } from "@expo/vector-icons";
import { emitWithToken } from "../lib/socketInstance";

const CommentInput = ({ requestId }) => {
    const { t } = useTranslation();
    const inputRef = useRef(null);
    const [comment, setComment] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const send = (comment) => {
        emitWithToken("comment", { requestId: requestId, content: comment });
    };

    const handleSendPress = () => {
        send(comment);
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

export default CommentInput;
