import {
    View,
    Text,
    Animated,
    TouchableOpacity,
    Image,
    Platform,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const AddButton = ({ icon, color, name, focused, open, setOpen }) => {
    const animation = useRef(new Animated.Value(0)).current;
    const navigation = useNavigation();

    useEffect(() => {
        const toValue = !open ? 0 : 1;
        Animated.spring(animation, {
            toValue,
            useNativeDriver: true,
        }).start();
    }, [open]);

    const rotation = {
        transform: [
            {
                rotate: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "135deg"],
                }),
            },
        ],
    };

    const getAnimationStyle = (index) => {
        const angle = index * (180 / 2) + 45;
        const radius = 70;

        const translateY = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -radius * Math.sin((angle * Math.PI) / 180)],
        });

        const translateX = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, radius * Math.cos((angle * Math.PI) / 180)],
        });

        return {
            transform: [{ translateY }, { translateX }, { scale: animation }],
        };
    };

    const handleCreatePostButton = () => {
        navigation.navigate(`stack`, {
            screen: `addRequest`,
        });
    };

    const handleSOSButton = () => {
        console.log("SOS");
    };

    return (
        <View class="z-50">
            {open && (
                <View className="">
                    {[...Array(2)].map((_, index) => (
                        <Animated.View
                            key={index}
                            style={getAnimationStyle(index)}
                            className="absolute w-16 h-16 items-center justify-center z-50"
                        >
                            <TouchableOpacity
                                key={index}
                                className="h-11 w-11 bg-primary rounded-full flex items-center justify-center z-50"
                                style={{
                                    shadowColor: "#F73334",
                                    shadowOpacity: 0.5,
                                    shadowOffset: { width: 2, height: 12 },
                                    elevation: 5,
                                }}
                                activeOpacity={0.7}
                                onPress={() =>
                                    index === 0
                                        ? handleSOSButton()
                                        : handleCreatePostButton()
                                }
                            >
                                <View>
                                    {index === 0 ? (
                                        <MaterialIcons
                                            name="sos"
                                            size={24}
                                            color="white"
                                        />
                                    ) : (
                                        <MaterialIcons
                                            name="post-add"
                                            size={24}
                                            color="white"
                                        />
                                    )}
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </View>
            )}
            <TouchableOpacity
                className="w-16 h-16 bg-primary rounded-full flex items-center justify-center z-50"
                style={{
                    shadowColor: "#F73334",
                    shadowOpacity: 0.5,
                    shadowOffset: { width: 2, height: 12 },
                    elevation: 5,
                    marginBottom: Platform.OS == "android" ? 40 : 30,
                }}
                activeOpacity={0.8}
                onPress={() => setOpen(!open)}
            >
                <Animated.View style={[rotation]}>
                    <Image
                        source={icon}
                        style={{
                            width: 22,
                            height: 22,
                            tintColor: "white",
                        }}
                    ></Image>
                </Animated.View>
            </TouchableOpacity>
        </View>
    );
};

export default AddButton;
