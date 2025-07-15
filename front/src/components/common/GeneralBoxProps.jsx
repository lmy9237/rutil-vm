import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./GeneralBoxProps.css";

const GeneralBoxProps = ({
  title,
  icon,
  count,
  children,
  moreLink,
  enableOverflowCheck = false,
  className = "", 
}) => {
  const contentRef = useRef(null);
  const [isOverflow, setIsOverflow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!enableOverflowCheck) return;

    const contentEl = contentRef.current;

    // 1프레임 이후 체크 → 정확하게 계산됨
    requestAnimationFrame(() => {
  if (contentEl) {
      const diff = contentEl.scrollHeight - contentEl.clientHeight;
      setIsOverflow(diff > 10); 
    }
    });
  }, [children, enableOverflowCheck]);

  const handleMoreClick = () => {
    if (moreLink) navigate(moreLink);
  };

  return (
    <div className={`vm-box-default ${className}`}>
      <h3 className="box-title flex items-center gap-1 f-btw">
        {title}
        {icon && <span>{icon}</span>}
        {typeof count === "number" && (
          <span className="count-badge">{count}</span>
        )}
      </h3>
      <hr className="w-full" />
      <div
        className={`box-content ${enableOverflowCheck ? "overflowing" : ""}`}
        ref={contentRef}
      >
        <div className="box-inner-content">
          {children}
        </div>
      
      </div>
        {enableOverflowCheck && isOverflow && moreLink && (
          <div className="more-button mt-3" onClick={handleMoreClick}>
            + more
          </div>
        )}
    </div>
  );
};

export default GeneralBoxProps;

// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./GeneralBoxProps.css";

// const GeneralBoxProps = ({ title, icon, count, children, moreLink }) => {
//   const contentRef = useRef(null);
//   const [isOverflow, setIsOverflow] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const contentEl = contentRef.current;
//     if (contentEl) {
//       const hasOverflow = contentEl.scrollHeight > contentEl.clientHeight;
//       setIsOverflow(hasOverflow);
//     }
//   }, [children]);

//   const handleMoreClick = () => {
//     if (moreLink) navigate(moreLink);
//   };

//   return (
//     <div className="vm-box-default">
//       <h3 className="box-title flex items-center gap-1 f-btw">
//         {title}
//         {icon && <span>{icon}</span>}
//         {typeof count === "number" && (
//           <span className="count-badge">{count}</span>
//         )}
//       </h3>
//       <hr className="w-full" />
//       <div className="box-content" ref={contentRef}>
//         {children}
//         {isOverflow && moreLink && (
//           <div className="more-button" onClick={handleMoreClick}>
//             + more
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default GeneralBoxProps;