import { TouchableNativeFeedback, View } from "react-native";

const ButtonNativeFeedback = ({ children, style, rippleColor, onPress, ...props }) => {
    console.log(onPress);
    return (
        <TouchableNativeFeedback
            onPress={onPress}
            {...props}
            background={TouchableNativeFeedback.Ripple(rippleColor, true)}>
            <View style={style}>{children}</View>
        </TouchableNativeFeedback>
    )
}

export default ButtonNativeFeedback;
