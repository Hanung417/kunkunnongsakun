import React, { useState } from "react";
import Modal from "react-modal";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { deleteAccount, getCSRFToken } from "../../../apis/user";
import { FaTimes } from "react-icons/fa";
import { useLoading } from '../../../LoadingContext';

const customStyles = {
  content: {
    top: "45%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    maxWidth: "32rem",
    boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.3), 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1)",
    padding: "2rem",
  },
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center; 
  width: 100%;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem; 
  right: 1rem; 
  background: none;
  border: none;
  font-size: 1.5rem; 
  cursor: pointer;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem; 
  width: 100%;
`;

const Label = styled.label`
  font-size: 0.875rem; 
  color: #666;
  margin-bottom: 0.5rem; 
`;

const Input = styled.input`
  font-size: 0.875rem; 
  padding: 0.75rem; 
  border: 1px solid #ddd;
  border-radius: 0.25rem; 
  width: 100%;
  &:focus {
    outline: none;
    border-color: #2faa9a;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1rem; 
  font-size: 1rem; 
  font-weight: bold;
  color: white;
  background-color: #2faa9a;
  border: none;
  border-radius: 0.25rem; 
  cursor: pointer;
  width: 100%;
  max-width: 20rem; 
  &:hover {
    background-color: #6dc4b0;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 0.75rem; 
  margin-top: 0.25rem; /* 4px in rem */
`;

const WarningMessage = styled.div`
  color: #d9534f;
  font-size: 0.875rem; 
  margin-bottom: 1rem;
  text-align: center;
`;

const DeleteAccountModal = ({ isOpen, onRequestClose }) => {
  const { setIsLoading, isLoading } = useLoading();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const csrfToken = getCSRFToken();

    setIsLoading(true);
    try {
      await deleteAccount(password, {
        headers: { "X-CSRFToken": csrfToken },
        withCredentials: true
      });
      setMessage("계정이 성공적으로 삭제되었습니다.");
      setError("");
      setTimeout(() => {
        navigate('/');
        window.location.reload();
      }, 1000);
    } catch (error) {
      setError(error.response?.data?.message || "계정 삭제 중 오류가 발생했습니다.");
      setMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Delete Account Modal"
    >
      <CloseButton onClick={onRequestClose}><FaTimes /></CloseButton>
      <Form onSubmit={handleSubmit}>
        <h2>회원 탈퇴</h2>
        <WarningMessage>
          계정을 삭제하면 되돌릴 수 없습니다. 정말 삭제하시겠습니까?
        </WarningMessage>
        <InputGroup>
          <Label htmlFor="password">비밀번호 확인</Label>
          <Input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleChange}
            placeholder="비밀번호 입력"
            required
          />
        </InputGroup>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {message && <div>{message}</div>}
        <Button type="submit">탈퇴하기</Button>
      </Form>
    </Modal>
  );
};

export default DeleteAccountModal;