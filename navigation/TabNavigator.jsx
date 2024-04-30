import { View, Text, Image, TouchableOpacity, Platform, TouchableWithoutFeedback } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomHeader from '../components/Header';
import ButtonNativeFeedback from '../components/ButtonNativeFeedback';
import MapScreen from '../pages/map/MapScreen';
import ChatScreen from '../pages/chat/ChatScreen';
import NotificationScreen from '../pages/notification/NotificationScreen';
import RequestScreen from '../pages/request/RequestScreen';
import { icons } from '../constants';
import { Feather, Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const TabIcon = ({ color, name, focused, customClass, size, route }) => {
    let icon = null;
    let title = '';
    switch (route.name) {
        case 'request':
            icon = focused ? icons.lifebuoyFilled : icons.lifebuoyOutlined;
            title = 'Requests';
            break;
        case 'map':
            icon = focused ? icons.mapsFilled : icons.mapsOutlined;
            title = 'Map';
            break;
        case 'chat':
            icon = focused ? icons.chatFilled : icons.chatOutlined;
            title = 'Chat';
            break;
        case 'inbox':
            icon = focused ? icons.notificationFilled : icons.notificationOutlined;
            title = 'Inbox';
            break;
        default:
            icon = icons.lifebuoyOutlined;
            title = 'Requests';
            break;
    }

    return (
        <View className={`items-center justify-center gap-1`}>
            <Image
                source={icon}
                resizeMode="contain"
                tintColor={color}
                className={customClass ? `${customClass}` : ''}
                style={{
                    width: size,
                    height: size,
                    tintColor: color,
                }}
            />
            <Text className={`text-xs font-pregular ${focused ? 'color-primary' : 'text-[#AAAAAA]'}`}>
                {title}
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

const EmptyTab = () => {
    return (
        <View>
        </View>
    )
}

const TabNavigator = () => {

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: true,
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
                header: (props) => <CustomHeader {...props} />,
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
                tabBarIcon: ({ color, focused, size }) => {
                    return (
                        <TabIcon
                            color={color}
                            focused={focused}
                            size={size}
                            route={route}
                        />
                    )
                },
                tabBarButton: (props) => <ButtonNativeFeedback {...props} rippleColor='#ffecec' />
            })}
        >
            <Tab.Screen
                name="request"
                component={RequestScreen}
                options={{
                    title: "Requests",
                    tabBarLabel: "Requests",
                }}
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
                        <EmptyIcon
                            icon={icons.plus}
                            color="#fff"
                            name="Create"
                            focused={focused}
                        />
                    ),
                    tabBarButton: (props) => <TouchableWithoutFeedback {...props} />,
                }}
                listeners={({ navigation, route }) => ({
                    tabPress: e => {
                        e.preventDefault();
                    }
                })}
            />
            <Tab.Screen name="chat" component={ChatScreen} />
            <Tab.Screen name="inbox" component={NotificationScreen} />
        </Tab.Navigator>
    )
}

export default TabNavigator