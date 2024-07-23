import React from 'react';
import { SyncLoader } from 'react-spinners';
import styled from 'styled-components';
import { useLoading } from "../../LoadingContext";

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: transparent;
`;

const TopBarLoader = ({ color }) => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <LoaderContainer>
      <SyncLoader color={color} loading={isLoading} size={8} />
    </LoaderContainer>
  );
};

export default TopBarLoader;