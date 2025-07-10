import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import CONSTANT               from "@/Constants";
import RutilVmLogo            from "@/components/common/RutilVmLogo";
import IconInput              from "@/components/Input/IconInput";
import CompanyInfoFooter      from "@/components/footer/CompanyInfoFooter";
import {
  rvi16Lock, rvi16User
} from "@/components/icons/RutilVmIcons";
import {
  useAuthenticate
} from "@/api/RQHook";
import backgroundImg          from "./img/background-img.png";
import Localization           from "@/utils/Localization";
import Logger                 from "@/utils/Logger";
import "./Login.css";


const Login = () => {
  // 모달 관련 상태 및 함수
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
  })

  const errRef = useRef();
  // 사용자 정보
  const {
    mutate: authMutate,
  } = useAuthenticate((res) => {
    // 토큰 찾아 집어 넣은 후
    // setValue("username", username);
    // setValue("isUserAuthenticated", true);
    navigate(from, { replace: true });
  }, (err) => {
    errRef.current.focus();
  });

  // const doLogin = ({data}) => {
  const doLogin = ({username, password}) => {
    Logger.debug(`Login > doLogin ... password: `,password)
    // authMutate(data?.username, data?.password)
    authMutate({username, password})
  }
  
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
            <form id="form-login" className="v-center w-full" 
              onSubmit={handleSubmit(doLogin)}
            >
              <IconInput className="login-input" type="text"
                iconDef={rvi16User()}
                placeholder={Localization.kr.PLACEHOLDER_USERNAME}
                register={register} target={"username"} options={{ required: true, maxLength: 30 }}
                // value={username ?? ""}
                // onChange={(e) => setUsername(e.target.value)}
              />
              <IconInput className="login-input" required type="password"
                iconDef={rvi16Lock(CONSTANT.color.down)}
                placeholder={Localization.kr.PLACEHOLDER_PASSWORD}
                register={register} target={"password"} options={{ required: true, maxLength: 30 }}
                // value={password ?? ""}
                // onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit"
                className="login-button f-center fs-14 bgcolor-primary"
              >
                {Localization.kr.LOGIN}
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
