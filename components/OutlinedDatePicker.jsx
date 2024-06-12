import { View, Text, TouchableOpacity, Platform } from "react-native";
import React, { useState } from "react";
import { TextInput } from "react-native-paper";
import { formatTime } from "../lib/helpers";
import DateTimePicker from '@react-native-community/datetimepicker';

const OutlinedDatePicker = ({
    title,
    date,
    setDate,
    otherStyles,
    required = false,
    ...props
}) => {
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;

        setDate(currentDate);
        setShow(Platform.OS === "ios" ? true : false);
    };

    const dateObj = new Date(date);

    const formartedDate = formatTime(date, "customFormat", "DD/MM/YYYY");

    return (
        <View className="mb-4">
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShow(true)}
            >
                <TextInput
                    theme={{
                        colors: {
                            primary: "#F79433",
                        },
                        roundness: 10,
                    }}
                    label={title}
                    mode="outlined"
                    value={formartedDate}
                    onChangeText={setDate}
                    placeholder={title}
                    {...props}
                    editable={false}
                />
            </TouchableOpacity>

            {show && (
                <DateTimePicker
                    value={dateObj}
                    maximumDate={Date.parse(new Date())}
                    display="default"
                    mode={"date"}
                    onChange={onChange}
                />
            )}
        </View>
    );
};

export default OutlinedDatePicker;
