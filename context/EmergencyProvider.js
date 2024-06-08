import { createContext, useContext, useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import { emitWithToken, socket } from "../lib/socketInstance";
import { useGlobalContext } from "./GlobalProvider";
import axiosInstance from "../lib/AxiosInstance";

const emergencyContext = createContext();
export const useEmergencyContext = () => useContext(emergencyContext);

const EmergencyProvider = ({ children }) => {
    const { currentLocation, user } = useGlobalContext();
    const [isActivated, setIsActivated] = useState(false);
    const [requestId, setRequestId] = useState(null);
    const intervalRef = useRef(null);
    const prevIsActivatedRef = useRef(null);

    const checkRequestExists = async () => {
        try {
            const response = await axiosInstance.get("/requests/active");
            if (response.status === 200) {
                const request = response.data.requests[0];
                if (request) {
                    setRequestId(request.id);
                    setIsActivated(true);
                    updateLocation(request.id);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

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
