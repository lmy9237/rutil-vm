import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAllTreeNavigations } from "../../../api/RQHook";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronRight,
  faBuilding,
  faLayerGroup,
  faUser,
  faEarthAmericas,
  faMicrochip,
  faCircle
} from "@fortawesome/free-solid-svg-icons";

const ComputingTree = ({ selectedDiv, setSelectedDiv, getPaddingLeft }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ API 호출 (컴퓨팅 데이터)
  const { data: navClusters } = useAllTreeNavigations("cluster");

  // ✅ 상태 관리
  const [isSecondVisible, setIsSecondVisible] = useState(
    JSON.parse(localStorage.getItem("isSecondVisible")) || false
  );
  const [openComputingDataCenters, setOpenComputingDataCenters] = useState(
    () => JSON.parse(localStorage.getItem("openComputingDataCenters")) || {}
  );
  const [openClusters, setOpenClusters] = useState(
    JSON.parse(localStorage.getItem("openClusters")) || {}
  );
  const [openHosts, setOpenHosts] = useState(
    JSON.parse(localStorage.getItem("openHosts")) || {}
  );

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
    localStorage.setItem("openComputingDataCenters", JSON.stringify(openComputingDataCenters));
    localStorage.setItem("openClusters", JSON.stringify(openClusters));
    localStorage.setItem("openHosts", JSON.stringify(openHosts));
  }, [isSecondVisible, openComputingDataCenters, openClusters, openHosts]);

  const toggleState = (id, setState) => {
    setState((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getBackgroundColor = (id) => (location.pathname.includes(id) ? "rgb(218, 236, 245)" : "");

  return (
  <div id="virtual_machine_chart">
          {/* 첫 번째 레벨 (Rutil Manager) */}
          <div className="aside-popup-content"
            id="aside_popup_first"
            style={{ backgroundColor: getBackgroundColor("rutil-manager") }}
            onClick={() => {
              if (selectedDiv !== "rutil-manager") {
                setSelectedDiv("rutil-manager");
                navigate("/computing/rutil-manager");
              }
            }}
          >
            <FontAwesomeIcon
              style={{
                fontSize: "12px",
                marginRight: "0.04rem",
              }}
              icon={isSecondVisible ? faChevronDown : faChevronRight}
              onClick={(e) => {
                e.stopPropagation();
                setIsSecondVisible(!isSecondVisible); // Only toggles on icon click
              }}
              fixedWidth
            />
            <FontAwesomeIcon icon={faBuilding} fixedWidth />
            <span>Rutil manager</span>
          </div>

          {/* 두 번째 레벨 (Data Center) */}
          {isSecondVisible &&
            navClusters &&
            navClusters.map((dataCenter) => {
              const isDataCenterOpen =
                openComputingDataCenters[dataCenter.id] || false;
                const hasClusters =
                  Array.isArray(dataCenter.clusters) &&
                  dataCenter.clusters.length > 0;
                return (
                  <div key={dataCenter.id}>
                    <div
                      className="aside-popup-second-content"
                      style={{
                        backgroundColor: getBackgroundColor(dataCenter.id),
                        paddingLeft: getPaddingLeft(hasClusters, "42px", "26px"), // ✅ 적용
                      }}
                      onClick={() => {
                        setSelectedDiv(dataCenter.id);
                        navigate(`/computing/datacenters/${dataCenter.id}/clusters`);
                      }}
                    >
                      {hasClusters && (
                        <FontAwesomeIcon
                          style={{
                            fontSize: "12px",
                            marginRight: "0.04rem",
                          }}
                          icon={isDataCenterOpen ? faChevronDown : faChevronRight}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleComputingDataCenter(dataCenter.id);
                          }}
                          fixedWidth
                        />
                      )}
                      <FontAwesomeIcon icon={faLayerGroup} fixedWidth />
                      <span>{dataCenter.name}</span>
                    </div>

                {/* 세 번째 레벨 (Clusters) */}
                {isDataCenterOpen && Array.isArray(dataCenter.clusters) && dataCenter.clusters.map((cluster) => {
                  const isClusterOpen = openClusters[cluster.id] || false;
                  const hasHosts = Array.isArray(cluster.hosts) && cluster.hosts.length > 0;
                  return (
                    <div key={cluster.id}>
                      <div
                          className="aside-popup-third-content"
                          style={{
                              backgroundColor: getBackgroundColor(cluster.id),
                              paddingLeft: getPaddingLeft(hasHosts, "59px", "43px"),
                          }}
                          onClick={() => {
                              setSelectedDiv(cluster.id);
                              navigate(`/computing/clusters/${cluster.id}`);
                          }}
                      >
                          {hasHosts && (
                              <FontAwesomeIcon
                                  style={{ fontSize: '12px', marginRight: '0.04rem' }}
                                  icon={isClusterOpen ? faChevronDown : faChevronRight}
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      toggleCluster(cluster.id);
                                  }}
                                  fixedWidth
                              />
                          )}
                          <FontAwesomeIcon icon={faEarthAmericas} fixedWidth />
                          <span>{cluster.name}</span>
                      </div>
                      {/* 네 번째 레벨 (Hosts & VM Downs) */}
                      {isClusterOpen && (
                        <>
                          {/* Hosts */}
                          {Array.isArray(cluster.hosts) && cluster.hosts.map((host) => {
                            const isHostOpen = openHosts[host.id] || false;
                            const hasVMs = Array.isArray(host.vms) && host.vms.length > 0;
                            return (
                              <div key={host.id}>
                                <div
                                  className="aside-popup-fourth-content"
                                  style={{
                                    backgroundColor: getBackgroundColor(host.id),
                                    paddingLeft: getPaddingLeft(hasVMs, "75px", "59px"),
                                  }}
                                  onClick={() => {
                                    setSelectedDiv(host.id);
                                    navigate(`/computing/hosts/${host.id}`);
                                  }}
                                >
                                  {hasVMs && (
                                    <FontAwesomeIcon
                                      style={{ fontSize: '12px', marginRight: '0.04rem'}}
                                      icon={isHostOpen ? faChevronDown : faChevronRight}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleHost(host.id);
                                      }}
                                      fixedWidth
                                    />
                                  )}
                                  <FontAwesomeIcon icon={faUser} fixedWidth />
                                  <span>{host.name}</span>
                                </div>

                                {/* 다섯 번째 레벨 (VMs under Host) */}
                                {isHostOpen && Array.isArray(host.vms) && host.vms.map((vm) => (
                                  <div
                                    key={vm.id}
                                    className="aside_popup_last_content"
                                    style={{
                                      backgroundColor: getBackgroundColor(vm.id),
                                      paddingLeft: "90px",
                                    }}
                                    onClick={() => {
                                      setSelectedDiv(vm.id);
                                      navigate(`/computing/vms/${vm.id}`);
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faMicrochip} fixedWidth />
                                    <span>{vm.name}</span>
                                  </div>
                                ))}
                              </div>
                            );
                          })}

                          {/* VM(중지) */}
                          {Array.isArray(cluster.vmDowns) && cluster.vmDowns.map((vm) => (
                            <div
                              key={vm.id}
                              className="aside-popup-fourth-content"
                              style={{
                                backgroundColor: getBackgroundColor(vm.id),
                                paddingLeft: "75px",
                              }}
                              onClick={() => {
                                setSelectedDiv(vm.id);
                                navigate(`/computing/vms/${vm.id}`);
                              }}
                            >
                             <div className="flex items-center">
                              <span className="vm-icon">
                                <FontAwesomeIcon icon={faMicrochip} fixedWidth />
                                <div className="vm-down-icon-container">
                                  <FontAwesomeIcon icon={faCircle} fixedWidth className="vm-down-icon" />
                                </div>
                              </span>
                              <span>{vm.name}</span>
                            </div>

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
