import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
    CardStyleInterpolators,
    createStackNavigator,
} from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import RequestScreen from "../pages/request/RequestScreen";
import NotificationScreen from "../pages/notification/NotificationScreen";
import UserProfileScreen from "../pages/user/UserProfileScreen";
import CustomDrawerContent from "../components/CustomDrawerContent";
import CustomHeader from "../components/Header";
import SettingScreen from "../pages/setting/SettingScreen";
import BackButtonHeader from "../components/BackButtonHeader";
import { useTranslation } from "react-i18next";
import MapScreen from "../pages/map/MapScreen";
import ChatListScreen from "../pages/chat/ChatListScreen";
import { icons } from "../constants";
import ButtonNativeFeedback from "../components/ButtonNativeFeedback";
import AuthNavigator from "./AuthNavigator";
import DrawerNavigator from "./DrawerNavigator";
import SplashScreen from "../pages/splash/SplashScreen";
import StackNavigator from "./StackNavigator";

const AppStack = createStackNavigator();

const AppNavigator = () => {
    return (
        <AppStack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <AppStack.Screen name="splash" component={SplashScreen} />
            <AppStack.Screen name="auth" component={AuthNavigator} />
            <AppStack.Screen name="drawer" component={DrawerNavigator} />
            <AppStack.Screen
                name="stack"
                component={StackNavigator}
                options={{
                    cardStyleInterpolator:
                        CardStyleInterpolators.forFadeFromBottomAndroid,
                }}
            />
        </AppStack.Navigator>
    );
};

export default AppNavigator;
