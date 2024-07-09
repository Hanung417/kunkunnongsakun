import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { AiOutlineBell, AiOutlinePlus } from 'react-icons/ai'; 
import { useNavigate } from 'react-router-dom';
import Slider from '@mui/material/Slider';  // Slider 컴포넌트를 @mui/material에서 가져옴

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: #fafafa;
  font-size: 1rem;
  font-family: 'Roboto', sans-serif;
`;

const Header = styled.div`
  width: 100%;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #a5d6a7; /* 더 연한 초록색 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin: 0;
  color: #fff; /* 제목 색상을 흰색으로 변경 */
`;

const IconContainer = styled.div`
  position: absolute;
  right: 1rem;
  display: flex;
  align-items: center;
`;

const Icon = styled.div`
  margin-left: 1rem;
  cursor: pointer;
`;

const Content = styled.div`
  width: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  overflow-y: auto;
`;

const CategoryButton = styled.button`
  background-color: #a5d6a7; /* 상단바와 동일한 배경색 */
  border: none;
  border-radius: 50px; /* 둥근 모서리 */
  padding: 0.5rem 1rem; /* 여백 조정 */
  font-size: 1rem;
  color: #fff;
  cursor: pointer;
  margin-bottom: 1rem;
  width: auto; /* 너비 자동 조정 */
`;

const PlantGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 두 개의 열 */
  gap: 1rem;
  width: 100%;
  padding: 0 1rem;
`;

const PlantButton = styled.button`
  background-color: #fff;
  border-radius: 15px; /* 둥근 모서리 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 그림자 조정 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border: none;
  cursor: pointer;
  text-align: center;
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-5px);
  }
`;

const PlantImage = styled.img`
  width: 80px; /* 이미지 크기 조정 */
  height: 80px;
  object-fit: cover;
  border-radius: 10px; /* 둥근 모서리 */
  margin-bottom: 0.75rem; /* 여백 조정 */
`;

const PlusIcon = styled(AiOutlinePlus)`
  font-size: 2.5rem; /* 아이콘 크기 조정 */
  color: #4CAF50;
  margin-bottom: 0.5rem;
`;

const PlantName = styled.h2`
  font-size: 1rem; /* 폰트 크기 조정 */
  margin: 0.5rem 0;
  color: #333;
`;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PopupContent = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 600px;
  max-height: 90%;
  position: relative;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const PopupCloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
`;

const NavigateButton = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: auto;
  font-size: 1rem;
  width: 100%;
  max-width: 300px;
  align-self: center;
`;

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const SliderLabel = styled.div`
  margin-right: 1rem;
  font-size: 1rem;
`;

const CropsPage = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const navigate = useNavigate();

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const navigateToExpectedReturnPage = () => {
    navigate("/ExpectedReturn");
  };

  return (
    <PageContainer>
      <Header>
        <Title>작물 목록</Title>
        <IconContainer>
          <Icon>
            <AiOutlineBell size={30} color="#fff" />
          </Icon>
        </IconContainer>
      </Header>
      <Content>
        <CategoryButton>All</CategoryButton>
        <PlantGrid>
          <PlantButton onClick={togglePopup}>
            <PlusIcon />
            <PlantName>MyCrops</PlantName>
          </PlantButton>
          <PlantButton onClick={navigateToExpectedReturnPage}>
            <PlantImage src="https://via.placeholder.com/100" alt="Cherokee Tomato" />
            <PlantName>Tomato</PlantName>
          </PlantButton>
          <PlantButton onClick={navigateToExpectedReturnPage}>
            <PlantImage src="https://via.placeholder.com/100" alt="Roma Tomato" />
            <PlantName>Cucumber</PlantName>
          </PlantButton>
          <PlantButton onClick={navigateToExpectedReturnPage}>
            <PlantImage src="https://via.placeholder.com/100" alt="Roma Tomato" />
            <PlantName>Lettuce</PlantName>
          </PlantButton>
          <PlantButton onClick={navigateToExpectedReturnPage}>
            <PlantImage src="https://via.placeholder.com/100" alt="Roma Tomato" />
            <PlantName>Watermelon</PlantName>
          </PlantButton>
          <PlantButton onClick={navigateToExpectedReturnPage}>
            <PlantImage src="https://via.placeholder.com/100" alt="Roma Tomato" />
            <PlantName>Apple</PlantName>
          </PlantButton>
          <PlantButton onClick={navigateToExpectedReturnPage}>
            <PlantImage src="https://via.placeholder.com/100" alt="Roma Tomato" />
            <PlantName>Pear</PlantName>
          </PlantButton>
        </PlantGrid>
      </Content>

      {isPopupOpen && (
        <PopupOverlay onClick={togglePopup}>
          <PopupContent onClick={(e) => e.stopPropagation()}>
            <PopupCloseButton onClick={togglePopup}>×</PopupCloseButton>
            <CropsPopup navigateToExpectedReturnPage={navigateToExpectedReturnPage} />
          </PopupContent>
        </PopupOverlay>
      )}
    </PageContainer>
  );
};

const CropsPopup = ({ navigateToExpectedReturnPage }) => {
  const [area, setArea] = useState("");
  const [areaRatio, setAreaRatio] = useState(0.5); // 슬라이더 상태 추가
  const [crops, setCrops] = useState([
    { name: "가을감자", region: "", hourlySales: "52,661원", salesPer3m: "7,765원" },
    { name: "가을무", region: "", hourlySales: "43,222원", salesPer3m: "7,759원" },
    { name: "가을배추", region: "", hourlySales: "41,714원", salesPer3m: "8,798원" },
    { name: "가지", region: "", hourlySales: "39,151원", salesPer3m: "29,962원" },
    { name: "토마토", region: "", hourlySales: "60,000원", salesPer3m: "10,000원" },
    { name: "고추", region: "", hourlySales: "45,000원", salesPer3m: "9,000원" },
    { name: "오이", region: "", hourlySales: "35,000원", salesPer3m: "8,000원" },
    { name: "상추", region: "", hourlySales: "25,000원", salesPer3m: "7,000원" },
    { name: "파프리카", region: "", hourlySales: "55,000원", salesPer3m: "12,000원" },
    { name: "양배추", region: "", hourlySales: "40,000원", salesPer3m: "9,500원" },
    { name: "딸기", region: "", hourlySales: "70,000원", salesPer3m: "15,000원" },
    { name: "블루베리", region: "", hourlySales: "65,000원", salesPer3m: "13,000원" },
    { name: "브로콜리", region: "", hourlySales: "50,000원", salesPer3m: "10,500원" },
    { name: "양파", region: "", hourlySales: "30,000원", salesPer3m: "6,500원" },
    { name: "마늘", region: "", hourlySales: "45,000원", salesPer3m: "8,500원" },
    { name: "배추", region: "", hourlySales: "55,000원", salesPer3m: "11,000원" },
    { name: "무", region: "", hourlySales: "35,000원", salesPer3m: "7,500원" },
    { name: "호박", region: "", hourlySales: "25,000원", salesPer3m: "5,500원" },
    { name: "멜론", region: "", hourlySales: "65,000원", salesPer3m: "14,000원" },
    { name: "수박", region: "", hourlySales: "60,000원", salesPer3m: "13,500원" },
  ]);

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const response = await axios.get("/api/crops");
        setCrops(response.data);
      } catch (error) {
        console.error("Failed to fetch crops data:", error);
      }
    };

    fetchCrops();
  }, []);

  const handleAreaChange = (e) => {
    setArea(e.target.value);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>01 재배 면적을 설정해 주세요</h2>
        <input
          type="text"
          value={area}
          onChange={handleAreaChange}
          placeholder="면적을 입력해 주세요."
          style={{ padding: '0.5rem', width: '100%', marginBottom: '0.5rem', borderRadius: '5px', border: '1px solid #ddd' }}
        />
        <span>= m²</span>
      </div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>02 희망 재배 작물을 선택해 주세요</h2>
        <div style={{ display: 'flex', marginBottom: '0.5rem' }}>
          <input type="text" placeholder="원하는 작물명을 검색해 주세요." style={{ flex: 1, padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd' }} />
          <button style={{ padding: '0.5rem 1rem', marginLeft: '0.5rem', borderRadius: '5px', border: '1px solid #ddd', background: '#4CAF50', color: '#fff' }}>검색</button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '2px solid #ddd', padding: '0.5rem' }}>선택</th>
              <th style={{ borderBottom: '2px solid #ddd', padding: '0.5rem' }}>작물명</th>
              <th style={{ borderBottom: '2px solid #ddd', padding: '0.5rem' }}>지역</th>
              <th style={{ borderBottom: '2px solid #ddd', padding: '0.5rem' }}>시간당 매출</th>
              <th style={{ borderBottom: '2px solid #ddd', padding: '0.5rem' }}>3.3㎡당 매출</th>
            </tr>
          </thead>
          <tbody>
            {crops.map((crop, index) => (
              <tr key={index}>
                <td style={{ borderBottom: '1px solid #ddd', padding: '0.5rem', textAlign: 'center' }}>
                  <input type="checkbox" />
                </td>
                <td style={{ borderBottom: '1px solid #ddd', padding: '0.5rem', textAlign: 'center' }}>{crop.name}</td>
                <td style={{ borderBottom: '1px solid #ddd', padding: '0.5rem', textAlign: 'center' }}>{crop.region}</td>
                <td style={{ borderBottom: '1px solid #ddd', padding: '0.5rem', textAlign: 'center' }}>{crop.hourlySales}</td>
                <td style={{ borderBottom: '1px solid #ddd', padding: '0.5rem', textAlign: 'center' }}>{crop.salesPer3m}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>03 재배면적 비율을 설정해 주세요</h2>
        <SliderContainer>
          <SliderLabel>재배면적 비율</SliderLabel>
          <Slider
            value={areaRatio}
            onChange={(e, newValue) => setAreaRatio(newValue)}
            min={0}
            max={1}
            step={0.01}
            style={{ width: '80%' }}
          />
          <div>{(areaRatio * 100).toFixed(0)}%</div>
        </SliderContainer>
      </div>
      <NavigateButton onClick={navigateToExpectedReturnPage}>예상 수익 페이지로 이동</NavigateButton>
    </div>
  );
};

export default CropsPage;