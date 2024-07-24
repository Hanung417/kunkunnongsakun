import React from 'react';
import { FadeLoader } from 'react-spinners';
import styled from 'styled-components';
import { useLoading } from "../../LoadingContext";

const LoaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.8);
  z-index: 9999;
`;

const Logo = styled.img`
  width: 100px; /* 로고의 크기 */
  height: 100px;
  margin-bottom: 20px; /* 로고와 로더 사이의 간격 */
`;

const LoaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const LoaderOffsetWrapper = styled.div`
  position: relative;
  left: 5px; /* 로더를 오른쪽으로 5px 이동 */
`;

const LoaderText = styled.p`
  margin-top: 20px;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
`;

const GlobalLoader = ({ text }) => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <LoaderContainer>
      <LoaderWrapper>
        <Logo src={`${process.env.PUBLIC_URL}/android-chrome-192x192.png`} alt="Loading Logo" />
        <LoaderOffsetWrapper>
          <FadeLoader color="#4aaa87" loading={isLoading} size={60} /> {/* 로더의 크기 */}
        </LoaderOffsetWrapper>
        {text && <LoaderText>{text}</LoaderText>}
      </LoaderWrapper>
    </LoaderContainer>
  );
};

export default GlobalLoader;