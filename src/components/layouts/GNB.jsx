import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaMapMarkedAlt,
  FaChartBar,
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
        <MenuLink to="/map" className={currentPage === "/map" ? "active" : ""}>
          <IconWrapper isActive={currentPage === "/map"}>
            <FaMapMarkedAlt size={24} />
          </IconWrapper>
          <MenuText isActive={currentPage === "/map"}>토양</MenuText>
        </MenuLink>
        <ChatIconWrapper
          isActive={currentPage === "/chatlist"}
          onClick={handleChatIconClick}
        >
          <ChatIcon />
        </ChatIconWrapper>
        <MenuLink
          to="/board"
          className={currentPage === "/board" ? "active" : ""}
        >
          <IconWrapper isActive={currentPage === "/board"}>
            <FaChartBar size={24} />
          </IconWrapper>
          <MenuText isActive={currentPage === "/board"}>게시판</MenuText>
        </MenuLink>
        <MenuLink
          to="/profile"
          className={currentPage === "/profile" ? "active" : ""}
        >
          <IconWrapper isActive={currentPage === "/profile"}>
            <FaUser size={24} />
          </IconWrapper>
          <MenuText isActive={currentPage === "/profile"}>프로필</MenuText>
        </MenuLink>
      </Wrapper>
    </Nav>
  );
};
