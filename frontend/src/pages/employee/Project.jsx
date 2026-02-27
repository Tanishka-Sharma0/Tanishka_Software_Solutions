import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import EmployeeLayout from '../../components/Layouts/EmployeeLayout';
import toast from 'react-hot-toast';

const EmployeeProjects = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);

    useEffect(() => { fetchProjects(); }, []);

    const fetchProjects = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/projects`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setProjects(data);
        } catch (error) { toast.error('Error fetching projects'); }
    };

    const updateStatus = async (projectId, status) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/projects/${projectId}/status`, { status }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            toast.success('Status updated');
            fetchProjects();
        } catch (error) { toast.error('Error updating status'); }
    };

    const getStatusBadge = (status) => {
        const colors = {
            pending: 'bg-gray-100 text-gray-800',
            'in-progress': 'bg-yellow-100 text-yellow-800',
            completed: 'bg-green-100 text-green-800',
            'on-hold': 'bg-red-100 text-red-800'
        };
        return <span className={`px-2 py-1 rounded-full text-xs ${colors[status]}`}>{status}</span>;
    };

    return (
        <EmployeeLayout>
            <div className="p-6">
                <h1 className="text-3xl font-bold mb-6">My Projects</h1>
                <div className="grid grid-cols-1 gap-6">
                    {projects.map((project) => (
                        <div key={project._id} className="bg-white p-6 rounded-lg shadow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-bold">{project.name}</h2>
                                    <p className="text-gray-600 mt-1">{project.description}</p>
                                    <div className="mt-4 grid grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Client</p>
                                            <p className="font-medium">{project.client?.companyName || project.client?.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Service</p>
                                            <p className="font-medium">{project.service?.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Deadline</p>
                                            <p className="font-medium">{new Date(project.deadline).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {getStatusBadge(project.status)}
                                    <select
                                        value={project.status}
                                        onChange={(e) => updateStatus(project._id, e.target.value)}
                                        className="border rounded p-1 text-sm"
                                        disabled={project.status === 'completed'}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                        <option value="on-hold">On Hold</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </EmployeeLayout>
    );
};

export default EmployeeProjects;