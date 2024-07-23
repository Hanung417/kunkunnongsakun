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
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
`;

const LoaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LoaderText = styled.p`
  margin-top: 20px;
  font-size: 1rem;
  color: #333;
`;

const GlobalLoader = ({ text }) => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <LoaderContainer>
      <LoaderWrapper>
        <Logo src={`${process.env.PUBLIC_URL}/android-chrome-192x192.png`} alt="Loading Logo" />
        <FadeLoader color="#4aaa87" loading={isLoading} size={15} />
        {text && <LoaderText>{text}</LoaderText>}
      </LoaderWrapper>
    </LoaderContainer>
  );
};

export default GlobalLoader;