import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getCurrentUser } from '../../../lib/appwrite'

const Inbox = () => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        getCurrentUser().then((user) => {
            setUser(user)
        })
    }, [])

    return (
        <View>
            <Text>Inbox</Text>
            {user &&
                <>
                    <Text>{user.email}</Text>
                    <Text>{user.name}</Text>
                    <Text>{user.role}</Text>
                </>
            }
        </View >
    )
}

export default Inbox