import {
  RVI16,
} from "@/components/icons/RutilVmIcons";
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
      {iconDef && (
        <RVI16 iconDef={iconDef} />
      )}
      {label && <p>{label}</p>}
    </button>
  );
};

export default IconButton;
