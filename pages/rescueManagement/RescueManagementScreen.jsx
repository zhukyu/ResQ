import {
    View,
    Text,
    useWindowDimensions,
    TouchableOpacity,
    Animated,
    StatusBar,
} from "react-native";
import React, { useState } from "react";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import DangerZoneTab from "./tabs/dangerZoneTab";
import RequestListTab from "./tabs/RequestListTab";
import { useTranslation } from "react-i18next";

const renderScene = SceneMap({
    first: RequestListTab,
    second: DangerZoneTab,
});

const RescueManagementScreen = () => {
    const layout = useWindowDimensions();
    const { t } = useTranslation();

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: "first", title: t("requests") },
        { key: "second", title: t("danger zone") },
    ]);

    const renderTabBar = (props) => {
        return (
            <TabBar
                {...props}
                indicatorStyle={{ backgroundColor: "#F73334" }}
                style={{ backgroundColor: "white" }}
                activeColor="#F73334"
                inactiveColor="gray"
                renderLabel={({ route, focused, color }) => (
                    <Animated.Text className="text-base font-rregular" style={{ color }}>
                        {route.title}
                    </Animated.Text>
                )}
            />
        );
    };

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            renderTabBar={renderTabBar}
            initialLayout={{ width: layout.width }}
        />
    );
};

export default RescueManagementScreen;
