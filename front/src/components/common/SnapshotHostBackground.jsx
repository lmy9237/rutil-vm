import "./SnapshotHostBackground.css";

const SnapshotHostBackground = ({ children, className = "", style = {} }) => {
    return (
      <div className={` f-btw w-full ${className}`} style={{ position: "relative", ...style }}>
        <div className="split-layout-group f-btw ">
          {children}
        </div>
      </div>
    );
  };
  
export default SnapshotHostBackground;
