import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { fetchDetectionSessions, fetchSessionDetails, deleteDetectionSession } from "../../../apis/predict";
import { FaTrash, FaPlus } from 'react-icons/fa';
import ConfirmModal from '../../atoms/ConfirmModal';
import ReactPaginate from 'react-paginate';
import { useLoading } from "../../../LoadingContext";
import GlobalLoader from "../../atoms/GlobalLoader";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  width: 100%;
  margin: 0 auto;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 75rem; 
  margin-top: 1rem;

  @media (max-width: 48rem) { 
    max-width: 37.5rem; 
  }

  @media (max-width: 30rem) { 
    max-width: 100%;
  }
`;

const SessionList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.7rem; 
  max-width: 75rem;
`;

const SessionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.625rem;
  border: 1px solid #ccc;
  border-radius: 0.625rem; 
  background-color: #f9f9f9;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover {
    background-color: #f0f0f0;
    transform: translateY(-0.125rem); 
    box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.2);
  }
  flex-wrap: wrap;
  font-size: clamp(0.8rem, 2.5vw, 1.2rem); 
  position: relative;
`;

const SessionInfo = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.8rem 0.35rem; 
  gap: 0.3125rem; 
  flex: 1;
  min-width: 9.375rem; 
  font-size: clamp(0.9rem, 2.5vw, 1.2rem); 
`;

const SessionImage = styled.img`
  width: 5rem; 
  height: 5rem; 
  object-fit: cover;
  border-radius: 0.3125rem; 
  margin-right: 0.625rem; 
  flex-shrink: 0;

  @media (max-width: 48rem) { 
    margin-bottom: 0.5rem; 
    margin-right: 0;
  }

  @media (max-width: 30rem) { 
    margin-bottom: 0rem; 
    margin-right: 0;
  }
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 0.7rem; 
  right: 0.5rem; 
  background: none;
  border: none;
  color: #e53e3e;
  cursor: pointer;
  font-size: 1.2rem; 

  &:hover {
    color: #c53030;
  }
`;

const AddButtonContainer = styled.button`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;
  background-color: #4aaa87;
  color: white;
  border: none;
  border-radius: 0.3rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s;
  font-size: clamp(1rem, 2.5vw, 1.2rem);

  &:hover {
    background-color: #6dc4b0;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 0.1875rem rgba(58, 151, 212, 0.5); /* 3px */
  }

  &:active {
    background-color: #6dc4b0;
  }
`;

const AddButtonIcon = styled(FaPlus)`
  margin-right: 0.5rem; 
`;

const AddButtonText = styled.span`
  font-size: 1rem;
  font-weight: 600;
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: #888;
  font-size: 1rem; 
  margin: 2rem 0;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.5rem; 
  .pagination {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;

    @media (max-width: 48rem) { 
      flex-wrap: wrap;
    }

    @media (max-width: 30rem) { 
      flex-wrap: wrap;
      justify-content: center;
    }
  }

  .pagination li {
    margin: 0 0.3125rem; 

    @media (max-width: 30rem) { 
      margin: 0.3125rem; 
    }
  }

  .pagination li a {
    padding: 0.5rem 0.75rem; 
    border: 1px solid #ddd;
    border-radius: 0.25rem; 
    cursor: pointer;
    color: #4aaa87;
    text-decoration: none;
    transition: background-color 0.3s, color 0.3s;

    @media (max-width: 30rem) { 
      padding: 0.375rem 0.625rem; 
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
  const [loading, setLoading] = useState(true);
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
        alert("세션을 불러오는데 실패했습니다.");
      }
      setIsLoading(false);
      setLoading(false);
    };

    fetchSessions();
  }, [setIsLoading]);

  const handleSessionClick = async (sessionId) => {
    try {
      setIsLoading(true);
      setLoading(true);
      const response = await fetchSessionDetails(sessionId);
      navigate('/info', { state: { diagnosisResult: response.data } });
    } catch (error) {
      alert('세션을 불러오는데 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const handleDeleteSession = async () => {
    try {
      setIsLoading(true);      setLoading(true);
      await deleteDetectionSession(sessionIdToDelete);
      setSessions(sessions.filter(session => session.session_id !== sessionIdToDelete));
      setIsModalOpen(false);
    } catch (error) {
      alert('세션 삭제에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
      setLoading(false);
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
      {loading && <GlobalLoader />}
      <AddButtonContainer onClick={handleAddClick} aria-label="새 진단 시작하기">
        <AddButtonIcon />
        <AddButtonText>새 진단 시작하기</AddButtonText>
      </AddButtonContainer>

      <Content>
        {sessions.length === 0 ? (
          <EmptyMessage>진단 목록이 존재하지 않습니다. 첫 진단을 시작해보세요!</EmptyMessage>
        ) : (
          <>
            <SessionList>
              {sessions.slice(offset, offset + sessionsPerPage).map(session => (
                <SessionItem key={session.session_id} onClick={() => handleSessionClick(session.session_id)} tabIndex="0" aria-label={`${session.pest_name === "0" ? "정상" : session.pest_name} 진단 결과 보기`}>
                  <SessionImage src={session.user_image_url} alt={session.pest_name === "0" ? "정상" : session.pest_name} />
                  <SessionInfo>
                    <div><strong>질병명:</strong> {session.pest_name === "0" ? "정상" : session.pest_name}</div>
                    <div><strong>진단 날짜:</strong> {session.detection_date}</div>
                    <div><strong>AI 모델 정확도:</strong> {session.pest_name === "0" ? "정상" : session.confidence.toFixed(2)}</div>
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