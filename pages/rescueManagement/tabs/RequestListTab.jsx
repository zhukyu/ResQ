import { View, Text, FlatList, Animated, RefreshControl } from "react-native";
import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
    useMemo,
} from "react";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useTranslation } from "react-i18next";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import axiosInstance from "../../../lib/AxiosInstance";
import LoadingSkeleton from "../../../components/LoadingSkeleton";
import Post from "../../../components/Post";
import { system } from "../../../constants";

const CustomRefreshControl = (props) => {
    return (
        <View className="z-50">
            <RefreshControl
                refreshing={props.refreshing}
                onRefresh={props.onRefresh}
                colors={["#F73334"]}
                tintColor="#F73334"
                {...props}
            />
        </View>
    );
};

const RequestListTab = ({ route }) => {
    const [segmentIndex, setSegmentIndex] = useState(0);
    const [segmentHeight, setSegmentHeight] = useState(0);
    const { t } = useTranslation();

    const navigation = useNavigation();

    const [posts, setPosts] = useState([]);
    const flatListRef = useRef();
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const isScreenFocused = useIsFocused();
    const [status, setStatus] = useState(null);

    const onLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        setSegmentHeight(height);
    };

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
                `/requests/rescuer?${status ? `status=${status}&` : ""}page=${
                    isRefreshing ? 1 : page
                }&itemPerPage=5`
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

    const handleSegmentIndexChange = (event) => {
        const selectedIndex = event.nativeEvent.selectedSegmentIndex;
        setSegmentIndex(selectedIndex);

        switch (selectedIndex) {
            case 0:
                setStatus(null);
                break;
            case 1:
                setStatus(system.REQUEST_STATUS.RESCUING);
                break;
            case 2:
                setStatus(system.REQUEST_STATUS.RESCUED);
                break;
            default:
                setStatus(null);
                break;
        }
    };

    useEffect(() => {
        fetchData(false, true);
    }, [status]);

    const renderHeader = useMemo(
        () => (
            <Animated.View
                className="p-4 bg-white z-40 top-0 right-0 left-0"
                onLayout={onLayout}
            >
                <SegmentedControl
                    values={[t("pending"), t("rescuing"), t("rescued")]}
                    selectedIndex={segmentIndex}
                    fontStyle={{ color: "gray", fontFamily: "Roboto-Regular" }}
                    activeFontStyle={{
                        color: "black",
                        fontFamily: "Roboto-Bold",
                    }}
                    onChange={handleSegmentIndexChange}
                />
            </Animated.View>
        ),
        [segmentIndex]
    );

    return (
        <View className="relative">
            <View className="z-40">
                <Animated.FlatList
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
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    ListHeaderComponent={renderHeader}
                    ListFooterComponent={renderFooter}
                    keyExtractor={(item) => item.id}
                    refreshControl={
                        <CustomRefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                        />
                    }
                />
            </View>
        </View>
    );
};

export default RequestListTab;
