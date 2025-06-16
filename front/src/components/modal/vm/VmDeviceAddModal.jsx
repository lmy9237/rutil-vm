import BaseModal from "../BaseModal";
import TablesOuter from "../../table/TablesOuter";
import TableColumnsInfo from "../../table/TableColumnsInfo";
import Localization from "../../../utils/Localization";
import Logger from "../../../utils/Logger";
import "./MVm.css";

/**
 * @name VmDeviceAddModal
 * @description ...
 * 
 * @param {*} param0 
 * @returns {JSX.Element} VmDeviceAddModal
 * 
 * TODO: 사용안함, 제거필요
 */
const VmDeviceAddModal = ({ 
  isOpen,
  onClose,
  hostDevices
}) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={`${Localization.kr.HOST} 장치`}
      submitTitle={"장치추가"}
      onSubmit={() => {}}
      contentStyle={{ width: "1000px"}} 
    >
      <div className="p-1">
        <div className="select-box mb-1">
          <label className="mr-1" htmlFor="fixed_host">
            고정된 {Localization.kr.HOST}
          </label>
          <select id="fixed_host">
            <option value="host01.ititinfo.com">host01.ititinfo.com</option>
            <option value="host02.ititinfo.com">host02.ititinfo.com</option>
          </select>
        </div>
        <div className="select-box mb-1 flex">
          <label className="mr-1 w-9 block" htmlFor="features">
            {Localization.kr.CAPABILITIES}
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
          <TablesOuter target={"hostdevices"}
            columns={TableColumnsInfo.ALL_DISK}
            data={hostDevices}
            onRowClick={() => {}}
          />
        </div>
      </div>

      <div className="p-1">
        <span className="font-bold">연결 호스트 장치</span>
        <div className="able-host-device-table">
          <TablesOuter target={"hostdevices"}
            columns={TableColumnsInfo.ALL_DISK}
            data={hostDevices}
            onRowClick={() => {}}
          />
        </div>
      </div>

    </BaseModal>
  );
};

export default VmDeviceAddModal;
