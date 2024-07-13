import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import logoImg from "../../images/logo.png";

const TopBars = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f3f4f6;
  padding: 12px;
  border-bottom: 1px solid #c8c5c5;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: sticky;
  z-index: 1000;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const LogoImage = styled.img`
  width: 40px;
`;

const LogoText = styled.div`
  font-size: 20px;
  font-weight: 800;
  color: #4aaa87;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  margin-left: 8px;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
`;

const TopBarButton = styled.button`
  padding: 8px 20px;
  background-color: #4aaa87;
  color: #ffffff;
  font-family: 'Freesentation', sans-serif;
  font-weight: 600;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

const UsernameText = styled.span`
  font-size: 16px;
  margin-right: 10px;
`;

const getCookie = (name) => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

const MainTopBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get('http://localhost:8000/login/auth_check/', { withCredentials: true });
        if (response.data.is_authenticated) {
          setIsLoggedIn(true);
          setUsername(response.data.username);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Failed to check auth status:", error);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogout = async () => {
    const csrftoken = getCookie('csrftoken');
    try {
      await axios.post(
        'http://localhost:8000/login/logout/',
        {},
        {
          headers: {
            'X-CSRFToken': csrftoken
          },
          withCredentials: true
        }
      );
      setIsLoggedIn(false);
      setUsername("");
      alert("로그아웃이 완료되었습니다.");
      navigate("/");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <TopBars>
      <LogoContainer onClick={handleLogoClick}>
        <LogoImage src={logoImg} alt="Logo" />
        <LogoText>꾼꾼농사꾼</LogoText>
      </LogoContainer>
      <RightSection>
        {isLoggedIn ? (
          <>
            <UsernameText>{username}님</UsernameText>
            <TopBarButton onClick={handleLogout}>로그아웃</TopBarButton>
          </>
        ) : (
          <TopBarButton onClick={() => navigate("/login")}>로그인</TopBarButton>
        )}
      </RightSection>
    </TopBars>
  );
};

export default MainTopBar;