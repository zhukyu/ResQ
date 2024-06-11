import {
    View,
    Text,
    ScrollView,
    TouchableNativeFeedback,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";

const SettingScreen = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();
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

    useFocusEffect(
        useCallback(() => {
            loadLanguage();
        }, [])
    );

    const handleSelectLanguage = () => {
        navigation.navigate("selectLanguage");
    };

    return (
        <ScrollView className="flex-1">
            <TouchableOpacity
                onPress={handleSelectLanguage}
                activeOpacity={0.7}
            >
                <View className="flex">
                    <View className="flex flex-row items-center justify-between p-4 bg-white">
                        <View className="flex flex-row items-center justify-start">
                            <MaterialIcons
                                name="language"
                                size={22}
                                color="#1f2937"
                            />
                            <Text className="text-base font-rmedium text-gray-800 ml-1">
                                {t("language")}
                            </Text>
                        </View>

                        <Text className="text-base font-rmedium text-gray-500">
                            {language === "en" ? "English" : "Tiếng Việt"}
                        </Text>
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

export default SettingScreen;
