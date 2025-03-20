import React, { useState, Suspense } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleDown, faArrowCircleUp, faPlug, faPlugCircleXmark} from "@fortawesome/free-solid-svg-icons";
import { useNetworkInterfaceFromVM } from "../../../api/RQHook";
import NicModal from "../../../components/modal/vm/NicModal";
import TablesRow from "../../../components/table/TablesRow";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import { checkZeroSizeToMbps } from "../../../util";
import ActionButton from "../../../components/button/ActionButton";
import Localization from "../../../utils/Localization";
import { RVI24, rvi24ChevronDown, rvi24ChevronRight } from "../../../components/icons/RutilVmIcons";

/**
 * @name VmNics
 * @description 가상에 종속 된 네트워크 인터페이스 목록
 *
 * @param {string} vmId 가상머신 ID
 * @returns
 */
const VmNics = ({ vmId }) => {
  const {
    data: nics = [],
    isLoading: isNicsLoading,
    isError: isNicsError,
    Success: isNicsSuccess,
  } = useNetworkInterfaceFromVM(vmId, (e) => ({ ...e }));
  
  const transformedData = nics.map((nic) => ({
    ...nic,
    id: nic?.id,
    name: nic?.name,
    status: nic?.status,
    linked: nic?.linked,
    plugged: nic?.plugged,
    ipv4: nic?.ipv4,
    ipv6: nic?.ipv6,
    macAddress : nic?.macAddress,
    networkName : nic?.networkVo?.name,
    vnicProfileName : nic?.vnicProfileVo?.name,
    interface_: nic?.interface_,
    portMirroring: nic?.portMirroring || "비활성화됨",
    guestInterfaceName: nic?.guestInterfaceName,
    speed: "10000",
    rxSpeed: checkZeroSizeToMbps(nic?.rxSpeed),
    txSpeed: checkZeroSizeToMbps(nic?.txSpeed),
    rxTotalSpeed: nic?.rxTotalSpeed?.toLocaleString() || "0",
    txTotalSpeed: nic?.txTotalSpeed?.toLocaleString() || "0",
    pkts: `${nic?.rxTotalError}` || "1",    
  }));

  const [selectedNic, setSelectedNic] = useState(null);
  const [visibleDetails, setVisibleDetails] = useState({});
  const toggleDetails = (id) => setVisibleDetails((prev) => ({ 
    ...prev, 
    [id]: !prev[id]
  }));

  const [activeModal, setActiveModal] = useState(null);
  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);

  return (
    <>
      <div className="header-right-btns">
        <ActionButton actionType="default"
          label="새로 만들기"
          onClick={() => openModal("create")}
        />
        <ActionButton actionType="default"
          label="편집"
          disabled={!selectedNic} 
          onClick={() => openModal("edit")}
        />
        <ActionButton actionType="default"
          label="제거"
          disabled={!selectedNic}
          onClick={() => openModal("delete")}
        />
      </div>
      <span>id = {selectedNic?.id || ""}</span>

      <div className="network-interface-outer">
        {transformedData.length > 0 ? ( // NIC가 하나라도 있을 때 실행
          transformedData?.map((nic, i) => (
            <div
              className={`network_content2 ${selectedNic?.id === nic.id ? "selected" : ""}`}
              onClick={() => setSelectedNic(nic)} // NIC 선택 시 상태 업데이트
              key={nic?.id}
            >
              <div className="network-content">
                <div className="network-status">
                  <RVI24 iconDef={visibleDetails[nic.id] ? rvi24ChevronDown : rvi24ChevronRight}
                    onClick={() => toggleDetails(nic.id)}
                  />
                  <FontAwesomeIcon
                    icon={Boolean(nic?.linked) ? faArrowCircleUp : faArrowCircleDown}
                    style={{ color: Boolean(nic?.linked) ? "#21c50b" : "#e80c0c", marginLeft: "0.3rem" }}
                    fixedWidth
                  />
                  <FontAwesomeIcon
                    icon={Boolean(nic?.plugged) ? faPlug : faPlugCircleXmark}
                    style={{ color: Boolean(nic?.plugged) ? "#21c50b" : "#e80c0c", marginLeft: "0.3rem" }}
                    fixedWidth
                  />
                  <span>{nic?.name}</span>
                </div>
                <div>
                  <div>네트워크 이름</div>
                  <div>{nic?.networkVo?.name}</div>
                </div>
                <div>
                  <div>IPv4</div>
                  <div>{nic?.ipv4 || Localization.kr.NOT_ASSOCIATED}</div>
                </div>
                <div>
                  <div>IPv6</div>
                  <div>{nic?.ipv6 || Localization.kr.NOT_ASSOCIATED}</div>
                </div>
                <div style={{ paddingRight: "3%" }}>
                  <div>MAC</div>
                  <div>{nic?.macAddress}</div>
                </div>
              </div>

              <div
                className="network-content-detail"
                style={{ display: visibleDetails[nic.id] ? "flex" : "none" }}
              >
                <div className="network-content-detail-box">
                  <div className="font-bold">일반</div>
                  <TablesRow
                    columns={TableColumnsInfo.NICS_FROM_VMS} 
                    data={nic} 
                  />
                </div>
                <div className="network-content-detail-box">
                  <div className="font-bold">통계</div>
                  <TablesRow
                    columns={TableColumnsInfo.NICS_CALC_FROM_VMS} 
                    data={nic} 
                  />
                </div>
                <div className="network-content-detail-box">
                  <div className="font-bold">네트워크 필터 매개변수</div>
                  <table className="snap-table">
                    <tbody></tbody>
                  </table>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p
            style={{
              textAlign: "center",
              color: "gray",
              padding: "20px",
              fontSize: "14px",
            }}
          >
            표시할 네트워크 인터페이스가 없습니다.
          </p>
        )}
      </div>
      
      <Suspense>
        {activeModal === "create" && (
          <NicModal
            isOpen
            onClose={closeModal}            
            vmId={vmId}
          />
        )}
        {activeModal === "edit" && (
          <NicModal
            isOpen
            editMode
            onClose={closeModal}
            vmId={vmId}
            nicId={selectedNic?.id}
          />
        )}
        {/* {activePopup === "delete" && selectedNics && (
          <DeleteModal
            isOpen
            type="NetworkInterface"
            onRequestClose={closePopup}
            contentLabel={Localization.kr.NICS}
            data={selectedNics}
            vmId={vmId}
          />
        )} */}
      </Suspense>
    </>
  );
};
export default VmNics;
