import React, { useEffect, useState } from "react";
import ComputingTree from "./tree/ComputingTree";
import NetworkTree from "./tree/NetworkTree";
import StorageTree from "./tree/StorageTree";
import Logger from "../../utils/Logger";
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

  // TODO: 처음 로딩시 적용은 ComputingTree 그 이후는 전의 메뉴로
  Logger.debug(`SidebarTree ...`)
  return (
    <div className="aside-popup">
      {/* ✅ 가상머신 섹션 */}
      {(tmiLastSelected === "computing" || tmiLastSelected === "dashboard") && <ComputingTree />} 
      {tmiLastSelected === "network" && <NetworkTree />}
      {tmiLastSelected === "storage" && <StorageTree />}
      {tmiLastSelected === "event" && (renderedPreviously)}
    </div>
  );
};

export default SidebarTree;
