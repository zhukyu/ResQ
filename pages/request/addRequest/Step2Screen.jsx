import {
    View,
    Text,
    Button,
    TouchableOpacity,
    KeyboardAvoidingView,
    TextInput,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    Animated,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Header } from "@react-navigation/elements";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Feather, Ionicons } from "@expo/vector-icons";
import CustomButton from "../../../components/CustomButton";
import NextButtonHeader from "../../../components/NextButtonHeader";
import { useHeaderHeight } from "@react-navigation/elements";
import { useTranslation } from "react-i18next";

const Step2Screen = () => {
    const { requestTypeId } = useRoute().params;

    const navigation = useNavigation();
    const { t } = useTranslation();
    const [canProceed, setCanProceed] = useState(false);
    const [step2Data, setStep2Data] = useState({
        requestTypeId: requestTypeId,        
        content: "",
        media: [],
    });
    const headerHeight = useHeaderHeight();
    const [isLengthExceeded, setIsLengthExceeded] = useState(false);

    useEffect(() => {
        console.log(requestTypeId);
    }, [requestTypeId]);

    useEffect(() => {
        navigation.setOptions({
            title: "Step 2",
            header: (props) => (
                <NextButtonHeader
                    canProceed={canProceed}
                    next="step3"
                    params={{ step2Data }}
                    {...props}
                />
            ),
        });
    }, [navigation, canProceed, step2Data]);

    useEffect(() => {
        if (step2Data.content.length > 0) {
            setCanProceed(true);
        } else {
            setCanProceed(false);
        }
    }, [step2Data]);

    const handleTextChange = (text) => {
        setStep2Data({ ...step2Data, content: text });
        const TEXT_LENGTH_THRESHOLD = 100;

        if (text.length >= TEXT_LENGTH_THRESHOLD) {
            setIsLengthExceeded(true);
        } else {
            setIsLengthExceeded(false);
        }
    };

    return (
        <KeyboardAvoidingView
            className="flex p-5"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={headerHeight}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Animated.View className="h-full justify-between flex">
                    <TextInput
                        className={`font-medium text-gray-900 flex-1 ${
                            isLengthExceeded ? "text-base" : "text-xl"
                        }`}
                        cursorColor={"#000"}
                        placeholder="What is your request?"
                        value={step2Data.content}
                        multiline={true}
                        numberOfLines={10}
                        style={{ textAlignVertical: "top" }}
                        onChangeText={(text) => handleTextChange(text)}
                    />
                    <Feather name="image" size={24} color="gray" />
                </Animated.View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default Step2Screen;
