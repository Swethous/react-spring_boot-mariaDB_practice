import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { getAccessToken, getMemberWithAccessToken } from "../../api/kakaoApi";

const KakaoRedirectPage = () => {
  const [searchParams] = useSearchParams();
  const authCode = searchParams.get("code");
  const ranRef = useRef(false);

  useEffect(() => {
    if (!authCode) return;
    if (ranRef.current) return;   // ✅ StrictMode 2번 실행 방지
    ranRef.current = true;

    getAccessToken(authCode).then((accessToken) => {
      if (!accessToken) return;   // ✅ null이면 백엔드 호출하지 말기

      console.log("kakao access token:", accessToken);

      getMemberWithAccessToken(accessToken).then((memberInfo) => {
        console.log("memberInfo:", memberInfo);
      });
    });
  }, [authCode]);

  return (
    <div>
      <div>Kakao Login Redirect</div>
      <div>{authCode}</div>
    </div>
  );
};

export default KakaoRedirectPage;
