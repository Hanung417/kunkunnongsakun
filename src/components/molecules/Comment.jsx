import React, { useState, useRef, useEffect } from "react";
import {
  CommentList,
  CommentItem,
  CommentAuthor,
  CommentContent,
  CommentMeta,
  CommentActions,
  CommentForm,
  CommentTextarea,
  CommentButton,
  EditCommentButton,
  SettingsIcon2,
  SettingsMenu2,
  SettingsMenuItem2,
} from "../../styles/Post";
import { FaPaperPlane } from "react-icons/fa";
import { MdOutlineChatBubbleOutline } from "react-icons/md";
import ConfirmModal from "../atoms/ConfirmModal";

const Comment = ({
  comments,
  newComment,
  newReply,
  replyCommentId,
  editCommentId,
  editCommentContent,
  handleCommentChange,
  handleEditCommentChange,
  handleReplyChange,
  handleSubmitComment,
  handleSubmitReply,
  handleEditComment,
  handleDeleteComment,
  setReplyCommentId,
  currentUserId,
  setEditCommentId,
  setEditCommentContent,
}) => {
  const [showSettingsMenu, setShowSettingsMenu] = useState({});
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const settingsMenuRefs = useRef({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.values(settingsMenuRefs.current).forEach((ref) => {
        if (ref && !ref.contains(event.target)) {
          setShowSettingsMenu((prev) => ({
            ...prev,
            [ref.dataset.commentId]: false,
          }));
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSettingsClick = (commentId) => {
    setShowSettingsMenu((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
    setSelectedCommentId(commentId);
  };

  const handleDeleteClick = (commentId) => {
    setSelectedCommentId(commentId);
    setShowSettingsMenu((prev) => ({
      ...prev,
      [commentId]: false,
    }));
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedCommentId(null);
  };

  const handleKeyDown = (event, handler) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handler(event);
    }
  };

  const handleConfirmDelete = () => {
    handleDeleteComment(selectedCommentId);
    closeModal();
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
              <CommentForm
                onSubmit={(e) => {
                  e.preventDefault();
                  handleEditComment(comment.id);
                }}
                style={{ display: 'flex', alignItems: 'center' }} // Flexbox for alignment
              >
                <CommentTextarea
                  rows="2"
                  value={editCommentContent}
                  onChange={handleEditCommentChange}
                  onKeyDown={(e) => handleKeyDown(e, () => handleEditComment(comment.id))}
                  style={{ flex: 1 }} // Allow textarea to grow
                />
                <EditCommentButton type="submit" disabled={!editCommentContent.trim()}>
                  확인
                </EditCommentButton>
              </CommentForm>
            ) : (
              <CommentContent>{comment.content}</CommentContent>
            )}
            {String(currentUserId) === String(comment.user_id) && (
              <>
                <SettingsIcon2 onClick={() => handleSettingsClick(comment.id)} />
                <SettingsMenu2
                  show={showSettingsMenu[comment.id]}
                  ref={(el) => (settingsMenuRefs.current[comment.id] = el)}
                  data-comment-id={comment.id}
                >
                  <SettingsMenuItem2
                    onClick={() => {
                      setEditCommentId(comment.id);
                      setEditCommentContent(comment.content);
                      setShowSettingsMenu((prev) => ({
                        ...prev,
                        [comment.id]: false,
                      }));
                    }}
                  >
                    수정
                  </SettingsMenuItem2>
                  <SettingsMenuItem2 onClick={() => handleDeleteClick(comment.id)}>삭제</SettingsMenuItem2>
                </SettingsMenu2>
              </>
            )}
            {parentId === null && (
              <CommentActions>
                <button onClick={() => setReplyCommentId(comment.id)}>
                  <MdOutlineChatBubbleOutline /> 답글
                </button>
              </CommentActions>
            )}
            {renderComments(comments, comment.id)}
            {replyCommentId === comment.id && (
              <CommentForm isReply onSubmit={handleSubmitReply}>
                <CommentTextarea
                  rows="2"
                  placeholder="댓글을 작성하세요"
                  value={newReply}
                  onChange={handleReplyChange}
                  onKeyDown={(e) => handleKeyDown(e, handleSubmitReply)}
                />
                <CommentButton type="submit" disabled={!newReply.trim()}><FaPaperPlane /></CommentButton>
              </CommentForm>
            )}
          </CommentItem>
        </React.Fragment>
      ));
  };

  return (
    <>
      <CommentList>{renderComments(comments)}</CommentList>
      <CommentForm onSubmit={handleSubmitComment}>
        <CommentTextarea
          rows="1"
          placeholder="댓글을 작성하세요"
          value={newComment}
          onChange={handleCommentChange}
          onKeyDown={(e) => handleKeyDown(e, handleSubmitComment)}
        />
        <CommentButton type="submit" disabled={!newComment.trim()}>
          <FaPaperPlane />
        </CommentButton>
      </CommentForm>
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeModal}
        title="삭제 확인"
        content="이 댓글을 삭제하시겠습니까?"
        onConfirm={handleConfirmDelete}
        closeModal={closeModal}
        confirmText="삭제"
        cancelText="취소"
        confirmColor="#e53e3e"
        confirmHoverColor="#c53030"
        cancelColor="#4aaa87"
        cancelHoverColor="#3b8b6d"
      />
    </>
  );
};

export default Comment;