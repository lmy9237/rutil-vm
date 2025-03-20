import React, { useEffect } from "react";
import "./PopupBox.css"; 

const PopupBox = ({ isVisible, items, onClose }) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      const popupBox = document.querySelector(".popup-box");
      const popupBtn = document.querySelector(".popup-btn");
      if (
        popupBox &&
        !popupBox.contains(event.target) &&
        popupBtn &&
        !popupBtn.contains(event.target)
      ) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="popup-box context-menu-item">
      {items.map((item, index) => (
        <div
          key={index}
          className={`f-center btn-right-click ${item.disabled ? "disabled" : ""}`}
          onClick={(e) => {
            if (!item.disabled) {
              e.stopPropagation();
              item.onClick();
              onClose();
            }
          }}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};

export default PopupBox;
