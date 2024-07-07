import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AuthCheck = () => {
  const [authStatus, setAuthStatus] = useState({
    isAuthenticated: false,
    username: '',
  });

  useEffect(() => {
    axios.get('http://localhost:8000/login/auth_check/', { withCredentials: true })
      .then((response) => {
        setAuthStatus({
          isAuthenticated: response.data.is_authenticated,
          username: response.data.username,
        });
      })
      .catch((error) => {
        console.error('Error fetching auth status:', error);
        setAuthStatus({
          isAuthenticated: false,
          username: '',
        });
      });
  }, []);

  return (
    <div>
      {authStatus.isAuthenticated ? (
        <div>Welcome, {authStatus.username}!</div>
      ) : (
        <div>Please log in.</div>
      )}
    </div>
  );
};

export default AuthCheck;
