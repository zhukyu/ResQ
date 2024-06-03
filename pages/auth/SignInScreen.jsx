import {
    ActivityIndicator,
    Alert,
    Image,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { images, system } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import axiosInstance from "../../lib/AxiosInstance";
import { useGlobalContext } from "../../context/GlobalProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import LoadingOverlay from "../../components/LoadingOverlay";

const SignInScreen = () => {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });
    const [isSubbmitting, setIsSubbmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { setUser, setIsLoggedIn, setExpirationTime, setToast } =
        useGlobalContext();

    const navigation = useNavigation();

    const { t } = useTranslation();

    useEffect(() => {
        AsyncStorage.removeItem("accessToken");
        AsyncStorage.removeItem("refreshToken");
    }, []);

    const handleValidation = () => {
        let valid = true;
        const newErrors = { email: "", password: "" };

        if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = t("email must be valid");
            valid = false;
        }

        if (!form.email) {
            newErrors.email = t("email is required");
            valid = false;
        }

        if (!form.password) {
            newErrors.password = t("password is required");
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const submit = async () => {
        if (!handleValidation()) return;

        setIsSubbmitting(true);
        setErrors({ email: "", password: "" });

        const email = form.email.toLowerCase();
        const password = form.password;

        axiosInstance
            .post("/auth/login", {
                email: email,
                password: password,
            })
            .then((res) => {
                AsyncStorage.setItem("accessToken", res.data.accessToken);
                AsyncStorage.setItem("refreshToken", res.data.refreshToken);

                setUser(res.data.user);
                setIsLoggedIn(true);
                
                axiosInstance.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${res.data.accessToken}`;

                // set timer for refresh access token
                const expiration = new Date(
                    new Date().getTime() + system.refreshTime
                );
                setExpirationTime(expiration);

                setToast({
                    type: "success",
                    text1: t("success"),
                    text2: t("login success"),
                });

                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: "drawer" }],
                    })
                );
            })
            .catch((error) => {
                console.log("came ehere");
                console.log(error);
                if (error.response.status === 401) {
                    setToast({
                        type: "error",
                        text1: t("error"),
                        text2: t("invalid login"),
                    });
                } else {
                    setToast({
                        type: "error",
                        text1: t("error"),
                        text2: t("an error occurred"),
                    });
                }
            })
            .finally(() => {
                setIsSubbmitting(false);
            });
    };

    return (
        <SafeAreaView className="w-full h-full flex flex-grow justify-center items-center bg-white">
            <LoadingOverlay visible={isSubbmitting} />
            <ScrollView className="w-full">
                <ImageBackground
                    source={images.wallpaper}
                    className="flex w-screen h-screen justify-center items-center"
                    resizeMode="cover"
                >
                    <View
                        className="m-5 rounded-xl w-5/6 h-2/3"
                        style={{
                            shadowOffset: {
                                width: 0,
                                height: 3,
                            },
                            shadowColor: "#171717",
                            shadowOpacity: 0.2,
                            shadowRadius: 3.84,
                            elevation: 6,
                        }}
                    >
                        <View className="justify-center py-7 px-6 rounded-xl bg-white flex-1 overflow-visible shadow">
                            <View className="flex-row items-center justify-start gap-1">
                                <Image
                                    source={images.resqlogo}
                                    className="w-8 h-[36px]"
                                    resizeMode="contain"
                                />
                                <Text className="text-4xl font-archivobold text-primary">
                                    RES
                                    <Text className="text-secondary-200">
                                        Q
                                    </Text>
                                </Text>
                            </View>

                            <Text className="text-2xl font-smibold mt-7 font-bold">
                                {t("login header")}
                            </Text>

                            <FormField
                                title={t("email")}
                                name="email"
                                value={form.email}
                                placeholder={"name@example.com"}
                                handeChangeText={(text) =>
                                    setForm({ ...form, email: text })
                                }
                                otherStyles="mt-4"
                                keyboardType="email-address"
                                error={errors.email}
                            />
                            <FormField
                                title={t("password")}
                                name="password"
                                value={form.password}
                                placeholder={"********"}
                                handeChangeText={(text) =>
                                    setForm({ ...form, password: text })
                                }
                                showPassword={showPassword}
                                setShowPassword={setShowPassword}
                                otherStyles="mt-4"
                                error={errors.password}
                            />

                            <CustomButton
                                title={t("login")}
                                handlePress={submit}
                                containerStyles="w-full mt-7"
                                isLoading={isSubbmitting}
                            />

                            <View className="justify-center pt-5 flex-row gap-2">
                                <Text className="text-light font-medium text-gray-700">
                                    {t("dont have account")}
                                </Text>
                                <TouchableOpacity
                                    onPress={() =>
                                        navigation.navigate("Sign Up")
                                    }
                                >
                                    <Text className="text-primary font-semibold">
                                        {t("signup")}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ImageBackground>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SignInScreen;

const styles = StyleSheet.create({});
