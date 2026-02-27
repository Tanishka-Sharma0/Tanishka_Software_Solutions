import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import EmployeeLayout from '../../components/Layout/EmployeeLayout';
import { FiBriefcase, FiMessageSquare, FiCheckCircle } from 'react-icons/fi';


const EmployeeDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ totalProjects: 0, inProgress: 0, completed: 0, messages: 0 });
    useEffect(() => { fetchStats(); }, []);

    const fetchStats = async () => {
        try {
            const projects = await axios.get(`${import.meta.env.VITE_API_URL}/api/projects`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setStats({
                totalProjects: projects.data.length,
                inProgress: projects.data.filter(p => p.status === 'in-progress').length,
                completed: projects.data.filter(p => p.status === 'completed').length,
                messages: 5
            });
        } catch (error) { console.error('Error fetching stats'); }
    };

    return (
        <EmployeeLayout>
            <div className="p-6">
                <h1 className="text-3xl font-bold mb-6">Welcome, {user?.name}!</h1>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <FiBriefcase className="text-3xl text-green-600 mb-2" />
                        <h3 className="text-gray-500">Total Projects</h3>
                        <p className="text-3xl font-bold">{stats.totalProjects}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <FiCheckCircle className="text-3xl text-yellow-600 mb-2" />
                        <h3 className="text-gray-500">In Progress</h3>
                        <p className="text-3xl font-bold">{stats.inProgress}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <FiCheckCircle className="text-3xl text-green-600 mb-2" />
                        <h3 className="text-gray-500">Completed</h3>
                        <p className="text-3xl font-bold">{stats.completed}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <FiMessageSquare className="text-3xl text-blue-600 mb-2" />
                        <h3 className="text-gray-500">Messages</h3>
                        <p className="text-3xl font-bold">{stats.messages}</p>
                    </div>
                </div>
            </div>
        </EmployeeLayout>
    );
};

export default EmployeeDashboard;