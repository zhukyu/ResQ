import { Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import BackButtonHeader from '../../../../components/BackButtonHeader'
import { useTranslation } from 'react-i18next'
import CustomHeader from '../../../../components/Header'
import { StatusBar } from 'expo-status-bar'

const RequestLayout = () => {
    const { t } = useTranslation();

    return (
        <>
            <StatusBar translucent={false} />
            <Stack
                screenOptions={{
                    headerShown: true,
                }}

            >
                <Stack.Screen
                    name="index"
                    options={{
                        headerShown: true,
                        animation: 'fade_from_bottom',
                        header: (props) => <CustomHeader {...props} />,
                        headerLeft: () => null,
                        headerShadowVisible: true,
                    }}
                />

                <Stack.Screen
                    name="[id]"
                    options={{
                        headerShown: true,
                        animation: 'ios',
                        headerShown: true,
                        title: 'Detail',
                        header: (props) => <BackButtonHeader title={t('Detail')} />,
                        headerRight: () => null,
                        headerStyle: {
                            backgroundColor: '#fff',
                        },
                    }}
                />
            </Stack>
        </>
    )
}

export default RequestLayout
