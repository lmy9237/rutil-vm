// import "./SnapshotHostBackground.css";

// const SnapshotHostBackground = ({ children, className = "", style = {} }) => {
//     return (
//       <div className={` f-btw w-full ${className}`} style={{ position: "relative", ...style }}>
//         <div className="split-layout-group f-btw ">
//           {children}
//         </div>
//       </div>
//     );
//   };
  
// export default SnapshotHostBackground;

// components/layout/SplitLayout.jsx
import "./SnapshotHostBackground.css"; // CSS 이름은 그대로 둬도 무방

const SnapshotHostBackground = ({ 
  children, 
  className = "",       // 바깥 div의 클래스
  innerClassName = "",  // 내부 split-layout-group의 클래스
  style = {} 
}) => {
  return (
    <div className={`f-btw w-full ${className}`} style={{ position: "relative", ...style }}>
      <div className={`split-layout-group ${innerClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default SnapshotHostBackground;

