import { View, Text } from "react-native";
import React from "react";
import RequestDetailScreen from "../pages/request/RequestDetailScreen";
import {
    CardStyleInterpolators,
    createStackNavigator,
} from "@react-navigation/stack";
import BackButtonHeader from "../components/BackButtonHeader";
import AddRequestScreen from "../pages/request/AddRequestScreen";
import AddRequestNavigator from "./AddRequestNavigator";
import EmergencyRequestScreen from "../pages/request/EmergencyRequestScreen";
import LocationView from "../components/LocationView";
import ChatSearchScreen from "../pages/chat/ChatSearchScreen";
import ChatScreen from "../pages/chat/ChatScreen";
import UpdateUserProfileScreen from "../pages/user/UpdateUserProfileScreen";
import { useTranslation } from "react-i18next";
import CreateDangerZoneScreen from "../pages/dangerZone/CreateDangerZoneScreen";
import EditDangerZoneScreen from "../pages/dangerZone/EditDangerZoneScreen";

const Stack = createStackNavigator();

const StackNavigator = () => {
    const { t } = useTranslation();

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: true,
                header: (props) => <BackButtonHeader {...props} />,
            }}
        >
            <Stack.Screen
                name="requestDetail"
                component={RequestDetailScreen}
                options={{
                    title: t("request detail"),
                    cardStyleInterpolator:
                        CardStyleInterpolators.forHorizontalIOS,
                }}
            />
            <Stack.Screen
                name="chatSearch"
                component={ChatSearchScreen}
                options={{
                    title: t("chat search"),
                    headerShown: false,
                    cardStyleInterpolator:
                        CardStyleInterpolators.forHorizontalIOS,
                }}
            />
            <Stack.Screen
                name="chat"
                component={ChatScreen}
                options={{
                    title: t("chat"),
                    cardStyleInterpolator:
                        CardStyleInterpolators.forVerticalIOS,
                }}
            />

            <Stack.Screen
                name="addRequest"
                component={AddRequestNavigator}
                options={{
                    title: "",
                    cardStyleInterpolator:
                        CardStyleInterpolators.forHorizontalIOS,
                    headerShown: false,
                    cardStyle: {
                        backgroundColor: "white",
                    },
                }}
            />
            <Stack.Screen
                name="dangerZone"
                component={CreateDangerZoneScreen}
                options={{
                    title: t("create danger zone"),
                    cardStyleInterpolator:
                        CardStyleInterpolators.forHorizontalIOS,
                    header: (props) => (
                        <BackButtonHeader {...props} close={true} />
                    ),
                }}
            />
            <Stack.Screen
                name="editDangerZone"
                component={EditDangerZoneScreen}
                options={{
                    title: t("edit danger zone"),
                    cardStyleInterpolator:
                        CardStyleInterpolators.forHorizontalIOS,
                    header: (props) => (
                        <BackButtonHeader {...props} close={true} />
                    ),
                }}
            />
            <Stack.Screen
                name="emergencyRequest"
                component={EmergencyRequestScreen}
                options={{
                    title: "",
                    cardStyleInterpolator:
                        CardStyleInterpolators.forHorizontalIOS,
                    headerShown: false,
                    header: (props) => (
                        <BackButtonHeader {...props} close={true} />
                    ),
                    cardStyle: {
                        backgroundColor: "white",
                    },
                }}
            />
            <Stack.Screen
                name="updateProfile"
                component={UpdateUserProfileScreen}
                options={{
                    title: t("update profile"),
                    cardStyleInterpolator:
                        CardStyleInterpolators.forHorizontalIOS,
                }}
            />
        </Stack.Navigator>
    );
};

export default StackNavigator;
