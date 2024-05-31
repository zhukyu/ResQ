import { View, Text } from "react-native";
import React from "react";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import ContentLoader, { Rect, Circle, Path } from "react-content-loader/native";

const Spacer = ({ height = 16, width }) => <View style={{ height, width }} />;

const LoadingSkeleton = (props) => {
    return (
        <View className="bg-white p-4 w-full">
            <ContentLoader
                speed={2}
                width="100%"
                height={120}
                viewBox="0 0 400 125"
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb"
                {...props}
            >
                <Rect x="48" y="4" rx="3" ry="3" width="88" height="16" />
                <Rect x="48" y="24" rx="3" ry="3" width="52" height="14" />
                <Rect x="0" y="56" rx="3" ry="3" width="410" height="16" />
                <Rect x="0" y="76" rx="3" ry="3" width="380" height="16" />
                <Rect x="0" y="96" rx="3" ry="3" width="178" height="16" />
                <Circle cx="20" cy="20" r="20" />
            </ContentLoader>
        </View>
    );
};

export default LoadingSkeleton;
