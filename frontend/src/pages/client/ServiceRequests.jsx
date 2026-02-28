import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import ClientLayout from '../../components/Layouts/ClientLayout';
import RequestModal from '../../components/Modals/RequestModal';
import toast from 'react-hot-toast';
import { FiPlus } from 'react-icons/fi';
import { API_BASE_URL } from '../../utils/constants';

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
                axios.get(`${API_BASE_URL}/api/service-requests`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                }),
                axios.get(`${API_BASE_URL}/api/services`, {
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
            await axios.post(`${API_BASE_URL}/api/service-requests`, formData, {
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

                <RequestModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onSubmit={handleSubmit}
                    formData={formData}
                    setFormData={setFormData}
                    services={services}
                />
            </div>
        </ClientLayout>
    );
};

export default ClientServiceRequests;