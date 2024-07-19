import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { fetchDetectionSessions, fetchSessionDetails, deleteDetectionSession } from "../../apis/predict";
import { FaTrash, FaPlus } from 'react-icons/fa';
import ConfirmModal from '../atoms/ConfirmModal';
import { FadeLoader } from 'react-spinners'; // Importing PulseLoader from react-spinners

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background-color: #f9f9f9;
`;

const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover {
    background-color: #f0f0f0;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  flex-wrap: wrap;
`;

const SessionInfo = styled.div`
  display: flex;
  flex-direction: column;
  padding: 6px;
  gap: 5px;
  flex: 1;
  min-width: 150px;
`;

const SessionImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 5px;
  margin-right: 10px;
  flex-shrink: 0;
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
  align-self: flex-start;
  margin-left: auto;
`;

const AddButtonContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 16px;
  background-color: #4aaa87;
  color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s;
  &:hover {
    background-color: #6dc4b0;
  }
`;

const AddButtonIcon = styled(FaPlus)`
  margin-right: 8px;
`;

const AddButtonText = styled.span`
  font-size: 1.2rem;
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: #888;
  font-size: 1.2rem;
  margin-top: 50px;
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const DiagnosisListTemplate = () => {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // State to track loading status
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessionIdToDelete, setSessionIdToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      setIsLoading(true); // Start loading
      try {
        const response = await fetchDetectionSessions();
        setSessions(response.data);
      } catch (error) {
        console.error('Failed to fetch sessions', error);
      }
      setIsLoading(false); // End loading
    };

    fetchSessions();
  }, []);

  const handleSessionClick = async (sessionId) => {
    try {
      const response = await fetchSessionDetails(sessionId);
      navigate('/info', { state: { diagnosisResult: response.data } });
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
        <AddButtonContainer onClick={handleAddClick}>
          <AddButtonIcon />
          <AddButtonText>새 진단 시작하기</AddButtonText>
        </AddButtonContainer>
      </HeaderContainer>
      <Content>
        {isLoading ? (
          <LoaderContainer>
            <FadeLoader color="#4aaa87" loading={isLoading} size={15} />
          </LoaderContainer>
        ) : sessions.length === 0 ? (
          <EmptyMessage>첫 진단을 시작해보세요!</EmptyMessage>
        ) : (
          <SessionList>
            {sessions.map(session => (
              <SessionItem key={session.session_id} onClick={() => handleSessionClick(session.session_id)}>
                <SessionImage src={session.user_image_url} alt={session.pest_name} />
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
        )}
      </Content>
      <ConfirmModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        title="삭제 확인"
        content="이 항목을 삭제하시겠습니까?"
        onConfirm={handleDeleteSession}
        closeModal={closeModal}
        confirmText="삭제"
        cancelText="취소"
        confirmColor="#e53e3e"
        confirmHoverColor="#c53030"
        cancelColor="#4aaa87"
        cancelHoverColor="#3b8b6d"
      />
    </PageContainer>
  );
};

export default DiagnosisListTemplate;