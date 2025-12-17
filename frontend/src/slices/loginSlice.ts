// src/slices/loginSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginPost } from "../api/memberApi";
import type { LoginParam } from "../types/login";
import { getCookie, setCookie, removeCookie } from "../util/cookieUtil";
import type { MemberCookie } from "../types/login";

type LoginState = {
  email: string | null;
  nickname: string | null;
  roleNames: string[];
  isLogin: boolean;
};

const initialState: LoginState = {
  email: null,
  nickname: null,
  roleNames: [],
  isLogin: false,
};

const loadMemberCookie = (): LoginState => {
  const raw = getCookie("member");
  if (!raw) return initialState;

  try {
    const memberInfo = typeof raw === "string" ? JSON.parse(raw) : raw;

    return {
      email: memberInfo?.email ?? null,
      nickname: memberInfo?.nickname ?? null,
      roleNames: Array.isArray(memberInfo?.roleNames) ? memberInfo.roleNames : [],
      isLogin: !!memberInfo?.email,
    };
  } catch (e) {
    console.warn("cookie parse failed", e, raw);
    removeCookie("member");
    return initialState;
  }
};


export const loginPostAsync = createAsyncThunk<any, LoginParam>(
  "loginPostAsync",
  (param) => loginPost(param)
);

const loginSlice = createSlice({
  name: "LoginSlice",
  initialState: loadMemberCookie(),
  reducers: {
    logout: () => {
      removeCookie("member"); // 로그아웃 시 쿠키도 같이 삭제
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginPostAsync.fulfilled, (state, action) => {
        const payload = action.payload;

        state.email = payload.email;
        state.nickname = payload.nickname;
        state.roleNames = payload.roleNames;
        state.isLogin = true;

        // ✅ 쿠키에는 최소만
        const memberCookie : MemberCookie = {
            email: payload.email,
            nickname: payload.nickname,
            roleNames: payload.roleNames,
            accessToken: payload.accessToken,
        };

        setCookie("member", memberCookie, 1);
        console.log("saved memberCookie:", memberCookie);
        console.log("cookie after save:", getCookie("member"));
        })
      .addCase(loginPostAsync.pending, () => {
        console.log("pending");
      })
      .addCase(loginPostAsync.rejected, () => {
        console.log("rejected");
      });
  },
});

export const { logout } = loginSlice.actions;
export default loginSlice.reducer;
