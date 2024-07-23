import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { fetchChatSessions, deleteChatSession, updateSessionName } from '../../../apis/chat';
import { FaTrash, FaEdit, FaTimes } from 'react-icons/fa';
import ConfirmModal from '../../atoms/ConfirmModal';
import Modal from 'react-modal';
import { useLoading } from '../../../LoadingContext';
import GlobalLoader from "../../atoms/GlobalLoader";

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

const ChatList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 20px;
  max-height: 400px;
  overflow-y: auto;
  width: 100%;
  margin-bottom: 24px;
`;

const ChatListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin-bottom: 12px;
  background-color: #f1f1f1;
  cursor: pointer;
  &:hover {
    background-color: #ddd;
  }
`;

const NoChatMessage = styled.div`
  font-size: 16px;
  color: #666;
  margin-top: 50px;
`;

const Button = styled.button`
  padding: 12px 16px;
  font-size: 16px;
  font-weight: bold;
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
  margin-top: 10px;
  padding: 12px 14px;
  font-size: 18px;
  font-weight: 600;
`;

const ModalContainer = styled(Modal)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;  
  padding: 24px;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 400px;
  width: 80%;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
`;

const ModalTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 30px;
  color: #333;
`;

const ModalContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InputContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px; /* Added margin for spacing between input and button */
`;

const Input = styled.input`
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%; 
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 8px;
  font-size: 14px;
  text-align: center; 
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
  .pagination {
    display: flex;
    list-style: none;
    padding: 0;
  }

  .pagination li {
    margin: 0 5px;
  }

  .pagination li a {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    color: #4aaa87;
    text-decoration: none;
    transition: background-color 0.3s, color 0.3s;
  }

  .pagination li a:hover {
    background-color: #f5f5f5;
    color: #3e8e75;
  }

  .pagination li.active a {
    background-color: #4aaa87;
    color: white;
    border: none;
  }

  .pagination li.previous a,
  .pagination li.next a {
    color: #888;
  }

  .pagination li.disabled a {
    color: #ccc;
    cursor: not-allowed;
  }
`;

const ChatListTemplate = () => {
  const { setIsLoading } = useLoading(); // Access loading context
  const [chatSessions, setChatSessions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [newSessionName, setNewSessionName] = useState('');
  const [editingSession, setEditingSession] = useState(null);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [error, setError] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Add this line
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const sessionsPerPage = 5;
  const pageCount = Math.ceil(chatSessions.length / sessionsPerPage);
  const offset = currentPage * sessionsPerPage;

  useEffect(() => {
    if (isLoggedIn) {
      const fetchSessions = async () => {
        setIsLoading(true);
        try {
          const response = await fetchChatSessions();
          const filteredSessions = response.data.filter(session => session.session_id !== null);
          setChatSessions(filteredSessions);
        } catch (error) {
          setErrorMessage('채팅 세션을 불러오는 중 오류가 발생했습니다.'); // Update this line
        } finally {
          setIsLoading(false);
        }
      };

      fetchSessions();
    }
  }, [isLoggedIn, setIsLoading]);

  const startNewChat = () => {
    setNewSessionName('');
    setError('');
    setErrorMessage(''); // Add this line
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
    if (!newSessionName) {
      setError('제목을 입력해주세요');
      return;
    }
    setError('');
    setErrorMessage(''); // Add this line
    if (editingSession) {
      setIsLoading(true);
      try {
        await updateSessionName(editingSession.session_id, newSessionName);
        setChatSessions(chatSessions.map(session => (
          session.session_id === editingSession.session_id
            ? { ...session, session_name: newSessionName }
            : session
        )));
      } catch (error) {
        setErrorMessage('세션 이름을 업데이트하는 중 오류가 발생했습니다.'); // Update this line
      } finally {
        setIsLoading(false);
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

  const confirmDeleteSession = (sessionId) => {
    setSessionToDelete(sessionId);
    setIsConfirmModalOpen(true);
  };

  const deleteSession = async () => {
    if (sessionToDelete) {
      setIsLoading(true);
      try {
        await deleteChatSession(sessionToDelete);
        setChatSessions(chatSessions.filter(session => session.session_id !== sessionToDelete));
      } catch (error) {
        setErrorMessage('세션을 삭제하는 중 오류가 발생했습니다.'); // Update this line
      } finally {
        setIsLoading(false);
      }
      setIsConfirmModalOpen(false);
      setSessionToDelete(null);
    }
  };

  const editSession = (session) => {
    setNewSessionName(session.session_name);
    setEditingSession(session);
    setIsModalOpen(true);
    setError('');
    setErrorMessage(''); // Add this line
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSession(null);
    setError('');
    setErrorMessage(''); // Add this line
  };

  return (
    <Container>
      <GlobalLoader />
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>} {/* Add this line */}
      {isLoggedIn ? (
        <>
          <NewChatButton onClick={startNewChat}>새 대화 시작하기</NewChatButton>
          {chatSessions.length === 0 ? (
            <NoChatMessage>대화 내역이 없습니다.</NoChatMessage>
          ) : (
            <>
              <ChatList>
                {chatSessions.slice(offset, offset + sessionsPerPage).map((session, index) => (
                  <ChatListItem key={session.session_id} onClick={() => openChat(session.session_id, session.session_name)}>
                    <span>
                      {session.session_name || session.session_id}
                    </span>
                    <div>
                      <EditButton onClick={(e) => { e.stopPropagation(); editSession(session); }}>
                        <FaEdit />
                      </EditButton>
                      <DeleteButton onClick={(e) => { e.stopPropagation(); confirmDeleteSession(session.session_id); }}>
                        <FaTrash />
                      </DeleteButton>
                    </div>
                  </ChatListItem>
                ))}
              </ChatList>
            </>
          )}
          <PaginationContainer>
            <ReactPaginate
              previousLabel={"이전"}
              nextLabel={"다음"}
              breakLabel={"..."}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={"pagination"}
              activeClassName={"active"}
              previousClassName={"previous"}
              nextClassName={"next"}
              disabledClassName={"disabled"}
              forcePage={currentPage}
            />
          </PaginationContainer>
          <ModalContainer
            isOpen={isModalOpen}
            onRequestClose={closeModal}
          >
            <CloseButton onClick={closeModal}><FaTimes /></CloseButton>
            <ModalTitle>{editingSession ? '대화 제목 수정' : '새 대화 생성'}</ModalTitle>
            <ModalContent>
              <InputContainer>
                <Input
                  type="text"
                  value={newSessionName}
                  onChange={(e) => setNewSessionName(e.target.value)}
                  placeholder="대화 제목 입력"
                  required
                />
                {error && <ErrorMessage>{error}</ErrorMessage>}
              </InputContainer>
              <Button onClick={handleNewChatSubmit}>{editingSession ? '수정' : '생성'}</Button>
            </ModalContent>
          </ModalContainer>
          <ConfirmModal
            isOpen={isConfirmModalOpen}
            onRequestClose={() => setIsConfirmModalOpen(false)}
            title="삭제 확인"
            content="이 대화를 삭제하시겠습니까?"
            onConfirm={deleteSession}
            closeModal={() => setIsConfirmModalOpen(false)}
            confirmText="삭제"
            cancelText="취소"
          />
        </>
      ) : (
        <NewChatButton onClick={startNewChat}>바로 챗봇 이용하기</NewChatButton>
      )}
    </Container>
  );
};

export default ChatListTemplate;