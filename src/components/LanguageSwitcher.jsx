import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const languages = [
        { code: 'uz', label: "O'zbek", flag: '🇺🇿' },
        { code: 'ru', label: 'Русский', flag: '🇷🇺' },
        { code: 'tg', label: 'Тоҷикӣ', flag: '🇹🇯' },
        { code: 'fa', label: 'فارسی', flag: '🇮🇷' },
        { code: 'en', label: 'English', flag: '🇺🇸' },
    ];

    return (
        <div className="relative group">
            <button className="flex items-center text-white hover:text-green-100 transition-colors">
                <span className="mr-1">{languages.find((l) => l.code === i18n.language)?.flag || '🌐'}</span>
                <span className="uppercase">{i18n.language}</span>
            </button>
            <div className="absolute right-0 top-full pt-2 w-32 hidden group-hover:block z-50">
                <div className="bg-white rounded-md shadow-lg py-1 border border-gray-100">
                    {languages.map((lng) => (
                        <button
                            key={lng.code}
                            onClick={() => changeLanguage(lng.code)}
                            className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 ${i18n.language === lng.code ? 'bg-green-50 text-green-600 font-bold' : ''
                                }`}
                        >
                            <span className="mr-2">{lng.flag}</span>
                            {lng.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LanguageSwitcher;
