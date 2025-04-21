import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RutilVmLogo from "../../components/common/RutilVmLogo";
import IconInput from "../../components/Input/IconInput";
import Localization from "../../utils/Localization";
import CompanyInfoFooter from "../../components/footer/CompanyInfoFooter";
import useAuth from "../../hooks/useAuth";
import Logger from "../../utils/Logger";
import { useAuthenticate } from "../../api/RQHook";
import "./Login.css";
// import backgroundImg from "./img/background-img.jpg";
import backgroundImg from "./img/background-img2.jpg";
// import backgroundImg from "./img/background-img3.jpg";
// import backgroundImg from "./img/background-img4.jpg";
// import backgroundImg from "./img/background-img5.jpg";

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
    setAuth({ 
      username: username,
      isUserAuthenticated: res,
    })
    // 토큰 찾아 집어 넣은 후
    // setValue("username", username);
    // setValue("isUserAuthenticated", true);
    navigate(from, { replace: true });
  }, (err) => {
    errRef.current.focus();
  });

  useEffect(() => {
    setErrMsg('')
  }, [username, password])

  const doLogin = useCallback((e) => {
    e.preventDefault();
    authMutate(username, password)
  }, [username, password]);

  return (
    <>
      <div className="login-container">
        <div className="login-form-outer">
          <div>
            <RutilVmLogo className="bigger" description="RutilVM에 오신걸 환영합니다." />
            <form className="" 
              onSubmit={doLogin}
            >
              <IconInput className="login-input text-lg"
                required
                type="text"
                placeholder={Localization.kr.PLACEHOLDER_USERNAME}
                value={username ?? ""}
                onChange={(e) => {
                  Logger.debug(`Username: ${e.target.value}`); // 확인용 로그
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
                {isAuthLoading ? (<>{Localization.kr.LOGIN} {Localization.kr.IN_PROGRESS}</>) : (<>{Localization.kr.LOGIN}</>)}
              </button>
            </form>
          </div>
        </div>
        <div className="background-container">
          <img
            src={backgroundImg}
            alt="Background"
            className="background-image"
          />
        </div>
      </div>
      <CompanyInfoFooter isBrief={true} />
    </>
  );
};

export default Login;
