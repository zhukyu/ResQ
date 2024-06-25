import {
    View,
    Text,
    TouchableNativeFeedback,
    TouchableOpacity,
    Alert,
} from "react-native";
import React, { useState, useRef } from "react";
import {
    Feather,
    FontAwesome,
    FontAwesome5,
    FontAwesome6,
    MaterialCommunityIcons,
    MaterialIcons,
    Octicons,
} from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import { emitWithToken, socket } from "../lib/socketInstance";
import { useGlobalContext } from "../context/GlobalProvider";
import LoadingOverlay from "./LoadingOverlay";
import { system } from "../constants";
import { useNavigation } from "@react-navigation/native";

const MenuItem = ({ icon, title, description, onPress }) => (
    <TouchableNativeFeedback onPress={onPress}>
        <View className="flex flex-row items-center p-2">
            <View className="w-12 flex items-center justify-center">
                {icon}
            </View>
            <View className="flex">
                <Text className="text-base font-medium ml-2 text-gray-700">
                    {title}
                </Text>
                <Text className="text-sm font-normal ml-2 text-gray-500">
                    {description}
                </Text>
            </View>
        </View>
    </TouchableNativeFeedback>
);

const StatusBadge = ({ status }) => {
    const { t } = useTranslation();

    const getStatusProps = (status) => {
        switch (status) {
            case "active":
                return {
                    text: t("active"),
                    style: "border-green-500 bg-green-300",
                };
            case "deleted":
                return {
                    text: t("deleted"),
                    style: "border-gray-500 bg-gray-300",
                };
            default:
                return {
                    text: t("deleted"),
                    style: "border-gray-500 bg-gray-300",
                };
        }
    };

    const { text, style } = getStatusProps(status);

    return (
        <View
            className={`flex flex-row items-center justify-center rounded-full px-2 py-1 border ${style}`}
        >
            <Text className="text-xs font-rregular text-white">{text}</Text>
        </View>
    );
};

const DangerZoneItem = ({ item, triggerRefresh }) => {
    const { t } = useTranslation();
    const menuRef = useRef(null);
    const { setToast } = useGlobalContext();
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const openMenu = () => {
        menuRef.current?.present();
    };

    const handleClose = () => {
        menuRef.current?.close();
    };

    const handleEditPress = () => {
        handleClose();
        navigation.navigate(`stack`, {
            screen: `editDangerZone`,
            params: {
                requestId: item?.requestId,
            },
        });
    };

    const handleRequestDetailPress = () => {
        handleClose();
        navigation.navigate(`stack`, {
            screen: `requestDetail`,
            params: {
                id: item?.requestId,
            },
        });
    };

    const deleteDangerZone = async () => {
        try {
            setLoading(true);
            emitWithToken("deleteDangerArea", { requestId: item?.requestId });

            const timeout = setTimeout(() => {
                setLoading(false);
                socket.off("dangerAreaDeleted");
                setToast({
                    type: "error",
                    text1: t("error"),
                    text2: t("danger zone deletion timeout"),
                });
            }, 10000);

            socket.on("dangerAreaDeleted", (data) => {
                clearTimeout(timeout);
                setToast({
                    type: "success",
                    text1: t("success"),
                    text2: t("danger zone deleted"),
                });
                triggerRefresh();
                setLoading(false);
                socket.off("dangerAreaDeleted");
            });
        } catch (error) {
            console.log("error in deleting danger zone", error);
        }
    };

    const handleDeletePress = () => {
        handleClose();
        Alert.alert(
            t("delete danger zone"),
            t("delete danger zone confirmation"),
            [
                {
                    text: t("cancel"),
                    onPress: () => {},
                    style: "cancel",
                },
                {
                    text: t("delete"),
                    onPress: deleteDangerZone,
                    style: "destructive",
                },
            ],
            { cancelable: true }
        );
    };

    const reopenDangerZone = async () => {
        try {
            setLoading(true);
            emitWithToken("reopenDangerArea", { requestId: item?.requestId });

            const timeout = setTimeout(() => {
                setLoading(false);
                setToast({
                    type: "error",
                    text1: t("error"),
                    text2: t("danger zone reopening timeout"),
                });
                socket.off("dangerAreaReopened");
            }, 10000);

            socket.on("dangerAreaReopened", (data) => {
                clearTimeout(timeout);
                setToast({
                    type: "success",
                    text1: t("success"),
                    text2: t("danger zone reopened"),
                });
                triggerRefresh();
                setLoading(false);
                socket.off("dangerAreaReopened");
            });
        } catch (error) {
            console.log("error in reopening danger zone", error);
        }
    };

    const handleReopenPress = () => {
        handleClose();
        Alert.alert(
            t("reopen danger zone"),
            t("reopen danger zone confirmation"),
            [
                {
                    text: t("cancel"),
                    onPress: () => {},
                    style: "cancel",
                },
                {
                    text: t("reopen"),
                    onPress: reopenDangerZone,
                    style: "default",
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <View className="">
            <LoadingOverlay visible={loading} />
            <TouchableNativeFeedback onPress={openMenu}>
                <View className="bg-white p-4 mb-2">
                    <View className="flex flex-row items-center justify-between mb-1">
                        <View className="flex flex-row items-center justify-start flex-grow">
                            <View className="w-6 h-6 flex items-start justify-center">
                                <FontAwesome6
                                    name="location-dot"
                                    size={22}
                                    color="#F73334"
                                />
                            </View>
                            <Text className="text-sm font-rmedium text-gray-800 max-w-[70%]">
                                {item?.address}
                            </Text>
                        </View>

                        <View className="ml-1">
                            <StatusBadge status={item?.status} />
                        </View>
                    </View>
                    <View className="flex flex-row items-center justify-between">
                        <View className="flex flex-row items-center justify-start flex-grow">
                            <View className="w-6 h-6 flex items-start justify-center">
                                <FontAwesome
                                    name="warning"
                                    size={18}
                                    color="#F73334"
                                />
                            </View>
                            <Text className="text-sm font-rregular text-gray-600 max-w-[70%]">
                                {item?.message}
                            </Text>
                        </View>
                        <View className="flex flex-row items-center justify-start">
                            <View className="w-6 h-6 flex items-start justify-center">
                                <FontAwesome5
                                    name="dot-circle"
                                    size={20}
                                    color="#F73334"
                                />
                            </View>
                            <Text className="text-sm font-rregular text-gray-600">
                                {item?.radius} m
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableNativeFeedback>
            <BottomSheetModal
                ref={menuRef}
                enablePanDownToClose={true}
                enableDynamicSizing={true}
                backdropComponent={(props) => (
                    <BottomSheetBackdrop
                        {...props}
                        opacity={0.5}
                        enableTouchThrough={false}
                        appearsOnIndex={0}
                        disappearsOnIndex={-1}
                    />
                )}
            >
                <BottomSheetView style="">
                    <MenuItem 
                        icon={
                            <MaterialCommunityIcons
                                name="information"
                                size={24}
                                color="gray"
                            />
                        }
                        title={t("request detail")}
                        description={t("view request detail")}
                        onPress={handleRequestDetailPress}
                    />
                    {item?.status === system.DANGER_AREA_STATUS.ACTIVE && (
                        <>
                            <MenuItem
                                icon={
                                    <MaterialIcons
                                        name="delete"
                                        size={24}
                                        color="gray"
                                    />
                                }
                                title={t("delete")}
                                description={t("delete danger zone")}
                                onPress={handleDeletePress}
                            />
                            <MenuItem
                                icon={
                                    <MaterialIcons
                                        name="edit"
                                        size={24}
                                        color="gray"
                                    />
                                }
                                title={t("edit")}
                                description={t("edit danger zone")}
                                onPress={handleEditPress}
                            />
                        </>
                    )}
                    {item?.status === system.DANGER_AREA_STATUS.DELETED && (
                        <MenuItem
                            icon={
                                <Octicons
                                    name="issue-reopened"
                                    size={24}
                                    color="gray"
                                />
                            }
                            title={t("reopen")}
                            description={t("reopen danger zone")}
                            onPress={handleReopenPress}
                        />
                    )}
                </BottomSheetView>
            </BottomSheetModal>
        </View>
    );
};

export default DangerZoneItem;
