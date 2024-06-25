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
import DangerZoneItem from "../../../components/DangerZoneItem";

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

const DangerZoneTab = ({ route }) => {
    const [segmentIndex, setSegmentIndex] = useState(0);
    const [segmentHeight, setSegmentHeight] = useState(0);
    const { t } = useTranslation();

    const navigation = useNavigation();

    const [dangerZones, setDangerZones] = useState([]);
    const flatListRef = useRef();
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const isScreenFocused = useIsFocused();
    const [status, setStatus] = useState(null);

    const onLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        setSegmentHeight(height);
    };

    const fetchData = async () => {
        if (refreshing) return;
        
        setRefreshing(true);

        let url = `/danger/rescuer`;
        if (status) {
            url += `?status=${status}`;
        }

        try {
            const response = await axiosInstance.get(url);
            const result = await response.data;

            if (result.length > 0) {
                setDangerZones(result);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (isScreenFocused) {
            fetchData(false, true);
        }
    }, [isScreenFocused]);

    const handleRefresh = () => {
        fetchData(false, true);
    };

    const renderFooter = () => (refreshing ? <LoadingSkeleton /> : null);

    const handleSegmentIndexChange = (event) => {
        const selectedIndex = event.nativeEvent.selectedSegmentIndex;
        setSegmentIndex(selectedIndex);

        switch (selectedIndex) {
            case 0:
                setStatus(null);
                break;
            case 1:
                setStatus(system.DANGER_AREA_STATUS.ACTIVE);
                break;
            case 2:
                setStatus(system.DANGER_AREA_STATUS.DELETED);
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
                    values={[t("all"), t("active"), t("deleted")]}
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
                    data={dangerZones}
                    renderItem={({ item }) => (
                        <DangerZoneItem
                            item={item}
                            triggerRefresh={fetchData}
                        />
                    )}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    onEndReachedThreshold={0.5}
                    ListHeaderComponent={renderHeader}
                    ListFooterComponent={renderFooter}
                    keyExtractor={(item) => item._id}
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

export default DangerZoneTab;
