import { Image, Platform, Text, TouchableOpacity, View, Animated, TouchableNativeFeedback } from 'react-native'
import { Tabs, Redirect } from 'expo-router'

import { icons } from '../../../constants'
import { useRef } from 'react'
import ButtonNativeFeedback from '../../../components/ButtonNativeFeedback'
import CustomHeader from '../../../components/Header'
import AvatarMenu from '../../../components/AvatarMenu'

const TabIcon = ({ icon, iconFocused, color, name, focused, customClass }) => {

    return (
        <View className={`items-center justify-center gap-1`}>
            <Image
                source={focused ? iconFocused : icon}
                resizeMode="contain"
                tintColor={color}
                className={customClass ? `${customClass}` : `w-6 h-6`}
            />
            <Text className={`text-xs font-pregular ${focused ? 'color-primary' : 'text-[#AAAAAA]'}`}>
                {name}
            </Text>
        </View>
    )
}

const EmptyIcon = ({ icon, color, name, focused }) => {

    return (
        <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => console.log('hehe boi')}
        >
            <View style={{
                width: 65,
                height: 65,
                backgroundColor: 'red',
                borderRadius: 60,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: Platform.OS == "android" ? 40 : 30
            }}>
                <Image source={icon} style={{
                    width: 22,
                    height: 22,
                    tintColor: 'white',
                }}></Image>
            </View>
        </TouchableOpacity>
    )
}

const TabsLayout = () => {

    return (
        <>
            <Tabs
                screenOptions={{
                    tabBarShowLabel: false,
                    tabBarActiveTintColor: '#F73334',
                    tabBarInactiveTintColor: '#AAAAAA',
                    tabBarStyle: {
                        height: 60,
                        backgroundColor: '#fff',
                        borderTopWidth: 0,
                        shadowOffset: {
                            width: 2,
                            height: 12,
                        },
                        shadowColor: 'black',
                        shadowOpacity: 1,
                        shadowRadius: 3.84,
                        elevation: 15,
                    },
                    headerTitle: (props) => <CustomHeader {...props} />,
                    headerLeft: () => null,
                    // headerRight: (props) => <AvatarMenu {...props} />,
                    headerShadowVisible: true,
                    headerStyle: {
                        shadowOffset: {
                            width: 0,
                            height: 3,
                        },
                        shadowColor: '#171717',
                        shadowOpacity: 0.2,
                        shadowRadius: 3.84,
                        elevation: 6,
                    },
                }}
            >
                <Tabs.Screen
                    name="request"
                    options={{
                        title: "Requests",
                        tabBarLabel: "Requests",
                        headerShown: true,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={icons.lifebuoyOutlined}
                                iconFocused={icons.lifebuoyFilled}
                                color={color}
                                name="Requests"
                                focused={focused}
                            />
                        ),
                        tabBarButton: (props) => <ButtonNativeFeedback {...props} rippleColor='#ffecec' />
                    }}
                />

                <Tabs.Screen
                    name="map"
                    options={{
                        title: "Maps",
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={icons.mapsOutlined}
                                iconFocused={icons.mapsFilled}
                                color={color}
                                name="Maps"
                                focused={focused}
                            />
                        ),
                        tabBarButton: (props) => <ButtonNativeFeedback {...props} rippleColor='#ffecec' />,
                        // headerTitle: (props) => <CustomHeader {...props} />,
                        // headerLeft: () => null,
                        // headerRight: (props) => <AvatarMenu {...props} />,
                    }}
                />

                <Tabs.Screen
                    name="create"
                    options={{
                        title: "Create",
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <EmptyIcon
                                icon={icons.plus}
                                color="#fff"
                                name="Create"
                                focused={focused}
                            />
                        )
                    }}
                    listeners={({ navigation, route }) => ({
                        tabPress: e => {
                            e.preventDefault();
                        }
                    })}
                />

                <Tabs.Screen
                    name="chat"
                    options={{
                        title: "Chat",
                        headerShown: true,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={icons.chatOutlined}
                                iconFocused={icons.chatFilled}
                                color={color}
                                name="Chat"
                                focused={focused}
                            />
                        ),
                        tabBarButton: (props) => <ButtonNativeFeedback {...props} rippleColor='#ffecec' />
                    }}
                />

                <Tabs.Screen
                    name="inbox"
                    options={{
                        title: "Inbox",
                        headerShown: true,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={icons.notificationOutlined}
                                iconFocused={icons.notificationFilled}
                                color={color}
                                name="Inbox"
                                focused={focused}
                            />
                        ),
                        tabBarButton: (props) => <ButtonNativeFeedback {...props} rippleColor='#ffecec' />
                    }}
                />
            </Tabs>
        </>
    )
}

export default TabsLayout
