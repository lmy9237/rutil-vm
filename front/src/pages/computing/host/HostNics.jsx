import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown, faTimes, faArrowCircleUp, faArrowCircleDown } from "@fortawesome/free-solid-svg-icons";
import TablesOuter from "../../../components/table/TablesOuter";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import NetworkHostModal from "../../../components/modal/network/NetworkHostModal";
import { useNetworkInterfaceFromHost } from "../../../api/RQHook";

/**
 * @name HostNics
 * @description 호스트에 종속한 네트워크 인터페이스
 * (/computing/hosts/<hostId>/nics)
 * 
 * @param {string} hostId 호스트 ID
 * @returns
 * 
 * @see NetworkHostModal
 */
const HostNics = ({ hostId }) => {
  const {
    data: nics = [],
    isLoading: isNicsLoading,
    isError: isNicsError,
    isSuccess: isNicsSuccess,
  } = useNetworkInterfaceFromHost(hostId, (e) => ({
    ...e,
    id: e?.id,
    name: e?.name,
    bridged: e?.bridged,
    ipv4: e?.ip?.address || "없음",
    ipv6: e?.ipv6?.address || "없음",
    macAddress: e?.macAddress || "정보없음",
    mtu: e?.mtu || "정보없음",
    speed: e?.speed ? `${e.speed / 1000000}` : "정보없음",
    status: e?.status || "UNKNOWN",
    icon: e?.status === "UP"
      ? <FontAwesomeIcon icon={faArrowCircleUp} style={{ color: "green" }} />
      : <FontAwesomeIcon icon={faArrowCircleDown} style={{ color: "red" }} />,
    bondingVo: {
      ...e?.bondingVo,
      slaves: e?.bondingVo?.slaves?.map((slave) => ({
        id: slave.id,
        name: slave.name,
        macAddress: slave.macAddress || "정보없음",
        speed: slave.speed ? `${slave.speed / 1000000} Mbps` : "정보없음",
        rxSpeed: slave.rxSpeed ? `${slave.rxSpeed / 1000000} Mbps` : "정보없음",
        txSpeed: slave.txSpeed ? `${slave.txSpeed / 1000000} Mbps` : "정보없음 ",
        rxTotalSpeed: slave.rxTotalSpeed ? `${slave.rxTotalSpeed / (1024 ** 3)} GB` : "정보없음",
        txTotalSpeed: slave.txTotalSpeed ? `${slave.txTotalSpeed / (1024 ** 3)} GB` : "정보없음",
        txTotalError: slave.txTotalError || 0,
      })),
    },
    rxSpeed: e?.rxSpeed ? `${e?.rxSpeed / 1000000}` : "정보없음",
    txSpeed: e?.txSpeed ? `${e?.txSpeed / 1000000}` : "정보없음",
    rxTotalSpeed: e?.rxTotalSpeed
      ? e.rxTotalSpeed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      : "정보없음",
    txTotalSpeed: e?.txTotalSpeed
      ? e.txTotalSpeed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      : "정보없음",

  }));

  const [visibleBoxes, setVisibleBoxes] = useState([]);
  const [activeTable, setActiveTable] = useState(
    nics.reduce((acc, _, index) => {
      acc[index] = "NETWORK_FROM_HOST";
      return acc;
    }, {})
  );
  const [activeButton, setActiveButton] = useState(
    nics.reduce((acc, _, index) => {
      acc[index] = "NETWORK_FROM_HOST";
      return acc;
    }, {})
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleHiddenBox = (index) => {
    setVisibleBoxes((prevVisibleBoxes) => {
      if (prevVisibleBoxes.includes(index)) {
        return prevVisibleBoxes.filter((i) => i !== index);
      } else {
        return [...prevVisibleBoxes, index];
      }
    });
    setActiveTable((prev) => ({
      ...prev,
      [index]: "NETWORK_FROM_HOST",
    }));
  };

  const [isExpandedAll, setIsExpandedAll] = useState(false); // '모두 확장' 버튼 상태 관리

  const toggleAllBoxes = () => {
    if (visibleBoxes.length === nics.length) {
      // 모두 숨기기
      setVisibleBoxes([]);
      setIsExpandedAll(false);
      setActiveButton((prev) => {
        const newButtons = { ...prev };
        nics.forEach((_, index) => {
          newButtons[index] = "NETWORK_FROM_HOST";
        });
        return newButtons;
      });
    } else {
      // 모두 확장
      setVisibleBoxes(nics.map((_, index) => index));
      setIsExpandedAll(true);
      setActiveButton((prev) => {
        const newButtons = { ...prev };
        nics.forEach((_, index) => {
          newButtons[index] = "NETWORK_FROM_HOST";
        });
        return newButtons;
      });
      setActiveTable((prev) => {
        const newTables = { ...prev };
        nics.forEach((_, index) => {
          newTables[index] = "NETWORK_FROM_HOST";
        });
        return newTables;
      });
    }
  };



  const switchTable = (index, tableType) => {
    setActiveTable((prev) => ({
      ...prev,
      [index]: tableType,
    }));
    setActiveButton((prev) => ({
      ...prev,
      [index]: tableType,
    }));
  };

  console.log("...")
  return (
    <>
      <div className="header-right-btns">
        <button>VF 보기</button>
        <button
          onClick={toggleAllBoxes}
          className={isExpandedAll ? "btn-expanded" : "btn-collapsed"} // 상태에 따라 클래스 변경
        >
          {isExpandedAll ? "모두 숨기기" : "모두 확장"}
        </button>
        <button onClick={() => setIsModalOpen(true)}>호스트 네트워크 설정</button>
        <button>네트워크 설정 저장</button>
        <button>모든 네트워크 동기화</button>
      </div>

      <div className="host-nic-table-outer">
        {nics.map((data, index) => (
          <div
            className="host-network-boxs"
            key={index}
            style={{ marginBottom: "0.2rem" }}
          >
            <div
              className="host_network_firstbox"
              onClick={() => toggleHiddenBox(index)}
            >
              <div className="section-table-outer">
                <TablesOuter
                  isLoading={isNicsLoading} isError={isNicsError} isSuccess={isNicsSuccess}
                  data={[data]}
                  columns={[
                    { header: "", accessor: "icon", width: "5%" }, // 아이콘 컬럼
                    ...TableColumnsInfo.NETWORK_INTERFACE_FROM_HOST,
                  ]}
                  onRowClick={() => console.log("Row clicked")}
                />
              </div>
            </div>
            {visibleBoxes.includes(index) && (
              <div className="host-network-hiddenbox flex">
                <div className="h-network-change-table">
                  <button
                    onClick={() => switchTable(index, "NETWORK_FROM_HOST")}
                    className={`h-icon-btn ${activeButton[index] === "NETWORK_FROM_HOST"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                      }`}
                  >
                    <FontAwesomeIcon
                      icon={faCrown}
                      fixedWidth
                      style={{ fontSize: "15px" }}
                    />
                  </button>


                  {data.bondingVo?.slaves && data.bondingVo.slaves.length > 0 && (
                    <button
                      onClick={() =>
                        switchTable(index, "NETWORK_FROM_HOST_SLAVE")
                      }
                      className={`h-icon-btn ${activeButton[index] === "NETWORK_FROM_HOST_SLAVE"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                        }`}
                    >
                      <FontAwesomeIcon
                        icon={faTimes}
                        fixedWidth
                        style={{ fontSize: "15px" }}
                      />
                    </button>
                  )}
                </div>

                <div
                  className="section-table-outer"
                // style={{ marginLeft: "0.4rem" }}
                >
                  {activeTable[index] === "NETWORK_FROM_HOST" && (
                    <TablesOuter
                      isLoading={isNicsLoading} isError={isNicsError} isSuccess={isNicsSuccess}
                      data={[data]} columns={TableColumnsInfo.NETWORK_FROM_HOST}
                      onRowClick={() => console.log("Row clicked")}
                    />
                  )}
                  {activeTable[index] === "NETWORK_FROM_HOST_SLAVE" &&
                    data.bondingVo?.slaves && (
                      <TablesOuter data={data.bondingVo.slaves} // bondingVo.slaves를 데이터로 전달
                        columns={TableColumnsInfo.NETWORK_FROM_HOST_SLAVE}
                        isLoading={isNicsLoading}
                        isError={isNicsError}
                        isSuccess={isNicsSuccess}
                        onRowClick={() => console.log("Row clicked")}
                      />
                    )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/*네트워크 모달 추가모달 */}
      <NetworkHostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        nicData={nics}
        hostId={hostId}
      />
    </>
  );
};

export default HostNics;
