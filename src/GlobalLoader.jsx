import React from 'react';
import { FadeLoader } from 'react-spinners';
import styled from 'styled-components';
import { useLoading } from "./LoadingContext";

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
  width: 100px; /* 로고의 크기를 조정하세요 */
  height: 100px;
  margin-bottom: 20px; /* 로고와 로더 사이의 간격 */
`;

const GlobalLoader = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <LoaderContainer>
      <Logo src={`${process.env.PUBLIC_URL}/android-chrome-192x192.png`} alt="Loading Logo" />
      <FadeLoader color="#4aaa87" loading={isLoading} size={15} />
    </LoaderContainer>
  );
};

export default GlobalLoader;