import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import ClientLayout from '../../components/Layouts/ClientLayout';
import { FiBriefcase, FiClipboard, FiMessageSquare, FiCheckCircle } from 'react-icons/fi';


const ClientDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ totalProjects: 0, pendingRequests: 0, completedProjects: 0, messages: 0 });

    useEffect(() => { fetchStats(); }, []);

    const fetchStats = async () => {
        try {
            const projects = await axios.get(`${import.meta.env.VITE_API_URL}/api/projects`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            const requests = await axios.get(`${import.meta.env.VITE_API_URL}/api/service-requests`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setStats({
                totalProjects: projects.data.length,
                pendingRequests: requests.data.filter(r => r.status === 'pending').length,
                completedProjects: projects.data.filter(p => p.status === 'completed').length,
                messages: 3
            });
        } catch (error) { console.error('Error fetching stats'); }
    }
    return (
        <ClientLayout>
            <div className="p-6">
                <h1 className="text-3xl font-bold mb-6">Welcome, {user?.companyName || user?.name}!</h1>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <FiBriefcase className="text-3xl text-blue-600 mb-2" />
                        <h3 className="text-gray-500">Total Projects</h3>
                        <p className="text-3xl font-bold">{stats.totalProjects}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <FiClipboard className="text-3xl text-yellow-600 mb-2" />
                        <h3 className="text-gray-500">Pending Requests</h3>
                        <p className="text-3xl font-bold">{stats.pendingRequests}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <FiCheckCircle className="text-3xl text-green-600 mb-2" />
                        <h3 className="text-gray-500">Completed</h3>
                        <p className="text-3xl font-bold">{stats.completedProjects}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <FiMessageSquare className="text-3xl text-blue-600 mb-2" />
                        <h3 className="text-gray-500">Messages</h3>
                        <p className="text-3xl font-bold">{stats.messages}</p>
                    </div>
                </div>
            </div>
        </ClientLayout>
    );
};

export default ClientDashboard;