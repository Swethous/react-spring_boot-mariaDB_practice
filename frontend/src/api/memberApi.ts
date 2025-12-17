import { apiClient } from "./client";
import type { LoginParam } from "../types/login";

export const loginPost = async (loginParam:LoginParam) => {

  const header = {headers: {"Content-Type": "x-www-form-urlencoded"}}

  const form = new FormData()
  form.append('username', loginParam.email)
  form.append('password', loginParam.pw)

  const res = await apiClient.post("/member/login", form, header);
  return res.data;
};