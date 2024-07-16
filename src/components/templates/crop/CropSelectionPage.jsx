import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { getCropList, deleteCrop, updateSessionName } from '../../../apis/crop';

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
  color: ${colors.primary};
  font-size: 2.5rem;
  font-weight: bold;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin-top: 10px;
  background-color: ${colors.buttonBackground};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
  width: 150px;

  &:hover {
    background-color: ${colors.buttonHover};
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const DeleteButton = styled.button`
  background-color: #FF7043;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 15px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #FF5722;
  }
`;

const EditButton = styled.button`
  background-color: #FFCA28;
  color: ${colors.textPrimary};
  border: none;
  border-radius: 5px;
  padding: 8px 15px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #FFC107;
  }
`;

const SaveButton = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 15px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45A049;
  }
`;

const getCSRFToken = () => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; cookies.length > i; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, 10) === 'csrftoken=') {
        cookieValue = decodeURIComponent(cookie.substring(10));
        break;
      }
    }
  }
  return cookieValue;
};

const CropSelectionPage = () => {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState(null);
  const [editingSession, setEditingSession] = useState(null);
  const [newSessionName, setNewSessionName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await getCropList();
        setSessions(response.data);
      } catch (err) {
        setError('세션 정보를 불러오는 중 오류가 발생했습니다.');
      }
    };
    fetchSessions();
  }, []);

  const handleDelete = async (sessionId) => {
    try {
      await deleteCrop(sessionId);
      setSessions(sessions.filter(session => session.session_id !== sessionId));
    } catch (err) {
      setError('세션 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleSessionClick = (session) => {
    navigate('/SessionDetails', { state: { ...session } });
  };

  const handleEditClick = (session) => {
    setEditingSession(session);
    setNewSessionName(session.session_name);
  };

  const handleSaveClick = async (sessionId) => {
    try {
      await updateSessionName(sessionId, newSessionName);

      // 수정된 세션 이름을 바로 반영하기 위해 상태를 업데이트합니다.
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
      localStorage.setItem('sessions', JSON.stringify(updatedSessions)); // 수정된 세션 목록을 다시 저장
      setEditingSession(null);
    } catch (error) {
      console.error('Error updating session name:', error);
    }
  };

  return (
    <PageContainer>
      <Title>나의 작물 조합</Title>
      <Button onClick={() => navigate('/croptest')}>작물 조합 추가</Button>
      {error && <p>{error}</p>}
      <SessionList>
        {sessions.map(session => (
          <SessionItem key={session.session_id}>
            {editingSession?.session_id === session.session_id ? (
              <>
                <EditInput
                  type="text"
                  value={newSessionName}
                  onChange={(e) => setNewSessionName(e.target.value)}
                />
                <SaveButton onClick={() => handleSaveClick(session.session_id)}>저장</SaveButton>
              </>
            ) : (
              <>
                <SessionName onClick={() => handleSessionClick(session)}>
                  {session.session_name}
                </SessionName>
                <ButtonContainer>
                  <EditButton onClick={() => handleEditClick(session)}>수정</EditButton>
                  <DeleteButton onClick={(e) => { e.stopPropagation(); handleDelete(session.session_id); }}>삭제</DeleteButton>
                </ButtonContainer>
              </>
            )}
          </SessionItem>
        ))}
      </SessionList>
    </PageContainer>
  );
};

export default CropSelectionPage;