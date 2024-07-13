import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom"; // useNavigate 추가
import styled from "styled-components";
import { instance } from "../../apis/instance";
import { FaArrowLeft } from "react-icons/fa"; // 화살표 아이콘 추가

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  background-color: #f9f9f9;
  height: 100%;
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
  margin-bottom: 12px;
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
  margin-top: 16px;
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
  margin-left: ${(props) => (props.isReply ? "40px" : "0")}; // 대댓글 들여쓰기

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
`;

const PostDetailTemplate = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // useNavigate 훅 추가
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyCommentId, setReplyCommentId] = useState(null); // 대댓글을 달 댓글의 ID
  const [newReply, setNewReply] = useState(""); // 대댓글 내용
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  const currentUserId = localStorage.getItem("userId"); // 로컬스토리지에서 현재 사용자 ID 가져오기

  const fetchPost = useCallback(async () => {
    try {
      const response = await instance.get(`community/post/${id}/`);
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
      await instance.post(
        `community/post/${id}/comment/create/`,
        {
          content: newComment,
        }
      );
      await fetchPost();
      setNewComment("");
    } catch (error) {
      console.error("Failed to post comment", error);
    }
  };

  const handleSubmitReply = async (event) => {
    event.preventDefault();
    try {
      await instance.post(
        `community/post/${id}/comment/create/`,
        {
          content: newReply,
          parent_id: replyCommentId, // 대댓글의 부모 ID 설정
        }
      );
      await fetchPost();
      setNewReply("");
      setReplyCommentId(null);
    } catch (error) {
      console.error("Failed to post reply", error);
    }
  };

  const handleEditComment = async (commentId) => {
    try {
      await instance.post(
        `community/comment/${commentId}/edit/`,
        {
          content: editCommentContent,
        }
      );
      await fetchPost();
      setEditCommentId(null);
      setEditCommentContent("");
    } catch (error) {
      console.error("Failed to edit comment", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await instance.post(`community/comment/${commentId}/delete/`);
      await fetchPost();
    } catch (error) {
      console.error("Failed to delete comment", error);
    }
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
              <CommentTextarea
                rows="2"
                value={editCommentContent}
                onChange={handleEditCommentChange}
              />
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
                <CommentButton type="submit">댓글 작성</CommentButton>
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

  const imageUrl = `${process.env.REACT_APP_API_URL}${post.image}`;

  return (
    <Container>
      <TitleBar>
        <BackButton onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </BackButton>
        <Title>{post.title}</Title>
      </TitleBar>
      <PostMeta>
        <span>작성자: {post.user_id}</span>
        <span>작성일: {new Date(post.creation_date).toLocaleDateString()}</span>
      </PostMeta>
      <PostContent>{post.content}</PostContent>
      {post.image && <PostImage src={imageUrl} alt="Post Image" />}
      <CommentList>{renderComments(comments)}</CommentList>

      <CommentForm onSubmit={handleSubmitComment}>
        <CommentTextarea
          rows="4"
          placeholder="댓글을 작성하세요"
          value={newComment}
          onChange={handleCommentChange}
        />
        <CommentButton type="submit">댓글 작성</CommentButton>
      </CommentForm>
    </Container>
  );
};

export default PostDetailTemplate;
