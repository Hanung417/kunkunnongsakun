import React from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { AiOutlineBell } from 'react-icons/ai';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
  padding: 20px;
`;

const HeaderContainer = styled.div`
  width: 100%;
  background-color: #a5d6a7;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: #fff;
  margin: 0;
  text-align: center;
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
  margin-top: 2rem;
  width: 100%;
  max-width: 800px;

  @media (min-width: 769px) {
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
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
  gap: 10px;
  
  @media (min-width: 769px) {
    width: 40%;
  }
`;

const InfoBox = styled.div`
  flex: 1;
  border: 2px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  text-align: center;
  font-size: 1rem; /* 폰트 크기를 작게 조정 */
`;

const InfoPage = () => {
  const location = useLocation();
  const { diagnosisResult } = location.state || {};

  if (!diagnosisResult) {
    return <div>No diagnosis result available.</div>;
  }

  const { pest_name, occurrence_environment, symptom_description, prevention_methods, pesticide_name, image_url } = diagnosisResult;

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
          {image_url ? <img src={image_url} alt="Pest" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <p>No Image Available</p>}
        </ImageContainer>
        <InfoContainer>
          <InfoBox>
            <p>{pest_name}</p>
          </InfoBox>
          <InfoBox>
            <p>{occurrence_environment}</p>
          </InfoBox>
          <InfoBox>
            <p>{symptom_description}</p>
          </InfoBox>
          <InfoBox>
            <p>{prevention_methods}</p>
          </InfoBox>
          <InfoBox>
            <p>{pesticide_name}</p>
          </InfoBox>
        </InfoContainer>
      </LayoutContainer>
    </PageContainer>
  );
};

export default InfoPage;
