import axios, { InternalAxiosRequestConfig } from "axios";
// import https from "https";

const BASE_URL = 'https://safedoc.ngrok.io/';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 
    'content-type': 'application/json',
    accept: 'application/json',
    "Access-Control-Allow-Origin": "*",
   },
  // httpsAgent: new https.Agent({  
  //   rejectUnauthorized: false
  // })
});

const requestHandler = (request: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  console.log('axios requestHandler. request = ', request);
  return request;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const errorHandler = (error: any) => {
  console.warn('axios error handler. error = ', error);
  return Promise.reject(error);
};

axiosInstance.interceptors.request.use(
  (request) => requestHandler(request),
  (error) => errorHandler(error),
);

export default axiosInstance;
