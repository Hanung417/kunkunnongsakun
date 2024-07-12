import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  height: 44px; /* Adjust height to match input field */
  color: white;
  background-color: #2faa9a;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #6dc4b0;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 12px;
  margin-top: 4px;
`;

const PasswordResetTemplate = () => {
  const [email, setEmail] = useState("");
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleTempPasswordChange = (e) => {
    setTemporaryPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const csrfToken = getCSRFToken();

    axios.post('http://localhost:8000/login/password_reset/', { email }, {
      headers: {
        'X-CSRFToken': csrfToken,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    })
    .then((response) => {
      setMessage("임시 비밀번호가 이메일로 전송되었습니다.");
      setError("");
    })
    .catch((error) => {
      if (error.response) {
        setError(error.response.data.message || "비밀번호 재설정 중 오류가 발생했습니다.");
        setMessage("");
      }
    });
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    const csrfToken = getCSRFToken();

    axios.post('http://localhost:8000/login/password_reset_done/', { email, temporary_password: temporaryPassword, new_password: newPassword }, {
      headers: {
        'X-CSRFToken': csrfToken,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    })
    .then((response) => {
      setMessage("새로운 비밀번호로 변경되었습니다.");
      setError("");
    })
    .catch((error) => {
      if (error.response) {
        setError(error.response.data.message || "비밀번호 변경 중 오류가 발생했습니다.");
        setMessage("");
      }
    });
  };

  const getCSRFToken = () => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, 10) === 'csrftoken=') {
          cookieValue = decodeURIComponent(cookie.substring(10));
          break;
        }
      }
    }
    return cookieValue;
  };

  return (
    <Container>
      <Title>비밀번호 재설정</Title>

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
        </InputGroup>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {message && <div>{message}</div>}
        <Button type="submit">임시 비밀번호 보내기</Button>
      </Form>

      <Form onSubmit={handlePasswordReset}>
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
        </InputGroup>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {message && <div>{message}</div>}
        <Button type="submit">비밀번호 변경하기</Button>
      </Form>

    </Container>
  );
};

export default PasswordResetTemplate;