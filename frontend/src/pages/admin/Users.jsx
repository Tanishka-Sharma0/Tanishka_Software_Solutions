import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/Layouts/AdminLayout';
import toast from 'react-hot-toast';
import UserModal from '../../components/Modals/UserModal';

const AdminUsers = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'employee',
        companyName: '',
        phone: ''
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setUsers(data);
        } catch (error) {
            toast.error('Error fetching users');
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/users`, formData, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            toast.success('User created successfully');
            setShowModal(false);
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'employee',
                companyName: '',
                phone: ''
            });
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error creating user');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/${id}`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                toast.success('User deleted successfully');
                fetchUsers();
            } catch (error) {
                toast.error('Error deleting user');
            }
        }
    };
    return (
        <AdminLayout>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Manage Users</h1>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Add New User
                    </button>
                </div>
                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((u) => (
                                <tr key={u.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{u.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{u.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                            u.role === 'employee' ? 'bg-green-100 text-green-800' :
                                                'bg-blue-100 text-blue-800'
                                            }`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{u.companyName || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{u.phone || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {u.role !== 'admin' && (
                                            <button
                                                onClick={() => handleDelete(u._id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <UserModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onSubmit={handleSubmit}
                    formData={formData}
                    setFormData={setFormData}
                />
            </div>
        </AdminLayout>
    );
}
export default AdminUsers;