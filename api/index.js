import axios from "axios";

import { PATH_LOGIN } from "@/constants/paths";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_DOMAIN,
});

api.interceptors.request.use(
  (config) => {
    const userStorage = localStorage.getItem("cec-scm-mgt");
    const token = JSON.parse(userStorage).state.user.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  () => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const errRes = error.response;
    // Token 過期的話要導頁去登入頁
    if (
      errRes &&
      errRes.status === 401 &&
      ["Unauthorized", "JWT Expired"].includes(errRes.data.message)
    ) {
      localStorage.removeItem("cec-scm-mgt");
      window.location.href = PATH_LOGIN;
    }
    return Promise.reject(error.response.data);
  }
);

export default api;
