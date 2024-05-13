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
    ScrollView,
    ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Header } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { Feather, Ionicons } from "@expo/vector-icons";
import CustomButton from "../../../components/CustomButton";
import NextButtonHeader from "../../../components/NextButtonHeader";
import { useHeaderHeight } from "@react-navigation/elements";
import RequestTypeCard from "../../../components/RequestTypeCard";
import BackButtonHeader from "../../../components/BackButtonHeader";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../../lib/AxiosInstance";

const Step1Screen = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const [requestTypes, setRequestTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        axiosInstance
            .get("/type")
            .then((response) => {
                setRequestTypes(response.data);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        navigation.setOptions({
            title: "",
            header: (props) => <BackButtonHeader {...props} close={true} />,
        });
    }, [navigation]);

    const handlePress = (RequestTypeId) => {
        navigation.navigate("step2", { requestTypeId: RequestTypeId });
    };

    return isLoading ? (
        <View className="absolute items-center justify-center flex h-full w-screen z-[100]">
            <View className="absolute justify-center items-center z-50 w-full h-full">
                <ActivityIndicator size="large" color="#F73334" />
            </View>
        </View>
    ) : (
        <View className="flex-1">
            <Text className="text-2xl font-extrabold mb-4 px-4">
                {t("choose request type")}
            </Text>
            <ScrollView
                className=""
                contentContainerStyle={{
                    padding: 16,
                }}
            >
                {requestTypes &&
                    requestTypes.map((requestType, index) => (
                        <RequestTypeCard
                            key={index}
                            name={requestType.name}
                            onPress={() => handlePress(requestType.id)}
                        />
                    ))}
            </ScrollView>
        </View>
    );
};

export default Step1Screen;
