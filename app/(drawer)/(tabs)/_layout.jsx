import { Image, Platform, Text, TouchableOpacity, View, Animated, TouchableNativeFeedback } from 'react-native'
import { Tabs, Redirect } from 'expo-router'

import { icons } from '../../../constants'
import { useRef } from 'react'
import ButtonNativeFeedback from '../../../components/ButtonNativeFeedback'

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
                        elevation: 0
                    },
                }}
            >
                <Tabs.Screen
                    name="request"
                    options={{
                        title: "Requests",
                        tabBarLabel: "Requests",
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={icons.lifebuoyOutlined}
                                iconFocused={icons.lifebuoyFilled}
                                color={color}
                                name="Requests"
                                focused={focused}
                            />
                        ),
                        tabBarButton: (props) => <ButtonNativeFeedback {...props} rippleColor='#FCBBBB' />
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
                        tabBarButton: (props) => <ButtonNativeFeedback {...props} rippleColor='#FCBBBB' />
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
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={icons.chatOutlined}
                                iconFocused={icons.chatFilled}
                                color={color}
                                name="Chat"
                                focused={focused}
                            />
                        ),
                        tabBarButton: (props) => <ButtonNativeFeedback {...props} rippleColor='#FCBBBB' />
                    }}
                />

                <Tabs.Screen
                    name="inbox"
                    options={{
                        title: "Inbox",
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={icons.notificationOutlined}
                                iconFocused={icons.notificationFilled}
                                color={color}
                                name="Inbox"
                                focused={focused}
                            />
                        ),
                        tabBarButton: (props) => <ButtonNativeFeedback {...props} rippleColor='#FCBBBB' />
                    }}
                />
            </Tabs>
        </>
    )
}

export default TabsLayout
