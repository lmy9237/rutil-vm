import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TreeMenuItem from "./TreeMenuItem";
import {
  rvi16Globe,
  rvi16DataCenter,
  rvi16Network,
} from "../../icons/RutilVmIcons";

import { useAllTreeNavigations } from "../../../api/RQHook";

const NetworkTree = ({ selectedDiv, setSelectedDiv,onContextMenu  }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // API 호출 (네트워크 트리 데이터)
  const { data: navNetworks } = useAllTreeNavigations("network");

  // 트리 상태 (초기값: localStorage에서 가져오기)
  const [openDataCenters, setOpenDataCenters] = useState(() => {
    return JSON.parse(localStorage.getItem("openDataCenters")) || { network: false };
  });
  const [openNetworkDataCenters, setOpenNetworkDataCenters] = useState(() => {
    return JSON.parse(localStorage.getItem("openNetworkDataCenters")) || {};
  });

  // localStorage 반영
  useEffect(() => {
    localStorage.setItem("openDataCenters", JSON.stringify(openDataCenters));
    localStorage.setItem("openNetworkDataCenters", JSON.stringify(openNetworkDataCenters));
  }, [openDataCenters, openNetworkDataCenters]);

  // 데이터센터 토글 (펼침/접기)
  const toggleNetworkDataCenter = (dataCenterId) => {
    setOpenNetworkDataCenters((prevState) => {
      const newState = { ...prevState, [dataCenterId]: !prevState[dataCenterId] };
      localStorage.setItem("openNetworkDataCenters", JSON.stringify(newState));
      return newState;
    });
  };

  return (
    <div id="network_chart" className="tmi-g">
      {/* 첫 번째 레벨 (Rutil Manager) */}
      <TreeMenuItem
        level={1}
        title="Rutil Manager"
        iconDef={rvi16Globe}
        // isSelected={() => /\/rutil-manager$/g.test(location.pathname)}
        isSelected={() =>
          location.pathname.includes("rutil")
        }
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

      {/* 두 번째 레벨 (Data Center) */}
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
                  oncontextmenu?.(e, {
                    id: dataCenter.id,
                    name: dataCenter.name,
                    level: 2,
                    type: "dataCenter",
                  }, "network");
                }}
              />

              {/* 세 번째 레벨 (네트워크) */}
              {isDataCenterOpen &&
                dataCenter.networks.map((network) => (
                  <TreeMenuItem
                    level={3}
                    key={network.id}
                    title={network.name}
                    iconDef={rvi16Network}
                    isSelected={() => location.pathname.includes(network.id)}
                    isNextLevelVisible={false}
                    isChevronVisible={false}
                    onClick={() => {
                      setSelectedDiv(network.id);
                      navigate(`/networks/${network.id}`);
                    }}
                  />
                ))}
            </div>
          );
        })}
    </div>
  );
};

export default NetworkTree;
