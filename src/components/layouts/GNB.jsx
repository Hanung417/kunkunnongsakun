import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBug,
  FaChartLine,
  FaUser,
  FaCommentDots,
} from "react-icons/fa";
import styled from "styled-components";

const Nav = styled.nav`
  position: fixed;
  bottom: 0;
  z-index: 50;
  width: 100%;
  background-color: #f3f4f6;
  border-top: 1px solid #e5e7eb;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 26px;
`;

const MenuLink = styled(Link)`
  flex: 1;
  text-align: center;
  text-decoration: none;
`;

const IconWrapper = styled.div`
  display: inline-block;
  color: ${({ isActive }) => (isActive ? "#4AAA87" : "#9ca3af")};
`;

const MenuText = styled.div`
  font-size: 12px;
  font-weight: bold;
  color: ${({ isActive }) => (isActive ? "#4AAA87" : "#6b7280")};
`;

const ChatIconWrapper = styled.div`
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${({ isActive }) => (isActive ? "#4AAA87" : "#4AAA87")};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -40px;
  z-index: 1;
  cursor: pointer;
`;

const ChatIcon = styled(FaCommentDots)`
  color: #fff;
  font-size: 24px;
`;

export const GNB = () => {
  const [currentPage, setCurrentPage] = useState("/");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentPage(location.pathname);
  }, [location]);

  const handleChatIconClick = () => {
    navigate("/chatlist");
  };

  return (
    <Nav>
      <Wrapper>
        <MenuLink to="/" className={currentPage === "/" ? "active" : ""}>
          <IconWrapper isActive={currentPage === "/"}>
            <FaHome size={24} />
          </IconWrapper>
          <MenuText isActive={currentPage === "/"}>홈</MenuText>
        </MenuLink>
        <MenuLink to="/diagnosis" className={currentPage === "/diagnosis" ? "active" : ""}>
          <IconWrapper isActive={currentPage === "/diagnosis"}>
            <FaBug size={24} />
          </IconWrapper>
          <MenuText isActive={currentPage === "/diagnosis"}>병해충 진단</MenuText>
        </MenuLink>
        <ChatIconWrapper
          isActive={currentPage === "/chatlist"}
          onClick={handleChatIconClick}
        >
          <ChatIcon />
        </ChatIconWrapper>
        <MenuLink
          to="/expectedreturn"
          className={currentPage === "/expectedreturn" ? "active" : ""}
        >
          <IconWrapper isActive={currentPage === "/expectedreturn"}>
            <FaChartLine size={24} />
          </IconWrapper>
          <MenuText isActive={currentPage === "/expectedreturn"}>수익 예측</MenuText>
        </MenuLink>
        <MenuLink
          to="/mypage"
          className={currentPage === "/mypage" ? "active" : ""}
        >
          <IconWrapper isActive={currentPage === "/mypage"}>
            <FaUser size={24} />
          </IconWrapper>
          <MenuText isActive={currentPage === "/mypage"}>MY</MenuText>
        </MenuLink>
      </Wrapper>
    </Nav>
  );
};