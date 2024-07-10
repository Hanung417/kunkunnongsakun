import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useDropzone } from "react-dropzone";
import axios from 'axios';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background-color: #f9f9f9;
  height: 100%;
`;

const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background-color: #4aaa87;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 1.3rem;
  margin: 0;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  margin-top: 30px;
`;

const UploadContainer = styled.div`
  border: 2px dashed #ccc;
  width: 80%;
  
  text-align: center;
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 10px;
`;

const ImagePreview = styled.img`
  max-width: 100%;
  height: auto;
  margin-top: 20px;
  border-radius: 10px;
`;

const ResultContainer = styled.div`
  margin-top: 20px;
  font-size: 1rem;
  color: #333;
  text-align: center;
  background-color: #fff;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const DiagnoseButton = styled.button`
  background-color: #4aaa87;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.3em;
  margin-top: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: 'Freesentation', sans-serif; /* Apply custom font here */

  &:hover {
    background-color: #3b8b6d;
  }
`;

const DiagnosisTemplate = () => {
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
      setResult('이미지를 업로드해주세요');
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
        <Title>병해충 진단</Title>
      </HeaderContainer>
      <Content>
        <UploadContainer {...getRootProps()}>
          <input {...getInputProps()} />
          {image ? (
            <ImagePreview src={image} alt="Uploaded" />
          ) : (
            <p>사진 업로드</p>
          )}
        </UploadContainer>
        <DiagnoseButton onClick={handleDiagnose}>진단</DiagnoseButton>
        {result && <ResultContainer>{result}</ResultContainer>}
      </Content>
    </PageContainer>
  );
};

export default DiagnosisTemplate;