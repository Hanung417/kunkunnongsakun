import React from "react";
import { Outlet } from "react-router-dom";
import { GNB } from "./GNB";
import MainTopBar from "./MainTopBar";
import PageTopBar from "./PageTopBar";
import styled from "styled-components";
import { useLocation } from "react-router-dom";

const Container = styled.div`
  padding-bottom: 40px;
  margin-bottom: 20px;
`;

export const MainLayout = ({ isLoggedIn, onLogout }) => {
  const location = useLocation();
  const isMainPage = location.pathname === "/";

  return (
    <Container>
      {isMainPage ? <MainTopBar /> : <PageTopBar />}
      <Outlet />
      <GNB />
    </Container>
  );
};