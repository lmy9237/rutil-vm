import React, { useState, useEffect, Suspense } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowCircleUp,
  faChevronRight,
  faPlug,
} from "@fortawesome/free-solid-svg-icons";
import { useNetworkInterfaceFromVM } from "../../../api/RQHook";
import VmNetworkNewInterfaceModal from "../../../components/modal/vm/VmNetworkNewInterfaceModal";
import DeleteModal from "../../../utils/DeleteModal";

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
  } = useNetworkInterfaceFromVM(vmId, (e) => ({...e,}));

  const [modals, setModals] = useState({
    create: false,
    edit: false,
    delete: false,
  });
  const [selectedNics, setSelectedNics] = useState(null);
  const toggleModal = (type, isOpen) => {
    console.log(`VmNics > toggleModal ... type: ${type}, isOpen: ${isOpen}`);
    setModals((prev) => ({ ...prev, [type]: isOpen }));
  };

  const nicDefault = (nic) => [
    { label: "이름", value: nic?.name },
    { label: "네트워크 이름", value: nic?.networkVo?.name },
    { label: "IPv4", value: nic?.ipv4 },
    { label: "IPv6", value: nic?.ipv6 },
    { label: "MAC", value: nic?.macAddress },
  ];

  const nicInfo = (nic) => [
    { label: "연결됨", value: nic?.linked ? "연결됨" : "연결 안 됨" },
    { label: "네트워크 이름", value: nic?.networkVo?.name },
    { label: "프로파일 이름", value: nic?.vnicProfileVo?.name },
    { label: "링크 상태", value: nic?.status },
    { label: "유형", value: nic?.interfaceType },
    { label: "속도 (Mbps)", value: nic?.speed },
    { label: "포트 미러링", value: nic?.portMirroring || "비활성화됨" },
    { label: "게스트 인터페이스 이름", value: nic?.guestInterfaceName },
  ];

  const nicStatic = (nic) => [
    { label: "Rx 속도 (Mbps)", value: nic?.rxSpeed },
    { label: "Tx 속도 (Mbps)", value: nic?.txSpeed },
    { label: "총 Rx", value: nic?.rxTotalSpeed },
    { label: "총 Tx", value: nic?.txTotalSpeed },
    { label: "중단 (Pkts)", value: nic?.rxTotalError },
  ];

  const [visibleDetails, setVisibleDetails] = useState([]);
  useEffect(() => {
    setVisibleDetails(Array(3).fill(false)); // 초기 상태: 모든 detail 숨김
  }, []);

  const [activePopup, setActivePopup] = useState(null);
  const openPopup = (popupType) => {
    console.log(`VmNics > openPopup ... popupType: ${popupType}`);
    setActivePopup(popupType);
  };
  const closePopup = () => {
    console.log(`VmNics > closePopup ... `);
    setActivePopup(null);
  };

  const toggleDetails = (id) => {
    console.log(`VmNics > toggleDetails ... id: ${id}`);
    setVisibleDetails((prevDetails) => ({
      ...prevDetails,
      [id]: !prevDetails[id],
    }));
  };

  const renderModals = () => (
    <Suspense>
      {(modals.create || (modals.edit && selectedNics)) && (
        <VmNetworkNewInterfaceModal
          isOpen={modals.create || modals.edit}
          onClose={() =>
            toggleModal(modals.create ? "create" : "edit", false)
          }
          editMode={modals.edit}
          nicData={selectedNics}
          vmId={vmId || null}
          nicId={selectedNics?.id}
        />
      )}
      {modals.delete && selectedNics && (
        <DeleteModal
          isOpen={modals.delete}
          type="NetworkInterface"
          onRequestClose={() => toggleModal("delete", false)}
          contentLabel={"네트워크 인터페이스"}
          data={selectedNics}
          vmId={vmId}
        />
      )}
    </Suspense>
  );

  console.log("...");
  return (
    <>
      {/* nic 생성, 수정, 삭제 자체는 만드는게 나을듯(많이 쓰임) */}
      <div className="header-right-btns">
        <button onClick={() => toggleModal("create", true)}>새로 만들기</button>
        <button
          onClick={() => selectedNics?.id && toggleModal("edit", true)}
          disabled={!selectedNics?.id}
        >
          편집
        </button>
        <button
          onClick={() => selectedNics?.id && toggleModal("delete", true)}
          disabled={!selectedNics?.id}
        >
          제거
        </button>
      </div>
      <span>id = {selectedNics?.id || ""}</span>

      <div className="network-interface-outer">
        {nics.length > 0 ? ( // NIC가 하나라도 있을 때 실행
          nics.map((nic, index) => (
            <div
              className={`network_content2 ${selectedNics?.id === nic.id ? "selected" : ""}`}
              onClick={() => setSelectedNics(nic)} // NIC 선택 시 상태 업데이트
              key={nic.id}
            >
              <div className="network-content">
                <div>
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    onClick={() => toggleDetails(nic.id)}
                    fixedWidth
                  />
                  <FontAwesomeIcon
                    icon={faArrowCircleUp}
                    style={{ color: "#21c50b", marginLeft: "0.3rem" }}
                    fixedWidth
                  />
                  <FontAwesomeIcon icon={faPlug} fixedWidth />
                  <span>{nic?.name || `NIC ${index + 1}`}</span>
                </div>
                <div>
                  <div>네트워크 이름</div>
                  <div>{nic?.networkVo?.name}</div>
                </div>
                <div>
                  <div>IPv4</div>
                  <div>{nic?.ipv4 || "해당 없음"}</div>
                </div>
                <div>
                  <div>IPv6</div>
                  <div>{nic?.ipv6 || "해당 없음"}</div>
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
                  <table className="snap-table">
                    <tbody>
                      <tr>
                        <th>연결됨</th>
                        <td>{nic?.linked ? "연결됨" : "연결 안 됨"}</td>
                      </tr>
                      <tr>
                        <th>네트워크 이름</th>
                        <td>{nic?.networkVo?.name || ""}</td>
                      </tr>
                      <tr>
                        <th>프로파일 이름</th>
                        <td>{nic?.vnicProfileVo?.name || ""}</td>
                      </tr>
                      <tr>
                        <th>QoS 이름</th>
                        <td>{nic?.qosName || "해당 없음"}</td>
                      </tr>
                      <tr>
                        <th>링크 상태</th>
                        <td>{nic?.status || ""}</td>
                      </tr>
                      <tr>
                        <th>유형</th>
                        <td>{nic?.interfaceType}</td>
                      </tr>
                      <tr>
                        <th>속도 (Mbps)</th>
                        <td>{nic?.speed || "10000"}</td>
                      </tr>
                      <tr>
                        <th>포트 미러링</th>
                        <td>{nic?.portMirroring || "비활성화됨"}</td>
                      </tr>
                      <tr>
                        <th>게스트 인터페이스 이름</th>
                        <td>{nic?.guestInterfaceName || ""}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="network-content-detail-box">
                  <div className="font-bold">통계</div>
                  <table className="snap-table">
                    <tbody>
                      <tr>
                        <th>Rx 속도 (Mbps)</th>
                        <td>{nic?.rxSpeed || "<1"}</td>
                      </tr>
                      <tr>
                        <th>Tx 속도 (Mbps)</th>
                        <td>{nic?.txSpeed || "<1"}</td>
                      </tr>
                      <tr>
                        <th>총 Rx</th>
                        <td>{nic?.rxTotalSpeed || ""}</td>
                      </tr>
                      <tr>
                        <th>총 Tx</th>
                        <td>{nic?.txTotalSpeed || ""}</td>
                      </tr>
                      <tr>
                        <th>중단 (Pkts)</th>
                        <td>{nic?.rxTotalError || ""}</td>
                      </tr>
                    </tbody>
                  </table>
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

      {/* 모달창 */}
      {renderModals()}
    </>
  );
};
export default VmNics;
