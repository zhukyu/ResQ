import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    headers: {
        "Content-Type": "application/json",
    },
});

AsyncStorage.getItem("accessToken").then((accessToken) => {
    if (!accessToken) {
        AsyncStorage.removeItem("accessToken");
    } else {
        axiosInstance.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${accessToken}`;
    }
});

async function refreshAccessToken() {
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
        if (error.response?.status === 400 || error.response?.status === 401) {
            return null;
        }
        throw error;
    }
}

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Prevent infinite retry loop
            try {
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                    return axiosInstance(originalRequest);
                }
            } catch (error) {
                console.error("Failed to refresh token:", refreshError);
                return Promise.reject(error); // Or throw a custom error
            }
        } else {
            return Promise.reject(error);
        }
    }
);

export default axiosInstance;
