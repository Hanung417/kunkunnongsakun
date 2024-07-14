import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bar, Line } from 'react-chartjs-2';
import axios from 'axios';
import 'chartjs-adapter-date-fns';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

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
  width: 30%;
  height: 50px;
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
  height: 400px;
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

const getCSRFToken = () => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, 10) === 'csrftoken=') {
        cookieValue = decodeURIComponent(cookie.substring(10));
        break;
      }
    }
  }
  return cookieValue;
};

const generateLineChartData = (crop_chart_data, cropName) => {
  const labels = crop_chart_data.map(data => new Date(data.tm));
  const data = crop_chart_data.map(data => data.price);

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
  }
};

const SessionDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { session_id } = location.state;
  const [sessionDetails, setSessionDetails] = useState(null);
  const [barChartData, setBarChartData] = useState(null);
  const [lineChartData, setLineChartData] = useState(null);
  const [selectedCropIndex, setSelectedCropIndex] = useState(0);

  const columns = ["총수입 (원)", "총생산비 (원)", "총경영비", "총중간재비",
    "농약비", "수도광열비", "소득구비", "보통비료비",
    "고용노동비", "자가노동비", "부가가치 (원)", "소득 (원)",];

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
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)'
          ],
          borderColor: [
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
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  useEffect(() => {
    const fetchSessionDetails = async () => {
      const csrfToken = getCSRFToken();

      try {
        const response = await axios.get(`http://localhost:8000/prediction/session_details/${session_id}/`, {
          headers: {
            'X-CSRFToken': csrfToken,
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        });
        setSessionDetails(response.data);

        const resultData = response.data;
        const adjustedDataList = resultData?.results?.map(result => result.adjusted_data) || [];
        const cropNames = resultData?.results?.map(result => result.crop_name) || [];

        if (adjustedDataList.length > 0) {
          const barData = generateBarChartData(adjustedDataList[0], cropNames[0]);
          setBarChartData(barData);
        }

        if (resultData.results && resultData.results.length > 0) {
          const crop_chart_data = resultData.results.flatMap(result => result.crop_chart_data);
          const lineData = generateLineChartData(crop_chart_data, cropNames[0]);
          setLineChartData(lineData);
        }

      } catch (error) {
        console.error('Error fetching session details:', error);
        if (error.response && error.response.status === 401) {
          alert('사용자 인증이 필요합니다. 로그인 페이지로 이동합니다.');
          navigate('/login');
        }
      }
    };

    fetchSessionDetails();
  }, [session_id, navigate]);

  if (!sessionDetails || !barChartData || !lineChartData) {
    return <div>Loading...</div>;
  }

  const cropNames = sessionDetails.results.map(result => result.crop_name);
  const adjustedDataList = sessionDetails.results.map(result => result.adjusted_data);

  return (
    <PageContainer>
      <SectionContainer>
        <BoxContainer>
          <Box>
            {cropNames.length > 0 ? cropNames.join(', ') : 'Sample Crop Data'}
          </Box>
          <Box>
            {sessionDetails.land_area ? `Land Area: ${sessionDetails.land_area}` : 'Sample Area Data'}
          </Box>
          <Box>
            {sessionDetails.total_income ? `Total Income: ${sessionDetails.total_income}` : 'Sample Wholesale Prediction'}
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
            <Bar data={generateBarChartData(adjustedDataList[selectedCropIndex], cropNames[selectedCropIndex])} options={barChartOptions} />
          ) : (
            '차트 데이터를 불러오는 과정에서 문제가 생겼습니다.'
          )}
        </FixedLargeBox>
        <FixedWideBox>
          {sessionDetails.results && sessionDetails.results[selectedCropIndex].crop_chart_data ? (
            <Line
              data={generateLineChartData(sessionDetails.results[selectedCropIndex].crop_chart_data, cropNames[selectedCropIndex])}
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

export default SessionDetails;
