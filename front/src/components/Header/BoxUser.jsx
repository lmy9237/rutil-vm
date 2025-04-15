import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import useUIState from "../../hooks/useUIState";
import useGlobal from "../../hooks/useGlobal";
import useClickOutside from "../../hooks/useClickOutside";
import SettingUsersModals from "../modal/settings/SettingUsersModals";
import Logger from "../../utils/Logger";
import { useUser } from "../../api/RQHook";
import "./BoxUser.css";
import useBoxState from "../../hooks/useBoxState";

/**
 * @name BoxUser
 * @description 박스 (사용자 정보)
 * 
 * @returns {JSX.Element} 
 */
const BoxUser = ({}) => {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const { setUsersSelected, clearAllSelected } = useGlobal()
  const { 
    data: user,
    isLoading: isUserLoading,
    isSuccess: isUserSuccess
  } = useUser(auth.username, true);
  
  useEffect(() => {
    setUsersSelected([user])
  }, [auth, user])

  const { setActiveModal, } = useUIState();
  const { loginBoxVisible, setLoginBoxVisible } = useBoxState()
  
  const userBoxRef = useRef(null);
  useClickOutside(userBoxRef, (e) => {
    if (loginBoxVisible()) {
      clearAllSelected();
    }
  });


  const doLogout = (e) => {
    Logger.debug("Header > doLogout ...");
    e.preventDefault();
    setAuth({});
    navigate("/login");
  };

  return (
    <>
      <div ref={userBoxRef} className="box-user" >
        <div onClick={(e) => {
          e.stopPropagation()
          if (!user) {
            toast.error(`사용자를 찾을 수 없습니다.`)
            return 
          } 
          setActiveModal("user:changePassword");
          setLoginBoxVisible(false);
        }}>계정설정</div>
        <div onClick={(e) => doLogout(e)}>로그아웃</div>
      </div>
      <SettingUsersModals />
    </>
  );
};

export default BoxUser;
