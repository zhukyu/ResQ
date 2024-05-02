import { View, Text, Button, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Header } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "../../../components/CustomButton";
import NextButtonHeader from "../../../components/NextButtonHeader";

const Step1Screen = () => {
    const navigation = useNavigation();
    const [canProceed , setCanProceed] = useState(true);

    useEffect(() => {
        navigation.setOptions({
            title: "Step 1",
            header: (props) => <NextButtonHeader canProceed={canProceed} next="step2" {...props} />,
        });
    }, [navigation]);

    return (
        <View>
            <Text>Step1Screen</Text>
        </View>
    );
};

export default Step1Screen;
