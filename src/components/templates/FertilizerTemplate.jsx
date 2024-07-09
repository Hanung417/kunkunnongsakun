import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { AiOutlineBell } from 'react-icons/ai';

// 스타일 정의
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

const FertilizerImage = styled.img`
  max-width: 200px;
  margin: 20px 0;
`;

const FertilizerName = styled.h2`
  font-size: 1.5rem;
  margin: 0.5rem 0;
  color: #333;
`;

const FertilizerDescription = styled.p`
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  padding: 0 1rem;
  color: #666;
`;

const RecommendationsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 20px 0;
`;

const RecommendationButton = styled.button`
  margin: 5px;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #4CAF50;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }
`;

const FertilizerTemplate = () => {
  const [fertilizerData, setFertilizerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFertilizerData = async () => {
      try {
        // 실제 API 요청을 수행합니다.
        const response = await fetch('https://api.example.com/fertilizers'); // API 엔드포인트를 실제 URL로 변경
        if (!response.ok) {
          throw new Error('네트워크 응답이 올바르지 않습니다');
        }
        const data = await response.json();
        
        setFertilizerData(data);
      } catch (error) {
        console.error('API 요청에 실패했습니다:', error);
        // API 요청 실패 시 모의 데이터를 사용합니다.
        const mockData = {
          image: 'https://via.placeholder.com/200',
          name: 'Sample Fertilizer',
          description: 'This is a sample fertilizer description.',
          recommendations: ['Recommendation 1', 'Recommendation 2', 'Recommendation 3'],
        };
        setFertilizerData(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchFertilizerData();
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>오류가 발생했습니다: {error.message}</div>;
  }

  return (
    <PageContainer>
      <HeaderContainer>
        <Title>비료 추천</Title>
        <IconContainer>
          <Icon><AiOutlineBell size={24} color="#fff" /></Icon>
        </IconContainer>
      </HeaderContainer>
      <Content>
        {fertilizerData && (
          <>
            <FertilizerImage src={fertilizerData.image} alt="Fertilizer" />
            <FertilizerName>{fertilizerData.name}</FertilizerName>
            <FertilizerDescription>{fertilizerData.description}</FertilizerDescription>
            <RecommendationsContainer>
              {fertilizerData.recommendations.map((rec, index) => (
                <RecommendationButton key={index}>
                  {rec}
                </RecommendationButton>
              ))}
            </RecommendationsContainer>
          </>
        )}
      </Content>
    </PageContainer>
  );
};

export default FertilizerTemplate;
