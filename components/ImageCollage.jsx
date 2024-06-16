import {
    View,
    Text,
    Image,
    Dimensions,
    FlatList,
    Modal,
    Pressable,
    StatusBar,
} from "react-native";
import React, { useEffect, useState, memo } from "react";
import Gallery from "react-native-awesome-gallery";
import ImageView from "react-native-image-viewing";
// import ImageView from "react-native-zoom-image-view";
import ImageViewer from "react-native-image-zoom-viewer";
import { Ionicons } from "@expo/vector-icons";

function ImageCollage({ images, handleDeleteImage }) {
    const windowWidth = Dimensions.get("window").width;
    const [visible, setVisible] = useState(false);
    const [index, setIndex] = useState(0);

    function handleImagePress(index) {
        setVisible(true);
        setIndex(index);
    }

    function ImageRender({ height, width, index, resizeMode }) {
        const [imageHeight, setImageHeight] = useState(0);

        useEffect(
            function () {
                Image.getSize(images[index], function (width, height) {
                    const aspectRatio = width / height;
                    setImageHeight(windowWidth / aspectRatio);
                });
            },
            [index]
        );

        return (
            <Pressable onPress={() => handleImagePress(index)}>
                <Image
                    source={{ uri: images[index] }}
                    style={{
                        width: width,
                        height: height === "auto" ? imageHeight : height,
                        maxHeight: windowWidth * 1.5,
                    }}
                    resizeMode={resizeMode || "cover"}
                />
            </Pressable>
        );
    }

    function renderHeaderComponent({ imageIndex }) {
        return (
            <View className="">
                <Pressable
                    onPress={function () {
                        setVisible(false);
                    }}
                    className="p-4 absolute top-0 left-0"
                >
                    <Ionicons name="close" size={24} color="#d1d5db" />
                </Pressable>
                <Text className="text-gray-400 text-sm text-center m-4">
                    {imageIndex + 1}/{images.length}
                </Text>
                {handleDeleteImage && (
                    <Pressable
                        onPress={function () {
                            handleDeleteImage(imageIndex);
                            setVisible(false);
                        }}
                        className="p-4 absolute top-0 right-0"
                    >
                        <Ionicons name="trash" size={24} color="#d1d5db" />
                    </Pressable>
                )}
            </View>
        );
    }

    function renderImageCollage() {
        switch (images.length) {
            case 0:
                return null;
            case 1:
                return (
                    <ImageRender
                        key={index}
                        height="auto"
                        width={windowWidth}
                        index={0}
                    />
                );
            case 2:
                return (
                    <View style={{ flexDirection: "row" }}>
                        {images.map(function (image, index) {
                            return (
                                <ImageRender
                                    key={index}
                                    height={windowWidth}
                                    width={windowWidth / 2}
                                    index={index}
                                />
                            );
                        })}
                    </View>
                );
            case 3:
                return (
                    <View>
                        <ImageRender
                            key={index}
                            height={(windowWidth * 2) / 3}
                            width={windowWidth}
                            index={0}
                        />
                        <View style={{ flexDirection: "row" }}>
                            {images.slice(1).map(function (image, index) {
                                return (
                                    <ImageRender
                                        key={index}
                                        height={windowWidth / 3}
                                        width={windowWidth / 2}
                                        index={index + 1}
                                    />
                                );
                            })}
                        </View>
                    </View>
                );
            case 4:
                return (
                    <View>
                        <ImageRender
                            key={index}
                            height={(windowWidth * 2) / 3}
                            width={windowWidth}
                            index={0}
                        />
                        <View style={{ flexDirection: "row" }}>
                            {images.slice(1).map(function (image, index) {
                                return (
                                    <ImageRender
                                        key={index}
                                        height={windowWidth / 3}
                                        width={windowWidth / 3}
                                        index={index + 1}
                                    />
                                );
                            })}
                        </View>
                    </View>
                );
            default:
                return (
                    <View>
                        <View style={{ flexDirection: "row" }}>
                            {images.slice(0, 2).map(function (image, index) {
                                return (
                                    <ImageRender
                                        key={index}
                                        height={(windowWidth * 2) / 3}
                                        width={windowWidth / 2}
                                        index={index}
                                    />
                                );
                            })}
                        </View>
                        <View style={{ flexDirection: "row" }}>
                            {images.slice(2, 4).map(function (image, index) {
                                return (
                                    <ImageRender
                                        key={index}
                                        height={windowWidth / 3}
                                        width={windowWidth / 3}
                                        index={index + 2}
                                    />
                                );
                            })}
                            {images.length > 5 ? (
                                <>
                                    <ImageRender
                                        key={index}
                                        height={windowWidth / 3}
                                        width={windowWidth / 3}
                                        index={4}
                                    />
                                    <View
                                        style={{
                                            backgroundColor:
                                                "rgba(0, 0, 0, 0.5)",
                                            width: windowWidth / 3,
                                            height: windowWidth / 3,
                                            justifyContent: "center",
                                            alignItems: "center",
                                            position: "absolute",
                                            right: 0,
                                        }}
                                        pointerEvents="none"
                                    >
                                        <Text className="text-xl text-white">
                                            +{images.length - 5}
                                        </Text>
                                    </View>
                                </>
                            ) : (
                                <ImageRender
                                    key={index}
                                    height={windowWidth / 3}
                                    width={windowWidth / 3}
                                    index={4}
                                />
                            )}
                        </View>
                    </View>
                );
        }
    }

    return (
        <View style={{}}>
            <ImageView
                images={images.map(function (image) {
                    return { uri: image };
                })}
                imageIndex={index}
                visible={visible}
                onRequestClose={function () {
                    setVisible(false);
                }}
                swipeToCloseEnabled={true}
                backgroundColor="white"
                HeaderComponent={renderHeaderComponent}
            />
            {renderImageCollage()}
        </View>
    );
}

export default memo(ImageCollage);
