import { View, Text, Button, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../context/GlobalProvider";
import { emitWithToken, socket } from "../../lib/socketInstance";
import { formatTime } from "../../lib/helpers";
import { useIsFocused, useNavigation } from "@react-navigation/native";

const NotificationItem = ({ item }) => {
    const id = item?._id;
    const requestId = item?.requestId;
    const message = item?.message;
    const createdAt = item?.createdAt;
    const read = item?.read;
    const navigation = useNavigation();

    const handlePress = () => {
        emitWithToken("markAsReadNotification", { id });
        navigation.navigate(`stack`, {
            screen: `requestDetail`,
            params: { id: requestId },
        });
    };

    return (
        <TouchableOpacity className={`p-4 border-b border-gray-200 ${read ? "bg-white" : "bg-red-50"}`} onPress={handlePress}>
            <Text className="text-base font-rmedium text-gray-800 mb-2">
                {message}
            </Text>
            <Text className="text-sm font-rregular">
                {formatTime(createdAt)}
            </Text>
        </TouchableOpacity>
    );
};

const NotificationScreen = () => {
    const [notifications, setNotifications] = useState([]);
    const isFocused = useIsFocused();
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        if (isFocused) {
            emitWithToken("getNotification");
            emitWithToken("resetUnviewedNotifications");
        }
    }, [isFocused]);

    useEffect(() => {
        if (socket) {
            setIsRefreshing(true);
            emitWithToken("getNotification");
            socket.on("notificationList", (data) => {
                console.log("notificationList", data.length);
                setNotifications(data);
                setIsRefreshing(false);
            });
        }

        return () => {
            if (socket) {
                socket.off("notification");
            }
        };
    }, [socket]);

    const handleRefresh = () => {
        emitWithToken("getNotification");
    };

    return (
        <View>
            {notifications && notifications.length > 0 ? (
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => <NotificationItem item={item} />}
                    onRefresh={handleRefresh}
                    refreshing={isRefreshing}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={handleRefresh}
                            colors={["#F73334"]}
                            tintColor="#F73334"
                        />
                    }
                />
            ) : null}
        </View>
    );
};

export default NotificationScreen;
