import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TreeMenuItem from "./TreeMenuItem";
import {
  rvi16Globe,
  rvi16DataCenter,
  rvi16Network,
} from "../../icons/RutilVmIcons";

import { useAllTreeNavigations } from "../../../api/RQHook";
import { faL } from "@fortawesome/free-solid-svg-icons";

const NetworkTree = ({
  selectedDiv,
  setSelectedDiv,
  getBackgroundColor,
  getPaddingLeft,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ API 호출 (네트워크 트리리 데이터)
  const { data: navNetworks } = useAllTreeNavigations("network");

  const [openDataCenters, setOpenDataCenters] = useState(JSON.parse(localStorage.getItem("openDataCenters")) || {});
  const [openNetworkDataCenters, setOpenNetworkDataCenters] = useState(() => JSON.parse(localStorage.getItem("openNetworkDataCenters")) || {});
  useEffect(() => {
    localStorage.setItem("openDataCenters", JSON.stringify(openDataCenters));
    localStorage.setItem("openNetworkDataCenters", JSON.stringify(openNetworkDataCenters));
  }, [openDataCenters, openNetworkDataCenters]);
  
  const toggleNetworkDataCenter = (dataCenterId) => {
    setOpenNetworkDataCenters((prevState) => ({
      ...prevState,
      [dataCenterId]: !prevState[dataCenterId],
    }));
  };

  return (
    <div id="network_chart">
      {/* 첫 번째 레벨 (Rutil Manager) */}
      <TreeMenuItem level={1}
        title="Rutil Manager"
        iconDef={rvi16Globe}
        isSelected={() => /\/rutil-manager$/g.test(location.pathname)}
        isNextLevelVisible={openDataCenters.network}
        onChevronClick={() =>
          setOpenDataCenters((prev) => ({
            ...prev,
            network: !prev.network,
          }))
        }
        onClick={() => {
          setSelectedDiv("rutil-manager");
          navigate("/networks/rutil-manager");
        }}
      />
      {/* 두 번째 레벨 (Data Center) */}
      {navNetworks && navNetworks.map((dataCenter) => {
        const isDataCenterOpen = openNetworkDataCenters[dataCenter.id] || false;
        const hasNetworks = Array.isArray(dataCenter.networks) && dataCenter.networks.length > 0;
        return (
          <div key={dataCenter.id}>
            <TreeMenuItem level={2}
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
            />
            {/* 세 번째 레벨 */}
            {isDataCenterOpen && dataCenter.networks.map((network) => (
              <TreeMenuItem level={3}
                key={network.id}
                title={network.name}
                iconDef={rvi16Network}
                isSelected={() => location.pathname.includes(network.id)}
                isNextLevelVisible={false}
                isChevronVisible={false}
                onChevronClick={() => {}}
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
