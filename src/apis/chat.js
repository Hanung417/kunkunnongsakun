// chat.js
import { instance } from './instance';

export const fetchChatSessions = () => {
  return instance.get('/selfchatbot/chat_sessions/');
};

export const fetchChatHistory = (sessionId) => {
  return instance.get(`/selfchatbot/chat_history/${sessionId}/`);
};

export const sendChatMessage = (messageData) => {
  return instance.post('/selfchatbot/chatbot/', messageData);
};

export const deleteChatSession = (sessionId) => {
  return instance.delete(`/selfchatbot/delete_session/${sessionId}/`);
};

export const updateSessionName = (sessionId, newSessionName) => {
  return instance.patch(`/selfchatbot/update_session_name/${sessionId}/`, {
    session_name: newSessionName,
  });
};
