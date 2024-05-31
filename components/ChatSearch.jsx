import { View, Text } from "react-native";
import React, { useEffect } from "react";
import SearchHeader from "./SearchHeader";

const ChatSearch = ({ navigation }) => {
    const [searchText, setSearchText] = useState("");

    const handleSearch = (text) => {
        setSearchText(text);
    }

    useEffect(() => {
        navigation.setOptions({
            header: (props) => <SearchHeader {...props}/>,
        });
    }, [navigation]);

    return (
        <View className="bg-white w-full h-full">
            <Text>ChatSearch</Text>
        </View>
    );
};

export default ChatSearch;
