import axios from "axios";

const BASE_URL = 'http://localhost';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'content-type': 'application/json', accept: 'application/json' },
});

export default axiosInstance;
