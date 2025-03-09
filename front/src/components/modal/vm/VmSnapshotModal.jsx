import { useState } from "react";
import toast from "react-hot-toast";
import BaseModal from "../BaseModal";
import TablesOuter from "../../table/TablesOuter";
import TableColumnsInfo from "../../table/TableColumnsInfo";
import { useAddSnapshotFromVM, useDisksFromVM } from "../../../api/RQHook";
import "./MVm.css";
import LabelInput from "../../label/LabelInput";
import LabelCheckbox from "../../label/LabelCheckbox";

const initialFormState = {
  id: "",
  description: "",
  persistMemory: false, // 메모리 저장 
};

const VmSnapshotModal = ({ isOpen, vmId, onClose }) => {
  const { mutate: addSnapshotFromVM } = useAddSnapshotFromVM();

  const { 
    data: disks = [], 
    isLoading: isDisksLoading ,
    isError: isDisksError,
    isSuccess: isDisksSuccess,
  } = useDisksFromVM(vmId, (e) => ({ ...e }));

  const [formState, setFormState] = useState(initialFormState);
  const [selectedDisks, setSelectedDisks] = useState([]); // 체크된 디스크 목록

  const handleDiskSelection = (disk, isChecked) => {
    setSelectedDisks((prev) =>
      isChecked
        ? [...prev, disk]
        : prev.filter((d) => d.id !== disk.id)
    );
  };

  const handleFormSubmit = () => {
    const dataToSubmit = {
      ...formState,
      diskAttachmentVos: selectedDisks.length > 0 
      ? selectedDisks.map((disk) => ({
          id: disk.id,
          interface_: "IDE",
          logicalName: disk.alias,
          diskImageVo: {
            id: disk.id,
            alias: disk.alias,
            description: disk.description,
            format: "COW",
            imageId: disk.imageId,
            storageDomainVo: disk.storageDomainVo,
          },
        }))
      : [],
    };

    addSnapshotFromVM(
      { vmId, snapshotData: dataToSubmit },
      {
        onSuccess: () => {
          setSelectedDisks([]); // ✅ 선택된 디스크 초기화
          onClose();
          toast.success("스냅샷 생성 완료");
        },
        onError: (error) => {
          toast.error("Error adding snapshot:", error);
        },
      }
    );
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={"스냅샷"}
      submitTitle={"생성"}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "500px", height: "500px" }} 
    >
      <div className="popup-content-outer">
        <div className="p-1">
          <LabelInput
            className="host-textbox flex mb-1" 
            label="설명" 
            value={formState.description} 
            onChange={(e) => setFormState((prev) => ({ ...prev, description: e.target.value }))}
          />
          <div>
            <div className="font-bold">포함할 디스크 :</div>
            <div className="snapshot-new-table">
              <TablesOuter
                isLoading={isDisksLoading} isError={isDisksError} isSuccess={isDisksSuccess}
                columns={TableColumnsInfo.SNAPSHOT_NEW}
                data={disks?.map((d) => ({
                  id: d?.diskImageVo?.id, // `diskImageVo`에서 `id` 추출
                  alias: d?.diskImageVo?.alias, // `alias` 추출
                  description: d?.diskImageVo?.description, // `description` 추출
                  snapshot_check: (
                    <input
                      type="checkbox"
                      checked={selectedDisks.some((disk) => disk.id === d?.diskImageVo?.id)} // id 비교 수정
                      onChange={(event) => handleDiskSelection(d.diskImageVo, event.target.checked)} // diskImageVo를 직접 전달
                    />
                  ),
                })) || []}
              />
            </div>
            <div>
              <LabelCheckbox 
                label={"메모리 저장"}
                value={formState.persistMemory}
                checked
                onChange={(e) => setFormState((prev) => ({ ...prev, persistMemory: e.target.value }))}
              />
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default VmSnapshotModal;
