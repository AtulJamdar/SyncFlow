import React from 'react';
import useAuthStore from '../../store/useAuthStore';
import { FaUserCircle } from 'react-icons/fa';
import ThemeToggle from '../common/ThemeToggle';

const Navbar = () => {
    const { user } = useAuthStore();

    return (
        <header className="flex items-center justify-between h-16 bg-white dark:bg-gray-800 shadow-md px-6 border-b border-gray-200 dark:border-gray-700">
            <div>{/* Can be used for search bar or breadcrumbs */}</div>
            <div className="flex items-center gap-4">
                <ThemeToggle /> {/* Add the toggle here */}
                <div className="flex items-center">
                    <span className="text-right mr-4">
                        <div className="font-semibold text-gray-800 dark:text-gray-200">{user?.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</div>
                    </span>
                    <FaUserCircle size={32} className="text-gray-600 dark:text-gray-400" />
                </div>
            </div>
        </header>
    );
};

export default Navbar;