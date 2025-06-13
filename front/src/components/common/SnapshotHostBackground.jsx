import "./SnapshotHostBackground.css"; // CSS 이름은 그대로 둬도 무방

const SnapshotHostBackground = ({ 
  innerClassName = "",  // 내부 split-layout-group의 클래스
  ...props
}) => {
  return (
    <div
      className={`f-btw w-full ${props.className}`} 
      style={{ ...props.style }}
    >
      <div className={`split-layout-group f-btw ${innerClassName}`}>
        {props.children}
      </div>
    </div>
  );
};

export default SnapshotHostBackground;