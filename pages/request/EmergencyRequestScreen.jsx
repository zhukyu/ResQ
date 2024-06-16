import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Alert,
    Animated,
    TouchableOpacity,
    Keyboard,
} from "react-native";
import React, {
    useEffect,
    useState,
    useMemo,
    useRef,
    useCallback,
} from "react";
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import BackButtonHeader from "../../components/BackButtonHeader";
import { Easing } from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import * as Location from "expo-location";
import { formatCoordinates } from "../../lib/helpers";
import axiosInstance from "../../lib/AxiosInstance";
import { emitWithToken, socket } from "../../lib/socketInstance";
import LoadingOverlay from "../../components/LoadingOverlay";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useEmergencyContext } from "../../context/EmergencyProvider";
import { system } from "../../constants";
import { getAddress } from "../../lib/appwrite";
import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetScrollView,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import { ScrollView } from "react-native-gesture-handler";
import CommentSection from "../../components/CommentSection";
import CommentInput from "../../components/CommentInput";

const EmergencyRequestScreen = () => {
    const { t } = useTranslation();
    const { currentLocation } = useGlobalContext();
    const {
        isActivated,
        setIsActivated,
        requestId,
        setRequestId,
        emitLocation,
        stopSharingLocation,
    } = useEmergencyContext();
    const [currentAddress, setCurrentAddress] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitial, setIsInitial] = useState(true);
    const [geographicalCoordinates, setGeographicalCoordinates] = useState({
        latitude: "N, 0°0'0''",
        longitude: "E, 0°0'0''",
    });
    const menuRef = useRef(null);

    const initialSnapPoints = useMemo(() => ["50%", "90%"], []);
    const [snapPoints, setSnapPoints] = useState(initialSnapPoints);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            "keyboardDidShow",
            () => {
                setSnapPoints(["90%"]);
                menuRef.current?.expand();
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            "keyboardDidHide",
            () => {
                setSnapPoints(initialSnapPoints);
            }
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, [initialSnapPoints]);

    const openMenu = useCallback(() => {
        menuRef.current?.present();
    }, []);

    const handleClose = useCallback(() => {
        menuRef.current?.dismiss();
    }, []);

    // Display current geolocation and address
    useEffect(() => {
        if (currentLocation) {
            console.log(
                "Current Location: ",
                currentLocation?.latitude,
                currentLocation?.longitude
            );
            performReverseGeocoding(
                currentLocation.latitude,
                currentLocation.longitude
            );
            const { latitude, longitude } = formatCoordinates(
                currentLocation.latitude,
                currentLocation.longitude
            );
            setGeographicalCoordinates({
                latitude,
                longitude,
            });
        }
    }, [currentLocation]);

    useEffect(() => {
        if (requestId) {
            emitWithToken("joinRequestDetailRoom", { requestId: requestId });
        }
        return () => {
            if (requestId) {
                emitWithToken("leaveRequestDetailRoom", {
                    requestId: requestId,
                });
            }
        };
    }, [requestId]);

    const performReverseGeocoding = async (latitude, longitude) => {
        // let addresses = await Geocoding.from(latitude, longitude)
        // const addressComponent = addresses.results[0]; // Use the first address
        // console.log(addressComponent.formatted_address);
        try {
            if (isInitial) {
                setIsLoading(true);
            }
            console.log("Reverse Geocoding: ", latitude, longitude);
            const address = await getAddress(latitude, longitude);
            console.log("Address: ", address);
            if (!address) {
                return;
            }

            setCurrentAddress(address);
        } catch (error) {
            console.error("Reverse Geocoding Error:", error);
        } finally {
            if (isInitial) {
                setIsInitial(false);
                setIsLoading(false);
            }
        }
    };

    const handleActivate = () => {
        Alert.alert(
            t("create emergency request"),
            t("create emergency request confirmation"),
            [
                {
                    text: t("cancel"),
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                },
                { text: t("yes"), onPress: createRequest },
            ],
            { cancelable: true }
        );
    };

    const handleDeactivate = () => {
        Alert.alert(
            t("cancel emergency request"),
            t("cancel emergency request confirmation"),
            [
                {
                    text: t("cancel"),
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                },
                { text: t("yes"), onPress: handleStopTracking },
            ],
            { cancelable: true }
        );
    };

    const createRequest = async () => {
        setIsSubmitting(true);
        try {
            const requestData = {
                isEmergency: 1,
                latitude: currentLocation?.latitude,
                longitude: currentLocation?.longitude,
                address: currentAddress,
            };

            const response = await axiosInstance.post("/requests", requestData);
            if (response.status === 200) {
                setRequestId(response.data.id);
                setIsActivated(true);
                emitLocation(response.data.id);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStopTracking = () => {
        setIsActivated(false);
        stopSharingLocation(requestId);
    };

    const AnimatedButton = () => {
        // References to animated values
        const scaleAnimation = useRef(new Animated.Value(1)).current;
        const rippleRefs = useRef(
            [...Array(3)].map(() => new Animated.Value(0.5))
        ).current;
        const scaleRefs = useRef(
            [...Array(3)].map(() => new Animated.Value(1))
        ).current;

        useEffect(() => {
            // Main button scale animation
            Animated.loop(
                Animated.sequence([
                    Animated.timing(scaleAnimation, {
                        toValue: 1.05,
                        duration: 1000,
                        easing: Easing.out(Easing.ease),
                        useNativeDriver: true, // Enable for better performance
                    }),
                    Animated.timing(scaleAnimation, {
                        toValue: 1,
                        duration: 1000,
                        easing: Easing.out(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            ).start();

            if (isActivated) {
                rippleRefs.forEach((opacity, index) => {
                    setTimeout(() => {
                        Animated.loop(
                            Animated.parallel([
                                Animated.timing(opacity, {
                                    toValue: 0,
                                    duration: 2000,
                                    useNativeDriver: true,
                                    easing: Easing.out(Easing.ease),
                                    delay: 400,
                                }),
                                Animated.timing(scaleRefs[index], {
                                    toValue: 1.8,
                                    duration: 2000,
                                    useNativeDriver: true,
                                    easing: Easing.out(Easing.ease),
                                    delay: 400,
                                }),
                            ])
                        ).start();
                    }, index * 500);
                });
            } else {
                rippleRefs.forEach((opacity, index) => {
                    // Reset all ripples
                    opacity.setValue(0.5);
                    scaleRefs[index].setValue(1);
                });
            }
        }, [isActivated]);

        return (
            <Animated.View
                className="bg-primary rounded-full w-52 h-52 items-center justify-center"
                style={[
                    // styles.buttonContainer,
                    {
                        transform: [{ scale: scaleAnimation }],
                        shadowColor: "black",
                        shadowOpacity: 0.5,
                        shadowOffset: { width: 2, height: 12 },
                        elevation: 15, // Android shadow
                    },
                ]}
            >
                {isActivated &&
                    rippleRefs.map((rippleOpacity, index) => (
                        <Animated.View
                            className="w-52 h-52 rounded-full bg-primary items-center justify-center"
                            key={index}
                            style={[
                                StyleSheet.absoluteFillObject,
                                // styles.ripple,
                                {
                                    opacity: rippleOpacity,
                                    transform: [{ scale: scaleRefs[index] }],
                                },
                            ]}
                        />
                    ))}
                <MaterialIcons name="sos" size={100} color="white" />
            </Animated.View>
        );
    };

    return (
        <View className="flex-1 bg-gray-50">
            <LoadingOverlay visible={isLoading} />
            <View className="">
                <BackButtonHeader
                    close={true}
                    headerStyle={{ backgroundColor: "#f9fafb" }}
                />
            </View>
            <View className="flex-1 items-center justify-between">
                <Text className="text-2xl font-extrabold mb-4 px-4 text-gray-800">
                    {t("create emergency request")}
                </Text>
                <View
                    style={{
                        position: "absolute",
                        top: 0,
                        bottom: 100,
                        left: 0,
                        right: 0,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Pressable
                        onPress={
                            isActivated ? handleDeactivate : handleActivate
                        }
                    >
                        {AnimatedButton}
                    </Pressable>
                </View>
                <View className="w-full p-4">
                    {isActivated && requestId && (
                        <View className="flex justify-center items-end">
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={openMenu}
                                style={{
                                    shadowOffset: {
                                        width: 0,
                                        height: 3,
                                    },
                                    shadowColor: "#8C929D",
                                    shadowOpacity: 0.2,
                                    shadowRadius: 3.84,
                                    elevation: 10,
                                    borderRadius: 50,
                                    marginBottom: 10,
                                }}
                            >
                                <View className="rounded-full bg-white p-4 flex items-center justify-center mb-2">
                                    <FontAwesome6
                                        name="comment-alt"
                                        size={24}
                                        color="#4B5563"
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}

                    <View
                        className="bg-white p-4 rounded-lg items-start justify-center w-full"
                        style={{
                            shadowOffset: {
                                width: 0,
                                height: 3,
                            },
                            shadowColor: "#8C929D",
                            shadowOpacity: 0.2,
                            shadowRadius: 3.84,
                            elevation: 10,
                        }}
                    >
                        <View className="flex flex-row">
                            {/* <FontAwesome6
                                name="location-dot"
                                size={24}
                                color="gray"
                            /> */}
                            <Text className="text-base font-semibold text-gray-800 ml-1">
                                {currentAddress || t("loading...")}
                            </Text>
                        </View>
                        <View className="flex flex-row">
                            {/* <MaterialCommunityIcons
                                name="latitude"
                                size={24}
                                color="gray"
                            /> */}
                            <Text className="text-base font-semibold text-gray-500 ml-1">
                                {geographicalCoordinates.longitude}
                            </Text>
                        </View>
                        <View className="flex flex-row">
                            {/* <MaterialCommunityIcons
                                name="longitude"
                                size={24}
                                color="gray"
                            /> */}
                            <Text className="text-base font-semibold text-gray-500 ml-1">
                                {geographicalCoordinates.latitude}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
            <BottomSheetModal
                ref={menuRef}
                enablePanDownToClose={true}
                snapPoints={snapPoints}
                // enableDynamicSizing={true}
                backdropComponent={(props) => (
                    <BottomSheetBackdrop
                        {...props}
                        opacity={0.5}
                        enableTouchThrough={false}
                        appearsOnIndex={0}
                        disappearsOnIndex={-1}
                    />
                )}
            >
                <BottomSheetView style={{ flex: 1 }}>
                    <CommentInput requestId={requestId} />
                    <ScrollView style={{ flex: 1 }}>
                        <CommentSection requestId={requestId} />
                    </ScrollView>
                </BottomSheetView>
            </BottomSheetModal>
        </View>
    );
};

export default EmergencyRequestScreen;
