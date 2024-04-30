import { View, Text } from 'react-native'
import React from 'react'
import RequestDetailScreen from '../pages/request/RequestDetailScreen';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import BackButtonHeader from '../components/BackButtonHeader';

const Stack = createStackNavigator();

const StackNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: true,
                header: (props) => <BackButtonHeader {...props} />
            }}
        >
            <Stack.Screen
                name="requestDetail"
                component={RequestDetailScreen}
                options={{
                    title: "Request Detail",
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
                }}
            />
        </Stack.Navigator>
    )
}

export default StackNavigator