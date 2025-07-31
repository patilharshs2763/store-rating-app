import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loggedInUser, setLoggedInUser] = useState(null);

    useEffect(() => {
        const user = localStorage.getItem('loggedInUser');
        if (user) setLoggedInUser(JSON.parse(user));
    }, []);

    const login = (user) => {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        setLoggedInUser(user);
    };

    const logout = () => {
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('token');
        setLoggedInUser(null);
    };

    return (
        <AuthContext.Provider value={{ loggedInUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
