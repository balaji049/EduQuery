import axios from "axios";

const API = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api/chat`,
});

// 🔐 Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Ask question (streaming handled in component)
export const askQuestion = async (question) => {
  const res = await API.post("/ask", { question });
  return res.data;
};

// Get chat history
export const fetchChatHistory = () => API.get("/history");
