import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bar, Line } from 'react-chartjs-2';
import { getSessionDetails } from '../../../apis/crop'; // axios 호출을 분리한 파일에서 가져옴
import Chart from 'chart.js/auto';
import { CategoryScale, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { useLoading } from "../../../LoadingContext";

Chart.register(CategoryScale, TimeScale);

const secondaryColor = '#45a049';
const backgroundColor = '#f0f4f8';
const boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';

const PageContainer = styled.div`
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: ${backgroundColor};
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
  flex-wrap: wrap;
  gap: 20px;

  @media (min-width: 768px) {
    gap: 50px;
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
  box-shadow: ${boxShadow};
  width: 30%;
  height: 70px;
  border: 1px solid #ddd;
  font-weight: 500;
  transition: transform 0.3s, box-shadow 0.3s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    width: 80%;
  }

  @media (min-width: 768px) {
    width: 20%;
  }
`;

const BarChartBox = styled.div`
  background-color: #fff;
  padding: 1rem;
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  box-shadow: ${boxShadow};
  width: 100%;
  height: 400px;
  overflow: auto;
  border: 1px solid #ddd;
`;

const CropButton = styled.button`
  background-color: #4aaa87;
  color: white;
  border: none;
  padding: 12px 24px;
  margin: 8px;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s, box-shadow 0.3s;

  &:hover {
    background-color: ${secondaryColor};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const FixedLargeBox = styled(BarChartBox)`
  height: 400px;
  @media (min-width: 768px) {
    width: 100%;
    height: 600px;
  }
`;

const FixedWideBox = styled(BarChartBox)`
  width: 100%;
  height: 400px;
  @media (min-width: 768px) {
    height: 600px;
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #4aaa87;
  margin-bottom: 1rem;
`;

const Subtitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 400;
  color: #333;
  margin-bottom: 1rem;
`;

const ErrorText = styled.p`
  font-size: 1rem;
  font-weight: 300;
  color: #666;
`;

const columns = [
  "총수입 (원)", "총생산비 (원)", "총경영비", "총중간재비",
  "농약비", "수도광열비", "고용노동비", "자가노동비",
  "부가가치 (원)", "소득 (원)",
];

const generateBarChartData = (adjustedData, cropName) => {
  const labels = columns;
  const data = columns.map(column => adjustedData[column]);

  return {
    labels,
    datasets: [
      {
        label: cropName,
        data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      }
    ]
  };
};

const generateLineChartData = (cropChartData, cropName, additionalPrice) => {
  const labels = cropChartData.map(data => new Date(data.tm));
  const data = cropChartData.map(data => data.price);

  return {
    labels,
    datasets: [
      {
        label: `${cropName} 가격`,
        data,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: `다음날 예측 도매가: ${additionalPrice}원`,
        data: Array(data.length).fill(additionalPrice),
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
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
        text: 'Value (₩)'
      }
    }
  },
  plugins: {
    legend: {
      display: true
    }
  }
};

const barChartOptions = {
  maintainAspectRatio: false,
  scales: {
    x: {
      ticks: {
        autoSkip: false,
        maxRotation: 90,
        minRotation: 45
      }
    }
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          label += Math.round(context.raw).toLocaleString();
          return label;
        }
      }
    },
    datalabels: {
      display: true,
      align: 'end',
      anchor: 'end',
      formatter: function(value) {
        return Math.round(value).toLocaleString();
      }
    }
  }
};

const SessionDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedCropIndex, setSelectedCropIndex] = useState(0);
  const [sessionDetails, setSessionDetails] = useState(null);
  const [barChartData, setBarChartData] = useState(null);
  const [lineChartData, setLineChartData] = useState(null);
  const { setIsLoading } = useLoading();

  useEffect(() => {
    const fetchSessionDetails = async () => {
      const session_id = location.state?.session_id;
      if (!session_id) {
        console.error('No session ID found');
        navigate('/');
        return;
      }
      try {
        setIsLoading(true); // 로딩 시작
        const response = await getSessionDetails(session_id);
        setSessionDetails(response.data);

        const resultData = response.data;
        const adjustedDataList = resultData?.results?.map(result => result.adjusted_data) || [];
        const cropNames = resultData?.results?.map(result => result.crop_name) || [];
        const additionalPrices = resultData?.results?.map(result => result.price) || [];

        if (adjustedDataList.length > 0) {
          const barData = generateBarChartData(adjustedDataList[0], cropNames[0]);
          setBarChartData(barData);
        }

        if (resultData.results && resultData.results.length > 0) {
          const crop_chart_data = resultData.results.flatMap(result => result.crop_chart_data);
          const lineData = generateLineChartData(crop_chart_data, cropNames[0], additionalPrices[selectedCropIndex]);
          setLineChartData(lineData);
        }

      } catch (error) {
        console.error('Error fetching session details:', error);
        if (error.response && error.response.status === 401) {
          alert('사용자 인증이 필요합니다. 로그인 페이지로 이동합니다.');
          navigate('/login');
        }
      } finally {
        setIsLoading(false); // 로딩 끝
      }
    };

    fetchSessionDetails();
  }, [location.state, navigate, selectedCropIndex, setIsLoading]);

  if (!sessionDetails || !barChartData || !lineChartData) {
    return <div></div>;
  }

  const cropNames = sessionDetails.results.map(result => result.crop_name);
  const adjustedDataList = sessionDetails.results.map(result => result.adjusted_data);

  return (
    <PageContainer>
      <Title>세션 세부 정보</Title>
      <SectionContainer>
        <BoxContainer>
          <Box>
            <Subtitle>선택한 작물</Subtitle>
            {cropNames.join(', ')}
          </Box>
          <Box>
            <Subtitle>토지 면적(평)</Subtitle>
            {sessionDetails.land_area.toLocaleString()}
          </Box>
          <Box>
            <Subtitle>총 수입(원)</Subtitle>
            {Math.round(adjustedDataList[selectedCropIndex]["총수입 (원)"]).toLocaleString()}
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
          {Object.keys(adjustedDataList[selectedCropIndex]).length > 0 ? (
            <Bar data={generateBarChartData(adjustedDataList[selectedCropIndex], cropNames[selectedCropIndex])} options={barChartOptions} />
          ) : (
            <ErrorText>차트 데이터를 불러오는 과정에서 문제가 생겼습니다.</ErrorText>
          )}
        </FixedLargeBox>
        <FixedWideBox>
          {sessionDetails.results[selectedCropIndex].crop_chart_data ? (
            <Line
              data={generateLineChartData(sessionDetails.results[selectedCropIndex].crop_chart_data, cropNames[selectedCropIndex], sessionDetails.results[selectedCropIndex].price)}
              options={lineChartOptions}
            />
          ) : (
            <ErrorText>라인 데이터를 불러오는 과정에서 문제가 생겼습니다.</ErrorText>
          )}
        </FixedWideBox>
      </SectionContainer>
    </PageContainer>
  );
};

export default SessionDetails;