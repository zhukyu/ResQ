import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout, refreshAccessToken } from "../lib/appwrite";
import { system } from "../constants";

const socketUrl = system.endpointURL;
let lastEmitData = null;

export const socket = io(socketUrl, {
    autoConnect: false,
});

export const connectSocket = async () => {
    const accessToken = await AsyncStorage.getItem("accessToken");

    socket.io.opts.extraHeaders = {
        Authorization: "Bearer " + accessToken,
    };

    if (!socket.connected) {
        socket.connect();
    } else {
        // If socket is already connected, you might want to reconnect or handle
        // header updates differently depending on your server-side logic.
    }

    socket.on("connect", () => {
        console.log("Connected to Socket.IO server");
    });

    socket.on("disconnect", () => {
        console.log("Disconnected from Socket.IO server");
    });

    socket.on("error", (error) => {
        console.error("Socket.IO error:", error);
    });

    socket.on("tokenExpired", async () => {
        console.log("Token expired. Attempting to refresh...");
        try {
            const newToken = await refreshAccessToken();
            if (lastEmitData) {
                socket.emit(lastEmitData.event, {
                    ...lastEmitData.data,
                    token: newToken,
                });
                lastEmitData = null; // Clear lastEmitData after successful re-emit
            }
        } catch (error) {
            console.error("Failed to refresh token:", error);
            await logout();
        }
    });
};

export const disconnectSocket = () => {
    socket.disconnect();
};

export const emitWithToken = async (event, data) => {
    try {
        const accessToken = await AsyncStorage.getItem("accessToken");
        lastEmitData = { event, data: { ...data, accessToken } };
        socket.emit(event, { ...data, accessToken });
    } catch (error) {
        throw error;
    }
};
