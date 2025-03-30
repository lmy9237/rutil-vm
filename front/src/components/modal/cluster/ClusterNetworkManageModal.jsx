import React from "react";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import TableOuter from "./TableOuter"; // TableOuter 컴포넌트는 경로에 맞게 수정하세요.
import Localization from "../../../utils/Localization";
import Logger from "../../../utils/Logger";

/**
 * @name ClusterNetworkManageModal
 * @description 클러스터(논리 네트워크 관리) 모달
 *
 * @param {boolean} isOpen 열람여부
 * @returns
 *
 * @deprecated (아직) 사용안함
 */
const ClusterNetworkManageModal = ({
  isOpen,
  onRequestClose,
  clusterPopupData,
  TableColumnsInfo,
  handleRowClick,
}) => {
  Logger.debug("...");
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={`${Localization.kr.NETWORK} 관리`}
      className="Modal"
      overlayClassName="Overlay"
      shouldCloseOnOverlayClick={false}
    >
      <div className="manage_network_popup">
        <div className="popup_header">
          <h1>{Localization.kr.NETWORK} 관리</h1>
          <button onClick={onRequestClose}>
            <FontAwesomeIcon icon={faTimes} fixedWidth />
          </button>
        </div>

        <TableOuter
          columns={TableColumnsInfo.CLUSTERS_POPUP}
          data={clusterPopupData}
          onRowClick={handleRowClick}
        />

        <div className="edit_footer">
          <button style={{ display: "none" }}></button>
          <button>OK</button>
          <button onClick={onRequestClose}>취소</button>
        </div>
      </div>
    </Modal>
  );
};

export default ClusterNetworkManageModal;
