import axios from 'axios';
import { parseCookies } from 'nookies';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  config.headers.uid = parseCookies().uid;
  config.headers.client = parseCookies().client;
  config.headers["access-token"] = parseCookies()["access-token"];
  return config;
});

export default apiClient;
