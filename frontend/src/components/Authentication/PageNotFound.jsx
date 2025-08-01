// components/PageNotFound.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const PageNotFound = () => {
    const navigate = useNavigate();
    return (
        <div className="text-center" style={{ padding: "4rem" }}>
            <h1 className='text-danger'>404 - Page Not Found!</h1>
            <p className='text-danger'>The page you are looking for does not exist.</p>
            <Link to="/login" className="btn btn-primary"
                onClick={() => {
                    navigate('/dashboard')
                }}
            >Go to Dashboard</Link>
        </div>
    );
};

export default PageNotFound;
