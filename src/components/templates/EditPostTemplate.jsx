import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const Container = styled.div`
  padding: 24px;
  background-color: #f5f5f5;
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
  const [postType, setPostType] = useState("");
  const navigate = useNavigate();

  // CSRF 토큰을 얻기 위한 함수
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

  // 글 데이터를 서버에서 불러오는 useEffect
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/community/post/${id}/`);
        setTitle(response.data.title);
        setContent(response.data.content);
        setPostType(response.data.post_type);
      } catch (error) {
        console.error("Failed to fetch post", error);
      }
    };
    fetchPost();
  }, [id]);

  // 제목 변경 핸들러
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  // 내용 변경 핸들러
  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  // 게시글 종류 변경 핸들러
  const handlePostTypeChange = (event) => {
    setPostType(event.target.value);
  };

  // 폼 제출 핸들러
  const handleSubmit = async (event) => {
    event.preventDefault();
    const csrfToken = getCSRFToken();
    try {
      await axios.post(`http://localhost:8000/community/post/${id}/edit/`, {
        title,
        content,
        post_type: postType, // 게시글 종류 포함
      }, {
        headers: {
          'X-CSRFToken': csrfToken
        },
        withCredentials: true
      });
      alert("글 수정 성공");
      navigate(`/post/${id}`);
    } catch (error) {
      console.error("Failed to edit post", error);
    }
  };

  return (
    <Container>
      <Title>글 수정</Title>
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
        </Select>
        <Button type="submit">수정하기</Button>
      </Form>
    </Container>
  );
};

export default EditPostTemplate;