import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useDropzone } from "react-dropzone";
import { AiOutlineBell } from 'react-icons/ai';
import axios from 'axios';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
  font-size: 1.5rem; /* 폰트 크기를 작게 조정 */
  padding: 20px;
`;

const HeaderContainer = styled.div`
  width: 100%;
  background-color: #a5d6a7;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: #fff;
  margin: 0;
  text-align: center;
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
  width: 100%;
  max-width: 300px;
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
  font-size: 1.2rem;
  color: #333;
`;

const DiagnoseButton = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 20px;

  &:hover {
    background-color: #45a049;
  }
`;

const DiagnosisPage = () => {
  const [image, setImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState("");
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setImage(URL.createObjectURL(file));
    setSelectedFile(file); // 파일 저장
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

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

  const handleDiagnose = async () => {
    if (!selectedFile) {
      setResult('Please upload an image first.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    const csrfToken = getCSRFToken();

    try {
      const response = await axios.post('http://localhost:8000/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRFToken': csrfToken,
        },
        withCredentials: true,
      });
      setResult(response.data.result);
      navigate('/Info', { state: { diagnosisResult: response.data } }); // 결과를 InfoPage로 전달
    } catch (error) {
      console.error('Failed to upload image', error);
      setResult('Error in diagnosing the image.');
    }
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
        <DiagnoseButton onClick={handleDiagnose}>Diagnose</DiagnoseButton>
        {result && <ResultContainer>{result}</ResultContainer>}
      </Content>
    </PageContainer>
  );
};

export default DiagnosisPage;
