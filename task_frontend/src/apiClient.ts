import axios from 'axios';
import { parseCookies } from 'nookies';

const apiClient = axios.create({
  baseURL: `http://localhost:3000/api/v1`,
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

  console.log('Sending cookies🍪:', {
    uid: config.headers['uid'],
    client: config.headers['client'],
    "access-token": config.headers['access-token'],
  });
  return config;
});

export default apiClient;
