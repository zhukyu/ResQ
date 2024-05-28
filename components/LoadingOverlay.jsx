import React, { useEffect, useState } from "react";
import { Modal, View, ActivityIndicator, Dimensions } from "react-native";

const LoadingOverlay = ({ visible }) => {

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            statusBarTranslucent={true}
        >
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
            >
                <ActivityIndicator size="large" color="#F73334" />
            </View>
        </Modal>
    );
};

export default LoadingOverlay;
