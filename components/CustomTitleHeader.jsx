import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { Header } from "@react-navigation/elements";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useRef } from "react";

const CustomTitleHeader = ({
    backIconColor,
    close,
    headerStyle,
    headerTitle,
    headerRight,
    shadow,
    ...props
}) => {
    const navigation = useNavigation();

    return (
        <Header
            headerTitle={headerTitle}
            headerLeft={() => (
                <TouchableOpacity
                    className="p-4"
                    onPress={() => navigation.goBack()}
                >
                    <View className="">
                        {close ? (
                            <Ionicons name="close" size={24} color="black" />
                        ) : (
                            <Ionicons
                                name="arrow-back"
                                size={24}
                                color={backIconColor || "black"}
                            />
                        )}
                    </View>
                </TouchableOpacity>
            )}
            headerRight={headerRight}
            headerTitleStyle={{
                marginLeft: -20,
            }}
            // headerStyle={{
            //     // elevation: 0,
            //     // shadowOpacity: 0,
            //     ...headerStyle,
            // }}
            headerStyle={
                shadow ? 
                    {
                        shadowOffset: {
                            width: 0,
                            height: 3,
                        },
                        shadowColor: "#9ca3af",
                        shadowOpacity: 0.2,
                        shadowRadius: 3.84,
                        elevation: 15,
                    }
                    : {
                        elevation: 0,
                        shadowOpacity: 0,
                        ...headerStyle,
                    }
            }
        />
    );
};

export default CustomTitleHeader;
