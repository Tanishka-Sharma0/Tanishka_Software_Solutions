import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiBriefcase, FiSave } from 'react-icons/fi';
import { API_BASE_URL } from '../utils/constants';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        companyName: user?.companyName || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            return toast.error('Passwords do not match');
        }

        setLoading(true);
        try {
            const updateData = {
                name: formData.name,
                phone: formData.phone,
                ...(formData.companyName && { companyName: formData.companyName }),
                ...(formData.newPassword && { password: formData.newPassword })
            };

            const { data } = await axios.put(`${API_BASE_URL}/api/users/profile`, updateData, {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            const updatedUser = { ...user, ...data };
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));

            toast.success('Profile updated successfully');
            setTimeout(() => window.location.reload(), 1500);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    const getLayout = () => {
        switch (user?.role) {
            case 'admin': return '/admin';
            case 'employee': return '/employee';
            case 'client': return '/client';
            default: return '/login';
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
                        <div className="flex items-center">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-blue-600">
                                {user?.name?.charAt(0)}
                            </div>
                            <div className="ml-6 text-white">
                                <h1 className="text-2xl font-bold">{user?.name}</h1>
                                <p className="text-blue-100 capitalize">{user?.role}</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <div className="relative">
                                    <FiUser className="absolute left-3 top-3 text-gray-400" />
                                    <input type="text" name="name" value={formData.name} onChange={handleChange}
                                        className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <div className="relative">
                                    <FiMail className="absolute left-3 top-3 text-gray-400" />
                                    <input type="email" value={user?.email} disabled
                                        className="pl-10 w-full p-2 border rounded-lg bg-gray-50" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                <div className="relative">
                                    <FiPhone className="absolute left-3 top-3 text-gray-400" />
                                    <input type="text" name="phone" value={formData.phone} onChange={handleChange}
                                        className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>

                            {user?.role === 'client' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                                    <div className="relative">
                                        <FiBriefcase className="absolute left-3 top-3 text-gray-400" />
                                        <input type="text" name="companyName" value={formData.companyName} onChange={handleChange}
                                            className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="border-t pt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input type="password" name="currentPassword" placeholder="Current Password"
                                    value={formData.currentPassword} onChange={handleChange}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                                <input type="password" name="newPassword" placeholder="New Password"
                                    value={formData.newPassword} onChange={handleChange}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                                <input type="password" name="confirmPassword" placeholder="Confirm Password"
                                    value={formData.confirmPassword} onChange={handleChange}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button type="button" onClick={() => navigate(getLayout())}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                                Cancel
                            </button>
                            <button type="submit" disabled={loading}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center disabled:opacity-50">
                                <FiSave className="mr-2" /> {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;