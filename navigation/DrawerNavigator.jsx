import { View, Text } from "react-native";
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawerContent from "../components/CustomDrawerContent";
import CustomHeader from "../components/Header";
import TabNavigator from "./TabNavigator";
import UserProfileScreen from "../pages/user/UserProfileScreen";
import SettingScreen from "../pages/setting/SettingScreen";
import BackButtonHeader from "../components/BackButtonHeader";
import { useTranslation } from "react-i18next";
import SettingNavigator from "./SettingNavigator";

const UserDrawer = createDrawerNavigator();

const DrawerNavigator = () => {
    const { t } = useTranslation();

    return (
        <UserDrawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                swipeEdgeWidth: 0,
                drawerPosition: "right",
                drawerType: "front",
                headerShown: false,
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
                // header: (props) => <CustomHeader {...props} />,
                headerShadowVisible: true,
                headerStyle: {
                    backgroundColor: "#fff",
                },
            }}
            backBehavior="history"
        >
            <UserDrawer.Screen name="tabs" component={TabNavigator} />
            <UserDrawer.Screen
                name="profile"
                component={UserProfileScreen}
                options={{
                    headerShown: true,
                    title: t("profile"),
                    header: (props) => <BackButtonHeader {...props} />,
                    headerRight: () => null,
                    headerStyle: {
                        backgroundColor: "white",
                    },
                }}
            />
            <UserDrawer.Screen
                name="setting"
                component={SettingNavigator}
            />
        </UserDrawer.Navigator>
    );
};

export default DrawerNavigator;
