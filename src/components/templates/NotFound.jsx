import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 24px;
  padding-top: 80px;  /* 위쪽 여백 추가 */
  background-color: #f9f9f9;
  box-sizing: border-box;
`;

const Title = styled.h1`
  font-size: 48px;
  color: #333;
`;

const Message = styled.p`
  font-size: 18px;
  color: #666;
  margin-bottom: 32px;
`;

const HomeLink = styled(Link)`
  font-size: 16px;
  font-weight: bold;
  color: #2faa9a;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const NotFound = () => (
  <Container>
    <Title>404</Title>
    <Message>페이지를 찾을 수 없습니다.</Message>
    <HomeLink to="/">홈으로 돌아가기</HomeLink>
  </Container>
);

export default NotFound;