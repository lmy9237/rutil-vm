import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import './Header.css'; // 스타일을 별도로 관리하고 싶을 경우

const Path = ({ pathElements }) => {
  return (
    <div className='path'>
      {pathElements.map((element, index) => (
        <React.Fragment key={index}>
          <span className={index === pathElements.length - 1 ? 'last-path-element' : ''}>
            {element}
          </span>
          {index !== pathElements.length - 1 && (
            <FontAwesomeIcon className='path_icon' icon={faChevronRight} fixedWidth />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Path;
