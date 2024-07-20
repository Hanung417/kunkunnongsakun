// PostDetailTemplate.js
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  fetchPostDetail,
  createComment,
  createReply,
  editComment,
  deleteComment,
  deletePost,
} from "../../../apis/post";
import PostDetails from "../../molecules/PostDetail";
import Comments from "../../molecules/Comment";

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 24px;
`;

const PostContainer = styled.div`
  margin-bottom: 24px;
  padding: 16px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const CommentsContainer = styled.div`
  padding: 16px;
  background-color: #f1f1f1;
  border: 1px solid #ccc;
  border-radius: 8px;
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null); // 추가된 상태
  const currentUserId = localStorage.getItem("userId");

  const settingsMenuRef = useRef();

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        settingsMenuRef.current &&
        !settingsMenuRef.current.contains(event.target)
      ) {
        setShowSettingsMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      const updatedComments = comments.map((comment) =>
        comment.id === commentId
          ? { ...comment, content: editCommentContent }
          : comment
      );
      setComments(updatedComments);
      setEditCommentId(null);
      setEditCommentContent("");
    } catch (error) {
      console.error("Failed to edit comment", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments(comments.filter((comment) => comment.id !== commentId));
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

  const handleSettingsClick = () => {
    setShowSettingsMenu((prev) => !prev);
  };

  if (!post) {
    return <Container>게시글을 찾을 수 없습니다.</Container>;
  }

  return (
    <Container>
      <PostContainer>
        <PostDetails
          post={post}
          currentUserId={currentUserId}
          showSettingsMenu={showSettingsMenu}
          settingsMenuRef={settingsMenuRef}
          openModal={openModal}
          handleSettingsClick={handleSettingsClick}
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          handleDeletePost={handleDeletePost}
        />
      </PostContainer>
      <CommentsContainer>
        <Comments
          comments={comments}
          newComment={newComment}
          newReply={newReply}
          replyCommentId={replyCommentId}
          editCommentId={editCommentId}
          editCommentContent={editCommentContent}
          handleCommentChange={handleCommentChange}
          handleEditCommentChange={handleEditCommentChange}
          handleReplyChange={handleReplyChange}
          handleSubmitComment={handleSubmitComment}
          handleSubmitReply={handleSubmitReply}
          handleEditComment={handleEditComment}
          handleDeleteComment={handleDeleteComment}
          setReplyCommentId={setReplyCommentId}
          currentUserId={currentUserId}
          setEditCommentId={setEditCommentId}
          setEditCommentContent={setEditCommentContent}
          setSelectedCommentId={setSelectedCommentId} // 추가된 부분
          setShowSettingsMenu={setShowSettingsMenu} // 추가된 부분
        />
      </CommentsContainer>
    </Container>
  );
};

export default PostDetailTemplate;