// SoilResults.jsx
import React from "react";
import styled from "styled-components";

const RecommendationContainer = styled.div`
  width: 100%;
  max-width: 800px;
  background-color: #fff;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 2rem;
`;

const CropInfoContainer = styled.div`
  margin-bottom: 1.5rem;
  text-align: left;
`;

const CropInfo = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;

  @media (max-width: 600px) {
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }
`;

const CropInfoText = styled.span`
  color: darkslategray;
  margin-left: 0.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #4aaa87;

  @media (max-width: 600px) {
    font-size: 1.2rem;
    margin-bottom: 0.75rem;
  }
`;

const TableContainer = styled.div`
  margin-bottom: 1.5rem;
  width: 100%;
  overflow-x: auto;

  @media (max-width: 600px) {
    margin-bottom: 1rem;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  border: 1px solid #ddd;
  padding: 0.75rem;
  background-color: #4aaa87;
  color: #fff;
  text-align: left;
  font-weight: normal;

  @media (max-width: 600px) {
    padding: 0.5rem;
    font-size: 0.875rem;
  }
`;

const TableData = styled.td`
  border: 1px solid #ddd;
  padding: 0.75rem;
  text-align: left;

  @media (max-width: 600px) {
    padding: 0.5rem;
    font-size: 0.875rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const Button = styled.button`
  background-color: #4aaa87;
  color: white;
  padding: 1rem 2.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.2rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
  margin-top: 1rem;

  &:hover {
    background-color: #3b8b6d;
  }

  @media (max-width: 600px) {
    padding: 0.8rem 1.8rem;
    font-size: 1rem;
  }
`;

const formatValue = (value) => {
  const parsedValue = parseFloat(value);
  if (isNaN(parsedValue)) return 'N/A';
  if (parsedValue % 1 === 0) return parsedValue.toString();
  return parsedValue.toFixed(1);
};

const SoilResults = ({ cropName, selectedSoilSample, fertilizerData, handleBackToList }) => (
  <RecommendationContainer>
    <CropInfoContainer>
      <CropInfo>작물: <CropInfoText>{cropName}</CropInfoText></CropInfo>
      <CropInfo>상세 주소: <CropInfoText>{selectedSoilSample.PNU_Nm}</CropInfoText></CropInfo>
    </CropInfoContainer>
    <SectionTitle>토양 분석 데이터</SectionTitle>
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
            <TableData>산도 (ACID)</TableData>
            <TableData>{formatValue(selectedSoilSample.ACID)} (pH)</TableData>
          </tr>
          <tr>
            <TableData>유기물 (OM)</TableData>
            <TableData>{formatValue(selectedSoilSample.OM)} (g/kg)</TableData>
          </tr>
          <tr>
            <TableData>인산 (VLDPHA)</TableData>
            <TableData>{formatValue(selectedSoilSample.VLDPHA)} (mg/kg)</TableData>
          </tr>
          <tr>
            <TableData>칼륨 (K)</TableData>
            <TableData>{formatValue(selectedSoilSample.POSIFERT_K)} (cmol+/kg)</TableData>
          </tr>
          <tr>
            <TableData>칼슘 (Ca)</TableData>
            <TableData>{formatValue(selectedSoilSample.POSIFERT_CA)} (cmol+/kg)</TableData>
          </tr>
          <tr>
            <TableData>마그네슘 (Mg)</TableData>
            <TableData>{formatValue(selectedSoilSample.POSIFERT_MG)} (cmol+/kg)</TableData>
          </tr>
          <tr>
            <TableData>규산 (VLDSIA)</TableData>
            <TableData>{formatValue(selectedSoilSample.VLDSIA)} (mg/kg)</TableData>
          </tr>
          <tr>
            <TableData>전기전도도 (SELC)</TableData>
            <TableData>{formatValue(selectedSoilSample.SELC)} (dS/m)</TableData>
          </tr>
        </tbody>
      </Table>
    </TableContainer>
    <SectionTitle>비료 처방량</SectionTitle>
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
            {fertilizerData.map((item, index) => (
              <TableData key={index}>{item.pre_Fert_N} (kg/10a)</TableData>
            ))}
          </tr>
          <tr>
            <TableData>밑거름_인산 처방량</TableData>
            {fertilizerData.map((item, index) => (
              <TableData key={index}>{item.pre_Fert_P} (kg/10a)</TableData>
            ))}
          </tr>
          <tr>
            <TableData>밑거름_칼리 처방량</TableData>
            {fertilizerData.map((item, index) => (
              <TableData key={index}>{item.pre_Fert_K} (kg/10a)</TableData>
            ))}
          </tr>
          <tr>
            <TableData>웃거름_질소 처방량</TableData>
            {fertilizerData.map((item, index) => (
              <TableData key={index}>{item.post_Fert_N} (kg/10a)</TableData>
            ))}
          </tr>
          <tr>
            <TableData>웃거름_인산 처방량</TableData>
            {fertilizerData.map((item, index) => (
              <TableData key={index}>{item.post_Fert_P} (kg/10a)</TableData>
            ))}
          </tr>
          <tr>
            <TableData>웃거름_칼리 처방량</TableData>
            {fertilizerData.map((item, index) => (
              <TableData key={index}>{item.post_Fert_K} (kg/10a)</TableData>
            ))}
          </tr>
          <tr>
            <TableData>우분퇴비 처방량</TableData>
            {fertilizerData.map((item, index) => (
              <TableData key={index}>{item.pre_Compost_Cattl} (kg/10a)</TableData>
            ))}
          </tr>
          <tr>
            <TableData>돈분퇴비 처방량</TableData>
            {fertilizerData.map((item, index) => (
              <TableData key={index}>{item.pre_Compost_Pig} (kg/10a)</TableData>
            ))}
          </tr>
          <tr>
            <TableData>계분퇴비 처방량</TableData>
            {fertilizerData.map((item, index) => (
              <TableData key={index}>{item.pre_Compost_Chick} (kg/10a)</TableData>
            ))}
          </tr>
          <tr>
            <TableData>혼합퇴비 처방량</TableData>
            {fertilizerData.map((item, index) => (
              <TableData key={index}>{item.pre_Compost_Mix}(kg/10a)</TableData>
            ))}
          </tr>
        </tbody>
      </Table>
    </TableContainer>
    <ButtonContainer>
      <Button onClick={handleBackToList}>목록으로 돌아가기</Button>
    </ButtonContainer>
  </RecommendationContainer>
);

export default SoilResults;