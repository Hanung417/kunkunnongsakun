import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #f0f4f8;
  font-size: 1rem;
  font-family: 'Roboto', sans-serif;
  height: 100vh;
  box-sizing: border-box;
  overflow: auto;
`;

const Header = styled.div`
  width: 100%;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #a5d6a7; /* light green */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
`;

const HeaderButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
`;

const Title = styled.div`
  color: #fff;
  font-size: 1.5rem;
`;

const SectionContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin: 1rem 0;
  flex: 1;
  overflow: hidden;
`;

const SubSectionContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: nowrap;
  }
`;

const Box = styled.div`
  background-color: #fff;
  padding: 1rem;
  margin: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  flex: 1;
  overflow: auto;
  border: 1px solid #ddd; /* 테두리 추가 */
`;

const FixedLargeBox = styled(Box)`
  width: 100%;
  height: 400px;
  @media (min-width: 768px) {
    flex: 3;
    max-width: 65%;
    min-width: 400px;
    height: 600px;
  }
`;

const FixedWideBox = styled(Box)`
  width: 100%;
  height: 200px;
  @media (min-width: 768px) {
    flex: 1;
    max-width: 35%;
    min-width: 200px;
    height: 600px;
  }
`;

const Footer = styled.div`
  width: 100%;
  padding: 1rem;
  display: flex;
  justify-content: space-around;
  background-color: #fff;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
`;

const FooterButton = styled.button`
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  color: #4CAF50;
`;

const CropButton = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 5px;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #45a049;
  }
`;

const ExpectedReturnTemplate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [chartData, setChartData] = useState([]);
  const [selectedCropIndex, setSelectedCropIndex] = useState(0);
  const [plantStatus, setPlantStatus] = useState({
    age: null,
    humidity: null,
    status: null
  });
  const [cropNames, setCropNames] = useState(location.state?.cropNames || []);
  const [landArea, setLandArea] = useState(location.state?.landArea || '');
  const [resultData, setResultData] = useState(location.state?.result || {});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sampleData = {
          chartData: { /* 차트 데이터 샘플 */ },
          plantStatus: {
            age: '2 years',
            humidity: '50%',
            status: 'Healthy'
          },
          wholesalePrediction: 'Sample Wholesale Prediction'
        };

        setChartData(sampleData.chartData);
        setPlantStatus(sampleData.plantStatus);
      } catch (error) {
        console.error('데이터를 가져오는데 실패했습니다:', error);
      }
    };

    fetchData();
  }, []);

  const navigateToMainPage = () => {
    navigate("/");
  };

  const navigateToCropsPage = () => {
    navigate("/crops");
  };

  const columns = [
    "총수입 (원)", "농가수취가격 (원/kg)", "총생산비 (원)", "총경영비", "총중간재비",
    "초기투자비용", "보통(무기질)비료비", "부산물(유기질)비료비", "농약비", "수도광열비", "기타재료비",
    "소득구비", "대농구상각비", "영농시설상각비", "수리·유지비", "기타비용", "농기계·시설 임차료",
    "토지임차료", "위탁영농비", "고용노동비", "자가노동비", "유동자본 용역비", "고정자본 용역비",
    "토지자본 용역비", "부가가치 (원)", "소득 (원)"
  ];

  const adjustedDataList = resultData?.results?.map(result => result.adjusted_data) || [];

  const generateBarChartData = (adjustedData, cropName) => {
    const labels = columns;
    const data = columns.map(column => adjustedData[column]);

    return {
      labels: labels,
      datasets: [
        {
          label: cropName,
          data: data,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }
      ],
    };
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 90,
          minRotation: 45
        }
      }
    }
  };

  return (
    <PageContainer>
      <Header>
        <HeaderButton onClick={navigateToCropsPage}>뒤로</HeaderButton>
        <Title>작물별 예상 수익률</Title>
        <HeaderButton>알림</HeaderButton>
      </Header>

      <SectionContainer>
        <SubSectionContainer>
          <Box>
            {cropNames.length > 0 ? cropNames.join(', ') : 'Sample Crop Data'}
          </Box>
          <Box>
            {landArea ? `Land Area: ${landArea}` : 'Sample Area Data'}
          </Box>
          <Box>
            {resultData.total_income ? `Total Income: ${resultData.total_income}` : 'Sample Wholesale Prediction'}
          </Box>
        </SubSectionContainer>
        <SubSectionContainer>
          <div>
            {cropNames.map((cropName, index) => (
              <CropButton key={index} onClick={() => setSelectedCropIndex(index)}>
                {cropName}
              </CropButton>
            ))}
          </div>
          <FixedLargeBox>
            {adjustedDataList[selectedCropIndex] && Object.keys(adjustedDataList[selectedCropIndex]).length > 0 ? (
              <Bar data={generateBarChartData(adjustedDataList[selectedCropIndex], cropNames[selectedCropIndex])} options={options} />
            ) : (
              '차트 데이터'
            )}
          </FixedLargeBox>
          <FixedWideBox>세부 정보 1</FixedWideBox>
        </SubSectionContainer>
      </SectionContainer>

      <Footer>
        <FooterButton onClick={navigateToMainPage}>홈</FooterButton>
        <FooterButton>기타</FooterButton>
        <FooterButton>마이페이지</FooterButton>
      </Footer>
    </PageContainer>
  );
};

export default ExpectedReturnTemplate;
