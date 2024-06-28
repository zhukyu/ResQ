import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Image,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import MapView, { Geojson, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    FontAwesome,
    FontAwesome6,
    Ionicons,
    MaterialIcons,
} from "@expo/vector-icons";
import { icons, system } from "../constants";
import MapViewDirections from "react-native-maps-directions";
import CustomButton from "./CustomButton";
import haversine from "haversine";
import { useTranslation } from "react-i18next";
import { getGreatCircleBearing } from "geolib";
import { useGlobalContext } from "../context/GlobalProvider";
import { emitWithToken, socket } from "../lib/socketInstance";
import { getAddress } from "../lib/appwrite";

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

const LocationView = ({ item, handleCloseModal, isEmergency, visible }) => {
    const [initialRegion, setInitialRegion] = useState(null);
    const { currentLocation } = useGlobalContext(null);
    const [heading, setHeading] = useState(0);
    const [delta, setDelta] = useState({
        latitudeDelta: 0.02,
        longitudeDelta: 0.01,
    });
    const [distance, setDistance] = useState("0m");
    const [selectedLocation, setSelectedLocation] = useState(null);
    const mapRef = useRef(null);
    const { t } = useTranslation();
    const [showDirectionEnabled, setShowDirectionEnabled] = useState(false);
    const [startNavigation, setStartNavigation] = useState(false);
    const [routeCoordinates, setRouteCoordinates] = useState([]);
    const locationSubscriptionRef = useRef(null);

    const getDistance = () => {
        const distance = haversine(selectedLocation, currentLocation, {
            unit: "meter",
        });
        if (distance < 1000) {
            setDistance(`${distance.toFixed(0)}m`);
        } else {
            setDistance(`${(distance / 1000).toFixed(2)}km`);
        }
    };

    useEffect(() => {
        const handleLocationUpdate = async (data) => {
            const { latitude, longitude } = data;
            console.log("Location Update:", latitude, longitude);

            const address = await getAddress(latitude, longitude);

            setSelectedLocation({ latitude, longitude, address });
        };

        if (isEmergency && item) {
            emitWithToken("joinRequestRoom", { requestId: item?.id });
            socket.on("locationUpdate", handleLocationUpdate);
        }

        return () => {
            socket.off("locationUpdate", handleLocationUpdate);
        };
    }, [isEmergency, item]);

    useEffect(() => {
        // if (item) {
        //     const { latitude, longitude } = item;
        //     console.log(parseFloat(latitude), parseFloat(longitude));
        //     // performReverseGeocoding(parseFloat(latitude), parseFloat(longitude));
        // }
        const handleReverseGeocoding = async (item) => {
            const { latitude, longitude, address } = item;
            // await performReverseGeocoding(parseFloat(latitude), parseFloat(longitude));
            setSelectedLocation({
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                address: address,
            });
        };

        if (item) {
            handleReverseGeocoding(item);
        }
    }, [item]);

    useEffect(() => {
        // Calculate heading when both location and route are available
        if (currentLocation && routeCoordinates) {
            const nearestPointIndex = findNearestPointIndex(
                currentLocation,
                routeCoordinates
            );
            if (nearestPointIndex < routeCoordinates.length - 1) {
                const nextPoint = routeCoordinates[nearestPointIndex + 1];
                const newHeading = getGreatCircleBearing(
                    currentLocation,
                    nextPoint
                );
                setHeading(newHeading);
            }
        }
    }, [currentLocation, routeCoordinates]); // Update whenever location or route changes

    // Helper function to find the closest point on the route
    const findNearestPointIndex = (location, coordinates) => {
        let closestIndex = 0;
        let minDistance = Infinity;

        for (let i = 0; i < coordinates.length; i++) {
            const distance = getDistance(location, coordinates[i]);
            if (distance < minDistance) {
                closestIndex = i;
                minDistance = distance;
            }
        }
        return closestIndex;
    };

    useEffect(() => {
        const animateMap = async () => {
            if (startNavigation && mapRef.current && currentLocation) {
                await mapRef.current.animateToRegion(
                    {
                        latitude: currentLocation?.latitude,
                        longitude: currentLocation?.longitude,
                        longitudeDelta: 0.005,
                        latitudeDelta: 0.005,
                    },
                    300
                );
                // await new Promise((resolve) => setTimeout(resolve, 300));
                // await mapRef.current.animateCamera({ heading: heading });
            }
        };

        animateMap();
    }, [heading, currentLocation, routeCoordinates, startNavigation]);

    useEffect(() => {
        if (selectedLocation && currentLocation) {
            getDistance();
        }
    }, [selectedLocation, currentLocation]);

    useEffect(() => {
        // console.log("currentLocation", currentLocation);
    }, [currentLocation]);

    const showSelectedLocation = () => {
        if (selectedLocation && selectedLocation.latitude && selectedLocation.longitude) {
            return (
                <Marker
                    coordinate={selectedLocation}
                    key={`locationView_${selectedLocation?.latitude}_${
                        selectedLocation?.longitude
                    }${Date.now()}`}
                    title={selectedLocation.address}
                >
                    <Image
                        source={icons.marker}
                        style={{ width: 40, height: 40 }}
                    />
                </Marker>
                // <Marker
                //     // key={`locationView_${Date.now()}`}
                //     key={`locationView_${selectedLocation?.latitude}_${selectedLocation?.longitude}${Date.now()}`}
                //     id="selectedLocation"
                //     coordinate={selectedLocation}
                //     tracksViewChanges={true}
                //     // title={selectedLocation.address}
                //     onPress={() => {
                //         console.log("here");
                //     }}
                // />
            );
        }
    };

    const handleRegionChange = (region) => {};

    const handleCustomLocationButton = () => {
        mapRef?.current?.animateToRegion({
            latitude: selectedLocation?.latitude,
            longitude: selectedLocation?.longitude,
            ...delta,
        });
    };

    const handleCurrentLocationButton = () => {
        // setIsCustomLocation(false);
        mapRef?.current?.animateToRegion({
            latitude: currentLocation?.latitude,
            longitude: currentLocation?.longitude,
            ...delta,
        });
    };

    const handleShowDirection = () => {
        setShowDirectionEnabled(true);
    };

    const handleCancelDirection = () => {
        setShowDirectionEnabled(false);
        setStartNavigation(false);
        handleCustomLocationButton();
    };

    const fitToMarkers = () => {
        mapRef.current.fitToCoordinates(routeCoordinates, {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }, // Adjust as needed
            animated: true,
        });
    };

    useEffect(() => {
        if (
            showDirectionEnabled &&
            !startNavigation &&
            routeCoordinates.length > 0
        ) {
            fitToMarkers();
        }
    }, [showDirectionEnabled, startNavigation, routeCoordinates]);

    const handleMapDirectionReady = (result) => {
        if (result && result.coordinates && result.coordinates.length > 0) {
            const initialBearing = result.coordinates[0].bearing;
            setHeading(initialBearing);
            setRouteCoordinates(result.coordinates);
        }
    };

    const handleStartNavigation = () => {
        setStartNavigation(true);
    };

    useEffect(() => {
        setInitialRegion({
            latitude: selectedLocation?.latitude || currentLocation?.latitude,
            longitude: selectedLocation?.longitude || currentLocation?.longitude,
            ...delta,
        });
        // if (!showDirectionEnabled && !startNavigation) {
        //     mapRef?.current?.animateToRegion({
        //         latitude: selectedLocation?.latitude,
        //         longitude: selectedLocation?.longitude,
        //         ...delta,
        //     });
        // }
    }, [selectedLocation, mapRef]);

    return (
        <SafeAreaView className="flex">
            <View className="overflow-hidden">
                <MapView
                    ref={mapRef}
                    className="w-full h-full"
                    provider={PROVIDER_GOOGLE}
                    initialRegion={initialRegion}
                    followsUserLocation={true}
                    showsUserLocation={true}
                    showsMyLocationButton={false}
                    showsCompass={false}
                    toolbarEnabled={true}
                    zoomEnabled={true}
                    rotateEnabled={true}
                    onRegionChangeComplete={handleRegionChange}
                    mapPadding={{ top: 54, right: 0, left: 0, bottom: 140 }}
                    initialCamera={{
                        heading: 0,
                        pitch: 0,
                        zoom: 16,
                        center: {
                            latitude: 0,
                            longitude: 0,
                        },
                    }}
                >
                    {/* {showLocationsOfInterest()} */}
                    {showSelectedLocation()}
                    {showDirectionEnabled &&
                        selectedLocation &&
                        currentLocation && (
                            <MapViewDirections
                                origin={currentLocation}
                                destination={selectedLocation}
                                apikey={system.GOOGLE_MAP_API_KEY}
                                strokeWidth={3}
                                strokeColor="hotpink"
                                onReady={handleMapDirectionReady}
                            />
                        )}
                </MapView>
                <View className="absolute z-50 flex flex-row mx-4">
                    <TouchableOpacity className="" onPress={handleCloseModal}>
                        <View className="flex items-center justify-center p-4 -ml-4">
                            <Ionicons name="close" size={24} color="black" />
                        </View>
                    </TouchableOpacity>
                </View>
                <View
                    className="absolute z-50 bottom-0 flex p-4 w-full"
                    style={{ pointerEvents: "box-none" }}
                >
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
                    </View>
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
                        {!showDirectionEnabled ? (
                            <CustomButton
                                title={t("show direction")}
                                handlePress={handleShowDirection}
                                containerStyles="bg-primary"
                                textStyles="text-white"
                            />
                        ) : (
                            <View className="flex flex-row justify-end">
                                <CustomButton
                                    title={t("cancel")}
                                    handlePress={handleCancelDirection}
                                    containerStyles="bg-gray-200 px-4 mr-2"
                                    textStyles="text-gray-500 text-sm"
                                />
                                <CustomButton
                                    title={t("start navigation")}
                                    handlePress={handleStartNavigation}
                                    containerStyles="bg-primary px-4"
                                    textStyles="text-white text-sm"
                                />
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default LocationView;
