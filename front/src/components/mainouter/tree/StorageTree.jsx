import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useGlobal              from "@/hooks/useGlobal";
import useTmi                 from "@/hooks/useTmi";
import useContextMenu         from "@/hooks/useContextMenu";
import Loading                from "@/components/common/Loading";
import {
  rvi16Globe,
  rvi16DataCenter,
  status2TreeIcon,
} from "@/components/icons/RutilVmIcons";
import {
  useAllTreeNavigations,
} from "@/api/RQHook";
import Logger                 from "@/utils/Logger";
import TreeMenuItem           from "./TreeMenuItem";

const StorageTree = ({}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    contextMenu, 
    setContextMenu, 
    contextMenuType
  } = useContextMenu();

  const { 
    secondVisibleStorage, toggleSecondVisibleStorage,
    openDataCentersStorage, toggleDataCentersStorage,
    openDomainsStorage, toggleOpenDomainsStorage,
  } = useTmi();
  const { setDatacentersSelected, setDomainsSelected, setDisksSelected } = useGlobal();

  // ✅ API 호출 (스토리지 트리 데이터)
  const { 
    data: navStorageDomains=[],
    isLoading: isNavStorageDomainsLoading,
    isSuccess: isNavStorageDomainsSuccess,
    isError: isNavStorageDomainsError,
  } = useAllTreeNavigations("storagedomain");

  const renderTree = () => {
    Logger.debug(`StorageTree > renderTree ... `)
    {/* 두 번째 레벨 (Data Center) */}
    return !!isNavStorageDomainsLoading 
      ? (<Loading />)
      : (secondVisibleStorage() && navStorageDomains && [...navStorageDomains].map((dc) => {
        const isDataCentersOpen = openDataCentersStorage(dc?.id);
        const hasDomains = [...dc?.storageDomains]?.length > 0;

        return (
          <div key={dc?.id} className="tmi-g" id="tmi-datacenter">
            <TreeMenuItem level={2}
              title={dc?.name}
              iconDef={rvi16DataCenter("currentColor")}
              isSelected={() => location.pathname.includes(dc?.id)}
              isContextSelected={contextMenuType() === "datacenter" && contextMenu()?.item?.id === dc?.id}
              isNextLevelVisible={isDataCentersOpen}
              isChevronVisible={hasDomains}
              onChevronClick={() => toggleDataCentersStorage(dc?.id)}
              onClick={() => {
                setDatacentersSelected(dc)
                dc?.id && navigate(`/storages/datacenters/${dc?.id}`);
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
                  treeType: "domains",
                }, "datacenter");
              }}
            />
            
            {/* 세 번째 레벨 (Storage Domains) */}
            {isDataCentersOpen && [...dc?.storageDomains]?.map((domain) => {
              const isDomainOpen = openDomainsStorage(domain?.id) || false;
              const hasDisks = [...domain?.disks]?.length > 0;
              return (
                <div key={domain?.id} className="tmi-g" id="tmi-domain">
                  <TreeMenuItem level={3}
                    title={domain?.name}
                    iconDef={status2TreeIcon("domain", domain?.status)}
                    isSelected={() => location.pathname.includes(domain?.id)}
                    isContextSelected={contextMenuType() === "domain" && contextMenu()?.item?.id === domain?.id}
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
                        treeType: "domains"
                      }, "domain")
                    }}
                  />

                  {/* 네 번째 레벨 (Disk(s)) */}
                  {isDomainOpen && (
                    <>
                      {/* Disks */}
                      {[...domain?.disks]?.map((disk) => (
                        <div key={disk?.id} className="tmi-g" id="tmi-disk">
                          <TreeMenuItem level={4}
                            title={disk?.name}
                            iconDef={status2TreeIcon("disk", disk?.status, { attached: disk?.vmAttached || disk?.templateAttached })}
                            isSelected={() => location.pathname.includes(disk?.id)}
                            isContextSelected={contextMenuType() === "disk" && contextMenu()?.item?.id === disk?.id}
                            isNextLevelVisible={isDomainOpen}
                            isChevronVisible={false}
                            onChevronClick={()=>{}}
                            onClick={() => {
                              setDatacentersSelected(dc)
                              setDomainsSelected(domain)
                              setDisksSelected(disk)
                              // disk?.id && navigate(`/storages/domains/${domain?.id}/disks/${disk?.id}`);
                              disk?.id && navigate(`/storages/disks/${disk?.id}`);
                              
                            }}
                            onContextMenu={(e) => {
                              e.preventDefault();
                              setDatacentersSelected(dc)
                              setDomainsSelected(domain)
                              // setDisksSelected(disk)
                              setDisksSelected({ //이동,복사 안뜸
                                ...disk,
                                dataCenterVo: dc,
                                storageDomainVo: domain,
                                alias: disk?.diskImageVo?.alias ?? disk?.alias ?? "",
                                virtualSize: disk?.diskImageVo?.virtualSize ?? disk?.virtualSize ?? 0,
                              });
                              setContextMenu({
                                mouseX: e.clientX,
                                mouseY: e.clientY,
                                item: {
                                  ...disk,
                                  level: 4,
                                },
                                treeType: "domains"
                              }, "disk");
                            }}
                          />
                        </div>
                      ))}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        );
      })
    )}

  return (
    <div id="tmi-storage" className="tmi-g">
      {/* 첫 번째 레벨 (Rutil Manager) */}
      <TreeMenuItem level={1}
        title="Rutil Manager"
        iconDef={rvi16Globe("currentColor")}
        // isSelected={() => /\/rutil-manager$/g.test(location.pathname)}
        isSelected={() => location.pathname.includes("rutil")}
        isContextSelected={contextMenuType() === "rutil-manager"}
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
            treeType: "domains"
          }, "rutil-manager");
        }}
      />
      {renderTree()}
    </div>
  );
};

export default StorageTree;
