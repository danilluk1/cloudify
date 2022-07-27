import axios, { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

export const BACKEND_URL = `http://localhost:5000`;

export const $axios = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

$axios.interceptors.request.use((config: AxiosRequestConfig) => {
  if (!config.headers) return;
  const user = JSON.parse(localStorage.getItem("user") ?? "{}");

  if(!user) return;
  
  config.headers.authorization = `Bearer ${user?.access_token}`;

  return config;
});

$axios.interceptors.response.use(
  (config: AxiosRequestConfig) => {
    return config;
  },
  async (error) => {
    if (
      error.response.status === 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      try {
        const originalRequest = error.config;
        originalRequest._isRetry = true;

        const response = await axios.get(`${BACKEND_URL}refresh`);
      } catch (e) {
        console.log(e);
      }
    }
  }
);
