// src/utils/cookieUtil.ts
import { Cookies } from "react-cookie";

const cookies = new Cookies();

export const setCookie = <T>(
  name: string,
  value: T,
  days: number
): void => {
  const expires = new Date();
  expires.setUTCDate(expires.getUTCDate() + days);

  cookies.set(name, value, {
    path: "/",
    expires,
    sameSite: "lax",
  });
};

export const getCookie = <T>(name: string): T | null => {
  const value = cookies.get(name);
  return value ?? null;
};

export const removeCookie = (
  name: string,
  path: string = "/"
): void => {
  cookies.remove(name, { path });
};
