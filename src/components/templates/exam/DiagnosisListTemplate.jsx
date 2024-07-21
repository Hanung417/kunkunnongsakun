import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { fetchDetectionSessions, fetchSessionDetails, deleteDetectionSession } from "../../../apis/predict";
import { FaTrash, FaPlus } from 'react-icons/fa';
import ConfirmModal from '../../atoms/ConfirmModal';
import ReactPaginate from 'react-paginate';
import {useLoading} from "../../../LoadingContext";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  background-color: #f9f9f9;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin-top: 30px;

  @media (max-width: 768px) {
    max-width: 600px;
  }

  @media (max-width: 480px) {
    max-width: 100%;
  }
`;

const SessionList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const SessionItem = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 75%;
  align-items: left;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover {
    background-color: #f0f0f0;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  flex-wrap: wrap;
  font-size: clamp(0.5rem, 2vw, 1.2rem); /* 텍스트 크기 반응형으로 조정 */
`;


const SessionImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 5px;
  margin-right: 10px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    margin-bottom: 0;
    margin-right: 10px;
  }

  @media (max-width: 480px) {
    margin-bottom: 0;
    margin-right: 10px;
  }
`;

const SessionInfo = styled.div`
  display: flex;
  flex-direction: column;
  padding: 6px;
  gap: 5px;
  flex: 1;
  min-width: 150px;
  font-size: 1rem; /* 텍스트 크기 반응형으로 조정 */
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #e53e3e;
  cursor: pointer;
  font-size: 1.2rem; /* 텍스트 크기 조정 */

  &:hover {
    color: #c53030;
  }

  @media (max-width: 768px) {
    align-self: flex-end;
    margin-top: 10px;
  }

  @media (max-width: 480px) {
    align-self: flex-end;
    margin-top: 10px;
  }
`;

const AddButtonContainer = styled.button`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 16px;
  background-color: #4aaa87;
  color: white;
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s;
  font-size: clamp(1rem, 2.5vw, 1.2rem); /* 텍스트 크기 반응형으로 조정 */

  &:hover {
    background-color: #6dc4b0;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(58, 151, 212, 0.5);
  }

  &:active {
    background-color: #6dc4b0;
  }
`;

const AddButtonIcon = styled(FaPlus)`
  margin-right: 8px;
`;

const AddButtonText = styled.span`
  font-size: 1rem;
  font-weight: 600;
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: #888;
  font-size: 1.5rem; /* 텍스트 크기 증가 */
  margin-top: 50px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
  .pagination {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;

    @media (max-width: 768px) {
      flex-wrap: wrap;
    }

    @media (max-width: 480px) {
      flex-wrap: wrap;
      justify-content: center;
    }
  }

  .pagination li {
    margin: 0 5px;

    @media (max-width: 480px) {
      margin: 5px;
    }
  }

  .pagination li a {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    color: #4aaa87;
    text-decoration: none;
    transition: background-color 0.3s, color 0.3s;

    @media (max-width: 480px) {
      padding: 6px 10px;
      font-size: 0.9rem;
    }
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

const DiagnosisListTemplate = () => {
  const { setIsLoading } = useLoading();
  const [sessions, setSessions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessionIdToDelete, setSessionIdToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  const sessionsPerPage = 4;
  const pageCount = Math.ceil(sessions.length / sessionsPerPage);
  const offset = currentPage * sessionsPerPage;

  useEffect(() => {
    const fetchSessions = async () => {
      setIsLoading(true);
      try {
        const response = await fetchDetectionSessions();
        setSessions(response.data);
      } catch (error) {
        console.error('Failed to fetch sessions', error);
      }
      setIsLoading(false);
    };

    fetchSessions();
  }, [setIsLoading]);

  const handleSessionClick = async (sessionId) => {
    try {
      setIsLoading(true);
      const response = await fetchSessionDetails(sessionId);
      navigate('/info', { state: { diagnosisResult: response.data } });
    } catch (error) {
      console.error('Failed to fetch session details', error);
      alert('Failed to load the details for this session.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSession = async () => {
    try {
      setIsLoading(true);
      await deleteDetectionSession(sessionIdToDelete);
      setSessions(sessions.filter(session => session.session_id !== sessionIdToDelete));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to delete session', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClick = () => {
    navigate('/diagnosis');
  };

  const openDeleteModal = (sessionId) => {
    setSessionIdToDelete(sessionId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <PageContainer>
        <AddButtonContainer onClick={handleAddClick} aria-label="새 진단 시작하기">
          <AddButtonIcon />
          <AddButtonText>새 진단 시작하기</AddButtonText>
        </AddButtonContainer>

      <Content>
        {sessions.length === 0 ? (
          <EmptyMessage>첫 진단을 시작해보세요!</EmptyMessage>
        ) : (
          <>
            <SessionList>
              {sessions.slice(offset, offset + sessionsPerPage).map(session => (
                <SessionItem key={session.session_id} onClick={() => handleSessionClick(session.session_id)} tabIndex="0" aria-label={`${session.pest_name} 진단 결과 보기`}>
                  <SessionImage src={session.user_image_url} alt={session.pest_name} />
                  <SessionInfo>
                    <div><strong>질병 이름:</strong> {session.pest_name}</div>
                    <div><strong>진단 날짜:</strong> {session.detection_date}</div>
                    <div><strong>정확도:</strong> {session.confidence}</div>
                  </SessionInfo>
                  <DeleteButton onClick={(e) => {
                    e.stopPropagation();
                    openDeleteModal(session.session_id);
                  }} aria-label="세션 삭제">
                    <FaTrash />
                  </DeleteButton>
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
                onPageChange={handlePageClick}
                containerClassName={"pagination"}
                activeClassName={"active"}
                previousClassName={"previous"}
                nextClassName={"next"}
                disabledClassName={"disabled"}
              />
            </PaginationContainer>
          </>
        )}
      </Content>
      <ConfirmModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        title="삭제 확인"
        content="이 항목을 삭제하시겠습니까?"
        onConfirm={handleDeleteSession}
        closeModal={closeModal}
        confirmText="삭제"
        cancelText="취소"
        confirmColor="#e53e3e"
        confirmHoverColor="#c53030"
        cancelColor="#4aaa87"
        cancelHoverColor="#3b8b6d"
      />
    </PageContainer>
  );
};

export default DiagnosisListTemplate;