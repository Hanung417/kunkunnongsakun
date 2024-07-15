import React from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background-color: #f9f9f9;
  min-height: 100vh;
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

  @media (max-width: 600px) {
    font-size: 1rem;
  }
`;

const RecommendationContainer = styled.div`
  margin-top: 20px;
  width: 100%;
  max-width: 600px;

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const RecommendationTitle = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 10px;

  @media (max-width: 600px) {
    font-size: 1rem;
    margin-bottom: 5px;
  }
`;

const CropNameTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: black;
  text-align: center;

  @media (max-width: 600px) {
    font-size: 1.2rem;
    margin-bottom: 10px;
  }
`;

const TableContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-start;
  width: 100%;

  @media (max-width: 600px) {
    margin-bottom: 10px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  border: 1px solid #ccc;
  padding: 8px;
  background-color: #f2f2f2;

  @media (max-width: 600px) {
    padding: 4px;
    font-size: 0.8rem;
  }
`;

const TableData = styled.td`
  border: 1px solid #ccc;
  padding: 8px;

  @media (max-width: 600px) {
    padding: 4px;
    font-size: 0.8rem;
  }
`;

const formatValue = (value) => {
  const parsedValue = parseFloat(value);
  if (isNaN(parsedValue)) return 'N/A';
  if (parsedValue % 1 === 0) return parsedValue.toString();
  return parsedValue.toFixed(1);
};

const SoilDataDetails = () => {
  const { state } = useLocation();
  const { soilData, fertilizerData, crop } = state || {};

  return (
    <PageContainer>
      <HeaderContainer>
        <Title>토양 데이터 상세</Title>
      </HeaderContainer>
      {soilData && (
        <RecommendationContainer>
          <CropNameTitle>작물 이름 : {crop}</CropNameTitle>
          <RecommendationTitle>토양 분석 데이터</RecommendationTitle>
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <TableHeader>항목</TableHeader>
                  <TableHeader>값</TableHeader>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <TableData>산도(ACID)</TableData>
                  <TableData>{formatValue(soilData.acid)} (pH)</TableData>
                </tr>
                <tr>
                  <TableData>유기물(OM)</TableData>
                  <TableData>{formatValue(soilData.om)} (g/kg)</TableData>
                </tr>
                <tr>
                  <TableData>인산(VLDPHA)</TableData>
                  <TableData>{formatValue(soilData.vldpha)} (mg/kg)</TableData>
                </tr>
                <tr>
                  <TableData>칼륨(K)</TableData>
                  <TableData>{formatValue(soilData.posifert_K)} (cmol+/kg)</TableData>
                </tr>
                <tr>
                  <TableData>칼슘(Ca)</TableData>
                  <TableData>{formatValue(soilData.posifert_Ca)} (cmol+/kg)</TableData>
                </tr>
                <tr>
                  <TableData>마그네슘(Mg)</TableData>
                  <TableData>{formatValue(soilData.posifert_Mg)} (cmol+/kg)</TableData>
                </tr>
                <tr>
                  <TableData>규산(VLDSIA)</TableData>
                  <TableData>{formatValue(soilData.vldsia)} (mg/kg)</TableData>
                </tr>
                <tr>
                  <TableData>전기전도도(SELC)</TableData>
                  <TableData>{formatValue(soilData.selc)} (dS/m)</TableData>
                </tr>
              </tbody>
            </Table>
          </TableContainer>
          <RecommendationTitle>비료 추천 데이터</RecommendationTitle>
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <TableHeader>항목</TableHeader>
                  <TableHeader>값</TableHeader>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <TableData>밑거름_질소 처방량</TableData>
                  <TableData>{formatValue(fertilizerData.pre_Fert_N)} (kg/10a)</TableData>
                </tr>
                <tr>
                  <TableData>밑거름_인산 처방량</TableData>
                  <TableData>{formatValue(fertilizerData.pre_Fert_P)} (kg/10a)</TableData>
                </tr>
                <tr>
                  <TableData>밑거름_칼리 처방량</TableData>
                  <TableData>{formatValue(fertilizerData.pre_Fert_K)} (kg/10a)</TableData>
                </tr>
                <tr>
                  <TableData>웃거름_질소 처방량</TableData>
                  <TableData>{formatValue(fertilizerData.post_Fert_N)} (kg/10a)</TableData>
                </tr>
                <tr>
                  <TableData>웃거름_인산 처방량</TableData>
                  <TableData>{formatValue(fertilizerData.post_Fert_P)} (kg/10a)</TableData>
                </tr>
                <tr>
                  <TableData>웃거름_칼리 처방량</TableData>
                  <TableData>{formatValue(fertilizerData.post_Fert_K)} (kg/10a)</TableData>
                </tr>
                <tr>
                  <TableData>우분퇴비 처방량</TableData>
                  <TableData>{formatValue(fertilizerData.pre_Compost_Cattl)} (kg/10a)</TableData>
                </tr>
                <tr>
                  <TableData>돈분퇴비 처방량</TableData>
                  <TableData>{formatValue(fertilizerData.pre_Compost_Pig)} (kg/10a)</TableData>
                </tr>
                <tr>
                  <TableData>계분퇴비 처방량</TableData>
                  <TableData>{formatValue(fertilizerData.pre_Compost_Chick)} (kg/10a)</TableData>
                </tr>
                <tr>
                  <TableData>혼합퇴비 처방량</TableData>
                  <TableData>{formatValue(fertilizerData.pre_Compost_Mix)} (kg/10a)</TableData>
                </tr>
              </tbody>
            </Table>
          </TableContainer>
        </RecommendationContainer>
      )}
    </PageContainer>
  );
};

export default SoilDataDetails;