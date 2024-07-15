import { instance } from "./instance";

// 게시물 생성 API
export const createPost = async (postData) => {
  try {
    const response = await instance.post("community/post/create/", postData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

// 게시물 목록 조회 API
export const fetchPosts = async (postType) => {
  try {
    const response = await instance.get("community/", {
      params: { post_type: postType },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

// 특정 게시물 조회 API
export const fetchPost = async (postId) => {
  try {
    const response = await instance.get(`community/post/${postId}/`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
};

// 게시물 수정 API
export const updatePost = async (postId, postData) => {
  try {
    const response = await instance.post(`community/post/${postId}/edit/`, postData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

// 게시물 삭제 API
export const deletePost = async (postId) => {
  try {
    const response = await instance.post(`community/post/${postId}/delete/`, {}, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};

// 댓글 생성 API
export const createComment = async (postId, commentData) => {
  try {
    const response = await instance.post(`community/post/${postId}/comment/create/`, commentData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};

// 댓글 수정 API
export const updateComment = async (commentId, commentData) => {
  try {
    const response = await instance.post(`community/comment/${commentId}/edit/`, commentData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating comment:", error);
    throw error;
  }
};

// 댓글 삭제 API
export const deleteComment = async (commentId) => {
  try {
    const response = await instance.post(`community/comment/${commentId}/delete/`, {}, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

// 사용자의 작성 글 조회 API
export const fetchUserPosts = async () => {
  try {
    const response = await instance.get("community/myposts/", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    throw error;
  }
};

// 사용자가 댓글을 단 글 조회 API
export const fetchUserCommentedPosts = async () => {
  try {
    const response = await instance.get("community/mycommentedposts/", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user commented posts:", error);
    throw error;
  }
};
