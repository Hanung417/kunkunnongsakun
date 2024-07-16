import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPost, editPost } from "../../../apis/post";
import CustomModal from "../../atoms/CustomModal"; // CustomModal 컴포넌트 추가
import styled from "styled-components";

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 24px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

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
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};

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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:focus {
    outline: none;
    border-color: #4aaa87;
  }
`;

const FileInputWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const FileInputLabel = styled.label`
  padding: 10px 16px;
  font-size: 16px;
  background-color: #ffffff;
  border: 1px solid #4aaa87;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #e6f9f1;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileName = styled.span`
  margin-left: 12px;
  font-size: 14px;
  color: #555;
`;

const ExistingImage = styled.div`
  margin-bottom: 16px;
  display: flex;
  align-items: center;

  & > img {
    max-width: 100px;
    max-height: 100px;
    margin-right: 12px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const EditPostTemplate = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState("buy");
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState(""); // 파일 이름 상태 추가
  const [existingImage, setExistingImage] = useState(null); // 기존 이미지 상태 추가
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 추가
  const [modalTitle, setModalTitle] = useState(""); // 모달 타이틀 상태 추가
  const [modalContent, setModalContent] = useState(""); // 모달 내용 상태 추가
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchPost(id);
        setTitle(response.data.title);
        setContent(response.data.content);
        setPostType(response.data.post_type);
        setExistingImage(response.data.image); // 기존 이미지 설정
      } catch (error) {
        console.error("Failed to fetch post", error);
      }
    };
    fetchData();
  }, [id]);

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
      await editPost(id, formData);
      setModalTitle("수정 성공");
      setModalContent("글이 성공적으로 수정되었습니다.");
      setIsModalOpen(true); // 글 수정 성공 시 모달 열기
    } catch (error) {
      console.error("Failed to edit post", error);
      setModalTitle("수정 실패");
      setModalContent("글 수정 중 오류가 발생했습니다. 다시 시도해 주세요.");
      setIsModalOpen(true); // 글 수정 실패 시 모달 열기
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
        {existingImage && (
          <ExistingImage>
            <img src={existingImage} alt="Existing" />
            {/*<FileName>{existingImage.split("/").pop()}</FileName> {/* 기존 이미지 파일 이름 표시 */}
          </ExistingImage>
        )}
        <FileInputWrapper>
          <FileInputLabel htmlFor="image">파일 업로드</FileInputLabel>
          <FileInput
            type="file"
            id="image"
            accept="image/*"
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