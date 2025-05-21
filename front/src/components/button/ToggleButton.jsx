import React, { useState } from "react"
import CONSTANT from "@/Constants"
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
          <rect fill={CONSTANT.color.blue1} x="0.5" y="0.5" width="27" height="15" rx="7.5" />
          <rect stroke={CONSTANT.color.blue1} x="0.5" y="0.5" width="27" height="15" rx="7.5" />
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
