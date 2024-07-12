import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaHome } from "react-icons/fa";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background-color: #f9f9f9;
`;

const TitleBar = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
  position: relative;
`;

const ButtonGroup = styled.div`
  position: absolute;
  left: 0;
  display: flex;
  align-items: center;
`;

const IconButton = styled.button`
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

  &:not(:last-child) {
    margin-right: 8px;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 32px;
  color: #333;
`;

const PostList = styled.div`
  display: grid;
  gap: 1rem;
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

const SearchBar = styled.input`
  font-size: 16px;
  border: 2px solid #4aaa87;
  padding: 8px;
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  &:focus {
    outline: none;
    border-color: #6dc4b0;
  }
`;

const CreatePostButton = styled(Link)`
  display: inline-block;
  padding: 8px 16px;
  margin-bottom: 16px;
  font-size: 16px;
  color: white;
  background-color: #4aaa87;
  border-radius: 8px;
  text-decoration: none;
  &:hover {
    background-color: #6dc4b0;
  }
`;

const BuyBoardTemplate = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/community/", {
          params: { post_type: 'buy' }
        });
        const sortedPosts = response.data.sort((a, b) => new Date(b.creation_date) - new Date(a.creation_date));
        setPosts(sortedPosts);
        setPosts(response.data);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleBackClick = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  const handleHomeClick = () => {
    navigate('/'); // 메인 화면으로 이동
  };

  return (
    <Container>
      <TitleBar>
        <ButtonGroup>
          <IconButton onClick={handleBackClick}>
            <FaArrowLeft />
          </IconButton>
          <IconButton onClick={handleHomeClick}>
            <FaHome />
          </IconButton>
        </ButtonGroup>
        <Title>구매 게시판</Title>
      </TitleBar>
      <SearchBar
        type="text"
        placeholder="제목을 검색하세요"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <CreatePostButton to="/post/create?post_type=buy">글 작성</CreatePostButton>
      <PostList>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell header>제목</TableCell>
              <TableCell header>작성자</TableCell>
              <TableCell header>작성일</TableCell>
            </TableRow>
          </TableHeader>
          <tbody>
            {filteredPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  <StyledLink to={`/post/${post.id}`}>
                    <PostTitle>{`${post.title} (${post.comment_count})`}</PostTitle>
                  </StyledLink>
                </TableCell>
                <TableCell>{post.user__username}</TableCell>
                <TableCell>{new Date(post.creation_date).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </PostList>
    </Container>
  );
};

export default BuyBoardTemplate;
