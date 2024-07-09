import React, { useState } from 'react';
import styled from 'styled-components';
import { AiOutlineBell } from 'react-icons/ai';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #f0f0f0;
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

const Content = styled.div`
  width: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
`;

const Label = styled.label`
  font-size: 1rem;
  margin: 0.5rem 0;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
`;

const Button = styled.button`
  background-color: #a5d6a7;
  border: none;
  border-radius: 50px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  color: #fff;
  cursor: pointer;
  margin-top: 1rem;
  width: auto;
`;

const ResultContainer = styled.div`
  text-align: center;
  margin-top: 20px;
  background: #fff;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Table = styled.table`
  margin: 0 auto;
  border: 1px solid #ccc;
  border-collapse: collapse;
  width: 100%;
`;

const Th = styled.th`
  border: 1px solid #ccc;
  padding: 8px;
  background-color: #f9f9f9;
`;

const Td = styled.td`
  border: 1px solid #ccc;
  padding: 8px;
`;

const SoilPage = () => {
  const [criteria, setCriteria] = useState({
    kyoengji: '전체',
    area: '전라남도',
    district: '영암군',
    town: '신북면',
    village: '유곡리',
    plot: '',
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setCriteria({ ...criteria, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`/api/soil?criteria=${encodeURIComponent(JSON.stringify(criteria))}`);
      if (!response.ok) {
        throw new Error('네트워크 응답이 정상이 아닙니다.');
      }
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('API 요청에 실패했습니다:', error);
      const mockData = {
        pH: 5.8,
        organicMatter: 23.5,
        availablePhosphorus: 199.4,
        cationExchangeCapacity: {
          potassium: 0.7,
          calcium: 5.9,
          magnesium: 1.9,
        },
        electricalConductivity: 0.7,
        availableSilicon: 102.4,
      };
      setResult(mockData);
    }
  };

  return (
    <PageContainer>
      <HeaderContainer>
        <Title>토양검정</Title>
        <IconContainer>
          <Icon><AiOutlineBell size={24} color="#fff" /></Icon>
        </IconContainer>
      </HeaderContainer>
      <Content>
        <Form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
          <Label htmlFor="kyoengji">경지구분</Label>
          <Input id="kyoengji" name="kyoengji" value={criteria.kyoengji} onChange={handleChange} />
          <Label htmlFor="area">지역</Label>
          <Input id="area" name="area" value={criteria.area} onChange={handleChange} />
          <Label htmlFor="district">시/군</Label>
          <Input id="district" name="district" value={criteria.district} onChange={handleChange} />
          <Label htmlFor="town">읍/면</Label>
          <Input id="town" name="town" value={criteria.town} onChange={handleChange} />
          <Label htmlFor="village">리/동</Label>
          <Input id="village" name="village" value={criteria.village} onChange={handleChange} />
          <Label htmlFor="plot">지번 조회</Label>
          <Input id="plot" name="plot" value={criteria.plot} onChange={handleChange} />
          <Button type="submit">조회</Button>
        </Form>
        {result && (
          <ResultContainer>
            <h2>전라남도 영암군 신북면 유곡리 화학성 평균</h2>
            <Table>
              <thead>
                <tr>
                  <Th>pH (1:5)</Th>
                  <Th>유기물 (g/kg)</Th>
                  <Th>유효인산 (mg/kg)</Th>
                  <Th>치환성 양이온(cmol+/kg)</Th>
                  <Th>전기전도도 (dS/m)</Th>
                  <Th>유효규산 (mg/kg)</Th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <Td>{result.pH}</Td>
                  <Td>{result.organicMatter}</Td>
                  <Td>{result.availablePhosphorus}</Td>
                  <Td>
                    칼륨: {result.cationExchangeCapacity.potassium},<br />
                    칼슘: {result.cationExchangeCapacity.calcium},<br />
                    마그네슘: {result.cationExchangeCapacity.magnesium}
                  </Td>
                  <Td>{result.electricalConductivity}</Td>
                  <Td>{result.availableSilicon}</Td>
                </tr>
              </tbody>
            </Table>
          </ResultContainer>
        )}
      </Content>
    </PageContainer>
  );
};

export default SoilPage;
