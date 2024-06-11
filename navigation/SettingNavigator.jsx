import { View, Text } from "react-native";
import React from "react";
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import SelectLanguage from "../pages/setting/SelectLanguage";
import SettingScreen from "../pages/setting/SettingScreen";
import BackButtonHeader from "../components/BackButtonHeader";
import { useTranslation } from "react-i18next";

const SettingStack = createStackNavigator();

const SettingNavigator = () => {
    const { t } = useTranslation();
    return (
        <SettingStack.Navigator
            screenOptions={{
                headerShown: true,
                header: (props) => <BackButtonHeader {...props} />,
            }}
        >
            <SettingStack.Screen
                name="settingScreen"
                component={SettingScreen}
                options={{
                    title: t("settings"),
                    cardStyleInterpolator:
                        CardStyleInterpolators.forHorizontalIOS,
                }}
            />
            <SettingStack.Screen
                name="selectLanguage"
                component={SelectLanguage}
                options={{
                    title: t("select language"),
                    cardStyleInterpolator:
                        CardStyleInterpolators.forHorizontalIOS,
                }}
            />
        </SettingStack.Navigator>
    );
};

export default SettingNavigator;
