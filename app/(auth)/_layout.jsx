import { Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const AuthLayout = () => {
    return (
        <>
            <Stack>
                <Stack.Screen
                    name="sign-in"
                    options={{
                        headerShown: false,
                        animation: 'ios',
                    }}
                />

                <Stack.Screen
                    name="sign-up"
                    options={{
                        headerShown: false,
                        animation: 'ios',
                    }}
                />
            </Stack>
        </>
    )
}

export default AuthLayout
