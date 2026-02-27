import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/Layouts/AdminLayout';
import toast from 'react-hot-toast';


const AdminProjects = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
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
        fetchProjects();
        fetchUsers();
    }, [])

    const fetchProjects = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/projects`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setProjects(data);
        } catch (error) {
            toast.error('Error fetching projects');
        }
    };

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/users`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/projects`, formData, {
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
            await axios.put(`${process.env.REACT_APP_API_URL}/api/projects/${projectId}/assign`, { employeeIds }, { headers: { Authorization: `Bearer ${user.token}` } });
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

                {showModal && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                            <h3 className="text-lg font-bold mb-4">Create New Project</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Project Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border rounded-md shadow-sm p-2"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border rounded-md shadow-sm p-2"
                                        rows="3"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Client</label>
                                    <select
                                        name="client"
                                        value={formData.client}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border rounded-md shadow-sm p-2"
                                        required
                                    >
                                        <option value="">Select Client</option>
                                        {users.filter(u => u.role === 'client').map(client => (
                                            <option key={client._id} value={client._id}>
                                                {client.companyName || client.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Service</label>
                                    <input
                                        type="text"
                                        name="service"
                                        value={formData.service}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border rounded-md shadow-sm p-2"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                        <input
                                            type="date"
                                            name="startDate"
                                            value={formData.startDate}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full border rounded-md shadow-sm p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Deadline</label>
                                        <input
                                            type="date"
                                            name="deadline"
                                            value={formData.deadline}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full border rounded-md shadow-sm p-2"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        Create
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {showAssignModal && selectedProject && (
                    <AssignEmployeesModal
                        project={selectedProject}
                        users={users.filter(u => u.role === 'employee')}
                        onAssign={handleAssignEmployees}
                        onClose={() => setShowAssignModal(false)}
                    />
                )}
            </div>
        </AdminLayout>
    )
};

const AssignEmployeesModal = ({ project, users, onAssign, onClose }) => {

    const [selectedEmployees, setSelectedEmployees] = useState(project.assignedEmployees?.map(e => e._id) || []);

    const handleToggle = (employeeId) => {
        setSelectedEmployees(prev =>
            prev.includes(employeeId)
                ? prev.filter(id => id !== employeeId)
                : [...prev, employeeId]
        )
    };

    const handleSubmit = () => {
        onAssign(project._id, selectedEmployees);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <h3 className="text-lg font-bold mb-4">
                    Assign Employees to {project.name}
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {users.map((employee) => (
                        <label key={employee._id} className="flex items-center space-x-2 p-2 hover:bg-gray-50">
                            <input
                                type="checkbox"
                                checked={selectedEmployees.includes(employee._id)}
                                onChange={() => handleToggle(employee._id)}
                                className="rounded"
                            />
                            <span>{employee.name}</span>
                        </label>
                    ))}
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Assign
                    </button>
                </div>
            </div>
        </div>
    );
};
export default AdminProjects;