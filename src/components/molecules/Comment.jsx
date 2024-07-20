import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { FaPaperPlane, FaEllipsisV } from "react-icons/fa";
import { MdOutlineChatBubbleOutline } from "react-icons/md";
import ConfirmModal from "../atoms/ConfirmModal";

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
  display: flex;
  align-items: center;
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
  align-items: center;
  position: relative;
  margin-top: 12px;
  margin-left: ${(props) => (props.isReply ? "40px" : "0")};
`;

const CommentTextarea = styled.textarea`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  line-height: 1.5;
  border: 2px solid #ccc;
  border-radius: 8px;
  transition: border-color 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  &:focus {
    outline: none;
    border-color: #4aaa87;
    box-shadow: 0 2px 4px rgba(0, 123, 255, 0.25);
  }
`;

const CommentButton = styled.button`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #4aaa87;
  cursor: pointer;
  padding: 8px 16px;
  font-size: 20px;
  &:hover {
    color: #3e8e75;
  }
  &:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
`;

const EditCommentButton = styled.button`
  position: absolute;
  right: 5%;
  top: 50%;
  transform: translateY(-50%);
  background-color: #4aaa87;
  border-radius: 8px;
  border: none;
  color: whitesmoke;
  cursor: pointer;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold;
  &:hover {
    color: #3e8e75;
  }
  &:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
`;

const SettingsIcon = styled(FaEllipsisV)`
  cursor: pointer;
  font-size: 20px;
  color: #888;
  position: absolute;
  right: 16px;
  top: 16px;
`;

const SettingsMenu = styled.div`
  position: absolute;
  top: 30px;
  right: 0;
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
  setEditCommentContent
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
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedCommentId(null);
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
              >
                <CommentTextarea rows="2" value={editCommentContent} onChange={handleEditCommentChange} />
                <EditCommentButton type="submit" disabled={!editCommentContent.trim()}>
                  확인
                </EditCommentButton>
              </CommentForm>
            ) : (
              <CommentContent>{comment.content}</CommentContent>
            )}
            {String(currentUserId) === String(comment.user_id) && (
              <>
                <SettingsIcon onClick={() => handleSettingsClick(comment.id)} />
                <SettingsMenu
                  show={showSettingsMenu[comment.id]}
                  ref={(el) => (settingsMenuRefs.current[comment.id] = el)}
                  data-comment-id={comment.id}
                >
                  <SettingsMenuItem
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
                  </SettingsMenuItem>
                  <SettingsMenuItem onClick={() => handleDeleteClick(comment.id)}>삭제</SettingsMenuItem>
                </SettingsMenu>
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
      <label>댓글</label>
      <CommentList>{renderComments(comments)}</CommentList>
      <CommentForm onSubmit={handleSubmitComment}>
        <CommentTextarea
          rows="1"
          placeholder="댓글을 작성하세요"
          value={newComment}
          onChange={handleCommentChange}
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
        onConfirm={() => {
          handleDeleteComment(selectedCommentId);
          closeModal();
        }}
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