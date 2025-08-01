import React from 'react'
import { Navigate } from 'react-router-dom';
import AccessDenied from './AccessDenied';

const ProtectedRoute = ({ allowedRoles, children }) => {
    const token = localStorage.getItem('token');
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    console.log('loggedInUser: ', loggedInUser);
    const userRole = loggedInUser?.role;

    if (!token) return <Navigate to="/login" />;
    if (!allowedRoles.includes(userRole))
        return <div>
            <AccessDenied />
        </div>;

    return children;
};

export default ProtectedRoute;