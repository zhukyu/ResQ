import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Pressable,
    Image,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import MapView, {
    Circle,
    Geojson,
    Marker,
    PROVIDER_GOOGLE,
} from "react-native-maps";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import AvatarMenu from "../../components/AvatarMenu";
import Geocoding from "react-native-geocoding";
import { useIsFocused } from "@react-navigation/native";
import axiosInstance from "../../lib/AxiosInstance";
import { icons } from "../../constants";

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

const MapScreen = ({ route }) => {
    const { item } = route.params || {};

    const [initialRegion, setInitialRegion] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [delta, setDelta] = useState({
        latitudeDelta: 0.02,
        longitudeDelta: 0.01,
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [isCustomLocation, setIsCustomLocation] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const mapRef = useRef(null);
    const timeoutId = useRef(null);
    const isFocused = useIsFocused();

    const [dangerZones, setDangerZones] = useState([]);

    const handleSearchChange = (text) => {
        setSearchTerm(text);
        // if (onSearchChange) {
        //     onSearchChange(text);
        // }
    };

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
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                console.error("Location permission not granted!");
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setInitialRegion({
                latitude: location.coords?.latitude,
                longitude: location.coords?.longitude,
                ...delta,
            });
            setCurrentLocation({
                latitude: location.coords?.latitude,
                longitude: location.coords?.longitude,
            });
        })();
    }, []);

    useEffect(() => {
        const fetchDangerZones = async () => {
            try {
                const response = await axiosInstance.get("/danger");
                const result = await response.data;
                setDangerZones(result);
            } catch (error) {
                console.error("fetchDangerZones Error:", error);
            }
        };

        if (isFocused) {
            fetchDangerZones();
        }
    }, [isFocused]);

    const showLocationsOfInterest = () => {
        return places.map((place, index) => {
            return (
                <Marker
                    key={index}
                    coordinate={place.coordinates}
                    title={place.title}
                    description={place.description}
                />
            );
        });
    };

    const showSelectedLocation = () => {
        if (selectedLocation) {
            return (
                <Marker
                    coordinate={selectedLocation}
                    title={selectedLocation.address}
                />
            );
        }
    };

    const showDangerZones = () => {
        return dangerZones.map((dangerZone, index) => {
            const longitude = dangerZone?.location?.coordinates[0];
            const latitude = dangerZone?.location?.coordinates[1];

            console.log("Longitude:", longitude, "Latitude:", latitude);

            if (!longitude || !latitude) {
                return null;
            }

            return (
                <View key={index}>
                    <Marker
                        coordinate={{
                            latitude: latitude,
                            longitude: longitude,
                        }}
                        title={dangerZone?.message}
                    >
                        <Image
                            source={icons.marker}
                            style={{ width: 40, height: 40 }}
                        />
                    </Marker>
                    <Circle
                        key={index}
                        center={{
                            latitude: latitude,
                            longitude: longitude,
                        }}
                        radius={dangerZone?.radius}
                        fillColor="rgba(255, 0, 0, 0.2)"
                        strokeColor="red"
                    />
                </View>
            );
        });
    };

    const handleRegionChange = (region) => {};

    const handleCustomLocationButton = () => {
        // setIsCustomLocation(true);
    };

    const handleCurrentLocationButton = () => {
        // setIsCustomLocation(false);
        mapRef?.current?.animateToRegion({
            latitude: currentLocation?.latitude,
            longitude: currentLocation?.longitude,
            ...delta,
        });
    };

    const performReverseGeocoding = async (latitude, longitude) => {
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
        }
    };

    useEffect(() => {
        // console.log('Selected Location:', selectedLocation);
        mapRef?.current?.animateToRegion({
            latitude: selectedLocation?.latitude,
            longitude: selectedLocation?.longitude,
            ...delta,
        });
    }, [selectedLocation]);

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
                    showsCompass={true}
                    toolbarEnabled={true}
                    zoomEnabled={true}
                    rotateEnabled={true}
                    onRegionChangeComplete={handleRegionChange}
                    mapPadding={{ top: 54, right: 0, left: 0, bottom: 0 }}
                >
                    {/* {showLocationsOfInterest()} */}
                    {showSelectedLocation()}
                    {showDangerZones()}
                </MapView>
                <View className="absolute z-50 flex flex-row mx-4 my-[6]">
                    <View
                        className="bg-white py-2 px-3 rounded-lg flex-row items-center flex-1 mr-4"
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
                    <View className="flex items-center justify-center">
                        <AvatarMenu style={styles.shadow} />
                    </View>
                </View>
                <View className="absolute z-50 bottom-0 right-0 flex p-4 gap-3">
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={handleCustomLocationButton}
                        style={{
                            ...styles.shadow,
                            backgroundColor: "transparent",
                            borderRadius: 50,
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
                {isCustomLocation && (
                    <View
                        className="absolute z-50 top-1/2 left-1/2 -ml-[12] -mt-[5]"
                        style={{ pointerEvents: "none" }}
                    >
                        <FontAwesome6
                            name="location-dot"
                            size={30}
                            color="#F73334"
                        />
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

export default MapScreen;
