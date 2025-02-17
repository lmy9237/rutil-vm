import BaseModal from "../BaseModal";
import TablesOuter from "../../table/TablesOuter";
import TableColumnsInfo from "../../table/TableColumnsInfo";
import "./MVm.css";

const VmDeviceAddModal = ({ isOpen, onClose, hostDevices }) => {
  console.log("...")
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={"호스트 장치"}
      submitTitle={"장치추가"}
      onSubmit={() => {}}
    >
      {/* <div className="device-add-popup-outer modal"> */}
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
    </BaseModal>
  );
};

export default VmDeviceAddModal;
