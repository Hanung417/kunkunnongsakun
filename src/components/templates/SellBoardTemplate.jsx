import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FaUserAlt, FaCalendarAlt } from "react-icons/fa";

const Container = styled.div`
  display: grid;
  gap: 1.5rem;
  padding: 24px;
  background-color: #f5f5f5;
`;

const Title = styled.h1`
  font-size: 20px;
  margin-bottom: 12px;
  color: #444;
  position: sticky;
  top: 0;
  background-color: #f5f5f5;
  padding: 16px;
  z-index: 1000;
  border-bottom: 2px solid #4aaa87;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SearchBar = styled.input`
  width: 96%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const PostList = styled.div`
  display: grid;
  gap: 1rem;
`;

const PostItem = styled.div`
  background-color: #ffffff;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 8px 2px;
  width: 100%;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const PostTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 8px;
  color: #4aaa87;
`;

const PostMeta = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #888;
  margin-bottom: 8px;
`;

const MetaIcon = styled.div`
  display: flex;
  align-items: center;
  margin-right: 8px;
  color: #6b7280;
`;

const PostContent = styled.p`
  color: #555;
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SellBoardTemplate = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const posts = [
    {
      id: 1,
      title: "신선한 쌀 판매합니다",
      author: "홍길동",
      date: "2024-06-30",
      content:
        "10킬로그램의 신선한 쌀을 판매합니다. 관심 있으신 분은 연락주세요.",
    },
    {
      id: 2,
      title: "감자 판매합니다",
      author: "김철수",
      date: "2024-06-29",
      content:
        "양질의 감자를 판매합니다. 5킬로그램 단위로 판매합니다. 연락 부탁드립니다.",
    },
    {
      id: 3,
      title: "당근 판매합니다",
      author: "이영희",
      date: "2024-06-28",
      content:
        "신선한 당근을 판매합니다. 3킬로그램 단위로 판매합니다. 연락주세요.",
    },
    {
      id: 4,
      title: "고구마 판매합니다",
      author: "박민수",
      date: "2024-06-27",
      content: "고구마를 판매합니다. 7킬로그램 단위로 판매합니다. 연락주세요.",
    },
    {
      id: 5,
      title: "양파 판매합니다",
      author: "최영희",
      date: "2024-06-26",
      content:
        "양파를 판매합니다. 4킬로그램 단위로 판매합니다. 연락 부탁드립니다.",
    },
    {
      id: 6,
      title: "수박 판매합니다",
      author: "김민수",
      date: "2024-06-25",
      content:
        "수박을 판매합니다. 상태 좋은 수박을 한 통씩 판매합니다. 연락주세요.",
    },
    {
      id: 7,
      title: "토마토 판매합니다",
      author: "이철수",
      date: "2024-06-24",
      content:
        "토마토를 판매합니다. 2kg 단위로 판매합니다. 신선한 상태로 보내드립니다. 연락주세요.",
    },
    {
      id: 8,
      title: "딸기 판매합니다",
      author: "박영희",
      date: "2024-06-23",
      content:
        "딸기를 판매합니다. 1kg 단위로 판매합니다. 신선한 딸기입니다. 연락주세요.",
    },
    {
      id: 9,
      title: "배추 판매합니다",
      author: "최철수",
      date: "2024-06-22",
      content:
        "배추를 판매합니다. 5포기 단위로 판매합니다. 좋은 품질의 배추입니다. 연락주세요.",
    },
    {
      id: 10,
      title: "오이 판매합니다",
      author: "김영희",
      date: "2024-06-21",
      content:
        "오이를 판매합니다. 10개 단위로 판매합니다. 신선한 상태로 보내드립니다. 연락주세요.",
    },
  ];

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Container>
      <Title>판매 게시판</Title>
      <SearchBar
        type="text"
        placeholder="제목을 검색하세요..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <PostList>
        {filteredPosts.map((post) => (
          <PostItem key={post.id}>
            <StyledLink to={`/post/${post.id}`}>
              <PostTitle>{post.title}</PostTitle>
              <PostMeta>
                <MetaIcon>
                  <FaUserAlt size={14} style={{ marginRight: "4px" }} />
                  {post.author}
                </MetaIcon>
                <MetaIcon>
                  <FaCalendarAlt size={14} style={{ marginRight: "4px" }} />
                  {post.date}
                </MetaIcon>
              </PostMeta>
              <PostContent>{post.content}</PostContent>
            </StyledLink>
          </PostItem>
        ))}
      </PostList>
    </Container>
  );
};

export default SellBoardTemplate;
