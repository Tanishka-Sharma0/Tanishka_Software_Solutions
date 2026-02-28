import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/Layouts/AdminLayout';
import toast from 'react-hot-toast';
import { FiCheck, FiX } from 'react-icons/fi';
import { API_BASE_URL } from '../../utils/constants';

const AdminServiceRequests = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);

    useEffect(() => { fetchRequests(); }, []);

    const fetchRequests = async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/api/service-requests`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setRequests(data);
        } catch (error) { toast.error('Error fetching requests'); }
    };

    const handleApprove = async (id) => {
        try {
            await axios.put(`${API_BASE_URL}/api/service-requests/${id}/approve`, {}, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            toast.success('Request approved & project created');
            fetchRequests();
        } catch (error) { toast.error('Error approving request'); }
    };

    const getStatusBadge = (status) => {
        const colors = { pending: 'bg-yellow-100 text-yellow-800', approved: 'bg-green-100 text-green-800', rejected: 'bg-red-100 text-red-800' };
        return <span className={`px-2 py-1 rounded-full text-xs ${colors[status] || 'bg-gray-100'}`}>{status}</span>;
    };

    const handleReject = async (id) => {
        if (window.confirm('Are you sure you want to reject this request?')) {
            try {
                await axios.put(`${API_BASE_URL}/api/service-requests/${id}/reject`, {}, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                toast.success('Request rejected');
                fetchRequests();
            } catch (error) {
                toast.error('Error rejecting request');
            }
        }
    };

    return (
        <AdminLayout>
            <div className="p-6">
                <h1 className="text-3xl font-bold mb-6">Service Requests</h1>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left">Client</th>
                                <th className="px-6 py-3 text-left">Service</th>
                                <th className="px-6 py-3 text-left">Description</th>
                                <th className="px-6 py-3 text-left">Status</th>
                                <th className="px-6 py-3 text-left">Date</th>
                                <th className="px-6 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((req) => (
                                <tr key={req._id} className="border-t">
                                    <td className="px-6 py-4">{req.client?.companyName || req.client?.name}</td>
                                    <td className="px-6 py-4">{req.service?.name}</td>
                                    <td className="px-6 py-4">{req.description}</td>
                                    <td className="px-6 py-4">{getStatusBadge(req.status)}</td>
                                    <td className="px-6 py-4">{new Date(req.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        {req.status === 'pending' && (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleApprove(req._id)}
                                                    className="text-green-600 hover:text-green-800"
                                                    title="Approve"
                                                >
                                                    <FiCheck size={20} />
                                                </button>
                                                <button
                                                    onClick={() => handleReject(req._id)}
                                                    className="text-red-600 hover:text-red-800"
                                                    title="Reject"
                                                >
                                                    <FiX size={20} />
                                                </button>
                                            </div>
                                        )}
                                        {req.status === 'approved' && (
                                            <span className="text-green-600 text-sm">✓ Approved</span>
                                        )}
                                        {req.status === 'rejected' && (
                                            <span className="text-red-600 text-sm">✗ Rejected</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminServiceRequests;