import React, { useState } from 'react';
import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown, faFilter
} from '@fortawesome/free-solid-svg-icons'

const Footer = () => {
  const [isFooterContentVisible, setIsFooterContentVisible] = useState(false);
  const [selectedFooterTab, setSelectedFooterTab] = useState('recent');

  const toggleFooterContent = () => setIsFooterContentVisible(!isFooterContentVisible);
  const handleFooterTabClick = (tab) => setSelectedFooterTab(tab);

  return (
    <div className="footer-outer">
      <div className="footer">
        <button onClick={toggleFooterContent}>
          <FontAwesomeIcon icon={faChevronDown} fixedWidth/>
        </button>
        <div>
          <div
            style={{
              color: selectedFooterTab === 'recent' ? 'black' : '#4F4F4F',
              borderBottom: selectedFooterTab === 'recent' ? '1px solid blue' : 'none',
            }} 
            onClick={() => handleFooterTabClick('recent')}
          >
            최근 작업
          </div>
          <div
            style={{
              color: selectedFooterTab === 'alerts' ? 'black' : '#4F4F4F',
              borderBottom: selectedFooterTab === 'alerts' ? '1px solid blue' : 'none',
            }}
            onClick={() => handleFooterTabClick('alerts')}
          >
            경보
          </div>
        </div>
      </div>
      {isFooterContentVisible && (
        <div className="footer-content" style={{ display: 'block' }}>
          <div className="footer-nav">
            {[...Array(8)].map((_, index) => (
              <div key={index} style={index === 7 ? { borderRight: 'none' } : {}}>
                <div>작업이름</div>
                <div><FontAwesomeIcon icon={faFilter} fixedWidth/></div>
              </div>
            ))}
          </div>
          <div className="footer-img">
            <img src="img/화면 캡처 2024-04-30 164511.png" alt="스크린샷" />
            <span>항목을 찾지 못했습니다</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Footer;
