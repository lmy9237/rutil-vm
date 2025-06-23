import React from 'react';
import "./GeneralBoxProps.css";

const GeneralBoxProps = ({ title, icon, count, children }) => {
  return (
    <div className="vm-box-default">
      <h3 className="box-title flex items-center gap-1">
        {title}
        {icon && <span>{icon}</span>}
        {typeof count === "number" && (
          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-700">
            {count}
          </span>
        )}
      </h3>
      <hr className="w-full" />
      <div className="box-content">
        {children}
      </div>
    </div>
  );
};

export default GeneralBoxProps;
