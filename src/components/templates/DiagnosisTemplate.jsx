import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { useDropzone } from "react-dropzone";
import { AiOutlineBell } from 'react-icons/ai';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0; /* 배경색을 변경할 수 있습니다 */
  font-size: 2rem; /* 글꼴 크기 설정 */
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
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  width: 100%;
`;

const UploadContainer = styled.div`
  border: 2px dashed #ccc;
  padding: 20px;
  width: 300px;
  text-align: center;
  margin-bottom: 20px;
  background-color: #fff;
`;

const ImagePreview = styled.img`
  max-width: 100%;
  height: auto;
  margin-top: 20px;
`;

const ResultContainer = styled.div`
  margin-top: 20px;
  font-size: 1.5rem;
  color: #333;
`;

const DiagnosisTemplate = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result);
      // 병해충 여부 확인 API 호출 및 결과 설정
      checkPestDisease(reader.result);
    };

    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const checkPestDisease = (imageData) => {
    // 여기에 병해충 여부 확인 API 호출 코드를 추가하세요.
    // 예시: setResult("Pests and diseases detected.");
    // 실제 API를 사용하여 응답을 처리하고 결과를 설정합니다.
    setResult("Diagnosing for pests and diseases...");

    // 예시로 일정 시간 후에 결과를 설정
    setTimeout(() => {
      setResult("No pests or diseases detected."); // 예시 결과
    }, 2000);
  };

  return (
    <PageContainer>
      <HeaderContainer>
        <Title>Pest and Disease Diagnosis Page</Title>
        <IconContainer>
          <Icon><AiOutlineBell size={24} color="#fff" /></Icon>
        </IconContainer>
      </HeaderContainer>
      <Content>
        <UploadContainer {...getRootProps()}>
          <input {...getInputProps()} />
          {image ? (
            <ImagePreview src={image} alt="Uploaded" />
          ) : (
            <p>Drag & drop a photo here, or click to select one</p>
          )}
        </UploadContainer>
        {result && <ResultContainer>{result}</ResultContainer>}
      </Content>
    </PageContainer>
  );
};

export default DiagnosisTemplate;
