import React, { useState } from "react";
import styled from "styled-components";
import { AiOutlineBell } from 'react-icons/ai';

// 스타일 정의
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0; /* 배경색을 변경할 수 있습니다 */
`;

const HeaderContainer = styled.div`
  width: 100%;
  background-color: #a5d6a7; /* 연한 초록색 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative; /* 아이콘 컨테이너 위치를 위해 추가 */
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: #fff;
  margin: 0;
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

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem; /* 상단 바와 콘텐츠 사이에 간격 추가 */
  width: 100%;
  max-width: 800px; /* 전체 레이아웃의 최대 너비 설정 */

  @media (min-width: 769px) {
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1; /* 1:1 비율 유지 */
  border: 2px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;

  @media (min-width: 769px) {
    width: 60%;
    margin-right: 20px;
    margin-bottom: 0;
  }
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px; /* 박스들 사이의 간격 */
  
  @media (min-width: 769px) {
    width: 40%;
  }
`;

const InfoBox = styled.div`
  flex: 1; /* 박스가 동일한 비율을 유지하도록 설정 */
  border: 2px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  text-align: center;
`;

const InfoPage = () => {
  const [imageUrl, setImageUrl] = useState("https://via.placeholder.com/400");
  const [pestInfo] = useState("이 병해충은 잎을 갉아먹고 식물의 성장을 방해합니다. 주로 따뜻한 기후에서 발생하며 빠르게 번식합니다.");
  const [pesticideRecommendation] = useState("이 병해충을 방제하기 위해서는 유기농 살충제 사용이 권장됩니다. 정기적인 잎 세척과 함께 사용하면 효과적입니다.");
  const [solution] = useState("추천 해충제는 네오니코티노이드 계열의 살충제입니다. 사용 시 주의사항을 반드시 준수하세요.");

  return (
    <PageContainer>
      <HeaderContainer>
        <Title>Pest and Disease Info Page</Title>
        <IconContainer>
          <Icon><AiOutlineBell size={24} color="#fff" /></Icon>
        </IconContainer>
      </HeaderContainer>
      <LayoutContainer>
        <ImageContainer>
          {imageUrl ? <img src={imageUrl} alt="병해충 사진" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <p>병해충 사진</p>}
        </ImageContainer>
        <InfoContainer>
          <InfoBox>
            <p>{pestInfo}</p>
          </InfoBox>
          <InfoBox>
            <p>{pesticideRecommendation}</p>
          </InfoBox>
          <InfoBox>
            <p>{solution}</p>
          </InfoBox>
        </InfoContainer>
      </LayoutContainer>
    </PageContainer>
  );
};

export default InfoPage;
