import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

const AllActionButton = ({
  buttons, // 일반 버튼 배열
  dropdowns, // 드롭다운 메뉴 배열
  className = 'header-right-btns', // 기본 CSS 클래스
}) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  return (
    <div className={className}>
      {buttons.map(({ label, onClick, disabled }, index) => (
        <button
          key={index}
          onClick={onClick}
          disabled={disabled}
        >
          {label}
        </button>
      ))}

      {dropdowns.map(({ label, options }, index) => (
        <div key={index} className="dropdown-container" ref={dropdownRef}>
          <button onClick={() => toggleDropdown(index)}>
            {label}
            <FontAwesomeIcon icon={openDropdown === index ? faChevronUp : faChevronDown} />
          </button>
          {openDropdown === index && (
            <div className="dropdown-menu">
              {options.map(({ label, onClick, disabled }, idx) => (
                <button
                  key={idx}
                  onClick={onClick}
                  disabled={disabled}
                  className="dropdown-item"
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AllActionButton;
