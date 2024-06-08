import { View, Text, Button } from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../context/GlobalProvider";
import { emitWithToken, socket } from "../../lib/socketInstance";

const NotificationScreen = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (socket) {
            emitWithToken("getNotification");
            socket.on("notificationList", (data) => {
                console.log("notificationList", data.length);
                setNotifications(data);
            });
        }

        return () => {
            if (socket) {
                socket.off("notification");
            }
        };
    }, [socket]);

    const handleRefreshNotification = () => {
        if (socket) {
            emitWithToken("getNotification");
        }
    };

    return (
        <View>
            <Button title="Refresh" onPress={handleRefreshNotification} />
            {notifications.map((item, index) => (
                <View key={index}>
                    <Text>{item?.message}</Text>
                </View>
            ))}
        </View>
    );
};

export default NotificationScreen;
