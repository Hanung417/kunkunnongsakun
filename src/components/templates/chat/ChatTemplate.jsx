import React, { useState, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { fetchChatHistory, sendChatMessage } from '../../../apis/chat';
import SyncLoader from 'react-spinners/SyncLoader';
import { IoMenu } from "react-icons/io5";
import { FaPaperPlane } from "react-icons/fa";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background-color: #ffffff;
  box-sizing: border-box;
  overflow: hidden;
  padding-bottom: 4.375rem; /* 70px in rem */
  min-height: auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem; /* 16px in rem */
  background-color: #4AAA87;
  color: white;
  font-size: 1.25rem; /* 20px in rem */
  font-weight: bold;
  position: relative;

  @media (max-width: 768px) {
    font-size: 1.125rem; /* 18px in rem */
    padding: 0.75rem; /* 12px in rem */
  }
`;

const Title = styled.div`
  flex: 1;
  text-align: center;
`;

const ChatListButton = styled.button`
  position: absolute;
  left: 0.3125rem; /* 5px in rem */
  padding: 0.625rem 0.75rem; /* 10px 12px in rem */
  font-weight: 600;
  color: white;
  background-color: #4AAA87;
  border: none;
  border-radius: 1.25rem; /* 20px in rem */
  cursor: pointer;

  svg {
    margin-bottom: -0.125rem; /* 2px in rem */
  }
`;

const ChatBox = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1rem; /* 16px in rem */
  background-color: #E6F8E0;
  overflow-y: auto;
`;

const MessageList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MessageContainer = styled.li`
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.75rem; /* 12px in rem */
  justify-content: ${({ isUser }) => (isUser ? 'flex-end' : 'flex-start')};

  @media (max-width: 768px) {
    margin-bottom: 0.5rem; /* 8px in rem */
  }
`;

const Message = styled.div`
  max-width: 70%;
  display: flex;
  flex-direction: column;
  align-items: ${({ isUser }) => (isUser ? 'flex-end' : 'flex-start')};
  padding: 0.625rem 0.875rem; /* 10px 14px in rem */
  border-radius: 1.25rem; /* 20px in rem */
  background-color: ${({ isUser }) => (isUser ? '#F7FE2E' : 'white')};
  position: relative;
  box-shadow: 0 0.0625rem 0.0625rem rgba(0, 0, 0, 0.1); /* 1px 1px in rem */
  word-break: break-word;
  margin-top: 0.5rem; /* 8px in rem */

  @media (max-width: 768px) {
    padding: 0.5rem 0.625rem; /* 8px 10px in rem */
  }
`;

const MessageText = styled.div`
  flex: 1;
`;

const MessageTime = styled.small`
  margin-top: 0.25rem; /* 4px in rem */
  font-size: 0.8em;
  color: #666;
  ${({ isUser }) => isUser ? css`align-self: flex-end;` : css`align-self: flex-start;`}
`;

const ProfileImage = styled.img`
  width: 3.125rem; /* 50px in rem */
  height: 3.125rem; /* 50px in rem */
  border-radius: 50%;
  margin-right: ${({ isUser }) => (isUser ? '0' : '0.625rem')}; /* 10px in rem */
  margin-left: ${({ isUser }) => (isUser ? '0.625rem' : '0')}; /* 10px in rem */

  @media (max-width: 768px) {
    width: 2.5rem; /* 40px in rem */
    height: 2.5rem; /* 40px in rem */
    margin-right: ${({ isUser }) => (isUser ? '0' : '0.375rem')}; /* 6px in rem */
    margin-left: ${({ isUser }) => (isUser ? '0.375rem' : '0')}; /* 6px in rem */
  }
`;

const InputBox = styled.form`
  display: flex;
  align-items: center; /* Align items vertically center */
  padding: 1.25rem 0.75rem; /* 20px 12px in rem */
  background-color: #f0f0f0;
  border-top: 1px solid #ddd;
  width: 100%;
  box-sizing: border-box;
  position: fixed;
  bottom: 60px; /* Changed to 0 */
  left: 0;
  right: 0;

  @media (max-width: 768px) {
    padding: 1rem; /* 16px in rem */
  }
`;

const Input = styled.input`
  flex-grow: 1;
  padding: 0.8rem; /* 16px in rem */
  border: 1px solid #ddd;
  border-radius: 1rem; /* 20px in rem */
  margin-right: 0.5rem; /* 8px in rem */
  font-size: 1rem; /* 16px in rem */
  &:focus {
    outline: none;
    border-color: #4aaa87;
  }

  @media (max-width: 768px) {
    padding: 0.6rem; /* 12px in rem */
    margin-right: 0.25rem; /* 4px in rem */
  }
`;

const Button = styled.button`
  flex-shrink: 0;
  padding: 0.625rem 1rem; /* 10px 16px in rem */
  font-size: 0.875rem; /* 14px in rem */
  color: white;
  background-color: #4aaa87;
  border: none;
  border-radius: 1:wa:rem; /* 20px in rem */
  cursor: pointer;
  &:hover {
    background-color: #6dc4b0;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem; /* 8px 12px in rem */
    font-size: 0.75rem; /* 12px in rem */
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 0.5rem; /* 8px in rem */
  font-size: 0.875rem; /* 14px in rem */
  text-align: center; 
`;

const ChatTemplate = () => {
  const { sessionid } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(sessionid);
  const [errorMessage, setErrorMessage] = useState('');

  const chatBoxRef = useRef(null);

  const params = new URLSearchParams(location.search);
  const sessionName = params.get('session_name');
  const isLoggedIn = localStorage.getItem('userId') !== null;

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem('sessionId', sessionId);
      localStorage.setItem('sessionName', sessionName);
      const fetchHistory = async () => {
        try {
          const response = await fetchChatHistory(sessionId);
          const orderedMessages = response.data.flatMap(chat => [
            { isUser: true, text: chat.question, timestamp: chat.timestamp },
            { isUser: false, text: chat.answer, timestamp: chat.timestamp }
          ]);
          setMessages([{ isUser: false, text: '안녕하세요 무엇을 도와드릴까요?', timestamp: new Date().toISOString() }, ...orderedMessages]);
        } catch (error) {
          setErrorMessage('채팅 기록을 불러오는 중 오류가 발생했습니다.');
        }
      };

      fetchHistory();
    } else {
      setMessages([{ isUser: false, text: '안녕하세요 무엇을 도와드릴까요?', timestamp: new Date().toISOString() }]);
    }
  }, [sessionId, sessionName, isLoggedIn]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userMessage = {
      isUser: true,
      text: inputValue,
      timestamp: new Date().toISOString()
    };
    setMessages([...messages, userMessage]);
    setInputValue('');
    setLoading(true);

    const messageData = {
      question: inputValue,
      session_id: sessionId,
      session_name: sessionName,
      user_id: isLoggedIn ? localStorage.getItem('userId') : null
    };

    try {
      const response = await sendChatMessage(messageData);
      const botMessage = {
        isUser: false,
        text: response.data.answer,
        timestamp: response.data.timestamp
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      setErrorMessage('채팅 처리 중 오류가 발생했습니다.');
      const errorMessage = {
        isUser: false,
        text: 'An error occurred. Please try again later.',
        timestamp: new Date().toISOString()
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <Title>{sessionName || '농업 GPT'}</Title>
        <ChatListButton onClick={() => navigate('/chatlist')}><IoMenu />  목록 보기</ChatListButton>
      </Header>
      <ChatBox ref={chatBoxRef}>
        <MessageList>
          {messages.map((msg, index) => (
            <MessageContainer key={index} isUser={msg.isUser}>
              {!msg.isUser && <ProfileImage src={`${process.env.PUBLIC_URL}/android-chrome-192x192.png`} alt="Profile" />}
              <Message isUser={msg.isUser}>
                <MessageText>
                  {!msg.isUser ? (
                    <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                  ) : (
                    <>
                      {msg.text}
                      <br/>
                    </>
                  )}
                </MessageText>
                <MessageTime isUser={msg.isUser}>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</MessageTime>
              </Message>
              {msg.isUser && <ProfileImage src={`${process.env.PUBLIC_URL}/user_icon.jpg`} alt="Profile" isUser />}
            </MessageContainer>
          ))}
          {loading && (
            <MessageContainer isUser={false}>
              <ProfileImage src={`${process.env.PUBLIC_URL}/android-chrome-192x192.png`} alt="Profile" />
              <Message isUser={false} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span>답변을 불러오는 중입니다.</span>
                  <SyncLoader
                    color="#75e781"
                    loading={loading}
                    margin={2}
                    size={8}
                    speedMultiplier={0.7}
                    style={{ marginLeft: '10px' }}
                  />
                </div>
              </Message>
            </MessageContainer>
          )}
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
        <Button type="submit"><FaPaperPlane size="20px"/></Button>
      </InputBox>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </Container>
  );
};

export default ChatTemplate;