import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://syncflow-backend-cbau.onrender.com/api",
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Sending token:", token);
  }
  return config;
});

export default apiClient;
