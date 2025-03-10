import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAllTreeNavigations } from "../../api/RQHook"; // ✅ API 호출 추가
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronRight,
  faBuilding,
  faLayerGroup,
  faEarthAmericas,
  faUser,
  faMicrochip,
  faCloud,
  faFileEdit,
} from "@fortawesome/free-solid-svg-icons";

const SidebarTree = ({ selected }) => {
  const navigate = useNavigate();
  const location = useLocation();

    // 📌 마지막 선택한 섹션 유지
    const [lastSelected, setLastSelected] = useState(
      () => localStorage.getItem("lastSelected") || "computing"
    );
  
    useEffect(() => {
      const savedLastSelected = localStorage.getItem("lastSelected");
      if (savedLastSelected) {
        setLastSelected(savedLastSelected);
      }
    }, [selected]);
  
    // 📌 대시보드, 이벤트, 설정이면 lastSelected 값으로 변경
    const sectionToRender = ["dashboard", "event", "settings"].includes(selected) ? lastSelected : selected;
  // ✅ API 호출 (컴퓨팅 / 네트워크 / 스토리지 데이터 가져오기)
  const { data: navClusters } = useAllTreeNavigations("cluster");
  const { data: navNetworks } = useAllTreeNavigations("network");
  const { data: navStorageDomains } = useAllTreeNavigations("storagedomain");

  // ✅ 상태 관리
  const [selectedDiv, setSelectedDiv] = useState(null);
  const [isSecondVisible, setIsSecondVisible] = useState(
    JSON.parse(localStorage.getItem("isSecondVisible")) || false
  );

  const [openDataCenters, setOpenDataCenters] = useState(
    JSON.parse(localStorage.getItem("openDataCenters")) || {}
  );
  const [openClusters, setOpenClusters] = useState(
    JSON.parse(localStorage.getItem("openClusters")) || {}
  );
  const [openHosts, setOpenHosts] = useState(
    JSON.parse(localStorage.getItem("openHosts")) || {}
  );
  const [openDomains, setOpenDomains] = useState(
    JSON.parse(localStorage.getItem("openDomains")) || {}
  );
  const [openNetworks, setOpenNetworks] = useState(
    JSON.parse(localStorage.getItem("openNetworks")) || {}
  );
  const [openNetworkDataCenters, setOpenNetworkDataCenters] = useState(
    () => JSON.parse(localStorage.getItem("openNetworkDataCenters")) || {}
  );
    const [openComputingDataCenters, setOpenComputingDataCenters] = useState(
      () => JSON.parse(localStorage.getItem("openComputingDataCenters")) || {}
    );
    // 상태가 변경될 때마다 localStorage에 저장
    useEffect(() => {
      localStorage.setItem("isSecondVisible", JSON.stringify(isSecondVisible));
    }, [isSecondVisible]);
  
    useEffect(() => {
      localStorage.setItem("openDataCenters", JSON.stringify(openDataCenters));
    }, [openDataCenters]);
  
    useEffect(() => {
      localStorage.setItem("openClusters", JSON.stringify(openClusters));
    }, [openClusters]);
  
    useEffect(() => {
      localStorage.setItem("openHosts", JSON.stringify(openHosts));
    }, [openHosts]);
  
    useEffect(() => {
      localStorage.setItem("openDomains", JSON.stringify(openDomains));
    }, [openDomains]);
  
    useEffect(() => {
      localStorage.setItem("openNetworks", JSON.stringify(openNetworks));
    }, [openNetworks]);
    // 열림/닫힘 상태 변경 함수
    const toggleCluster = (clusterId) => {
      setOpenClusters((prevState) => ({
        ...prevState,
        [clusterId]: !prevState[clusterId],
      }));
    };
  
    const toggleHost = (hostId) => {
      setOpenHosts((prevState) => ({
        ...prevState,
        [hostId]: !prevState[hostId],
      }));
    };
    const toggleComputingDataCenter = (dataCenterId) => {
      setOpenComputingDataCenters((prevState) => ({
        ...prevState,
        [dataCenterId]: !prevState[dataCenterId],
      }));
    };
    const toggleDataCenter = (dataCenterId) => {
      setOpenDataCenters((prevState) => ({
        ...prevState,
        [dataCenterId]: !prevState[dataCenterId],
      }));
    };
  const toggleNetworkDataCenter = (dataCenterId) => {
    setOpenNetworkDataCenters((prevState) => ({
      ...prevState,
      [dataCenterId]: !prevState[dataCenterId],
    }));
  };
  const toggleDomain = (domainId) => {
    setOpenDomains((prevState) => ({
      ...prevState,
      [domainId]: !prevState[domainId],
    }));
  };

  useEffect(() => {
    localStorage.setItem("isSecondVisible", JSON.stringify(isSecondVisible));
    localStorage.setItem("openDataCenters", JSON.stringify(openDataCenters));
    localStorage.setItem("openClusters", JSON.stringify(openClusters));
    localStorage.setItem("openHosts", JSON.stringify(openHosts));
    localStorage.setItem("openDomains", JSON.stringify(openDomains));
    localStorage.setItem("openNetworks", JSON.stringify(openNetworks));
  }, [isSecondVisible, openDataCenters, openClusters, openHosts, openDomains, openNetworks]);

  const toggleState = (id, setState) => {
    setState((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getBackgroundColor = (id) => {
    return location.pathname.includes(id) ? "rgb(218, 236, 245)" : "";
  };

  const getPaddingLeft = (hasChildren, basePadding = "1rem", extraPadding = "0.6rem") => {
    return hasChildren ? extraPadding : basePadding;
  };

  /*우클릭 */
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuTarget, setContextMenuTarget] = useState(null);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const handleMainClick = () => {
    setContextMenuVisible(false);
    setContextMenuTarget(null);
  };
  
  return (
    <div className="aside-popup">
      {/* ✅ 가상머신 섹션 */}
      {sectionToRender === "computing" && (
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

                          {/* 네 번째 레벨 (Hosts) */}
                          {isClusterOpen && Array.isArray(cluster.hosts) && cluster.hosts.map((host) => {
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

                                      {/* 다섯 번째 레벨 (VMs) */}
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
    </div>
                      );
                  })}
              </div>
            );
          })}
        </div>
      )}

      {/* ✅ 네트워크 섹션 */}
      {sectionToRender === "network" && (
        <div id="network_chart">
            {/* 첫 번째 레벨 (Rutil Manager) */}
            <div
              className="aside-popup-content"
              id="aside_popup_first"
              style={{ backgroundColor: getBackgroundColor("rutil-manager") }}
              onClick={() => {
                if (selectedDiv !== "rutil-manager") {
                setSelectedDiv("rutil-manager");
                navigate("/networks/rutil-manager");
                }
              }}
            >
              <FontAwesomeIcon
                style={{
                  fontSize: "12px",
                  marginRight: "0.04rem",
                }}
                icon={openDataCenters.network ? faChevronDown : faChevronRight}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDataCenters((prev) => ({
                    ...prev,
                    network: !prev.network,
                  })); 
                }}
                fixedWidth
              />
              <FontAwesomeIcon icon={faBuilding} fixedWidth />
              <span>Rutil manager</span>
            </div>

            {/* 두 번째 레벨 (Data Center) */}
            {navNetworks &&
              navNetworks.map((dataCenter) => {
                const isDataCenterOpen =
                  openNetworkDataCenters[dataCenter.id] || false;
                const hasNetworks =
                  Array.isArray(dataCenter.networks) &&
                  dataCenter.networks.length > 0;

                return (
                  <div key={dataCenter.id}>
                    <div
                      className="aside-popup-second-content"
                      style={{
                        backgroundColor: getBackgroundColor(dataCenter.id),
                        paddingLeft: getPaddingLeft(hasNetworks, "42px", "26px"), 
                        
                      }}
                      onClick={() => {
                        setSelectedDiv(dataCenter.id);
                        navigate(
                          `/networks/datacenters/${dataCenter.id}/clusters`
                        );
                      }}
                    >
                      {hasNetworks && (
                        <FontAwesomeIcon
                          style={{
                            fontSize: "12px",
                            marginRight: "0.04rem",
                          }}
                          icon={
                            isDataCenterOpen ? faChevronDown : faChevronRight
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleNetworkDataCenter(dataCenter.id);
                          }}
                          fixedWidth
                        />
                      )}
                      <FontAwesomeIcon icon={faLayerGroup} fixedWidth />
                      <span>{dataCenter.name}</span>
                    </div>

                    {/* 세 번째 레벨 */}
                    {isDataCenterOpen &&
                      dataCenter.networks.map((network) => (
                        <div
                          key={network.id}
                          className="aside-popup-third-content"
                          style={{
                            backgroundColor: getBackgroundColor(network.id),
                          }}
                          onClick={() => {
                            setSelectedDiv(network.id);
                            navigate(`/networks/${network.id}`);
                          }}
                        >
                          <FontAwesomeIcon icon={faFileEdit} fixedWidth/>
                          <span>{network.name}</span>
                        </div>
                      ))}
                  </div>
                );
              })}
        </div>
      )}

      {/* ✅ 스토리지 섹션 */}
      {sectionToRender === "storage" && (
 <      div id="storage_chart">
            {/* 첫 번째 레벨 (Rutil Manager) */}
            <div
              className="aside-popup-content"
              id="aside_popup_first"
              style={{ backgroundColor: getBackgroundColor("rutil-manager") }}
              onClick={() => {
                if (selectedDiv !== "rutil-manager") {
                  setSelectedDiv("rutil-manager");
                  navigate("/storages/rutil-manager");
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
                  setIsSecondVisible(!isSecondVisible); // Toggle only on icon click
                }}
                fixedWidth
              />
              <FontAwesomeIcon icon={faBuilding} fixedWidth />
              <span>Rutil manager</span>
            </div>

            {/* 두 번째 레벨 (Data Center) */}
            {isSecondVisible &&
              navStorageDomains &&
              navStorageDomains.map((dataCenter) => {
                const isDataCenterOpen =
                  openDataCenters[dataCenter.id] || false;
                const hasDomains =
                  Array.isArray(dataCenter.storageDomains) &&
                  dataCenter.storageDomains.length > 0;
                return (
                  <div key={dataCenter.id}>
                    <div
                      className="aside-popup-second-content"
                      style={{
                        backgroundColor: getBackgroundColor(dataCenter.id),
                        paddingLeft: getPaddingLeft(hasDomains, "42px", "26px"), 
                      }}
                      onClick={() => {
                        setSelectedDiv(dataCenter.id);
                        navigate(
                          `/storages/datacenters/${dataCenter.id}/clusters`
                        );
                      }}
                    >
                      {hasDomains && (
                        <FontAwesomeIcon
                          style={{
                            fontSize: "12px",
                            marginRight: "0.04rem",
                          }}
                          icon={
                            isDataCenterOpen ? faChevronDown : faChevronRight
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDataCenter(dataCenter.id);
                          }}
                          fixedWidth
                        />
                      )}
                      <FontAwesomeIcon icon={faLayerGroup} fixedWidth />
                      <span>{dataCenter.name}</span>
                    </div>

                    {/* 세 번째 레벨 (Storage Domains) */}
                    {isDataCenterOpen &&
                      Array.isArray(dataCenter.storageDomains) &&
                      dataCenter.storageDomains.map((domain) => {
                        const isDomainOpen = openDomains[domain.id] || false;
                        const hasDisks =
                          Array.isArray(domain.disks) &&
                          domain.disks.length > 0;
                        return (
                          <div key={domain.id}>
                            <div
                              className="aside-popup-third-content"
                              style={{
                                backgroundColor: getBackgroundColor(domain.id),
                              }}
                              onClick={() => {
                                setSelectedDiv(domain.id);
                                navigate(`/storages/domains/${domain.id}`);
                              }}
                              onContextMenu={(e) => {
                                e.preventDefault(); // 기본 컨텍스트 메뉴 비활성화
                                setContextMenuVisible(true);
                                setContextMenuPosition({
                                  x: e.pageX,
                                  y: e.pageY,
                                });
                                setContextMenuTarget(domain.id); // 우클릭한 요소의 ID 저장
                              }}
                            >
                              {hasDisks && (
                                <FontAwesomeIcon
                                  style={{
                                    fontSize: "0.3rem",
                                    marginRight: "0.04rem",
                                  }}
                                  icon={
                                    isDomainOpen
                                      ? faChevronDown
                                      : faChevronRight
                                  }
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleDomain(domain.id);
                                  }}
                                  fixedWidth
                                />
                              )}
                              <FontAwesomeIcon icon={faCloud} fixedWidth />
                              <span>{domain.name}</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                );
              })}
        </div>
      )}

      
    </div>
  );
};

export default SidebarTree;
