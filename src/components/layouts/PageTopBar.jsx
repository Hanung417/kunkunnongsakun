import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import logoImg from "../../images/logo.png";
import { FaArrowLeft } from "react-icons/fa";

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

const LeftSection = styled.div`
  display: flex;
  align-items: center;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 1px; /* 뒤로가기 버튼과 로고 사이의 간격을 1px로 설정 */
`;

const LogoImage = styled.img`
  width: 40px;
`;

const Title = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 20px;
  font-weight: 800;
  color: #333;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
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

const PageTopBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const pageTitles = {
    "/signup": "회원가입",
    "/login": "로그인",
    "/password_reset": "비밀번호 찾기",
    "/board": "게시판",
    "/buyboard": "구매 게시판",
    "/sellboard": "판매 게시판",
    "/post/:id": "게시글 상세보기",
    "/post/create": "게시글 작성",
    "/chatlist": "대화 목록",
    "/chat/:sessionid": "대화",
    "/mypage": "마이페이지",
    "/post/edit/:id": "게시글 수정",
    "/my_commented_posts": "내가 댓글 단 글",
    "/expectedreturn": "수익 예측",
    "/soil": "토양 분석",
    "/diagnosis": "병해충 진단",
    "/info": "병해충 진단 결과",
    "/croptest": "수익 예측 - 작물 선택",
  };

  const pageTitle = pageTitles[location.pathname] || "";

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

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <TopBars>
      <LeftSection>
        <BackButton onClick={handleBackClick}>
          <FaArrowLeft />
        </BackButton>
        <LogoContainer>
          <LogoImage src={logoImg} alt="Logo" />
        </LogoContainer>
      </LeftSection>
      <Title>{pageTitle}</Title>
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

export default PageTopBar;