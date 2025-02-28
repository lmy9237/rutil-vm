import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown, faTimes } from "@fortawesome/free-solid-svg-icons";
import TablesOuter from "../../../components/table/TablesOuter";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import HostNetworkModal from "../../../components/modal/network/HostNetworkModal";
import { useNetworkInterfaceFromHost } from "../../../api/RQHook";
import { renderUpDownStatusIcon } from "../../../components/Icon";
import { checkZeroSizeToMbps } from "../../../util";

/**
 * @name HostNics
 * @description 호스트에 종속한 네트워크 인터페이스
 * (/computing/hosts/<hostId>/nics)
 */
const HostNics = ({ hostId }) => {
  const {
    data: nics = [],
    isLoading: isNicsLoading,
    isError: isNicsError,
    isSuccess: isNicsSuccess,
  } = useNetworkInterfaceFromHost(hostId, (e) => ({
    ...e,
    icon: renderUpDownStatusIcon(e?.status),
    ipv4: e?.ip?.address || "없음",
    ipv6: e?.ipv6?.address || "없음",
    macAddress: e?.macAddress || "정보없음",
    mtu: e?.mtu || "정보없음",
    speed: checkZeroSizeToMbps(e?.speed),
    rxSpeed: checkZeroSizeToMbps(e?.rxSpeed),
    txSpeed: checkZeroSizeToMbps(e?.txSpeed),
    rxTotalSpeed: e?.rxTotalSpeed.toLocaleString(),
    txTotalSpeed: e?.txTotalSpeed.toLocaleString(),
    pkts: `${e?.rxTotalError} Pkts` || "1 Pkts",
    status: e?.status || "UNKNOWN",
    bondingVo: {
      ...e?.bondingVo,
      slaves: e?.bondingVo?.slaves?.map((slave) => ({
        id: slave.id,
        name: slave.name,
      })),
    },
  }));

  function convertBpsToMbps(bytes) {
    return (bytes / (1024 * 1024 * 1024)).toFixed(0);
  }

  const [visibleBoxes, setVisibleBoxes] = useState([]);
  const [activeTable, setActiveTable] = useState({});
  const [activeButton, setActiveButton] = useState({});
  const [isExpandedAll, setIsExpandedAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
    setActiveTable(nics.reduce((acc, _, index) => ({ ...acc, [index]: "NETWORK_FROM_HOST" }), {}));
    setActiveButton(nics.reduce((acc, _, index) => ({ ...acc, [index]: "NETWORK_FROM_HOST" }), {}));
  }, [nics]);

  const toggleHiddenBox = (index) => {
    setVisibleBoxes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const toggleAllBoxes = () => {
    if (visibleBoxes.length === nics.length) {
      setVisibleBoxes([]);
      setIsExpandedAll(false);
    } else {
      setVisibleBoxes(nics.map((_, index) => index));
      setIsExpandedAll(true);
    }
  };

  const switchTable = (index, tableType) => {
    setActiveTable((prev) => ({ ...prev, [index]: tableType }));
    setActiveButton((prev) => ({ ...prev, [index]: tableType }));
  };

  return (
    <>
      <div className="header-right-btns">
        <button>VF 보기</button>
        <button onClick={toggleAllBoxes}>
          {isExpandedAll ? "모두 숨기기" : "모두 확장"}
        </button>
        <button onClick={() => setIsModalOpen(true)}>호스트 네트워크 설정</button>
        {/* <button>네트워크 설정 저장</button>
        <button>모든 네트워크 동기화</button> */}
      </div>

      <div className="host-nic-table-outer">
        {nics.map((data, index) => (
          <div key={index} className="host-network-boxs" style={{ marginBottom: "0.2rem" }}>
            <div className="host_network_firstbox" onClick={() => toggleHiddenBox(index)}>
              <div className="section-table-outer">
                <TablesOuter
                  isLoading={isNicsLoading} isError={isNicsError} isSuccess={isNicsSuccess}
                  data={[data]}
                  columns={[{ header: "", accessor: "icon", width: "5%" }, ...TableColumnsInfo.NETWORK_INTERFACE_FROM_HOST]}
                  onRowClick={() => console.log("Row clicked")}
                />
              </div>
            </div>

            {visibleBoxes.includes(index) && (
              <div className="host-network-hiddenbox flex">
                <div className="h-network-change-table">
                  <button
                    onClick={() => switchTable(index, "NETWORK_FROM_HOST")}
                    className={`h-icon-btn ${activeButton[index] === "NETWORK_FROM_HOST" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                  >
                    <FontAwesomeIcon icon={faCrown} fixedWidth style={{ fontSize: "0.3rem" }} />
                  </button>

                  {data.bondingVo?.slaves?.length > 0 && (
                    <button
                      onClick={() => switchTable(index, "NETWORK_FROM_HOST_SLAVE")}
                      className={`h-icon-btn ${activeButton[index] === "NETWORK_FROM_HOST_SLAVE" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    >
                      <FontAwesomeIcon icon={faTimes} fixedWidth style={{ fontSize: "15px" }} />
                    </button>
                  )}
                </div>

                <div className="section-table-outer">
                  {activeTable[index] === "NETWORK_FROM_HOST" && (
                    <TablesOuter
                      isLoading={isNicsLoading} isError={isNicsError} isSuccess={isNicsSuccess}
                      columns={TableColumnsInfo.NETWORK_FROM_HOST}
                      data={[data]}
                      onRowClick={() => console.log("Row clicked")}
                    />
                  )}
                  {activeTable[index] === "NETWORK_FROM_HOST_SLAVE" && data.bondingVo?.slaves && (
                    <TablesOuter
                      isLoading={isNicsLoading} isError={isNicsError} isSuccess={isNicsSuccess}
                      columns={TableColumnsInfo.NETWORK_FROM_HOST_SLAVE}
                      data={data.bondingVo.slaves}
                      onRowClick={() => console.log("Row clicked")}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <HostNetworkModal 
        isOpen={isModalOpen} 
        nicData={nics} 
        hostId={hostId} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default HostNics;
