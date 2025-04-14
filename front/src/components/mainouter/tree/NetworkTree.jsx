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
import NetworkActionButtons from "../../dupl/NetworkActionButtons";
import DataCenterActionButtons from "../../dupl/DataCenterActionButtons";
import Logger from "../../../utils/Logger";

const NetworkTree = ({
  selectedDiv,
  setSelectedDiv,
  onContextMenu,
  contextMenu,
  menuRef,
  setActiveModal,        
  setSelectedNetworks,
  setSelectedDataCenters,
  closeContextMenu
}) => {
  const {
    secondVisibleNetwork, toggleSecondVisibleNetwork,
    openDataCentersNetwork, toggleOpenDataCentersNetwork
  } = useUIState();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ API 호출 (네트워크 트리 데이터)
  const { data: navNetworks } = useAllTreeNavigations("network");

  useEffect(() => {
    Logger.debug("📦 contextMenu 상태:", contextMenu);
  }, [contextMenu]);

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
        // isNextLevelVisible={openDataCentersNetwork("network")}
        // onChevronClick={() => toggleOpenDataCentersNetwork("network")}
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
                  onContextMenu?.(e, {
                    id: dataCenter.id,
                    name: dataCenter.name,
                    level: 2,
                    type: "dataCenter",
                  }, "network");
                }}
              />
            {/* 👇 데이터센터 우클릭 시 context 메뉴 표시 */}
            {contextMenu?.item?.id === dataCenter.id &&
              contextMenu?.item?.type === "dataCenter" && (
                <div
                  className="right-click-menu-box context-menu-item"
                  ref={menuRef}
                  style={{
                    position: "fixed",
                    top: contextMenu.mouseY,
                    left: contextMenu.mouseX,
                    background: "white",
                    zIndex: "9999",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
              <DataCenterActionButtons
                selectedDataCenters={[contextMenu.item]}
                status="single"
                actionType="context"
                isContextMenu={true}
                onCloseContextMenu={() => onContextMenu(null)}
                openModal={(action) => {
                  setActiveModal?.(`datacenter:${action}`);
                  setSelectedDataCenters?.([contextMenu.item]); 
                  closeContextMenu();              
                }}
              />

                </div>
            )}

              {/* 레벨 3: 네트워크 */}
              {isDataCenterOpen &&
                dataCenter.networks.map((network) => (
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
                        Logger.debug(`우클릭 발생 ... ${network.id}`); // ✅ 이건 찍힘
                        onContextMenu?.(e, {
                          ...network,
                          level: 3,
                          type: "network",
                        }, "network");
                      }}
                      
                    />

                    {/* 👇 현재 우클릭된 네트워크에만 액션버튼 표시 */}
                    {contextMenu?.item?.id === network.id &&
                      contextMenu?.item?.type === "network" && (
                        <div
                          className="right-click-menu-box context-menu-item"
                          ref={menuRef}
                          style={{
                            position: "fixed", 
                            top: contextMenu.mouseY,
                            left: contextMenu.mouseX,
                            background:"white",
                            zIndex:"9999"
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                        
                          <NetworkActionButtons
                            openModal={(action) => {
                              setActiveModal?.(`network:${action}`); 
                              setSelectedNetworks?.([contextMenu.item]);    
                              closeContextMenu();                       
                            }}
                            selectedNetworks={[contextMenu.item]}
                            status={contextMenu.item?.status}
                            actionType="context"
                            isContextMenu={true}
                            onCloseContextMenu={() => onContextMenu(null)} 
                          />
                        </div>
                    )}
                  </div>
                ))}
            </div>
          );
        })}
    </div>
  );
};

export default NetworkTree;
