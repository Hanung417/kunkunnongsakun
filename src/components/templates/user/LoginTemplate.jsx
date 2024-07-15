import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import { loginUser } from "../../../apis/user";
import CustomModal from "../../atoms/CustomModal";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  background-color: #f9f9f9;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 32px;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  background-color: white;
  padding: 24px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
`;

const Label = styled.label`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
`;

const Input = styled.input`
  font-size: 14px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  &:focus {
    outline: none;
    border-color: #2faa9a;
  }
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
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 12px;
  margin-top: 4px;
`;

const LinksContainer = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: left;
  width: 100%;
  max-width: 600px;
`;

const StyledLink = styled(RouterLink)`
  font-size: 16px;
  font-weight: 500;
  margin-right: 16px;
  color: #4aaa87;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const LoginTemplate = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const { email, password } = formData;
    setIsButtonDisabled(!email || !password || emailError !== "" || passwordError !== "");
  }, [formData, emailError, passwordError]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "email") {
      if (!validateEmail(value)) {
        setEmailError("올바른 이메일 형식을 입력하세요.");
      } else {
        setEmailError("");
      }
    }

    if (name === "password" && value.length < 6) {
      setPasswordError("비밀번호는 6자 이상이어야 합니다.");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = formData;

    loginUser(email, password)
      .then((response) => {
        const { status, message, user_id } = response.data;
        if (status === "success") {
          localStorage.setItem("userId", user_id);
          localStorage.setItem("isLoggedIn", "true");
          setModalContent("로그인이 완료되었습니다.");
          setModalTitle("성공");
          setIsModalOpen(true);
          setTimeout(() => {
            setIsModalOpen(false);
            navigate('/');
          }, 2000);
        } else {
          setLoginError(message);
          setModalContent(message);
          setModalTitle("오류");
          setIsModalOpen(true);
        }
      })
      .catch((error) => {
        if (error.response) {
          const { data } = error.response;
          setLoginError(data.message || "로그인 과정에서 오류가 발생했습니다.");
          setModalContent(data.message || "로그인 과정에서 오류가 발생했습니다.");
        } else {
          setLoginError("로그인 과정에서 오류가 발생했습니다.");
          setModalContent("로그인 과정에서 오류가 발생했습니다.");
        }
        setModalTitle("오류");
        setIsModalOpen(true);
      });
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Container>
      <Title>로그인</Title>
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="email">이메일</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="이메일 입력"
            required
          />
          {emailError && <ErrorMessage>{emailError}</ErrorMessage>}
        </InputGroup>
        <InputGroup>
          <Label htmlFor="password">비밀번호</Label>
          <Input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="비밀번호 입력"
            required
          />
          {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
        </InputGroup>
        <Button type="submit" disabled={isButtonDisabled}>로그인</Button>
        <LinksContainer>
          <StyledLink to="/signup">회원가입</StyledLink>
          <StyledLink to="/password_reset">비밀번호 찾기</StyledLink>
        </LinksContainer>
      </Form>
      <CustomModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        title={modalTitle}
        content={modalContent}
      />
    </Container>
  );
};

export default LoginTemplate;