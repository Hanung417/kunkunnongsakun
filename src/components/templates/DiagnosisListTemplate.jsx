import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { fetchDetectionSessions, fetchSessionDetails, deleteDetectionSession } from "../../apis/predict";
import { FaTrash } from 'react-icons/fa';
import CustomModal from '../atoms/DeleteModal';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background-color: #f9f9f9;
  height: 100%;
`;

const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background-color: #4aaa87;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 1.3rem;
  margin: 0;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  margin-top: 30px;
`;

const SessionList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SessionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  &:hover {
    background-color: #ddd;
  }
`;

const SessionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #e53e3e;
  cursor: pointer;
  font-size: 18px;
  &:hover {
    color: #c53030;
  }
`;

const AddButton = styled.button`
  background-color: #4aaa87;
  color: white;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1.5rem;
  width: 100%;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;  
  &:hover {
    background-color: #3b8b6d;
  }
`;

const ListTemplate = () => {
  const [sessions, setSessions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessionIdToDelete, setSessionIdToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetchDetectionSessions();
        setSessions(response.data);
      } catch (error) {
        console.error('Failed to fetch sessions', error);
      }
    };

    fetchSessions();
  }, []);

  const handleSessionClick = async (sessionId) => {
    try {
      const response = await fetchSessionDetails(sessionId);
      navigate('/info', { state: { diagnosisResult: response.data } }); // InfoTemplate에 세션 상세 정보를 전달
    } catch (error) {
      console.error('Failed to fetch session details', error);
      alert('Failed to load the details for this session.');
    }
  };

  const handleDeleteSession = async () => {
    try {
      await deleteDetectionSession(sessionIdToDelete);
      setSessions(sessions.filter(session => session.session_id !== sessionIdToDelete));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to delete session', error);
    }
  };

  const handleAddClick = () => {
    navigate('/diagnosis');
  };

  const openDeleteModal = (sessionId) => {
    setSessionIdToDelete(sessionId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <PageContainer>
      <HeaderContainer>
        <Title>병해충 진단 세션 목록</Title>
      </HeaderContainer>
      <Content>
        <AddButton onClick={handleAddClick}>새로운 진단 시작하기</AddButton>
        <SessionList>
          {sessions.map(session => (
            <SessionItem key={session.session_id} onClick={() => handleSessionClick(session.session_id)}>
              <SessionInfo>
                <div>{session.pest_name}</div>
                <div>{session.detection_date}</div>
                <div>Confidence: {session.confidence}</div>
              </SessionInfo>
              <DeleteButton onClick={(e) => {
                e.stopPropagation();
                openDeleteModal(session.session_id);
              }}>
                <FaTrash />
              </DeleteButton>
            </SessionItem>
          ))}
        </SessionList>
      </Content>
      <CustomModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        title="삭제 확인"
        content="이 항목을 삭제하시겠습니까?"
        onConfirm={handleDeleteSession}
        closeModal={closeModal}
      />
    </PageContainer>
  );
};

export default ListTemplate;