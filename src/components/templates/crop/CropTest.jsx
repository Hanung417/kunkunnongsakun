import React, { useState, useEffect, useRef, useCallback } from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { getCropNames, predictCrops, getRegionNames } from "../../../apis/crop";
import { useLoading } from "../../../LoadingContext";
import CustomModal from "../../atoms/CustomModal";
import GlobalLoader from "../../atoms/GlobalLoader";
import { FaPlus, FaTrash } from 'react-icons/fa';
import {
  PageContainer,
  Title,
  InputContainer,
  Label,
  InputRow,
  Input,
  SmallInput,
  AddButton,
  Button,
  CropContainer,
  SummaryContainer,
  SummaryTitle,
  SummaryItem,
  ItemText,
  List,
  ListItem,
  CropName,
  CropRatio,
  RemoveButton,
  ErrorMessage,
  StepTitle,
  RemoveIcon,
} from '../../../styles/CropTest';

const CropTest = () => {
  const { setIsLoading, isLoading } = useLoading();
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
  const [addError, setAddError] = useState("");
  const [selectKey, setSelectKey] = useState(0); // 추가된 key state
  const navigate = useNavigate();
  const regionRef = useRef(null);
  const cropNameRef = useRef(null);

  const fetchCropNames = async () => {
    try {
      const response = await getCropNames();
      setCropNames(response.data.crop_names);
      setFilteredCropNames(response.data.crop_names.map(name => ({ value: name, label: name })));
    } catch (err) {
      setModalContent('작물 이름을 불러오는 중 오류가 발생했습니다.');
      setModalTitle('오류');
      setIsError(true);
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    fetchCropNames();

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
  }, []);

  const handleInputChange = (selectedOption) => {
    setCurrentCrop({ ...currentCrop, name: selectedOption ? selectedOption.value : "" });
  };

  const handleCropSelect = (selectedOption) => {
    setCurrentCrop({ ...currentCrop, name: selectedOption ? selectedOption.value : "" });
    setShowCropList(false);
  };

  const addCrop = async () => {
    if (landArea && region && currentCrop.name && currentCrop.ratio) {
      setCrops([...crops, { ...currentCrop, id: crops.length + 1 }]);
      setCurrentCrop({ name: "", ratio: "" });
      setAddError("");
      setSelectKey(prevKey => prevKey + 1); // key를 변경하여 Select 컴포넌트를 재설정
      await fetchCropNames(); // 작물 이름 리스트를 다시 불러옴
    } else {
      setAddError("재배 면적, 지역, 작물 및 비율을 모두 입력해주세요.");
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
      setIsLoading(true);
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
      setIsLoading(false);
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
      {isLoading && <GlobalLoader text="AI 수익 예측 중입니다."/>}
      <SummaryTitle step="1">작물정보 입력</SummaryTitle>
      <InputContainer>
        <Label>재배 면적 (평)</Label>
        <Input
          type="text"
          placeholder="재배 면적 (평)"
          value={landArea}
          onChange={(e) => setLandArea(e.target.value)}
          autoComplete="off"
        />
        <Label>지역 선택</Label>
        <div style={{ position: 'relative' }} ref={regionRef}>
          <Input
            type="text"
            placeholder="지역 선택"
            value={region}
            onClick={() => setShowRegionList(!showRegionList)}
            readOnly
            autoComplete="off"
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
        <p style={{ color: '#7f8c8d', fontSize: '0.875rem', marginTop: '0.625rem' }}>원하는 작물과 비율을 선택하여 추가하기를 눌러주세요</p>
        <p style={{ color: '#7f8c8d', fontSize: '0.875rem', marginTop: '0.625rem' }}>각 작물별 비율은 합해서 1이 되어야 합니다.</p>
        <Label>작물 이름</Label>
        <Select
          key={selectKey} // key를 설정하여 컴포넌트를 재설정
          options={filteredCropNames}
          onChange={handleInputChange}
          onInputChange={() => setShowCropList(true)}
          value={filteredCropNames.find(option => option.value === currentCrop.name)}
          placeholder="작물 검색"
          styles={{
            container: base => ({
              ...base,
              marginBottom: '18px',
            }),
            control: base => ({
              ...base,
              border: '1px solid #b0b8c1',
              borderRadius: '8px',
              borderColor: '#dfe6e9',
              '&:hover': {
                borderColor: '#4aaa87'
              },
              boxShadow: 'none'
            }),
          }}
        />
        <Label>작물별 비율</Label>
        <div style={{ display: 'flex', alignItems: 'left', height: '2.5rem', margin: '0.7rem 0', }}>
          <SmallInput
            type="text"
            name="ratio"
            placeholder="ex) 0.5, 1"
            value={currentCrop.ratio}
            onChange={(e) => setCurrentCrop({ ...currentCrop, ratio: e.target.value })}
            autoComplete="off"
          />
          <AddButton onClick={addCrop} disabled={!landArea || !region || !currentCrop.name || !currentCrop.ratio}>
            <FaPlus style={{ marginRight: '0.5rem' }} /> 추가하기
          </AddButton>
        </div>
        {addError && <ErrorMessage>{addError}</ErrorMessage>}
      </InputContainer>
      <SummaryTitle step="2">입력 정보 확인</SummaryTitle>
      <SummaryContainer>
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
              <CropName>{crop.id}. 작물: {crop.name}</CropName>
              <CropRatio>비율: {crop.ratio}</CropRatio>
            </ItemText>
            <RemoveIcon onClick={() => removeCrop(index)}><FaTrash /></RemoveIcon>
          </SummaryItem>
        ))}
        <Button onClick={handleSubmit}>예측 결과 보러가기</Button>
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