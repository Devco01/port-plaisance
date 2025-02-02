import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import config from '../../config/config';

const PrivateRoute = ({ children }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        // Vérifier la validité du token
        const verifyToken = async () => {
            try {
                const response = await fetch(`${config.apiUrl}/api/users/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    localStorage.removeItem('token');
                    navigate('/');
                }
            } catch (error) {
                localStorage.removeItem('token');
                navigate('/');
            }
        };

        if (token) {
            verifyToken();
        }
    }, [token, navigate]);

    if (!token) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PrivateRoute; 