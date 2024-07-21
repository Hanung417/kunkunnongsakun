import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f9f9f9;
`;

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 900px;
  margin-top: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 180px; /* 최대 너비 설정 */
  height: 200px; /* 이미지 크기 고정 */
  overflow: hidden;
  margin-bottom: 20px;
`;

const ImageLabel = styled.div`
  font-weight: bold;
  color: #4aaa87;
  margin-bottom: 8px;
  text-align: center;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const InfoContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SingleRowContainer = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
  justify-content: center;
`;

const Divider = styled.hr`
  width: 100%;
  height: 1px;
  background-color: #ccc;
  margin: 10px 0; /* 위아래 간격을 줄였습니다 */
`;

const InfoBox = styled.div`
  background-color: #f9f9f9;
  padding: 10px 20px; /* 상하 패딩을 줄였습니다 */
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex: 1;
`;

const InfoLabel = styled.p`
  font-weight: bold;
  color: #4aaa87;
  margin-bottom: 8px;
`;

const InfoText = styled.p`
  line-height: 1.5;
  color: #333;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHeader = styled.th`
  border: 1px solid #ccc;
  padding: 8px;
  background-color: #f0f0f0;
  color: #333;
`;

const TableCell = styled.td`
  border: 1px solid #ccc;
  padding: 8px;
  color: #333;
`;

const BackButton = styled.button`
  background-color: #4aaa87;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!diagnosisResult) {
    return <div>No diagnosis result available.</div>;
  }

  const {
    pest_name,
    occurrence_environment,
    symptom_description,
    prevention_methods,
    pesticide_name,
    confidence,
    user_image_url,
    db_image_url,
    detection_date
  } = diagnosisResult;

  const pesticides = pesticide_name.split("\n");

  return (
    <PageContainer>
      <LayoutContainer>
        <SingleRowContainer>
          <InfoBox>
            <InfoLabel>진단 날짜</InfoLabel>
            <InfoText>{detection_date}</InfoText>
          </InfoBox>
          <InfoBox>
            <InfoLabel>모델 학습 결과</InfoLabel>
            <InfoText>{confidence.toFixed(2)}</InfoText>
          </InfoBox>
        </SingleRowContainer>
        <InfoBox>
          <InfoLabel>질병 이름</InfoLabel>
          <InfoText>{pest_name}</InfoText>
        </InfoBox>
        <SingleRowContainer>
          <div>
            <ImageLabel>사용자 이미지</ImageLabel>
            <ImageContainer>
              {user_image_url ? <Image src={user_image_url} alt="User uploaded Pest" /> : <p>No Image Available</p>}
            </ImageContainer>
          </div>
          <div>
            <ImageLabel>질병 이미지</ImageLabel>
            <ImageContainer>
              {db_image_url ? <Image src={db_image_url} alt="Pest from DB" /> : <p>No Image Available</p>}
            </ImageContainer>
          </div>
        </SingleRowContainer>
        <Divider />
        <SectionTitle>상세 정보</SectionTitle>
        <InfoContainer>
          <InfoBox>
            <InfoLabel>발생 환경</InfoLabel>
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
            <Table>
              <thead>
                <tr>
                  <TableHeader>농약명</TableHeader>
                </tr>
              </thead>
              <tbody>
                {pesticides.map((pesticide, index) => (
                  <tr key={index}>
                    <TableCell>{pesticide}</TableCell>
                  </tr>
                ))}
              </tbody>
            </Table>
          </InfoBox>
        </InfoContainer>
      </LayoutContainer>
      <BackButton onClick={() => navigate('/diagnosislist')}>진단 목록으로 돌아가기</BackButton>
    </PageContainer>
  );
};

export default InfoTemplate;