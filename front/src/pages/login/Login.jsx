import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import RutilVmLogo from "../../components/common/RutilVmLogo";
import IconInput from "../../components/Input/IconInput";
import Localization from "../../utils/Localization";
import CompanyInfoFooter from "../../components/footer/CompanyInfoFooter";
import { rvi16Lock, rvi16User } from "../../components/icons/RutilVmIcons";
import Logger from "../../utils/Logger";
import { useAuthenticate } from "../../api/RQHook";
import "./Login.css";

import backgroundImg from "./img/background-img.png";
import CONSTANT from "../../Constants";
// import backgroundImg from "./img/background-img2.jpg";


const Login = () => {
  // 모달 관련 상태 및 함수
  const { setAuth } = useAuth()
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

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
      <div className="login-container w-full h-full"   
        style={{
          backgroundImage: `url(${backgroundImg})`,
          backgroundSize: "cover",   // ✅ 수정
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="login-form-outer v-center">
          <div className="login-form-box v-center">
            <RutilVmLogo className="bigger" />
            <form className="v-center w-full" 
              onSubmit={doLogin}
            >
              <IconInput className="login-input" required type="text"
                iconDef={rvi16User()}
                placeholder={Localization.kr.PLACEHOLDER_USERNAME}
                value={username ?? ""}
                onChange={(e) => {
                  Logger.debug(`Username: ${e.target.value}`); // 확인용 로그
                  setUsername(e.target.value);
                }}
              />
              <IconInput className="login-input" required type="password"
                iconDef={rvi16Lock(CONSTANT.color.down)}
                placeholder={Localization.kr.PLACEHOLDER_PASSWORD}
                value={password ?? ""}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit"
                className="login-button f-center fs-14 bgcolor-primary"
                disabled={isAuthLoading}
              >
                {isAuthLoading ? (<>{Localization.kr.LOGIN} {Localization.kr.IN_PROGRESS}</>) : (<>{Localization.kr.LOGIN}</>)}
              </button>
            </form>
            <CompanyInfoFooter isBrief={true} />
          </div>
        </div>
      </div>
     
    </>
  );
};

export default Login;
