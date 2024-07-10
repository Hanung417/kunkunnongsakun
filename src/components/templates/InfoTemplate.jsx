import React from "react";
import { useLocation } from "react-router-dom";
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
  grid-template-columns: 100%;
  gap: 20px;
  width: 100%;
  max-width: 900px; /* Increased max-width for better content spacing */
  margin-top: 20px; /* Added margin-top for separation from header */
  padding: 20px; /* Added padding for inner content */
  background-color: #fff; /* White background for content area */
  border-radius: 10px; /* Rounded corners for visual appeal */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Soft shadow for depth */
`;

const ImageContainer = styled.div`
  width: 60%;
  aspect-ratio: 1 / 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden; /* Ensure image does not overflow container */
  margin: 0 auto; /* Center the container horizontally */
`;

const Image = styled.img`
  width: 100%; /* Ensure the image takes up 100% of its container */
  height: auto; /* Maintain aspect ratio */
  object-fit: cover; /* Maintain aspect ratio and cover the container */
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
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

const InfoTemplate = () => {
  const location = useLocation();
  const { diagnosisResult } = location.state || {};

  if (!diagnosisResult) {
    return <div>No diagnosis result available.</div>;
  }

  const { pest_name, occurrence_environment, symptom_description, prevention_methods, pesticide_name, image_url } = diagnosisResult;

  return (
    <PageContainer>
      <HeaderContainer>
        <Title> 병해충 진단 결과 </Title>
      </HeaderContainer>
      <LayoutContainer>
        <ImageContainer>
          {image_url ? <Image src={image_url} alt="Pest" /> : <p>No Image Available</p>}
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
    </PageContainer>
  );
};

export default InfoTemplate;