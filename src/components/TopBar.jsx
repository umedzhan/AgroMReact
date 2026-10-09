import React, { useContext } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const TopBar = () => {
    const { user } = useContext(AuthContext);
    const { t } = useTranslation();

    return (
        <div className="bg-ink-950 text-ink-200 text-xs hidden md:block relative z-[51]">
            <div className="container mx-auto px-4 py-2 flex justify-between items-center">
                <div className="flex items-center space-x-6">
                    <div className="flex items-center hover:text-white cursor-pointer transition-colors">
                        <FaMapMarkerAlt className="mr-2 text-harvest-300" />
                        <span>{t('topbar.store_location')}</span>
                    </div>
                </div>
                <div className="flex items-center space-x-6">
                    <div className="flex items-center z-50">
                        <LanguageSwitcher />
                        <span className="text-ink-500 mx-2">|</span>
                        <span className="text-ink-300">USD</span>
                    </div>
                    <div className="border-l border-white/10 h-4 mx-2"></div>
                    {!user ? (
                        <div className="flex space-x-4">
                            <Link to="/login" className="hover:text-white">{t('common.sign_in')}</Link>
                            <span>/</span>
                            <Link to="/register" className="hover:text-white">{t('common.sign_up')}</Link>
                        </div>
                    ) : (
                        <div className="flex space-x-4">
                            <span>{t('topbar.hi')}, {user.name}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopBar;
