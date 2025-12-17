import { useState } from "react";
import type { ChangeEvent } from "react";
import useCustomLogin from "../../hooks/useCustomLogin";
import KakaoLoginComponent from "./KakaoLoginComponent";

type LoginParam = {
  email: string;
  pw: string;
};

const initState: LoginParam = {
  email: "",
  pw: "",
};

const LoginComponent = () => {
  const [loginParam, setLoginParam] = useState<LoginParam>({ ...initState });

  const {doLogin, moveTopath} = useCustomLogin()

  

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginParam(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClickLogin = () => {

    doLogin(loginParam)
    .then(data => {
        console.log(data)
        if(data.error) {
            alert("이메일과 패스워드를 다시 확인하세요")

        } else {
            alert("로그인 성공")
            moveTopath('/')
        }
    })

  }

  return (
    <div className="border-2 border-sky-200 mt-10 m-2 p-4">
      <div className="flex justify-center">
        <div className="text-4xl m-4 p-4 font-extrabold text-blue-500">
          Login Component
        </div>
      </div>

      {/* Email */}
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-full p-3 text-left font-bold">Email</div>
          <input
            className="w-full p-3 rounded-r border border-solid border-neutral-500 shadow-md"
            name="email"
            type="text"
            value={loginParam.email}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Password */}
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-full p-3 text-left font-bold">Password</div>
          <input
            className="w-full p-3 rounded-r border border-solid border-neutral-500 shadow-md"
            name="pw"
            type="password"
            value={loginParam.pw}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Button */}
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full justify-center">
          <div className="w-2/5 p-6 flex justify-center font-bold">
            <button
              className="rounded p-4 w-36 bg-blue-500 text-xl text-white"
              onClick={handleClickLogin}
            >
              LOGIN
            </button>
          </div>
        </div>
      </div>
      <KakaoLoginComponent />
    </div>
  );
};

export default LoginComponent;
