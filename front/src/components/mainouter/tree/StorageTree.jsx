import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useContextMenu from "../../../hooks/useContextMenu";
import useTmi from "../../../hooks/useTmi";
import useGlobal from "../../../hooks/useGlobal";
import TreeMenuItem from "./TreeMenuItem";
import {
  rvi16Globe,
  rvi16DataCenter,
  rvi16Cloud,
} from "../../icons/RutilVmIcons";
import { useAllTreeNavigations } from "../../../api/RQHook";
import Logger from "../../../utils/Logger";

const StorageTree = ({}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { contextMenu, setContextMenu, } = useContextMenu();
  const { 
    secondVisibleStorage, toggleSecondVisibleStorage,
    openDataCentersStorage, toggleDataCentersStorage,
    openDomainsStorage, toggleOpenDomainsStorage,
  } = useTmi();
  const { setDatacentersSelected, setDomainsSelected, } = useGlobal();

  // ✅ API 호출 (스토리지 트리 데이터)
  const { data: navStorageDomains } = useAllTreeNavigations("storagedomain");

  Logger.debug(`StorageTree ... `)
  return (
    <div id="tmi-storage" className="tmi-g">
      {/* 첫 번째 레벨 (Rutil Manager) */}
      <TreeMenuItem level={1}
        title="Rutil Manager"
        iconDef={rvi16Globe}
        // isSelected={() => /\/rutil-manager$/g.test(location.pathname)}
        isSelected={() => location.pathname.includes("rutil")}
        isNextLevelVisible={secondVisibleStorage()}
        isChevronVisible={true}
        onChevronClick={() => toggleSecondVisibleStorage()}
        onClick={() => {
          navigate("/storages/rutil-manager");
        }}
      />

      {/* 두 번째 레벨 (Data Center) */}
      {secondVisibleStorage() && navStorageDomains && navStorageDomains.map((dataCenter) => {
        const isDataCentersOpen = openDataCentersStorage(dataCenter.id);
        const hasDomains = Array.isArray(dataCenter.storageDomains) && dataCenter.storageDomains.length > 0;

        return (
          <div key={dataCenter.id} className="tmi-g">
            <TreeMenuItem level={2}
              title={dataCenter.name}
              iconDef={rvi16DataCenter}
              isSelected={() => location.pathname.includes(dataCenter.id)}
              isNextLevelVisible={isDataCentersOpen}
              isChevronVisible={hasDomains}
              onChevronClick={() => toggleDataCentersStorage(dataCenter.id)}
              onClick={() => {
                navigate(`/storages/datacenters/${dataCenter.id}/clusters`);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDatacentersSelected(dataCenter)
                setContextMenu({
                  mouseX: e.clientX,
                  mouseY: e.clientY,
                  item: {
                    ...dataCenter,
                    level: 2,
                  },
                  treeType: "storage",
                }, "datacenter");
              }}
            />
            
            {/* 세 번째 레벨 (Storage Domains) */}
            {isDataCentersOpen &&
              Array.isArray(dataCenter.storageDomains) && dataCenter.storageDomains.map((domain) => {
                const isDomainOpen = openDomainsStorage(domain.id) || false;
                const hasDisks = Array.isArray(domain.disks) && domain.disks.length > 0;

                return (
                  <div key={domain.id} className="tmi-g">
                    <TreeMenuItem
                      level={3}
                      title={domain.name}
                      iconDef={rvi16Cloud}
                      isSelected={() => location.pathname.includes(domain.id)}
                      isNextLevelVisible={isDomainOpen}
                      isChevronVisible={hasDisks}
                      onChevronClick={() => toggleOpenDomainsStorage(domain.id)}
                      onClick={() => {
                        navigate(`/storages/domains/${domain.id}`);
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDomainsSelected(domain)
                        setContextMenu({
                          mouseX: e.clientX,
                          mouseY: e.clientY,
                          item: {
                            ...domain,
                            level: 3,
                          },
                          treeType: "storage"
                        }, "domain")
                      }}
                    />
                  </div>
                );
              })}
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(StorageTree);
