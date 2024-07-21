import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bar, Line } from 'react-chartjs-2';
import { getSessionDetails } from '../../../apis/crop';
import Chart from 'chart.js/auto';
import { CategoryScale, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { useLoading } from "../../../LoadingContext";

Chart.register(CategoryScale, TimeScale);

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #f0f4f8;
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

const InfoTable = styled.table`
  width: 100%;
  max-width: 800px;
  border-collapse: collapse;
  margin-bottom: 20px;

  th, td {
    padding: 16px;
    border: 1px solid #ddd;
    text-align: left;
    font-size: 1.2rem;
  }

  th {
    background-color: #4aaa87;
    color: white;
    font-weight: bold;
  }

  td {
    background-color: #fff;
    color: #333;
  }

  @media (max-width: 768px) {
    th, td {
      font-size: 0.9rem;
      padding: 12px;
    }
  }
`;

const SmallText = styled.p`
  font-size: 0.8rem;
  color: #666;
  margin-top: -10px;
  margin-bottom: 20px;
`;

const ChartContainer = styled.div`
  background-color: #fff;
  padding: 1rem;
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
  height: 400px;
  overflow: auto;
  border: 1px solid #ddd;

  @media (min-width: 768px) {
    height: 600px;
  }
`;

const Tabs = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const TabButton = styled.button`
  background-color: ${props => (props.active ? '#4aaa87' : 'transparent')};
  color: ${props => (props.active ? 'white' : '#4aaa87')};
  border: none;
  border-bottom: ${props => (props.active ? '2px solid #4aaa87' : 'none')};
  padding: 12px 24px;
  margin: 0 8px;
  border-radius: 5px 5px 0 0;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s, transform 0.3s, box-shadow 0.3s;

  &:hover {
    background-color: #4aaa87;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ErrorText = styled.p`
  font-size: 1rem;
  font-weight: 300;
  color: #666;
`;

const Loader = styled.div`
  border: 4px solid #f3f3f3;
  border-radius: 50%;
  border-top: 4px solid #3498db;
  width: 40px;
  height: 40px;
  -webkit-animation: spin 2s linear infinite;
  animation: spin 2s linear infinite;

  @-webkit-keyframes spin {
    0% { -webkit-transform: rotate(0deg); }
    100% { -webkit-transform: rotate(360deg); }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
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

const formatNumber = (num) => {
  if (num >= 1000000000000) {
    return (num / 1000000000000).toFixed(1) + '조원';
  } else if (num >= 100000000) {
    return (num / 100000000).toFixed(1) + '억원';
  } else if (num >= 10000) {
    return (num / 10000).toFixed(1) + '만원';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + '천원';
  } else {
    return num.toLocaleString() + '원';
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
  const [isChartLoading, setIsChartLoading] = useState(false);

  const updateCharts = (details, index) => {
    const cropNames = details.results.map(result => result.crop_name);
    const additionalPrices = details.results.map(result => result.price);
    const barData = generateBarChartData(details.results[index].adjusted_data, cropNames[index]);
    setBarChartData(barData);
    const lineData = generateLineChartData(details.results[index].crop_chart_data, cropNames[index], additionalPrices[index]);
    setLineChartData(lineData);
  };

  useEffect(() => {
    const fetchSessionDetails = async () => {
      const session_id = location.state?.session_id;
      if (!session_id) {
        console.error('No session ID found');
        navigate('/');
        return;
      }
      try {
        setIsLoading(true);
        const response = await getSessionDetails(session_id);
        setSessionDetails(response.data);

        updateCharts(response.data, 0);
      } catch (error) {
        console.error('Error fetching session details:', error);
        if (error.response && error.response.status === 401) {
          alert('사용자 인증이 필요합니다. 로그인 페이지로 이동합니다.');
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionDetails();
  }, [location.state, navigate, setIsLoading]);

  const handleTabClick = (index) => {
    setSelectedCropIndex(index);
    setIsChartLoading(true);
    
    setTimeout(() => {
      if (sessionDetails) {
        updateCharts(sessionDetails, index);
      }
      setIsChartLoading(false);
    }, 500); // 임의의 지연 시간 추가 (로딩 애니메이션이 보이도록)
  };

  if (!sessionDetails || !barChartData || !lineChartData) {
    return <div></div>;
  }

  const cropNames = sessionDetails.results.map(result => result.crop_name);
  const adjustedDataList = sessionDetails.results.map(result => result.adjusted_data);

  return (
    <PageContainer>
      <SectionContainer>
        <InfoTable>
          <thead>
            <tr>
              <th>항목</th>
              <th>값</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>지역</td>
              <td>{sessionDetails.region}</td>
            </tr>
            <tr>
              <td>선택한 작물</td>
              <td>{cropNames.join(', ')}</td>
            </tr>
            <tr>
              <td>토지 면적</td>
              <td>{sessionDetails.land_area.toLocaleString()} 평</td>
            </tr>
            <tr>
              <td>총 수입</td>
              <td>{formatNumber(Math.round(adjustedDataList[selectedCropIndex]["총수입 (원)"]))}</td>
            </tr>
          </tbody>
        </InfoTable>
        <Tabs>
          {cropNames.map((cropName, index) => (
            <TabButton
              key={index}
              active={index === selectedCropIndex}
              onClick={() => handleTabClick(index)}
            >
              {cropName}
            </TabButton>
          ))}
        </Tabs>
        {isChartLoading ? (
          <Loader />
        ) : (
          <>
            <ChartContainer>
              {Object.keys(adjustedDataList[selectedCropIndex]).length > 0 ? (
                <Bar data={barChartData} options={barChartOptions} />
              ) : (
                <ErrorText>차트 데이터를 불러오는 과정에서 문제가 생겼습니다.</ErrorText>
              )}
            </ChartContainer>
            <ChartContainer>
              {sessionDetails.results[selectedCropIndex].crop_chart_data ? (
                <Line
                  data={lineChartData}
                  options={lineChartOptions}
                />
              ) : (
                <ErrorText>라인 데이터를 불러오는 과정에서 문제가 생겼습니다.</ErrorText>
              )}
            </ChartContainer>
          </>
        )}
      </SectionContainer>
    </PageContainer>
  );
};

export default SessionDetails;
