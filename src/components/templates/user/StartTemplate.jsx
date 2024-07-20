import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { loginUser } from "../../../apis/user";
import CustomModal from "../../atoms/CustomModal";
import GlobalLoader from '../../../GlobalLoader';
import { useLoading } from '../../../LoadingContext';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background-color: #f9f9f9;
  height: 100vh;
  box-sizing: border-box;
  position: relative;
`;

const Title = styled.h1`
  font-size: 28px;
  margin-bottom: 32px;
  color: #333;
  text-align: center;
`;

const Button = styled.button`
  padding: 12px 16px;
  font-size: 16px;
  font-weight: bold;
  height: 44px; 
  width: 250px;
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

const Logo = styled.img`
  width: 100px;
  height: 100px;
  margin-bottom: 24px;
`;

const Footer = styled.footer`
  position: absolute;
  bottom: 16px;
  width: 100%;
  text-align: center;
  font-size: 14px;
  color: #666;
`;

const StartTemplate = () => {
  const { setIsLoading, isLoading } = useLoading();
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

  const handleTestLogin = async () => {
    const email = "hynm0333@naver.com";
    const password = "abcd1234!";

    setIsLoading(true);
    try {
      const response = await loginUser(email, password);
      const { status, user_id } = response.data;
      if (status === "success") {
        localStorage.setItem("userId", user_id);
        localStorage.setItem("isLoggedIn", "true");
        setModalTitle("로그인 성공");
        setModalContent("테스트 계정으로 로그인 완료.");
        setIsError(false);
      }
    } catch (error) {
      setModalTitle("로그인 실패");
      setModalContent("로그인 과정에서 오류가 발생했습니다.");
      setIsError(true);
    } finally {
      setIsModalOpen(true);
      setIsLoading(false);
    }
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
      <GlobalLoader isLoading={isLoading} />
      <Logo src={`${process.env.PUBLIC_URL}/android-chrome-192x192.png`} alt="Logo" />
      <Title>꾼꾼농사꾼에 오신 것을 환영합니다!</Title>
      <Button onClick={handleTestLogin}>테스트 계정으로 접속하기</Button>
      <Button onClick={handleLoginRedirect}>로그인하러가기</Button>
      <CustomModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        title={modalTitle}
        content={modalContent}
        showConfirmButton={false}
        isError={isError}
      />
      <Footer>© 2024 꾼꾼농사꾼. All rights reserved.</Footer>
    </Container>
  );
};

export default StartTemplate;