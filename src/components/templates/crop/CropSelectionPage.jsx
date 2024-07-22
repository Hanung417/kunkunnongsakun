import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { getCropList, deleteCrop, updateSessionName } from '../../../apis/crop';
import ConfirmModal from '../../atoms/ConfirmModal';
import ReactPaginate from 'react-paginate';
import { useLoading } from '../../../LoadingContext';
import GlobalLoader from "../../../GlobalLoader"; // GlobalLoader 컴포넌트 가져오기

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f9f9f9;
  padding: 20px 0; /* 상단과 하단에 패딩 추가 */
  height: 100vh;
  position: relative;
  overflow: hidden; /* 스크롤 없애기 */
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow: hidden; /* 내부 스크롤 허용 */
`;

const Button = styled.button`
  padding: 10px 20px;
  margin-top: 20px;
  margin-bottom: 20px; /* 버튼 하단에 여백 추가 */
  font-weight: bold;
  background-color: #4aaa87;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
  width: 150px;

  &:hover {
    background-color: #3e8e75;
  }
`;

const SessionListContainer = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto; /* 세션 리스트가 넘칠 경우 스크롤 */
`;

const SessionList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* 최소 너비를 줄임 */
  gap: 10px; /* 간격을 줄임 */
  max-width: 1000px; /* 최대 너비 설정 */
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  margin-bottom: 20px; /* 페이지 네이션과의 간격 확보 */

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); /* 더 작은 화면에서는 더 작은 최소 너비 */
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px; /* 간격을 더 줄임 */
  }
`;

const SessionItem = styled.div`
  background-color: #FFFFFF;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 8px; /* 패딩을 줄임 */
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  height: 150px; /* 높이 설정 */

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const SessionName = styled.span`
  font-size: 1.2rem; /* 폰트 크기를 줄임 */
  color: #333;
  margin-bottom: 6px; /* 여백을 줄임 */
  word-break: break-word;
  text-align: center;

  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 4px;
  }
`;

const EditInput = styled.input`
  font-size: 1rem; /* 폰트 크기를 줄임 */
  padding: 6px; /* 패딩을 줄임 */
  margin-bottom: 6px; /* 여백을 줄임 */
  width: 80%;
  border: 2px solid #E0E0E0;
  border-radius: 10px;

  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 4px;
    margin-bottom: 4px;
  }
`;

const SessionDetails = styled.div`
  font-size: 0.8rem; /* 폰트 크기를 줄임 */
  margin-bottom: 6px; /* 여백을 줄임 */
  text-align: center;
  color: #666;

  @media (max-width: 480px) {
    font-size: 0.7rem;
    margin-bottom: 4px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 6px; /* 여백을 줄임 */

  @media (max-width: 480px) {
    margin-top: 4px;
  }
`;

const SaveButton = styled.button`
  background-color: #4aaa87;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 6px 12px; /* 패딩을 줄임 */
  cursor: pointer;
  font-size: 0.9rem; /* 폰트 크기를 줄임 */
  transition: background-color 0.3s;

  &:hover {
    background-color: #3e8e75;
  }

  @media (max-width: 480px) {
    padding: 4px 8px;
    font-size: 0.8rem;
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #e53e3e;
  cursor: pointer;
  font-size: 14px; /* 폰트 크기를 줄임 */
  margin-left: 6px;

  &:hover {
    color: #c53030;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const EditButton = styled.button`
  background: none;
  border: none;
  color: #4aaa87;
  cursor: pointer;
  font-size: 14px; /* 폰트 크기를 줄임 */
  margin-right: 6px;

  &:hover {
    color: #3e8e75;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 20px; /* 하단과의 간격 확보 */

  .pagination {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;

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

const EmptyMessage = styled.div`
  text-align: center;
  color: #888;
  font-size: 1rem; 
  margin: 2rem 0;
`;

const CropSelectionPage = () => {
  const { setIsLoading } = useLoading(); // Access loading context
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState(null);
  const [editingSession, setEditingSession] = useState(null);
  const [newSessionName, setNewSessionName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessionIdToDelete, setSessionIdToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const sessionsPerPage = 4;
  const navigate = useNavigate();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setIsLoading(true); // 로딩 시작
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
    setIsLoading(false); // 로딩 끝
  };

  const handleDelete = async () => {
    setIsLoading(true); // 로딩 시작
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
    setIsLoading(false); // 로딩 끝
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
    setIsLoading(true); // 로딩 시작
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
    setIsLoading(false); // 로딩 끝
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
      <GlobalLoader /> {/* Global Loader */}
      <PageContainer>
        <Button onClick={() => navigate('/croptest')}>작물 조합 추가</Button>
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
                            <div>면적: {session.land_area}평</div>
                            <div>지역: {session.region}</div>
                            <div>총 소득: {session.total_income.toLocaleString()}원</div>
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