import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { checkAuthStatus, logoutUser } from "../../apis/user";
import logoImg from "../../images/logo.png";
import { FaArrowLeft, FaUser, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import CustomModal from "../atoms/CustomModal";

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
  margin-left: 1px; 
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

const IconButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  color: #4aaa87;
  cursor: pointer;
  margin-left: 16px;
`;

const PageTopBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const pageTitles = {
    "/board": "게시판",
    "/buyboard": "구매 게시판",
    "/sellboard": "판매 게시판",
    "/exchangeboard": "품앗이 게시판",
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
    "/croptest": "수익 예측",
    "/diagnosislist": "병해충 진단 목록",
    "/cropselection": "나의 작물 조합",
    "/soillist": "토양 데이터 목록",
    "/soil_details": "토양 데이터 상세",
  };

  const pageTitle = pageTitles[location.pathname] || "";

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await checkAuthStatus();
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

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setIsLoggedIn(false);
      setUsername("");
      setModalContent("로그아웃이 완료되었습니다.");
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate("/");
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
        <LogoContainer onClick={() => navigate("/main")}>
          <LogoImage src={logoImg} alt="Logo" />
        </LogoContainer>
      </LeftSection>
      <Title>{pageTitle}</Title>
      <RightSection>
        {isLoggedIn ? (
          <>
            <IconButton onClick={() => navigate("/mypage")}>
              <FaUser title={`${username}님`} />
            </IconButton>
            <IconButton onClick={handleLogout}>
              <FaSignOutAlt title="로그아웃" />
            </IconButton>
          </>
        ) : (
          <IconButton onClick={() => navigate("/login")}>
            <FaSignInAlt title="로그인" />
          </IconButton>
        )}
      </RightSection>
      <CustomModal isOpen={isModalOpen} onRequestClose={closeModal} title="알림" content={modalContent} />
    </TopBars>
  );
};

export default PageTopBar;