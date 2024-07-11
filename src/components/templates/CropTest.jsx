import React, { useState } from "react";
import styled from "styled-components";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

const Select = styled.select`
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
  background-color: #6c5ce7;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
  width: 100%;

  &:hover {
    background-color: #341f97;
  }
`;

const ResultContainer = styled.div`
  margin-top: 20px;
  width: 100%;
  max-width: 600px;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
`;

const CropContainer = styled.div`
  background-color: #f1f2f6;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 10px;
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

const CropTest = () => {
  const [landArea, setLandArea] = useState("");
  const [region, setRegion] = useState("");
  const [crops, setCrops] = useState([{ name: "", ratio: "" }]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (index, event) => {
    const values = [...crops];
    values[index][event.target.name] = event.target.value;
    setCrops(values);
  };

  const addCrop = () => {
    setCrops([...crops, { name: "", ratio: "" }]);
  };

  const removeCrop = (index) => {
    const values = [...crops];
    values.splice(index, 1);
    setCrops(values);
  };

  const validateInput = () => {
    const newErrors = [];
    if (!landArea || landArea.trim() === "") {
      newErrors.push("평수를 입력해주세요.\n");
    }
    if (!region || region.trim() === "") {
      newErrors.push("지역을 입력해주세요.\n");
    }
    crops.forEach((crop, index) => {
      if (!crop.name || crop.name.trim() === "") {
        newErrors.push(` ${index + 1}번째 작물명을 입력해주세요.\n`);
      }
      if (!crop.ratio || crop.ratio.trim() === "" || isNaN(crop.ratio)) {
        newErrors.push(`${index + 1}번째 작물의 비율을 입력해주세요.\n`);
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
      const response = await axios.post('http://localhost:8000/prediction/predict/', {
        land_area: landArea,
        crop_names: crops.map(crop => crop.name),
        crop_ratios: crops.map(crop => crop.ratio),
        region: region
      }, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCSRFToken(),
        },
        withCredentials: true
      });
  
      if (response.data.error) {
        setError(response.data.error);
      } else {
        setResult(response.data);
        navigate('/ExpectedReturn', { state: { landArea, cropNames: crops.map(crop => crop.name), result: response.data } });
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

  return (
    <PageContainer>
      <Title>수익 예측 테스트</Title>
      <InputContainer>
        <Input
          type="text"
          placeholder="Land Area"
          value={landArea}
          onChange={(e) => setLandArea(e.target.value)}
        />
        {/* Region dropdown */}
        <Select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        >
          <option value="">Select Region</option>
          <option value="서울">서울</option>
          <option value="부산">부산</option>
          <option value="대구">대구</option>
          <option value="광주">광주</option>
          <option value="대전">대전</option>
        </Select>
        {crops.map((crop, index) => (
          <CropContainer key={index}>
            <Input
              type="text"
              placeholder="Crop Name"
              name="name"
              value={crop.name}
              onChange={(event) => handleInputChange(index, event)}
            />
            <Input
              type="text"
              placeholder="Crop Ratio"
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
      {error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : (
        result && (
          <ResultContainer>
            <h2>Total Income: {result.total_income}</h2>
            {result.results.map((res, index) => (
              <CropContainer key={index}>
                <h3>{res.crop_name}</h3>
                <p>Latest Year: {res.latest_year}</p>
                <p>Adjusted Data: {JSON.stringify(res.adjusted_data)}</p>
                <p>Predicted Price: {res.price}</p>
              </CropContainer>
            ))}
          </ResultContainer>
        )
      )}
    </PageContainer>
  );
};

export default CropTest;
