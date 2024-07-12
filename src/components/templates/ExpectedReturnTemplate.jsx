import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bar, Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
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
  overflow: hidden;
  border: 1px solid #ddd;
`;

const ChartBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const ResponsiveBox = styled(Box)`
  width: 100%;
  height: 80vh; /* 바 차트 높이 조정 */
  @media (min-width: 768px) {
    height: 80vh; /* 바 차트 높이 조정 */
  }
`;

const ResponsiveLineBox = styled(Box)`
  width: 100%;
  height: 50vh; /* 라인 차트 높이 조정 */
  @media (min-width: 768px) {
    height: 50vh; /* 라인 차트 높이 조정 */
  }
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
  const [selectedCropIndex, setSelectedCropIndex] = useState(0);
  const [cropNames, setCropNames] = useState(location.state?.cropNames || []);
  const [landArea, setLandArea] = useState(location.state?.landArea || '');
  const [resultData, setResultData] = useState(location.state?.result || {});

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

    const backgroundColors = [
      'rgba(255, 99, 132, 0.8)',
      'rgba(54, 162, 235, 0.8)',
      'rgba(255, 206, 86, 0.8)',
      'rgba(75, 192, 192, 0.8)',
      'rgba(153, 102, 255, 0.8)',
      'rgba(255, 159, 64, 0.8)',
      'rgba(199, 199, 199, 0.8)',
      'rgba(83, 102, 255, 0.8)',
      'rgba(102, 159, 64, 0.8)',
      'rgba(123, 99, 132, 0.8)',
      'rgba(210, 162, 235, 0.8)',
      'rgba(255, 206, 100, 0.8)',
      'rgba(100, 192, 192, 0.8)',
      'rgba(153, 99, 255, 0.8)',
      'rgba(255, 159, 120, 0.8)',
      'rgba(100, 159, 199, 0.8)',
      'rgba(159, 102, 255, 0.8)',
      'rgba(159, 64, 255, 0.8)',
      'rgba(102, 255, 64, 0.8)',
      'rgba(64, 255, 102, 0.8)',
      'rgba(99, 132, 255, 0.8)',
      'rgba(162, 210, 235, 0.8)',
      'rgba(206, 100, 255, 0.8)',
      'rgba(192, 100, 192, 0.8)',
      'rgba(255, 102, 153, 0.8)',
      'rgba(159, 120, 255, 0.8)'
    ];

    return {
      labels: labels,
      datasets: [
        {
          label: cropName,
          data: data,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map(color => color.replace('0.8', '1')),
          borderWidth: 2, // 바의 테두리 두께
          hoverBorderWidth: 2,
          barThickness: 15, // 바 두께 조정
        }
      ],
    };
  };

  const barChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12 // 범례 폰트 크기
          }
        }
      },
      title: {
        display: true,
        text: '작물별 예상 수익률',
        font: {
          size: 16 // 타이틀 폰트 크기
        }
      }
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 0,
          font: {
            size: 10, // x축 폰트 크기
          }
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 10, // y축 폰트 크기
          },
          callback: function(value) { // y축 값 포맷팅
            return value.toLocaleString(); // 천 단위 콤마 추가
          }
        }
      }
    },
    hover: {
      mode: 'nearest',
      intersect: true,
      onHover: (event, chartElement) => {
        if (chartElement.length) {
          event.native.target.style.cursor = 'pointer';
        } else {
          event.native.target.style.cursor = 'default';
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
          borderWidth: 2, // 선의 두께
          pointRadius: 1, // 데이터 포인트 크기 감소
          tension: 0.1
        }
      ]
    };
  };

  const lineChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          tooltipFormat: 'MM/dd/yyyy'
        },
        title: {
          display: true,
          text: 'Date',
          font: {
            size: 12 // x축 제목 폰트 크기
          }
        },
        ticks: {
          font: {
            size: 10, // x축 폰트 크기
          }
        }
      },
      y: {
        title: {
          display: true,
          text: 'Price (₩)',
          font: {
            size: 12 // y축 제목 폰트 크기
          }
        },
        ticks: {
          font: {
            size: 10, // y축 폰트 크기
          },
          callback: function(value) { // y축 값 포맷팅
            return value.toLocaleString(); // 천 단위 콤마 추가
          }
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          font: {
            size: 12 // 범례 폰트 크기
          }
        }
      },
      title: {
        display: true,
        text: '작물별 일별 도매가',
        font: {
          size: 16 // 타이틀 폰트 크기
        }
      }
    }
  };

  return (
    <PageContainer>
      <SectionContainer>
        <SubSectionContainer>
          <Box>
            {cropNames.length > 0 ? cropNames.join(', ') : 'Crop Data Not Available'}
          </Box>
          <Box>
            {landArea ? `Land Area: ${landArea}` : 'Land Area Not Available'}
          </Box>
          <Box>
            {resultData.total_income ? `Total Income: ${resultData.total_income}` : 'Income Data Not Available'}
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
        </SubSectionContainer>
        <ChartBox>
          <ResponsiveBox>
            {adjustedDataList[selectedCropIndex] && Object.keys(adjustedDataList[selectedCropIndex]).length > 0 ? (
              <Bar data={generateBarChartData(adjustedDataList[selectedCropIndex], cropNames[selectedCropIndex])} options={barChartOptions} />
            ) : (
              '차트 데이터'
            )}
          </ResponsiveBox>
          <ResponsiveLineBox>
            {resultData.results && resultData.results[selectedCropIndex].crop_chart_data ? (
              <Line
                data={generateLineChartData(resultData.results[selectedCropIndex].crop_chart_data, cropNames[selectedCropIndex])}
                options={lineChartOptions}
              />
            ) : (
              '로딩중..'
            )}
          </ResponsiveLineBox>
        </ChartBox>
      </SectionContainer>
    </PageContainer>
  );
};

export default ExpectedReturnTemplate;
