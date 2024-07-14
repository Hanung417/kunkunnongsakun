import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from 'axios';

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
`;

const SessionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const DeleteButton = styled.button`
  background: url('/trash-icon.png') no-repeat center center;
  background-size: contain;
  width: 24px;
  height: 24px;
  border: none;
  cursor: pointer;
`;

const AddButton = styled.button`
  background-color: #4aaa87;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.3em;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 20px;

  &:hover {
    background-color: #3b8b6d;
  }
`;

const ListTemplate = () => {
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get('http://localhost:8000/detect/list_detection_sessions/', {
          withCredentials: true,
        });
        setSessions(response.data);
      } catch (error) {
        console.error('Failed to fetch sessions', error);
      }
    };

    fetchSessions();
  }, []);

  const handleSessionClick = async (sessionId) => {
    try {
      const response = await axios.get(`http://localhost:8000/detect/detection_session_details/${sessionId}/`, {
        withCredentials: true,
      });
      navigate('/info', { state: { diagnosisResult: response.data } }); // InfoTemplate에 세션 상세 정보를 전달
    } catch (error) {
      console.error('Failed to fetch session details', error);
      alert('Failed to load the details for this session.');
    }
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      await axios.delete(`http://localhost:8000/detect/delete_detection_session/${sessionId}/`, {
        withCredentials: true,
      });
      setSessions(sessions.filter(session => session.session_id !== sessionId));
    } catch (error) {
      console.error('Failed to delete session', error);
    }
  };

  const handleAddClick = () => {
    navigate('/diagnosis');
  };

  return (
    <PageContainer>
      <HeaderContainer>
        <Title>병해충 진단 세션 목록</Title>
      </HeaderContainer>
      <Content>
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
                handleDeleteSession(session.session_id);
              }} />
            </SessionItem>
          ))}
        </SessionList>
        <AddButton onClick={handleAddClick}>새 진단 추가</AddButton>
      </Content>
    </PageContainer>
  );
};

export default ListTemplate;
