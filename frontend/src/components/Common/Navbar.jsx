import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiHome, FiLogOut, FiUser } from 'react-icons/fi';

const Navbar = () => {
    const { user, logout } = useAuth();;
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleAccess = (targetRole, path) => {
        if (user.role === 'admin') {
            navigate(path);
            return;
        }

        if (user.role !== targetRole) {
            toast.error(`Your role is ${user.role}. You cannot access ${targetRole} dashboard.`);
            return;
        }

        navigate(path);
    };

    if (!user) return null;

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0">
                        <h1 className="text-xl font-bold text-gray-800">Tanishka Software</h1>
                    </div>
                    <div className="flex space-x-4">
                        <Link
                            to="/admin"
                            onClick={() => handleAccess('admin', '/admin')}
                            className={`px-3 py-2 rounded-md text-sm font-medium ${user.role === 'admin'
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            Admin Dashboard
                        </Link>
                        <Link
                            to="/employee"
                            onClick={() => handleAccess('admin', '/admin')}
                            className={`px-3 py-2 rounded-md text-sm font-medium ${user.role === 'employee'
                                ? 'bg-green-600 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            Employee Dashboard
                        </Link>
                        <Link
                            to="/client"
                            onClick={() => handleAccess('admin', '/admin')}
                            className={`px-3 py-2 rounded-md text-sm font-medium ${user.role === 'client'
                                ? 'bg-purple-600 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            Client Dashboard
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold
                ${user.role === 'admin' ? 'bg-blue-600' :
                                    user.role === 'employee' ? 'bg-green-600' : 'bg-purple-600'}`}>
                                {user.name?.charAt(0)}
                            </div>
                            <span className="text-sm text-gray-700">{user.name}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
                        >
                            <FiLogOut size={18} />
                            <span className="text-sm">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;