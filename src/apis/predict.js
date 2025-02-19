import { instance } from "./instance";

// 진단 세션 목록 가져오기
export const fetchDetectionSessions = () => {
  return instance.get("/detect/list_detection_sessions/");
};

// 특정 진단 세션 상세 정보 가져오기
export const fetchSessionDetails = (sessionId) => {
  return instance.get(`/detect/detection_session_details/${sessionId}/`);
};

// 진단 세션 삭제
export const deleteDetectionSession = (sessionId) => {
  return instance.delete(`/detect/delete_detection_session/${sessionId}/`);
};

// 이미지 업로드 및 진단 요청
export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append("image", file);

  return instance.post("/detect/upload/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getSoilCropData = () => {
  return instance.get('/soil/crop_data/');
};

export const deleteSoilData = (sessionId) => {
  return instance.delete(`/soil/delete_soil_data/${sessionId}/`, {
    headers: {
    },
  });
};

export const getCropNames = () => {
  return instance.get('/soil/get-crop-names/');
};

export const getSoilExamData = (cropName, address) => {
  return instance.post('/soil/soil_exam/', JSON.stringify({ crop_name: cropName, address }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const getSoilFertilizerInfo = (data) => {
  return instance.post('/soil/get-soil-fertilizer-info/', JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};