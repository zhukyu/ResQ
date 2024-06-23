import {
    View,
    Text,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import LoadingOverlay from "../../components/LoadingOverlay";
import OutlinedFormField from "../../components/OutlinedFormField";
import CustomButton from "../../components/CustomButton";
import axiosInstance from "../../lib/AxiosInstance";
import { useGlobalContext } from "../../context/GlobalProvider";
import { emitWithToken } from "../../lib/socketInstance";

const CreateDangerZoneScreen = ({ route }) => {
    const { t } = useTranslation();
    const { request } = route.params;
    const { setToast } = useGlobalContext();
    const [dangerZone, setDangerZone] = useState(null);
    const [errors, setErrors] = useState({
        radius: "",
        message: "",
    });
    const [submitting, setSubmitting] = useState(false);

    const navigation = useNavigation();

    const validation = () => {
        let valid = true;
        const newErrors = { radius: "", message: "" };

        if (!dangerZone.radius) {
            newErrors.radius = t("radius is required");
            valid = false;
        }

        if (!dangerZone.message) {
            newErrors.message = t("message is required");
            valid = false;
        }

        if (dangerZone.radius <= 0) {
            newErrors.radius = t("radius must be greater than 0");
            valid = false;
        }

        if (dangerZone?.message?.length < 10) {
            newErrors.message = t("message must be at least 10 characters");
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const createDangerZone = async () => {
        try {
            emitWithToken("createDangerZone", {
                ...dangerZone
            });
            setToast({
                type: "success",
                text1: t("success"),
                text2: t("danger zone created"),
            });

            // navigation.navigate(`stack`, {
            //     screen: `requestDetail`,
            //     params: { id: request?.id },
            // });
            navigation.goBack();
        } catch (error) {
            console.log("createDangerZone error", error);
        }
    };

    const handleSubmit = () => {
        if (!validation()) return;

        Alert.alert(
            t("create danger zone"),
            t("create danger zone confirmation"),
            [
                {
                    text: t("cancel"),
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                },
                {
                    text: t("create"),
                    onPress: () => createDangerZone(),
                },
            ]
        );
    };

    useEffect(() => {
        setDangerZone({
            ...dangerZone,
            requestId: request?.id,
            address: request?.address,
        });
    }, [request]);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="flex-1">
                <LoadingOverlay visible={submitting} />
                <View className="p-4 bg-white">
                    <OutlinedFormField
                        label={`${t("radius")}`}
                        placeholder={`${t("radius")} (m)`}
                        keyboardType="numeric"
                        error={errors.radius}
                        onChangeText={(text) =>
                            setDangerZone({ ...dangerZone, radius: text })
                        }
                    />
                    <OutlinedFormField
                        label={`${t("message")}`}
                        placeholder={t("message")}
                        error={errors.message}
                        onChangeText={(text) =>
                            setDangerZone({ ...dangerZone, message: text })
                        }
                    />

                    <View className="mt-4">
                        <CustomButton
                            title={t("create")}
                            handlePress={handleSubmit}
                        />
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default CreateDangerZoneScreen;
