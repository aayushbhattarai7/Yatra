import axios, { AxiosInstance } from "axios";
import encryptDecrypt from "../function/encryptDecrypt";
import { getCookie } from "../function/GetCookie";
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

encryptDecrypt.decrypt(getCookie("accessToken"));
const token = getCookie("accessToken") as string;
axiosInstance.interceptors.request.use(async (config: any) => {
  const token = getCookie("accessToken");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export default axiosInstance;
