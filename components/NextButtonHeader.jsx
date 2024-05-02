import { View, Text, TouchableOpacity, Button } from "react-native";
import { Header } from "@react-navigation/elements";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "./CustomButton";

const NextButtonHeader = ({ next, canProceed, ...props }) => {
    const navigation = useNavigation();
    const title = props?.options?.title;

    return (
        <Header
            title={title}
            headerLeft={() => (
                <TouchableOpacity
                    className="p-4"
                    onPress={() => navigation.goBack()}
                >
                    <View className="">
                        <Ionicons name="close" size={24} color="black" />
                    </View>
                </TouchableOpacity>
            )}
            headerTitleStyle={{
                marginLeft: -14,
            }}
            headerTitle={() => (
                <View className="flex flex-row items-center justify-end w-full">
                    <CustomButton
                        title="Next"
                        handlePress={() => navigation.navigate(next)}
                        containerStyles="min-h-[30px] py-2 px-3 rounded-full"
                        textStyles="text-base"
                        disabled={!canProceed}
                    />
                </View>
            )}
        />
    );
};

export default NextButtonHeader;
