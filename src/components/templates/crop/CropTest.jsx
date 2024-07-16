import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { getCropNames, predictCrops } from "../../../apis/crop";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100vh;
  background-color: #f8f9fa;
  font-size: 1rem;
  font-family: Arial, sans-serif;
  color: #333;
  padding: 20px;
  overflow-y: auto; /* 스크롤 사용 */
`;

const Title = styled.h1`
  margin: 20px 0;
  color: #2c3e50;
  font-size: 1.5rem;
`;

const InputContainer = styled.div`
  margin-bottom: 20px;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 500px;
  position: relative;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  width: 100%;
  border: 2px solid #dfe6e9;
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 0.9rem;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin-top: 10px;
  background-color: #4aaa87;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
  width: 100%;

  &:hover {
    background-color: #6dc4b0;
  }
`;

const CropContainer = styled.div`
  background-color: #f1f2f6;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 10px;
  position: relative;
`;

const ErrorMessage = styled.p`
  color: white;
  background-color: red;
  padding: 10px;
  border-radius: 5px;
  margin-top: 20px;
  text-align: center;
  width: 100%;
  max-width: 600px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  position: absolute;
  z-index: 1;
  top: 100%;
  max-height: 200px; /* 고정된 높이 설정 */
  overflow-y: auto; /* 스크롤 사용 */
  -ms-overflow-style: none; /* Internet Explorer에서 스크롤바 숨기기 */
  scrollbar-width: none; /* Firefox에서 스크롤바 숨기기 */

  &::-webkit-scrollbar {
    display: none; /* Webkit 기반 브라우저에서 스크롤바 숨기기 */
  }
`;

const ListItem = styled.div`
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

const CropTest = () => {
  const [landArea, setLandArea] = useState("");
  const [region, setRegion] = useState("");
  const [crops, setCrops] = useState([{ name: "", ratio: "" }]);
  const [error, setError] = useState(null);
  const [cropNames, setCropNames] = useState([]);
  const [filteredCropNames, setFilteredCropNames] = useState([]);
  const [showCropList, setShowCropList] = useState([]);
  const [showRegionList, setShowRegionList] = useState(false);
  const regions = ["서울", "부산", "대구", "광주", "대전"];
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  useEffect(() => {
    const fetchCropNames = async () => {
      try {
        const response = await getCropNames();
        setCropNames(response.data.crop_names);
        setFilteredCropNames(response.data.crop_names);
      } catch (err) {
        setError('작물 이름을 불러오는 중 오류가 발생했습니다.');
      }
    };
    fetchCropNames();
  }, []);

  const handleInputChange = (index, event) => {
    const values = [...crops];
    values[index][event.target.name] = event.target.value;
    setCrops(values);
    if (event.target.name === 'name') {
      setFilteredCropNames(cropNames.filter(crop => crop.toLowerCase().includes(event.target.value.toLowerCase())));
      const newShowCropList = [...showCropList];
      newShowCropList[index] = true;
      setShowCropList(newShowCropList);
    }
  };

  const addCrop = () => {
    setCrops([...crops, { name: "", ratio: "" }]);
    setShowCropList([...showCropList, false]);
  };

  const removeCrop = (index) => {
    const values = [...crops];
    values.splice(index, 1);
    setCrops(values);
    const newShowCropList = [...showCropList];
    newShowCropList.splice(index, 1);
    setShowCropList(newShowCropList);
  };

  const validateInput = () => {
    const newErrors = [];
    if (!landArea || landArea.trim() === "") {
      newErrors.push("평수를 입력해주세요. ");
    }
    if (!region || region.trim() === "") {
      newErrors.push("지역을 입력해주세요. ");
    }
    crops.forEach((crop, index) => {
      if (!crop.name || crop.name.trim() === "") {
        newErrors.push(`${index + 1}번째 작물명을 입력해주세요.`);
      }
      if (!crop.ratio || crop.ratio.trim() === "" || isNaN(crop.ratio)) {
        newErrors.push(`${index + 1}번째 작물의 비율을 입력해주세요.`);
      }
    });
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const inputErrors = validateInput();
    if (inputErrors.length > 0) {
      setError(inputErrors.join("\n"));  // 모든 에러 메시지를 하나의 문자열로 결합
      return;
    }

    try {
      const session_id = `session_${Date.now()}`;  // 고유한 세션 ID 생성
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
        setError(errorMessage);
      } else {
        navigate('/SessionDetails', { state: { landArea, cropNames: crops.map(crop => crop.name), result: response.data, session_id } });
      }
    } catch (error) {
      console.error('Error fetching prediction', error);
      setError(error.response && error.response.data && error.response.data.error
        ? error.response.data.error
        : 'Error fetching prediction');
    }
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

  const handleCropSelect = (index, crop) => {
    const values = [...crops];
    values[index].name = crop;
    setCrops(values);
    const newShowCropList = [...showCropList];
    newShowCropList[index] = false;
    setShowCropList(newShowCropList);
  };

  const handleRegionSelect = (region) => {
    setRegion(region);
    setShowRegionList(false);
  };

  const handleClickOutside = (event) => {
    inputRefs.current.forEach((ref, index) => {
      if (ref && !ref.contains(event.target)) {
        const newShowCropList = [...showCropList];
        newShowCropList[index] = false;
        setShowCropList(newShowCropList);
      }
    });

    if (regionRef.current && !regionRef.current.contains(event.target)) {
      setShowRegionList(false);
    }
  };

  const regionRef = useRef(null);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCropList, showRegionList]);

  return (
    <PageContainer>
      <Title>작물 정보 선택</Title>
      <InputContainer>
        <Input
          type="text"
          placeholder="재배 면적 (평)"
          value={landArea}
          onChange={(e) => setLandArea(e.target.value)}
        />
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
        {crops.map((crop, index) => (
          <CropContainer key={index} ref={(el) => (inputRefs.current[index] = el)}>
            <div style={{ position: 'relative' }}>
              <Input
                type="text"
                name="name"
                placeholder="작물 검색"
                value={crop.name}
                onChange={(event) => handleInputChange(index, event)}
                onClick={() => {
                  const newShowCropList = [...showCropList];
                  newShowCropList[index] = true;
                  setShowCropList(newShowCropList);
                }}
              />
              {showCropList[index] && filteredCropNames.length > 0 && (
                <List>
                  {filteredCropNames.map((cropName, idx) => (
                    <ListItem key={idx} onClick={() => handleCropSelect(index, cropName)}>
                      {cropName}
                    </ListItem>
                  ))}
                </List>
              )}
            </div>
            <Input
              type="text"
              placeholder="작물별 비율"
              name="ratio"
              value={crop.ratio}
              onChange={(event) => handleInputChange(index, event)}
            />
            <Button onClick={() => removeCrop(index)}>작물 삭제</Button>
          </CropContainer>
        ))}
        <Button onClick={addCrop}>작물 추가</Button>
        <Button onClick={handleSubmit}>제출</Button>
      </InputContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </PageContainer>
  );
};

export default CropTest;
