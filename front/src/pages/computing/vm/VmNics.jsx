import React, { useState, Suspense, useRef } from "react";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleDown, faArrowCircleUp, faPlug, faPlugCircleXmark} from "@fortawesome/free-solid-svg-icons";
import { useNetworkInterfacesFromVM } from "../../../api/RQHook";
import VmNicModal from "../../../components/modal/vm/VmNicModal";
import TablesRow from "../../../components/table/TablesRow";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import { checkZeroSizeToMbps } from "../../../util";
import { RVI24, rvi24ChevronDown, rvi24ChevronRight } from "../../../components/icons/RutilVmIcons";
import Localization from "../../../utils/Localization";
import SelectedIdView from "../../../components/common/SelectedIdView";
import NicActionButtons from "../../../components/dupl/NicActionButtons";
import useClickOutside from "../../../hooks/useClickOutside";

/**
 * @name VmNics
 * @description 가상에 종속 된 네트워크 인터페이스 목록
 *
 * @param {string} vmId 가상머신 ID
 * @returns
 */
const VmNics = ({ vmId }) => {
  const { activeModal, setActiveModal, } = useUIState()
  const { nicsSelected, setNicsSelected } = useGlobal()

  const {
    data: nics = [],
    isLoading: isNicsLoading,
    isError: isNicsError,
    Success: isNicsSuccess,
  } = useNetworkInterfacesFromVM(vmId, (e) => ({ ...e }));
  
  const transformedData = [...nics].map((nic) => ({
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

  const [visibleDetailId, setVisibleDetailId] = useState(null);
  const toggleDetails = (id) => { setVisibleDetailId((prev) => (prev === id ? null : id))};

  const nicRef = useRef()
  useClickOutside(nicRef, (e) => setNicsSelected([])) /* 외부 창을 눌렀을 때 선택 해제 */

  return (
    <div ref={nicRef} onClick={(e) => e.stopPropagation()}>
      <div className="dupl-header-group f-start">
        <NicActionButtons />
      </div>

      <div className="network-interface-outer">
        {transformedData.length === 0 ? ( // NIC가 하나라도 있을 때 실행
          <p style={{textAlign: "center", color: "gray", padding: "20px", fontSize: "14px" }}>
            표시할 네트워크 인터페이스가 없습니다.
          </p>
        ) : (
          [...transformedData].map((nic, i) => (
            <div key={nic?.id}
              className={`network_content2 ${nicsSelected[0]?.id === nic.id ? "selected" : ""}`}
              onClick={() => {
                setNicsSelected(nic)
                setVisibleDetailId(nic.id);
              }} // NIC 선택 시 상태 업데이트
            >
              <div className="network-content"
                onClick={() => toggleDetails(nic.id)}
              >
                <div className="network-status">
                  <RVI24 iconDef={visibleDetailId === nic.id ? rvi24ChevronDown() : rvi24ChevronRight()} 
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
                  <div>{Localization.kr.NETWORK} {Localization.kr.NAME}</div>
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
                style={{ display: visibleDetailId === nic.id ? "flex" : "none" }}
              >
                <div className="network-content-detail-box">
                  <div className="font-bold">일반</div>
                  <TablesRow
                    columns={TableColumnsInfo.NICS_FROM_VM} 
                    data={nic} 
                  />
                </div>
                <div className="network-content-detail-box">
                  <div className="font-bold">통계</div>
                  <TablesRow
                    columns={TableColumnsInfo.NICS_CALC_FROM_VM} 
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
        )}
      </div>
      
      <SelectedIdView items={nicsSelected} />
      
      <Suspense>
        {activeModal() === "nic:create" && (
          <VmNicModal key={activeModal()} isOpen={activeModal() === "nic:create"}
            onClose={() => setActiveModal(null)}            
            // vmId={vmId}
          />
        )}
        {activeModal() === "nic:update" && (
          <VmNicModal key={activeModal()} isOpen={activeModal() === "nic:update"}
            onClose={() => setActiveModal(null)}
            editMode
            // vmId={vmId}
            // nicId={nicsSelected[0]?.id}
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
    </div>
  );
};
export default VmNics;
