import axios from 'axios';
import { API_URL } from '../misc/const';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let queue: Array<{ resolve: () => void; reject: (e: unknown) => void }> = [];

const drainQueue = (error?: unknown) => {
  queue.forEach(p => (error ? p.reject(error) : p.resolve()));
  queue = [];
};

api.interceptors.response.use(
  res => res,
  async error => {
    const original = error.config;

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<void>((resolve, reject) => {
        queue.push({ resolve, reject });
      }).then(() => api(original));
    }

    original._retry = true;
    isRefreshing = true;

    try {
      await axios.post(`${API_URL}/refresh`, {}, { withCredentials: true });
      drainQueue();
      return api(original);
    } catch (refreshError) {
      drainQueue(refreshError);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
