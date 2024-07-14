import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100vh;
  background-color: #f8f9fa;
  font-size: 1rem;
  font-family: Arial, sans-serif;
  color: #333;
  padding: 20px;
`;

const Title = styled.h1`
  margin: 20px 0;
  color: #2c3e50;
  font-size: 1.5rem;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin-top: 10px;
  background-color: #4aaa87;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
  width: 100%;

  &:hover {
    background-color: #6dc4b0;
  }
`;

const SessionList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 500px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const SessionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  width: 100%;
  cursor: pointer;

  &:hover {
    background-color: #f1f2f6;
  }
`;

const SessionName = styled.span`
  font-size: 1rem;
`;

const DeleteButton = styled.button`
  background-color: red;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get('http://localhost:8000/prediction/list_sessions/', {
          headers: {
            'X-CSRFToken': getCSRFToken(),
          },
          withCredentials: true,
        });
        setSessions(response.data);
      } catch (err) {
        setError('세션 정보를 불러오는 중 오류가 발생했습니다.');
      }
    };
    fetchSessions();
  }, []);

  const handleDelete = async (sessionId) => {
    try {
      await axios.delete(`http://localhost:8000/prediction/delete_session/${sessionId}/`, {
        headers: {
          'X-CSRFToken': getCSRFToken(),
        },
        withCredentials: true,
      });
      setSessions(sessions.filter(session => session.session_id !== sessionId));
    } catch (err) {
      setError('세션 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleSessionClick = (session) => {
    navigate('/SessionDetails', { state: { ...session } });
  };

  return (
    <PageContainer>
      <Title>세션 목록</Title>
      <Button onClick={() => navigate('/CropSelection')}>추가</Button>
      {error && <p>{error}</p>}
      <SessionList>
        {sessions.map(session => (
          <SessionItem key={session.session_id} onClick={() => handleSessionClick(session)}>
            <SessionName>{session.session_name}</SessionName>
            <DeleteButton onClick={(e) => { e.stopPropagation(); handleDelete(session.session_id); }}>삭제</DeleteButton>
          </SessionItem>
        ))}
      </SessionList>
    </PageContainer>
  );
};

export default CropSelectionPage;
