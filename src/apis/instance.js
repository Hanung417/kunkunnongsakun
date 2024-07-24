// instance.js
import axios from "axios";

export const BASE_URL = "http://localhost:8000";
export const instance = axios.create({
  baseURL: BASE_URL, // 서버 연결 시 서버 주소로 변경
  timeout: 50000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const getCookie = (name) => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

instance.interceptors.request.use((config) => {
  const csrftoken = getCookie("csrftoken");
  if (csrftoken) {
    config.headers["X-CSRFToken"] = csrftoken;
  }
  return config;
});

{/* instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      alert("로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다.");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
); */}