import { Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import BackButtonHeader from '../../../../components/BackButtonHeader'
import { useTranslation } from 'react-i18next'
import CustomHeader from '../../../../components/Header'

const RequestLayout = () => {
    const { t } = useTranslation();

    return (
        <>
            <Stack
                screenOptions={{
                    headerShown: true,
                    headerTitle: (props) => <CustomHeader {...props} />,
                    headerLeft: () => null,
                    headerRight: () => null,
                }}>
                <Stack.Screen
                    name="index"
                    options={{
                        headerShown: false,
                        animation: 'fade_from_bottom',
                    }}
                />

                <Stack.Screen
                    name="[id]"
                    options={{
                        headerShown: false,
                        animation: 'ios',
                        headerShown: true,
                        title: 'Setting',
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
