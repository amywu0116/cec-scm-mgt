import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_DOMAIN,
});

api.interceptors.request.use(
  (config) => {
    const userStorage = localStorage.getItem("user-storage");
    const accessToken = JSON.parse(userStorage).state.accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
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
    return Promise.reject(error);
  }
);

export default api;
