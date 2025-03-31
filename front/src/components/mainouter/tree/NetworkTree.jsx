import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TreeMenuItem from "./TreeMenuItem";
import {
  rvi16Globe,
  rvi16DataCenter,
  rvi16Network,
} from "../../icons/RutilVmIcons";
import { useAllTreeNavigations } from "../../../api/RQHook";
import NetworkActionButtons from "../../dupl/NetworkActionButtons";


const NetworkTree = ({
  selectedDiv,
  setSelectedDiv,
  onContextMenu,
  contextMenu,
  menuRef
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { data: navNetworks } = useAllTreeNavigations("network");

  const [openDataCenters, setOpenDataCenters] = useState(() => {
    return JSON.parse(localStorage.getItem("openDataCenters")) || { network: false };
  });
  const [openNetworkDataCenters, setOpenNetworkDataCenters] = useState(() => {
    return JSON.parse(localStorage.getItem("openNetworkDataCenters")) || {};
  });

  useEffect(() => {
    localStorage.setItem("openDataCenters", JSON.stringify(openDataCenters));
    localStorage.setItem("openNetworkDataCenters", JSON.stringify(openNetworkDataCenters));
  }, [openDataCenters, openNetworkDataCenters]);

  const toggleNetworkDataCenter = (dataCenterId) => {
    setOpenNetworkDataCenters((prevState) => {
      const newState = { ...prevState, [dataCenterId]: !prevState[dataCenterId] };
      localStorage.setItem("openNetworkDataCenters", JSON.stringify(newState));
      return newState;
    });
  };
  useEffect(() => {
    console.log("📦 contextMenu 상태:", contextMenu);
  }, [contextMenu]);
  return (
    <div id="network_chart" className="tmi-g">
      {/* 레벨 1: Rutil Manager */}
      <TreeMenuItem
        level={1}
        title="Rutil Manager"
        iconDef={rvi16Globe}
        isSelected={() => location.pathname.includes("rutil")}
        isNextLevelVisible={openDataCenters.network}
        isChevronVisible={true}
        onChevronClick={() =>
          setOpenDataCenters((prev) => {
            const newState = { ...prev, network: !prev.network };
            localStorage.setItem("openDataCenters", JSON.stringify(newState));
            return newState;
          })
        }
        onClick={() => {
          setSelectedDiv("rutil-manager");
          navigate("/networks/rutil-manager");
        }}
      />

      {/* 레벨 2: 데이터 센터 */}
      {openDataCenters.network &&
        navNetworks &&
        navNetworks.map((dataCenter) => {
          const isDataCenterOpen = openNetworkDataCenters[dataCenter.id] || false;
          const hasNetworks = Array.isArray(dataCenter.networks) && dataCenter.networks.length > 0;

          return (
            <div key={dataCenter.id} className="tmi-g">
              <TreeMenuItem
                level={2}
                title={dataCenter.name}
                iconDef={rvi16DataCenter}
                isSelected={() => location.pathname.includes(dataCenter.id)}
                isNextLevelVisible={isDataCenterOpen}
                isChevronVisible={hasNetworks}
                onChevronClick={() => toggleNetworkDataCenter(dataCenter.id)}
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
                        console.log("우클릭 발생!", network.id); // ✅ 이건 찍힘
                        e.preventDefault();
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
                          ref={menuRef}
                          style={{
                            position: "fixed", // ✅ fixed로 띄우면 무조건 보임
                            top: contextMenu.mouseY,
                            left: contextMenu.mouseX,
                            zIndex: 9999,
                            background: "white",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            padding: "4px",
                            width: "220px"
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span style={{ color: "black" }}>우클릭박스</span>
                          <NetworkActionButtons
                            openModal={(action) => {
                              onContextMenu(null); // 닫기
                              console.log("Open modal with action:", action);
                            }}
                            selectedNetworks={[contextMenu.item]}
                            status={contextMenu.item?.status}
                            actionType="context"
                            isContextMenu={true}
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
