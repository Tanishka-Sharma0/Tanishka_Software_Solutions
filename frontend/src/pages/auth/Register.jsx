import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../../utils/constants';
const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'employee',
        companyName: '',
        phone: ''
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post(
                `${API_BASE_URL}/api/auth/register`,
                formData
            );

            toast.success('Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Create Account
                </h2>

                <form onSubmit={handleSubmit}>
                    <input
                        name="name"
                        placeholder="Full Name"
                        className="w-full p-2 mb-3 border rounded"
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        className="w-full p-2 mb-3 border rounded"
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        className="w-full p-2 mb-3 border rounded"
                        onChange={handleChange}
                        required
                    />

                    <select
                        name="role"
                        className="w-full p-2 mb-3 border rounded"
                        onChange={handleChange}
                    >
                        <option value="employee">Employee</option>
                        <option value="client">Client</option>
                    </select>

                    {formData.role === "client" && (
                        <input
                            name="companyName"
                            placeholder="Company Name"
                            className="w-full p-2 mb-3 border rounded"
                            onChange={handleChange}
                            required
                        />
                    )}

                    <input
                        name="phone"
                        placeholder="Phone"
                        className="w-full p-2 mb-4 border rounded"
                        onChange={handleChange}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        {loading ? 'Creating...' : 'Register'}
                    </button>
                </form>

                <p className="mt-4 text-sm text-center">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 font-semibold">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;