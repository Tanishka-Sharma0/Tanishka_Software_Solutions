# Tanishka_Software_Solutions

A comprehensive role-based software company management portal built with MERN stack. The application enables seamless collaboration between Admin, Employees, and Clients for project management, service requests, and communication.

## Live Demo

- Frontend: https://rahul-software-solutions.vercel.app
- Backend API:   https://tanishka-software-solutions-backend.onrender.com

---

## Features

### Authentication
- Email/Password based login
- Role-based access control (Admin, Employee, Client)
- JWT token authentication
- Protected routes for each role

### Admin Portal
- Create/Remove employees and clients
- Create and manage services
- Approve/reject client service requests
- Create and manage projects
- Assign employees to projects
- View dashboard with statistics and charts
- Message employees and clients
- Edit profile

### Employee Portal
- View assigned projects
- Update project status (Pending/In-Progress/Completed/On-Hold)
- Message admin
- Message clients (only those whose projects are assigned)
- Edit profile

### Client Portal
- View own projects
- Request new services
- Message admin
- Message assigned employees
- Edit profile with company details

### Messaging System
- Admin ↔ Employee communication
- Admin ↔ Client communication
- Client ↔ Employee communication
- Conversation history
- Real-time message updates

### Service Request Flow
Admin : email: admin@rahulsoftware.com
password: Admin@123

employee : email : test.employee@example.com
password: Test@123

client : email : test.client@example.com
password: Test@123

still anyone can register by role
