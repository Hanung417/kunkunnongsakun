// ChangePasswordModal.js
import React, { useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import styled from "styled-components";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
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
  color: white;
  background-color: #4aaa87;
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

const ChangePasswordModal = ({ isOpen, onRequestClose }) => {
  const [formData, setFormData] = useState({
    old_password: "",
    new_password1: "",
    new_password2: ""
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://localhost:8000/login/change_password/', formData, { withCredentials: true })
      .then((response) => {
        setMessage("비밀번호가 성공적으로 변경되었습니다.");
        setError("");
      })
      .catch((error) => {
        if (error.response) {
          setError(error.response.data.errors || "비밀번호 변경 중 오류가 발생했습니다.");
          setMessage("");
        }
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Change Password Modal"
    >
      <Form onSubmit={handleSubmit}>
        <h2>비밀번호 변경</h2>
        <InputGroup>
          <Label htmlFor="old_password">현재 비밀번호</Label>
          <Input
            type="password"
            id="old_password"
            name="old_password"
            value={formData.old_password}
            onChange={handleChange}
            placeholder="현재 비밀번호"
            required
          />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="new_password1">새 비밀번호</Label>
          <Input
            type="password"
            id="new_password1"
            name="new_password1"
            value={formData.new_password1}
            onChange={handleChange}
            placeholder="새 비밀번호"
            required
          />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="new_password2">새 비밀번호 확인</Label>
          <Input
            type="password"
            id="new_password2"
            name="new_password2"
            value={formData.new_password2}
            onChange={handleChange}
            placeholder="새 비밀번호 확인"
            required
          />
        </InputGroup>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {message && <div>{message}</div>}
        <Button type="submit">비밀번호 변경</Button>
      </Form>
    </Modal>
  );
};

export default ChangePasswordModal;
