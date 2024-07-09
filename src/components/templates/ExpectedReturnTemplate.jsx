import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  background-color: #fafafa;
  font-size: 1rem;
  font-family: 'Roboto', sans-serif;
`;

const Header = styled.div`
  width: 100%;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #a5d6a7; /* 더 연한 초록색 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

const ChartContainer = styled.div`
  width: 90%;
  height: 200px;
  background-color: #e0e0e0;
  margin: 1rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
`;

const StatusContainer = styled.div`
  width: 90%;
  display: flex;
  justify-content: space-between;
  margin: 1rem 0;
`;

const StatusItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1rem;
  background-color: #fff;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const PlantImage = styled.img`
  width: 50%;
  margin: 1rem 0;
  border-radius: 10px;
`;

const Footer = styled.div`
  width: 100%;
  padding: 1rem;
  display: flex;
  justify-content: space-around;
  position: absolute;
  bottom: 0;
  background-color: #fff;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
`;

const FooterButton = styled.button`
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  color: #4CAF50;
`;

const ExpectedReturnPage = () => {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState(null);
  const [plantStatus, setPlantStatus] = useState({
    age: null,
    humidity: null,
    status: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // API 요청을 통해 데이터를 가져옵니다.
        const response = await fetch('/api/expectedReturn'); // API 엔드포인트를 실제 URL로 변경
        if (!response.ok) {
          throw new Error('네트워크 응답이 정상이 아닙니다.');
        }
        const data = await response.json();
        
        setChartData(data.chartData);
        setPlantStatus({
          age: data.age,
          humidity: data.humidity,
          status: data.status
        });
      } catch (error) {
        console.error('API 요청에 실패했습니다:', error);
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

  return (
    <PageContainer>
      <Header>
        <HeaderButton onClick={navigateToCropsPage}>뒤로</HeaderButton>
        <Title>작물별 예상 수익률</Title>
        <HeaderButton>알림</HeaderButton>
      </Header>
      
      <ChartContainer>
        {chartData ? (
          // 차트 데이터를 렌더링합니다. 예: <MyChartComponent data={chartData} />
          <div>{/* Chart rendering logic */}</div>
        ) : (
          <div>차트를 불러오는 중...</div>
        )}
      </ChartContainer>
      
      <StatusContainer>
        <StatusItem>
          <div>나이</div>
          <div>{plantStatus.age ? `${plantStatus.age}일` : '정보 없음'}</div>
        </StatusItem>
        <StatusItem>
          <div>습도 수준</div>
          <div>{plantStatus.humidity ? `${plantStatus.humidity}%` : '정보 없음'}</div>
        </StatusItem>
        <StatusItem>
          <div>상태</div>
          <div>{plantStatus.status || '정보 없음'}</div>
        </StatusItem>
      </StatusContainer>
      
      <PlantImage src="path_to_plant_image.png" alt="식물" />
      
      <Footer>
        <FooterButton onClick={navigateToMainPage}>홈</FooterButton>
        <FooterButton>기타</FooterButton>
        <FooterButton>마이페이지</FooterButton>
      </Footer>
    </PageContainer>
  );
};

export default ExpectedReturnPage;
