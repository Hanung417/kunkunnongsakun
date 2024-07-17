import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { getCropList, deleteCrop, updateSessionName } from '../../../apis/crop';
import ConfirmModal from '../../atoms/ConfirmModal';

const colors = {
  background: '#F7F7F7',
  primary: '#4CAF50',
  secondary: '#FF9800',
  accent: '#03A9F4',
  textPrimary: '#333',
  textSecondary: '#666',
  buttonBackground: '#2196F3',
  buttonHover: '#1976D2',
  sessionBackground: '#FFFFFF',
  border: '#E0E0E0',
};

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  min-height: 100vh;
  background-color: ${colors.background};
  font-size: 16px;
  font-family: 'Arial', sans-serif;
  color: ${colors.textPrimary};
  padding: 20px;
`;

const Title = styled.h1`
  margin: 20px 0;
  font-size: 2.5rem;
  font-weight: bold;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin-top: 10px;
  background-color: #4aaa87;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
  width: 150px;

  &:hover {
    background-color: #6dc4b0;
  }
`;

const SessionList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 1200px;
  margin-top: 20px;
`;

const SessionItem = styled.div`
  background-color: ${colors.sessionBackground};
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
`;

const SessionName = styled.span`
  font-size: 1.2rem;
  color: ${colors.textPrimary};
  margin-bottom: 10px;
  word-break: break-word;
  text-align: center;
`;

const EditInput = styled.input`
  font-size: 1rem;
  padding: 8px;
  margin-bottom: 10px;
  width: 80%;
  border: 2px solid ${colors.border};
  border-radius: 5px;
`;

const SessionDetails = styled.div`
  font-size: 0.9rem;
  margin-bottom: 10px;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const SaveButton = styled.button`
  background-color: #4aaa87;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 15px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #6dc4b0;
  }
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

const EditButton = styled.button`
  background: none;
  border: none;
  color: #4aaa87;
  cursor: pointer;
  font-size: 18px;
  &:hover {
    color: #2faa9a;
  }
`;

const CropSelectionPage = () => {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState(null);
  const [editingSession, setEditingSession] = useState(null);
  const [newSessionName, setNewSessionName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessionIdToDelete, setSessionIdToDelete] = useState(null);
  const navigate = useNavigate();

  const fetchSessions = async () => {
    try {
      const response = await getCropList();
      console.log('API Response:', response); // API 응답 확인
      const updatedSessions = response.data.map(session => ({
        ...session,
        session_name: session.session_name === "Default Prediction Session" ? session.crop_names : session.session_name // crop_names를 session_name으로 설정
      }));
      setSessions(updatedSessions);
      localStorage.setItem('sessions', JSON.stringify(updatedSessions)); // fetch 후 localStorage 업데이트
    } catch (err) {
      console.error('Error fetching sessions:', err); // 에러 로그
      setError('세션 정보를 불러오는 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    const storedSessions = localStorage.getItem('sessions');
    if (storedSessions) {
      setSessions(JSON.parse(storedSessions));
    }
    fetchSessions();
  }, []);

  const handleDelete = async () => {
    try {
      await deleteCrop(sessionIdToDelete);
      const updatedSessions = sessions.filter(session => session.session_id !== sessionIdToDelete);
      setSessions(updatedSessions);
      localStorage.setItem('sessions', JSON.stringify(updatedSessions)); // 삭제 후 localStorage 업데이트
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error deleting session:', err); // 에러 로그
      setError('세션 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleSessionClick = (session) => {
    navigate('/sessiondetails', { state: { ...session } });
  };

  const handleEditClick = (session, e) => {
    e.stopPropagation();
    setEditingSession(session);
    setNewSessionName(session.session_name);
  };

  const handleSaveClick = async (sessionId, e) => {
    e.stopPropagation();
    try {
      await updateSessionName(sessionId, newSessionName);
      const updatedSessions = sessions.map(session => {
        if (session.session_id === sessionId) {
          return {
            ...session,
            session_name: newSessionName,
          };
        }
        return session;
      });
      setSessions(updatedSessions);
      localStorage.setItem('sessions', JSON.stringify(updatedSessions)); // 수정 후 localStorage 업데이트
      setEditingSession(null);
    } catch (error) {
      console.error('Error updating session name:', error); // 에러 로그
      setError('세션 이름 업데이트 중 오류가 발생했습니다.');
    }
  };

  const openDeleteModal = (sessionId, e) => {
    e.stopPropagation();
    setSessionIdToDelete(sessionId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <PageContainer>
      <Title>나의 작물 조합</Title>
      <Button onClick={() => navigate('/croptest')}>작물 조합 추가</Button>
      {error && <p>{error}</p>}
      <SessionList>
        {sessions.map(session => (
          <SessionItem key={session.session_id} onClick={() => handleSessionClick(session)}>
            {editingSession?.session_id === session.session_id ? (
              <>
                <EditInput
                  type="text"
                  value={newSessionName}
                  onChange={(e) => setNewSessionName(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
                <SaveButton onClick={(e) => handleSaveClick(session.session_id, e)}>저장</SaveButton>
              </>
            ) : (
              <>
                <SessionName>
                  {session.session_name}
                </SessionName>
                <SessionDetails>
                  <div>면적: {session.land_area}평</div>
                  <div>지역: {session.region}</div>
                  <div>총 소득: {session.total_income}원</div>
                  <div>{session.created_at}</div>
                </SessionDetails>
                <ButtonContainer>
                  <EditButton onClick={(e) => handleEditClick(session, e)}>
                    <FaEdit />
                  </EditButton>
                  <DeleteButton onClick={(e) => openDeleteModal(session.session_id, e)}>
                    <FaTrash />
                  </DeleteButton>
                </ButtonContainer>
              </>
            )}
          </SessionItem>
        ))}
      </SessionList>
      <ConfirmModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        title="삭제 확인"
        content="이 항목을 삭제하시겠습니까?"
        onConfirm={handleDelete}
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

export default CropSelectionPage;
