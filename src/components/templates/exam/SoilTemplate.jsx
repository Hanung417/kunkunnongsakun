import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { IoSearch } from 'react-icons/io5'; // Close icon and Search icon import
import Modal from 'react-modal'; // Modal 컴포넌트 불러오기
import { getCropNames, getSoilExamData, getSoilFertilizerInfo } from "../../../apis/predict";
import { useLoading } from "../../../LoadingContext"; // 로딩 훅 임포트
import CustomModal from '../../atoms/CustomModal'; // CustomModal 컴포넌트 임포트
import SoilResults from "./SoilResults";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  background-color: #f9f9f9;
  min-height: 100vh;
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

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 32px;
  color: #333;
  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 24px;
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
  height: 40px; // 높이 통일
  box-sizing: border-box;
  font-size: 16px;

  @media (max-width: 768px) {
    height: 36px; // 모바일에서 높이 통일
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
  height: 40px; // 높이 통일
  @media (max-width: 768px) {
    height: 36px; // 모바일에서 높이 통일
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
  height: 40px; // 높이 통일
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #3b8b6d;
  }

  @media (max-width: 768px) {
    height: 36px; // 모바일에서 높이 통일
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
  align-items: flex-start; // 왼쪽 정렬로 변경
  width: 100%;
  max-width: 400px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1;
  top: 70px;
  max-height: 200px; // 높이 제한 설정
  overflow-y: auto;

  // 스크롤바 스타일 커스터마이징
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  width: 100%;
  margin-top: 16px;
  @media (max-width: 768px) {
    margin-top: 12px;
  }
`;

const ExternalButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 400px;
  margin-top: 16px;
  @media (max-width: 768px) {
    margin-top: 12px;
  }
`;

const Divider = styled.hr`
  width: 100%;
  max-width: 600px;
  border: 1px solid #ccc;
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
    zIndex: 1102, // Ensure modal is above other elements
  },
  overlay: {
    zIndex: 1101, // Ensure overlay is above other elements
  }
};

const Button = styled.button`
  background-color: #4aaa87;
  color: white;
  padding: 1rem 2.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.2rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
  margin-top: 1rem;

  &:hover {
    background-color: #3b8b6d;
  }

  @media (max-width: 600px) {
    padding: 0.8rem 1.8rem;
    font-size: 1rem;
  }
`;

Modal.setAppElement('#root');

const SoilTemplate = () => {
  const { setIsLoading } = useLoading(); // 로딩 훅 사용
  const [cropName, setCropName] = useState('');
  const [address, setAddress] = useState('');
  const [soilData, setSoilData] = useState([]);
  const [selectedSample, setSelectedSample] = useState(null);
  const [fertilizerData, setFertilizerData] = useState(null);
  const [cropNames, setCropNames] = useState([]);
  const [filteredCropNames, setFilteredCropNames] = useState([]);
  const [showCropList, setShowCropList] = useState(false);
  const [error, setError] = useState(null);
  const [errorModalIsOpen, setErrorModalIsOpen] = useState(false); // 에러 모달 상태 추가
  const [analysisDone, setAnalysisDone] = useState(false); // 분석 완료 상태 추가
  const navigate = useNavigate(); // 네비게이트 추가

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
      setIsLoading(true); // 로딩 시작
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
      setAnalysisDone(true); // 분석 완료 상태 설정
    } catch (err) {
      setError(err.response.data.error);
      setErrorModalIsOpen(true); // 에러 모달 오픈
      setFertilizerData(null);
    } finally {
      setIsLoading(false); // 로딩 끝
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
        setErrorModalIsOpen(true); // 에러 모달 오픈
      }
    };

    fetchData();
  }, []);

  const fetchSoilExamData = async () => {
    try {
      if (!cropNames.includes(cropName)) {
        setError('작물이름과 주소를 정확히 입력해 주세요.');
        setErrorModalIsOpen(true); // 에러 모달 오픈
        return;
      }

      setIsLoading(true); // 로딩 시작
      const response = await getSoilExamData(cropName, address);
      if (response.data.soil_data.length === 0) {
        setError('현재 주소에 해당하는 데이터가 없습니다.');
        setErrorModalIsOpen(true); // 에러 모달 오픈
        setSoilData([]);
        setSelectedSample(null);
        setFertilizerData(null);
        return;
      }
      setSoilData(response.data.soil_data);
      setSelectedSample(null); // 첫 번째 샘플 자동 선택 대신 null 설정
      setError(null);
    } catch (err) {
      setError('작물이름과 주소를 정확히 입력해 주세요.');
      setErrorModalIsOpen(true); // 에러 모달 오픈
      setSoilData([]);
    } finally {
      setIsLoading(false); // 로딩 끝
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
        <p style={{ color: '#7f8c8d', fontSize: '0.875rem', marginTop: '0.625rem' }}>작물 이름과 주소 (ㅇㅇ시 ㅇㅇ동)을 입력하세요</p>
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
        overlayStyles={{ zIndex: 1103 }} // Ensure overlay is above other elements
        contentStyles={{ zIndex: 1104 }} // Ensure modal content is above other elements
      />
      {selectedSample && fertilizerData && (
        <SoilResults
          cropName={cropName} // 작물 이름 전달
          selectedSoilSample={selectedSample}
          fertilizerData={fertilizerData}
          handleBackToList={handleBackToList}
        />
      )}
    </Container>
  );
};

export default SoilTemplate;