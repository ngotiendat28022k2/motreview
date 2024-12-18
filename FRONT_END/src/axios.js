import axios from "axios";
import _ from "lodash";
require("dotenv").config();

const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

// Đăng ký interceptor trước khi gọi API
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.authorization = "Bearer " + token.replaceAll('"', ""); // Đảm bảo token không chứa dấu ngoặc kép
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    // Thrown error for request with OK status code
    const { data } = response;
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
