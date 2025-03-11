import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAllTreeNavigations } from "../../../api/RQHook";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faLayerGroup,
  faCloud,
  faChevronDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const StorageTree = ({ selectedDiv, setSelectedDiv ,getBackgroundColor, getPaddingLeft}) => {
  const navigate = useNavigate();
  const [isSecondVisible, setIsSecondVisible] = useState(
    JSON.parse(localStorage.getItem("isSecondVisible")) || false
  );
  const { data: navStorageDomains } = useAllTreeNavigations("storagedomain");
  const [openDomains, setOpenDomains] = useState(
    JSON.parse(localStorage.getItem("openDomains")) || {}
  );
  const toggleDomain = (domainId) => {
    setOpenDomains((prevState) => ({
      ...prevState,
      [domainId]: !prevState[domainId],
    }));
  };
  const toggleDataCenter = (dataCenterId) => {
    setOpenDataCenters((prevState) => ({
      ...prevState,
      [dataCenterId]: !prevState[dataCenterId],
    }));
  };
    const [openDataCenters, setOpenDataCenters] = useState(
      JSON.parse(localStorage.getItem("openDataCenters")) || {}
    );
  return (
      < div id="storage_chart">
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
                            //   onContextMenu={(e) => {
                            //     e.preventDefault(); // 기본 컨텍스트 메뉴 비활성화
                            //     setContextMenuVisible(true);
                            //     setContextMenuPosition({
                            //       x: e.pageX,
                            //       y: e.pageY,
                            //     });
                            //     setContextMenuTarget(domain.id); // 우클릭한 요소의 ID 저장
                            //   }}
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
  );
};

export default StorageTree;
