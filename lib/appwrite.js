// import axiosInstance from "./AxiosInstance";

import axios from "axios";
import Config from "react-native-config";
import axiosInstance from "./AxiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { system } from "../constants";

export const appwriteConfig = {};

const fetchCurrentUser = async () => {
    try {
        const res = await axiosInstance.get("/user/profile");
        if (res.status === 200) {
            return res.data;
        }
    } catch (error) {
        throw error;
    }
};

export const getCurrentUser = async () => {
    try {
        const user = await fetchCurrentUser();
        return user;
    } catch (error) {
        return null;
    }
};

export const refreshAccessToken = async () => {
    try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        const res = await axiosInstance.post("/auth/refresh", {
            refreshToken: refreshToken,
        });
        if (res.status === 200) {
            AsyncStorage.setItem("accessToken", res.data.accessToken);
            axiosInstance.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${res.data.accessToken}`;
            return res.data.accessToken;
        }
    } catch (error) {
        // if (error.response.status === 400 || error.response.status === 401) {
        //     return null;
        // }
        throw error;
    }
};

export const logout = async () => {
    try {
        await AsyncStorage.removeItem("accessToken");
        await AsyncStorage.removeItem("refreshToken");
    } catch (error) {
        throw error;
    }
};

export const getAddress = async (latitude, longitude) => {
    try {
        const ApiKey = system.GOOGLE_MAP_API_KEY;

        const response = await axiosInstance.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${ApiKey}`
        );
        const data = response.data;

        if (data.status === "OK") {
            return data.results[0].formatted_address;
        }
        
    } catch (error) {
        throw error;
    }
};
