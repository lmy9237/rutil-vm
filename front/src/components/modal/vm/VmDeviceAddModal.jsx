import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import TablesOuter from "../../table/TablesOuter";
import TableColumnsInfo from "../../table/TableColumnsInfo";
import "./MVm.css";

const VmDeviceAddModal = ({ isOpen, onRequestClose, hostDevices }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="장치추가"
      className="Modal"
      overlayClassName="Overlay"
      shouldCloseOnOverlayClick={false}
    >
      <div className="device-add-popup-outer modal">
        <div className="popup-header">
          <h1>호스트 장치 추가</h1>
          <button onClick={onRequestClose}>
            <FontAwesomeIcon icon={faTimes} fixedWidth />
          </button>
        </div>

        <div className="p-1">
          <div className="select-box mb-1">
            <label className="mr-1" htmlFor="fixed_host">
              고정된 호스트
            </label>
            <select id="fixed_host">
              <option value="host01.ititinfo.com">host01.ititinfo.com</option>
              <option value="host02.ititinfo.com">host02.ititinfo.com</option>
            </select>
          </div>
          <div className="select-box mb-1 flex">
            <label className="mr-1 w-9 block" htmlFor="features">
              기능
            </label>
            <select id="features">
              <option value="pci">pci</option>
              <option value="scsi">scsi</option>
              <option value="sub_device">sub_device</option>
              <option value="nvdimm">nvdimm</option>
            </select>
          </div>
        </div>

        <div className="p-1">
          <span className="font-bold">사용 가능한 호스트 장치</span>
          <div className="able-host-device-table">
            <TablesOuter
              columns={TableColumnsInfo.ALL_DISK}
              data={hostDevices}
              onRowClick={() => console.log("Row clicked")}
            />
          </div>
        </div>

        <div className="p-1">
          <span className="font-bold">연결 호스트 장치</span>
          <div className="able-host-device-table">
            <TablesOuter
              columns={TableColumnsInfo.ALL_DISK}
              data={hostDevices}
              onRowClick={() => console.log("Row clicked")}
            />
          </div>
        </div>

        <div className="edit-footer">
          <button style={{ display: "none" }}></button>
          <button>OK</button>
          <button onClick={onRequestClose}>취소</button>
        </div>
      </div>
    </Modal>
  );
};

export default VmDeviceAddModal;
