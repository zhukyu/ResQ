import { View, Text, TouchableOpacity } from 'react-native'
import { Header } from '@react-navigation/elements';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const BackButtonHeader = ({ title }) => {
    return (
        // <View className="flex flex-row items-center justify-center">
        //     <Text className='text-xl font-bold'>{props?.route?.name}</Text>
        // </View>
        <Header
            title={title}
            headerLeft={() => (
                <TouchableOpacity className="p-4" onPress={() => router.back()}>
                    <View className="">
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </View>
                </TouchableOpacity >
            )}
            headerTitleStyle={{
                marginLeft: -14,
            }}
            headerStyle={{
                shadowOffset: {
                    width: 0,
                    height: 3,
                },
                shadowColor: '#171717',
                shadowOpacity: 0.2,
                shadowRadius: 3.84,
                elevation: 6,
            }}
        />
    )
}

export default BackButtonHeader