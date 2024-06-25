import {
    View,
    Text,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
    Image,
    TouchableOpacity,
    TouchableNativeFeedback,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../lib/AxiosInstance";
import FormField from "../../components/FormField";
import { TextInput } from "react-native-paper";
import OutlinedFormField from "../../components/OutlinedFormField";
import OutlinedDatePicker from "../../components/OutlinedDatePicker";
import CustomButton from "../../components/CustomButton";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useNavigation } from "@react-navigation/native";
import LoadingOverlay from "../../components/LoadingOverlay";

const UpdateUserProfileScreen = () => {
    const { t } = useTranslation();
    const { setToast, setUser } = useGlobalContext();
    const [profile, setProfile] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [fetching, setFetching] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const navigation = useNavigation();

    const fetchData = async () => {
        try {
            setFetching(true);
            const response = await axiosInstance.get("/user/update");
            if (response?.status === 200) {
                setProfile(response.data);
                setAvatarUrl(response.data.avatar);
            }
        } catch (error) {
            console.log("error", error);
        } finally {
            setFetching(false);
        }
    };

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 3],
            quality: 1,
            allowsMultipleSelection: false,
        });

        if (!result.canceled) {
            const seletectedImage = result.assets[0];
            setAvatar(seletectedImage);
        }
    };

    const uploadImages = async (image) => {
        const formData = new FormData();
        formData.append("files", {
            uri: image.uri,
            name: image.fileName,
            type: image.mimeType,
        });
        const response = await axiosInstance.post("/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data.data;
    };

    useEffect(() => {
        console.log("avatar", avatar?.uri);
    }, [avatar]);

    const updateProfile = async () => {
        try {
            setSubmitting(true);
            let _avatarUrl = avatarUrl;

            if (avatar) {
                const response = await uploadImages(avatar);
                _avatarUrl = response[0].url;
            }

            const data = {
                name: profile.name,
                dob: profile.dob,
                phoneNumber: profile.phoneNumber,
                address: profile.address,
            };

            if (_avatarUrl) {
                data.avatar = _avatarUrl;
            }

            const response = await axiosInstance.put("/user/update", data);
            if (response?.status === 200) {
                setToast({
                    type: "success",
                    text1: t("success"),
                    text2: t("profile updated successfully"),
                });
                setUser(response.data);

                navigation.goBack();
            }
        } catch (error) {
            console.log("error", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdatePress = async () => {
        Alert.alert(t("update profile"), t("update profile confirmation"), [
            {
                text: t("cancel"),
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
            },
            { text: t("ok"), onPress: () => updateProfile() },
        ]);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="flex-1">
                <LoadingOverlay visible={submitting} />
                <View className="bg-white p-4">
                    <View className="flex items-center justify-center">
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={pickImage}
                        >
                            <View className="w-28 h-28 rounded-full mb-4">
                                {avatar ? (
                                    <Image
                                        source={{ uri: avatar.uri }}
                                        className="w-full h-full rounded-full border-4 border-white"
                                    />
                                ) : avatarUrl ? (
                                    <Image
                                        source={{
                                            uri: avatarUrl,
                                        }}
                                        className="w-full h-full rounded-full border-4 border-white"
                                    />
                                ) : (
                                    <View className="w-full h-full rounded-full bg-[#CCCCCC] flex items-center justify-center border-4 border-white">
                                        <FontAwesome
                                            name="user"
                                            size={62}
                                            color="white"
                                        />
                                    </View>
                                )}
                                <View className="rounded-full overflow-hidden absolute bottom-0 right-0 ">
                                    <View className="bg-slate-100 rounded-full p-2 border-2 border-white overflow-hidden">
                                        <FontAwesome
                                            name="camera"
                                            size={12}
                                            color="gray"
                                        />
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <OutlinedFormField
                        title={t("name")}
                        name="name"
                        value={profile?.name}
                        placeholder={t("name")}
                        handeChangeText={(text) =>
                            setProfile({ ...profile, name: text })
                        }
                    />
                    <OutlinedDatePicker
                        title={t("dob")}
                        date={profile?.dob}
                        setDate={(date) =>
                            setProfile({ ...profile, dob: date })
                        }
                    />
                    <OutlinedFormField
                        title={t("phone number")}
                        name="phoneNumber"
                        value={profile?.phoneNumber}
                        placeholder={t("phone")}
                        handeChangeText={(text) =>
                            setProfile({ ...profile, phoneNumber: text })
                        }
                    />
                    <OutlinedFormField
                        title={t("address")}
                        name="address"
                        value={profile?.address}
                        placeholder={t("address")}
                        handeChangeText={(text) =>
                            setProfile({ ...profile, address: text })
                        }
                    />

                    <CustomButton
                        title={t("update")}
                        handlePress={handleUpdatePress}
                        containerStyles="mt-2 rounded-full min-h-[20px] py-2"
                        textStyles="font-rmedium text-lg text-white"
                    />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default UpdateUserProfileScreen;
