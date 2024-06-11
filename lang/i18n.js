import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

import en from "./en.json";
import vi from "./vi.json";
import { locale } from "moment";

const LANGUAGE_KEY = "language";

export const loadLanguage = async () => {
    try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
        return savedLanguage || "en";
    } catch (e) {
        console.error("Failed to load the language from AsyncStorage", e);
        return "en";
    }
};

const initI18n = async () => {
    const lng = await loadLanguage();
    locale(lng);

    i18next.use(initReactI18next).init({
        compatibilityJSON: "v3",
        interpolation: {
            escapeValue: false,
        },
        lng: lng,
        fallbackLng: "en",
        resources: {
            en: {
                translation: en,
            },
            vi: {
                translation: vi,
            },
        },
    });
};

initI18n();

export const changeLanguage = async (language) => {
    try {
        console.log("Changing the language to", language);
        await AsyncStorage.setItem(LANGUAGE_KEY, language);
        await i18next.changeLanguage(language);
        locale(language);

        return true;
    } catch (e) {
        console.error("Failed to change the language", e);
    }
};

export default i18next;
