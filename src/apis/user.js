// user.js

import { instance } from "./instance";

// 회원가입 api
export const checkUsername = (username) => {
  return instance.get(`login/check_username/?username=${username}`);
};

export const sendVerificationEmail = (email) => {
  return instance.post("login/send_verification_email/", { email });
};

export const signupUser = (formData) => {
  return instance.post("login/signup/", formData);
};

// 로그인 api
export const loginUser = (email, password) => {
  return instance.post("/login/login/", { email, password });
};

// 인증 상태 체크 api
export const checkAuthStatus = () => {
  return instance.get("login/auth_check/");
};

// 로그아웃 api
export const logoutUser = () => {
  return instance.post("login/logout/");
};

// 비밀번호 변경 api
export const changePassword = (formData) => {
  return instance.post("login/change_password/", formData);
};

// 사용자 이름 변경 api
export const changeUsername = (newUsername) => {
  return instance.post("login/change_username/", { new_username: newUsername });
};

// 계정 삭제 api
export const deleteAccount = (password) => {
  return instance.post("login/delete_account/", { password });
};

// 비밀번호 재설정 api
export const sendTemporaryPassword = (email) => {
  return instance.post("login/password_reset/", { email });
};

export const resetPassword = (formData) => {
  return instance.post("login/password_reset_done/", formData);
};

// CSRFToken 가져오기
export const getCSRFToken = () => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, 10) === 'csrftoken=') {
        cookieValue = decodeURIComponent(cookie.substring(10));
        break;
      }
    }
  }
  return cookieValue;
};