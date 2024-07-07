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
