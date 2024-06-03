import { View, Text, TextInput } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import CustomTitleHeader from "../../components/CustomTitleHeader";
import { useTranslation } from "react-i18next";

const ChatSearchScreen = ({ navigation }) => {
    const [searchText, setSearchText] = useState("");
    const inputRef = useRef(null);
    const { t } = useTranslation();

    const onChangeText = (text) => {
        console.log(text);
        setSearchText(text);
    };

    // useEffect(() => {
    //     navigation.setOptions({
    //         header: (props) => (
    //             <CustomTitleHeader {...props} headerTitle={SearchInput} />
    //         ),
    //     });
    // }, [navigation]);

    useEffect(() => {
        setTimeout(() => {
            inputRef.current?.blur();
            inputRef.current?.focus();
        }, 100);
    }, []);

    const SearchInput = () => {
        return (
            <TextInput
                className="text-lg font-bold -ml-2"
                ref={inputRef}
                placeholder={t("search")}
                value={searchText}
                onChangeText={onChangeText}
                cursorColor={"#000"}
            />
        );
    };

    return (
        <View className="bg-white w-full h-full">
            <CustomTitleHeader headerTitle={SearchInput}/>
            <Text>ChatSearch</Text>
        </View>
    );
};

export default ChatSearchScreen;
