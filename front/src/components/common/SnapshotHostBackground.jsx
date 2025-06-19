import "./SnapshotHostBackground.css";

const SnapshotHostBackground = ({ 
  innerClassName = "",
  ...props
}) => {
  return (
    <div
      className={` f-btw w-full ${props.className}`} 
      style={{ ...props.style }}
    >
      <div className={`split-layout-group f-btw ${innerClassName}`}>
        {props.children}
      </div>
    </div>
  );
};

export default SnapshotHostBackground;