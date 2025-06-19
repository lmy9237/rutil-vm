import { useCallback, useMemo, useState } from "react";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import useUIState                       from "@/hooks/useUIState";
import BaseModal                        from "../BaseModal";
import TablesOuter                      from "@/components/table//TablesOuter";
import TableColumnsInfo                 from "@/components/table/TableColumnsInfo";
import { 
  useFindDiskListFromVM,
} from "@/api/RQHook";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";

/**
 * @name VmConnectionPlusModal
 * @description ... 
 * 
 * @param {*} param0 
 * @returns {JSX.Element} VmConnectionPlusModal
 */
const VmConnectionPlusModal = ({
  isOpen,
  onClose,
  vmId,
  onSelectDisk = () => {},
  excludedDiskIds = [], // 제외할 디스크 ID 목록을 부모로부터 전달받음
}) => {
  const { validationToast } = useValidationToast();
  const { closeModal } = useUIState()
  const [activeTab, setActiveTab] = useState("img");
  const [selectedDiskId, setSelectedDiskId] = useState(null);
  
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
    status: e?.status?.toUpperCase() === "UNINITIALIZED" ? "초기화되지 않음" : "UP",
  }));

  const handleTabClick = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const validateForm = () => {
    Logger.debug(`VmConnectionPlusModal > validateForm ... `)
    if (!selectedDiskId) return `${Localization.kr.DISK}를 ${Localization.kr.PLACEHOLDER_SELECT}`
    return null
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      validationToast.fail(error);
      return;
    }
    
    Logger.debug("VmConnectionPlusModal > handleFormSubmit ... ")
    const selectedDiskDetails = disks.find((disk) => disk.id === selectedDiskId);
    onSelectDisk(selectedDiskId, selectedDiskDetails);
    closeModal()
  };


  // 제외된 디스크 ID를 필터링
  const disks = useMemo(() => (
    rawDisks?.filter((disk) => !excludedDiskIds.includes(disk.id)) || []
  ), [rawDisks]);

  return (
    <BaseModal targetName={`가상 ${Localization.kr.DISK}`} submitTitle={Localization.kr.CONNECTION}
      isOpen={isOpen} onClose={onClose}
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
        <TablesOuter columns={TableColumnsInfo.VIRTUAL_DISK}
          data={disks}
          onRowClick={() => Logger.debug("Row clicked in 이미지 탭")}
        />
      )}
      {activeTab === "directlun" && (
        <TablesOuter columns={TableColumnsInfo.VMS_STOP}
          data={[]} // 직접 LUN 데이터를 여기에 추가하세요.
          onRowClick={() => Logger.debug("Row clicked in 직접 LUN 탭")}
        />
      )}
      <span>선택된 디스크 ID: {selectedDiskId || "없음"}</span>
    </BaseModal>
  );
};

export default VmConnectionPlusModal;
