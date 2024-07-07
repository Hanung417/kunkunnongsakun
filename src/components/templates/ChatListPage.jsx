import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { fetchChatSessions } from '../../apis/chat';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  background-color: #f9f9f9;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 32px;
  color: #333;
`;

const ChatList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 400px;
  overflow-y: auto;
  width: 100%;
  max-width: 600px;
  margin-bottom: 24px;
`;

const ChatListItem = styled.li`
  padding: 8px 12px;
  border-radius: 4px;
  margin-bottom: 12px;
  background-color: #f1f1f1;
  cursor: pointer;
  &:hover {
    background-color: #ddd;
  }
`;

const Button = styled.button`
  padding: 12px 16px;
  font-size: 14px;
  color: white;
  background-color: #4aaa87;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #6dc4b0;
  }
`;

const ChatListPage = () => {
  const [chatSessions, setChatSessions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetchChatSessions();
        setChatSessions(response.data);
      } catch (error) {
        console.error('Error fetching chat sessions:', error);
      }
    };

    fetchSessions();
  }, []);

  const startNewChat = () => {
    const newSessionId = uuidv4();
    localStorage.setItem('sessionId', newSessionId);
    navigate(`/chat/${newSessionId}`);
  };

  const openChat = (sessionId) => {
    localStorage.setItem('sessionId', sessionId);
    navigate(`/chat/${sessionId}`);
  };

  return (
    <Container>
      <Title>대화 목록</Title>
      <ChatList>
        {chatSessions.map(session => (
          <ChatListItem key={session.session_id} onClick={() => openChat(session.session_id)}>
            {session.session_id}
          </ChatListItem>
        ))}
      </ChatList>
      <Button onClick={startNewChat}>새 대화 생성</Button>
    </Container>
  );
};

export default ChatListPage;