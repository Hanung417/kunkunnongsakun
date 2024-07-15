import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Modal from "react-modal";
import { changeUsername, getCSRFToken } from "../../../apis/user";

const ModalContainer = styled(Modal)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;  
  padding: 24px;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 400px;
  width: 80%;
`;

const ModalTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 16px;
  color: #333;
`;

const ModalContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  &:disabled {
    background-color: #9e9e9e;
    cursor: not-allowed;
  }
`;

const ChangeUsernameModal = ({ isOpen, onRequestClose, setUsername, setIsSuccessModalOpen, setSuccessMessage }) => {
  const [newUsername, setNewUsername] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    setIsButtonDisabled(newUsername.trim() === ""); // Disable button if newUsername is empty
  }, [newUsername]);

  const handleUsernameChange = async () => {
    try {
      const csrfToken = getCSRFToken();
      await changeUsername(newUsername, {
        headers: { "X-CSRFToken": csrfToken },
        withCredentials: true
      });
      setUsername(newUsername);
      setSuccessMessage("이름이 성공적으로 변경되었습니다.");
      setIsSuccessModalOpen(true);
      onRequestClose();
    } catch (error) {
      console.error("Failed to change username", error);
    }
  };

  return (
    <ModalContainer isOpen={isOpen} onRequestClose={onRequestClose}>
      <ModalTitle>사용자 이름 변경</ModalTitle>
      <ModalContent>
        <Input
          type="text"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          placeholder="새로운 사용자 이름"
        />
        <Button onClick={handleUsernameChange} disabled={isButtonDisabled}>변경</Button>
      </ModalContent>
    </ModalContainer>
  );
};

export default ChangeUsernameModal;