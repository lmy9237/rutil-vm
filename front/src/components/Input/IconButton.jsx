import { RVI16, rvi16QuestionMark } from "../icons/RutilVmIcons";
import "./IconButton.css";

/**
 * @name IconButton
 * @description 아이콘 버튼
 *
 * @param {string} id
 * @returns
 */
const IconButton = ({ 
  label,
  iconDef=null,
  ...props
}) => {
  
  return (
    <button className="icon-button-container"
      {...props}
    >
      {iconDef && ( // icon이 존재할 경우에만 span과 FontAwesomeIcon 렌더링
        <RVI16 iconDef={iconDef} />
      )}
      {label && <p>{label}</p>}
    </button>
  );
};

export default IconButton;
