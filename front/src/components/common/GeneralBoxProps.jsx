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
import "./GeneralBoxProps.css";

const GeneralBoxProps = ({ title, icon, count, children }) => {
  const contentRef = useRef(null);
  const [isOverflow, setIsOverflow] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const contentEl = contentRef.current;
    if (contentEl) {
      const hasOverflow = contentEl.scrollHeight > contentEl.clientHeight;
      setIsOverflow(hasOverflow);
    }
  }, [children]);

  const handleExpand = () => {
    setIsExpanded(true);
    setIsOverflow(false); // 버튼 숨기기
  };

  return (
    <div className="vm-box-default">
      <h3 className="box-title flex items-center gap-1 f-btw">
        {title}
        {icon && <span>{icon}</span>}
        {typeof count === "number" && (
          <span className="count-badge">
            {count}
          </span>
        )}
      </h3>
      <hr className="w-full" />
      <div
        className={`box-content${isExpanded ? " expanded" : ""}`}
        ref={contentRef}
      >
        {children}
        {isOverflow && !isExpanded && (
          <div className="more-button" onClick={handleExpand}>
            + more
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneralBoxProps;
