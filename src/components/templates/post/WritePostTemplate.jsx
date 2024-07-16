import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { createPost } from "../../../apis/post";
import CustomModal from "../../atoms/CustomModal"; // CustomModal 컴포넌트 추가

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 16px;
  color: #555;
  margin-bottom: 8px;
`;

const Required = styled.span`
  color: red;
  margin-left: 4px;
`;

const Input = styled.input`
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 16px;
  transition: border-color 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  &:focus {
    outline: none;
    border-color: #4aaa87;
  }
`;

const Textarea = styled.textarea`
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 16px;
  transition: border-color 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  &:focus {
    outline: none;
    border-color: #4aaa87;
  }
`;

const Button = styled.button`
  padding: 12px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #4aaa87;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  align-self: center;
  transition: background-color 0.3s;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};

  &:hover {
    background-color: #3e8e75;
  }
`;

const Select = styled.select`
  padding: 8px;
  font-size: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 16px;
  transition: border-color 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  &:focus {
    outline: none;
    border-color: #4aaa87;
  }
`;

const FileInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`;

const FileInputLabel = styled.label`
  padding: 10px 16px;
  font-size: 16px;
  background-color: #ffffff;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  &:hover {
    background-color: #e6f9f1;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileName = styled.span`
  margin-top: 8px;
  font-size: 14px;
  color: #555;
`;

const ImagePreview = styled.img`
  margin-top: 16px;
  max-width: 100%;
  border-radius: 8px;
`;

const ErrorMessage = styled.span`
  color: red;
  font-size: 14px;
  margin-top: -12px;
  margin-bottom: 16px;
`;

const WritePostTemplate = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const postTypeQueryParam = queryParams.get("post_type");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState(postTypeQueryParam || "buy");
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState(""); // 파일 이름 상태 추가
  const [imagePreview, setImagePreview] = useState(""); // 이미지 미리보기 상태 추가

  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 추가
  const [modalTitle, setModalTitle] = useState(""); // 모달 타이틀 상태 추가
  const [modalContent, setModalContent] = useState(""); // 모달 내용 상태 추가
  const [createdPostId, setCreatedPostId] = useState(null); // 생성된 글 ID 저장

  useEffect(() => {
    if (postTypeQueryParam) {
      setPostType(postTypeQueryParam);
    }
  }, [postTypeQueryParam]);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handlePostTypeChange = (event) => {
    setPostType(event.target.value);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
    setFileName(file ? file.name : ""); // 파일 이름 상태 업데이트

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let isValid = true;
    if (title.trim() === "") {
      setTitleError("제목을 입력하세요.");
      isValid = false;
    } else {
      setTitleError("");
    }

    if (content.trim() === "") {
      setContentError("내용을 입력하세요.");
      isValid = false;
    } else {
      setContentError("");
    }

    if (!isValid) {
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("post_type", postType);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await createPost(formData);
      console.log("Created post", response.data);
      setCreatedPostId(response.data.id); // 생성된 글 ID 저장
      setModalTitle("알림");
      setModalContent("글 작성이 완료되었습니다.");
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to create post", error);
      setModalTitle("작성 실패");
      setModalContent("글 작성 중 오류가 발생했습니다. 다시 시도해 주세요.");
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (createdPostId) {
      navigate(`/post/${createdPostId}`);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit} noValidate>
        <Label htmlFor="postType">게시판 종류<Required>*</Required></Label>
        <Select id="postType" value={postType} onChange={handlePostTypeChange}>
          <option value="buy">구매 게시판</option>
          <option value="sell">판매 게시판</option>
          <option value="exchange">품앗이 게시판</option>
        </Select>
        <Label htmlFor="title">제목<Required>*</Required></Label>
        <Input
          type="text"
          id="title"
          value={title}
          onChange={handleTitleChange}
          onInvalid={(e) => e.preventDefault()}
          required
        />
        {titleError && <ErrorMessage>{titleError}</ErrorMessage>}

        <Label htmlFor="content">내용<Required>*</Required></Label>
        <Textarea
          id="content"
          rows="10"
          value={content}
          onChange={handleContentChange}
          onInvalid={(e) => e.preventDefault()}
          required
        />
        {contentError && <ErrorMessage>{contentError}</ErrorMessage>}
        <Label htmlFor="image">이미지</Label>
        <FileInputWrapper>
          <FileInputLabel htmlFor="image">파일 업로드</FileInputLabel>
          <FileInput
            type="file"
            id="image"
            accept="image/jpeg, image/png, image/jpg"
            onChange={handleImageChange}
          />
          {fileName && <FileName>{fileName}</FileName>}
          {imagePreview && <ImagePreview src={imagePreview} alt="Image Preview" />}
        </FileInputWrapper>
        <Button type="submit" disabled={!title || !content}>작성하기</Button>
      </Form>

      <CustomModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        title={modalTitle}
        content={modalContent}
        onConfirm={closeModal}
        showConfirmButton={false}
      />
    </Container>
  );
};

export default WritePostTemplate;