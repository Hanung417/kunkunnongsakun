import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { getCropNames, predictCrops, getRegionNames } from "../../../apis/crop";
import { useLoading } from "../../../LoadingContext";
import CustomModal from "../../atoms/CustomModal";
import { FaPlus, FaTrash } from 'react-icons/fa';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
  padding: 20px;
`;

const Title = styled.h1`
  margin-bottom: 30px;
  color: #2c3e50;
  font-size: 2rem;
  font-weight: bold;
`;

const InputContainer = styled.div`
  background-color: #ffffff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  position: relative;
  box-sizing: border-box;
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-size: 1rem;
  color: #2c3e50;
  margin-bottom: 5px;
  display: block;
`;

const InputRow = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  width: 100%;
`;

const Input = styled.input`
  padding: 15px;
  width: 100%;
  border: 1px solid #dfe6e9;
  border-radius: 8px;
  box-sizing: border-box;
  font-size: 1rem;
  transition: border-color 0.3s;
  margin-bottom: 20px;

  &:focus {
    border-color: #4aaa87;
    outline: none;
  }
`;

const SmallInput = styled(Input)`
  width: calc(50% - 5px); /* 각 입력 박스의 크기를 줄입니다 */
`;

const AddButton = styled.button`
  padding: 15px;
  background-color: #4aaa87;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  margin-left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;

  &:hover {
    background-color: #6dc4b0;
  }
`;

const Button = styled.button`
  padding: 15px 20px;
  margin-top: 15px;
  background-color: #4aaa87;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s;
  width: 100%;

  &:hover {
    background-color: #6dc4b0;
  }
`;

const CropContainer = styled.div`
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 20px;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  width: 100%;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background-color: #ffffff;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: absolute;
  z-index: 1;
  top: 100%;
  max-height: 200px;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ListItem = styled.div`
  padding: 12px;
  width: 100%;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f1f1f1;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #ccc;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const SummaryContainer = styled.div`
  background-color: #ffffff;
  padding: 20px;
  border-radius: 12px;
  margin-top: 30px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const SummaryTitle = styled.h2`
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 20px;
  font-weight: bold;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const ItemText = styled.div`
  display: flex;
  flex-direction: column;
`;

const CropName = styled.p`
  font-size: 1rem;
  color: #2c3e50;
  margin: 0;
`;

const CropRatio = styled.p`
  font-size: 0.875rem;
  color: #7f8c8d;
  margin: 0;
`;

const RemoveButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  padding: 10px 15px;
  transition: background-color 0.3s;
  white-space: nowrap; /* 텍스트를 가로로 출력되도록 합니다 */

  &:hover {
    background-color: #c0392b;
  }
`;

const CropTest = () => {
  const { setIsLoading } = useLoading();
  const [landArea, setLandArea] = useState("");
  const [region, setRegion] = useState("");
  const [currentCrop, setCurrentCrop] = useState({ name: "", ratio: "" });
  const [crops, setCrops] = useState([]);
  const [cropNames, setCropNames] = useState([]);
  const [regions, setRegions] = useState([]);
  const [filteredCropNames, setFilteredCropNames] = useState([]);
  const [showCropList, setShowCropList] = useState(false);
  const [showRegionList, setShowRegionList] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  const regionRef = useRef(null);
  const cropNameRef = useRef(null);

  useEffect(() => {
    const fetchCropNames = async () => {
      try {
        const response = await getCropNames();
        setCropNames(response.data.crop_names);
        setFilteredCropNames(response.data.crop_names);
      } catch (err) {
        setModalContent('작물 이름을 불러오는 중 오류가 발생했습니다.');
        setModalTitle('오류');
        setIsError(true);
        setIsModalOpen(true);
      }
    };

    const fetchRegionNames = async () => {
      try {
        const response = await getRegionNames();
        setRegions(response.data.region_names);
      } catch (err) {
        console.error('Error fetching region names:', err);
        setModalContent('지역 이름을 불러오는 중 오류가 발생했습니다.');
        setModalTitle('오류');
        setIsError(true);
        setIsModalOpen(true);
      }
    };
    fetchRegionNames();
    fetchCropNames();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentCrop({ ...currentCrop, [name]: value });

    if (name === 'name') {
      setFilteredCropNames(cropNames.filter(crop => crop.toLowerCase().includes(value.toLowerCase())));
      setShowCropList(true);
    }
  };

  const handleCropSelect = (crop) => {
    setCurrentCrop({ ...currentCrop, name: crop });
    setShowCropList(false);
  };

  const addCrop = () => {
    if (currentCrop.name && currentCrop.ratio) {
      setCrops([...crops, currentCrop]);
      setCurrentCrop({ name: "", ratio: "" });
    }
  };

  const removeCrop = (index) => {
    const newCrops = crops.filter((_, i) => i !== index);
    setCrops(newCrops);
  };

  const validateInput = () => {
    const newErrors = [];
    if (!landArea || landArea.trim() === "") {
      newErrors.push("평수를 입력해주세요. ");
    }
    if (!region || region.trim() === "") {
      newErrors.push("지역을 입력해주세요. ");
    }
    if (crops.length === 0) {
      newErrors.push("작물을 하나 이상 추가해주세요.");
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const inputErrors = validateInput();
    if (inputErrors.length > 0) {
      setModalContent(inputErrors.join("\n"));
      setModalTitle('오류');
      setIsError(true);
      setIsModalOpen(true);
      return;
    }

    try {
      setIsLoading(true); // 로딩 시작
      const session_id = `session_${Date.now()}`;
      const response = await predictCrops({
        land_area: landArea,
        crop_names: crops.map(crop => crop.name),
        crop_ratios: crops.map(crop => crop.ratio),
        region: region,
        session_id: session_id,
      });

      if (response.data.error) {
        const errorMessage = String(response.data.error) === "0"
          ? '해당지역의 도매시장에서 판매하지 않는 작물입니다'
          : response.data.error;
          setModalContent(errorMessage);
          setModalTitle('오류');
          setIsError(true);
          setIsModalOpen(true);
      } else {
        navigate('/sessiondetails', { state: { landArea, cropNames: crops.map(crop => crop.name), result: response.data, session_id } });
      }
    } catch (error) {
      console.error('Error fetching prediction', error);
      setModalContent(error.response && error.response.data && error.response.data.error
        ? error.response.data.error
        : 'Error fetching prediction');
      setModalTitle('오류');
      setIsError(true);
      setIsModalOpen(true);
    } finally {
      setIsLoading(false); // 로딩 끝
    }
  };

  const handleRegionSelect = (region) => {
    setRegion(region);
    setShowRegionList(false);
  };

  const handleClickOutside = useCallback((event) => {
    if (regionRef.current && !regionRef.current.contains(event.target)) {
      setShowRegionList(false);
    }
    if (cropNameRef.current && !cropNameRef.current.contains(event.target)) {
      setShowCropList(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <PageContainer>
      <InputContainer>
        <Label>재배 면적 (평)</Label>
        <Input
          type="text"
          placeholder="재배 면적 (평)"
          value={landArea}
          onChange={(e) => setLandArea(e.target.value)}
        />
        <Label>지역 선택</Label>
        <div style={{ position: 'relative' }} ref={regionRef}>
          <Input
            type="text"
            placeholder="지역 선택"
            value={region}
            onClick={() => setShowRegionList(!showRegionList)}
            readOnly
          />
          {showRegionList && (
            <List>
              {regions.map((region, index) => (
                <ListItem key={index} onClick={() => handleRegionSelect(region)}>
                  {region}
                </ListItem>
              ))}
            </List>
          )}
        </div>
        <Label>작물</Label>
        <CropContainer ref={cropNameRef}>
          <InputRow>
            <SmallInput
              type="text"
              name="name"
              placeholder="작물 검색"
              value={currentCrop.name}
              onChange={handleInputChange}
              onClick={() => setShowCropList(true)}
            />
          </InputRow>
          <Label>작물별 비율</Label>
          <InputRow>
            <SmallInput
              type="text"
              name="ratio"
              placeholder="작물별 비율"
              value={currentCrop.ratio}
              onChange={handleInputChange}
            />
            <AddButton onClick={addCrop}><FaPlus /></AddButton>
          </InputRow>
          {showCropList && filteredCropNames.length > 0 && (
            <List>
              {filteredCropNames.map((cropName, idx) => (
                <ListItem key={idx} onClick={() => handleCropSelect(cropName)}>
                  {cropName}
                </ListItem>
              ))}
            </List>
          )}
        </CropContainer>
      </InputContainer>
      <SummaryContainer>
        <SummaryTitle>선택한 정보</SummaryTitle>
        <SummaryItem>
          <ItemText>
            <CropName>재배 면적: {landArea} 평</CropName>
          </ItemText>
        </SummaryItem>
        <SummaryItem>
          <ItemText>
            <CropName>지역: {region}</CropName>
          </ItemText>
        </SummaryItem>
        {crops.map((crop, index) => (
          <SummaryItem key={index}>
            <ItemText>
              <CropName>작물: {crop.name}</CropName>
              <CropRatio>비율: {crop.ratio}</CropRatio>
            </ItemText>
            <RemoveButton onClick={() => removeCrop(index)}><FaTrash /></RemoveButton>
          </SummaryItem>
        ))}
        <Button onClick={handleSubmit}>제출</Button>
      </SummaryContainer>
      <CustomModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        title={modalTitle}
        content={modalContent}
        showConfirmButton={false}
        isError={isError}
      />
    </PageContainer>
  );
};

export default CropTest;