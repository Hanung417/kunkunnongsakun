import React, { useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "70%",
  },
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 80%;
  padding: 24px;
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

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://localhost:8000/login/delete_account/', { password }, { withCredentials: true })
      .then((response) => {
        setMessage("계정이 성공적으로 삭제되었습니다.");
        setError("");

        alert("회원 탈퇴 성공")
        // 회원 탈퇴하면 어디 페이지로 가지,,,,,
        window.location.reload();
        navigate('/');
      })
      .catch((error) => {
        if (error.response) {
          setError(error.response.data.errors || "계정 삭제 중 오류가 발생했습니다.");
          setMessage("");
        }
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Delete Account Modal"
    >
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
        <Button type="submit">계정 삭제</Button>
      </Form>
    </Modal>
  );
};

export default DeleteAccountModal;
