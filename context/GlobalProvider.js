import { createContext, useContext, useState, useEffect, useRef } from "react";
import { refreshAccessToken } from "../lib/appwrite";
import Toast from "react-native-toast-message";
import { system } from "../constants";
import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    connectSocket,
    disconnectSocket,
    emitWithToken,
    socket,
} from "../lib/socketInstance";
import * as Location from "expo-location";
import axiosInstance from "../lib/AxiosInstance";
import { AppState } from "react-native";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [expirationTime, setExpirationTime] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);

    const locationSubscriptionRef = useRef(null);
    const appStateSubscriptionRef = useRef(null);

    const fetchCurrentLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            console.error("Location permission not granted!");
            return;
        }

        let location = await Location.getCurrentPositionAsync({});

        const locationData = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        };
        setCurrentLocation(locationData);

        return locationData;
    };

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

    const updateLocation = async () => {
        try {
            // const { latitude, longitude } = await fetchCurrentLocation();
            if (!currentLocation) {
                return;
            }

            const { latitude, longitude } = currentLocation;
            const response = await axiosInstance.post(`/user/location`, {
                latitude,
                longitude,
            });
            const data = await response.data;
            if (data) {
                // console.log(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (currentLocation) {
            updateLocation();
        }
    }, [currentLocation]);

    useEffect(() => {
        const handleAppStateChange = (nextAppState) => {
            if (nextAppState === "active") {
                requestLocationPermissionAndTrack();
            } else if (nextAppState.match(/inactive|background/)) {
                removeLocationSubscription();
            }
        };

        const requestLocationPermissionAndTrack = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== "granted") {
                console.error("Permission to access location was denied");
                return;
            }

            locationSubscriptionRef.current = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 1000,
                    distanceInterval: 10,
                },
                (location) => {
                    console.log("Location changed");
                    setCurrentLocation(location.coords);
                }
            );
        };

        const removeLocationSubscription = () => {
            if (locationSubscriptionRef.current) {
                locationSubscriptionRef.current.remove();
                locationSubscriptionRef.current = null;
            }
        };

        if (user) {
            console.log("connecting socket");
            connectSocket();

            requestLocationPermissionAndTrack();

            appStateSubscriptionRef.current = AppState.addEventListener(
                "change",
                handleAppStateChange
            );
        }

        return () => {
            console.log("disconnecting socket");
            disconnectSocket();

            console.log("removing location subscription");
            removeLocationSubscription();

            if (appStateSubscriptionRef.current) {
                appStateSubscriptionRef.current.remove();
                appStateSubscriptionRef.current = null;
            }
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
                visibilityTime: toast.visibilityTime || 4000,
                autoHide: true,
                topOffset: 40,
                bottomOffset: 40,
                leadingIcon: null,
                trailingIcon: null,
                props: {
                    swipeable: true,
                },
                onPress: () => {
                    if (toast.onPress) {
                        toast.onPress();
                    }
                    Toast.hide();
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
                currentLocation,
                setCurrentLocation,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;
