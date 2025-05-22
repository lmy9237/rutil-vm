
const NoneNetwork = ({ 
  nicId, nicName, 
  handleDragOver, 
  handleDrop 
}) => {

  return (
    <div className="assigned-network-outer"
      onDragOver={(e) => handleDragOver(e, "network", "detach")}
      onDrop={(e) => {
        e.preventDefault();
        handleDrop(e, "network", "detach", nicId, nicName);
        handleDrop(e, "detach", nicId, nicName);
      }}
    >
      <div className="assigned-network-content fs-14">
        <span className="text-gray-400">할당된 네트워크가 없음</span>
      </div>
    </div>
  );
};

export default NoneNetwork;
