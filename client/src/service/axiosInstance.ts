import axios, { AxiosInstance } from "axios";
import encryptDecrypt from "../function/encryptDecrypt";
import { getCookie } from "../function/GetCookie";
const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api/',
});

encryptDecrypt.decrypt(getCookie("accessToken"));
axiosInstance.interceptors.request.use(async (config: any) => {
  const token = getCookie("accessToken");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export default axiosInstance;
