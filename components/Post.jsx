import {
    View,
    Text,
    Image,
    TouchableNativeFeedback,
    TouchableOpacity,
    Modal,
} from "react-native";
import React, { memo, useCallback, useMemo, useRef, useState } from "react";
import {
    AntDesign,
    EvilIcons,
    Feather,
    FontAwesome,
    FontAwesome5,
    FontAwesome6,
    MaterialIcons,
} from "@expo/vector-icons";
import { icons } from "../constants";
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import ImageCollage from "./ImageCollage";
import { useGlobalContext } from "../context/GlobalProvider";
import { useTranslation } from "react-i18next";
import { Menu } from "react-native-paper";
import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import LocationView from "./LocationView";

const MenuItem = ({ icon, title, description, onPress }) => (
    <TouchableNativeFeedback
        onPress={onPress}
    >
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

const Post = ({ item, isFullView }) => {
    const user = item.users;
    const navigation = useNavigation();
    const media = item.requestMedia;
    const { t } = useTranslation();
    const menuRef = useRef(null);

    const [isMapModalVisible, setIsMapModalVisible] = useState(false);

    const openMenu = useCallback(() => {
        menuRef.current?.present();
    }, []);

    const handleClose = useCallback(() => {
        menuRef.current?.dismiss();
    }, []);

    const handlePostPress = () => {
        navigation.navigate(`stack`, {
            screen: `requestDetail`,
            params: { id: item.id },
        });
    };

    const handleLocationPress = () => {
        handleClose();
        // navigation.navigate(`stack`, {
        //     screen: `locationView`,
        //     params: { item },
        // });
        setIsMapModalVisible(true);
    };

    const PostContent = useMemo(() => {
        return (
            <View
                className={`bg-white w-full py-3 mb-1 flex flex-col ${
                    item?.isEmergency && !isFullView
                        ? "border border-primary"
                        : null
                }`}
            >
                <View className="flex flex-row justify-center w-full px-4">
                    {user && user?.avatar ? (
                        <Image
                            source={{
                                uri: user?.avatar,
                            }}
                            className="w-9 h-9 rounded-full"
                        />
                    ) : (
                        <View className="w-9 h-9 rounded-full bg-[#CCCCCC] flex items-center justify-center">
                            <FontAwesome name="user" size={22} color="white" />
                        </View>
                    )}
                    <View className="flex flex-col ml-2 flex-grow">
                        <Text className="text-sm font-semibold">
                            {user?.name}
                        </Text>
                        <Text className="text-xs text-gray-500">
                            10km · 18:30
                        </Text>
                    </View>
                    <TouchableOpacity onPress={openMenu}>
                        <View className="flex flex-row justify-center items-center p-1">
                            <Feather
                                name="more-horizontal"
                                size={24}
                                color="gray"
                            />
                        </View>
                    </TouchableOpacity>
                </View>
                <View className="flex flex-col justify-center items-center w-full mt-3 px-4">
                    {item?.isEmergency ? (
                        <View className="flex justify-start items-center w-full flex-row mb-1">
                            <Text className="text-sm font-semibold text-primary">
                                ⚠️ {t("EMERGENCY")} ⚠️
                            </Text>
                        </View>
                    ) : null}
                    <Text
                        className="text-base text-gray-700 w-full"
                        numberOfLines={isFullView ? 0 : 3}
                    >
                        {item.content}
                    </Text>
                </View>
                {media && media.length > 0 ? (
                    <View
                        className="mt-2"
                        pointerEvents={isFullView ? "auto" : "none"}
                    >
                        <ImageCollage
                            images={media.map((image) => image.url)}
                        />
                    </View>
                ) : null}

                <View className="flex flex-row justify-between items-center w-full mt-3 px-4">
                    <View
                        className={`flex flex-row justify-center items-center border-[1px] border-gray-300 rounded-2xl px-2 py-1 ${
                            item?.isEmergency
                                ? "border-gray-300"
                                : "border-gray-300"
                        }`}
                    >
                        <Image
                            source={icons.upOutlined}
                            className="w-5 h-5 mr-3"
                            tintColor={"gray"}
                        />
                        <Text className="text-sm font-medium text-gray-500 mr-2">
                            12
                        </Text>
                        <Image
                            source={icons.line}
                            className="w-[1px] h-4 mr-2"
                            tintColor={"#DDDDDD"}
                        />
                        <Image
                            source={icons.downOutlined}
                            className="w-5 h-5"
                            tintColor={"gray"}
                        />
                    </View>

                    <View
                        className={`flex flex-row justify-center items-center border-[1px]  rounded-2xl px-2 py-1 ${
                            item?.isEmergency
                                ? "border-gray-300"
                                : "border-gray-300"
                        }`}
                    >
                        <View className="mr-1 w-5 h-5">
                            <FontAwesome
                                name="commenting-o"
                                size={18}
                                color="gray"
                            />
                        </View>
                        <Text className="text-sm font-medium text-gray-500 mr-2">
                            12 comments
                        </Text>
                    </View>
                </View>
            </View>
        );
    });

    return (
        <View className="">
            {isFullView ? (
                PostContent
            ) : (
                <TouchableNativeFeedback
                    delayPressIn={100}
                    onPress={handlePostPress}
                >
                    {PostContent}
                </TouchableNativeFeedback>
            )}
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
                            <FontAwesome6
                                name="location-dot"
                                size={24}
                                color="gray"
                            />
                        }
                        title={t("location")}
                        description={t("view location")}
                        onPress={handleLocationPress}
                    />
                    <MenuItem
                        title={t("chat")}
                        description={t("start chat")}
                        icon={
                            <MaterialIcons name="chat" size={24} color="gray" />
                        }
                        onPress={() => {}}
                    />
                </BottomSheetView>
            </BottomSheetModal>
            <Modal
                visible={isMapModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsMapModalVisible(false)}
            >
                <LocationView item={item} />
            </Modal>
        </View>
    );
};

export default memo(Post);
