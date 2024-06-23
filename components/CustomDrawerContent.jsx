import { View, Text, Alert, Image } from "react-native";
import React from "react";
import { useGlobalContext } from "../context/GlobalProvider";
import { useTranslation } from "react-i18next";
import axiosInstance from "../lib/AxiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Feather, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import CustomButton from "./CustomButton";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { disconnectSocket } from "../lib/socketInstance";
import { system } from "../constants";

const CustomDrawerContent = (props) => {
    const { user, setUser, setIsLoggedIn, setToast, setIsLoading } =
        useGlobalContext();
    const { t } = useTranslation();
    const navigation = useNavigation();

    const showAlert = () => {
        Alert.alert(
            t("logout"),
            t("logout confirmation"),
            [
                {
                    text: t("cancel"),
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                },
                { text: t("yes"), onPress: signOut },
            ],
            { cancelable: true }
        );
    };

    const signOut = () => {
        setIsLoading(true);
        axiosInstance
            .post("/auth/logout")
            .then((res) => {
                if (res.status === 200) {
                    setUser(null);
                    setIsLoggedIn(false);

                    AsyncStorage.removeItem("accessToken");
                    AsyncStorage.removeItem("refreshToken");

                    disconnectSocket();

                    setToast({
                        type: "success",
                        text1: t("success"),
                        text2: t("logout success"),
                    });

                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [{ name: "auth" }],
                        })
                    );
                }
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <DrawerContentScrollView {...props}>
            <View className="flex flex-col items-center justify-center p-4">
                {user && user?.avatar ? (
                    <Image
                        source={{
                            uri: user?.avatar,
                        }}
                        className="w-28 h-28 rounded-full"
                    />
                ) : (
                    <View className="w-28 h-28 rounded-full bg-[#CCCCCC] flex items-center justify-center">
                        <FontAwesome name="user" size={68} color="white" />
                    </View>
                )}
                <Text className="text-lg font-semibold mt-2">{user?.name}</Text>
                <Text className="text-sm text-gray-500">{user?.role}</Text>
            </View>
            <DrawerItem
                icon={({ color, size }) => (
                    <Feather name="user" size={size} color="gray" />
                )}
                label={t("profile")}
                labelStyle={{
                    marginLeft: -20,
                    fontSize: 16,
                    color: "gray",
                }}
                style={{
                    backgroundColor: "transparent",
                    borderRadius: 10,
                }}
                onPress={() => navigation.navigate("profile")}
            />
            {user?.role === system.USER_ROLE.RESCUER && (
                <DrawerItem
                    icon={({ color, size }) => (
                        <FontAwesome5 name="tasks" size={size} color="gray" />
                    )}
                    label={t("rescue management")}
                    labelStyle={{
                        marginLeft: -20,
                        fontSize: 16,
                        color: "gray",
                    }}
                    style={{
                        backgroundColor: "transparent",
                        borderRadius: 10,
                    }}
                    onPress={() => navigation.navigate("rescueManagement")}
                />
            )}
            <DrawerItem
                icon={({ color, size }) => (
                    <Feather name="settings" size={size} color="gray" />
                )}
                label={t("settings")}
                labelStyle={{
                    marginLeft: -20,
                    fontSize: 16,
                    color: "gray",
                }}
                style={{
                    backgroundColor: "transparent",
                    borderRadius: 10,
                }}
                onPress={() => navigation.navigate("setting")}
            />
            <CustomButton
                title={t("logout")}
                handlePress={showAlert}
                containerStyles="m-7"
            />
        </DrawerContentScrollView>
    );
};

export default CustomDrawerContent;
