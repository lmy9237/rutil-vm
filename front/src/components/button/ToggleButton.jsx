import React, { useState } from "react"
import "./ToggleButton.css"

const ToggleButton = ({
  on="ON",
  off="OFF",
  ...props
}) => {
  const [isOn, setIsOn] = useState(false)
  const toggleIsOn = () => {
    setIsOn(!isOn)
  }
  return (
    <button
      className="btn-toggle f-center"
      onClick={() => {
        toggleIsOn();
        props.onClick();
      }}
      {...props}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="16" viewBox="0 0 28 16" fill="none">
        {isOn ? (<>
          <rect x="0.5" y="0.5" width="27" height="15" rx="7.5" fill="#0A7CFF"/>
          <rect x="0.5" y="0.5" width="27" height="15" rx="7.5" stroke="#0A7CFF"/>
          <circle cx="20" cy="8" r="7" fill="white"/>
        </>) : (<>
          <rect width="28" height="16" rx="8" fill="#C6C6C6"/>
          <circle cx="8" cy="8" r="7" fill="white"/>
        </>)}
      </svg>
      {isOn ? on : off}
    </button>
  );
}

export default ToggleButton;
