import { createContext, useContext, useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import { emitWithToken, socket } from "../lib/socketInstance";
import { useGlobalContext } from "./GlobalProvider";
import axiosInstance from "../lib/AxiosInstance";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { system } from "../constants";

const emergencyContext = createContext();
export const useEmergencyContext = () => useContext(emergencyContext);

const EmergencyProvider = ({ children }) => {
    const { currentLocation, user, setToast } = useGlobalContext();
    const [isActivated, setIsActivated] = useState(false);
    const [requestId, setRequestId] = useState(null);
    const intervalRef = useRef(null);
    const prevIsActivatedRef = useRef(null);
    const { t } = useTranslation();
    const navigation = useNavigation();

    const navigateToEmergencyScreen = () => {
        navigation.navigate(`stack`, {
            screen: `emergencyRequest`,
        });
    };

    const checkRequestExists = async () => {
        try {
            const response = await axiosInstance.get("/requests/active");
            if (response.status === 200) {
                const request = response.data.requests[0];
                if (request) {
                    setRequestId(request.id);
                    setIsActivated(true);
                    updateLocation(request.id);
                    console.log("exist");
                    setToast({
                        type: "error",
                        text1: t("warning"),
                        text2: t("emergency request warning"),
                        visibilityTime: 6000,
                        onPress: () => navigateToEmergencyScreen(),
                    });
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const finishRequest = async (requestId) => {
        try {
            const status = system.REQUEST_STATUS.RESCUED;
            const response = await axiosInstance.put(`/requests/${requestId}?status=${status}`);
            if (response.status === 200) {
                setRequestId(null);
                setIsActivated(false);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const updateLocation = async (requestId) => {
        try {
            intervalRef.current = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 1000,
                    distanceInterval: 10,
                },
                (location) => {
                    console.log("location: ", location);
                    const { latitude, longitude } = location.coords;
                    emitWithToken("updateLocation", {
                        requestId,
                        latitude,
                        longitude,
                    });
                }
            );
            console.log("Request ID: ", requestId);
        } catch (error) {
            console.error(error);
        }
    };

    const emitLocation = async (requestId) => {
        try {
            if (intervalRef.current) {
                return;
            }

            const { latitude, longitude } = currentLocation;
            console.log("here");
            emitWithToken("startSharingLocation", {
                requestId,
                latitude,
                longitude,
            });

            socket.on("locationSharingStarted", async (data) => {
                updateLocation(requestId);
            });
        } catch (error) {
            console.error(error);
        }
    };

    const stopSharingLocation = async (requestId) => {
        clearInterval(intervalRef.current);
        intervalRef.current.remove();
        intervalRef.current = null;
        finishRequest(requestId);
        emitWithToken("stopSharingLocation", { requestId });
    };

    // useEffect(() => {
    //     const prevIsActivated = prevIsActivatedRef.current;

    //     if (isActivated && requestId && socket && currentLocation) {
    //         emitLocation();
    //     } else if (!isActivated && prevIsActivated && requestId && socket) {
    //         stopSharingLocation();
    //     }

    //     prevIsActivatedRef.current = isActivated;

    //     return () => {
    //         clearInterval(intervalRef.current);
    //         intervalRef.current = null;
    //     };
    // }, [isActivated, currentLocation, user, socket, requestId]);

    useEffect(() => {
        checkRequestExists();

        return () => {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        };
    }, []);

    return (
        <emergencyContext.Provider
            value={{
                isActivated,
                setIsActivated,
                requestId,
                setRequestId,
                emitLocation,
                stopSharingLocation,
            }}
        >
            {children}
        </emergencyContext.Provider>
    );
};

export default EmergencyProvider;
