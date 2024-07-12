import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrash } from 'react-icons/fa';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background-color: #f9f9f9;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 32px;
  color: #333;
`;

const PostList = styled.div`
  width: 100%;
  max-width: 1200px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  overflow: hidden;
`;

const TableHeader = styled.thead`
  background-color: #4aaa87;
  color: white;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }

 
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #ccc;
  font-size: 14px;
  color: ${(props) => (props.header ? "aliceblue" : "black")};
  text-align: left;
  width: ${(props) => props.width || "auto"};
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const PostTitle = styled.span`
  font-size: 14px;
  font-weight: bold;
  color: #4aaa87;
  display: inline-block;
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const IconButton = styled.button`
  padding: 6px;
  margin: 0;
  font-size: 14px;
  border: none;
  cursor: pointer;

  &:hover {
    color: #4aaa87;
  }

  &:focus {
    outline: none;
  }
`;

const MyPostTemplate = () => {
  const [posts, setPosts] = useState([]);
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
  }

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const csrfToken = getCSRFToken();
        const response = await axios.get("http://localhost:8000/community/myposts/", {
          headers: {
            'X-CSRFToken': csrfToken
          },
          withCredentials: true
        });
        setPosts(response.data);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      }
    };
    fetchPosts();
  }, []);

  const handleEdit = (postId) => {
    navigate(`/post/edit/${postId}`);
  };

  const handleDelete = async (postId) => {
    try {
      const csrfToken = getCSRFToken();
      await axios.post(`http://localhost:8000/community/post/${postId}/delete/`, {}, {
        headers: {
          'X-CSRFToken': csrfToken
        },
        withCredentials: true
      });
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error("Failed to delete post", error);
    }
  };

  return (
    <Container>
      <Title>내가 작성한 글</Title>
      <PostList>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell header width="40%">제목</TableCell>
              <TableCell header width="20%">작성자</TableCell>
              <TableCell header width="20%">작성일</TableCell>
              <TableCell header width="10%">수정</TableCell>
              <TableCell header width="10%">삭제</TableCell>
            </TableRow>
          </TableHeader>
          <tbody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  <StyledLink to={`/post/${post.id}`}>
                    <PostTitle>{post.title}</PostTitle>
                  </StyledLink>
                </TableCell>
                <TableCell>{post.user_id}</TableCell>
                <TableCell>{new Date(post.creation_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(post.id)}>
                    <FaEdit />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDelete(post.id)}>
                    <FaTrash />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </PostList>
    </Container>
  );
};

export default MyPostTemplate;