import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React from 'react'

const RequestDetailScreen = ({ route }) => {
    const { id } = route.params

    return (
        <ScrollView className="h-screen">
            <Text>{`RequestDetail ${id}`}</Text>
        </ScrollView>
    )
}

export default RequestDetailScreen