// Comments.js
import React from "react";
import styled from "styled-components";
import { FaPaperPlane, FaArrowLeft } from "react-icons/fa";
import { MdOutlineChatBubbleOutline } from "react-icons/md";

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
  font-size: 16px;
  &:hover {
    color: #3e8e75;
  }
  &:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
`;

const ReplyButton = styled.button`
  background: none;
  border: none;
  color: #4aaa87;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px 8px;
  &:hover {
    background-color: #f0f0f0;
    border-radius: 4px;
  }
`;

const Comments = ({
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
    </>
  );
};

export default Comments;