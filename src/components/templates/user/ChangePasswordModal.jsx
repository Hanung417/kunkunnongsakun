import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { changePassword, getCSRFToken } from "../../../apis/user";
import CustomModal from "../../atoms/CustomModal"; // Import your custom modal component

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
        setModalContent("비밀번호가 성공적으로 변경되었습니다. 다시 로그인을 진행해주세요.");
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
        <Button type="submit" disabled={isButtonDisabled}>비밀번호 변경</Button>
      </Form>
      <CustomModal
        isOpen={isSuccessModalOpen}
        onRequestClose={closeModal}
        title="알림"
        content={modalContent}
      />
    </Modal>
  );
};

export default ChangePasswordModal;