import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

const RequestDetail = () => {
    const { id } = useLocalSearchParams();

    return (
        <View>
            <Text>{`RequestDetail ${id}`}</Text>
        </View>
    )
}

export default RequestDetail