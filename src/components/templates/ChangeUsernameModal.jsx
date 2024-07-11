import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import Modal from "react-modal";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h2`
  margin-bottom: 16px;
  color: #333;
`;

const Input = styled.input`
  padding: 8px;
  font-size: 16px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 12px 16px;
  font-size: 16px;
  color: white;
  background-color: #4aaa87;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #6dc4b0;
  }
`;

const ChangeUsernameModal = ({ isOpen, onRequestClose, setUsername }) => {
  const [newUsername, setNewUsername] = useState("");

  const handleUsernameChange = async () => {
    try {
      const csrfToken = document.cookie.match(/csrftoken=([^;]*)/)[1];
      const response = await axios.post(
        "http://localhost:8000/login/change_username/",
        JSON.stringify({ new_username: newUsername }),
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          withCredentials: true,
        }
      );
      setUsername(newUsername);
      onRequestClose();
    } catch (error) {
      console.error("Failed to change username", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <Container>
        <Title>사용자 이름 변경</Title>
        <Input
          type="text"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          placeholder="새로운 사용자 이름"
        />
        <Button onClick={handleUsernameChange}>변경</Button>
      </Container>
    </Modal>
  );
};

export default ChangeUsernameModal;