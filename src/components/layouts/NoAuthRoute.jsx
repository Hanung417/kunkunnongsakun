import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const NoAuthRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      setIsAuthenticated(loggedIn);
    };

    checkAuth();
  }, []);

  if (isAuthenticated) {
    return <Navigate to="/main" />;
  }

  return <Outlet />;
};

export default NoAuthRoute;