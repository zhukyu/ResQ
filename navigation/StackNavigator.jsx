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
                    header: (props) => (
                        <BackButtonHeader close={true} {...props} />
                    ),
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
        </Stack.Navigator>
    );
};

export default StackNavigator;
