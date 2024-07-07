import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaStore, FaShoppingCart, FaHandsHelping } from "react-icons/fa";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background-color: #f9f9f9;
  height: 100%;
`;

const BoardLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 12px;
  margin: 12px;
  width: 96%;
  text-decoration: none;
  color: #333;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  font-weight: 600;

  & > svg {
    margin-right: 12px;
    color: #4aaa87;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 32px;
  color: #333;
`;

const BoardTemplate = () => {
  return (
    <Container>
      <Title>게시판 목록</Title>
      <BoardLink to="/sellboard">
        <FaStore size={24} />
        판매 게시판
      </BoardLink>
      <BoardLink to="/buyboard">
        <FaShoppingCart size={24} />
        구매 게시판
      </BoardLink>
      <BoardLink>
        <FaHandsHelping size={24} />
        품앗이 게시판
      </BoardLink>
    </Container>
  );
};

export default BoardTemplate;
