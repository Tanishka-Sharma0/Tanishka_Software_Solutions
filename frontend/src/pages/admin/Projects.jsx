import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/Layouts/AdminLayout';
import toast from 'react-hot-toast';
import ProjectModal from '../../components/Modals/ProjectModal';
import AssignModal from '../../components/Modals/AssignModal';

const AdminProjects = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [services, setServices] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        client: '',
        service: '',
        startDate: '',
        deadline: ''
    });

    useEffect(() => {
        fetchServices();
        fetchProjects();
        fetchUsers();
    }, [])

    const fetchProjects = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/projects`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setProjects(data);
        } catch (error) {
            toast.error('Error fetching projects');
        }
    };

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchServices = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/services`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setServices(data);
        } catch (error) {
            toast.error('Error fetching services');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/projects`, formData, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            toast.success('Project created successfully');
            setShowModal(false);
            fetchProjects();
        } catch (error) {
            toast.error('Error creating project');
        }
    };

    const handleAssignEmployees = async (projectId, employeeIds) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/projects/${projectId}/assign`, { employeeIds }, { headers: { Authorization: `Bearer ${user.token}` } });
            toast.success('Employees assigned successfully');
            setShowAssignModal(false);
            fetchProjects();
        } catch (error) {
            toast.error('Error assigning employees');
        }
    }
    return (
        <AdminLayout>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className='text-2xl font-bold mb-4'>Projects</h1>
                    <p>Manage your projects here.</p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Create Project
                    </button>
                </div>
                <div className="grid grid-cols-1 gap-6">
                    {projects.map((project) => (
                        <div key={project._id} className="bg-white p-6 rounded-lg shadow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-bold">{project.name}</h2>
                                    <p className="text-gray-600 mt-1">{project.description}</p>

                                    <div className="mt-4 grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Client</p>
                                            <p className="font-medium">{project.client?.companyName || project.client?.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Service</p>
                                            <p className="font-medium">{project.service?.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Status</p>
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${project.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                project.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                                                    project.status === 'on-hold' ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'
                                                }`}>
                                                {project.status}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Deadline</p>
                                            <p className="font-medium">{new Date(project.deadline).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <p className="text-sm text-gray-500 mb-2">Assigned Employees</p>
                                        <div className="flex flex-wrap gap-2">
                                            {project.assignedEmployees?.map((emp) => (
                                                <span key={emp._id} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                                    {emp.name}
                                                </span>
                                            ))}
                                            {(!project.assignedEmployees || project.assignedEmployees.length === 0) && (
                                                <p className="text-gray-400">No employees assigned</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        setSelectedProject(project);
                                        setShowAssignModal(true);
                                    }}
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                >
                                    Assign Employees
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <ProjectModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onSubmit={handleSubmit}
                    formData={formData}
                    setFormData={setFormData}
                    clients={users.filter(u => u.role === 'client')}
                    services={services}
                />

                {showAssignModal && selectedProject && (
                    <AssignModal
                        isOpen={showAssignModal}
                        onClose={() => setShowAssignModal(false)}
                        onAssign={handleAssignEmployees}
                        project={selectedProject}
                        employees={users.filter(u => u.role === 'employee')}
                    />
                )}
            </div>
        </AdminLayout>
    )
};
export default AdminProjects;