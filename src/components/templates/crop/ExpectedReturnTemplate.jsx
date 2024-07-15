import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bar, Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

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

const SectionContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 1rem 0;
  flex: 1;
`;

const BoxContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
  margin: 1rem 0;
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
  width: 50%;
  height: 50px; // 조정된 높이
  overflow: auto;
  border: 1px solid #ddd;
`;

const BarChartBox = styled.div`
  background-color: #fff;
  padding: 1rem;
  margin: 0.5rem 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 90%;
  height: 400px; // 조정된 높이
  overflow: auto;
  border: 1px solid #ddd;
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

const FixedLargeBox = styled(BarChartBox)`
  height: 400px; // Fixed height for large content
  @media (min-width: 768px) {
    width: 100%; // Takes full width on larger screens
    height: 600px; // Larger height on larger screens
  }
`;

const FixedWideBox = styled(BarChartBox)`
  width: 100%; // 가능한 전체 너비를 차지하도록 설정
  height: 400px; // 필요에 따라 높이 조정
  @media (min-width: 768px) {
    height: 600px; // 더 큰 화면에는 더 큰 높이
  }
`;

const ExpectedReturnTemplate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [chartData, setChartData] = useState([]);
  const [selectedCropIndex, setSelectedCropIndex] = useState(0);
  const [cropNames, setCropNames] = useState(location.state?.cropNames || []);
  const [landArea, setLandArea] = useState(location.state?.landArea || '');
  const [resultData, setResultData] = useState(location.state?.result || {});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sampleData = {
          chartData: { /* 차트 데이터 샘플 */ },
          wholesalePrediction: 'Sample Wholesale Prediction'
        };

        setChartData(sampleData.chartData);
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
    "총수입 (원)", "총생산비 (원)", "총경영비", "총중간재비",
    "농약비", "수도광열비", "소득구비", "보통비료비",
    "고용노동비", "자가노동비", "부가가치 (원)", "소득 (원)",
  ];

  const adjustedDataList = resultData?.results?.map(result => result.adjusted_data) || [];

  const generateBarChartData = (adjustedData, cropName) => {
    const labels = columns;
    const data = columns.map(column => adjustedData[column]);

    const backgroundColors = [
      'rgba(255, 99, 132, 0.6)',
      'rgba(54, 162, 235, 0.6)',
      'rgba(255, 206, 86, 0.6)',
      'rgba(75, 192, 192, 0.6)',
      'rgba(153, 102, 255, 0.6)',
      'rgba(255, 159, 64, 0.6)',
      'rgba(255, 99, 132, 0.6)',
      'rgba(54, 162, 235, 0.6)',
      'rgba(255, 206, 86, 0.6)',
      'rgba(75, 192, 192, 0.6)',
      'rgba(153, 102, 255, 0.6)',
      'rgba(255, 159, 64, 0.6)',
    ];

    const borderColors = [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)',
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)',
    ];

    return {
      labels: labels,
      datasets: [
        {
          label: cropName,
          data: data,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
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

  const generateLineChartData = (cropChartData, cropName) => {
    const labels = cropChartData.map(data => data.tm);
    const data = cropChartData.map(data => data.price);

    return {
      labels,
      datasets: [
        {
          label: cropName,
          data: data,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }
      ]
    };
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          tooltipFormat: 'MM/dd/yyyy'
        },
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Price (₩)'
        }
      }
    },
    plugins: {
      legend: {
        display: true
      }
    }
  };

  return (
    <PageContainer>
      <SectionContainer>
        <BoxContainer>
          <Box>
            {cropNames.length > 0 ? cropNames.join(', ') : 'Sample Crop Data'}
          </Box>
          <Box>
            {landArea ? `Land Area: ${landArea}` : 'Sample Area Data'}
          </Box>
          <Box>
            {resultData.total_income ? `Total Income: ${resultData.total_income}` : 'Sample Wholesale Prediction'}
          </Box>
        </BoxContainer>
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
            '차트 데이터를 불러오는 과정에서 문제가 생겼습니다.'
          )}
        </FixedLargeBox>
        <FixedWideBox>
          {resultData.results && resultData.results[selectedCropIndex].crop_chart_data ? (
            <Line
              data={generateLineChartData(resultData.results[selectedCropIndex].crop_chart_data, cropNames[selectedCropIndex])}
              options={lineChartOptions}
            />
          ) : (
            '라인 데이터를 불러오는 과정에서 문제가 생겼습니다.'
          )}
        </FixedWideBox>
      </SectionContainer>
    </PageContainer>
  );
};

export default ExpectedReturnTemplate;