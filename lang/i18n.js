import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en.json';
import vi from './vi.json';

i18next
    .use(initReactI18next)
    .init({
        compatibilityJSON: 'v3',
        interpolation: {
            escapeValue: false,
        },
        lng: 'vi',
        fallbackLng: 'en',
        resources: {
            en: {
                translation: en,
            },
            vi: {
                translation: vi,
            },
        },
    })

export default i18next