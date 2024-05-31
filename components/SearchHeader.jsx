import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { Header } from "@react-navigation/elements";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const SearchHeader = ({
    close,
    headerStyle,
    value,
    onChangeText,
    ...props
}) => {
    const navigation = useNavigation();
    const inputRef = useRef(null);
    const { t } = useTranslation();

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    return (
        <Header
            headerTitle={() => (
                <TextInput
                    className="text-lg font-bold -ml-2"
                    ref={inputRef}
                    placeholder={t("search")}
                    value={value}
                    onChangeText={onChangeText}
                    cursorColor={"#000"}
                />
            )}
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
                                color="black"
                            />
                        )}
                    </View>
                </TouchableOpacity>
            )}
            headerTitleStyle={{
                marginLeft: -20,
            }}
            headerStyle={{
                elevation: 0,
                shadowOpacity: 0,
                ...headerStyle,
            }}
        />
    );
};

export default SearchHeader;
