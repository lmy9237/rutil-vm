import { RVI16 } from "../icons/RutilVmIcons";
import "./IconButton.css";

/**
 * @name IconButton
 * @description 아이콘 버튼
 *
 * @param {string} id
 * @param {string} key
 * @returns
 */
const IconButton = ({ 
  key, 
  label, iconDef=null,
  ...props
}) => {
  // console.log("...")
  return (
    <button className="icon-button-container"
      key={key}
      {...props}
    >
      {iconDef && ( // icon이 존재할 경우에만 span과 FontAwesomeIcon 렌더링
        <RVI16 iconDef={iconDef} className="input-icon" />
      )}
      <p>{label}</p>
    </button>
  );
};

export default IconButton;
