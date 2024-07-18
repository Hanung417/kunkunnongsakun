import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f9f9f9;
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
  max-width: 900px;
  margin-top: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ImageTitle = styled.h2`
  font-size: 18px;
  color: #333;
  margin-bottom: 16px;
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  width: 100%;
  height: 300px;
  border-radius: 10px;
  background-color: #fff;
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
`;

const InfoContainer = styled.div`
  grid-column: span 2;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
`;

const ImageBox = styled.div`
  display: flex;
  flex-direction: column;
  margin: 16px;
  align-items: center;
  border: 2px solid #4aaa87;
  border-radius: 10px;
  padding: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const InfoBox = styled.div`
  border: 2px solid #4aaa87;
  margin: 4px 16px;
  padding: 14px;
  text-align: left;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const InfoLabel = styled.p`
  font-weight: bold;
  margin-bottom: 8px;
`;

const InfoText = styled.p``;

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

  const { pest_name, occurrence_environment, symptom_description, prevention_methods, pesticide_name, confidence, user_image_url, db_image_url } = diagnosisResult;

  return (
    <PageContainer>
      <LayoutContainer>
        <ImageBox>
          <ImageTitle>병해충 이미지</ImageTitle>
          <ImageContainer>
            {db_image_url ? <Image src={db_image_url} alt="Pest from DB" /> : <p>No Image Available</p>}
          </ImageContainer>
        </ImageBox>
        <ImageBox>
          <ImageTitle>사용자 업로드 이미지</ImageTitle>
          <ImageContainer>
            {user_image_url ? <Image src={user_image_url} alt="User uploaded Pest" /> : <p>No Image Available</p>}
          </ImageContainer>
        </ImageBox>
        <InfoContainer>
          <InfoBox>
            <InfoLabel>모델 학습 결과</InfoLabel>
            <InfoText>{confidence}</InfoText>
          </InfoBox>
          <InfoBox>
            <InfoLabel>질병 이름</InfoLabel>
            <InfoText>{pest_name}</InfoText>
          </InfoBox>
          <InfoBox>
            <InfoLabel>발생환경</InfoLabel>
            <InfoText>{occurrence_environment}</InfoText>
          </InfoBox>
          <InfoBox>
            <InfoLabel>증상 설명</InfoLabel>
            <InfoText>{symptom_description}</InfoText>
          </InfoBox>
          <InfoBox>
            <InfoLabel>예방 방법</InfoLabel>
            <InfoText>{prevention_methods}</InfoText>
          </InfoBox>
          <InfoBox>
            <InfoLabel>농약 처방 정보</InfoLabel>
            <InfoText>{pesticide_name}</InfoText>
          </InfoBox>
        </InfoContainer>
      </LayoutContainer>
      <BackButton onClick={() => navigate('/diagnosislist')}>목록보기</BackButton>
    </PageContainer>
  );
};

export default InfoTemplate;