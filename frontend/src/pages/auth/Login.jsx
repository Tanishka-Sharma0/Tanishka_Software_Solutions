import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {

            const user = await login(email, password);
            console.log("API URL:", import.meta.env.VITE_API_URL);
            navigate(`/${user.role}`);
            toast.success('Login successful');

        } catch (err) {
            toast.error(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Tanishka Software Solutions</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="mt-6 p-4 bg-gray-50 rounded">
                    <p className="mt-4 text-sm text-center">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-600 font-semibold">
                            Register
                        </Link>
                    </p>
                    <p className="text-sm font-semibold mb-2">Test Credentials:</p>
                    <p className="text-xs">Admin: admin@rahulsoftware.com / Admin@123</p>
                    <p className="text-xs">Employee: employee@test.com / Employee@123</p>
                    <p className="text-xs">Client: client@test.com / Client@123</p>
                </div>
            </div>
        </div>
    )
}

export default Login;