import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { checkAuthStatus, logoutUser } from "../../apis/user";
import { FaArrowLeft, FaUser, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import CustomModal from "../atoms/CustomModal";
import TopBarLoader from "../atoms/TopBarLoader";
import { useLoading } from "../../LoadingContext";

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
  position: relative;
`;

const IconButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  font-size: 20px;
  color: #4aaa87;
  cursor: pointer;
  margin-left: 4px;
`;

const PageTopBar = () => {
  const { setIsLoading, isLoading } = useLoading();
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
    "/post/create": "게시글 작성",
    "/post/:id": "게시글 상세보기",
    "/chatlist": "대화 목록",
    "/mypage": "마이페이지",
    "/post/edit/:id": "게시글 수정",
    "/my_commented_posts": "내가 댓글 단 글",
    "/my_posts": "내가 작성한 글",
    "/expectedreturn": "수익 예측",
    "/soil": "토양 분석",
    "/diagnosis": "병해충 진단",
    "/info": "병해충 진단 결과",
    "/croptest": "작물조합 등록",
    "/diagnosislist": "병해충 진단 목록",
    "/cropselection": "작물 조합 목록",
    "/soillist": "토양 데이터 목록",
    "/soil_details": "토양 데이터 상세",
    "/sessiondetails": "수익 예측 결과",
    "/signup": "회원가입",
    "/password_reset": "비밀번호 찾기",
  };

  const noBackButtonPages = [
    "/post/:id",
    "/post/create"
  ];

  const getPageTitle = () => {
    const pathname = location.pathname;
    const pathKeys = Object.keys(pageTitles);

    for (const pathKey of pathKeys) {
      const regex = new RegExp(`^${pathKey.replace(/:\w+/g, "\\w+")}$`);
      if (regex.test(pathname)) {
        return pageTitles[pathKey];
      }
    }

    const searchParams = new URLSearchParams(location.search);
    const postType = searchParams.get('post_type');
    if (pathname.startsWith('/post/create') && postType) {
      return "게시글 작성";
    }

    if (/^\/chat\/[\w-]+$/.test(pathname)) {
      return "농업GPT";
    }

    return "";
  };

  const pageTitle = getPageTitle();
  const showBackButton = !noBackButtonPages.some((page) => {
    const regex = new RegExp(`^${page.replace(/:\w+/g, "\\w+")}$`);
    return regex.test(location.pathname) && !location.pathname.startsWith("/post/create");
  });

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [setIsLoading]);

  const handleLogout = async () => {
    setIsLoading(true);
     try {
      await logoutUser();
      setIsLoggedIn(false);
      setUsername("");
      localStorage.setItem('isLoggedIn', 'false');
      localStorage.clear();
      setModalContent("로그아웃이 완료되었습니다.");
      setIsModalOpen(true);
    }  catch (error) {
      console.error("Failed to logout:", error);
    } finally {
      setIsLoading(false);
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
    <>
      <TopBars>
        <LeftSection>
          {showBackButton && (
            <BackButton onClick={handleBackClick}>
              <FaArrowLeft />
            </BackButton>
          )}
          <LogoContainer onClick={() => navigate("/main")}>
            <LogoImage src={`${process.env.PUBLIC_URL}/android-chrome-192x192.png`} alt="Logo" />
          </LogoContainer>
        </LeftSection>
        <Title>{pageTitle}</Title>
        <RightSection>
          {isLoggedIn ? (
            isLoading ? (
              <TopBarLoader color="#4aaa87" />
            ) : (
              <>
                <IconButton onClick={() => navigate("/mypage")}>
                  <FaUser title={`${username}님`} />
                </IconButton>
                <IconButton onClick={handleLogout}>
                  <FaSignOutAlt title="로그아웃" />
                </IconButton>
              </>
            )
          ) : (
            isLoading ? (
              <TopBarLoader color="#4aaa87" />
            ) : (
              <IconButton onClick={() => navigate("/login")}>
                <FaSignInAlt title="로그인" />
              </IconButton>
            )
          )}
        </RightSection>
        <CustomModal isOpen={isModalOpen} onRequestClose={closeModal} title="알림" content={modalContent} />
      </TopBars>
    </>
  );
};

export default PageTopBar;