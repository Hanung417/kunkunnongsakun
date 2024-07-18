import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { getCropList, deleteCrop, updateSessionName } from '../../../apis/crop';
import ConfirmModal from '../../atoms/ConfirmModal';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #2c3e50;
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }
`;

const colors = {
  background: '#ECF0F1',
  primary: '#1ABC9C',
  secondary: '#FF9800',
  accent: '#3498DB',
  textPrimary: '#2C3E50',
  textSecondary: '#95A5A6',
  buttonBackground: '#1ABC9C',
  buttonHover: '#16A085',
  sessionBackground: '#FFFFFF',
  border: '#E0E0E0',
};

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${colors.background};
  min-height: 100vh;
  padding-bottom: 20px;
`;

const Title = styled.h1`
  margin: 20px 0;
  font-size: 2.5rem;
  font-weight: bold;
  color: ${colors.textPrimary};
`;

const Button = styled.button`
  padding: 10px 20px;
  margin-top: 10px;
  background-color: ${colors.primary};
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
  max-width: 1200px;
  margin-top: 20px;
  padding: 0 20px;
  overflow-y: auto;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
`;

const SessionItem = styled.div`
  background-color: ${colors.sessionBackground};
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 480px) {
    padding: 10px;
    margin-bottom: 10px;
  }
`;

const SessionName = styled.span`
  font-size: 1.5rem;
  color: ${colors.textPrimary};
  margin-bottom: 10px;
  word-break: break-word;
  text-align: center;

  @media (max-width: 480px) {
    font-size: 1.2rem;
    margin-bottom: 5px;
  }
`;

const EditInput = styled.input`
  font-size: 1.2rem;
  padding: 10px;
  margin-bottom: 10px;
  width: 80%;
  border: 2px solid ${colors.border};
  border-radius: 10px;

  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 8px;
    margin-bottom: 5px;
  }
`;

const SessionDetails = styled.div`
  font-size: 1rem;
  margin-bottom: 10px;
  text-align: center;
  color: ${colors.textSecondary};

  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 5px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;

  @media (max-width: 480px) {
    margin-top: 5px;
  }
`;

const SaveButton = styled.button`
  background-color: ${colors.primary};
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${colors.buttonHover};
  }

  @media (max-width: 480px) {
    padding: 8px 15px;
    font-size: 0.9rem;
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: ${colors.primary};
  cursor: pointer;
  font-size: 18px;
  margin-left: 10px;

  &:hover {
    color: ${colors.buttonHover};
  }

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const EditButton = styled.button`
  background: none;
  border: none;
  color: ${colors.primary};
  cursor: pointer;
  font-size: 18px;
  margin-right: 10px;

  &:hover {
    color: ${colors.buttonHover};
  }

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;

  @media (max-width: 480px) {
    flex-wrap: wrap;
    gap: 5px;
  }
`;

const PaginationButton = styled.button`
  padding: 10px 15px;
  margin: 0 5px;
  background-color: ${colors.buttonBackground};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${colors.buttonHover};
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 0.9rem;
  }
`;

const CropSelectionPage = () => {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState(null);
  const [editingSession, setEditingSession] = useState(null);
  const [newSessionName, setNewSessionName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessionIdToDelete, setSessionIdToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageRange, setPageRange] = useState([1, 5]);
  const sessionsPerPage = 4;
  const navigate = useNavigate();

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    const totalPages = Math.ceil(sessions.length / sessionsPerPage);

    if (currentPage > 3 && currentPage < totalPages - 2) {
      setPageRange([currentPage - 2, currentPage + 2]);
    } else if (currentPage <= 3) {
      setPageRange([1, 5]);
    } else if (currentPage >= totalPages - 2) {
      setPageRange([totalPages - 4, totalPages]);
    }
  }, [currentPage, sessions.length]);

  const fetchSessions = async () => {
    try {
      const response = await getCropList();
      const updatedSessions = response.data.map(session => ({
        ...session,
        session_name: session.session_name === "Default Prediction Session" ? session.crop_names : session.session_name,
      }));
      setSessions(updatedSessions);
      localStorage.setItem('sessions', JSON.stringify(updatedSessions));
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError('세션 정보를 불러오는 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCrop(sessionIdToDelete);
      const updatedSessions = sessions.filter(session => session.session_id !== sessionIdToDelete);
      setSessions(updatedSessions);
      localStorage.setItem('sessions', JSON.stringify(updatedSessions));
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error deleting session:', err);
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
      localStorage.setItem('sessions', JSON.stringify(updatedSessions));
      setEditingSession(null);
    } catch (error) {
      console.error('Error updating session name:', error);
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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastSession = currentPage * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessions = sessions.slice(indexOfFirstSession, indexOfLastSession);
  const totalPages = Math.ceil(sessions.length / sessionsPerPage);

  const renderPaginationButtons = () => {
    const buttons = [];

    for (let i = Math.max(1, pageRange[0]); i <= Math.min(totalPages, pageRange[1]); i++) {
      buttons.push(
        <PaginationButton
          key={i}
          onClick={() => handlePageChange(i)}
          disabled={currentPage === i}
        >
          {i}
        </PaginationButton>
      );
    }

    return buttons;
  };

  return (
    <>
      <GlobalStyle />
      <PageContainer>
        <Title>나의 작물 조합</Title>
        <Button onClick={() => navigate('/croptest')}>작물 조합 추가</Button>
        {error && <p>{error}</p>}
        <SessionList>
          {currentSessions.map(session => (
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
        <PaginationContainer>
          <PaginationButton onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
            &laquo;
          </PaginationButton>
          <PaginationButton onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            &lsaquo;
          </PaginationButton>
          {renderPaginationButtons()}
          <PaginationButton onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            &rsaquo;
          </PaginationButton>
          <PaginationButton onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
            &raquo;
          </PaginationButton>
        </PaginationContainer>
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
    </>
  );
};

export default CropSelectionPage;
