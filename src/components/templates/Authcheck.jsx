import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AuthCheck = () => {
    const [authStatus, setAuthStatus] = useState({ isAuthenticated: false, user: null });

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('http://localhost:8000/login/api/auth/check/');
                setAuthStatus({
                    isAuthenticated: response.data.is_authenticated,
                    user: { id: response.data.user_id, username: response.data.username }
                });
            } catch (error) {
                console.error("Authentication check failed", error);
            }
        };
        checkAuth();
    }, []);

    if (!authStatus.isAuthenticated) {
        return <div>Please log in</div>;
    }

    return <div>Welcome, {authStatus.user.username}</div>;
};

export default AuthCheck;