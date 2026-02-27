import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiHome, FiUsers, FiBriefcase, FiMessageSquare, FiLogOut, FiUser, FiSettings } from 'react-icons/fi';

const AdminLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-lg">
                <div className="p-4">
                    <h1 className="text-xl font-bold text-gray-800">Tanishka Software</h1>
                    <p className="text-sm text-gray-600">Admin Panel</p>
                </div>

                <nav className="mt-8">
                    <Link to="/admin" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
                        <FiHome className="mr-3" />
                        Dashboard
                    </Link>
                    <Link to="/admin/users" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
                        <FiUsers className="mr-3" />
                        Users
                    </Link>
                    <Link to="/admin/services" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
                        <FiSettings className="mr-3" />
                        Services
                    </Link>
                    <Link to="/admin/projects" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
                        <FiBriefcase className="mr-3" />
                        Projects
                    </Link>
                    <Link to="/admin/requests" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
                        <FiMessageSquare className="mr-3" />
                        Requests
                    </Link>
                    <Link to="/admin/messages" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
                        <FiMessageSquare className="mr-3" />
                        Messages
                    </Link>
                    <Link to="/profile" className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100">
                        <FiUser className="mr-3" />
                        Profile
                    </Link>
                </nav>

                <div className="absolute bottom-0 w-64 p-4">
                    <button
                        onClick={handleLogout}
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 w-full"
                    >
                        <FiLogOut className="mr-3" />
                        Logout
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                {children}
            </div>
        </div>
    );
};

export default AdminLayout;