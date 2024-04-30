import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import AppNavigator from './navigation/AppNavigator'
import GlobalProvider, { useGlobalContext } from './context/GlobalProvider'
import { getCurrentUser } from './lib/appwrite'
import i18next from './lang/i18n'
import * as Location from "expo-location";
import Geocoding from 'react-native-geocoding';
import Toast from 'react-native-toast-message'

const App = () => {
    const [fontsLoaded, error] = useFonts({
        "Poppins-Black": require("./assets/fonts/Poppins-Black.ttf"),
        "Poppins-Bold": require("./assets/fonts/Poppins-Bold.ttf"),
        "Poppins-ExtraBold": require("./assets/fonts/Poppins-ExtraBold.ttf"),
        "Poppins-ExtraLight": require("./assets/fonts/Poppins-ExtraLight.ttf"),
        "Poppins-Light": require("./assets/fonts/Poppins-Light.ttf"),
        "Poppins-Medium": require("./assets/fonts/Poppins-Medium.ttf"),
        "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
        "Poppins-SemiBold": require("./assets/fonts/Poppins-SemiBold.ttf"),
        "Poppins-Thin": require("./assets/fonts/Poppins-Thin.ttf"),
        "Archivo-Bold": require("./assets/fonts/Archivo-Bold.ttf"),
    })

    const GOOGLE_MAPS_APIKEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY

    useEffect(() => {
        Location.requestForegroundPermissionsAsync();
        Geocoding.init(GOOGLE_MAPS_APIKEY);
    }, [])

    useEffect(() => {
        if (error) throw error;

        // if (fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded, error])

    if (!fontsLoaded && !error) return null;

    return (
        <GlobalProvider>
            <NavigationContainer>
                <AppNavigator />
            </NavigationContainer>
            <Toast />
        </GlobalProvider>
    )
}

export default App