import {
    View,
    Text,
    useWindowDimensions,
    StatusBar,
    Image,
    ImageBackground,
    StyleSheet,
    FlatList,
    TouchableNativeFeedback,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
// import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { useTranslation } from "react-i18next";
import { useGlobalContext } from "../../context/GlobalProvider";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { images } from "../../constants";
import { ScrollView } from "react-native-gesture-handler";
import { MaterialTabBar, Tabs } from "react-native-collapsible-tab-view";
import Animated from "react-native-reanimated";
import { BlurView } from "expo-blur";
import axiosInstance from "../../lib/AxiosInstance";
import {
    useFocusEffect,
    useIsFocused,
    useNavigation,
} from "@react-navigation/native";
import Post from "../../components/Post";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import { formatTime } from "../../lib/helpers";
import CustomButton from "../../components/CustomButton";

const BANNER_HEIGHT = 200;

const renderTabBar = (props) => (
    <MaterialTabBar
        {...props}
        indicatorStyle={{ backgroundColor: "#F73334" }}
        style={{ backgroundColor: "white" }}
        indicatorContainerStyle={{ overflow: "hidden" }}
        inactiveColor="gray"
        activeColor="#F73334"
        labelStyle={{
            fontSize: 15,
            fontWeight: "bold",
            fontFamily: "Roboto-Medium",
        }}
    />
);

const Header = ({ user }) => {
    return (
        <Animated.View className="bg-none p-4">
            <AnimatedImageBackground
                source={images.profileWallpaper}
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    height: BANNER_HEIGHT,
                }}
            ></AnimatedImageBackground>
            <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                    marginTop: BANNER_HEIGHT - 65,
                }}
            >
                <View className="flex flex-row items-end">
                    {user && user?.avatar ? (
                        <View className="border-4 border-white rounded-full bg-white">
                            <Animated.Image
                                source={{
                                    uri: user?.avatar,
                                }}
                                className="w-28 h-28 rounded-full"
                            />
                        </View>
                    ) : (
                        <Animated.View className="w-28 h-28 rounded-full bg-[#CCCCCC] flex items-center justify-center border-4 border-white">
                            <FontAwesome name="user" size={58} color="white" />
                        </Animated.View>
                    )}
                    <View className="flex ml-2 pb-2">
                        <View className="flex flex-row items-center">
                            <Text className="text-xl font-rbold text-gray-900">
                                {user?.name}
                            </Text>
                            {user?.role !== "user" && (
                                <Text
                                    className={`text-xs font-rlight  ml-2 
                                border rounded-full p-1 px-2 ${
                                    user?.role === "admin"
                                        ? "border-red-300 text-red-400 bg-red-100"
                                        : "border-gray-300 text-gray-400 bg-slate-100"
                                }`}
                                >
                                    {user?.role}
                                </Text>
                            )}
                        </View>
                        <Text className="text-sm font-rregular text-gray-500">
                            {user?.email}
                        </Text>
                    </View>
                </View>
            </Animated.ScrollView>
        </Animated.View>
    );
};

const About = ({ user }) => {
    const { t } = useTranslation();
    const navigation = useNavigation();

    const handleEditProfilePress = () => {
        navigation.navigate(`stack`, {
            screen: `updateProfile`,
            params: {
                userId: user?.id,
            },
        });
    };

    return (
        <Tabs.ScrollView>
            <View className="p-4 bg-white">
                <View className="mb-6 mt-2">
                    <Text className="text-base font-rbold text-gray-900">
                        {t("personal info")}
                    </Text>
                </View>
                <View className="flex flex-row items-center mb-4 justify-between">
                    <Text className="text-sm font-rregular text-gray-500 w-1/3">
                        {t("name")}
                    </Text>
                    <Text className="text-sm font-rregular text-gray-900">
                        {user?.name}
                    </Text>
                </View>
                <View
                    style={{
                        borderBottomColor: "#d3d3d3",
                        borderBottomWidth: StyleSheet.hairlineWidth,
                    }}
                />
                <View className="flex flex-row items-center my-4 justify-between">
                    <Text className="text-sm font-rregular text-gray-500 w-1/3">
                        {t("dob")}
                    </Text>
                    <Text className="text-sm font-rregular text-gray-900">
                        {formatTime(user?.dob, "customFormat", "DD/MM/YYYY")}
                    </Text>
                </View>
                <View
                    style={{
                        borderBottomColor: "#d3d3d3",
                        borderBottomWidth: StyleSheet.hairlineWidth,
                    }}
                />
                <View className="flex flex-row items-center my-4 justify-between">
                    <Text className="text-sm font-rregular text-gray-500 w-1/3">
                        {t("email")}
                    </Text>
                    <Text className="text-sm font-rregular text-gray-900">
                        {user?.email}
                    </Text>
                </View>
                <View
                    style={{
                        borderBottomColor: "#d3d3d3",
                        borderBottomWidth: StyleSheet.hairlineWidth,
                    }}
                />
                <View className="flex flex-row items-center my-4 justify-between">
                    <Text className="text-sm font-rregular text-gray-500 w-1/3">
                        {t("phone number")}
                    </Text>
                    <Text className="text-sm font-rregular text-gray-900">
                        {user?.phoneNumber}
                    </Text>
                </View>
                <View
                    style={{
                        borderBottomColor: "#d3d3d3",
                        borderBottomWidth: StyleSheet.hairlineWidth,
                    }}
                />
                <View className="flex flex-row items-center my-4 justify-between">
                    <Text className="text-sm font-rregular text-gray-500 w-1/3">
                        {t("address")}
                    </Text>
                    <Text
                        className="text-sm font-rregular text-gray-900 max-w-[70%] text-right"
                    >
                        {user?.address}
                    </Text>
                </View>
                <TouchableNativeFeedback onPress={handleEditProfilePress}>
                    <View className="flex flex-row w-full mt-7 rounded-full bg-zinc-300 py-2 items-center justify-center">
                        <AntDesign name="edit" size={20} color="#1f2937" />
                        <Text className="text-gray-800 font-rmedium text-base ml-2">
                            {t("edit profile")}
                        </Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
        </Tabs.ScrollView>
    );
};

const MyRequests = ({ isFocused, scrollToTop, triggerRefresh }) => {
    const navigation = useNavigation();

    const [posts, setPosts] = useState([]);
    const flatListRef = useRef();
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const isScreenFocused = useIsFocused();

    const fetchData = async (isLoadMore = false, isRefreshing = false) => {
        if (loading || loadingMore || refreshing) return;

        if (isLoadMore) {
            setLoadingMore(true);
        } else if (isRefreshing) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        try {
            const response = await axiosInstance.get(
                `/requests/me?page=${isRefreshing ? 1 : page}&itemPerPage=5`
            );
            const result = await response.data.requests;

            if (result.length > 0) {
                if (isRefreshing) {
                    setPosts(result);
                    setPage(2); // reset to the second page for next load more
                    setHasMore(true); // reset the hasMore flag for refreshing
                } else {
                    setPosts((prevData) =>
                        isLoadMore ? [...prevData, ...result] : result
                    );
                    setPage((prevPage) => prevPage + 1);
                }
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error(error);
        } finally {
            if (isLoadMore) {
                setLoadingMore(false);
            } else if (isRefreshing) {
                setRefreshing(false);
            } else {
                setLoading(false);
            }
        }
    };

    useFocusEffect(
        useCallback(() => {
            if (scrollToTop) {
                flatListRef?.current?.scrollToOffset({
                    animated: true,
                    offset: 0,
                });
                handleRefresh();
            }
        }, [scrollToTop])
    );

    useEffect(() => {
        if (triggerRefresh) {
            handleRefresh();
        }
    }, [triggerRefresh]);

    useEffect(() => {
        if (isScreenFocused) {
            fetchData(false, true);
        }
    }, [isScreenFocused]);

    useEffect(() => {
        // console.log(posts.length);
    }, [posts]);

    const handleLoadMore = () => {
        if (hasMore && !loadingMore) {
            fetchData(true);
        }
    };

    const handleRefresh = () => {
        fetchData(false, true);
    };

    const handleCommentPress = (item) => {
        navigation.navigate(`stack`, {
            screen: `requestDetail`,
            params: { id: item?.id, focusTextInput: true },
        });
    };

    const renderFooter = () => (loadingMore ? <LoadingSkeleton /> : null);

    return (
        <Tabs.FlatList
            ref={flatListRef}
            data={posts}
            renderItem={({ item }) => (
                <Post
                    item={item}
                    initVoteCount={item?.voteCount}
                    commentCount={item?.commentCount}
                    refreshList={handleRefresh}
                    onCommentPress={() => handleCommentPress(item)}
                    initVoteType={item?.votes?.[0]?.voteType}
                />
            )}
            // refreshing={refreshing}
            // onRefresh={handleRefresh}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            keyExtractor={(item) => item.id}
        />
    );
};

const AnimatedImageBackground =
    Animated.createAnimatedComponent(ImageBackground);

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const UserProfileScreen = () => {
    const { t } = useTranslation();
    const { user, setUser } = useGlobalContext();

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: "myRequest", title: t("requests") },
        { key: "about", title: t("about") },
    ]);
    const [requests, setRequests] = useState([]);

    const fetchData = async () => {
        try {
            // const response = await axiosInstance.get("/requests");
            // const result = await response.data.requests;
            // setRequests(result);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View className="flex-1">
            <Tabs.Container
                // lazy={true}
                renderHeader={() => <Header user={user} />}
                // containerStyle={{
                //     flex: 1,
                // }}
                renderTabBar={renderTabBar}
                allowHeaderOverscroll={true}
            >
                <Tabs.Tab name="request" label={t("requests")}>
                    <MyRequests />
                </Tabs.Tab>
                <Tabs.Tab name="about" label={t("about")}>
                    <About user={user} />
                </Tabs.Tab>
            </Tabs.Container>
        </View>
    );
};

export default UserProfileScreen;
