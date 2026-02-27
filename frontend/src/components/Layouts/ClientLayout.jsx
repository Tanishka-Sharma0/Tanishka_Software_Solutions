import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiHome, FiBriefcase, FiMessageSquare, FiLogOut, FiUser, FiClipboard } from 'react-icons/fi';

const ClientLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { path: '/client', icon: FiHome, label: 'Dashboard' },
        { path: '/client/projects', icon: FiBriefcase, label: 'My Projects' },
        { path: '/client/requests', icon: FiClipboard, label: 'Service Requests' },
        { path: '/client/messages', icon: FiMessageSquare, label: 'Messages' },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="w-64 bg-white shadow-lg flex flex-col">
                <div className="p-6">
                    <h1 className="text-xl font-bold text-gray-800">Tanishka Software</h1>
                    <p className="text-sm text-gray-600">Client Portal</p>
                </div>
                <nav className="flex-1 px-4">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link key={item.path} to={item.path}
                                className={`flex items-center px-4 py-3 mb-2 rounded-lg ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}>
                                <Icon className="mr-3" size={20} /> {item.label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t">
                    <div className="flex items-center mb-4 px-4">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                            {user?.name?.charAt(0)}
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium">{user?.name}</p>
                            <p className="text-xs text-gray-500">{user?.companyName || 'Client'}</p>
                        </div>
                    </div>
                    <Link to="/profile" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg mb-2">
                        <FiUser className="mr-3" /> Profile
                    </Link>
                    <button onClick={logout} className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg w-full">
                        <FiLogOut className="mr-3" /> Logout
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-auto p-8">{children}</div>
        </div>
    );
};

export default ClientLayout;