// VmInfoBox.jsx
import React from 'react';
import "./GeneralBoxProps.css";

const GeneralBoxProps = ({ title, icon, children }) => {
  return (
    <div className="vm-box-default">
      <h3 className="box-title flex items-center gap-1">
        {title}
        {icon && <span>{icon}</span>}
      </h3>
      <hr className="w-full" />
      <div className="box-content">
        {children}
      </div>
    </div>
  );
};

export default GeneralBoxProps;
