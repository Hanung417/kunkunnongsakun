import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { fetchMyPosts, deletePost } from "../../../apis/post";
import { FaEllipsisV } from "react-icons/fa";
import ConfirmModal from "../../atoms/ConfirmModal";

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

const SettingsIcon = styled(FaEllipsisV)`
  cursor: pointer;
  font-size: 20px;
  color: #888;
`;

const SettingsMenu = styled.div`
  position: absolute;
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  display: ${(props) => (props.show ? "block" : "none")};
  z-index: 1;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const SettingsMenuItem = styled.button`
  background: none;
  border: none;
  padding: 12px 24px;
  width: 100%;
  text-align: left;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background: #f5f5f5;
    color: #4aaa87;
  }

  &:first-child {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  &:last-child {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
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

const MyPostTemplate = () => {
  const [posts, setPosts] = useState([]);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [currentPage, setCurrentPage] = useState(0);
  const settingsMenuRef = useRef();
  const navigate = useNavigate();

  const postsPerPage = 5;
  const pageCount = Math.ceil(posts.length / postsPerPage);
  const offset = currentPage * postsPerPage;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetchMyPosts();
        const sortedPosts = response.data.sort((a, b) => new Date(b.creation_date) - new Date(a.creation_date));
        setPosts(sortedPosts);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      }
    };
    fetchPosts();
  }, []);

  const handleEdit = (postId) => {
    navigate(`/post/edit/${postId}`);
  };

  const handleDelete = async () => {
    try {
      await deletePost(selectedPostId);
      setPosts(posts.filter((post) => post.id !== selectedPostId));
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to delete post", error);
    }
  };

  const handleSettingsClick = (event, postId) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuPosition({ top: rect.top + window.scrollY + 20, left: rect.left + window.scrollX });
    setShowSettingsMenu((prev) => !prev);
    setSelectedPostId(postId);
  };

  const closeModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedPostId(null);
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target)) {
        setShowSettingsMenu(false);
        setSelectedPostId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
              <TableCell header width="10%">설정</TableCell>
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
                <TableCell>
                  <SettingsIcon onClick={(event) => handleSettingsClick(event, post.id)} />
                  <SettingsMenu
                    show={showSettingsMenu && selectedPostId === post.id}
                    ref={settingsMenuRef}
                    style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
                  >
                    <SettingsMenuItem onClick={() => handleEdit(post.id)}>수정</SettingsMenuItem>
                    <SettingsMenuItem onClick={() => setIsDeleteModalOpen(true)}>삭제</SettingsMenuItem>
                  </SettingsMenu>
                </TableCell>
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