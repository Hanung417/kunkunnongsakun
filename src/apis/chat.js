import { instance } from "./instance";

// Fetch chat sessions
export const fetchChatSessions = () => {
  return instance.get('selfchatbot/chat_sessions/', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  });
};

// Fetch chat history for a session
export const fetchChatHistory = (sessionId) => {
  return instance.get(`selfchatbot/chat_history/${sessionId}/`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  });
};

// Send a chat message
export const sendChatMessage = (messageData) => {
  return instance.post('selfchatbot/chatbot/', messageData, {
    headers: {
      'X-CSRFToken': getCookie('csrftoken'),
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  });
};

const getCookie = (name) => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};