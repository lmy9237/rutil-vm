import Logger from "../../../utils/Logger";
import BaseModal from "../BaseModal";

/**
 * @name VmCPUPinningModal
 * @description ...
 * 
 * @param {boolean} isOpen  
 * @returns 
 * @deprecated NOT USED 
 */
const VmCPUPinningModal = ({ isOpen, onClose }) => {
  Logger.debug("VmCPUPinningModal ...")
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={"CPU Pinning"}
      submitTitle={"OK"}
      onSubmit={() => {}}
    >
      {/* <div className="device-view-popup-outer modal"> */}
      <div className="device-view-popup">
        <div className="device_view_text">
          <div className="font-bold mb-1">CPU Pinning Policy</div>
          <div className="mb-1">None</div>
        </div>
        <div className="device_view_text">
          <div className="font-bold mb-1">CPU Pinning</div>
          <div className="mb-1">No CPU Pinning specified for the VM</div>
        </div>
        <div className="device_view_text">
          <div className="font-bold mb-1">CPU Topology</div>
          <div>
            The CPU Topology shows mapping from the VM's vCPU to the host
            physical CPU
          </div>
        </div>

        <div>
          <div className="px-2 py-1.5">Socket 0</div>
          <div className="device-view-boxs">
            <span>Core 0</span>
            <div className="device-view-box">vCPU 0</div>
          </div>
          <div className="device-view-boxs">
            <span>Core 1</span>
            <div className="device-view-box">vCPU 1</div>
          </div>
          <div className="device-view-boxs">
            <span>Core 2</span>
            <div className="device-view-box">vCPU 2</div>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default VmCPUPinningModal;
