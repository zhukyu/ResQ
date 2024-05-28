import { createContext, useContext, useState, useEffect } from "react";
import { refreshAccessToken } from "../lib/appwrite";
import Toast from "react-native-toast-message";
import { system } from "../constants";
import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { connectSocket, disconnectSocket } from "../lib/socketInstance";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [expirationTime, setExpirationTime] = useState(null);

    const handleRefreshAccessToken = () => {
        refreshAccessToken()
            .then((accessToken) => {
                if (accessToken) {
                    setExpirationTime(Date.now() + system.refreshTime);
                }
            })
            .catch((error) => {
                if (error.response.status === 400) {
                    return null;
                }
                console.error(error);
            });
    };

    // useEffect(() => {
    //     const newSocket = io(socketUrl);

    //     newSocket.on("connect", () => {
    //         console.log("Connected to Socket.IO server");
    //     });

    //     newSocket.on("disconnect", () => {
    //         console.log("Disconnected from Socket.IO server");
    //     });

    //     setSocket(newSocket);

    //     return () => newSocket.close();
    // }, []);

    useEffect(() => {
        if (user) {
            connectSocket();
        }

        return () => {
            disconnectSocket();
        };
    }, [user]);

    useEffect(() => {
        console.log("toast: ", toast);
        if (toast) {
            console.log(toast);
            Toast.show({
                type: toast.type,
                text1: toast.text1,
                text2: toast.text2,
                position: "top",
                visibilityTime: 4000,
                autoHide: true,
                topOffset: 40,
                bottomOffset: 40,
                leadingIcon: null,
                trailingIcon: null,
                props: {
                    swipeable: true,
                },
            });
            setToast(null);
        }
    }, [toast]);

    useEffect(() => {
        // Set a timeout to refresh the access token when it's about to expire
        if (expirationTime) {
            const timeout = setTimeout(
                handleRefreshAccessToken,
                expirationTime - Date.now()
            );
            // Clear the timeout when the component unmounts or when the expiration time changes
            return () => {
                clearTimeout(timeout);
            };
        }
    }, [expirationTime]);

    return (
        <GlobalContext.Provider
            value={{
                isLoggedIn,
                setIsLoggedIn,
                user,
                setUser,
                isLoading,
                toast,
                setToast,
                setIsLoading,
                expirationTime,
                setExpirationTime,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;
