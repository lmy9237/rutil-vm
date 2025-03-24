import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TreeMenuItem from "./TreeMenuItem";
import {
  rvi16Globe,
  rvi16Host,
  rvi16Desktop,
  rvi16DesktopFlag,
  rvi16DataCenter,
  rvi16Cluster,
  rvi16DesktopSleep,
} from "../../icons/RutilVmIcons";
import { useAllTreeNavigations } from "../../../api/RQHook";

const ComputingTree = ({ selectedDiv, setSelectedDiv, getPaddingLeft }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ API 호출 (컴퓨팅 트리 데이터)
  const { data: navClusters } = useAllTreeNavigations("cluster");

  // ✅ 상태 관리
  const [isSecondVisible, setIsSecondVisible] = useState(JSON.parse(localStorage.getItem("isSecondVisible")) || false);
  const [openComputingDataCenters, setOpenComputingDataCenters] = useState(JSON.parse(localStorage.getItem("openComputingDataCenters")) || {});
  const [openClusters, setOpenClusters] = useState(JSON.parse(localStorage.getItem("openClusters")) || {});
  const [openHosts, setOpenHosts] = useState(JSON.parse(localStorage.getItem("openHosts")) || {});

  const toggleComputingDataCenter = (dataCenterId) => {
    setOpenComputingDataCenters((prevState) => ({
      ...prevState,
      [dataCenterId]: !prevState[dataCenterId],
    }));
  };
  const toggleHost = (hostId) => {
    setOpenHosts((prevState) => ({
      ...prevState,
      [hostId]: !prevState[hostId],
    }));
  };
  const toggleCluster = (clusterId) => {
    setOpenClusters((prevState) => ({
      ...prevState,
      [clusterId]: !prevState[clusterId],
    }));
  };

  useEffect(() => {
    localStorage.setItem("isSecondVisible", JSON.stringify(isSecondVisible));
    localStorage.setItem(
      "openComputingDataCenters",
      JSON.stringify(openComputingDataCenters)
    );
    localStorage.setItem("openClusters", JSON.stringify(openClusters));
    localStorage.setItem("openHosts", JSON.stringify(openHosts));
  }, [isSecondVisible, openComputingDataCenters, openClusters, openHosts]);

  const toggleState = (id, setState) => {
    setState((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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
        isNextLevelVisible={isSecondVisible}
        onChevronClick={() => setIsSecondVisible(!isSecondVisible)}
        onClick={() => {
          setSelectedDiv("rutil-manager");
          navigate("/computing/rutil-manager");
        }}
      />

      {/* 두 번째 레벨 (Data Center) */}
      {isSecondVisible && navClusters && navClusters.map((dataCenter) => {
        const isDataCenterOpen = openComputingDataCenters[dataCenter.id] || false;
        const hasClusters = Array.isArray(dataCenter.clusters) && dataCenter.clusters.length > 0;
        return (
          <div key={dataCenter.id} className="tmi-g">
            <TreeMenuItem level={2}
              title={dataCenter.name}
              iconDef={rvi16DataCenter}
              isSelected={() => location.pathname.includes(dataCenter.id)}
              isNextLevelVisible={isDataCenterOpen}
              isChevronVisible={hasClusters}
              onChevronClick={() => toggleComputingDataCenter(dataCenter.id)}
              onClick={() => {
                setSelectedDiv(dataCenter.id);
                navigate(`/computing/datacenters/${dataCenter.id}/clusters`);
              }}
            />
            {/* 세 번째 레벨 (Clusters) */}
            {isDataCenterOpen && Array.isArray(dataCenter.clusters) && dataCenter.clusters.map((cluster) => {
              const isClusterOpen = openClusters[cluster.id] || false;
              const hasHosts = Array.isArray(cluster.hosts) && cluster.hosts.length > 0;
              return (
                <div key={cluster.id} className="tmi-g">
                  <TreeMenuItem level={3}
                    title={cluster.name}
                    iconDef={rvi16Cluster}
                    isSelected={() => location.pathname.includes(cluster.id)}
                    isNextLevelVisible={isClusterOpen}
                    isChevronVisible={hasHosts}
                    onChevronClick={() => toggleCluster(cluster.id)}
                    onClick={() => {
                      setSelectedDiv(cluster.id);
                      navigate(`/computing/clusters/${cluster.id}`);
                    }}
                  />
                  {/* 네 번째 레벨 (Hosts & VM Downs) */}
                  {isClusterOpen && (
                    <>
                      {/* Hosts */}
                      {Array.isArray(cluster.hosts) && cluster.hosts.map((host) => {
                        const isHostOpen = openHosts[host.id] || false;
                        const hasVMs = Array.isArray(host.vms) && host.vms.length > 0;
                        return (
                          <div key={host.id} className="tmi-g">
                            <TreeMenuItem level={4}
                              title={host.name}
                              iconDef={rvi16Host}
                              isSelected={() => location.pathname.includes(host.id)}
                              isNextLevelVisible={isHostOpen}
                              isChevronVisible={hasVMs}
                              onChevronClick={() => toggleHost(host.id)}
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
