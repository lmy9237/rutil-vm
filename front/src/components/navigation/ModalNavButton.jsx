import React from "react";
import PropTypes from "prop-types";
import "./ModalNavButton.css";

const ModalNavButton = ({ 
  tabs,
  activeTab,
  onTabClick
}) => {
  return (
    <div className="network-backup-edit-nav fs-14">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          id={`${tab.id}_tab`}
          className={`tab f-center ${activeTab === tab.id ? " active" : ""}`}
          onClick={() => onTabClick(tab.id)}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
};

ModalNavButton.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  activeTab: PropTypes.string.isRequired,
  onTabClick: PropTypes.func.isRequired,
};

export default ModalNavButton;
