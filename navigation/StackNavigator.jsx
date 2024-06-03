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

const Stack = createStackNavigator();

const StackNavigator = () => {
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
                    title: "Request Detail",
                    cardStyleInterpolator:
                        CardStyleInterpolators.forHorizontalIOS,
                }}
            />
            <Stack.Screen
                name="chatSearch"
                component={ChatSearchScreen}
                options={{
                    title: "Chat Search",
                    headerShown: false,
                    cardStyleInterpolator:
                        CardStyleInterpolators.forHorizontalIOS,
                }}
            />
            <Stack.Screen
                name="chat"
                component={ChatScreen}
                options={{
                    title: "Chat",
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
        </Stack.Navigator>
    );
};

export default StackNavigator;
