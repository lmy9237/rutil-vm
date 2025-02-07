import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthenticate } from '../../api/RQHook';
import IconInput from '../../components/Input/IconInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser, faKey, faRightToBracket, faSpinner
} from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-hot-toast';
import './Login.css';
import '../../App.css';

const Login = ({ setAuthenticated, setUsernameGlobal }) => {
  // 모달 관련 상태 및 함수
  const [activePopup, setActivePopup] = useState(null);
  const openPopup = (popupType) => setActivePopup(popupType);
  const closePopup = () => setActivePopup(null);
  const navigate = useNavigate();
  
  // 사용자 정보
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);

  const {
    data: res,
    status: authStatus,
    isError: isAuthError,
    isSuccess: isAuthSuccess,
    error: authError,
    isLoading: isAuthLoading,
    mutate: authMutate,
  } = useAuthenticate(username, password)

  const doLogin = (e) => {
    e.preventDefault();
    authMutate({ username, password }, {
      onSuccess: (res) => {
        console.log(res);
        if (!res) {
          // 로그인 실패
          toast.error('실패: 로그인 정보가 일지하지 않습니다.')
          return
        }
        if (localStorage[`token`]) {
          // 토큰 찾아 집어 넣은 후
          setAuthenticated(true)
          localStorage.setItem('username', username)
          navigate('/')
        }
      },
      onError: (err) => {
        toast.error('로그인에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
    })
  }

  return (
    <>
      <div id="login" className="fullscreen align-center">
        <div className="logo-background">
          <img src="/favicon.ico" alt="Logo" className="dimmed-logo" />
        </div>
        <div className="login-box align-center align-center-v"> 
          <h2>RutilVM 로그인</h2>
          <form onSubmit={doLogin}>
            <IconInput className="login-input" required
              icon={faUser}
              type="text" 
              placeholder="Username"
              value={username ?? ""} 
              onChange={(e) => {
                  console.log('Username:', e.target.value); // 확인용 로그
                  setUsername(e.target.value);
              }}
            />
            <IconInput className="login-input" required
              icon={faKey}  
              type="password" 
              placeholder="Password"
              value={password ?? ""} 
              onChange={(e) => setPassword(e.target.value)}/>
            <span>
              <button 
                type="submit" 
                className="login-button bgcolor-primary"
                disabled={isAuthLoading}
              >
                {
                  isAuthLoading ? (<>
                    <FontAwesomeIcon icon={faSpinner} fixedWidth />&nbsp;로그인 중...
                  </>) : (<>
                    <FontAwesomeIcon icon={faRightToBracket} fixedWidth />&nbsp;로그인
                  </>)
                }
              </button>
            </span>
          </form>
        </div>
      </div>
    </>
  )
}

export default Login