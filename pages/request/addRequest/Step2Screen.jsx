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
    Dimensions,
    ScrollView,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Header } from "@react-navigation/elements";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Feather, Ionicons } from "@expo/vector-icons";
import CustomButton from "../../../components/CustomButton";
import NextButtonHeader from "../../../components/NextButtonHeader";
import { useHeaderHeight } from "@react-navigation/elements";
import { useTranslation } from "react-i18next";
import * as ImagePicker from "expo-image-picker";
import { images } from "../../../constants";
import ImageCollage from "../../../components/ImageCollage";

const Step2Screen = () => {
    const { requestTypeId } = useRoute().params;

    const navigation = useNavigation();
    const { t } = useTranslation();
    const [canProceed, setCanProceed] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [step2Data, setStep2Data] = useState({
        requestTypeId: requestTypeId,
        content: "",
        media: [],
    });
    const headerHeight = useHeaderHeight();
    const { height } = Dimensions.get("window");
    const [isLengthExceeded, setIsLengthExceeded] = useState(false);
    const inputRef = useRef(null);

    const handleFocus = () => {
        inputRef.current.focus();
    };

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
        if (step2Data.content.length > 9) {
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

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            // allowsEditing: true,
            quality: 1,
            allowsMultipleSelection: true,
        });

        if (!result.canceled) {
            imagesList = result.assets;
            image_uris = imagesList.map((image) => image.uri);
            setSelectedImages([...selectedImages, ...imagesList]);
        }
    };

    const handleDeleteImage = (index) => {
        let newImages = selectedImages.filter((_, i) => i !== index);
        setSelectedImages(newImages);
    };

    useEffect(() => {
        setStep2Data({ ...step2Data, media: selectedImages });
    }, [selectedImages]);

    return (
        <KeyboardAvoidingView
            className="flex h-full"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={headerHeight}
            contentContainerStyle={{ height }}
        >
            <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}
                className="h-full"
            >
                <ScrollView>
                    <View className="h-full justify-between flex">
                        <View className="flex-1">
                            <TextInput
                                className={`font-medium text-gray-900 p-5 ${
                                    isLengthExceeded ? "text-base" : "text-xl"
                                } ${
                                    selectedImages.length == 0 ? "flex-1" : ""
                                }`}
                                cursorColor={"#000"}
                                placeholder="What is your request?"
                                value={step2Data.content}
                                multiline={true}
                                numberOfLines={
                                    selectedImages.length == 0 ? 10 : 5
                                }
                                style={{ textAlignVertical: "top" }}
                                onChangeText={(text) => handleTextChange(text)}
                                ref={inputRef}
                            />
                            {selectedImages.length > 0 && (
                                <ImageCollage
                                    images={selectedImages.map(
                                        (image) => image.uri
                                    )}
                                    handleDeleteImage={handleDeleteImage}
                                />
                            )}
                        </View>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
            <View className="flex flex-row items-center justify-start px-5 py-3">
                <TouchableOpacity
                    onPress={pickImage}
                    className="flex flex-row items-center"
                >
                    <Feather name="image" size={24} color="gray" />
                </TouchableOpacity>
                <TouchableOpacity
                    // onPress={}
                    className="flex flex-row items-center ml-3"
                >
                    <Feather name="camera" size={24} color="gray" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default Step2Screen;
