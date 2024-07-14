import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const Container = styled.div`
  padding: 24px;
  background-color: #f5f5f5;
`;

const TitleBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const BackButton = styled.button`
  position: absolute;
  left: 0;
  padding: 8px 16px;
  font-size: 16px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: #4aaa87;

  &:hover {
    color: #3e8e75;
  }

  & > svg {
    font-size: 24px;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  color: #444;
  padding: 16px 0;
  border-bottom: 2px solid #4aaa87;
  margin-bottom: 16px;
  text-align: center;
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

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 2px solid #4aaa87;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:focus {
    outline: none;
    border-color: #6dc4b0;
  }
`;

const Textarea = styled.textarea`
  padding: 10px;
  font-size: 16px;
  border: 2px solid #4aaa87;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:focus {
    outline: none;
    border-color: #6dc4b0;
  }
`;

const Select = styled.select`
  padding: 10px;
  font-size: 16px;
  border: 2px solid #4aaa87;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:focus {
    outline: none;
    border-color: #6dc4b0;
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

  &:hover {
    background-color: #3e8e75;
  }
`;

const EditPostTemplate = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState("buy");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/community/post/${id}/`);
        console.log("Fetched post data:", response.data);
        setTitle(response.data.title);
        setContent(response.data.content);
        setPostType(response.data.post_type);
      } catch (error) {
        console.error("Failed to fetch post", error);
      }
    };
    fetchPost();
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
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const csrfToken = getCSRFToken();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("post_type", postType);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/community/post/${id}/edit/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-CSRFToken": csrfToken,
          },
          withCredentials: true,
        }
      );
      console.log("Edit response:", response.data);
      alert("글 수정 성공!");
      navigate(`/post/${id}`);
    } catch (error) {
      console.error("Failed to edit post", error);
      alert("글 수정 실패! 다시 시도해주세요.");
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <Container>
      <TitleBar>
        <BackButton onClick={handleBackClick}>
          <FaArrowLeft />
        </BackButton>
        <Title>글 수정</Title>
      </TitleBar>
      <Form onSubmit={handleSubmit}>
        <Label htmlFor="title">제목</Label>
        <Input
          type="text"
          id="title"
          value={title}
          onChange={handleTitleChange}
          required
        />
        <Label htmlFor="content">내용</Label>
        <Textarea
          id="content"
          rows="10"
          value={content}
          onChange={handleContentChange}
          required
        />
        <Label htmlFor="post_type">게시글 종류</Label>
        <Select
          id="post_type"
          value={postType}
          onChange={handlePostTypeChange}
          required
        >
          <option value="buy">구매 게시판</option>
          <option value="sell">판매 게시판</option>
          <option value="exchange">품앗이 게시판</option>
        </Select>
        <Label htmlFor="image">이미지</Label>
        <Input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
        />
        <Button type="submit">수정하기</Button>
      </Form>
    </Container>
  );
};

export default EditPostTemplate;
