// crop.js

import { instance } from "./instance";

// 작물 목록 조회
export const getCropList = () => {
  return instance.get("prediction/list_sessions/");
};

// 작물 삭제
export const deleteCrop = (sessionId) => {
  return instance.delete(`prediction/delete_session/${sessionId}/`);
};

// 작물 이름 목록 조회
export const getCropNames = () => {
  return instance.get("prediction/get_crop_names/");
};

// 작물 예측 요청
export const predictCrops = (data) => {
  return instance.post("prediction/predict/", data);
};

// 세션 상세 조회
export const getSessionDetails = (sessionId) => {
  return instance.get(`prediction/session_details/${sessionId}/`);
};

// 세션 이름 변경
export const updateSessionName = (sessionId, newSessionName) => {
  return instance.patch(`/prediction/update_session_name/${sessionId}/`, {
    session_name: newSessionName,
  });
};