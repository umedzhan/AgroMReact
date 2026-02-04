import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import uz from './locales/uz/translation.json';
import ru from './locales/ru/translation.json';
import fa from './locales/fa/translation.json';
import tg from './locales/tg/translation.json';
import en from './locales/en/translation.json';

const resources = {
    uz: {
        translation: uz
    },
    ru: {
        translation: ru
    },
    fa: {
        translation: fa
    },
    tg: {
        translation: tg
    },
    en: {
        translation: en
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'uz', // Default language
        debug: true,

        interpolation: {
            escapeValue: false, // React already safe from XSS
        }
    });

export default i18n;
