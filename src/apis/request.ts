import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_PREFIX,
  timeout: 15_000,
});

// Add request interceptor
instance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

// Add response interceptor
instance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const { response } = error;
    const { data } = response ?? {};
    return Promise.reject(data);
  },
);

export default instance;
