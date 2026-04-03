import axios from "axios";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? "https://express-project-smoky.vercel.app",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach auth token if available
api.interceptors.request.use((config) => {
  // const token = useAuthStore.getState().token;
  // if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor — unwrap data, handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message ?? error.message;
    return Promise.reject(new Error(message));
  }
);

export default api;
