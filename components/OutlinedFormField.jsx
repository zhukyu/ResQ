import { View, Text } from "react-native";
import React from "react";
import { HelperText, TextInput } from "react-native-paper";

const OutlinedFormField = ({
    title,
    name,
    value,
    placeholder,
    handeChangeText,
    otherStyles,
    showPassword,
    setShowPassword,
    required = false,
    error,
    multiline = false,
    ...props
}) => {
    return (
        <View className={error ? "" : "mb-4"}>
            <TextInput
                theme={{
                    colors: {
                        primary: "#F79433",
                    },
                    roundness: 10,
                }}
                label={title}
                mode="outlined"
                value={value}
                onChangeText={handeChangeText}
                placeholder={placeholder}
                multiline={true}
                {...props}
            />
            {error && (
                <HelperText type="error" visible={error}>
                    {error}
                </HelperText>
            )}
        </View>
    );
};

export default OutlinedFormField;
