// components/PageNotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
    return (
        <div className="text-center" style={{ padding: "4rem" }}>
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <Link to="/login" className="btn btn-primary"
                onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('role');

                }}
            >Go to Dashboard</Link>
        </div>
    );
};

export default PageNotFound;
