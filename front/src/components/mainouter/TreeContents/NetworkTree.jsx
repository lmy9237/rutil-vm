import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAllTreeNavigations } from "../../../api/RQHook";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronRight,
  faBuilding,
  faLayerGroup,
  faFileEdit,
} from "@fortawesome/free-solid-svg-icons";

const NetworkTree = ({ selectedDiv, setSelectedDiv,getBackgroundColor, getPaddingLeft }) => {
  const navigate = useNavigate();

  const { data: navNetworks } = useAllTreeNavigations("network");

  const [openDataCenters, setOpenDataCenters] = useState(
    JSON.parse(localStorage.getItem("openDataCenters")) || {}
  );
    const [openNetworkDataCenters, setOpenNetworkDataCenters] = useState(
        () => JSON.parse(localStorage.getItem("openNetworkDataCenters")) || {}
    );
      const toggleNetworkDataCenter = (dataCenterId) => {
        setOpenNetworkDataCenters((prevState) => ({
          ...prevState,
          [dataCenterId]: !prevState[dataCenterId],
        }));
      };
  return (
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
  );
};

export default NetworkTree;
