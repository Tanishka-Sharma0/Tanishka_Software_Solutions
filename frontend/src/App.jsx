import React from 'react'
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import PrivateRoute from './components/Common/PrivateRoute';
import Navbar from './components/Common/Navbar';
import './App.css'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminServices from './pages/admin/Services';
import AdminProjects from './pages/admin/Projects';
import AdminRequests from './pages/admin/ServiceRequests';
import AdminMessages from './pages/admin/Messages';

// Employee Pages
import EmployeeDashboard from './pages/employee/Dashboard';
import EmployeeProjects from './pages/employee/Project';
import EmployeeMessages from './pages/employee/Message';

// Client Pages
import ClientDashboard from './pages/client/Dashboard';
import ClientProjects from './pages/client/Project';
import ClientRequests from './pages/client/ServiceRequests';
import ClientMessages from './pages/client/Messages';

//auth routes 
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Common
import Profile from './pages/Profile';



function App() {

  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/projects" element={<PrivateRoute role="admin"><AdminProjects /></PrivateRoute>} />
          <Route path="/admin/users" element={<PrivateRoute role="admin"><AdminUsers /></PrivateRoute>} />
          <Route path="/admin/services" element={<PrivateRoute role="admin"><AdminServices /></PrivateRoute>} />
          <Route path="/admin/requests" element={<PrivateRoute role="admin"><AdminRequests /></PrivateRoute>} />
          <Route path="/admin/messages" element={<PrivateRoute role="admin"><AdminMessages /></PrivateRoute>} />

          {/* Employee Routes */}
          <Route path="/employee" element={<PrivateRoute role="employee"><EmployeeDashboard /></PrivateRoute>} />
          <Route path="/employee/projects" element={<PrivateRoute role="employee"><EmployeeProjects /></PrivateRoute>} />
          <Route path="/employee/messages" element={<PrivateRoute role="employee"><EmployeeMessages /></PrivateRoute>} />

          {/* Client Routes */}
          <Route path="/client" element={<PrivateRoute role="client"><ClientDashboard /></PrivateRoute>} />
          <Route path="/client/projects" element={<PrivateRoute role="client"><ClientProjects /></PrivateRoute>} />
          <Route path="/client/requests" element={<PrivateRoute role="client"><ClientRequests /></PrivateRoute>} />
          <Route path="/client/messages" element={<PrivateRoute role="client"><ClientMessages /></PrivateRoute>} />

          {/* Common */}
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
