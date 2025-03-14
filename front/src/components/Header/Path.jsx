import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import "./Header.css"; // CSS 파일 분리

/**
 * @name Path
 * @description Path
 *
 * @returns {JSX.Element} Path
 */
const Path = ({ pathElements, basePath }) => {
  const navigate = useNavigate();

  return (
    <div className="path">
      {pathElements.map((element, index) => (
        <React.Fragment key={index}>
          <span
            className={`path-element ${index === 0 ? "clickable" : ""} ${
              index === pathElements.length - 1 ? "last-path-element" : ""
            }`}
            onClick={() => index === 0 && navigate(basePath)}
          >
            {element}
          </span>
          {index !== pathElements.length - 1 && (
            <FontAwesomeIcon
              className="path_icon"
              icon={faChevronRight}
              fixedWidth
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Path;
