import React from 'react';
import { NavLink } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { FaTachometerAlt, FaUsers, FaBriefcase, FaFileInvoice, FaUserFriends, FaSignOutAlt } from 'react-icons/fa';
import { FaChartLine } from 'react-icons/fa';

// Define links for each role
const navLinks = {
    admin: [
        { path: '/dashboard/admin', icon: <FaTachometerAlt />, label: 'Dashboard' },
        { path: '/dashboard/clients', icon: <FaUsers />, label: 'Clients' },
        { path: '/dashboard/projects', icon: <FaBriefcase />, label: 'Projects' },
        { path: '/dashboard/invoices', icon: <FaFileInvoice />, label: 'Invoices' },
        { path: '/dashboard/teams', icon: <FaUserFriends />, label: 'Teams' },
        { path: '/dashboard/users', icon: <FaUsers />, label: 'Users' },
        { path: '/dashboard/analytics', icon: <FaChartLine />, label: 'Analytics' },
    ],
    manager: [
        { path: '/dashboard/manager', icon: <FaTachometerAlt />, label: 'Dashboard' },
        { path: '/dashboard/projects', icon: <FaBriefcase />, label: 'Projects' },
        { path: '/dashboard/teams', icon: <FaUserFriends />, label: 'My Teams' },
    ],
    accountant: [
        { path: '/dashboard/accountant', icon: <FaTachometerAlt />, label: 'Dashboard' },
        { path: '/dashboard/invoices', icon: <FaFileInvoice />, label: 'Invoices' },
        { path: '/dashboard/clients', icon: <FaUsers />, label: 'Clients' },
    ],
    user: [
        { path: '/dashboard/user', icon: <FaTachometerAlt />, label: 'My Dashboard' },
        { path: '/dashboard/my-projects', icon: <FaBriefcase />, label: 'My Projects' },
    ]
};

const Sidebar = () => {
    const { user, logout } = useAuthStore();
    const userRole = user?.role === 'owner' ? 'admin' : user?.role; // Treat owner as admin for UI
    const links = navLinks[userRole] || [];

    return (
        <div className="w-64 bg-gray-800 text-white flex flex-col">
            <div className="p-4 text-2xl font-bold border-b border-gray-700">SyncFlow</div>
            <nav className="flex-1 px-2 py-4 space-y-2">
                {links.map(({ path, icon, label }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) =>
                            `flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`
                        }
                    >
                        <span className="mr-3">{icon}</span>
                        {label}
                    </NavLink>
                ))}
            </nav>
            <div className="p-4 border-t border-gray-700">
                <button onClick={logout} className="w-full flex items-center px-4 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                    <FaSignOutAlt className="mr-3" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;