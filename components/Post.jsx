import {
    View,
    Text,
    Image,
    TouchableNativeFeedback,
    TouchableOpacity,
    Modal,
    Alert,
} from "react-native";
import React, {
    memo,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    AntDesign,
    EvilIcons,
    Feather,
    FontAwesome,
    FontAwesome5,
    FontAwesome6,
    MaterialIcons,
} from "@expo/vector-icons";
import { icons, system } from "../constants";
import { useNavigation } from "@react-navigation/native";
import ImageCollage from "./ImageCollage";
import { useGlobalContext } from "../context/GlobalProvider";
import { useTranslation } from "react-i18next";
import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import LocationView from "./LocationView";
import { formatTime } from "../lib/helpers";
import axiosInstance from "../lib/AxiosInstance";
import { emitWithToken, socket } from "../lib/socketInstance";

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

const Footer = ({
    item,
    initVoteType,
    initVoteCount,
    commentCount,
    onCommentPress,
}) => {
    const { t } = useTranslation();

    const [voteType, setVoteType] = useState(
        initVoteType || system.VOTE_TYPE.NONE
    );
    const [voteCount, setVoteCount] = useState(initVoteCount);

    const vote = async (voteType) => {
        const response = await axiosInstance.post(`requests/${item?.id}/vote`, {
            voteType,
        });
        if (response.status === 200) {
            setVoteCount(response.data.voteCount);
            setVoteType(voteType);
        }
    };

    const handleUpvotePress = async () => {
        if (voteType === system.VOTE_TYPE.UPVOTE) {
            vote(system.VOTE_TYPE.NONE);
        } else {
            vote(system.VOTE_TYPE.UPVOTE);
        }
    };

    const handleDownvotePress = () => {
        if (voteType === system.VOTE_TYPE.DOWNVOTE) {
            vote(system.VOTE_TYPE.NONE);
        } else {
            vote(system.VOTE_TYPE.DOWNVOTE);
        }
    };

    const handleCommentPress = () => {
        if (onCommentPress) {
            onCommentPress();
        }
    };

    useEffect(() => {
        setVoteCount(initVoteCount);
    }, [initVoteCount]);

    useEffect(() => {
        setVoteType(initVoteType || system.VOTE_TYPE.NONE);
    }, [initVoteType]);

    return (
        <View className="flex flex-row justify-between items-center w-full mt-3 px-4">
            <View
                className={`flex flex-row justify-center items-center border-[1px] border-gray-300 rounded-2xl overflow-hidden`}
            >
                <TouchableNativeFeedback onPress={handleUpvotePress}>
                    <View className="flex flex-row px-2 py-1">
                        <Image
                            source={
                                voteType === system.VOTE_TYPE.UPVOTE
                                    ? icons.upFilled
                                    : icons.upOutlined
                            }
                            className="w-6 h-6 mr-3 "
                            tintColor={
                                voteType === system.VOTE_TYPE.UPVOTE
                                    ? "#F73334"
                                    : "gray"
                            }
                        />
                        <Text className="text-sm font-rregular text-gray-500">
                            {voteCount}
                        </Text>
                    </View>
                </TouchableNativeFeedback>
                <Image
                    source={icons.line}
                    className="w-[1px] h-4"
                    tintColor={"#DDDDDD"}
                />
                <TouchableNativeFeedback onPress={handleDownvotePress}>
                    <View className="flex flex-row px-2 py-1">
                        <Image
                            source={
                                voteType === system.VOTE_TYPE.DOWNVOTE
                                    ? icons.downFilled
                                    : icons.downOutlined
                            }
                            className="w-6 h-6"
                            tintColor={
                                voteType === system.VOTE_TYPE.DOWNVOTE
                                    ? "#F73334"
                                    : "gray"
                            }
                        />
                    </View>
                </TouchableNativeFeedback>
            </View>
            <View className="rounded-2xl overflow-hidden">
                <TouchableNativeFeedback onPress={handleCommentPress}>
                    <View
                        className={`flex flex-row justify-center items-center border-[1px]  rounded-2xl px-2 py-1 border-gray-300`}
                    >
                        <View className="mr-1 w-6 h-6">
                            <FontAwesome
                                name="commenting-o"
                                size={22}
                                color="gray"
                            />
                        </View>
                        <Text className="text-sm font-rregular text-gray-500 mr-2">
                            {commentCount} {t("comments")}
                        </Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
        </View>
    );
};

const StatusBadge = ({ status }) => {
    const { t } = useTranslation();

    const getStatusProps = (status) => {
        switch (status) {
            case system.REQUEST_STATUS.PENDING:
                return {
                    text: t("pending"),
                    style: "border-orange-500 bg-orange-300",
                };
            case system.REQUEST_STATUS.RESCUING:
                return {
                    text: t("rescuing"),
                    style: "border-indigo-500 bg-indigo-300",
                };
            case system.REQUEST_STATUS.RESCUED:
                return {
                    text: t("rescued"),
                    style: "border-emerald-500 bg-emerald-300",
                };
            case system.REQUEST_STATUS.REJECTED:
                return {
                    text: t("rejected"),
                    style: "border-red-500 bg-red-300",
                };
            default:
                return {
                    text: "",
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

const RequestTypeBadge = ({ type }) => {
    return (
        <View>
            {type ? (
                <View className="mx-4 mt-2">
                    <Text className="text-sm font-rbold  text-primary">
                        #{type?.name}
                    </Text>
                </View>
            ) : null}
        </View>
    );
};

const Post = ({
    item,
    isFullView,
    initVoteCount,
    commentCount,
    refreshList,
    onCommentPress,
    initVoteType,
}) => {
    const requester = item.users;
    const rescuerId = item.rescuerId;
    const dangerStatus = item.dangerStatus;
    const { user, setToast } = useGlobalContext();
    const navigation = useNavigation();
    const media = item.requestMedia;
    const { t } = useTranslation();
    const menuRef = useRef(null);

    const [isMapModalVisible, setIsMapModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const isRequester = requester?.id === user?.id;
    const isRescuer = user?.role === system.USER_ROLE.RESCUER;
    const isNotRequester = requester?.id !== user?.id;
    const isRescuerSelf = rescuerId === user?.id;
    const isDangerZoneCreated =
        dangerStatus === system.DANGER_AREA_STATUS.ACTIVE;

    const openMenu = useCallback(() => {
        menuRef.current?.present();
    }, []);

    const handleClose = useCallback(() => {
        menuRef.current?.dismiss();
    }, []);

    const finishRequest = async (requestId) => {
        try {
            const status = system.REQUEST_STATUS.RESCUED;
            const response = await axiosInstance.put(
                `/requests/${requestId}?status=${status}`
            );
            if (response.status === 200) {
                if (refreshList) {
                    refreshList();
                }

                navigation.navigate("request", {
                    triggerRefresh: true,
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const acceptRequest = async (requestId) => {
        try {
            const status = system.REQUEST_STATUS.RESCUING;
            const response = await axiosInstance.put(
                `/requests/${requestId}?status=${status}`
            );
            if (response.status === 200) {
                if (refreshList) {
                    refreshList();
                }

                setToast({
                    type: "success",
                    text1: t("success"),
                    text2: t("request accepted"),
                });

                handlePostPress();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const rejectRequest = async (requestId) => {
        try {
            const status = system.REQUEST_STATUS.PENDING;
            const response = await axiosInstance.put(
                `/requests/${requestId}?status=${status}`
            );
            if (response.status === 200) {
                if (refreshList) {
                    refreshList();
                }

                setToast({
                    type: "success",
                    text1: t("success"),
                    text2: t("request rejected"),
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handlePostPress = () => {
        navigation.navigate(`stack`, {
            screen: `requestDetail`,
            params: { id: item?.id },
        });
    };

    const handleLocationPress = () => {
        handleClose();
        setIsMapModalVisible(true);
    };

    const handlePress = () => {
        handleClose();
        navigation.navigate(`stack`, {
            screen: `chat`,
            params: {
                opponentId: requester?.id,
            },
        });
    };

    const handleFinishRequestPress = () => {
        handleClose();
        Alert.alert(t("finish request"), t("finish request description"), [
            {
                text: t("cancel"),
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
            },
            {
                text: t("finish"),
                onPress: () => finishRequest(item?.id),
            },
        ]);
    };

    const handleAcceptRequestPress = async () => {
        handleClose();
        Alert.alert(t("accept request"), t("accept request confirmation"), [
            {
                text: t("cancel"),
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
            },
            {
                text: t("accept"),
                onPress: () => acceptRequest(item?.id),
            },
        ]);
    };

    const handleCreateDangerZonePress = () => {
        handleClose();
        navigation.navigate(`stack`, {
            screen: `dangerZone`,
            params: {
                request: item,
            },
        });
    };

    const deleteDangerZone = async (requestId) => {
        try {
            setLoading(true);
            emitWithToken("deleteDangerArea", { requestId: requestId });

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
                setLoading(false);
                socket.off("dangerAreaDeleted");

                if (refreshList) {
                    refreshList();
                }
            });
        } catch (error) {
            console.log("error in deleting danger zone", error);
        }
    };

    const handleDeleteDangerZonePress = () => {
        handleClose();
        Alert.alert(
            t("delete danger zone"),
            t("delete danger zone confirmation"),
            [
                {
                    text: t("cancel"),
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                },
                {
                    text: t("delete"),
                    onPress: () => deleteDangerZone(item?.id),
                },
            ]
        );
    }

    const handleRejectRequestPress = async () => {
        handleClose();
        Alert.alert(t("reject request"), t("reject request confirmation"), [
            {
                text: t("cancel"),
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
            },
            {
                text: t("reject"),
                onPress: () => rejectRequest(item?.id),
            },
        ]);
    };

    const ImageRender = useMemo(() => {
        if (media && media.length > 0) {
            return (
                <View
                    className="mt-2"
                    pointerEvents={isFullView ? "auto" : "none"}
                >
                    <ImageCollage images={media.map((image) => image.url)} />
                </View>
            );
        } else {
            return null;
        }
    }, [media]);

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
                    {requester && requester?.avatar ? (
                        <Image
                            source={{
                                uri: requester?.avatar,
                            }}
                            className="w-9 h-9 rounded-full"
                        />
                    ) : (
                        <View className="w-9 h-9 rounded-full bg-[#CCCCCC] flex items-center justify-center">
                            <FontAwesome name="user" size={22} color="white" />
                        </View>
                    )}
                    <View className="flex flex-row flex-grow items-center">
                        <View className="flex flex-col ml-2 ">
                            <Text className="text-sm font-rbold">
                                {requester?.name}
                            </Text>
                            <Text className="text-xs text-gray-500">
                                {item?.distance}km ·{" "}
                                {formatTime(item?.createdAt)}
                            </Text>
                        </View>
                        <View className="ml-2">
                            <StatusBadge status={item?.status} />
                        </View>
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
                            <Text className="text-base font-rbold text-primary">
                                ⚠️ {t("EMERGENCY REQUEST")} ⚠️
                            </Text>
                        </View>
                    ) : (
                        <Text
                            className="text-base font-rregular text-gray-700 w-full"
                            numberOfLines={isFullView ? 0 : 3}
                        >
                            {item.content}
                        </Text>
                    )}
                </View>
                <RequestTypeBadge type={item?.requestTypes} />
                {ImageRender}

                <Footer
                    item={item}
                    initVoteCount={initVoteCount}
                    commentCount={commentCount}
                    initVoteType={initVoteType}
                    onCommentPress={onCommentPress}
                />
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
                    {isRequester ? (
                        <MenuItem
                            title={t("finish request")}
                            description={t("finish request description")}
                            icon={
                                <FontAwesome5
                                    name="flag-checkered"
                                    size={24}
                                    color="gray"
                                />
                            }
                            onPress={handleFinishRequestPress}
                        />
                    ) : (
                        <MenuItem
                            title={t("chat")}
                            description={t("start chat")}
                            icon={
                                <MaterialIcons
                                    name="chat"
                                    size={24}
                                    color="gray"
                                />
                            }
                            onPress={handlePress}
                        />
                    )}
                    {isRescuer && !rescuerId && isNotRequester && (
                        <MenuItem
                            title={t("accept request")}
                            description={t("accept request description")}
                            icon={
                                <FontAwesome
                                    name="check"
                                    size={24}
                                    color="gray"
                                />
                            }
                            onPress={handleAcceptRequestPress}
                        />
                    )}
                    {rescuerId && isRescuerSelf && isNotRequester && (
                        <>
                            {isDangerZoneCreated ? (
                                <MenuItem
                                    title={t("delete danger zone")}
                                    description={t(
                                        "delete danger zone description"
                                    )}
                                    icon={
                                        <FontAwesome
                                            name="exclamation-triangle"
                                            size={24}
                                            color="gray"
                                        />
                                    }
                                    onPress={handleDeleteDangerZonePress}
                                />
                            ) : (
                                <MenuItem
                                    title={t("create danger zone")}
                                    description={t(
                                        "create danger zone description"
                                    )}
                                    icon={
                                        <FontAwesome
                                            name="exclamation-triangle"
                                            size={24}
                                            color="gray"
                                        />
                                    }
                                    onPress={handleCreateDangerZonePress}
                                />
                            )}

                            <MenuItem
                                title={t("reject request")}
                                description={t("reject request description")}
                                icon={
                                    <MaterialIcons
                                        name="cancel"
                                        size={24}
                                        color="gray"
                                    />
                                }
                                onPress={handleRejectRequestPress}
                            />
                        </>
                    )}
                </BottomSheetView>
            </BottomSheetModal>
            <Modal
                visible={isMapModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsMapModalVisible(false)}
            >
                <LocationView
                    item={item}
                    isEmergency={item?.isEmergency}
                    visible={isMapModalVisible}
                    handleCloseModal={() => setIsMapModalVisible(false)}
                />
            </Modal>
        </View>
    );
};

export default memo(Post);
