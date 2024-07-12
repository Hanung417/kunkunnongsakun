import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Modal from 'react-modal';

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

const BoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  width: 100%;
  max-width: 600px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 32px;
  color: #333;
`;

const InputContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  margin-bottom: 16px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
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
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  margin-bottom: 16px;
  margin-right: 8px;
`;

const ErrorMessage = styled.p`
  color: red;
  margin-bottom: 16px;
`;

const Select = styled.select`
  padding: 8px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  max-width: 400px;
  box-sizing: border-box;
`;

const CropList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  position: absolute;
  z-index: 1;
  top: 40px; /* Adjust this value if needed */
  max-height: 200px; /* Fixed height */
  overflow-y: auto; /* Enable vertical scrolling */
`;

const CropItem = styled.div`
  padding: 8px;
  width: 100%;
  text-align: center;
  cursor: pointer;
  &:hover {
    background-color: #f1f1f1;
  }
  &:not(:last-child) {
    border-bottom: 1px solid #ccc;
  }
`;

const RecommendationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  margin-top: 24px;
  background-color: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const RecommendationTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 16px;
  color: #333;
`;

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  margin-bottom: 16px;
`;

const TableHeader = styled.th`
  border: 1px solid #ccc;
  padding: 8px;
  background-color: #f1f1f1;
  width: 150px;
`;

const TableData = styled.td`
  border: 1px solid #ccc;
  padding: 8px;
  text-align: center;
  width: 150px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  max-width: 400px;
  margin-bottom: 16px;
`;

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: '600px',
    padding: '20px',
  },
};

Modal.setAppElement('#root');

const SoilTest = () => {
  const [cropName, setCropName] = useState('');
  const [address, setAddress] = useState('');
  const [soilData, setSoilData] = useState([]);
  const [selectedSample, setSelectedSample] = useState(null);
  const [fertilizerData, setFertilizerData] = useState(null);
  const [cropNames, setCropNames] = useState([]);
  const [filteredCropNames, setFilteredCropNames] = useState([]);
  const [showCropList, setShowCropList] = useState(false);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const inputRef = useRef(null);

  const handleCropNameChange = (e) => {
    const value = e.target.value;
    setCropName(value);
    setFilteredCropNames(cropNames.filter(crop => crop.toLowerCase().includes(value.toLowerCase())));
    setShowCropList(true);
  };

  const handleAddressChange = (e) => setAddress(e.target.value);
  const handleSampleChange = (e) => setSelectedSample(e.target.value);

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

  const fetchCropNames = async () => {
    try {
      const response = await axios.get('http://localhost:8000/soil/get-crop-names/');
      setCropNames(response.data.crop_names);
      setFilteredCropNames(response.data.crop_names); // 초기값 설정
    } catch (err) {
      setError('작물 이름을 불러오는 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    fetchCropNames();
  }, []);

  const fetchSoilExamData = async () => {
    const csrfToken = getCSRFToken();
    try {
      const response = await axios.post('http://localhost:8000/soil/soil_exam/',
        JSON.stringify({ crop_name: cropName, address }),
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
          withCredentials: true,
        }
      );
      setSoilData(response.data.soil_data);
      setSelectedSample(null); // Reset selected sample
      setError(null);
      setModalIsOpen(true); // Show modal when soil data is fetched
    } catch (err) {
      setError(err.response.data.error);
      setSoilData([]);
    }
  };

  const fetchFertilizerData = async () => {
    if (!selectedSample) {
      setError('먼저 토양 샘플을 선택하세요.');
      return;
    }

    const latestSoilSample = soilData.find(sample => sample.No === selectedSample); // 선택된 토양 샘플 데이터를 사용
    const csrfToken = getCSRFToken();
    try {
      const response = await axios.post('http://localhost:8000/soil/get-soil-fertilizer-info/',
        JSON.stringify({
          crop_code: cropName,
          acid: latestSoilSample.ACID,
          om: latestSoilSample.OM,
          vldpha: latestSoilSample.VLDPHA,
          posifert_K: latestSoilSample.POSIFERT_K,
          posifert_Ca: latestSoilSample.POSIFERT_CA,
          posifert_Mg: latestSoilSample.POSIFERT_MG,
          vldsia: latestSoilSample.VLDSIA,
          selc: latestSoilSample.SELC
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
          withCredentials: true,
        }
      );
      setFertilizerData(response.data.data);
      setError(null);
      setModalIsOpen(false); // Close modal when analysis is done
    } catch (err) {
      setError(err.response.data.error);
      setFertilizerData(null);
    }
  };

  const handleCropNameClick = () => {
    setShowCropList(true);
  };

  const handleCropSelect = (crop) => {
    setCropName(crop);
    setShowCropList(false);
  };

  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setShowCropList(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <Container>
      <BoxContainer>
        <Title>토양 분석</Title>
        <InputContainer ref={inputRef}>
          <Input
            type="text"
            value={cropName}
            onChange={handleCropNameChange}
            onClick={handleCropNameClick}
            placeholder="작물 이름"
          />
          {showCropList && filteredCropNames.length > 0 && (
            <CropList>
              {filteredCropNames.map((crop, index) => (
                <CropItem key={index} onClick={() => handleCropSelect(crop)}>
                  {crop}
                </CropItem>
              ))}
            </CropList>
          )}
        </InputContainer>
        <InputContainer>
          <Input type="text" value={address} onChange={handleAddressChange} placeholder="주소" />
        </InputContainer>
        <Button onClick={fetchSoilExamData}>주소 검색</Button>
      </BoxContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Soil Samples Modal"
      >
        <h2>상세 주소</h2>
        <Select onChange={handleSampleChange}>
          <option value="">선택</option>
          {soilData.map(sample => (
            <option key={sample.No} value={sample.No}>
              {sample.PNU_Nm}
            </option>
          ))}
        </Select>
        <ButtonContainer>
          <Button onClick={fetchFertilizerData} disabled={!selectedSample}>분석하기</Button>
          <Button onClick={closeModal}>닫기</Button>
        </ButtonContainer>
      </Modal>
      {fertilizerData && (
        <RecommendationContainer>
          <RecommendationTitle>비료 추천 데이터</RecommendationTitle>
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <TableHeader>항목</TableHeader>
                  {fertilizerData.map((item, index) => (
                    <TableHeader key={index}>{item.crop_Nm}</TableHeader>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <TableData>밑거름_질소 처방량(kg/10a)</TableData>
                  {fertilizerData.map((item, index) => (
                    <TableData key={index}>{item.pre_Fert_N}</TableData>
                  ))}
                </tr>
                <tr>
                  <TableData>밑거름_인산 처방량(kg/10a)</TableData>
                  {fertilizerData.map((item, index) => (
                    <TableData key={index}>{item.pre_Fert_P}</TableData>
                  ))}
                </tr>
                <tr>
                  <TableData>밑거름_칼리 처방량(kg/10a)</TableData>
                  {fertilizerData.map((item, index) => (
                    <TableData key={index}>{item.pre_Fert_K}</TableData>
                  ))}
                </tr>
                <tr>
                  <TableData>웃거름_질소 처방량(kg/10a)</TableData>
                  {fertilizerData.map((item, index) => (
                    <TableData key={index}>{item.post_Fert_N}</TableData>
                  ))}
                </tr>
                <tr>
                  <TableData>웃거름_인산 처방량(kg/10a)</TableData>
                  {fertilizerData.map((item, index) => (
                    <TableData key={index}>{item.post_Fert_P}</TableData>
                  ))}
                </tr>
                <tr>
                  <TableData>웃거름_칼리 처방량(kg/10a)</TableData>
                  {fertilizerData.map((item, index) => (
                    <TableData key={index}>{item.post_Fert_K}</TableData>
                  ))}
                </tr>
                <tr>
                  <TableData>우분퇴비 처방량(kg/10a)</TableData>
                  {fertilizerData.map((item, index) => (
                    <TableData key={index}>{item.pre_Compost_Cattl}</TableData>
                  ))}
                </tr>
                <tr>
                  <TableData>돈분퇴비 처방량(kg/10a)</TableData>
                  {fertilizerData.map((item, index) => (
                    <TableData key={index}>{item.pre_Compost_Pig}</TableData>
                  ))}
                </tr>
                <tr>
                  <TableData>계분퇴비 처방량(kg/10a)</TableData>
                  {fertilizerData.map((item, index) => (
                    <TableData key={index}>{item.pre_Compost_Chick}</TableData>
                  ))}
                </tr>
                <tr>
                  <TableData>혼합퇴비 처방량(kg/10a)</TableData>
                  {fertilizerData.map((item, index) => (
                    <TableData key={index}>{item.pre_Compost_Mix}</TableData>
                  ))}
                </tr>
              </tbody>
            </Table>
          </TableContainer>
        </RecommendationContainer>
      )}
    </Container>
  );
};

export default SoilTest;
