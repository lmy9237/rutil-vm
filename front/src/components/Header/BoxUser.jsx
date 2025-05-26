import React, { useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useValidationToast }   from "@/hooks/useSimpleToast";
import useAuth                  from "@/hooks/useAuth";
import useGlobal                from "@/hooks/useGlobal";
import useBoxState              from "@/hooks/useBoxState";
import useUIState               from "@/hooks/useUIState";
import useClickOutside          from "@/hooks/useClickOutside";
import useAsideState            from "@/hooks/useAsideState";
import {
  useUser
} from "@/api/RQHook";
import Logger                   from "@/utils/Logger";
import "./BoxUser.css";

/**
 * @name BoxUser
 * @description 박스 (사용자 정보)
 * 
 * @returns {JSX.Element} 
 */
const BoxUser = ({}) => {
  const { validationToast } = useValidationToast();
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const { 
    data: user,
    isLoading: isUserLoading,
    isSuccess: isUserSuccess
  } = useUser(auth.username, true);
  const { setAsideVisible } = useAsideState()
  const { setActiveModal, } = useUIState();
  const { setLoginBoxVisible } = useBoxState()

  const userBoxRef = useRef(null);
  useClickOutside(userBoxRef, (e) => {
    setLoginBoxVisible(false)
  });

  const doLogout = useCallback((e) => {
    Logger.debug("Header > doLogout ...");
    e.preventDefault();
    setAuth({});
    setAsideVisible(true);
    setLoginBoxVisible(false)
    navigate("/login");
  }, [])

  return (
    <>
      <div ref={userBoxRef}
        className="box-user"
      >
        <div onClick={(e) => {
          e.stopPropagation()
          if (!user) {
            validationToast.fail(`사용자를 찾을 수 없습니다.`)
            return;
          } 
          setActiveModal("user:changePassword");
          setLoginBoxVisible(false);
        }}>계정설정</div>
        <div onClick={(e) => doLogout(e)}>로그아웃</div>
      </div>
    </>
  );
};

export default BoxUser;
