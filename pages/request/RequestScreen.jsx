import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    FlatList,
} from "react-native";
import Post from "../../components/Post";
import axiosInstance from "../../lib/AxiosInstance";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import LoadingSkeleton from "../../components/LoadingSkeleton";

const RequestScreen = ({ route, navigation }) => {
    const { triggerRefresh, scrollToTop } = route.params || {};
    const isFocused = useIsFocused();
    const [posts, setPosts] = useState([]);
    const flatListRef = useRef();
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

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
                `/requests?page=${isRefreshing ? 1 : page}&itemPerPage=5`
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
        if (isFocused) {
            const unsubscribe = navigation.addListener("tabPress", (e) => {
                e.preventDefault();

                flatListRef?.current?.scrollToOffset({
                    animated: true,
                    offset: 0,
                });

                handleRefresh();
            });

            return unsubscribe;
        }
    }, [navigation, isFocused]);

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

    // useEffect(() => {
    //     if (!isFocused) return; // Fetch posts only when the screen is focused
    //     handleRefresh();
    // }, [isFocused]);

    useEffect(() => {
        fetchData(false, true);
    }, []);

    useEffect(() => {
        // console.log(posts);
    }, [posts]);

    const handleLoadMore = () => {
        if (hasMore && !loadingMore) {
            fetchData(true);
        }
    };

    const handleRefresh = () => {
        fetchData(false, true);
    };

    const renderFooter = () => (loadingMore ? <LoadingSkeleton /> : null);

    const handleCommentPress = (item) => {
        navigation.navigate(`stack`, {
            screen: `requestDetail`,
            params: { id: item?.id, focusTextInput: true },
        });
    };

    const callRenderItem = useCallback(({ item }) => {
        return (
            <Post
                item={item}
                initVoteCount={item?.voteCount}
                commentCount={item?.commentCount}
                refreshList={handleRefresh}
                onCommentPress={() => handleCommentPress(item)}
                initVoteType={item?.votes?.[0]?.voteType}
            />
        );
    }, []);

    return (
        <FlatList
            ref={flatListRef}
            data={posts}
            renderItem={callRenderItem}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            keyExtractor={(item) => item.id}
        />
    );
};

export default RequestScreen;
