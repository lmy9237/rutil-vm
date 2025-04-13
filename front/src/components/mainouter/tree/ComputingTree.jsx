import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TreeMenuItem from "./TreeMenuItem";
import {
  rvi16Globe,
  rvi16Host,
  rvi16Desktop,
  rvi16DataCenter,
  rvi16Cluster,
  rvi16DesktopSleep,
} from "../../icons/RutilVmIcons";
import { useAllTreeNavigations } from "../../../api/RQHook";
import useUIState from "../../../hooks/useUIState";
import DataCenterActionButtons from "../../dupl/DataCenterActionButtons";
import ClusterActionButtons from "../../dupl/ClusterActionButtons";

const ComputingTree = ({ 
  selectedDiv,
  setSelectedDiv,
  getBackgroundColor,
  getPaddingLeft,
  onContextMenu,
  contextMenu,
  menuRef,
  setActiveModal,
  setSelectedDataCenters,
  setSelectedClusters 
 }) => {
  const { 
    secondVisibleComputing, toggleSecondVisibleComputing,
    openDataCentersComputing, toggleOpenDataCentersComputing,
    openClustersComputing, toggleOpenClustersComputing,
    openHostsComputing, toggleOpenHostsComputing,
  } = useUIState();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ API 호출 (컴퓨팅 트리 데이터)
  const { data: navClusters } = useAllTreeNavigations("cluster");

  return (
    <div id="virtual_machine_chart" className="tmi-g">
      {/* 첫 번째 레벨 (Rutil Manager) */}
      <TreeMenuItem level={1}
        title="Rutil Manager"
        iconDef={rvi16Globe}
        // isSelected={() => /\/rutil-manager$/g.test(location.pathname)}
        isSelected={() =>
          location.pathname.includes("rutil")
        }
        isNextLevelVisible={secondVisibleComputing()}
        onChevronClick={() => toggleSecondVisibleComputing()}
        onClick={() => {
          setSelectedDiv("rutil-manager");
          navigate("/computing/rutil-manager");
        }}
      />

      {/* 두 번째 레벨 (Data Center) */}
      {secondVisibleComputing() && navClusters && navClusters.map((dataCenter) => {
        const isDataCenterOpen = openDataCentersComputing(dataCenter.id) || false;
        const hasClusters = Array.isArray(dataCenter.clusters) && dataCenter.clusters.length > 0;
        return (
          <div key={dataCenter.id} className="tmi-g">
            <TreeMenuItem level={2}
              title={dataCenter.name}
              iconDef={rvi16DataCenter}
              isSelected={() => location.pathname.includes(dataCenter.id)}
              isNextLevelVisible={isDataCenterOpen}
              isChevronVisible={hasClusters}
              onChevronClick={() => toggleOpenDataCentersComputing(dataCenter.id)}
              onClick={() => {
                setSelectedDiv(dataCenter.id);
                navigate(`/computing/datacenters/${dataCenter.id}/clusters`);
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
                    zIndex: 9999,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <DataCenterActionButtons
                    selectedDataCenters={[contextMenu.item]}
                    status="single"
                    actionType="context"
                    onCloseContextMenu={() => onContextMenu(null)}
                    openModal={(action) => {
                      setActiveModal?.(`datacenter:${action}`);
                      setSelectedDataCenters?.([contextMenu.item]);
                      onContextMenu(null);
                    }}
                  />
                </div>
            )}

            {/* 세 번째 레벨 (Clusters) */}
            {isDataCenterOpen && Array.isArray(dataCenter.clusters) && dataCenter.clusters.map((cluster) => {
              const isClusterOpen = openClustersComputing(cluster.id) || false;
              const hasHosts = Array.isArray(cluster.hosts) && cluster.hosts.length > 0;
              return (
                <div key={cluster.id} className="tmi-g">
                   <TreeMenuItem
                  level={3}
                  title={cluster.name}
                  iconDef={rvi16Cluster}
                  isSelected={() => location.pathname.includes(cluster.id)}
                  isNextLevelVisible={isClusterOpen}
                  isChevronVisible={hasHosts}
                  onChevronClick={() => toggleOpenClustersComputing(cluster.id)}
                  onClick={() => {
                    setSelectedDiv(cluster.id);
                    navigate(`/computing/clusters/${cluster.id}`);
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    onContextMenu?.(e, {
                      id: cluster.id,
                      name: cluster.name,
                      level: 3,
                      type: "cluster",
                    }, "computing");
                  }}
                />

                  {/* 우클릭 context 메뉴 */}
                  {contextMenu?.item?.id === cluster.id &&
                    contextMenu?.item?.type === "cluster" && (
                      <div
                        className="right-click-menu-box context-menu-item"
                        ref={menuRef}
                        style={{
                          position: "fixed",
                          top: contextMenu.mouseY,
                          left: contextMenu.mouseX,
                          background: "white",
                          zIndex: 9999,
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ClusterActionButtons
                          openModal={(action) => {
                            setActiveModal?.(`cluster:${action}`);
                            setSelectedClusters?.([contextMenu.item]);
                            onContextMenu(null);
                          }}
                          isEditDisabled={false} // 필요 시 조건 지정 가능
                          status={"ready"}       // 또는 contextMenu.item.status 등
                          actionType="context"
                        />
                      </div>
                  )}
                  {/* 네 번째 레벨 (Hosts & VM Downs) */}
                  {isClusterOpen && (
                    <>
                      {/* Hosts */}
                      {Array.isArray(cluster.hosts) && cluster.hosts.map((host) => {
                        const isHostOpen = openHostsComputing(host.id) || false;
                        const hasVMs = Array.isArray(host.vms) && host.vms.length > 0;
                        return (
                          <div key={host.id} className="tmi-g">
                            <TreeMenuItem level={4}
                              title={host.name}
                              iconDef={rvi16Host}
                              isSelected={() => location.pathname.includes(host.id)}
                              isNextLevelVisible={isHostOpen}
                              isChevronVisible={hasVMs}
                              onChevronClick={() => toggleOpenHostsComputing(host.id)}
                              onClick={() => {
                                setSelectedDiv(host.id);
                                navigate(`/computing/hosts/${host.id}`);
                              }}
                            />
                            {/* 다섯 번째 레벨 (VMs under Host) */}
                            {isHostOpen && Array.isArray(host.vms) && host.vms.map((vm) => (
                              <div key={vm.id} className="tmi-g">
                                <TreeMenuItem level={5}
                                  title={vm.name}
                                  iconDef={rvi16Desktop}
                                  // TODO: host에 붙어있지만 상태가 이상한 경우에 대한 조건처리
                                  // iconDef={rvi16DesktopFlag()}
                                  isSelected={() => location.pathname.includes(vm.id)}
                                  isNextLevelVisible={isHostOpen}
                                  isChevronVisible={false}
                                  onChevronClick={()=>{}}
                                  onClick={() => {
                                    setSelectedDiv(vm.id);
                                    navigate(`/computing/vms/${vm.id}`);
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      )}
                      {/* VM(중지) */}
                      {Array.isArray(cluster.vmDowns) && cluster.vmDowns.map((vm) => (
                        <div key={vm.id} className="tmi-g">
                          <TreeMenuItem level={4}
                            title={vm.name}
                            iconDef={rvi16DesktopSleep}
                            isSelected={() => location.pathname.includes(vm.id)}
                            isNextLevelVisible={false}
                            isChevronVisible={false}
                            onChevronClick={()=>{}}
                            onClick={() => {
                              setSelectedDiv(vm.id);
                              navigate(`/computing/vms/${vm.id}`);
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
        })}
    </div>
  );
};

export default ComputingTree;
