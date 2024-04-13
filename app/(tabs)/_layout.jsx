import { Image, Text, View } from 'react-native'
import { Tabs, Redirect } from 'expo-router'

import { icons } from '../../constants'

const TabIcon = ({ icon, color, name, focused, customClass }) => {

    return (
        <View className={`items-center justify-center gap-1`}>
            <Image
                source={icon}
                resizeMode="contain"
                tintColor={color}
                className={customClass ? `${customClass}` : `w-6 h-6`}
            />
            <Text className={`text-xs font-pregular  ${focused ? 'color-primary' : ''}`}>
                {name}
            </Text>
        </View>
    )
}

const MiddleIcon = ({ icon, color, name, focused }) => {

    return (
        <View className={`absolute bottom-7`}>
            <Image
                source={icon}
                resizeMode="contain"
                tintColor={color}
                className={`w-16 h-16`}
            />
            {/* <Text className={`text-xs font-pregular  ${focused ? 'color-primary' : ''}`}>
                {name}
            </Text> */}
        </View>
    )
}

const TabsLayout = () => {
    return (
        <>
            <Tabs
                screenOptions={{
                    tabBarShowLabel: false,
                    tabBarActiveTintColor: '#F73334',
                    tabBarInactiveTintColor: '#8E8E93',
                    tabBarStyle: {
                        height: 60,
                        backgroundColor: '#fff',
                        borderTopWidth: 0,
                        elevation: 0
                    }
                }}
            >
                <Tabs.Screen
                    name="request"
                    options={{
                        title: "Requests",
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={icons.lifebuoy}
                                color={color}
                                name="Requests"
                                focused={focused}
                            />
                        )
                    }}
                />

                <Tabs.Screen
                    name="map"
                    options={{
                        title: "Maps",
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={icons.gps}
                                color={color}
                                name="Maps"
                                focused={focused}
                            />
                        )
                    }}
                />

                <Tabs.Screen
                    name="create"
                    options={{
                        title: "Create",
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <MiddleIcon
                                icon={icons.plus}
                                color={color}
                                name="Create"
                                focused={focused}
                            />
                        )
                    }}
                />

                <Tabs.Screen
                    name="chat"
                    options={{
                        title: "Chat",
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={icons.chat}
                                color={color}
                                name="Chat"
                                focused={focused}
                            />
                        )
                    }}
                />

                <Tabs.Screen
                    name="inbox"
                    options={{
                        title: "Inbox",
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={icons.notification}
                                color={color}
                                name="Inbox"
                                focused={focused}
                            />
                        )
                    }}
                />
            </Tabs>
        </>
    )
}

export default TabsLayout
