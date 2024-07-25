import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createPost } from "../../../apis/post";
import CustomModal from "../../atoms/CustomModal";
import { useLoading } from "../../../LoadingContext";
import {
  Container,
  Form,
  Label,
  Required,
  Input,
  Textarea,
  Button,
  Select,
  FileInputWrapper,
  FileInputLabel,
  FileInput,
  FileName,
  ImagePreview,
  ErrorMessage,
} from "../../../styles/Post";

const WritePostTemplate = () => {
  const { setIsLoading } = useLoading();
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
    setFileName(file ? file.name : "");

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
      setIsLoading(true);
      const response = await createPost(formData);
      setCreatedPostId(response.data.id);
      setModalTitle("알림");
      setModalContent("글 작성이 완료되었습니다.");
      setIsModalOpen(true);
    } catch (error) {
      setModalTitle("작성 실패");
      setModalContent("글 작성 중 오류가 발생했습니다. 다시 시도해 주세요.");
      setIsModalOpen(true);
    } finally {
      setIsLoading(false);
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