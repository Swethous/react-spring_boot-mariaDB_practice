import { useNavigate, Navigate, createSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loginPostAsync, logout } from "../slices/loginSlice";
import type { LoginParam } from "../types/login";

const useCustomLogin = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const loginState = useAppSelector(state => state.loginSlice);
  const { isLogin } = loginState;

  const doLogin = async (loginParam: LoginParam) => {
    const action = await dispatch(loginPostAsync(loginParam));
    return action.payload;
  };

  const doLogout = () => {
    dispatch(logout());
  };

  const moveTopath = (path: string) => {
    navigate({ pathname: path }, { replace: true });
  };

  const moveToLogin = () => {
    navigate({ pathname: "/member/login" }, { replace: true });
  };

  const moveToLoginReturn = () => {
    return <Navigate replace to="/member/login" />;
  };

  const exceptionHandel = (ex:any) => {
    console.log("Exception -----")
    console.log(ex)
    const errorMsg = ex.response.data.error
    const errorStr = createSearchParams({error:errorMsg}).toString()
    if(errorMsg === 'REQUIRE_LOGIN') {
      alert("로그인 해야합니다.")
      navigate({pathname:'/member/login', search:errorStr})
      return
    }
    if(ex.response.data.eror === 'ERROR_ACCESSDENIED') {
      alert("해당메뉴를 사용할 수 있는 권한이 없습니다..")
      navigate({pathname:'/member/login', search:errorStr})
      return
    }
  }

  return {
    loginState,
    isLogin,
    doLogin,
    doLogout,
    moveTopath,
    moveToLogin,
    moveToLoginReturn,
  };
};

export default useCustomLogin;
