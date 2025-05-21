import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useGlobal              from "@/hooks/useGlobal";
import useTmi                 from "@/hooks/useTmi";
import useContextMenu         from "@/hooks/useContextMenu";
import {
  rvi16Globe,
  rvi16DataCenter,
  rvi16Storage,
} from "@/components/icons/RutilVmIcons";
import {
  useAllTreeNavigations,
} from "@/api/RQHook";
import Logger                 from "@/utils/Logger";
import TreeMenuItem           from "./TreeMenuItem";

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
  const { data: navStorageDomains = [] } = useAllTreeNavigations("storagedomain");

  Logger.debug(`StorageTree ... `)
  return (
    <div id="tmi-storage" className="tmi-g">
      {/* 첫 번째 레벨 (Rutil Manager) */}
      <TreeMenuItem level={1}
        title="Rutil Manager"
        iconDef={rvi16Globe("currentColor")}
        // isSelected={() => /\/rutil-manager$/g.test(location.pathname)}
        isSelected={() => location.pathname.includes("rutil")}
        isNextLevelVisible={secondVisibleStorage()}
        isChevronVisible={true}
        onChevronClick={() => toggleSecondVisibleStorage()}
        onClick={() => navigate("/storages/rutil-manager")}
        onContextMenu={(e) => {
          e.preventDefault();
          setContextMenu({
            mouseX: e.clientX,
            mouseY: e.clientY,
            item: {
            },
            treeType: "storage"
          }, "rutil-manager");
        }}
      />

      {/* 두 번째 레벨 (Data Center) */}
      {secondVisibleStorage() && navStorageDomains && [...navStorageDomains].map((dc) => {
        const isDataCentersOpen = openDataCentersStorage(dc?.id);
        const hasDomains = [...dc?.storageDomains]?.length > 0;

        return (
          <div key={dc?.id} className="tmi-g" id="tmi-datacenter">
            <TreeMenuItem level={2}
              title={dc?.name}
              iconDef={rvi16DataCenter("currentColor")}
              isSelected={() => location.pathname.includes(dc?.id)}
              isNextLevelVisible={isDataCentersOpen}
              isChevronVisible={hasDomains}
              onChevronClick={() => toggleDataCentersStorage(dc?.id)}
              onClick={() => {
                setDatacentersSelected(dc)
                dc?.id && navigate(`/storages/datacenters/${dc?.id}/clusters`);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDatacentersSelected(dc)
                setContextMenu({
                  mouseX: e.clientX,
                  mouseY: e.clientY,
                  item: {
                    ...dc,
                    level: 2,
                  },
                  treeType: "storage",
                }, "datacenter");
              }}
            />
            
            {/* 세 번째 레벨 (Storage Domains) */}
            {isDataCentersOpen && [...dc?.storageDomains]?.map((domain) => {
              const isDomainOpen = openDomainsStorage(domain?.id) || false;
              const hasDisks = [...domain?.disks]?.length > 0;

              return (
                <div key={domain?.id} className="tmi-g" id="tmi-domain">
                  <TreeMenuItem
                    level={3}
                    title={domain?.name}
                    iconDef={rvi16Storage("currentColor")}
                    isSelected={() => location.pathname.includes(domain?.id)}
                    isNextLevelVisible={isDomainOpen}
                    isChevronVisible={hasDisks}
                    onChevronClick={() => toggleOpenDomainsStorage(domain?.id)}
                    onClick={() => {
                      setDatacentersSelected(dc)
                      setDomainsSelected(domain)
                      domain?.id && navigate(`/storages/domains/${domain?.id}`);
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDatacentersSelected(dc)
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
