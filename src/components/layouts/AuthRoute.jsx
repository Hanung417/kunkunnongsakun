import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import CustomModal from "../atoms/CustomModal";

const AuthRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      setIsAuthenticated(loggedIn);
      if (!loggedIn) {
        setIsLoginModalOpen(true);
      }
    };

    checkAuth();
  }, []);

  const closeModal = () => {
    setIsLoginModalOpen(false);
  };

  if (isAuthenticated) {
    return <Outlet />;
  }

  return (
    <>
      <CustomModal
        isOpen={isLoginModalOpen}
        onRequestClose={closeModal}
        title="알림"
        content="로그인이 필요합니다. 로그인 페이지로 이동합니다."
      />
      {!isLoginModalOpen && <Navigate to="/login" />}
    </>
  );
};

export default AuthRoute;
