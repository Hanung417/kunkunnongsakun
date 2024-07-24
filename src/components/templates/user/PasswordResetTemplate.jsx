import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { sendTemporaryPassword, resetPassword } from '../../../apis/user';
import CustomModal from "../../atoms/CustomModal";
import GlobalLoader from '../../atoms/GlobalLoader';
import { useLoading } from '../../../LoadingContext';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  margin-top: 20px;
  height: 100%;
  width: 100%;
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
  margin-bottom: 20px;
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
  margin-bottom: 24px;
  font-size: 14px;
  font-weight: 600;
  height: 44px; 
  color: white;
  background-color: #4aaa87;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #6dc4b0;
  }
  &:disabled {
    background-color: #9e9e9e;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 12px;
  margin-top: 4px;
`;

const SuccessMessage = styled.div`
  color: green;
  font-size: 14px;
  margin-top: 4px;
  margin-bottom: 12px;
`;

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()])[a-zA-Z\d!@#$%^&*()]{8,}$/;
  return passwordRegex.test(password);
};


const PasswordResetTemplate = () => {
  const { setIsLoading, isLoading } = useLoading();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isTempPasswordSent, setIsTempPasswordSent] = useState(false);
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    if (email) {
      setIsTempPasswordSent(false);
    }
  }, [email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
      if (!validateEmail(value)) {
        setEmailError("올바른 이메일 형식을 입력하세요.");
      } else {
        setEmailError("");
      }
    }
  };

  const handleTempPasswordChange = (e) => {
    setTemporaryPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
    if (!validatePassword(e.target.value)) {
      setNewPasswordError("비밀번호는 8자 이상이며, 영소문자, 숫자, 특수문자를 하나 이상 포함해야 합니다.");
    } else {
      setNewPasswordError("");
    }
  };

  const handleSendTempPassword = async () => {
    setIsLoading(true);
    try {
      await sendTemporaryPassword(email);
      setMessage("임시 비밀번호가 이메일로 전송되었습니다.");
      setError("");
      setIsTempPasswordSent(true);
    } catch (error) {
      setError(error.response?.data?.message || "임시 비밀번호 전송 중 오류가 발생했습니다.");
      setMessage("");
      setIsErrorModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPasswordError) {
      setError(newPasswordError);
      setIsErrorModalOpen(true);
      return;
    }
    setIsLoading(true);
    try {
      const resetPasswordResponse = await resetPassword({ email, temporary_password: temporaryPassword, new_password: newPassword });
      if (resetPasswordResponse.data.status === 'success') {
        setMessage("새로운 비밀번호로 변경되었습니다.");
        setIsSuccessModalOpen(true);
        setError("");
      } else {
        setError(resetPasswordResponse.data.error || "비밀번호 변경 중 오류가 발생했습니다.");
        setMessage("");
        setIsErrorModalOpen(true);
      }
    } catch (error) {
      setError(error.response.data.error);
      setMessage("");
      setIsErrorModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
    navigate("/login");
  };

  const closeModal = () => {
    setIsErrorModalOpen(false);
  };

  const isTempPasswordButtonDisabled = !email || emailError !== "";
  const isSubmitButtonDisabled = !email || !temporaryPassword || !newPassword || emailError !== "" || newPasswordError !== "";

  return (
    <Container>
      <GlobalLoader isLoading={isLoading} />
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="email">이메일</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="이메일 입력"
            required
          />
          {emailError && <ErrorMessage>{emailError}</ErrorMessage>}
        </InputGroup>
        <Button
          type="button"
          onClick={handleSendTempPassword}
          disabled={isTempPasswordButtonDisabled}
        >
          임시 비밀번호 전송
        </Button>
        {isTempPasswordSent && <SuccessMessage>임시 비밀번호가 이메일로 전송되었습니다.</SuccessMessage>}
        <InputGroup>
          <Label htmlFor="temporary_password">임시 비밀번호</Label>
          <Input
            type="password"
            id="temporary_password"
            name="temporary_password"
            value={temporaryPassword}
            onChange={handleTempPasswordChange}
            placeholder="임시 비밀번호 입력"
            required
          />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="new_password">새로운 비밀번호</Label>
          <Input
            type="password"
            id="new_password"
            name="new_password"
            value={newPassword}
            onChange={handleNewPasswordChange}
            placeholder="새로운 비밀번호 입력"
            required
          />
          {newPasswordError && <ErrorMessage>{newPasswordError}</ErrorMessage>}
        </InputGroup>
        <Button type="submit" disabled={isSubmitButtonDisabled}>비밀번호 변경하기</Button>
      </Form>

      <CustomModal
        isOpen={isSuccessModalOpen}
        onRequestClose={closeSuccessModal}
        title="알림"
        content={message}
      />

      <CustomModal
        isOpen={isErrorModalOpen}
        onRequestClose={closeModal}
        title="오류"
        content={error}
        isError={true}
      />
    </Container>
  );
};

export default PasswordResetTemplate;