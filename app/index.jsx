import { StatusBar } from 'expo-status-bar';
import { Image, ScrollView, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { images } from '../constants';
import CustomButton from '../components/CustomButton';

export default function App() {
    return (
        <SafeAreaView className="bg-white h-full">
            <ScrollView contentContainerStyle={{ height: '100%' }}>
                <View className='w-full justify-center items-center h-full flex p-4'>
                    <View className='w-full justify-center items-center flex flex-row gap-2'>
                        <View className=''>
                            <Image source={images.resqlogo} className='w-12 h-20' resizeMode='contain' />
                        </View>
                        <View className='flex justify-center items-center flex-col'>
                            <Text className='text-4xl font-pbold text-primary'>RES<Text className="text-secondary-200">Q</Text></Text>
                            <Text className='text-xs font-psemibold text-secondary-200'>SAVE YOUR LIFE</Text>
                        </View>
                    </View>
                    <CustomButton
                        title="Continue with email"
                        handlePress={() => router.push('/sign-in')}
                        containerStyles="w-full mt-7"
                    />
                </View>
            </ScrollView>

            {/* <StatusBar backgroundColor='#161622' style='light'/> */}
        </SafeAreaView>
    );
}
