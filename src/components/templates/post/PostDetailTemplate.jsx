import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { fetchPostDetail, createComment, createReply, editComment, deleteComment, deletePost } from "../../../apis/post";
import { FaArrowLeft, FaEllipsisV, FaEdit, FaTrash, FaCog } from "react-icons/fa";
import ConfirmModal from "../../atoms/ConfirmModal";

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 24px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const TitleBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 24px;
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
  border-bottom: 2px solid #4aaa87;
  padding-bottom: 8px;
  text-align: center;
`;

const PostMeta = styled.div`
  font-size: 14px;
  color: #888;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
`;

const PostContent = styled.p`
  color: #555;
  font-size: 16px;
  line-height: 1.6;
  background-color: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const PostImage = styled.img`
  max-width: 100%;
  max-height: 400px;
  width: auto;
  height: auto;
  margin-top: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SettingsIcon = styled(FaEllipsisV)`
  position: absolute;
  right: 0;
  cursor: pointer;
  font-size: 24px;
  color: #4aaa87;
`;

const SettingsMenu = styled.div`
  position: absolute;
  top: 40px;
  right: 0; /* 오른쪽 정렬 */
  background: #ffffff; /* 배경색 */
  border: 1px solid #e0e0e0; /* 밝은 테두리 */
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
  display: ${(props) => (props.show ? "block" : "none")};
  z-index: 1;
  animation: fadeIn 0.3s ease; /* 부드러운 등장 애니메이션 */

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
  color: #333; /* 텍스트 색상 */
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s; /* 부드러운 전환 효과 */

  &:hover {
    background: #f5f5f5; /* 호버 시 배경색 */
    color: #4aaa87; /* 호버 시 텍스트 색상 */
  }

  & > svg {
    margin-right: 8px; /* 아이콘과 텍스트 사이 여백 */
    font-size: 18px; /* 아이콘 크기 */
  }

  &:first-child {
    border-top-left-radius: 8px; /* 첫 항목 좌상단 모서리 둥글게 */
    border-top-right-radius: 8px; /* 첫 항목 우상단 모서리 둥글게 */
  }

  &:last-child {
    border-bottom-left-radius: 8px; /* 마지막 항목 좌하단 모서리 둥글게 */
    border-bottom-right-radius: 8px; /* 마지막 항목 우하단 모서리 둥글게 */
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: #e0e0e0;
  margin: 4px 0;
`;

const CommentList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-top: 24px;
`;

const CommentItem = styled.li`
  background-color: #ffffff;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 8px 16px;
  margin-bottom: 12px;
  position: relative;
  margin-left: ${(props) => (props.isReply ? "40px" : "0")};

  &::before {
    content: "${(props) => (props.isReply ? "↳" : "")}";
    position: absolute;
    left: -20px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 18px;
    color: #4aaa87;
  }
`;

const CommentAuthor = styled.div`
  font-weight: bold;
  margin-bottom: 4px;
`;

const CommentContent = styled.div`
  color: #555;
`;

const CommentMeta = styled.div`
  font-size: 12px;
  color: #888;
  margin-bottom: 4px;
`;

const CommentActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 4px;

  button {
    background: none;
    border: none;
    color: #4aaa87;
    cursor: pointer;
  }
`;

const CommentForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 12px;
`;

const CommentTextarea = styled.textarea`
  width: 100%;
  margin: 8px 8px 8px 0;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  &:focus {
    outline: none;
    border-color: #4aaa87;
  }
`;

const CommentButton = styled.button`
  margin-top: 12px;
  padding: 8px 16px;
  font-size: 16px;
  background-color: #4aaa87;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #3e8e75;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const PostDetailTemplate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyCommentId, setReplyCommentId] = useState(null);
  const [newReply, setNewReply] = useState("");
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 추가
  const currentUserId = localStorage.getItem("userId");

  const fetchPost = useCallback(async () => {
    try {
      const response = await fetchPostDetail(id);
      setPost(response.data);
      setComments(response.data.comments || []);
    } catch (error) {
      console.error("Failed to fetch post", error);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleEditCommentChange = (event) => {
    setEditCommentContent(event.target.value);
  };

  const handleReplyChange = (event) => {
    setNewReply(event.target.value);
  };

  const handleSubmitComment = async (event) => {
    event.preventDefault();
    try {
      await createComment(id, { content: newComment });
      await fetchPost();
      setNewComment("");
    } catch (error) {
      console.error("Failed to post comment", error);
    }
  };

  const handleSubmitReply = async (event) => {
    event.preventDefault();
    try {
      await createReply(id, { content: newReply, parent_id: replyCommentId });
      await fetchPost();
      setNewReply("");
      setReplyCommentId(null);
    } catch (error) {
      console.error("Failed to post reply", error);
    }
  };

  const handleEditComment = async (commentId) => {
    try {
      await editComment(commentId, { content: editCommentContent });
      await fetchPost();
      setEditCommentId(null);
      setEditCommentContent("");
    } catch (error) {
      console.error("Failed to edit comment", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      await fetchPost();
    } catch (error) {
      console.error("Failed to delete comment", error);
    }
  };

  const handleDeletePost = async () => {
    try {
      await deletePost(id);
      if (post.post_type === "sell") {
          navigate("/sellboard");
      }
      if (post.post_type === "buy") {
          navigate("/buyboard");
      }
      if (post.post_type === "exchange") {
          navigate("/exchangeboard");
      }
    } catch (error) {
      console.error("Failed to delete post", error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const renderComments = (comments, parentId = null) => {
    return comments
      .filter((comment) => comment.parent_id === parentId)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      .map((comment) => (
        <React.Fragment key={comment.id}>
          <CommentItem isReply={parentId !== null}>
            <CommentAuthor>{comment.user__username}</CommentAuthor>
            <CommentMeta>{new Date(comment.created_at).toLocaleString()}</CommentMeta>
            {editCommentId === comment.id ? (
              <CommentTextarea rows="2" value={editCommentContent} onChange={handleEditCommentChange} />
            ) : (
              <CommentContent>{comment.content}</CommentContent>
            )}
            {String(currentUserId) === String(comment.user_id) && (
              <CommentActions>
                {editCommentId === comment.id ? (
                  <button onClick={() => handleEditComment(comment.id)}>저장</button>
                ) : (
                  <button
                    onClick={() => {
                      setEditCommentId(comment.id);
                      setEditCommentContent(comment.content);
                    }}
                  >
                    수정
                  </button>
                )}
                <button onClick={() => handleDeleteComment(comment.id)}>삭제</button>
              </CommentActions>
            )}
            {parentId === null && (
              <CommentActions>
                <button onClick={() => setReplyCommentId(comment.id)}>
                  <FaArrowLeft /> 댓글
                </button>
              </CommentActions>
            )}
          </CommentItem>
          {replyCommentId === comment.id && (
            <CommentItem isReply>
              <CommentForm onSubmit={handleSubmitReply}>
                <CommentTextarea
                  rows="2"
                  placeholder="댓글을 작성하세요"
                  value={newReply}
                  onChange={handleReplyChange}
                />
                <CommentButton type="submit" disabled={!newReply.trim()}>댓글 작성</CommentButton>
              </CommentForm>
            </CommentItem>
          )}
          {renderComments(comments, comment.id)}
        </React.Fragment>
      ));
  };

  if (!post) {
    return <Container>게시글을 찾을 수 없습니다.</Container>;
  }

  return (
    <Container>
      <TitleBar>
        <Title>{post.title}</Title>
        {String(currentUserId) === String(post.user_id) && (
          <>
            <SettingsIcon onClick={() => setShowSettingsMenu(!showSettingsMenu)} />
            <SettingsMenu show={showSettingsMenu}>
              <SettingsMenuItem onClick={() => navigate(`/post/edit/${id}`)}>
                수정
              </SettingsMenuItem>
               <Divider />
              <SettingsMenuItem onClick={openModal}>
                삭제
              </SettingsMenuItem>
            </SettingsMenu>
          </>
        )}
      </TitleBar>
      <PostMeta>
        <span>작성자: {post.username}</span>
        <span>작성일: {new Date(post.creation_date).toLocaleDateString()}</span>
      </PostMeta>
      <PostContent>{post.content}</PostContent>
      {post.image && <PostImage src={post.image} alt="Post Image" />}
      <CommentList>{renderComments(comments)}</CommentList>

      <CommentForm onSubmit={handleSubmitComment}>
        <CommentTextarea
          rows="4"
          placeholder="댓글을 작성하세요"
          value={newComment}
          onChange={handleCommentChange}
        />
        <CommentButton type="submit" disabled={!newComment.trim()}>댓글 작성</CommentButton>
      </CommentForm>

      <ConfirmModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        title="삭제 확인"
        content="이 게시글을 삭제하시겠습니까?"
        onConfirm={handleDeletePost}
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

export default PostDetailTemplate;