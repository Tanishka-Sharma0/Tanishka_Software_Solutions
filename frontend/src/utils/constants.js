export const ROLES = {
    ADMIN: 'admin',
    EMPLOYEE: 'employee',
    CLIENT: 'client'
};

export const PROJECT_STATUS = {
    PENDING: 'pending',
    IN_PROGRESS: 'in-progress',
    COMPLETED: 'completed',
    ON_HOLD: 'on-hold'
};

export const REQUEST_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected'
};

export const STATUS_COLORS = {
    [PROJECT_STATUS.PENDING]: 'bg-gray-100 text-gray-800',
    [PROJECT_STATUS.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800',
    [PROJECT_STATUS.COMPLETED]: 'bg-green-100 text-green-800',
    [PROJECT_STATUS.ON_HOLD]: 'bg-red-100 text-red-800',
    [REQUEST_STATUS.APPROVED]: 'bg-green-100 text-green-800',
    [REQUEST_STATUS.REJECTED]: 'bg-red-100 text-red-800'
};

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';