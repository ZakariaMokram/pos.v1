import axios from "axios";
import Cookies from "js-cookie";

export const BASE_URL = import.meta.env.VITE_SERVER_URL;

export const instance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 1000,
});

instance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("authToken");
    token && (config.headers.Authorization = `Bearer ${token}`);
    return config;
  },
  (error) => Promise.reject(error)
);

instance.defaults.timeout = 5000;

export const fetcher = async (endpoint) => {
  const { data } = await instance.get(endpoint);
  return data;
};
