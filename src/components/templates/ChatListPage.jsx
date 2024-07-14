import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { fetchChatSessions, deleteChatSession, updateSessionName } from '../../apis/chat';
import Modal from 'react-modal';
import { FaTrash, FaEdit } from 'react-icons/fa';

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
  display: flex;
  justify-content: space-between;
  align-items: center;
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

const NewChatButton = styled(Button)`
  margin-top: 20px;
`;

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const ChatListPage = () => {
  const [chatSessions, setChatSessions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSessionName, setNewSessionName] = useState('');
  const [editingSession, setEditingSession] = useState(null);
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  useEffect(() => {
    if (isLoggedIn) {
      const fetchSessions = async () => {
        try {
          const response = await fetchChatSessions();
          const filteredSessions = response.data.filter(session => session.session_id !== null);
          setChatSessions(filteredSessions);
        } catch (error) {
          console.error('Error fetching chat sessions:', error);
        }
      };

      fetchSessions();
    }
  }, [isLoggedIn]);

  const startNewChat = () => {
    if (!isLoggedIn) {
      const newSessionId = uuidv4();
      localStorage.setItem('sessionId', newSessionId);
      localStorage.setItem('sessionName', 'Anonymous Session');
      navigate(`/chat/${newSessionId}?session_name=Anonymous%20Session`);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleNewChatSubmit = async () => {
    if (editingSession) {
      try {
        await updateSessionName(editingSession.session_id, newSessionName);
        setChatSessions(chatSessions.map(session => (
          session.session_id === editingSession.session_id
            ? { ...session, session_name: newSessionName }
            : session
        )));
      } catch (error) {
        console.error('Error updating session name:', error);
      }
      setEditingSession(null);
    } else {
      const newSessionId = uuidv4();
      localStorage.setItem('sessionId', newSessionId);
      localStorage.setItem('sessionName', newSessionName);
      navigate(`/chat/${newSessionId}?session_name=${encodeURIComponent(newSessionName)}`);
    }
    setIsModalOpen(false);
    setNewSessionName('');
  };

  const openChat = (sessionId, sessionName) => {
    localStorage.setItem('sessionId', sessionId);
    localStorage.setItem('sessionName', sessionName);
    navigate(`/chat/${sessionId}?session_name=${encodeURIComponent(sessionName)}`);
  };

  const deleteSession = async (sessionId) => {
    try {
      await deleteChatSession(sessionId);
      setChatSessions(chatSessions.filter(session => session.session_id !== sessionId));
    } catch (error) {
      console.error('Error deleting chat session:', error);
    }
  };

  const editSession = (session) => {
    setNewSessionName(session.session_name);
    setEditingSession(session);
    setIsModalOpen(true);
  };

  return (
    <Container>
      <Title>대화 목록</Title>
      {isLoggedIn ? (
        <>
          <ChatList>
            {chatSessions.map(session => (
              <ChatListItem key={session.session_id} onClick={() => openChat(session.session_id, session.session_name)}>
                <span>
                  {session.session_name || session.session_id}
                </span>
                <div>
                  <EditButton onClick={(e) => { e.stopPropagation(); editSession(session); }}>
                    <FaEdit />
                  </EditButton>
                  <DeleteButton onClick={(e) => { e.stopPropagation(); deleteSession(session.session_id); }}>
                    <FaTrash />
                  </DeleteButton>
                </div>
              </ChatListItem>
            ))}
          </ChatList>
          <NewChatButton onClick={startNewChat}>새 대화 생성</NewChatButton>
          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            style={customStyles}
            contentLabel="새 대화 생성"
          >
            <h2>{editingSession ? '대화 제목 수정' : '새 대화 생성'}</h2>
            <input
              type="text"
              value={newSessionName}
              onChange={(e) => setNewSessionName(e.target.value)}
              placeholder="대화 제목"
              required
            />
            <Button onClick={handleNewChatSubmit}>{editingSession ? '수정' : '생성'}</Button>
          </Modal>
        </>
      ) : (
        <NewChatButton onClick={startNewChat}>바로 챗봇 이용하기</NewChatButton>
      )}
    </Container>
  );
};

export default ChatListPage;