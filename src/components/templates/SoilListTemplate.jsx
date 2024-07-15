// SoilListTemplate.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaTrash } from 'react-icons/fa';
import CustomModal from '../atoms/DeleteModal';
import { getSoilCropData, deleteSoilData } from "../../apis/predict";

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

const SoilListTemplate = () => {
  const [soilData, setSoilData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getSoilCropData();
        setSoilData(response.data);
      } catch (error) {
        console.error('Failed to fetch soil data', error);
      }
    };

    fetchData();
  }, []);

  const handleSoilDataClick = (data) => {
    navigate('/soil_details', { state: { soilData: data.soil_data, fertilizerData: data.fertilizer_data, crop: data.crop_name } });
  };

  const handleDeleteSoilData = async () => {
    try {
      await deleteSoilData(selectedSessionId);
      setSoilData(soilData.filter(soil => soil.session_id !== selectedSessionId));
      closeModal();
    } catch (error) {
      console.error('Failed to delete soil data', error);
    }
  };

  const openModal = (sessionId) => {
    setSelectedSessionId(sessionId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSessionId(null);
  };

  const handleAddClick = () => {
    navigate('/soil'); // '/soil' 경로로 이동
  };

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
            <SessionItem key={sessionId} onClick={() => handleSoilDataClick(groupedData[sessionId][0])}>
              <SessionInfo>
                {groupedData[sessionId].map(soil => (
                  <div key={soil.id}>
                    <div>작물 이름 : {soil.crop_name}</div>
                    <div>주소 : {soil.address}</div>
                    <div>상세 주소 : {soil.detailed_address}</div>
                    <div>시간 : {soil.created_at}</div>
                  </div>
                ))}
              </SessionInfo>
              <DeleteButton onClick={(e) => {
                e.stopPropagation();
                openModal(sessionId);
              }}>
                <FaTrash />
              </DeleteButton>
            </SessionItem>
          ))}
        </SessionList>
        <AddButton onClick={handleAddClick}>새 토양 데이터 추가</AddButton>
      </Content>
      <CustomModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        title="삭제 확인"
        content="정말로 이 토양 데이터를 삭제하시겠습니까?"
        onConfirm={handleDeleteSoilData}
        closeModal={closeModal}
      />
    </PageContainer>
  );
};

export default SoilListTemplate;