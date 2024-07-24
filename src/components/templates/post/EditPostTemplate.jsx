import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPost, editPost } from "../../../apis/post";
import CustomModal from "../../atoms/CustomModal";
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
} from "../../../styles/Post";
import { useLoading } from "../../../LoadingContext";

const EditPostTemplate = () => {
  const { id } = useParams();
  const { setIsLoading } = useLoading();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState("buy");
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [existingImage, setExistingImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetchPost(id);
        setTitle(response.data.title);
        setContent(response.data.content);
        setPostType(response.data.post_type);
        setExistingImage(response.data.image);
      } catch (error) {
        console.error("Failed to fetch post", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, setIsLoading]);

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
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("post_type", postType);
    if (image) {
      formData.append("image", image);
    }

    try {
      setIsLoading(true);
      await editPost(id, formData);
      setModalTitle("수정 성공");
      setModalContent("글이 성공적으로 수정되었습니다.");
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to edit post", error);
      setModalTitle("수정 실패");
      setModalContent("글 수정 중 오류가 발생했습니다. 다시 시도해 주세요.");
      setIsModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate(`/post/${id}`);
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Label htmlFor="postType">
          게시판 종류<Required>*</Required>
        </Label>
        <Select id="postType" value={postType} onChange={handlePostTypeChange}>
          <option value="buy">구매 게시판</option>
          <option value="sell">판매 게시판</option>
          <option value="exchange">품앗이 게시판</option>
        </Select>
        <Label htmlFor="title">
          제목<Required>*</Required>
        </Label>
        <Input
          type="text"
          id="title"
          value={title}
          onChange={handleTitleChange}
          onInvalid={(e) => e.preventDefault()}
          required
        />
        <Label htmlFor="content">
          내용<Required>*</Required>
        </Label>
        <Textarea
          id="content"
          rows="10"
          value={content}
          onChange={handleContentChange}
          onInvalid={(e) => e.preventDefault()}
          required
        />
        <Label htmlFor="image">이미지</Label>
        {existingImage && !imagePreview && (
          <ImagePreview src={existingImage} alt="Existing" />
        )}
        {imagePreview && (
          <ImagePreview src={imagePreview} alt="Preview" />
        )}
        <FileInputWrapper>
          <FileInputLabel htmlFor="image">파일 업로드</FileInputLabel>
          <FileInput
            type="file"
            id="image"
            accept="image/jpeg, image/png, image/jpg"
            onChange={handleImageChange}
          />
          {fileName && <FileName>{fileName}</FileName>}
        </FileInputWrapper>
        <Button type="submit">수정하기</Button>
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

export default EditPostTemplate;