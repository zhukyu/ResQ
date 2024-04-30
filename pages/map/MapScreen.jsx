import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MapView, { Geojson, Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome, FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import AvatarMenu from '../../components/AvatarMenu';
import Geocoding from 'react-native-geocoding';

const styles = StyleSheet.create({
    shadow: {
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowColor: 'black',
        shadowOpacity: 1,
        shadowRadius: 1,
        elevation: 5,
    }
})

const MapScreen = () => {
    const places = [
        {
            id: 1,
            title: 'Da Nang',
            description: 'Da Nang city',
            coordinates: {
                latitude: 16.0667,
                longitude: 108.2167,
            },
        },
        {
            id: 2,
            title: 'Hoi An',
            description: 'Hoi An ancient town',
            coordinates: {
                latitude: 15.8801,
                longitude: 108.3380,
            },
        },
        {
            id: 3,
            title: 'Hue',
            description: 'Hue city',
            coordinates: {
                latitude: 16.4637,
                longitude: 107.5909,
            },
        },
        // {
        //     id: 4,
        //     title: 'Home',
        //     description: 'This is my home',
        //     coordinates: {
        //         latitude: 16.0187788,
        //         longitude: 108.2556329,
        //     },
        // }
    ]

    const [initialRegion, setInitialRegion] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [delta, setDelta] = useState({
        latitudeDelta: 0.02,
        longitudeDelta: 0.01,
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [isCustomLocation, setIsCustomLocation] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const mapRef = useRef(null);
    const timeoutId = useRef(null);

    const handleSearchChange = (text) => {
        setSearchTerm(text);
        // if (onSearchChange) {
        //     onSearchChange(text);
        // }
    };

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Location permission not granted!');
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

    const showLocationsOfInterest = () => {
        return places.map((place, index) => {
            return (
                <Marker
                    key={index}
                    coordinate={place.coordinates}
                    title={place.title}
                    description={place.description}
                />
            )
        })
    }

    const handleRegionChange = (region) => {
        // console.log('Region:', region);
        clearTimeout(timeoutId.current);

        timeoutId.current = setTimeout(() => {
            if (isCustomLocation) {
                performReverseGeocoding(region.latitude, region.longitude);
            } else {
                performReverseGeocoding(currentLocation?.latitude, currentLocation?.longitude);
            }
        }, 500);
    };

    const handleCustomLocationButton = () => {
        setIsCustomLocation(true);
    }

    const handleCurrentLocationButton = () => {
        setIsCustomLocation(false);
        mapRef?.current?.animateToRegion({
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            ...delta
        })
    }

    const performReverseGeocoding = async (latitude, longitude) => {
        try {
            // let addresses = await Geocoding.from(latitude, longitude)
            // const addressComponent = addresses.results[0]; // Use the first address
            // console.log(addressComponent.formatted_address);
            try {
                let addresses = await Location.reverseGeocodeAsync({
                    latitude,
                    longitude
                });
                const addressComponent = addresses[0]; // Use the first address
                setSelectedLocation({
                    latitude,
                    longitude,
                    address: addressComponent?.formattedAddress
                });
            } catch (error) {
                console.error("Reverse Geocoding Error:", error);
            }
        } catch (error) {
            console.error("Reverse Geocoding Error:", error);
        }
    }

    useEffect(() => {
        console.log('Selected Location:', selectedLocation);
    }, [selectedLocation])

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
                    {showLocationsOfInterest()}
                </MapView>
                <View className="absolute z-50 flex flex-row mx-4 my-2">
                    <View className="bg-white py-2 px-3 rounded-lg flex-row items-center flex-1 mr-4" style={styles.shadow}>
                        <View className="mr-3">
                            <FontAwesome name="search" size={18} color="gray" />
                        </View>
                        <TextInput
                            className="flex-1 text-base font-medium text-gray-900"
                            placeholder="Search"
                            onChangeText={handleSearchChange}
                            value={searchTerm}
                            cursorColor={'#000'}
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
                            backgroundColor: 'transparent',
                            borderRadius: 50,
                        }}
                    >
                        <View className="rounded-full bg-white h-12 w-12 flex items-center justify-center">
                            <FontAwesome6 name="location-dot" size={22} color="gray" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={handleCurrentLocationButton}
                        style={{
                            ...styles.shadow,
                            backgroundColor: 'transparent',
                            borderRadius: 50,
                        }}
                    >
                        <View className="rounded-full bg-white h-12 w-12 flex items-center justify-center">
                            <MaterialIcons name="gps-fixed" size={22} color="gray" />
                        </View>
                    </TouchableOpacity>
                </View>
                {isCustomLocation && (
                    <View className="absolute z-50 top-1/2 left-1/2 -ml-[12] -mt-[5]" style={{ pointerEvents: 'none' }}>
                        <FontAwesome6 name="location-dot" size={30} color="#F73334" />
                    </View>
                )}
            </View>
        </SafeAreaView>
    )
}

export default MapScreen