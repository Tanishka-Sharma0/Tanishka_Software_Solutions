import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import ClientLayout from '../../components/Layout/ClientLayout';
import toast from 'react-hot-toast';
import { FiPlus } from 'react-icons/fi';

const ClientServiceRequests = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [services, setServices] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ service: '', description: '' });

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [reqRes, servRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/api/service-requests`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                }),
                axios.get(`${import.meta.env.VITE_API_URL}/api/services`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                })
            ]);
            setRequests(reqRes.data);
            setServices(servRes.data);
        } catch (error) { toast.error('Error fetching data'); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/service-requests`, formData, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            toast.success('Request submitted');
            setShowModal(false);
            setFormData({ service: '', description: '' });
            fetchData();
        } catch (error) { toast.error('Error submitting request'); }
    };

    const getStatusBadge = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800'
        };
        return <span className={`px-2 py-1 rounded-full text-xs ${colors[status]}`}>{status}</span>;
    };

    return (
        <ClientLayout>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Service Requests</h1>
                    <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
                        <FiPlus className="mr-2" /> New Request
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left">Service</th>
                                <th className="px-6 py-3 text-left">Description</th>
                                <th className="px-6 py-3 text-left">Status</th>
                                <th className="px-6 py-3 text-left">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((req) => (
                                <tr key={req._id} className="border-t">
                                    <td className="px-6 py-4">{req.service?.name}</td>
                                    <td className="px-6 py-4">{req.description}</td>
                                    <td className="px-6 py-4">{getStatusBadge(req.status)}</td>
                                    <td className="px-6 py-4">{new Date(req.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg w-96">
                            <h2 className="text-xl font-bold mb-4">New Service Request</h2>
                            <form onSubmit={handleSubmit}>
                                <select className="w-full p-2 border rounded mb-3"
                                    value={formData.service} onChange={(e) => setFormData({ ...formData, service: e.target.value })} required>
                                    <option value="">Select Service</option>
                                    {services.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                                </select>
                                <textarea placeholder="Description" className="w-full p-2 border rounded mb-3" rows="3"
                                    value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
                                <div className="flex justify-end space-x-2">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </ClientLayout>
    );
};

export default ClientServiceRequests;