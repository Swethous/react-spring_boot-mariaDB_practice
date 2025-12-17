export interface LoginParam {
  email: string;
  pw: string;
}

export type MemberCookie = {
  email: string;
  nickname: string | null;
  roleNames: string[];
  accessToken: unknown;
};