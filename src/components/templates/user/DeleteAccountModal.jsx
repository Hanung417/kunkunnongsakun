import React, { useState } from "react";
import Modal from "react-modal";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { deleteAccount, getCSRFToken } from "../../../apis/user"; // import from user.js
import { FaTimes } from "react-icons/fa";

const customStyles = {
  content: {
    top: "45%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "70%",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1)",
  },
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 80%;
  padding: 24px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
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
  color: white;
  background-color: #2faa9a;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 16px;
  &:hover {
    background-color: #6dc4b0;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 12px;
  margin-top: 4px;
`;

const WarningMessage = styled.div`
  color: #d9534f;
  font-size: 14px;
  margin-bottom: 16px;
`;

const DeleteAccountModal = ({ isOpen, onRequestClose }) => {
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
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || "계정 삭제 중 오류가 발생했습니다.");
      setMessage("");
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