// src/api/kakaoApi.ts

import axios from "axios";
import { apiClient } from "./client";

const REST_API_KEY = "da8641774c4488bee26c054ed518561f"; // 카카오 REST API 키
const REDIRECT_URI = "http://localhost:5173/member/kakao";
const AUTH_CODE_URL = "https://kauth.kakao.com/oauth/authorize";

const ACCESS_TOKEN_URL = "https://kauth.kakao.com/oauth/token"

export const getKakaoLoginLink = () => {

  const kakaoURL =
    `${AUTH_CODE_URL}` +
    `?client_id=${REST_API_KEY}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=code`;

  return kakaoURL;
};

export const getAccessToken = async (authCode: string) => {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: REST_API_KEY,
    redirect_uri: REDIRECT_URI,
    code: authCode,
  });

  try {
    const res = await axios.post(ACCESS_TOKEN_URL, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });
    return res.data.access_token as string;
  } catch (e: any) {
    console.log("Kakao token error status:", e.response?.status);
    console.log("Kakao token error data(raw):", e.response?.data);
    console.log(
      "Kakao token error data(JSON):",
      JSON.stringify(e.response?.data, null, 2)
    );
    return null; // ✅ 일단 throw 하지 말고 내용 확인용
  }
};




export const getMemberWithAccessToken = async(accessToken: string) => {
    const res = await apiClient.get(`/member/kakao?accessToken=${accessToken}`)
    return res.data
}