import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';
import Modal from 'react-modal';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background-color: #f9f9f9;
  height: 100%;
`;

const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background-color: #4aaa87;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 1.3rem;
  margin: 0;

  @media (max-width: 600px) {
    font-size: 1rem;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  margin-top: 30px;
`;

const SessionList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SessionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const SessionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  @media (max-width: 600px) {
    gap: 2px;
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

  @media (max-width: 600px) {
    align-self: flex-end;
  }
`;

const AddButton = styled.button`
  background-color: #4aaa87;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.3em;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 20px;

  &:hover {
    background-color: #3b8b6d;
  }

  @media (max-width: 600px) {
    padding: 8px 16px;
    font-size: 1em;
  }
`;

const ModalContent = styled.div`
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  width: 100%;
  max-width: 100%;
  overflow-y: auto;

  @media (max-width: 600px) {
    padding: 10px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #aaa;

  &:hover {
    color: #000;
  }
`;

const RecommendationContainer = styled.div`
  margin-top: 20px;
  width: 100%;
  max-width: 600px;

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const RecommendationTitle = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 10px;

  @media (max-width: 600px) {
    font-size: 1rem;
    margin-bottom: 5px;
  }
`;

const TableContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-start;
  width: 100%;

  @media (max-width: 600px) {
    margin-bottom: 10px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  border: 1px solid #ccc;
  padding: 8px;
  background-color: #f2f2f2;

  @media (max-width: 600px) {
    padding: 4px;
    font-size: 0.8rem;
  }
`;

const TableData = styled.td`
  border: 1px solid #ccc;
  padding: 8px;

  @media (max-width: 600px) {
    padding: 4px;
    font-size: 0.8rem;
  }
`;

const formatValue = (value) => {
  const parsedValue = parseFloat(value);
  return isNaN(parsedValue) ? 'N/A' : (parsedValue % 1 ? parsedValue.toFixed(2) : parsedValue.toString());
};

const SoilListTemplate = () => {
  const [soilData, setSoilData] = useState([]);
  const [selectedSoilData, setSelectedSoilData] = useState(null);
  const [fertilizerData, setFertilizerData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSoilData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/soil/crop_data/', {
          withCredentials: true,
        });
        setSoilData(response.data);
      } catch (error) {
        console.error('Failed to fetch soil data', error);
      }
    };

    fetchSoilData();
  }, []);

  const handleSoilDataClick = (sessionId) => {
    const selectedSession = soilData.find((session) => session.session_id === sessionId);
    if (selectedSession) {
      setSelectedSoilData(selectedSession.soil_data);
      setFertilizerData(selectedSession.fertilizer_data);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getCSRFToken = () => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, 10) === 'csrftoken=') {
          cookieValue = decodeURIComponent(cookie.substring(10));
          break;
        }
      }
    }
    return cookieValue;
  };

  const handleDeleteSoilData = async (sessionId) => {
    const csrfToken = getCSRFToken(); // CSRF 토큰 가져오기
    try {
      await axios.delete(`http://localhost:8000/soil/delete_soil_data/${sessionId}/`, {
        headers: {
          'X-CSRFToken': csrfToken
        },
        withCredentials: true,
      });
      setSoilData(soilData.filter(soil => soil.session_id !== sessionId));
    } catch (error) {
      console.error('Failed to delete soil data', error);
    }
  };

  const handleAddClick = () => {
    navigate('/soil'); // '/soil' 경로로 이동
  };

  // 데이터를 세션 ID별로 그룹화
  const groupedData = soilData.reduce((acc, item) => {
    if (!acc[item.session_id]) {
      acc[item.session_id] = [];
    }
    acc[item.session_id].push(item);
    return acc;
  }, {});

  return (
    <PageContainer>
      <HeaderContainer>
        <Title>토양 데이터 목록</Title>
      </HeaderContainer>
      <Content>
        <SessionList>
          {Object.keys(groupedData).map(sessionId => (
            <SessionItem key={sessionId} onClick={() => handleSoilDataClick(sessionId)}>
              <SessionInfo>
                {groupedData[sessionId].map(soil => (
                  <div key={soil.id}>
                    <div>Crop Name: {soil.crop_name}</div>
                    <div>Address: {soil.address}</div>
                    <div>Detailed Address: {soil.detailed_address}</div>
                    <div>Created At: {soil.created_at}</div>
                  </div>
                ))}
              </SessionInfo>
              <DeleteButton onClick={(e) => {
                e.stopPropagation();
                handleDeleteSoilData(sessionId);
              }}>
                <FaTrash />
              </DeleteButton>
            </SessionItem>
          ))}
        </SessionList>
        <AddButton onClick={handleAddClick}>새 토양 데이터 추가</AddButton>
      </Content>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Soil Data Modal"
        ariaHideApp={false}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxWidth: '400px',
            borderRadius: '10px',
            padding: '20px',
            maxHeight: '80vh',
            overflow: 'hidden',
          },
        }}
      >
        {selectedSoilData && (
          <ModalContent>
            <CloseButton onClick={closeModal}>&times;</CloseButton>
            <RecommendationContainer>
              <RecommendationTitle>토양 분석 데이터</RecommendationTitle>
              <TableContainer>
                <Table>
                  <thead>
                    <tr>
                      <TableHeader>항목</TableHeader>
                      <TableHeader>값</TableHeader>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <TableData>산도(ACID)</TableData>
                      <TableData>{formatValue(selectedSoilData.acid)} (pH)</TableData>
                    </tr>
                    <tr>
                      <TableData>유기물(OM)</TableData>
                      <TableData>{formatValue(selectedSoilData.om)} (g/kg)</TableData>
                    </tr>
                    <tr>
                      <TableData>인산(VLDPHA)</TableData>
                      <TableData>{formatValue(selectedSoilData.vldpha)} (mg/kg)</TableData>
                    </tr>
                    <tr>
                      <TableData>칼륨(K)</TableData>
                      <TableData>{formatValue(selectedSoilData.posifert_K)} (cmol+/kg)</TableData>
                    </tr>
                    <tr>
                      <TableData>칼슘(Ca)</TableData>
                      <TableData>{formatValue(selectedSoilData.posifert_Ca)} (cmol+/kg)</TableData>
                    </tr>
                    <tr>
                      <TableData>마그네슘(Mg)</TableData>
                      <TableData>{formatValue(selectedSoilData.posifert_Mg)} (cmol+/kg)</TableData>
                    </tr>
                    <tr>
                      <TableData>규산(VLDSIA)</TableData>
                      <TableData>{formatValue(selectedSoilData.vldsia)} (mg/kg)</TableData>
                    </tr>
                    <tr>
                      <TableData>전기전도도(SELC)</TableData>
                      <TableData>{formatValue(selectedSoilData.selc)} (dS/m)</TableData>
                    </tr>
                  </tbody>
                </Table>
              </TableContainer>
              <RecommendationTitle>비료 추천 데이터</RecommendationTitle>
              <TableContainer>
                <Table>
                  <thead>
                    <tr>
                      <TableHeader>항목</TableHeader>
                      <TableHeader>값</TableHeader>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <TableData>밑거름_질소 처방량</TableData>
                      <TableData>{fertilizerData.pre_Fert_N} (kg/10a)</TableData>
                    </tr>
                    <tr>
                      <TableData>밑거름_인산 처방량</TableData>
                      <TableData>{fertilizerData.pre_Fert_P} (kg/10a)</TableData>
                    </tr>
                    <tr>
                      <TableData>밑거름_칼리 처방량</TableData>
                      <TableData>{fertilizerData.pre_Fert_K} (kg/10a)</TableData>
                    </tr>
                    <tr>
                      <TableData>웃거름_질소 처방량</TableData>
                      <TableData>{fertilizerData.post_Fert_N} (kg/10a)</TableData>
                    </tr>
                    <tr>
                      <TableData>웃거름_인산 처방량</TableData>
                      <TableData>{fertilizerData.post_Fert_P} (kg/10a)</TableData>
                    </tr>
                    <tr>
                      <TableData>웃거름_칼리 처방량</TableData>
                      <TableData>{fertilizerData.post_Fert_K} (kg/10a)</TableData>
                    </tr>
                    <tr>
                      <TableData>우분퇴비 처방량</TableData>
                      <TableData>{fertilizerData.pre_Compost_Cattl} (kg/10a)</TableData>
                    </tr>
                    <tr>
                      <TableData>돈분퇴비 처방량</TableData>
                      <TableData>{fertilizerData.pre_Compost_Pig} (kg/10a)</TableData>
                    </tr>
                    <tr>
                      <TableData>계분퇴비 처방량</TableData>
                      <TableData>{fertilizerData.pre_Compost_Chick} (kg/10a)</TableData>
                    </tr>
                    <tr>
                      <TableData>혼합퇴비 처방량</TableData>
                      <TableData>{fertilizerData.pre_Compost_Mix} (kg/10a)</TableData>
                    </tr>
                  </tbody>
                </Table>
              </TableContainer>
            </RecommendationContainer>
          </ModalContent>
        )}
      </Modal>
    </PageContainer>
  );
};

export default SoilListTemplate;
