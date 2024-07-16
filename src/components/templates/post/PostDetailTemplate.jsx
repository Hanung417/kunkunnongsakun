// PostDetailTemplate.js
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { fetchPostDetail, createComment, createReply, editComment, deleteComment, deletePost } from "../../../apis/post";
import PostDetails from "../../molecules/PostDetail";
import Comments from "../../molecules/Comment";

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  height: 100%;
  padding: 24px;
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
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target)) {
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

  const handleSettingsClick = () => {
    setShowSettingsMenu((prev) => !prev);
  };

  if (!post) {
    return <Container>게시글을 찾을 수 없습니다.</Container>;
  }

  return (
    <Container>
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
      />
    </Container>
  );
};

export default PostDetailTemplate;