import React from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';

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
  top: ${({ customTop }) => customTop || '50%'};
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 400px;
  width: 80%;
  height: auto;
  max-height: ${({ customHeight }) => customHeight || '400px'};
`;

const ModalTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 16px;
  color: #333;
`;

const ModalContent = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 24px;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  padding: 12px 16px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: ${({ confirm, isError }) => (confirm ? '#e53e3e' : isError ? '#e53e3e' : '#4aaa87')};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: ${({ confirm, isError }) => (confirm ? '#c53030' : isError ? '#c53030' : '#3b8b6d')};
  }
`;

const CustomModal = ({ isOpen, onRequestClose, title, content, onConfirm, showConfirmButton, isError, customTop, customHeight }) => (
  <ModalContainer
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    contentLabel={title}
    ariaHideApp={false}
    customTop={customTop}
    customHeight={customHeight}
  >
    <ModalTitle>{title}</ModalTitle>
    <ModalContent>{content}</ModalContent>
    <ButtonContainer>
      {showConfirmButton && <Button confirm onClick={onConfirm}>삭제</Button>}
      <Button onClick={onRequestClose} isError={isError}>{showConfirmButton ? "취소" : "확인"}</Button>
    </ButtonContainer>
  </ModalContainer>
);

export default CustomModal;