import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://192.168.1.59:3000/api',
    headers: {
        "Content-Type": "application/json",
    }
});


AsyncStorage.getItem("accessToken").then((accessToken) => {
    if (!accessToken) {
        AsyncStorage.removeItem("accessToken");
    } else {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    }
})

axiosInstance.interceptors.request.use((response) => {
    return response;
}, (error) => {
    if (error.response.status === 401) {
        console.log("Unauthorized");
    } else {
        return Promise.reject(error);
    }
})

export default axiosInstance;
