import { instance } from "./instance";

export const getCropList = () => {
  return instance.get("prediction/list_sessions/");
};

export const deleteCrop = (sessionId) => {
  return instance.delete(`prediction/delete_session/${sessionId}/`);
};

export const getCropNames = () => {
  return instance.get("prediction/get_crop_names/");
};

export const getRegionNames = () => {
  return instance.get("prediction/get_region_names/");
};

export const predictCrops = (data) => {
  return instance.post("prediction/predict/", data);
};

export const getSessionDetails = (sessionId) => {
  return instance.get(`prediction/session_details/${sessionId}/`);
};

export const updateSessionName = (sessionId, newSessionName) => {
  return instance.patch(`/prediction/update_session_name/${sessionId}/`, {
    session_name: newSessionName,
  });
};