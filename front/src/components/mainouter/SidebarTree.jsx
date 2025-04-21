import React, { useEffect, useState } from "react";
import ComputingTree from "./tree/ComputingTree";
import NetworkTree from "./tree/NetworkTree";
import StorageTree from "./tree/StorageTree";
import useTmi from "../../hooks/useTmi";

const SidebarTree = () => {
  const { tmiLastSelected } = useTmi()
  const [renderedPreviously, setRenderedPreviously] = useState(() => <ComputingTree/>)
  useEffect(() => {
    switch (tmiLastSelected) {
    case "network": setRenderedPreviously(() => <NetworkTree />);break;
    case "storage": setRenderedPreviously(() => <StorageTree />);break;
    case "computing": setRenderedPreviously(() => <ComputingTree />);break;
    case "dashboard": 
    default: break;
    }
  }, [tmiLastSelected])

  return (
    <div className="aside-popup">
      {/* ✅ 가상머신 섹션 */}
      {tmiLastSelected === "computing" && <ComputingTree />} 
      {tmiLastSelected === "network" && <NetworkTree />}
      {tmiLastSelected === "storage" && <StorageTree />}
      {(tmiLastSelected === "event" || tmiLastSelected === "dashboard") && (renderedPreviously)}
    </div>
  );
};

export default React.memo(SidebarTree);
