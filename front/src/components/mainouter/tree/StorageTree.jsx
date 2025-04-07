import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAllTreeNavigations } from "../../../api/RQHook";
import TreeMenuItem from "./TreeMenuItem";
import {
  rvi16Globe,
  rvi16DataCenter,
  rvi16Cloud,
} from "../../icons/RutilVmIcons";
import DomainActionButtons from "../../dupl/DomainActionButtons";
import DataCenterActionButtons from "../../dupl/DataCenterActionButtons";

const StorageTree = ({ selectedDiv, setSelectedDiv, onContextMenu, contextMenu, menuRef }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 로컬 스토리지에서 상태 불러오기
  const [isSecondVisible, setIsSecondVisible] = useState(() => {
    return JSON.parse(localStorage.getItem("isSecondVisible")) || false;
  });

  const [openDataCenters, setOpenDataCenters] = useState(() => {
    return JSON.parse(localStorage.getItem("openDataCenters")) || {};
  });

  const [openDomains, setOpenDomains] = useState(() => {
    return JSON.parse(localStorage.getItem("openDomains")) || {};
  });

  // 상태 변경 시 로컬 스토리지 업데이트
  useEffect(() => {
    localStorage.setItem("isSecondVisible", JSON.stringify(isSecondVisible));
    localStorage.setItem("openDataCenters", JSON.stringify(openDataCenters));
    localStorage.setItem("openDomains", JSON.stringify(openDomains));
  }, [isSecondVisible, openDataCenters, openDomains]);

  // API 호출 (스토리지 트리 데이터)
  const { data: navStorageDomains } = useAllTreeNavigations("storagedomain");

  // 데이터센터 접기/펼치기 토글
  const toggleDataCenter = (dataCenterId) => {
    setOpenDataCenters((prevState) => {
      const newState = { ...prevState, [dataCenterId]: !prevState[dataCenterId] };
      localStorage.setItem("openDataCenters", JSON.stringify(newState));
      return newState;
    });
  };

  // 도메인 접기/펼치기 토글
  const toggleDomain = (domainId) => {
    setOpenDomains((prevState) => {
      const newState = { ...prevState, [domainId]: !prevState[domainId] };
      localStorage.setItem("openDomains", JSON.stringify(newState));
      return newState;
    });
  };

  return (
    <div id="storage_chart" className="tmi-g">
      {/* 첫 번째 레벨 (Rutil Manager) */}
      <TreeMenuItem
        level={1}
        title="Rutil Manager"
        iconDef={rvi16Globe}
        // isSelected={() => /\/rutil-manager$/g.test(location.pathname)}
        isSelected={() =>
          location.pathname.includes("rutil")
        }
        isNextLevelVisible={isSecondVisible}
        isChevronVisible={true}
        onChevronClick={() => setIsSecondVisible((prev) => !prev)}
        onClick={() => {
          setSelectedDiv("rutil-manager");
          navigate("/storages/rutil-manager");
        }}
      />

      {/* 두 번째 레벨 (Data Center) */}
      {isSecondVisible &&
        navStorageDomains &&
        navStorageDomains.map((dataCenter) => {
          const isDataCenterOpen = openDataCenters[dataCenter.id] || false;
          const hasDomains =
            Array.isArray(dataCenter.storageDomains) &&
            dataCenter.storageDomains.length > 0;

          return (
            <div key={dataCenter.id} className="tmi-g">
             <TreeMenuItem
              level={2}
              title={dataCenter.name}
              iconDef={rvi16DataCenter}
              isSelected={() => location.pathname.includes(dataCenter.id)}
              isNextLevelVisible={isDataCenterOpen}
              isChevronVisible={hasDomains}
              onChevronClick={() => toggleDataCenter(dataCenter.id)}
              onClick={() => {
                setSelectedDiv(dataCenter.id);
                navigate(`/storages/datacenters/${dataCenter.id}/clusters`);
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
                  onCloseContextMenu={() => onContextMenu(null)}
                />
              </div>
          )}

              {/* 세 번째 레벨 (Storage Domains) */}
              {isDataCenterOpen &&
                Array.isArray(dataCenter.storageDomains) &&
                dataCenter.storageDomains.map((domain) => {
                  const isDomainOpen = openDomains[domain.id] || false;
                  const hasDisks =
                    Array.isArray(domain.disks) && domain.disks.length > 0;

                  return (
                    <div key={domain.id} className="tmi-g">
                      <TreeMenuItem
                        level={3}
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
                        onContextMenu={(e) => {
                          e.preventDefault();
                          onContextMenu?.(e, {
                            id: domain.id,
                            name: domain.name,
                            level: 3,
                            type: "domain",
                          }, "storage");
                        }}
                      />
                      {contextMenu?.item?.id === domain.id &&
                        contextMenu?.item?.type === "domain" && (
                          <div
                            className="right-click-menu-box context-menu-item"
                            ref={menuRef}
                            style={{
                              position: "fixed",
                              top: contextMenu.mouseY,
                              left: contextMenu.mouseX,
                              background: "white",
                              zIndex: 9999
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <DomainActionButtons
                              openModal={(action) => {
                                onContextMenu(null); // 닫기
                              }}
                              selectedDomains={[domain]}
                              status={domain?.status}
                              actionType="context"
                              isContextMenu={true}
                            />
                          </div>
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
