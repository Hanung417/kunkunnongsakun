import React, { useCallback, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useDropzone } from "react-dropzone";
import { uploadImage } from "../../apis/predict";
import { FaCamera, FaFile } from "react-icons/fa";
import CustomModal from '../atoms/CustomModal';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background-color: #f9f9f9;
  min-height: 100vh;
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 2px dashed #4aaa87;
  width: 80%;
  max-width: 500px;
  height: 300px;
  text-align: center;
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
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
  margin-top: 20px;
  font-size: 1rem;
  color: #333;
  text-align: center;
  background-color: #fff;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 600px;
  margin-top: 20px;
`;

const DiagnoseButton = styled.button`
  background-color: #4aaa87;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.2em;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: #3b8b6d;
  }
`;

const CameraIcon = styled(FaCamera)`
  color: #4aaa87;
  font-size: 2rem;
  cursor: pointer;
  &:hover {
    color: #3b8b6d;
  }
`;

const DiagnosisTemplate = () => {
  const [image, setImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const navigate = useNavigate();
  const cameraInputRef = useRef(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setImage(URL.createObjectURL(file));
    setSelectedFile(file);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleDiagnose = async () => {
    if (!selectedFile) {
      setModalContent('이미지를 업로드해주세요');
      setIsModalOpen(true);
      return;
    }

    try {
      const response = await uploadImage(selectedFile);
      setResult(response.data.result);
      navigate('/info', { state: { diagnosisResult: response.data } });
    } catch (error) {
      console.error('Failed to upload image', error);
      setModalContent('Error in diagnosing the image.');
      setIsModalOpen(true);
    }
  };

  const openCamera = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleCameraInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setSelectedFile(file);
    }
  };

  return (
    <PageContainer>
      <Content>
        <UploadContainer {...getRootProps()}>
          <input {...getInputProps()} />
          {image ? (
            <ImagePreview src={image} alt="Uploaded" />
          ) : (
            <>
              <PlaceholderIcon>
                <FaFile />
              </PlaceholderIcon>
              <PlaceholderText>사진 업로드</PlaceholderText>
            </>
          )}
        </UploadContainer>
        <ButtonContainer>
          <DiagnoseButton onClick={handleDiagnose}>
            <FaFile />
            진단
          </DiagnoseButton>
          <CameraIcon onClick={openCamera} />
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