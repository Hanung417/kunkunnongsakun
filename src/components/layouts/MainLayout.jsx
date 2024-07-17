import React from "react";
import { Outlet } from "react-router-dom";
import { GNB } from "./GNB";
import MainTopBar from "./MainTopBar";
import PageTopBar from "./PageTopBar";
import styled from "styled-components";
import { useLocation } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: white;
`;

const Footer = styled.div`
  position: sticky;
  padding-top: 60px;
  z-index: 1000;
  background-color: white;
`;

export const MainLayout = ({ isLoggedIn, onLogout }) => {
  const location = useLocation();
  const isMainPage = location.pathname === "/";

  return (
    <Container>
      <Header>{isMainPage ? <MainTopBar /> : <PageTopBar />}</Header>
        <Outlet />
      <Footer>
        <GNB />
      </Footer>
    </Container>
  );
};