import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/Layouts/AdminLayout';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

const AdminServices = () => {
    const { user } = useAuth();
    const [services, setServices] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '', price: '', duration: '' });

    useEffect(() => { fetchServices(); }, []);

    const fetchServices = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/services`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setServices(data);
        } catch (error) { toast.error('Error fetching services'); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/services`, formData, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            toast.success('Service created');
            setShowModal(false);
            setFormData({ name: '', description: '', price: '', duration: '' });
            fetchServices();
        } catch (error) { toast.error('Error creating service'); }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this service?')) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL}/api/services/${id}`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                toast.success('Service deleted');
                fetchServices();
            } catch (error) { toast.error('Error deleting service'); }
        }
    };

    return (
        <AdminLayout>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Services</h1>
                    <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
                        <FiPlus className="mr-2" /> Add Service
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <div key={service._id} className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                            <p className="text-gray-600 mb-4">{service.description}</p>
                            <div className="flex justify-between items-center">
                                <div>
                                    <span className="text-2xl font-bold text-blue-600">${service.price}</span>
                                    <span className="text-gray-500 ml-2">/{service.duration}</span>
                                </div>
                                <button onClick={() => handleDelete(service._id)} className="text-red-600 hover:text-red-800">
                                    <FiTrash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg w-96">
                            <h2 className="text-xl font-bold mb-4">Add New Service</h2>
                            <form onSubmit={handleSubmit}>
                                <input type="text" placeholder="Service Name" className="w-full p-2 border rounded mb-3"
                                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                                <textarea placeholder="Description" className="w-full p-2 border rounded mb-3" rows="3"
                                    value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                                <input type="number" placeholder="Price" className="w-full p-2 border rounded mb-3"
                                    value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                                <input type="text" placeholder="Duration (e.g., 2 months)" className="w-full p-2 border rounded mb-3"
                                    value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} required />
                                <div className="flex justify-end space-x-2">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminServices;