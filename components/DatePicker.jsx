import { View, Text, Platform, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';

const DatePicker = ({ title, date, setDate, otherStyles, required = false }) => {
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;

        setDate(currentDate);
        setShow(Platform.OS === 'ios' ? true : false);
    };

    const handleShow = () => {
        setShow(true);
    }

    return (<View className={`space-y-2 ${otherStyles}`}>
        <Text className="text-base font-semibold">
            {required ? (
                <>
                    {title}
                    <Text className="text-red-500"> *</Text>
                </>
            ) : (
                title
            )}
        </Text>
        <TouchableOpacity onPress={handleShow} className="border-[1px] rounded-2xl px-4 h-14 w-full bg-gray-50 border-gray-300 
            focus:ring-primary  focus:border-primary flex flex-row items-center">
            <Text className="flex-1 text-base font-medium text-gray-900">{formatDate(date)}</Text>
        </TouchableOpacity>
        {show && (
            <DateTimePicker
                value={date}
                maximumDate={Date.parse(new Date())}
                display='default'
                mode={'date'}
                onChange={onChange}
            />
        )}
    </View>);
}

const formatDate = (date) => {
    return `${date.getDate()}/${date.getMonth() +
        1}/${date.getFullYear()}`;
};

export default DatePicker
