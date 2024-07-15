// post.js
import { instance } from "./instance";

// 게시글 가져오기
export const fetchPosts = (postType) => {
  return instance.get("/community/", {
    params: { post_type: postType },
  });
};

// 특정 게시글 가져오기
export const fetchPost = (postId) => {
  return instance.get(`/community/post/${postId}/`);
};

// 게시글 수정
export const editPost = (postId, formData) => {
  return instance.post(`/community/post/${postId}/edit/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 게시글 생성
export const createPost = (formData) => {
  return instance.post("/community/post/create/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 댓글 관련 API
export const fetchComments = (postId) => {
  return instance.get(`/community/post/${postId}/comments/`);
};

export const addComment = (postId, commentData) => {
  return instance.post(`/community/post/${postId}/comments/`, commentData);
};

// 댓글 단 게시글 가져오기
export const fetchMyCommentedPosts = () => {
  return instance.get("/community/mycommentedposts/");
};

// 내가 작성한 게시글 가져오기
export const fetchMyPosts = () => {
  return instance.get("/community/myposts/");
};

// 게시글 삭제
export const deletePost = (postId) => {
  return instance.post(`/community/post/${postId}/delete/`);
};

// 게시글 상세 정보 가져오기
export const fetchPostDetail = (postId) => {
  return instance.get(`/community/post/${postId}/`);
};

// 댓글 작성
export const createComment = (postId, commentData) => {
  return instance.post(`/community/post/${postId}/comment/create/`, commentData);
};

// 대댓글 작성
export const createReply = (postId, replyData) => {
  return instance.post(`/community/post/${postId}/comment/create/`, replyData);
};

// 댓글 수정
export const editComment = (commentId, commentData) => {
  return instance.post(`/community/comment/${commentId}/edit/`, commentData);
};

// 댓글 삭제
export const deleteComment = (commentId) => {
  return instance.post(`/community/comment/${commentId}/delete/`);
};