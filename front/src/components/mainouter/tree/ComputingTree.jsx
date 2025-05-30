import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useGlobal              from "@/hooks/useGlobal";
import useTmi                 from "@/hooks/useTmi";
import useContextMenu         from "@/hooks/useContextMenu";
import {
  rvi16Globe,
  rvi16Wrench, rvi16Refresh, rvi16QuestionMark,

  rvi16Host,
  rvi16Desktop,
  rvi16DataCenter,
  rvi16Cluster,
  rvi16DesktopSleep,
  rvi16Pause,
  status2TreeIcon,
} from "@/components/icons/RutilVmIcons";
import {
  useAllTreeNavigations
} from "@/api/RQHook";
import Logger                 from "@/utils/Logger";
import TreeMenuItem           from "./TreeMenuItem";

/**
 * @name ComputingTree
 * @description computing 메뉴 
 *
 * @returns {JSX.Element} ComputingTree
 */
const ComputingTree = ({}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { contextMenu, setContextMenu } = useContextMenu();
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
  const {
    data: navClusters = []
  } = useAllTreeNavigations("cluster");

  Logger.debug(`ComputingTree ... `)
  return (
    <div id="tmi-computing" className="tmi-g">
      {/* 첫 번째 레벨 (Rutil Manager) */}
      <TreeMenuItem level={1}
        title="Rutil Manager"
        iconDef={rvi16Globe("currentColor")}
        // isSelected={() => /\/rutil-manager$/g.test(location.pathname)}
        isSelected={() => location.pathname.includes("rutil") }
        isNextLevelVisible={secondVisibleComputing()}
        onChevronClick={() => toggleSecondVisibleComputing()}
        onClick={() => navigate("/computing/rutil-manager")}
        onContextMenu={(e) => {
          e.preventDefault();
          setContextMenu({
            mouseX: e.clientX,
            mouseY: e.clientY,
            item: {
            },
            treeType: "computing"
          }, "rutil-manager");
        }}
      />

      {/* 두 번째 레벨 (Data Center) */}
      {secondVisibleComputing() && [...navClusters].map((dc) => {
        const isDataCenterOpen = openDataCentersComputing(dc?.id) || false;
        const hasClusters = [...dc?.clusters]?.length > 0;
        return (
          <div key={dc?.id} className="tmi-g">
            <TreeMenuItem level={2}
              title={dc?.name}
              iconDef={rvi16DataCenter("currentColor")}
              isSelected={() => location.pathname.includes(dc?.id)}
              isNextLevelVisible={isDataCenterOpen}
              isChevronVisible={hasClusters}
              onChevronClick={() => toggleOpenDataCentersComputing(dc?.id)}
              onClick={() => {
                setDatacentersSelected(dc)
                dc?.id && navigate(`/computing/datacenters/${dc?.id}/clusters`);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                setDatacentersSelected(dc)
                setContextMenu({
                  mouseX: e.clientX,
                  mouseY: e.clientY,
                  item: {
                    ...dc,
                    level: 2,
                  },
                  treeType: "computing"
                }, "datacenter");
              }}
            />

            {/* 세 번째 레벨 (Clusters) */}
            {isDataCenterOpen && [...dc.clusters].map((cluster) => {
              const isClusterOpen = openClustersComputing(cluster.id) || false;
              const hasHosts = [...cluster.hosts]?.length > 0;
              return (
                <div key={cluster?.id} className="tmi-g">
                  <TreeMenuItem level={3}
                    title={cluster?.name}
                    iconDef={rvi16Cluster("currentColor")}
                    isSelected={() => location.pathname.includes(cluster?.id)}
                    isNextLevelVisible={isClusterOpen}
                    isChevronVisible={hasHosts}
                    onChevronClick={() => toggleOpenClustersComputing(cluster?.id)}
                    onClick={() => {
                      setDatacentersSelected(dc)
                      setClustersSelected(cluster)
                      cluster?.id && navigate(`/computing/clusters/${cluster?.id}`);
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setDatacentersSelected(dc)
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
                      {[...cluster.hosts]?.map((host) => {
                        const isHostOpen = openHostsComputing(host.id) || false;
                        const hasVMs = [...host.vms]?.length > 0;
                        return (
                          <div key={host.id} className="tmi-g">
                            <TreeMenuItem level={4}
                              title={host.name}
                              iconDef={
                                host?.status === "UNKNOWN" 
                                  ? rvi16QuestionMark("currentColor")
                                  : host?.status === "MAINTENANCE"
                                    ? rvi16Wrench("currentColor")
                                    : host?.status === "PREPARING_FOR_MAINTENANCE" || host?.status === "REBOOT"
                                      ? rvi16Refresh("currentColor") // TODO: 새로 디자인 된 아이콘 추가 (호스트아이콘 우측하단 및 refresh 아이콘 배치, 이름 rvi16HostRefresh)
                                      : rvi16Host("currentColor")
                              }
                              isSelected={() => location.pathname.includes(host?.id)}
                              isNextLevelVisible={isHostOpen}
                              isChevronVisible={hasVMs}
                              onChevronClick={() => toggleOpenHostsComputing(host?.id)}
                              onClick={() => {
                                setDatacentersSelected(dc)
                                setClustersSelected(cluster)
                                host?.id && navigate(`/computing/hosts/${host.id}`);
                              }}
                              onContextMenu={(e) => {
                                e.preventDefault();
                                setDatacentersSelected(dc)
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
                            {isHostOpen && [...host.vms]?.map((vm) => (
                              <div key={vm?.id} className="tmi-g">
                                <TreeMenuItem level={5}
                                  title={vm?.name}
                                  iconDef={status2TreeIcon("vm", vm?.status)}
                                  // TODO: host에 붙어있지만 상태가 이상한 경우에 대한 조건처리
                                  isSelected={() => location.pathname.includes(vm?.id)}
                                  isNextLevelVisible={isHostOpen}
                                  isChevronVisible={false}
                                  onChevronClick={()=>{}}
                                  onClick={() => {
                                    setDatacentersSelected(dc)
                                    setClustersSelected(cluster)
                                    vm?.id && navigate(`/computing/vms/${vm?.id}`);
                                  }}
                                  onContextMenu={(e) => {
                                    e.preventDefault();
                                    setDatacentersSelected(dc)
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
                      {[...cluster.vmDowns]?.map((vm) => (
                        <div key={vm?.id} className="tmi-g">
                          <TreeMenuItem level={4}
                            title={vm?.name}
                            iconDef={vm?.status === "SUSPENDED" ? rvi16Pause : rvi16DesktopSleep("currentColor")}
                            isSelected={() => location.pathname.includes(vm?.id)}
                            isNextLevelVisible={false}
                            isChevronVisible={false}
                            onChevronClick={()=>{}}
                            onClick={() => {
                              setDatacentersSelected(dc)
                              setClustersSelected(cluster)
                              vm?.id && navigate(`/computing/vms/${vm?.id}`);
                            }}
                            onContextMenu={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setDatacentersSelected(dc)
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
