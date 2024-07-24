import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bar, Line } from 'react-chartjs-2';
import { getSessionDetails } from '../../../apis/crop';
import Chart from 'chart.js/auto';
import { CategoryScale, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { useLoading } from "../../../LoadingContext";
import GlobalLoader from "../../atoms/GlobalLoader";

Chart.register(CategoryScale, TimeScale);

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  box-sizing: border-box;
  overflow: auto;
`;

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 900px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 0.5rem 2rem;
`;

const SectionContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start; 
  justify-content: center;
  margin: 0.5rem 0;
  flex: 1;
`;

const InfoTableContainer = styled.div`
  width: 100%;
  margin-bottom: 20px;
  overflow: auto;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  color: #4aaa87;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 600px) {
    font-size: 1.2rem;
  }
`;

const InfoTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 12px;
    border: 1px solid #ddd;
    text-align: left;
    font-size: 1.2rem; 
  }

  td:first-child {
    width: 40%;
    font-weight: 600;
    background-color: #f9f9f9;
  }

  td:last-child {
    width: 50%;
  }

  @media (max-width: 768px) {
    th, td {
      font-size: 1.0rem; 
      padding: 8px;
    }
  }
`;

const ExplanationText = styled.p`
  font-size: 0.8rem;
  color: #666;
`;

const Divider = styled.hr`
  width: 100%;
  height: 1px;
  background-color: #ccc;
  margin: 10px 0; 
`;

const ChartContainer = styled.div`
  background-color: #fff;
  padding: 1rem;
  margin: 0.4rem 0;
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
  gap: 5px;
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
  margin-bottom: 1rem;

  &:hover {
    background-color: #3b8b6d;
  }

  @media (max-width: 600px) {
    padding: 0.8rem 1.8rem;
    font-size: 1rem;
  }
`;

const columns = [
  "농약비", "초기투자비용", "보통(무기질)비료비", "부산물(유기질)비료비",
  "기타재료비", "수도광열비", "수리·유지비", "농기계·시설 임차료",
  "토지임차료", "기타비용"
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
      labels: {
        color: 'black'  // 레이블 색상을 검정색으로 설정
      },
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
    legend: {
      labels: {
        color: 'black'  // 레이블 색상을 검정색으로 설정
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
  } else if (num >= 10000000) {
    return (num / 10000000).toFixed(1) + '천만원';
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + '백만원';
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
  const { setIsLoading, isLoading } = useLoading();
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

    if (sessionDetails) {
      updateCharts(sessionDetails, index);
    }

    setIsChartLoading(false);
  };

  const handleBackToList = () => {
    navigate('/cropselection');
  };


  if (!sessionDetails || !barChartData || !lineChartData) {
    return <div></div>;
  }

  const cropNames = sessionDetails.results.map(result => result.crop_name);
  const adjustedDataList = sessionDetails.results.map(result => result.adjusted_data);

  return (
    <PageContainer>
      {isLoading && <GlobalLoader />}
      <LayoutContainer>
        <SectionContainer>
          <InfoTableContainer>
            <InfoTable>
              <SectionTitle>작물 조합의 예상 총 수입</SectionTitle>
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
                  <td>작물 조합 총 소득 (연간)</td>
                  <td>{formatNumber(Math.round(sessionDetails.total_income))}</td>
                </tr>
              </tbody>
            </InfoTable>
          </InfoTableContainer>
          <Divider />
          <SectionTitle>작물별 상세 정보</SectionTitle>
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
            <InfoTable>
              <tbody>
                <tr>
                  <td>예상 총 수입<br/>(연간)</td>
                  <td>{formatNumber(Math.round(adjustedDataList[selectedCropIndex]["총수입 (원)"]))}</td>
                </tr>
                <tr>
                  <td>예상 총 경영비<br/>(연간)</td>
                  <td>{formatNumber(Math.round(adjustedDataList[selectedCropIndex]["총경영비"]))}</td>
                </tr>
                <tr>
                  <td>예상 총 소득<br/>(연간)</td>
                  <td>{formatNumber(Math.round(adjustedDataList[selectedCropIndex]["소득 (원)"]))}</td>
                </tr>
                <tr>
                  <td>예상 자가노동비</td>
                  <td>{formatNumber(Math.round(adjustedDataList[selectedCropIndex]["자가노동비"]))}</td>
                </tr>
                <tr>
                  <td>예상 고용노동비</td>
                  <td>{formatNumber(Math.round(adjustedDataList[selectedCropIndex]["고용노동비"]))}</td>
                </tr>
              </tbody>
            </InfoTable>
            <ExplanationText>
              * 총 수입 = 총 경영비 + 총 소득
            </ExplanationText>
              <SectionTitle>그 외 예상 비용</SectionTitle>
              <ChartContainer>
                {Object.keys(adjustedDataList[selectedCropIndex]).length > 0 ? (
                  <Bar data={barChartData} options={barChartOptions} />
                ) : (
                  <ErrorText>차트 데이터를 불러오는 과정에서 문제가 생겼습니다.</ErrorText>
                )}
              </ChartContainer>
              <SectionTitle>작물별 도매 정보</SectionTitle>
              <InfoTable>
                <tbody>
                  <tr>
                    <td>작물명</td>
                    <td>{sessionDetails.results[selectedCropIndex].crop_name}</td>
                  </tr>
                  <tr>
                    <td>내일 예상 도매가 (단위:1kg)</td>
                    <td>{sessionDetails.results[selectedCropIndex].price} 원</td>
                  </tr>
                  <tr>
                    <td>모델 학습 결과 (RMSE)</td>
                    <td>{sessionDetails.results[selectedCropIndex].rmse.toFixed(1)}</td>
                  </tr>
                  <tr>
                    <td>모델 학습 결과 (R2)</td>
                    <td>{sessionDetails.results[selectedCropIndex].r2_score.toFixed(3)}</td>
                  </tr>
                </tbody>
              </InfoTable>
              <ExplanationText>
                RMSE: 모델 예측값과 실제값 간의 차이를 제곱한 평균을 구한 후 제곱근을 취한 값.<br/>
                R2 score: 모델의 설명력을 나타내는 지표, 1에 가까울 수록 모델이 데이터를 잘 설명함<br/>
                <br/>* 예상 도매가는 실제값과 다를 수 있습니다.
              </ExplanationText>
              <SectionTitle>지난 1년간 일일 도매가</SectionTitle>
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
        <ButtonContainer>
          <Button onClick={handleBackToList}>목록으로 돌아가기</Button>
        </ButtonContainer>
      </LayoutContainer>
    </PageContainer>
  );
};

export default SessionDetails;