import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Modal from 'react-modal';
import { IoClose, IoSearch } from 'react-icons/io5'; // Close icon and Search icon import
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
  margin-bottom: 24px;
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

const AddressContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 36px;
`;

const AddressInput = styled(Input)`
  flex: 1;
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
  height: 36px; // 높이 통일
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

const InputContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;

  &:last-child {
    width: calc(100% - 110px); // Adjust to match the combined width of the AddressInput and SearchButton
  }
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
  align-items: center;
  width: 100%;
  max-width: 400px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  position: absolute;
  z-index: 1;
  top: 40px;
  max-height: 200px;
  overflow-y: auto;
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

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
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
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedSoilSample, setSelectedSoilSample] = useState(null);
  const [isFetching, setIsFetching] = useState(false); // 상태 추가
  const [analysisDone, setAnalysisDone] = useState(false); // 분석 완료 상태 추가
  const [errorModalIsOpen, setErrorModalIsOpen] = useState(false); // 에러 모달 상태 추가
  const navigate = useNavigate(); // 네비게이트 추가

  const inputRef = useRef(null);

  const handleCropNameChange = (e) => {
    const value = e.target.value;
    setCropName(value);
    setFilteredCropNames(cropNames.filter(crop => crop.toLowerCase().includes(value.toLowerCase())));
    setShowCropList(true);
  };

  const handleAddressChange = (e) => setAddress(e.target.value);
  const handleSampleChange = (e) => {
    setSelectedSample(e.target.value);
    setSelectedSoilSample(soilData.find(sample => sample.No === e.target.value));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCropNames();
        setCropNames(response.data.crop_names);
        setFilteredCropNames(response.data.crop_names);
      } catch (err) {
        setError('작물 이름을 불러오는 중 오류가 발생했습니다.');
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
        setSelectedSoilSample(null);
        setModalIsOpen(false);
        return;
      }
      setSoilData(response.data.soil_data);
      setSelectedSample(null);
      setFertilizerData(null);
      setSelectedSoilSample(null);
      setError(null);
      setModalIsOpen(true);
    } catch (err) {
      setError('작물이름과 주소를 정확히 입력해 주세요.');
      setErrorModalIsOpen(true); // 에러 모달 오픈
      setSoilData([]);
    } finally {
      setIsLoading(false); // 로딩 끝
    }
  };

  const fetchFertilizerData = async () => {
    if (!selectedSample) {
      setError('먼저 토양 샘플을 선택하세요.');
      setErrorModalIsOpen(true); // 에러 모달 오픈
      return;
    }

    if (isFetching) {
      return; // 이미 fetching 중이라면 아무것도 하지 않음
    }

    setIsFetching(true); // 비활성화 시작

    const latestSoilSample = soilData.find(sample => sample.No === selectedSample);
    const sanitizedSample = {
      ...latestSoilSample,
      ACID: latestSoilSample.ACID ?? 0,
      OM: latestSoilSample.OM ?? 0,
      VLDPHA: latestSoilSample.VLDPHA ?? 0,
      POSIFERT_K: latestSoilSample.POSIFERT_K ?? 0,
      POSIFERT_CA: latestSoilSample.POSIFERT_CA ?? 0,
      POSIFERT_MG: latestSoilSample.POSIFERT_MG ?? 0,
      VLDSIA: latestSoilSample.VLDSIA ?? 0,
      SELC: latestSoilSample.SELC ?? 0
    };

    try {
      setIsLoading(true); // 로딩 시작
      const response = await getSoilFertilizerInfo({
        crop_code: cropName,
        address: address,
        acid: sanitizedSample.ACID,
        om: sanitizedSample.OM,
        vldpha: sanitizedSample.VLDPHA,
        posifert_K: sanitizedSample.POSIFERT_K,
        posifert_Ca: sanitizedSample.POSIFERT_CA,
        posifert_Mg: sanitizedSample.POSIFERT_MG,
        vldsia: sanitizedSample.VLDSIA,
        selc: sanitizedSample.SELC,
        PNU_Nm: sanitizedSample.PNU_Nm
      });
      setFertilizerData(response.data.data);
      setSelectedSoilSample(sanitizedSample);
      setError(null);
      setModalIsOpen(false);
      setAnalysisDone(true); // 분석 완료 상태 설정
    } catch (err) {
      setError(err.response.data.error);
      setErrorModalIsOpen(true); // 에러 모달 오픈
      setFertilizerData(null);
    } finally {
      setIsLoading(false); // 로딩 끝
      setIsFetching(false); // 비활성화 종료
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

  const handleModalKeyDown = (e) => {
    if (e.key === 'Enter') {
      fetchFertilizerData();
    }
  };

  return (
    <Container>
      <BoxContainer>
        <Title>토양 분석</Title>
        <InputContainer ref={inputRef}>
          <InputLabel>작물 이름</InputLabel>
          <Input
            type="text"
            value={cropName}
            onChange={handleCropNameChange}
            onClick={handleCropNameClick}
            onKeyDown={handleKeyDown}
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
      </BoxContainer>
      <Divider />
      {!analysisDone && (
        <ExternalButtonContainer>
          <Button onClick={handleBackToList}>목록으로 돌아가기</Button>
        </ExternalButtonContainer>
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Soil Samples Modal"
      >
        <ModalHeader>
          <h2>상세 주소</h2>
          <IoClose size={24} onClick={closeModal} style={{ cursor: 'pointer' }} />
        </ModalHeader>
        <ModalContent>
          <Select onChange={handleSampleChange} onKeyDown={handleModalKeyDown}>
            <option value="">선택</option>
            {soilData.map(sample => (
              <option key={sample.No} value={sample.No}>
                {sample.PNU_Nm}
              </option>
            ))}
          </Select>
          <Button onClick={fetchFertilizerData} disabled={isFetching || !selectedSample}>분석하기</Button>
        </ModalContent>
      </Modal>
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
      {selectedSoilSample && fertilizerData && (
        <SoilResults
          cropName={cropName} // 작물 이름 전달
          selectedSoilSample={selectedSoilSample}
          fertilizerData={fertilizerData}
          handleBackToList={handleBackToList}
        />
      )}
    </Container>
  );
};

export default SoilTemplate;