import { TouchableNativeFeedback, View } from "react-native";

const ButtonNativeFeedback = ({ children, style, rippleColor, ...props }) => {
    return (
        <TouchableNativeFeedback
            {...props}
            background={TouchableNativeFeedback.Ripple(rippleColor, true)}>
            <View style={style}>{children}</View>
        </TouchableNativeFeedback>
    )
}

export default ButtonNativeFeedback;
