import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useUIState from "../../../hooks/useUIState";
import useTmi from "../../../hooks/useTmi";
import useGlobal from "../../../hooks/useGlobal";
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
import Logger from "../../../utils/Logger";

/**
 * @name ComputingTree
 * @description computing 메뉴 
 *
 * @returns {JSX.Element} ComputingTree
 */
const ComputingTree = ({}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { contextMenu, setContextMenu } = useUIState();
  const {
    secondVisibleComputing, toggleSecondVisibleComputing,
    openDataCentersComputing, toggleOpenDataCentersComputing,
    openClustersComputing, toggleOpenClustersComputing,
    openHostsComputing, toggleOpenHostsComputing,
  } = useTmi();
  const {
    setDatacentersSelected,
    setClustersSelected,
    setHostsSelected,
    setVmsSelected,
  } = useGlobal();

  // ✅ API 호출 (컴퓨팅 트리 데이터)
  const { data: navClusters } = useAllTreeNavigations("cluster");

  Logger.debug(`ComputingTree ... `)
  return (
    <div id="tmi-computing" className="tmi-g">
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
                navigate(`/computing/datacenters/${dataCenter.id}/clusters`);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                setDatacentersSelected(dataCenter)
                setContextMenu({
                  mouseX: e.clientX,
                  mouseY: e.clientY,
                  item: {
                    ...dataCenter,
                    level: 2,
                  },
                  treeType: "computing"
                }, "datacenter");
              }}
            />

            {/* 세 번째 레벨 (Clusters) */}
            {isDataCenterOpen && Array.isArray(dataCenter.clusters) && dataCenter.clusters.map((cluster) => {
              const isClusterOpen = openClustersComputing(cluster.id) || false;
              const hasHosts = Array.isArray(cluster.hosts) && cluster.hosts.length > 0;
              return (
                <div key={cluster.id} className="tmi-g">
                  <TreeMenuItem level={3}
                    title={cluster.name}
                    iconDef={rvi16Cluster}
                    isSelected={() => location.pathname.includes(cluster.id)}
                    isNextLevelVisible={isClusterOpen}
                    isChevronVisible={hasHosts}
                    onChevronClick={() => toggleOpenClustersComputing(cluster.id)}
                    onClick={() => {
                      navigate(`/computing/clusters/${cluster.id}`);
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setDatacentersSelected(dataCenter)
                      setClustersSelected(cluster)
                      setContextMenu({
                        mouseX: e.clientX,
                        mouseY: e.clientY,
                        item: {
                          ...cluster,
                          level: 3,
                        },
                        treeType: "computing"
                      }, "cluster");
                    }}
                  />

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
                                navigate(`/computing/hosts/${host.id}`);
                              }}
                              onContextMenu={(e) => {
                                e.preventDefault();
                                setDatacentersSelected(dataCenter)
                                setClustersSelected(cluster)
                                setHostsSelected(host)
                                setContextMenu({
                                  mouseX: e.clientX,
                                  mouseY: e.clientY,
                                  item: {
                                    ...host,
                                    level: 4,
                                  },
                                  treeType: "computing"
                                }, "host");
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
                                    navigate(`/computing/vms/${vm.id}`);
                                  }}
                                  onContextMenu={(e) => {
                                    e.preventDefault();
                                    setDatacentersSelected(dataCenter)
                                    setClustersSelected(cluster)
                                    setHostsSelected(host)
                                    setVmsSelected(vm)
                                    setContextMenu({
                                      mouseX: e.clientX,
                                      mouseY: e.clientY,
                                      item: {
                                        ...vm,
                                        level: 5,
                                      },
                                      treeType: "computing"
                                    }, "vm");
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
                              navigate(`/computing/vms/${vm.id}`);
                            }}
                            onContextMenu={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setDatacentersSelected(dataCenter)
                              setClustersSelected(cluster)
                              // setHostsSelected(host)
                              setVmsSelected(vm)
                              setContextMenu({
                                mouseX: e.clientX,
                                mouseY: e.clientY,
                                item: {
                                  ...vm,
                                  level: 4,
                                },
                                treeType: "computing"
                              }, "vm");
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
