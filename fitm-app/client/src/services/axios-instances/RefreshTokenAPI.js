import axios from "axios";
// import TokenService from '../TokenService'
import { useAuthStore } from "@/stores/authStore";

export default (url = "http://localhost:5000/api/auth") => {
  const axiosInstance = axios.create({
    baseURL: url,
    withCredentials: true,
  });
  // axiosInstance.interceptors.request.use((config) => {
  //     const token = TokenService.getAccessToken();
  //     if (token) {
  //         config.headers.Authorization = `Bearer ${token}`
  //     }

  //     return config
  // }, (error) => {
  //     return Promise.reject(error)
  // })
  const authStore = useAuthStore();

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      if (error.response.status === 401 || error.response.status === 403) {
        try {
          await authStore.logout();
          // set access token in state
          return Promise.resolve("Refresh Token has expired");
        } catch (err) {
          if (err.response && err.response.data) {
            // store.setToken(null)
            return Promise.reject(err);
          }
          return Promise.reject(err);
        }
      }
      return Promise.reject(error);
    }
  );
  return axiosInstance;
};
