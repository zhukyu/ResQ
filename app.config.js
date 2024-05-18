module.exports = ({ config }) => {
    return {
        ...config,

        // add google maps api key in expo.android.config.googleMaps.apiKey
        android: {
            ...config.android,
            config: {
                googleMaps: {
                    apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
                },
            },
        },
    };
};
