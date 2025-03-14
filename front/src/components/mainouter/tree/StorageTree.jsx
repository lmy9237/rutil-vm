import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAllTreeNavigations } from "../../../api/RQHook";
import TreeMenuItem from "./TreeMenuItem";
import {
  rvi16Globe,
  rvi16DataCenter,
  rvi16Cloud,
} from "../../icons/RutilVmIcons";

const StorageTree = ({
  selectedDiv,
  setSelectedDiv,
  getBackgroundColor,
  getPaddingLeft,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isSecondVisible, setIsSecondVisible] = useState(
    JSON.parse(localStorage.getItem("isSecondVisible")) || false
  );
  const { 
    data: navStorageDomains
  } = useAllTreeNavigations("storagedomain");
  
  const [openDomains, setOpenDomains] = useState(JSON.parse(localStorage.getItem("openDomains")) || {});
  
  const toggleDomain = (domainId) => {
    setOpenDomains((prevState) => ({
      ...prevState,
      [domainId]: !prevState[domainId],
    }));
  };

  const toggleDataCenter = (dataCenterId) => {
    setOpenDataCenters((prevState) => ({
      ...prevState,
      [dataCenterId]: !prevState[dataCenterId],
    }));
  };

  const [openDataCenters, setOpenDataCenters] = useState(JSON.parse(localStorage.getItem("openDataCenters")) || {});

  return (
    <div id="storage_chart">
      {/* 첫 번째 레벨 (Rutil Manager) */}
      <TreeMenuItem level={1}
        title="Rutil Manager"
        iconDef={rvi16Globe}
        isSelected={() => /\/rutil-manager$/g.test(location.pathname)}
        isNextLevelVisible={openDataCenters.network}
        onChevronClick={() => setIsSecondVisible(!isSecondVisible)}
        onClick={() => {
          setSelectedDiv("rutil-manager");
          navigate("/storages/rutil-manager");
        }}
      />
      {/* 두 번째 레벨 (Data Center) */}
      {isSecondVisible && navStorageDomains && navStorageDomains.map((dataCenter) => {
        const isDataCenterOpen = openDataCenters[dataCenter.id] || false;
        const hasDomains = Array.isArray(dataCenter.storageDomains) && dataCenter.storageDomains.length > 0;
        return (
          <div key={dataCenter.id}>
            <TreeMenuItem level={2}
              title={dataCenter.name}
              iconDef={rvi16DataCenter}
              isSelected={() => location.pathname.includes(dataCenter.id)}
              isNextLevelVisible={hasDomains}
              onChevronClick={() => toggleDataCenter(dataCenter.id)}
              onClick={() => {
                setSelectedDiv(dataCenter.id);
                navigate(`/networks/datacenters/${dataCenter.id}/clusters`);
              }}
            />
            {/* 세 번째 레벨 (Storage Domains) */}
            {isDataCenterOpen && Array.isArray(dataCenter.storageDomains) && dataCenter.storageDomains.map((domain) => {
              const isDomainOpen = openDomains[domain.id] || false;
              const hasDisks = Array.isArray(domain.disks) && domain.disks.length > 0;
              return (
                <div key={domain.id}>
                  <TreeMenuItem level={3}
                    title={domain.name}
                    iconDef={rvi16Cloud}
                    isSelected={() => location.pathname.includes(domain.id)}
                    isNextLevelVisible={isDomainOpen}
                    isChevronVisible={hasDisks}
                    onChevronClick={() => toggleDomain(domain.id)}
                    onClick={() => {
                      setSelectedDiv(domain.id);
                      navigate(`/storages/domains/${domain.id}`);
                    }}
                  />
                  {hasDisks && (
                    <TreeMenuItem level={4}
                      title={domain.name}
                      iconDef={rvi16Cloud}
                      isSelected={() => location.pathname.includes(domain.id)}
                      isNextLevelVisible={isDomainOpen}
                      isChevronVisible={hasDisks}
                      onChevronClick={() => toggleDomain(domain.id)}
                      onClick={() => {
                        toggleDomain(domain.id);
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default StorageTree;
