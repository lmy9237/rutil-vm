import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useUIState from "../../../hooks/useUIState";
import TreeMenuItem from "./TreeMenuItem";
import {
  rvi16Globe,
  rvi16DataCenter,
  rvi16Network,
} from "../../icons/RutilVmIcons";
import { useAllTreeNavigations } from "../../../api/RQHook";
import Logger from "../../../utils/Logger";

const NetworkTree = ({
  selectedDiv,
  setSelectedDiv,
  menuRef,
  setActiveModal,        
  setSelectedNetworks,
  setSelectedDataCenters,
  closeContextMenu
}) => {
  const {
    contextMenu, setContextMenu,
    secondVisibleNetwork, toggleSecondVisibleNetwork,
    openDataCentersNetwork, toggleOpenDataCentersNetwork
  } = useUIState();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ API 호출 (네트워크 트리 데이터)
  const { data: navNetworks } = useAllTreeNavigations("network");

  Logger.debug(`NetworkTree ...`)
  return (
    <div id="network_chart" className="tmi-g">
      {/* 레벨 1: Rutil Manager */}
      <TreeMenuItem level={1}
        title="Rutil Manager"
        iconDef={rvi16Globe}
        isSelected={() => location.pathname.includes("rutil")}
        isNextLevelVisible={secondVisibleNetwork()}
        onChevronClick={() => toggleSecondVisibleNetwork()}
        isChevronVisible={true}
        onClick={() => {
          setSelectedDiv("rutil-manager");
          navigate("/networks/rutil-manager");
        }}
      />

      {/* 레벨 2: 데이터 센터 */}
      {secondVisibleNetwork() && navNetworks && navNetworks.map((dataCenter) => {
        const isDataCenterOpen = openDataCentersNetwork(dataCenter.id) || false;
        const hasNetworks = Array.isArray(dataCenter.networks) && dataCenter.networks.length > 0;

        return (
          <div key={dataCenter.id} className="tmi-g">
            <TreeMenuItem level={2}
              title={dataCenter.name}
              iconDef={rvi16DataCenter}
              isSelected={() => location.pathname.includes(dataCenter.id)}
              isNextLevelVisible={isDataCenterOpen}
              isChevronVisible={hasNetworks}
              onChevronClick={() => toggleOpenDataCentersNetwork(dataCenter.id)}
              onClick={() => {
                setSelectedDiv(dataCenter.id);
                navigate(`/networks/datacenters/${dataCenter.id}/clusters`);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                setContextMenu({
                  mouseX: e.clientX,
                  mouseY: e.clientY,
                  item: {
                    id: dataCenter.id,
                    name: dataCenter.name,
                    level: 2,
                    type: "dataCenter",
                  },
                  treeType: "network"
                });
              }}
            />

            {/* 레벨 3: 네트워크 */}
            {isDataCenterOpen && dataCenter.networks.map((network) => (
              <div key={network.id} style={{ position: "relative" }}>
                <TreeMenuItem
                  level={3}
                  title={network.name}
                  iconDef={rvi16Network}
                  isSelected={() => location.pathname.includes(network.id)}
                  isNextLevelVisible={false}
                  isChevronVisible={false}
                  onClick={() => {
                    setSelectedDiv(network.id);
                    navigate(`/networks/${network.id}`);
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setContextMenu({
                      mouseX: e.clientX,
                      mouseY: e.clientY,
                      item: {
                        ...network,
                        level: 3,
                        type: "network",
                      },
                      treeType: "network"
                    });
                  }}
                />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default NetworkTree;
