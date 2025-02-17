import { useState } from "react";
import toast from "react-hot-toast";
import BaseModal from "../BaseModal";
import TablesOuter from "../../table//TablesOuter";
import TableColumnsInfo from "../../table/TableColumnsInfo";
import { useFindDiskListFromVM } from "../../../api/RQHook";

const VmConnectionPlusModal = ({
  isOpen,
  onClose,
  vmId,
  onSelectDisk = () => {},
  excludedDiskIds = [], // 제외할 디스크 ID 목록을 부모로부터 전달받음
}) => {
  const [activeTab, setActiveTab] = useState("img");
  const [selectedDiskId, setSelectedDiskId] = useState(null);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleFormSubmit = () => {
    console.log("VmConnectionPlusModal > handleFormSubmit ... ")
    if (selectedDiskId) {
      const selectedDiskDetails = disks.find(
        (disk) => disk.id === selectedDiskId
      );
      onSelectDisk(selectedDiskId, selectedDiskDetails);
      onClose();
    } else {
      toast.error("디스크를 선택하세요!");
    }
  };

  // 제외된 디스크 ID를 필터링
  const { data: rawDisks } = useFindDiskListFromVM((e) => ({
    ...e,
    radio: (
      <input
        type="radio"
        name="diskSelection"
        value={e.id}
        onChange={() => setSelectedDiskId(e.id)}
      />
    ),
    virtualSize: e?.virtualSize / Math.pow(1024, 3) + " GB",
    actualSize: e?.actualSize / Math.pow(1024, 3) + " GB",
    storageDomainVo: e?.storageDomainVo?.name,
    status: e?.status === "UNINITIALIZED" ? "초기화되지 않음" : "UP",
  }));

  // 제외된 디스크 ID를 필터링
  const disks =
    rawDisks?.filter((disk) => !excludedDiskIds.includes(disk.id)) || [];

  return (
    
    <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={"가상 디스크"}
      submitTitle={"연결"}
      onSubmit={handleFormSubmit}
    >
      {/* <div className="storage_disk_new_popup"> */}
      <div className="disk_new_nav">
        <div
          id="storage_img_btn"
          onClick={() => handleTabClick("img")}
          className={activeTab === "img" ? "active" : ""}
        >
          이미지
        </div>
        <div
          id="storage_directlun_btn"
          onClick={() => handleTabClick("directlun")}
          className={activeTab === "directlun" ? "active" : ""}
        >
          직접 LUN
        </div>
      </div>
      {activeTab === "img" && (
        <TablesOuter
          columns={TableColumnsInfo.VIRTUAL_DISK}
          data={disks}
          onRowClick={() => console.log("Row clicked in 이미지 탭")}
        />
      )}
      {activeTab === "directlun" && (
        <TablesOuter
          columns={TableColumnsInfo.VMS_STOP}
          data={[]} // 직접 LUN 데이터를 여기에 추가하세요.
          onRowClick={() => console.log("Row clicked in 직접 LUN 탭")}
        />
      )}
      <span>선택된 디스크 ID: {selectedDiskId || "없음"}</span>
    </BaseModal>
  );
};

export default VmConnectionPlusModal;
