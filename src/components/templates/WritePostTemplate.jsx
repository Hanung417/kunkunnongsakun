import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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

const RadioGroup = styled.div`
  margin-bottom: 16px;
`;

const RadioLabel = styled.label`
  font-size: 16px;
  color: #555;
  margin-right: 16px;
`;

const WritePostTemplate = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState("buy");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

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

  const getCSRFToken = () => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, 10) === "csrftoken=") {
          cookieValue = decodeURIComponent(cookie.substring(10));
          break;
        }
      }
    }
    return cookieValue;
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
    const getCSRFToken = () => {
      let cookieValue = null;
     if (document.cookie && document.cookie !== "") {
       const cookies = document.cookie.split(";");
       for (let i = 0; i < cookies.length; i++) {
         const cookie = cookies[i].trim();
          if (cookie.substring(0, 10) === "csrftoken=") {
          cookieValue = decodeURIComponent(cookie.substring(10));
          break;
          }
        }
      }
      return cookieValue;
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/community/post/create/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-CSRFToken": csrfToken,
          },
          withCredentials: true,
        }
      );
      alert("글 작성 성공");
      console.log("Created post", response.data);
      navigate(`/post/${response.data.id}`);
    } catch (error) {
      console.error("Failed to create post", error);
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
        <Title>글 작성</Title>
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
        <RadioGroup>
          <RadioLabel>
            <Input
              type="radio"
              value="buy"
              checked={postType === "buy"}
              onChange={handlePostTypeChange}
            />
            구매 게시판
          </RadioLabel>
          <RadioLabel>
            <Input
              type="radio"
              value="sell"
              checked={postType === "sell"}
              onChange={handlePostTypeChange}
            />
            판매 게시판
          </RadioLabel>
          <RadioLabel>
            <Input
              type="radio"
              value="exchange"
              checked={postType === "exchange"}
              onChange={handlePostTypeChange}
            />
            품앗이 게시판
          </RadioLabel>
        </RadioGroup>
        <Label htmlFor="image">이미지 추가</Label>
        <Input
          type="file"
          id="image"
          accept="image/jpeg, image/png, image/jpg" // 특정 확장자만 허용
          onChange={handleImageChange}
        />
        <Button type="submit">작성하기</Button>
      </Form>
    </Container>
  );
};

export default WritePostTemplate;
