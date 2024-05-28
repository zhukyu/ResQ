import { View, Text, Button } from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../context/GlobalProvider";

const NotificationScreen = () => {
    const [notification, setNotification] = useState([]);
    const { socket } = useGlobalContext();

    useEffect(() => {
        if (socket) {
            socket.emit("getNotification");
            socket.on("notification", (data) => {
                setNotification(data);
            });
        }
    }, [socket]);

    const handleRefreshNotification = () => {
        if (socket) {
            socket.emit("getNotification");
        }
    };

    return (
        <View>
            <Button title="Refresh" onPress={handleRefreshNotification} />
            {notification.map((item, index) => (
                <View key={index}>
                    <Text>{item}</Text>
                </View>
            ))}
        </View>
    );
};

export default NotificationScreen;
