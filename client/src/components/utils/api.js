import axios from "axios";

const api = axios.create({
  baseURL: "/",
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("NEST_TOKEN");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("NEST_RETOKEN");
        const response = await axios.post("/auth/refresh", {
          refreshToken,
        });
        const { accessToken } = response.data;

        localStorage.setItem("NEST_TOKEN", accessToken);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (error) {
        console.log("====================================");
        console.log(error);
        console.log("====================================");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
