import React, { useCallback, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useDropzone } from "react-dropzone";
import { uploadImage } from "../../../apis/predict";
import { FaCamera, FaFile } from "react-icons/fa";
import CustomModal from '../../atoms/CustomModal';
import { useLoading } from "../../../LoadingContext";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 37.5rem;
  margin-top: 1rem;
  position: relative;
`;

const UploadText = styled.p`
  font-size: 1rem;
  color: #333;
  margin-bottom: 4rem;
`;

const ButtonWrapper = styled.div`
  position: absolute;
  top: 3.5rem; 
  right: 4rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UploadButtonWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const CameraButtonWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const UploadButton = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  border: 1px solid #4aaa87;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  gap: 0.5rem;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const CameraButton = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  border: 1px solid #4aaa87;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  gap: 0.5rem;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const UploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #4aaa87;
  width: 15rem;
  max-width: 31.25rem;
  height: 15rem;
  text-align: center;
  margin-bottom: 1.25rem;
  margin-top: 1.25rem;
  background-color: #fff;
  border-radius: 0.625rem;
  overflow: hidden;
  cursor: pointer;
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.625rem;
`;

const PlaceholderIcon = styled.div`
  font-size: 3rem;
  color: #ccc;
`;

const PlaceholderText = styled.p`
  font-size: 1rem;
  color: #aaa;
`;

const ResultContainer = styled.div`
  margin-top: 1.25rem;
  font-size: 1rem;
  color: #333;
  text-align: center;
  background-color: #fff;
  padding: 0.625rem;
  border-radius: 0.625rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  max-width: 31.25rem;
  margin-top: 1.25rem;
`;

const DiagnoseButton = styled.button`
  background-color: #4aaa87;
  color: white;
  padding: 0.75rem 2.5rem;
  border: none;
  border-radius: 0.3rem;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: 600;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: #3b8b6d;
  }
`;

const DiagnosisTemplate = () => {
  const { setIsLoading } = useLoading();
  const [image, setImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const navigate = useNavigate();
  const cameraInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setImage(URL.createObjectURL(file));
    setSelectedFile(file);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noClick: true,
  });

  const handleDiagnose = async () => {
    if (!selectedFile) {
      setModalContent('이미지를 업로드해주세요');
      setIsModalOpen(true);
      return;
    }

    try {
      setIsLoading(true);
      const response = await uploadImage(selectedFile);
      setResult(response.data.result);
      navigate('/info', { state: { diagnosisResult: response.data } });
    } catch (error) {
      console.error('Failed to upload image', error);
      setModalContent('Error in diagnosing the image.');
      setIsModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const openCamera = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCameraInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setSelectedFile(file);
    }
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setSelectedFile(file);
    }
  };

  return (
    <PageContainer>
      <Content>
        <UploadText>병해충 진단을 위한 사진을 업로드해주세요</UploadText>
        <ButtonWrapper>
          <UploadButtonWrapper>
            <UploadButton onClick={openFileDialog}>
              <FaFile />
              파일 업로드
            </UploadButton>
          </UploadButtonWrapper>
          <CameraButtonWrapper>
            <CameraButton onClick={openCamera}>
              <FaCamera />
              촬영
            </CameraButton>
          </CameraButtonWrapper>
        </ButtonWrapper>
        <UploadContainer {...getRootProps()}>
          <input {...getInputProps()} ref={fileInputRef} onChange={handleFileInputChange} />
          {image ? (
            <ImagePreview src={image} alt="Uploaded" />
          ) : (
            <>
              <PlaceholderIcon>
                <FaFile />
              </PlaceholderIcon>
              <PlaceholderText>업로드한 사진이 여기에 표시됩니다</PlaceholderText>
            </>
          )}
        </UploadContainer>
        <ButtonContainer>
          <DiagnoseButton onClick={handleDiagnose}>
            <FaFile />
            진단하기
          </DiagnoseButton>
        </ButtonContainer>
        {result && <ResultContainer>{result}</ResultContainer>}
        <input
          type="file"
          accept="image/*"
          capture="camera"
          ref={cameraInputRef}
          style={{ display: 'none' }}
          onChange={handleCameraInputChange}
        />
      </Content>
      <CustomModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        title="알림"
        content={modalContent}
        showConfirmButton={false}
      />
    </PageContainer>
  );
};

export default DiagnosisTemplate;