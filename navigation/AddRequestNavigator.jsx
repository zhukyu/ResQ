import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AddRequestScreen from "../pages/request/AddRequestScreen";
import Step1Screen from "../pages/request/addRequest/Step1Screen";
import Step2Screen from "../pages/request/addRequest/Step2Screen";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Step3Screen from "../pages/request/addRequest/Step3Screen";

const AddRequestStack = createStackNavigator();

const AddRequestNavigator = () => {
    const navigation = useNavigation();
    return (
        <AddRequestStack.Navigator
            screenOptions={{
                headerShown: true,
                cardStyle: { backgroundColor: "white" },
                cardStyleInterpolator: ({ current, next, layouts }) => {
                    return {
                        cardStyle: {
                            transform: [
                                {
                                    translateX: current.progress.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [layouts.screen.width, 0],
                                    }),
                                },
                            ],
                        },
                    };
                }
            }}
        >
            <AddRequestStack.Screen name="step1" component={Step1Screen} />
            <AddRequestStack.Screen name="step2" component={Step2Screen} />
            <AddRequestStack.Screen name="step3" component={Step3Screen} />
        </AddRequestStack.Navigator>
    );
};

export default AddRequestNavigator;
