import axios from "axios";
import { getCookie } from "./cookieUtil";

import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

type MemberCookie = {
  accessToken: string;
  refreshToken?: string;
  email?: string;
  roleNames?: string[];
};

const jwtAxios = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
});

// ✅ before request
const beforeReq = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  console.log("before request");
  console.log("document.cookie:", document.cookie);
  console.log("cookie(member):", getCookie("member"));

  const memberInfo = getCookie<MemberCookie>("member");

  if (!memberInfo?.accessToken) {
    throw new Error("REQUIRE_LOGIN");
  }

  // headers 안전 처리
  config.headers = config.headers ?? {};
  config.headers.Authorization = `Bearer ${memberInfo.accessToken}`;

  return config;
};

// ❌ request error
const requestFail = (err: AxiosError | Error): Promise<never> => {
  console.log("request error", err);
  return Promise.reject(err);
};

// ✅ before response
const beforeRes = async (res: AxiosResponse): Promise<AxiosResponse> => {
  console.log("before return response");
  return res;
};

// ❌ response error
const responseFail = (err: AxiosError): Promise<never> => {
  console.log("response fail error", err);
  return Promise.reject(err);
};

jwtAxios.interceptors.request.use(beforeReq, requestFail);
jwtAxios.interceptors.response.use(beforeRes, responseFail);

export default jwtAxios;
