import React from "react";
import PropTypes from "prop-types";

const ModalNavButton = ({ tabs, activeTab, onTabClick }) => {
  return (
    <div className="network-backup-edit-nav">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          id={`${tab.id}_tab`}
          className={activeTab === tab.id ? "active-tab" : "inactive-tab"}
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
