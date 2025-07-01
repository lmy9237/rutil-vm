// import React from 'react';
// import "./GeneralBoxProps.css";

// const GeneralBoxProps = ({ title, icon, count, children }) => {
//   return (
//     <div className="vm-box-default">
//       <h3 className="box-title flex items-center gap-1 f-btw">
//         {title}
//         {icon && <span>{icon}</span>}
//         {typeof count === "number" && (
//           <span className="count-badge">
//             {count}
//           </span>
//         )}
//       </h3>
//       <hr className="w-full" />
//       <div className="box-content">
//         {children}
//       </div>
//     </div>
//   );
// };

// export default GeneralBoxProps;

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./GeneralBoxProps.css";

const GeneralBoxProps = ({ title, icon, count, children, moreLink }) => {
  const contentRef = useRef(null);
  const [isOverflow, setIsOverflow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const contentEl = contentRef.current;
    if (contentEl) {
      const hasOverflow = contentEl.scrollHeight > contentEl.clientHeight;
      setIsOverflow(hasOverflow);
    }
  }, [children]);

  const handleMoreClick = () => {
    if (moreLink) navigate(moreLink);
  };

  return (
    <div className="vm-box-default">
      <h3 className="box-title flex items-center gap-1 f-btw">
        {title}
        {icon && <span>{icon}</span>}
        {typeof count === "number" && (
          <span className="count-badge">{count}</span>
        )}
      </h3>
      <hr className="w-full" />
      <div className="box-content" ref={contentRef}>
        {children}
        {isOverflow && moreLink && (
          <div className="more-button" onClick={handleMoreClick}>
            + more
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneralBoxProps;

