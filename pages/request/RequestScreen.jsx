import { View, Text, ScrollView } from 'react-native'
import CustomButton from '../../components/CustomButton'
import { Drawer } from 'expo-router/drawer'
import Post from '../../components/Post'

const RequestScreen = () => {

    return (
        <ScrollView>
            <Post id={1}/>
            <Post id={2}/>
            <Post id={3}/>
            <Post id={4}/>
            <Post id={5}/>
            <Post id={6}/>
            <Post id={7}/>
            <Post id={8}/>
            <Post id={9}/>
        </ScrollView>
    )
}

export default RequestScreen