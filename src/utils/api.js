import axios from "axios";

const httpsEndpoint = import.meta.env.VITE_HTTPS_ENDPOINT;

const api = axios.create({
  baseURL: httpsEndpoint,
});

api.interceptors.request.use(
  config => {
    const accessToken = localStorage.getItem("id-token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken"); // Use localStorage to get the refreshToken
        const response = await refreshAccessToken(refreshToken);
        const newAccessToken = response.data.idToken;
        const newRefreshToken = response.data.refreshToken;

        localStorage.setItem("id-token", newAccessToken); // Use localStorage to store the new token
        localStorage.setItem("refresh-token", newRefreshToken); // Use localStorage to store the new refreshToken

        // Set the new access token in the request header
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (error) {
        // Handle refresh token failure or other errors
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

const refreshAccessToken = async refreshToken => {
  return await axios.post(`${process.env.HTTPS_ENDPOINT}/auth/refresh-token`, {
    refreshToken,
  });
};

export default api;
