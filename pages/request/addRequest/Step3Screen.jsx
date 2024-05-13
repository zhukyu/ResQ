import {
    View,
    Text,
    Button,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Animated,
    ActivityIndicator,
    Alert,
} from "react-native";
import { Header } from "@react-navigation/elements";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "../../../components/CustomButton";
import NextButtonHeader from "../../../components/NextButtonHeader";
import MapSelector from "../../../components/MapSelector";
import BackButtonHeader from "../../../components/BackButtonHeader";
import React, { useEffect, useRef, useState } from "react";
import MapView, { Geojson, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import AvatarMenu from "../../../components/AvatarMenu";
import Geocoding from "react-native-geocoding";
import haversine from "haversine";
import { useTranslation } from "react-i18next";
import LoadingOverlay from "../../../components/LoadingOverlay";

const styles = StyleSheet.create({
    shadow: {
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowColor: "black",
        shadowOpacity: 1,
        shadowRadius: 1,
        elevation: 5,
    },
});

const Step3Screen = () => {
    const ANIMATION_DURATION = 200;
    const SCALE_BEGIN = -20;
    const SCALE_END = 0;
    const FADE_BEGIN = 0;
    const FADE_END = 1;

    const { step2Data } = useRoute().params;

    useEffect(() => {
        console.log(step2Data);
    }, [step2Data]);

    const navigation = useNavigation();
    const { t } = useTranslation();
    const [canProceed, setCanProceed] = useState(false);
    const [initialRegion, setInitialRegion] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [delta, setDelta] = useState({
        latitudeDelta: 0.008,
        longitudeDelta: 0.01,
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [isCustomLocation, setIsCustomLocation] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [distance, setDistance] = useState("0m");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubbmitting, setIsSubmitting] = useState(false);
    const mapRef = useRef(null);
    const timeoutId = useRef(null);
    const fadeAnim = useRef(new Animated.Value(FADE_BEGIN)).current;
    const scaleYAnim = useRef(new Animated.Value(SCALE_BEGIN)).current;

    const handleSearchChange = (text) => {
        setSearchTerm(text);
        // if (onSearchChange) {
        //     onSearchChange(text);
        // }
    };

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                console.error("Location permission not granted!");
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setInitialRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                ...delta,
            });
            setCurrentLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
        })();
    }, []);

    const handleRegionChange = (region) => {
        if (isCustomLocation) {
            setIsLoading(true);
        }
        clearTimeout(timeoutId.current);
        if (region && currentLocation && isCustomLocation) {
            const distance = haversine(region, currentLocation, {
                unit: "meter",
            });
            if (distance < 1000) {
                setDistance(`${distance.toFixed(0)}m`);
            } else {
                setDistance(`${(distance / 1000).toFixed(2)}km`);
            }
        } else {
            setDistance("0m");
        }
    };

    const handleRegionChangeComplete = (region) => {
        clearTimeout(timeoutId.current);

        timeoutId.current = setTimeout(() => {
            console.log("perform reverse geocoding");
            if (isCustomLocation) {
                performReverseGeocoding(region.latitude, region.longitude);
            } else {
                performReverseGeocoding(
                    currentLocation?.latitude,
                    currentLocation?.longitude
                );
            }
        }, 500);
    };

    const handleCustomLocationButton = () => {
        setIsCustomLocation(true);
    };

    const handleCurrentLocationButton = () => {
        setIsCustomLocation(false);
        if (isCustomLocation) {
            setIsLoading(true);
        }
        mapRef?.current?.animateToRegion({
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            ...delta,
        });
    };

    const performReverseGeocoding = async (latitude, longitude) => {
        if (isCustomLocation) {
            setIsLoading(true);
        }
        try {
            // let addresses = await Geocoding.from(latitude, longitude)
            // const addressComponent = addresses.results[0]; // Use the first address
            // console.log(addressComponent.formatted_address);
            try {
                let addresses = await Location.reverseGeocodeAsync({
                    latitude,
                    longitude,
                });
                const addressComponent = addresses[0]; // Use the first address
                setSelectedLocation({
                    latitude,
                    longitude,
                    address: addressComponent?.formattedAddress,
                });
            } catch (error) {
                console.error("Reverse Geocoding Error:", error);
            }
        } catch (error) {
            console.error("Reverse Geocoding Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        navigation.setOptions({
            title: "Select Location",
            header: (props) => <BackButtonHeader {...props} close={true} />,
        });
    }, [navigation]);

    useEffect(() => {
        if (isCustomLocation) {
            Animated.timing(fadeAnim, {
                toValue: FADE_END,
                duration: ANIMATION_DURATION,
                useNativeDriver: true,
            }).start();
            Animated.spring(scaleYAnim, {
                toValue: SCALE_END,
                duration: ANIMATION_DURATION,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(fadeAnim, {
                toValue: FADE_BEGIN,
                duration: ANIMATION_DURATION,
                useNativeDriver: true,
            }).start();
            Animated.spring(scaleYAnim, {
                toValue: SCALE_BEGIN,
                duration: ANIMATION_DURATION,
                useNativeDriver: true,
            }).start();
        }
    }, [isCustomLocation]);

    const createRequest = async () => {
        setIsSubmitting(true);
        try {
            const requestData = {
                ...step2Data,
                ...selectedLocation,
                isEmergency: 0,
            };
            console.log(requestData);
            // const response = await axiosInstance.post("/request", {
            //     ...step2Data,
            //     location: selectedLocation,
            // });
            // console.log(response);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCreateRequest = () => {
        Alert.alert(
            t("create request"),
            t("create request confirmation"),
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

    return (
        <View className="flex">
            <LoadingOverlay visible={isSubbmitting} />
            <View className="overflow-hidden">
                <MapView
                    ref={mapRef}
                    className="w-full h-full"
                    provider={PROVIDER_GOOGLE}
                    initialRegion={initialRegion}
                    followsUserLocation={true}
                    showsUserLocation={true}
                    showsMyLocationButton={false}
                    showsCompass={true}
                    toolbarEnabled={true}
                    zoomEnabled={true}
                    rotateEnabled={true}
                    onRegionChangeComplete={handleRegionChangeComplete}
                    onRegionChange={handleRegionChange}
                    mapPadding={{ top: 54, right: 0, left: 0, bottom: 140 }}
                ></MapView>
                {/* {!isSubbmitting && (
                    <View className="absolute items-center justify-center flex h-screen w-screen z-[100]">
                        <View className="absolute justify-center items-center z-50 w-full h-full bg-black opacity-20"></View>
                        <View className="absolute justify-center items-center z-50 w-full h-full">
                            <ActivityIndicator size="large" color="#F73334" />
                        </View>
                    </View>
                )} */}
                <View className="absolute z-50 flex flex-row mx-4 my-2">
                    <View
                        className="bg-white py-2 px-3 rounded-lg flex-row items-center flex-1"
                        style={styles.shadow}
                    >
                        <View className="mr-3">
                            <FontAwesome name="search" size={18} color="gray" />
                        </View>
                        <TextInput
                            className="flex-1 text-base font-medium text-gray-900"
                            placeholder="Search"
                            onChangeText={handleSearchChange}
                            value={searchTerm}
                            cursorColor={"#000"}
                        />
                    </View>
                </View>
                <View
                    className="absolute z-50 bottom-0 flex p-4 w-full"
                    style={{ pointerEvents: "box-none" }}
                >
                    <View className="flex">
                        <View className="flex items-end">
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={handleCustomLocationButton}
                                style={{
                                    ...styles.shadow,
                                    backgroundColor: "transparent",
                                    borderRadius: 50,
                                    marginBottom: 10,
                                }}
                            >
                                <View className="rounded-full bg-white h-12 w-12 flex items-center justify-center">
                                    <FontAwesome6
                                        name="location-dot"
                                        size={22}
                                        color="gray"
                                    />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={handleCurrentLocationButton}
                                style={{
                                    ...styles.shadow,
                                    backgroundColor: "transparent",
                                    borderRadius: 50,
                                    marginBottom: 10,
                                }}
                            >
                                <View className="rounded-full bg-white h-12 w-12 flex items-center justify-center">
                                    <MaterialIcons
                                        name="gps-fixed"
                                        size={22}
                                        color="gray"
                                    />
                                </View>
                            </TouchableOpacity>
                            <View
                                className="rounded-xl w-full bg-white p-4 flex flex-col"
                                style={styles.shadow}
                            >
                                <View className="flex mb-2 flex-row items-center">
                                    <View className="">
                                        <FontAwesome6
                                            name="location-dot"
                                            size={22}
                                            color="gray"
                                        />
                                    </View>
                                    <View className="flex ml-3">
                                        <Text className="text-sm font-semibold text-gray-800">
                                            {selectedLocation?.address}
                                        </Text>
                                        <Text className="text-xs font-medium text-gray-500">
                                            {distance}
                                        </Text>
                                    </View>
                                </View>
                                <CustomButton
                                    title="Create Request"
                                    handlePress={handleCreateRequest}
                                    disabled={isLoading || !selectedLocation}
                                />
                            </View>
                        </View>
                    </View>
                </View>
                <Animated.View
                    className="absolute z-50 top-1/2 left-1/2 -ml-[12] -mt-[72]"
                    style={{
                        pointerEvents: "none",
                        opacity: fadeAnim,
                        transform: [{ translateY: scaleYAnim }],
                    }}
                >
                    <FontAwesome6
                        name="location-dot"
                        size={30}
                        color="#F73334"
                    />
                </Animated.View>
            </View>
        </View>
    );
};

export default Step3Screen;
