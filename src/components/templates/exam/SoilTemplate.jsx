import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { IoSearch } from 'react-icons/io5';
import Modal from 'react-modal';
import { getCropNames, getSoilExamData, getSoilFertilizerInfo } from "../../../apis/predict";
import { useLoading } from "../../../LoadingContext";
import CustomModal from '../../atoms/CustomModal';
import SoilResults from "./SoilResults";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  background-color: #f9f9f9;
  min-height: 160vh;
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const BoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const InputLabel = styled.label`
  font-size: 16px;
  margin-bottom: 8px;
  color: #333;
  align-self: flex-start;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  height: 40px; 
  box-sizing: border-box;
  font-size: 16px;

  @media (max-width: 768px) {
    height: 36px; 
    font-size: 14px;
    padding: 6px;
  }
`;

const AddressContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
`;

const AddressInput = styled(Input)`
  width: calc(100% - 110px);
  height: 40px; 
  @media (max-width: 768px) {
    height: 36px; 
  }
`;

const SearchButton = styled.button`
  background-color: #4aaa87;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
  margin-left: 10px;
  height: 40px; 
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #3b8b6d;
  }

  @media (max-width: 768px) {
    height: 36px; 
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }

  svg {
    margin-left: 8px;
    font-size: 20px;
  }
`;

const InputContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
`;

const SearchIcon = styled(IoSearch)`
  font-size: 20px;
  color: whitesmoke;
  cursor: pointer;
`;

const Select = styled.select`
  padding: 8px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  max-width: 400px;
  box-sizing: border-box;
  font-size: 16px;
  @media (max-width: 768px) {
    font-size: 14px;
    padding: 6px;
  }
`;

const CropList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start; 
  width: 100%;
  max-width: 400px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1;
  top: 70px;
  max-height: 200px; 
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: #aaa;
  }
  &::-webkit-scrollbar-track {
    background-color: #f9f9f9;
  }
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

const Divider = styled.hr`
  width: 100%;
  max-width: 600px;
  border: 1px solid #ccc;
`;

const SoilTemplate = () => {
  const { setIsLoading } = useLoading();
  const [cropName, setCropName] = useState('');
  const [address, setAddress] = useState('');
  const [soilData, setSoilData] = useState([]);
  const [selectedSample, setSelectedSample] = useState(null);
  const [fertilizerData, setFertilizerData] = useState(null);
  const [cropNames, setCropNames] = useState([]);
  const [filteredCropNames, setFilteredCropNames] = useState([]);
  const [showCropList, setShowCropList] = useState(false);
  const [error, setError] = useState(null);
  const [errorModalIsOpen, setErrorModalIsOpen] = useState(false);
  const [analysisDone, setAnalysisDone] = useState(false);
  const navigate = useNavigate();

  const inputRef = useRef(null);

  const handleCropNameChange = (e) => {
    const value = e.target.value;
    setCropName(value);
    setFilteredCropNames(cropNames.filter(crop => crop.toLowerCase().includes(value.toLowerCase())));
    setShowCropList(true);
  };

  const handleAddressChange = (e) => setAddress(e.target.value);

  const handleSampleChange = async (e) => {
    const selectedSampleId = e.target.value;
    const selected = soilData.find(sample => sample.No === selectedSampleId);
    setSelectedSample(selected);

    try {
      setIsLoading(true);
      const response = await getSoilFertilizerInfo({
        crop_code: cropName,
        address: address,
        acid: selected.ACID ?? 0,
        om: selected.OM ?? 0,
        vldpha: selected.VLDPHA ?? 0,
        posifert_K: selected.POSIFERT_K ?? 0,
        posifert_Ca: selected.POSIFERT_CA ?? 0,
        posifert_Mg: selected.POSIFERT_MG ?? 0,
        vldsia: selected.VLDSIA ?? 0,
        selc: selected.SELC ?? 0,
        PNU_Nm: selected.PNU_Nm
      });
      setFertilizerData(response.data.data);
      setError(null);
      setAnalysisDone(true);
    } catch (err) {
      setError(err.response.data.error);
      setErrorModalIsOpen(true);
      setFertilizerData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCropNames();
        setCropNames(response.data.crop_names);
        setFilteredCropNames(response.data.crop_names);
      } catch (err) {
        setError('작물 이름을 불러오는 중 오류가 발생했습니다.');
        setErrorModalIsOpen(true);
      }
    };

    fetchData();
  }, []);

  const fetchSoilExamData = async () => {
    try {
      if (!cropNames.includes(cropName)) {
        setError('작물이름과 주소를 정확히 입력해 주세요.');
        setErrorModalIsOpen(true);
        return;
      }

      setIsLoading(true);
      const response = await getSoilExamData(cropName, address);
      if (response.data.soil_data.length === 0) {
        setError('현재 주소에 해당하는 데이터가 없습니다.');
        setErrorModalIsOpen(true);
        setSoilData([]);
        setSelectedSample(null);
        setFertilizerData(null);
        return;
      }
      setSoilData(response.data.soil_data);
      setSelectedSample(null);
      setError(null);
    } catch (err) {
      setError('작물이름과 주소를 정확히 입력해 주세요.');
      setErrorModalIsOpen(true);
      setSoilData([]);
    } finally {
      setIsLoading(false);
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

  const closeErrorModal = () => {
    setErrorModalIsOpen(false);
  };

  const handleBackToList = () => {
    navigate('/soillist');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      fetchSoilExamData();
    }
  };

  return (
    <Container>
      <BoxContainer>
        <p style={{ color: '#7f8c8d', fontSize: '0.875rem', marginTop: '0.625rem' }}>토양 분석을 위한 작물 이름과 주소를 입력하세요</p>
        <InputContainer ref={inputRef}>
          <InputLabel>작물 이름</InputLabel>
          <Input
            type="text"
            value={cropName}
            onChange={handleCropNameChange}
            onClick={handleCropNameClick}
            onKeyDown={handleKeyDown}
            placeholder="작물 이름을 검색하세요"
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
          <InputLabel>주소</InputLabel>
          <p style={{ color: '#7f8c8d', fontSize: '0.875rem', marginTop: '0.5rem' }}>주소를 입력한 후 검색 버튼을 눌러주세요.</p>
          <AddressContainer>
            <AddressInput
              type="text"
              value={address}
              onChange={handleAddressChange}
              onKeyDown={handleKeyDown}
              placeholder="예) 광주광역시 수완동"
            />
            <SearchButton onClick={fetchSoilExamData}>주소 검색 <SearchIcon /></SearchButton>
          </AddressContainer>
          <p style={{ color: '#7f8c8d', fontSize: '0.875rem', marginTop: '0.5rem' }}>예시) 광주광역시 용전동, 전라남도 순천시 용당동</p>
        </InputContainer>
        {soilData.length > 0 && (
          <InputContainer>
            <InputLabel>상세 주소 선택</InputLabel>
            <Select onChange={handleSampleChange} defaultValue="">
              <option value="" disabled>선택하세요</option>
              {soilData.map(sample => (
                <option key={sample.No} value={sample.No}>
                  {sample.PNU_Nm}
                </option>
              ))}
            </Select>
          </InputContainer>
        )}
      </BoxContainer>
      <Divider />
      <CustomModal
        isOpen={errorModalIsOpen}
        onRequestClose={closeErrorModal}
        title="오류"
        content={error}
        onConfirm={closeErrorModal}
        showConfirmButton={false}
        isError={true}
        overlayStyles={{ zIndex: 1103 }}
        contentStyles={{ zIndex: 1104 }}
      />
      {selectedSample && fertilizerData && (
        <SoilResults
          cropName={cropName}
          selectedSoilSample={selectedSample}
          fertilizerData={fertilizerData}
          handleBackToList={handleBackToList}
        />
      )}
    </Container>
  );
};

export default SoilTemplate;