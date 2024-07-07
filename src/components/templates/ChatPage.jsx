import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { fetchChatHistory, sendChatMessage } from '../../apis/chat';

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

const ChatBox = styled.div`
  width: 100%;
  max-width: 600px;
  background-color: white;
  padding: 24px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
`;

const MessageList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 400px;
  overflow-y: auto;
`;

const Message = styled.li`
  padding: 8px 12px;
  border-radius: 4px;
  margin-bottom: 12px;
  background-color: ${({ isUser }) => (isUser ? '#d1e7dd' : '#f8d7da')};
  align-self: ${({ isUser }) => (isUser ? 'flex-end' : 'flex-start')};
`;

const InputBox = styled.form`
  display: flex;
  width: 100%;
  max-width: 600px;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 8px;
  &:focus {
    outline: none;
    border-color: #4aaa87;
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

const ChatPage = () => {
  const { sessionid } = useParams();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [sessionId, setSessionId] = useState(sessionid);

  useEffect(() => {
    localStorage.setItem('sessionId', sessionId);
    const fetchHistory = async () => {
      try {
        const response = await fetchChatHistory(sessionId);
        setMessages(response.data.map(chat => ({
          isUser: true,
          text: chat.question,
          timestamp: chat.timestamp
        })).concat(response.data.map(chat => ({
          isUser: false,
          text: chat.answer,
          timestamp: chat.timestamp
        }))));
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    fetchHistory();
  }, [sessionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userMessage = {
      isUser: true,
      text: inputValue,
      timestamp: new Date().toISOString()
    };
    setMessages([...messages, userMessage]);

    const messageData = { question: inputValue, session_id: sessionId, user_id: localStorage.getItem('userId') };

    try {
      const response = await sendChatMessage(messageData);
      const botMessage = {
        isUser: false,
        text: response.data.answer,
        timestamp: response.data.timestamp
      };
      setMessages([...messages, userMessage, botMessage]);
    } catch (error) {
      console.error('Error during chat processing:', error);
      const errorMessage = {
        isUser: false,
        text: 'An error occurred. Please try again later.',
        timestamp: new Date().toISOString()
      };
      setMessages([...messages, userMessage, errorMessage]);
    }
    setInputValue('');
  };

  return (
    <Container>
      <Title>농업 GPT</Title>
      <ChatBox>
        <MessageList>
          {messages.map((msg, index) => (
            <Message key={index} isUser={msg.isUser}>
              <strong>{msg.isUser ? '사용자' : '답변'}:</strong> {msg.text}
              <br />
              <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
            </Message>
          ))}
        </MessageList>
      </ChatBox>
      <InputBox onSubmit={handleSubmit}>
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="질문을 입력하세요"
          required
        />
        <Button type="submit">전송</Button>
      </InputBox>
    </Container>
  );
};

export default ChatPage;
