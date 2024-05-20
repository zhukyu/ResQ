import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    FlatList,
} from "react-native";
import Post from "../../components/Post";
import axiosInstance from "../../lib/AxiosInstance";
import { useEffect, useState } from "react";

const RequestScreen = ({ route }) => {
    const { triggerRefresh } = route.params || {};
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const fetchPosts = async () => {
        if (loading) return; // Avoid multiple concurrent requests

        setLoading(true);
        try {
            const response = await axiosInstance.get(
                `/requests?page=${page}&itemPerPage=10`
            );
            const data = await response.data.requests;
            setPosts((prevPosts) => [...prevPosts, ...data]);
            setPage((prevPage) => prevPage + 1);
        } catch (error) {
            console.error("Error fetching posts:", error);
            // Handle errors gracefully (e.g., show a user-friendly message)
        } finally {
            setLoading(false);
        }
    };

    const performRefresh = () => {
        setPosts([]);
        setPage(1);
    };

    useEffect(() => {
        console.log("triggerRefresh: ", triggerRefresh);
        if (triggerRefresh) {
            performRefresh();
        }
    }, [triggerRefresh]);

    // useEffect(() => {
    //     if (!isFocus) return; // Fetch posts only when the screen is focused
    //     setPosts([]);
    //     setPage(1);
    // }, [isFocus]);

    useEffect(() => {
        fetchPosts();
    }, [page]);

    useEffect(() => {
        // console.log(posts);
    }, [posts]);

    const renderFooter = () =>
        loading ? <ActivityIndicator size="large" color="#F73334" /> : null;

    return (
        <FlatList
            data={posts}
            renderItem={({ item }) => <Post item={item} />}
        />
    );
};

export default RequestScreen;
