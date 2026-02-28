import React, { useState } from 'react';

const AssignModal = ({ isOpen, onClose, onAssign, project, employees }) => {
    const [selectedEmployees, setSelectedEmployees] = useState([]);

    if (!isOpen) return null;

    const handleToggle = (employeeId) => {
        setSelectedEmployees(prev =>
            prev.includes(employeeId)
                ? prev.filter(id => id !== employeeId)
                : [...prev, employeeId]
        );
    };

    const handleSubmit = () => {
        onAssign(project._id, selectedEmployees);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 max-w-md">
                <h3 className="text-lg font-bold mb-4">
                    Assign Employees to {project?.name}
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
                    {employees.map((employee) => (
                        <label key={employee._id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                            <input
                                type="checkbox"
                                checked={selectedEmployees.includes(employee._id)}
                                onChange={() => handleToggle(employee._id)}
                                className="rounded text-blue-600"
                            />
                            <div>
                                <span className="font-medium">{employee.name}</span>
                                <span className="text-sm text-gray-500 ml-2">{employee.email}</span>
                            </div>
                        </label>
                    ))}
                </div>
                <div className="flex justify-end space-x-2">
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

export default AssignModal;