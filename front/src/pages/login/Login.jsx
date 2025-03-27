import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import RutilVmLogo from "../../components/common/RutilVmLogo";
import IconInput from "../../components/Input/IconInput";
import Localization from "../../utils/Localization";
import FooterCompany from "../../components/footer/FooterCompany";
import { useAuthenticate } from "../../api/RQHook";
import useGlobal from "../../hooks/useGlobal";
import useAuth from "../../hooks/useAuth";
import "./Login.css";

const Login = () => {
  // 모달 관련 상태 및 함수
  const { setAuth } = useAuth()
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const userRef = useRef();
  const errRef = useRef();

  // 사용자 정보
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const {
    data: res,
    status: authStatus,
    isError: isAuthError,
    isSuccess: isAuthSuccess,
    error: authError,
    isLoading: isAuthLoading,
    mutate: authMutate,
  } = useAuthenticate(username, password, (res) => {
    console.log(res);
    if (!res || res.code > 200) {
      toast.error(`실패 ... ${res.message}`);
      return;
    }
    setAuth({
      isUserAuthenticated: res,
    })
    // 토큰 찾아 집어 넣은 후
    // setValue("username", username);
    // setValue("isUserAuthenticated", true);
    navigate(from, { replace: true });
  }, (err) => {
    toast.error("로그인에 실패했습니다. 잠시 후 다시 시도해주세요.");
    if (!err?.response) {
      setErrMsg('No Server Response');
    } else if (err.response?.status === 400) {
        setErrMsg('Missing Username or Password');
    } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
    } else {
        setErrMsg('Login Failed');
    }
    errRef.current.focus();
  });

  useEffect(() => {
    setErrMsg('')
  }, [username, password])

  const doLogin = (e) => {
    e.preventDefault();
    authMutate(username, password)
  };

  return (
    <>
      <div className="login-container">
        <RutilVmLogo className="bigger" description="RutilVM에 오신걸 환영합니다." />
        <form className="flex flex-col justify-center items-center" 
          onSubmit={doLogin}
        >
          <IconInput className="login-input text-lg"
            required
            // icon={faUser}
            type="text"
            placeholder={Localization.kr.PLACEHOLDER_USERNAME}
            value={username ?? ""}
            onChange={(e) => {
              console.log("Username:", e.target.value); // 확인용 로그
              setUsername(e.target.value);
            }}
          />
          <IconInput className="login-input text-lg"
            required
            // icon={faKey}
            type="password"
            placeholder={Localization.kr.PLACEHOLDER_PASSWORD}
            value={password ?? ""}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="login-button f-center bgcolor-primary"
            disabled={isAuthLoading}
          >
            {isAuthLoading ? (
              <>
                로그인 중...
              </>
            ) : (
              <>
                로그인
              </>
            )}
          </button>
        </form>
      </div>
      <FooterCompany />
    </>
  );
};

export default Login;
