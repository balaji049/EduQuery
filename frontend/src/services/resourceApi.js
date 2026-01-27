import axios from "axios";
/*
const API = axios.create({
  baseURL: "http://localhost:5000/api/resources",
});

// 🔐 Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// GET all resources (public)
export const fetchResources = () => API.get("/");

// UPLOAD resource (protected)
export const uploadResource = (formData) =>
  API.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// DELETE resource (protected)
export const deleteResource = (id) =>
  API.delete(`/${id}`);
*/
const API = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api/resources`,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const fetchResources = () => API.get("/");
export const uploadResource = (formData) =>
  API.post("/upload", formData);
export const deleteResource = (id) =>
  API.delete(`/${id}`);
