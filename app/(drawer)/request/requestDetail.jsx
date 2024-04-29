import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { StatusBar } from 'expo-status-bar';

const RequestDetail = () => {
    const { id } = useLocalSearchParams();

    return (
        <ScrollView>
            <Text>{`RequestDetail1231231 ${id}`}</Text>
        </ScrollView>
    )
}

export default RequestDetail