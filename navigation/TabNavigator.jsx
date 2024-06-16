import {
    View,
    Text,
    Image,
    TouchableWithoutFeedback,
    TouchableNativeFeedback,
    Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CustomHeader from "../components/Header";
import MapScreen from "../pages/map/MapScreen";
import ChatListScreen from "../pages/chat/ChatListScreen";
import NotificationScreen from "../pages/notification/NotificationScreen";
import RequestScreen from "../pages/request/RequestScreen";
import { icons } from "../constants";
import AddButton from "../components/AddButton";
import { useNavigationState } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useTranslation } from "react-i18next";
import { emitWithToken, socket } from "../lib/socketInstance";
import { useGlobalContext } from "../context/GlobalProvider";
import { Badge } from "react-native-paper";

const Tab = createBottomTabNavigator();
const { width, height } = Dimensions.get("window");

const TabIcon = ({ color, name, focused, customClass, size, route, messagesCount, notificationsCount }) => {
    const { t } = useTranslation();

    let icon = null;
    let title = "";
    let count = 0;
    switch (route.name) {
        case "request":
            icon = focused ? icons.lifebuoyFilled : icons.lifebuoyOutlined;
            title = t("requests");
            break;
        case "map":
            icon = focused ? icons.mapsFilled : icons.mapsOutlined;
            title = t("map");
            break;
        case "chat":
            icon = focused ? icons.chatFilled : icons.chatOutlined;
            title = t("chat");
            count = messagesCount;
            break;
        case "inbox":
            icon = focused
                ? icons.notificationFilled
                : icons.notificationOutlined;
            title = t("inbox");
            count = notificationsCount;
            break;
        default:
            icon = icons.lifebuoyOutlined;
            title = "Requests";
            break;
    }

    return (
        <View className={`items-center justify-center gap-1`}>
            <Image
                source={icon}
                resizeMode="contain"
                tintColor={color}
                className={customClass ? `${customClass}` : ""}
                style={{
                    width: size,
                    height: size,
                    tintColor: color,
                }}
            />
            <Text
                className={`text-xs font-pregular ${
                    focused ? "color-primary" : "text-[#AAAAAA]"
                }`}
            >
                {title}
            </Text>
            <Badge
                visible={count > 0}
                size={20}
                style={{
                    position: "absolute",
                    top: -5,
                    right: -5,
                    zIndex: 100,
                    backgroundColor: "#F73334",
                }}
            >
                {count}
            </Badge>
        </View>
    );
};

const EmptyTab = () => {
    return <View></View>;
};

const TabNavigator = ({ navigation }) => {
    const { user } = useGlobalContext();
    const [open, setOpen] = useState(false);
    const [chatUnviewedCount, setChatUnviewedCount] = useState(0);
    const [notificationUnviewedCount, setNotificationUnviewedCount] =
        useState(0);
    const { t } = useTranslation();

    const handleTabPress = (route) => {
        if (route !== "create" && open) {
            setOpen(false);
        }
        navigation.navigate(route);
    };

    useEffect(() => {
        if (user && socket) {
            emitWithToken("getUnviewedCounts");

            socket.on("unviewedCountUpdated", (data) => {
                setChatUnviewedCount(data.unviewedMessages);
                setNotificationUnviewedCount(data.unviewedNotifications);
            });
        }

        return () => {
            if (socket) {
                socket.off("unviewedCounts");
            }
        };
    }, [user, socket]);

    return (
        <View
            style={{
                flex: 1,
                minHeight: height,
            }}
        >
            {open && (
                <TouchableWithoutFeedback
                    onPress={() => setOpen(false)}
                    className=""
                >
                    <View className="absolute top-0 left-0 right-0 bottom-0 z-10"></View>
                </TouchableWithoutFeedback>
            )}
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: true,
                    tabBarShowLabel: false,
                    tabBarActiveTintColor: "#F73334",
                    tabBarInactiveTintColor: "#AAAAAA",
                    // tabBarHideOnKeyboard: true,
                    tabBarStyle: {
                        height: 60,
                        backgroundColor: "#fff",
                        borderTopWidth: 0,
                        shadowOffset: {
                            width: 2,
                            height: 12,
                        },
                        shadowColor: "black",
                        shadowOpacity: 0.5,
                        shadowRadius: 3.84,
                        elevation: 15,
                        zIndex: 50,
                    },
                    header: (props) => <CustomHeader {...props} />,
                    headerShadowVisible: false,
                    headerStyle: {
                        shadowOffset: {
                            width: 0,
                            height: 3,
                        },
                        shadowColor: "#171717",
                        shadowOpacity: 0.2,
                        shadowRadius: 3.84,
                        elevation: 6,
                    },
                    tabBarIcon: ({ color, focused, size }) => {
                        return (
                            <TabIcon
                                color={color}
                                focused={focused}
                                size={size}
                                route={route}
                                messagesCount={chatUnviewedCount}
                                notificationsCount={notificationUnviewedCount}
                            />
                        );
                    },
                    tabBarButton: ({ children, style, ...props }) => (
                        <TouchableNativeFeedback
                            {...props}
                            // onPress={handleTabPress.bind(this, route.name)}
                            background={TouchableNativeFeedback.Ripple(
                                "#ffecec",
                                true
                            )}
                        >
                            <View style={style}>{children}</View>
                        </TouchableNativeFeedback>
                    ),
                })}
            >
                <Tab.Screen
                    name="request"
                    component={RequestScreen}
                    options={{
                        title: t("requests"),
                        tabBarLabel: t("requests"),
                    }}
                    // listeners={({ navigation, route }) => ({
                    //     tabPress: (e) => {
                    //         e.preventDefault();

                    //         const isFocused = navigation.isFocused();

                    //         if (isFocused) {
                    //             console.log("Request tab pressed again");
                    //             navigation.navigate("request", {
                    //                 scrollToTop: true,
                    //             });
                    //         } else {
                    //             navigation.navigate("request");
                    //         }
                    //     },
                    // })}
                />
                <Tab.Screen
                    name="map"
                    component={MapScreen}
                    options={{
                        title: "Map",
                        tabBarLabel: "Map",
                        headerShown: false,
                    }}
                />
                <Tab.Screen
                    name="create"
                    component={EmptyTab}
                    options={{
                        title: "Create",
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <AddButton
                                icon={icons.plus}
                                color="#fff"
                                name="Create"
                                focused={focused}
                                open={open}
                                setOpen={setOpen}
                            />
                        ),
                        tabBarButton: (props) => (
                            <TouchableWithoutFeedback {...props} />
                        ),
                    }}
                    listeners={({ navigation, route }) => ({
                        tabPress: (e) => {
                            e.preventDefault();
                        },
                    })}
                />
                <Tab.Screen name="chat" component={ChatListScreen} />
                <Tab.Screen name="inbox" component={NotificationScreen} />
            </Tab.Navigator>
        </View>
    );
};

export default TabNavigator;
