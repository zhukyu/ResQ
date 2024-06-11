import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Checkbox } from "react-native-paper";
import { changeLanguage } from "../../lang/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import icons from "../../constants/icons";

const SelectLanguage = () => {
    const { t } = useTranslation();
    const [language, setLanguage] = useState("en");

    const loadLanguage = async () => {
        try {
            const savedLanguage = await AsyncStorage.getItem("language");
            setLanguage(savedLanguage);
        } catch (e) {
            console.error("Failed to load the language from AsyncStorage", e);
            setLanguage("en");
        }
    };

    useEffect(() => {
        loadLanguage();
    }, []);

    const handleSelectLanguage = (language) => {
        const status = changeLanguage(language);
        if (status) {
            setLanguage(language);
        }
    };

    return (
        <ScrollView className="flex-1">
            <TouchableOpacity
                onPress={() => handleSelectLanguage("en")}
                activeOpacity={0.7}
            >
                <View className="flex">
                    <View className="flex flex-row items-center justify-between p-4 bg-white">
                        <View className="flex flex-row items-center justify-start">
                            <Image
                                source={icons.english}
                                style={{ width: 24, height: 24 }}
                            />
                            <Text className="text-base font-rmedium text-gray-800 ml-2">
                                English
                            </Text>
                        </View>
                        <Checkbox
                            status={language === "en" ? "checked" : "unchecked"}
                        />
                    </View>
                    <View
                        style={{
                            borderBottomColor: "#d3d3d3",
                            borderBottomWidth: StyleSheet.hairlineWidth,
                            marginHorizontal: 16,
                        }}
                    />
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => handleSelectLanguage("vi")}
                activeOpacity={0.7}
            >
                <View className="flex">
                    <View className="flex flex-row items-center justify-between p-4 bg-white">
                        <View className="flex flex-row items-center justify-start">
                            <Image
                                source={icons.vietnamese}
                                style={{ width: 24, height: 24 }}
                            />
                            <Text className="text-base font-rmedium text-gray-800 ml-2">
                                Tiếng Việt
                            </Text>
                        </View>
                        <Checkbox
                            status={language === "vi" ? "checked" : "unchecked"}
                        />
                    </View>
                    <View
                        style={{
                            borderBottomColor: "#d3d3d3",
                            borderBottomWidth: StyleSheet.hairlineWidth,
                            marginHorizontal: 16,
                        }}
                    />
                </View>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default SelectLanguage;
