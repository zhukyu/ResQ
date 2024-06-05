import { View, Text } from "react-native";
import React from "react";
import ContentLoader, { Rect, Circle } from "react-content-loader/native";

const Spacer = ({ height = 16, width }) => <View style={{ height, width }} />;

const CommentSkeleton = (props) => {
    return (
        <View className="bg-white p-4 w-full flex-grow">
            <ContentLoader
                speed={2}
                width="100%"
                height="500"
                viewBox="0 0 400 550"
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb"
                {...props}
            >
                <Rect x="49" y="0" rx="12" ry="12" width="80%" height="110" />
                <Circle cx="20" cy="20" r="20" />

                <Rect x="49" y="130" rx="12" ry="12" width="80%" height="110" />
                <Circle cx="20" cy="20" r="20" y="130"/>

                <Rect x="49" y="260" rx="12" ry="12" width="80%" height="110" />
                <Circle cx="20" cy="20" r="20" y="260"/>

                <Rect x="49" y="390" rx="12" ry="12" width="80%" height="110" />
                <Circle cx="20" cy="20" r="20" y="390"/>
                
            </ContentLoader>
        </View>
    );
};

export default CommentSkeleton;
