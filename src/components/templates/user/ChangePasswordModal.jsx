import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { changePassword, getCSRFToken } from "../../../apis/user";
import CustomModal from "../../atoms/CustomModal"; // Import your custom modal component
import { FaTimes } from "react-icons/fa";

const ModalContainer = styled(Modal)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;  
  padding: 24px;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 400px;
  width: 80%;
  outline: none;
`;

const ModalTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 30px;
  color: #333;
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
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
  &:disabled {
    background-color: #9e9e9e;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
  margin-top: 4px;
  margin-bottom: 12px;
`;

const ChangePasswordModal = ({ isOpen, onRequestClose }) => {
  const [formData, setFormData] = useState({
    old_password: "",
    new_password1: "",
    new_password2: ""
  });
  const [error, setError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // Add state for button disable
  const [modalContent, setModalContent] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // Add state for success modal

  const navigate = useNavigate();

  useEffect(() => {
    const { old_password, new_password1, new_password2 } = formData;
    setIsButtonDisabled(!(old_password && new_password1 && new_password2));
  }, [formData]);

  const validatePassword = (password) => {
    return /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "new_password1") {
      if (!validatePassword(value)) {
        setError("비밀번호는 영소문자, 숫자, 특수문자를 하나 이상 포함하여 8자 이상으로 입력하세요");
      } else {
        setError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const csrfToken = getCSRFToken();

    try {
      const response = await changePassword(formData, {
        headers: { "X-CSRFToken": csrfToken },
        withCredentials: true
      });

      if (response.data.status === 'success') {
        setModalContent("비밀번호가 변경되었습니다. 다시 로그인을 진행해주세요.");
        setIsSuccessModalOpen(true);
        setError("");
      } else {
        setError(response.data.message || "비밀번호 변경 중 오류가 발생했습니다.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "비밀번호 변경 중 오류가 발생했습니다.");
    }
  };

  const closeModal = () => {
    setIsSuccessModalOpen(false);
    navigate('/login'); // Redirect to login page after successful password change
  };

  return (
    <>
      <ModalContainer
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        ariaHideApp={false}
      >
        <CloseButton onClick={onRequestClose}><FaTimes /></CloseButton>
        <Form onSubmit={handleSubmit}>
          <ModalTitle>비밀번호 변경</ModalTitle>
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
          {error && <ErrorMessage>{error}</ErrorMessage>}
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
          <Button type="submit" disabled={isButtonDisabled}>비밀번호 변경</Button>
        </Form>
      </ModalContainer>
      <CustomModal
        isOpen={isSuccessModalOpen}
        onRequestClose={closeModal}
        title="알림"
        content={modalContent}
      />
    </>
  );
};

export default ChangePasswordModal;