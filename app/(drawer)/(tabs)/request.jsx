import { View, Text, ScrollView } from 'react-native'
import CustomButton from '../../../components/CustomButton'
import { Drawer } from 'expo-router/drawer'
import Post from '../../../components/Post'

const Request = () => {

    return (
        <ScrollView>
            <Post />
            <Post />
            <Post />
            <Post />
            <Post />
            <Post />
            <Post />
            <Post />
        </ScrollView>
    )
}

export default Request