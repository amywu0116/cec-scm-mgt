import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_DOMAIN,
});

api.interceptors.request.use(
  (config) => {
    const userStorage = localStorage.getItem("user-storage");
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
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error.response.data);
  }
);

export default api;
