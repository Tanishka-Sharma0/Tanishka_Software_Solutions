import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/Layouts/AdminLayout';
import { Chart as ChartJs, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJs.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProjects: 0,
        pendingRequests: 0,
        totalServices: 0,

    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [users, project, requests, services] = await Promise.all([
                axios.get(`${process.env.REACT_APP_API_URL}/api/users`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }),
                axios.get(`${process.env.REACT_APP_API_URL}/api/projects`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }),
                axios.get(`${process.env.REACT_APP_API_URL}/api/service-requests`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }),
                axios.get(`${process.env.REACT_APP_API_URL}/api/services`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }),
            ]);
            setStats({
                totalUsers: users.data.length,
                totalProjects: project.data.length,
                pendingRequests: requests.data.filter(r => r.status === 'pending').length,
                totalServices: services.data.length,
            });

        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const pieData = {
        labels: ['Employees', 'Clients'],
        datasets: [
            {
                data: [12, 8],
                backgroundColor: ['#FF6384', '#36A2EB'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB']
            }
        ]
    };


    return (
        <AdminLayout>
            <div className="p-6">
                <h1 className="">Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-gray-500 text-sm">Total Users</h3>
                        <p className="text-3xl font-bold">{stats.totalUsers}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-gray-500 text-sm">Total Projects</h3>
                        <p className="text-3xl font-bold">{stats.totalProjects}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-gray-500 text-sm">Total Requests</h3>
                        <p className="text-3xl font-bold">{stats.pendingRequests}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-gray-500 text-sm">Total Services</h3>
                        <p className="text-3xl font-bold">{stats.totalServices}</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-4">User Distribution</h2>
                        <Pie data={pieData} />
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )

}
export default AdminDashboard;