// chat.js
import axios from 'axios';

const baseURL = 'http://localhost:8000';

export const fetchChatSessions = async () => {
    try {
        const response = await axios.get(`${baseURL}/selfchatbot/chat_sessions/`, {
            withCredentials: true,
        });
        return response;
    } catch (error) {
        console.error('Error fetching chat sessions:', error);
        throw error;
    }
};

export const fetchChatHistory = async (sessionId) => {
    try {
        const response = await axios.get(`${baseURL}/selfchatbot/chat_history/${sessionId}/`, {
            withCredentials: true,
        });
        return response;
    } catch (error) {
        console.error('Error fetching chat history:', error);
        throw error;
    }
};

export const sendChatMessage = async (messageData) => {
    try {
        const response = await axios.post(`${baseURL}/selfchatbot/chatbot/`, messageData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    } catch (error) {
        console.error('Error sending chat message:', error);
        throw error;
    }
};

export const deleteChatSession = async (sessionId) => {
    try {
        const response = await axios.delete(`${baseURL}/selfchatbot/delete_session/${sessionId}/`, {
            withCredentials: true,
        });
        return response;
    } catch (error) {
        console.error('Error deleting chat session:', error);
        throw error;
    }
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