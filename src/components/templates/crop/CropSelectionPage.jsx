import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import { getCropList, deleteCrop, updateSessionName } from '../../../apis/crop';
import ConfirmModal from '../../atoms/ConfirmModal';
import ReactPaginate from 'react-paginate';
import { useLoading } from '../../../LoadingContext';
import GlobalLoader from "../../atoms/GlobalLoader";
import {
  PageContainer,
  ContentContainer,
  Button,
  SessionListContainer,
  SessionList,
  SessionItem,
  SessionName,
  EditInput,
  SessionDetails,
  ButtonContainer,
  SaveButton,
  DeleteButton,
  EditButton,
  PaginationContainer,
  EmptyMessage
} from '../../../styles/CropSelectionStyle';

const CropSelectionPage = () => {
  const { setIsLoading } = useLoading();
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState(null);
  const [editingSession, setEditingSession] = useState(null);
  const [newSessionName, setNewSessionName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessionIdToDelete, setSessionIdToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const sessionsPerPage = 4;
  const navigate = useNavigate();

  const formatNumber = (num) => {
    if (num >= 1000000000000) {
      return (num / 1000000000000).toFixed(1) + '조원';
    } else if (num >= 100000000) {
      return (num / 100000000).toFixed(1) + '억원';
    } else if (num >= 10000000) {
      return (num / 10000000).toFixed(1) + '천만원';
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + '백만원';
    } else {
      return num.toLocaleString() + '원';
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const response = await getCropList();
      const updatedSessions = response.data.map(session => ({
        ...session,
        session_name: session.session_name === "Default Prediction Session" ? session.crop_names : session.session_name,
      }));
      setSessions(updatedSessions);
      localStorage.setItem('sessions', JSON.stringify(updatedSessions));
    } catch (err) {
      setError('세션 정보를 불러오는 중 오류가 발생했습니다.');
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteCrop(sessionIdToDelete);
      const updatedSessions = sessions.filter(session => session.session_id !== sessionIdToDelete);
      setSessions(updatedSessions);
      localStorage.setItem('sessions', JSON.stringify(updatedSessions));
      setIsModalOpen(false);
    } catch (err) {
      setError('세션 삭제 중 오류가 발생했습니다.');
    }
    setIsLoading(false);
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
    setIsLoading(true);
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
      setError('세션 이름 업데이트 중 오류가 발생했습니다.');
    }
    setIsLoading(false);
  };

  const openDeleteModal = (sessionId, e) => {
    e.stopPropagation();
    setSessionIdToDelete(sessionId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const indexOfLastSession = (currentPage + 1) * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessions = sessions.slice(indexOfFirstSession, indexOfLastSession);
  const pageCount = Math.ceil(sessions.length / sessionsPerPage);

  return (
    <>
      <GlobalLoader />
      <PageContainer>
        <Button onClick={() => navigate('/croptest')}>
          <FaPlus /> 작물 조합 추가
        </Button>
        {error && <p>{error}</p>}
        <ContentContainer>
          <SessionListContainer>
            {sessions.length === 0 ? (
              <EmptyMessage>등록한 작물 조합이 존재하지 않습니다. 작물 조합을 추가해보세요.</EmptyMessage>
            ) : (
              <>
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
                            <div>{session.created_at}</div>
                            <div>면적: {session.land_area}평</div>
                            <div>지역: {session.region}</div>
                            <div>총 소득: {formatNumber(session.total_income)}</div>
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
                  <ReactPaginate
                    previousLabel={"이전"}
                    nextLabel={"다음"}
                    breakLabel={"..."}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageChange}
                    containerClassName={"pagination"}
                    activeClassName={"active"}
                    previousClassName={"previous"}
                    nextClassName={"next"}
                    disabledClassName={"disabled"}
                  />
                </PaginationContainer>
              </>
            )}
          </SessionListContainer>
        </ContentContainer>
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