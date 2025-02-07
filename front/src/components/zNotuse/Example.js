import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie'; // 쿠키 라이브러리 임포트
import { useLocation } from 'react-router-dom';

const Example = () => {
  const location = useLocation();

  // 경로마다 다른 쿠키 key 값 생성
  const getCookieKey = (path) => {
    return `selectedButton_${path}`;
  };

  // 버튼 상태 초기화, 기본값 1로 설정
  const [selectedButton, setSelectedButton] = useState('1');

  // 버튼 클릭 시 상태 업데이트 및 해당 경로에 맞는 쿠키 key로 저장
  const handleClick = (buttonNumber) => {
    setSelectedButton(buttonNumber);
    const cookieKey = getCookieKey(window.location.hash); // 현재 경로에 맞는 쿠키 key 설정
    Cookies.set(cookieKey, buttonNumber, { expires: 1 }); // 경로별로 다른 쿠키 key로 저장 (유지기간 1일)
  };

  useEffect(() => {
    const currentPath = window.location.hash;
    const cookieKey = getCookieKey(currentPath); // 현재 경로에 맞는 쿠키 key 설정

    // 현재 경로에 대한 쿠키 값이 있는지 확인하고, 있으면 쿠키 값 사용
    const storedButton = Cookies.get(cookieKey);
    if (storedButton) {
      setSelectedButton(storedButton);
    } else {
      setSelectedButton('1'); // 기본값 1로 설정
    }

    // 경로 변경 시 쿠키 삭제
    return () => {
      Cookies.remove(cookieKey);
    };
  }, [location]);

  return (
    <div>
      <button
        style={{ backgroundColor: selectedButton === '1' ? 'blue' : 'white' }}
        onClick={() => handleClick('1')}
      >
        1
      </button>
      <button
        style={{ backgroundColor: selectedButton === '2' ? 'blue' : 'white' }}
        onClick={() => handleClick('2')}
      >
        2
      </button>
      <button
        style={{ backgroundColor: selectedButton === '3' ? 'blue' : 'white' }}
        onClick={() => handleClick('3')}
      >
        3
      </button>
    </div>
  );
};

export default Example;
