import React from "react";
import { Outlet } from "react-router-dom";
import { GNB } from "./GNB";
import TopBar from "./TopBar";
import styled from "styled-components";

const Container = styled.div`
  padding-bottom: 40px;
  margin-bottom: 20px;
`;

export const MainLayout = ({ isLoggedIn, onLogout }) => {
  return (
    <Container>
      <TopBar isLoggedIn={isLoggedIn} onLogout={onLogout} />
      <Outlet />
      <GNB />
    </Container>
  );
};
