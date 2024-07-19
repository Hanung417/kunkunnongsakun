import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { loginUser } from "../../../apis/user";
import CustomModal from "../../atoms/CustomModal";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background-color: #f9f9f9;
  height: 100vh;
  box-sizing: border-box;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 32px;
  color: #333;
`;

const Button = styled.button`
  padding: 12px 16px;
  font-size: 16px;
  font-weight: bold;
  height: 44px; 
  color: white;
  background-color: ${({ disabled }) => (disabled ? '#9e9e9e' : '#4aaa87')};
  border: none;
  border-radius: 4px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  &:hover {
    background-color: ${({ disabled }) => (disabled ? '#9e9e9e' : '#6dc4b0')};
  }
  &:not(:last-child) {
    margin-bottom: 16px;
  }
`;

const StartTemplate = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") {
      navigate('/main'); // 이미 로그인된 상태라면 메인 페이지로 리다이렉트
    }
  }, [navigate]);

  const handleTestLogin = () => {
    const email = "hynm0333@naver.com";
    const password = "abcd1234!";

    loginUser(email, password)
      .then((response) => {
        const { status, user_id } = response.data;
        if (status === "success") {
          localStorage.setItem("userId", user_id);
          localStorage.setItem("isLoggedIn", "true");
          setModalTitle("로그인 성공");
          setModalContent("테스트 계정으로 로그인 완료.");
          setIsModalOpen(true);
          setIsError(false);
        }
      })
      .catch((error) => {
        setModalTitle("로그인 실패");
        setModalContent("로그인 과정에서 오류가 발생했습니다.");
        setIsError(true);
        setIsModalOpen(true);
      });
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };
  
  const handleMain = () => {
    navigate('/main');
  }

  const closeModal = () => {
    setIsModalOpen(false);
    if (!isError) {
      navigate("/main");
    }
  };

  return (
    <Container>
      <Title>시작 페이지</Title>
      <Button onClick={handleTestLogin}>로그인 없이 테스트 계정으로 이용</Button>
      <Button onClick={handleLoginRedirect}>로그인</Button>
      <Button onClick={handleMain}>로그인 X 메인 접속</Button>
      <CustomModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        title={modalTitle}
        content={modalContent}
        showConfirmButton={false}
        isError={isError}
      />
    </Container>
  );
};

export default StartTemplate;