// import axiosInstance from "./AxiosInstance";

import axios from "axios";
import Config from "react-native-config";
import axiosInstance from "./AxiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const appwriteConfig = {

}

export const getCurrentUser = async () => {
    try {
        const res = await axiosInstance.get("/user/profile")
        if (res.status === 200 ) {
            return res.data
        }
    } catch (error) {
        if (error.response.status === 401) {
            // try {
            //     const accessToken = await refreshAccessToken()
            //     if (accessToken) {
            //         const res = await axiosInstance.get("/user/profile")
            //         if (res.status === 200) {
            //             return res.data
            //         }
            //     }
            // } catch (error) {
            //     console.log("qqrqrgqgqg");
            //     if (error.response.status === 401) {
            //         return null
            //     }
            // }
        }
        return null
    }
}

export const refreshAccessToken = async () => {
    try {
        const refreshToken = await AsyncStorage.getItem("refreshToken")
        const res = await axiosInstance.post("/auth/refresh", {
            refreshToken: refreshToken
        })
        if (res.status === 200) {
            AsyncStorage.setItem("accessToken", res.data.accessToken)
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`
            return res.data.accessToken
        }
    } catch (error) {
        if (error.response.status === 400) {
            return null
        }
        console.error(error)
        return null
    }
}
