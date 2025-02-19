import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { fetchMyPosts, deletePost } from "../../../apis/post";
import ConfirmModal from "../../atoms/ConfirmModal";
import { useLoading } from "../../../LoadingContext";
import GlobalLoader from "../../atoms/GlobalLoader";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background-color: #f9f9f9;
  max-width: 75rem;
  width: 100%;
  margin: 0 auto;
`;

const PostList = styled.div`
  display: grid;
  gap: 1rem;
  margin-top: 32px;
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
  padding: 12px;
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

const MyPostTemplate = () => {
  const { setIsLoading, isLoading } = useLoading();
  const [posts, setPosts] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  const postsPerPage = 5;
  const pageCount = Math.ceil(posts.length / postsPerPage);
  const offset = currentPage * postsPerPage;

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await fetchMyPosts();
        const sortedPosts = response.data.sort((a, b) => new Date(b.creation_date) - new Date(a.creation_date));
        setPosts(sortedPosts);
      } catch (error) {
        alert("게시글을 불러오는데 실패했습니다. 다시 시도해주세요.");
      }
      setIsLoading(false);
    };
    fetchPosts();
  }, [setIsLoading]);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deletePost(selectedPostId);
      setPosts(posts.filter((post) => post.id !== selectedPostId));
      setIsDeleteModalOpen(false);
      setSelectedPostId(null);
    } catch (error) {
      alert("게시글 삭제에 실패했습니다. 다시 시도해주세요.");
    }
    setIsLoading(false);
  };

  const closeModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedPostId(null);
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <Container>
      <GlobalLoader isLoading={isLoading} />
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
            {posts.slice(offset, offset + postsPerPage).map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  <StyledLink to={`/post/${post.id}`}>
                    <PostTitle>{post.title}</PostTitle>
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
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeModal}
        title="삭제 확인"
        content="이 게시글을 삭제하시겠습니까?"
        onConfirm={handleDelete}
        closeModal={closeModal}
        confirmText="삭제"
        cancelText="취소"
        confirmColor="#e53e3e"
        confirmHoverColor="#c53030"
        cancelColor="#4aaa87"
        cancelHoverColor="#3b8b6d"
      />
    </Container>
  );
};

export default MyPostTemplate;