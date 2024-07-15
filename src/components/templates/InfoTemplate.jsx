import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background-color: #f9f9f9;
  height: 100%;
`;

const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background-color: #4aaa87;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 1.3rem;
  margin: 0;
`;

const LayoutContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  width: 100%;
  max-width: 900px; // 최대 너비
  margin-top: 20px; // 헤더와 분리하기 위해 여백 추가
  padding: 20px; // 내부 콘텐츠 패딩
  background-color: #fff; 
  border-radius: 10px;  // 둥근 모서리
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  margin: 0 auto;
  aspe
`;

const Image = styled.img`
  width: 100%; 
  height: auto; 
  object-fit: cover; 
`;

const InfoContainer = styled.div`
  grid-column: span 2;  // 두개의 열을 모두 차지
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
`;

const InfoBox = styled.div`
  border: 2px solid #4aaa87;
  margin: 4px 16px;
  padding: 14px; /* Increased padding for better spacing */
  text-align: left; /* Align text to the left for readability */
  border-radius: 10px; /* Rounded corners for each info box */
`;

const InfoLabel = styled.p`
  font-weight: bold;
  margin-bottom: 8px; /* Reduced margin bottom for compact layout */
`;

const InfoText = styled.p`
`;

const BackButton = styled.button`
  background-color: #4aaa87;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.3em;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 20px;

  &:hover {
    background-color: #3b8b6d;
  }
`;


const InfoTemplate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { diagnosisResult } = location.state || {};

  if (!diagnosisResult) {
    return <div>No diagnosis result available.</div>;
  }

  const { pest_name, occurrence_environment, symptom_description, prevention_methods, pesticide_name, user_image_url, db_image_url } = diagnosisResult;

  return (
    <PageContainer>
      <HeaderContainer>
        <Title> 병해충 진단 결과 </Title>
      </HeaderContainer>
      <LayoutContainer>
        <ImageContainer>
          {db_image_url ? <Image src={db_image_url} alt="Pest from DB" /> : <p>No Image Available</p>}
        </ImageContainer>
        <ImageContainer>
          {user_image_url ? <Image src={user_image_url} alt="User uploaded Pest" /> : <p>No Image Available</p>}
        </ImageContainer>
        <InfoContainer>
          <InfoBox>
            <InfoLabel>Pest Name</InfoLabel>
            <InfoText>{pest_name}</InfoText>
          </InfoBox>
          <InfoBox>
            <InfoLabel>Occurrence Environment</InfoLabel>
            <InfoText>{occurrence_environment}</InfoText>
          </InfoBox>
          <InfoBox>
            <InfoLabel>Symptom Description</InfoLabel>
            <InfoText>{symptom_description}</InfoText>
          </InfoBox>
          <InfoBox>
            <InfoLabel>Prevention Methods</InfoLabel>
            <InfoText>{prevention_methods}</InfoText>
          </InfoBox>
          <InfoBox>
            <InfoLabel>Pesticide Name</InfoLabel>
            <InfoText>{pesticide_name}</InfoText>
          </InfoBox>
        </InfoContainer>
      </LayoutContainer>
      <BackButton onClick={() => navigate('/diagnosislist')}>목록보기</BackButton>
    </PageContainer>
  );
};

export default InfoTemplate;