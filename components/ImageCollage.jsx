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
import React, { useState } from "react";
import Gallery from "react-native-awesome-gallery";
import ImageView from "react-native-image-viewing";
// import ImageView from "react-native-zoom-image-view";
import ImageViewer from "react-native-image-zoom-viewer";
import { Ionicons } from "@expo/vector-icons";

const ImageCollage = ({ images, handleDeleteImage }) => {
    const windowWidth = Dimensions.get("window").width;
    const [visible, setVisible] = useState(false);
    const [index, setIndex] = useState(0);

    const handleImagePress = (index) => {
        setVisible(true);
        setIndex(index);
    };

    const ImageRender = ({ height, width, index }) => {
        return (
            <Pressable onPress={() => handleImagePress(index)}>
                <Image
                    source={{ uri: images[index] }}
                    style={{
                        width: width,
                        height: height,
                    }}
                />
            </Pressable>
        );
    };

    return (
        <View style={{}}>
            <ImageView
                images={images.map((image) => ({ uri: image }))}
                imageIndex={index}
                visible={visible}
                onRequestClose={() => setVisible(false)}
                swipeToCloseEnabled={true}
                backgroundColor="white"
                HeaderComponent={({ imageIndex }) => (
                    // delete button
                    <View className="">
                        <Pressable
                            onPress={() => {
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
                                onPress={() => {
                                    handleDeleteImage(imageIndex);
                                    setVisible(false);
                                }}
                                className="p-4 absolute top-0 right-0"
                            >
                                <Ionicons
                                    name="trash"
                                    size={24}
                                    color="#d1d5db"
                                />
                            </Pressable>
                        )}
                    </View>
                )}
            />
            {(() => {
                switch (images.length) {
                    case 1:
                        return (
                            <ImageRender
                                key={index}
                                height={windowWidth}
                                width={windowWidth}
                                index={0}
                            />
                        );
                    case 2:
                        return (
                            <View style={{ flexDirection: "row" }}>
                                {images.map((image, index) => (
                                    <ImageRender
                                        key={index}
                                        height={windowWidth}
                                        width={windowWidth / 2}
                                        index={index}
                                    />
                                ))}
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
                                    {images.slice(1).map((image, index) => (
                                        <ImageRender
                                            key={index}
                                            height={windowWidth / 3}
                                            width={windowWidth / 2}
                                            index={index + 1}
                                        />
                                    ))}
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
                                    {images.slice(1).map((image, index) => (
                                        <ImageRender
                                            key={index}
                                            height={windowWidth / 3}
                                            width={windowWidth / 3}
                                            index={index + 1}
                                        />
                                    ))}
                                </View>
                            </View>
                        );
                    default:
                        return (
                            <View>
                                <View style={{ flexDirection: "row" }}>
                                    {images.slice(0, 2).map((image, index) => (
                                        <ImageRender
                                            key={index}
                                            height={(windowWidth * 2) / 3}
                                            width={windowWidth / 2}
                                            index={index}
                                        />
                                    ))}
                                </View>
                                <View style={{ flexDirection: "row" }}>
                                    {images.slice(2, 4).map((image, index) => (
                                        <ImageRender
                                            key={index}
                                            height={windowWidth / 3}
                                            width={windowWidth / 3}
                                            index={index + 2}
                                        />
                                    ))}
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
            })()}
        </View>
    );
};

export default ImageCollage;
