import axios from 'axios';
import { parseCookies } from 'nookies';

const apiClient = axios.create({
  baseURL: `http://localhost:3000/api/v1`,
  headers: {
    "Content-Type": "application/json",
    "uid": parseCookies().uid,
    "client": parseCookies().client,
    "access-token": parseCookies()["access-token"],
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  console.log('Sending cookies🍪:', {
    uid: config.headers['uid'],
    client: config.headers['client'],
    "access-token": config.headers['access-token'],
  });
  return config;
});

export default apiClient;
