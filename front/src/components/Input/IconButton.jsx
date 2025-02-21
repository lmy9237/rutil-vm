import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {} from "@fortawesome/free-solid-svg-icons";
import "./IconButton.css";

/**
 * @name IconButton
 * @description 아이콘 버튼
 *
 * @param {string} id
 * @param {string} key
 * @returns
 */
const IconButton = ({ id, key, label, icon, onClick, disabled }) => {
  // console.log("...")
  return (
    <button
      id={id}
      key={key}
      onClick={onClick}
      disabled={disabled}
      className="icon-button-container"
    >
      {icon && ( // icon이 존재할 경우에만 span과 FontAwesomeIcon 렌더링
        <span className="icon-button-container">
          <FontAwesomeIcon icon={icon} className="input-icon" fixedWidth />
        </span>
      )}
      <p>{label}</p>
    </button>
  );
};

export default IconButton;
