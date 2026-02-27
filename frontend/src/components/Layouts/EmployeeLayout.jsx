import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    FiHome,
    FiBriefcase,
    FiMessageSquare,
    FiLogOut,
    FiUser,
    FiCalendar
} from 'react-icons/fi';

const EmployeeLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { path: '/employee', icon: FiHome, label: 'Dashboard' },
        { path: '/employee/projects', icon: FiBriefcase, label: 'My Projects' },
        { path: '/employee/messages', icon: FiMessageSquare, label: 'Messages' },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="w-64 bg-white shadow-lg flex flex-col">
                <div className="p-6">
                    <h1 className="text-xl font-bold text-gray-800">Tanishka Software</h1>
                    <p className="text-sm text-gray-600 mt-1">Employee Portal</p>
                </div>

                <nav className="flex-1 px-4">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-4 py-3 mb-2 rounded-lg transition ${isActive
                                    ? 'bg-green-50 text-green-600'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <Icon className="mr-3" size={20} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t">
                    <div className="flex items-center mb-4 px-4">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {user?.name?.charAt(0)}
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                            <p className="text-xs text-gray-500">Employee</p>
                        </div>
                    </div>

                    <Link
                        to="/profile"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg w-full mb-2"
                    >
                        <FiUser className="mr-3" size={20} />
                        Profile
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg w-full"
                    >
                        <FiLogOut className="mr-3" size={20} />
                        Logout
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                <div className="p-8">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default EmployeeLayout;