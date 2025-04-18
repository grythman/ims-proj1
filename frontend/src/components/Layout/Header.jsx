import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import {
    BellIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
    LanguageIcon
} from '@heroicons/react/24/outline';

const Header = () => {
    const { user, logout } = useAuth();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showLanguageMenu, setShowLanguageMenu] = useState(false);
    const { t } = useTranslation();
    
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setShowLanguageMenu(false);
    };

    return (
        <header className="bg-white shadow-sm h-16 fixed top-0 left-0 right-0 z-50">
            <div className="h-full px-4 flex items-center justify-between">
                {/* Logo and Brand */}
                <div className="flex items-center space-x-4">
                    <Link to="/dashboard" className="flex items-center space-x-3">
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="h-8 w-8"
                        />
                        <span className="text-xl font-semibold text-gray-900">
                            IMS
                        </span>
                    </Link>
                </div>

                {/* Right Side Items */}
                <div className="flex items-center space-x-4">
                    {/* Language Selector */}
                    <div className="relative">
                        <button
                            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                            aria-label="Change language"
                        >
                            <LanguageIcon className="h-6 w-6" />
                        </button>
                        
                        {showLanguageMenu && (
                            <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg py-1 z-50">
                                <button
                                    onClick={() => changeLanguage('mn')}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    🇲🇳 Монгол
                                </button>
                                <button
                                    onClick={() => changeLanguage('en')}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    🇬🇧 English
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Notifications */}
                    <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                        <BellIcon className="h-6 w-6" />
                    </button>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center space-x-3 p-2 rounded-full hover:bg-gray-100"
                        >
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-medium text-gray-700">
                                    {user?.first_name} {user?.last_name}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {user?.user_type}
                                </div>
                            </div>
                            <UserCircleIcon className="h-8 w-8 text-gray-500" />
                        </button>

                        {showProfileMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                                <Link
                                    to="/profile"
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => setShowProfileMenu(false)}
                                >
                                    <UserCircleIcon className="h-5 w-5 mr-3 text-gray-400" />
                                    {t('profile')}
                                </Link>
                                <Link
                                    to="/settings"
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => setShowProfileMenu(false)}
                                >
                                    <Cog6ToothIcon className="h-5 w-5 mr-3 text-gray-400" />
                                    {t('settings')}
                                </Link>
                                <button
                                    onClick={() => {
                                        setShowProfileMenu(false);
                                        logout();
                                    }}
                                    className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                                >
                                    <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3 text-red-400" />
                                    {t('logout')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header; 