import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { fetchPosts } from "../../../apis/post";
import { FaPen } from "react-icons/fa";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
`;

const PostList = styled.div`
  display: grid;
  gap: 1rem;
  width: 100%;
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
  padding: 8px;
  border-bottom: 1px solid #ccc;
  font-size: 14px;
  color: ${(props) => (props.$header ? "aliceblue" : "black")};
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

const CommentCount = styled.span`
  font-size: 14px;
  color: gray;
  margin-left: 8px;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
  margin-top: 40px;
  padding: 16px;
`;

const SearchInput = styled.input`
  font-size: 14px;
  border: 2px solid #4aaa87;
  padding: 8px;
  border-radius: 12px;
  flex: 1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  &:focus {
    outline: none;
    border-color: #6dc4b0;
  }
`;

const CreatePostButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  font-size: 14px;
  color: white;
  background-color: #4aaa87;
  border-radius: 8px;
  text-decoration: none;
  margin-left: 8px;
  &:hover {
    background-color: #6dc4b0;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
  .pagination {
    display: flex;
    list-style: none;
    padding: 0;
  }

  .pagination li {
    margin: 0 5px;
  }

  .pagination li a {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    color: #4aaa87;
    text-decoration: none;
    transition: background-color 0.3s, color 0.3s;
  }

  .pagination li a:hover {
    background-color: #f5f5f5;
    color: #3e8e75;
  }

  .pagination li.active a {
    background-color: #4aaa87;
    color: white;
    border: none;
  }

  .pagination li.previous a,
  .pagination li.next a {
    color: #888;
  }

  .pagination li.disabled a {
    color: #ccc;
    cursor: not-allowed;
  }
`;

const ExchangeBoardTemplate = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  const postsPerPage = 5;
  const pageCount = Math.ceil(posts.length / postsPerPage);
  const offset = currentPage * postsPerPage;

  useEffect(() => {
    const fetchPostsData = async () => {
      try {
        const response = await fetchPosts("exchange");
        const sortedPosts = response.data.sort((a, b) => new Date(b.creation_date) - new Date(a.creation_date));
        setPosts(sortedPosts);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      }
    };
    fetchPostsData();
  }, []);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <Container>
      <SearchBar>
        <SearchInput
          type="text"
          placeholder="제목을 검색하세요"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <CreatePostButton to="/post/create?post_type=exchange">
          <FaPen style={{ marginRight: '8px' }} /> 글 작성
        </CreatePostButton>
      </SearchBar>
      <PostList>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell $header>제목</TableCell>
              <TableCell $header>작성자</TableCell>
              <TableCell $header>작성일</TableCell>
            </TableRow>
          </TableHeader>
          <tbody>
            {filteredPosts.slice(offset, offset + postsPerPage).map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  <StyledLink to={`/post/${post.id}`}>
                    <PostTitle>{post.title}</PostTitle>
                    <CommentCount>({post.comment_count})</CommentCount>
                  </StyledLink>
                </TableCell>
                <TableCell>{post.user__username}</TableCell>
                <TableCell>{new Date(post.creation_date).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </PostList>
      <PaginationContainer>
        <ReactPaginate
          previousLabel={"이전"}
          nextLabel={"다음"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
          previousClassName={"previous"}
          nextClassName={"next"}
          disabledClassName={"disabled"}
        />
      </PaginationContainer>
    </Container>
  );
};

export default ExchangeBoardTemplate;