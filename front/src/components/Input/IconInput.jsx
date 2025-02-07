import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons'; // Import a specific icon or use it as a prop
import './IconInput.css'; // Import the CSS file

const IconInput = ({ icon=faUser, type="text", placeholder='Enter text...', ...props }) => {
  return (
    <div className="icon-input-container">
      <div className="icon-container">
        <FontAwesomeIcon icon={icon} className="input-icon" />
      </div>
      <input
        type={type}
        className="icon-input"
        placeholder={placeholder}
        {...props} // Spread other props to allow customization
      />
    </div>
  );
};

export default IconInput;