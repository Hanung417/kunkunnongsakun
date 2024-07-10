import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import {instance} from "../../apis/instance"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  background-color: #f9f9f9;
  height: 100%;
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
`;

const CommentAuthor = styled.div`
  font-weight: bold;
  margin-bottom: 4px;
`;

const CommentContent = styled.div`
  color: #555;
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

const CommentForm = styled.form``;

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
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await instance.get(`community/post/${id}/`);
        setPost(response.data);
        setComments(response.data.comments || []);
      } catch (error) {
        console.error("Failed to fetch post", error);
      }
    };
    fetchPost();
  }, [id]);

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleEditCommentChange = (event) => {
    setEditCommentContent(event.target.value);
  };

  const handleSubmitComment = async (event) => {
    event.preventDefault();
    try {
      const response = await instance.post(
        `community/post/${id}/comment/create/`,
        {
          content: newComment,
        }
      );
      setComments([...comments, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to post comment", error);
    }
  };

  const handleEditComment = async (commentId) => {
    try {
      const response = await instance.post(
        `community/comment/${commentId}/edit/`,
        {
          content: editCommentContent,
        }
      );
      setComments(
        comments.map((comment) =>
          comment.id === commentId ? response.data : comment
        )
      );
      setEditCommentId(null);
      setEditCommentContent("");
    } catch (error) {
      console.error("Failed to edit comment", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await instance.post(`community/comment/${commentId}/delete/`);
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Failed to delete comment", error);
    }
  };

  if (!post) {
    return <Container>게시글을 찾을 수 없습니다.</Container>;
  }

  return (
    <Container>
      <Title>{post.title}</Title>
      <PostMeta>
        <span>작성자: {post.user_id}</span>
        <span>작성일: {new Date(post.creation_date).toLocaleDateString()}</span>
      </PostMeta>
      <PostContent>{post.content}</PostContent>

      <CommentList>
        {comments.map((comment) => (
          <CommentItem key={comment.id}>
            <CommentAuthor>{comment.user_id}</CommentAuthor>
            {editCommentId === comment.id ? (
              <CommentTextarea
                rows="2"
                value={editCommentContent}
                onChange={handleEditCommentChange}
              />
            ) : (
              <CommentContent>{comment.content}</CommentContent>
            )}
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
          </CommentItem>
        ))}
      </CommentList>

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