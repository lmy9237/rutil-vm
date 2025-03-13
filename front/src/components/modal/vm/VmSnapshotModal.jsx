import { useEffect, useState } from "react";
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
  persistMemory: true, // 메모리 저장 
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

  // 모달이 열릴 때 디스크를 초기 선택된 상태로 설정
  useEffect(() => {
    if (isOpen && disks.length > 0) {
      setSelectedDisks(disks.map((disk) => disk.diskImageVo)); // 모든 디스크를 선택된 상태로 설정
    }
  }, [isOpen, disks]); 

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
      diskAttachmentVos: selectedDisks.map((disk) => ({
        id: disk?.id,
        interface_: "IDE",
        logicalName: disk?.alias,
        diskImageVo: {
          id: disk?.id,
          imageId: disk?.imageId,
      }})),
    };

    console.log("snap: ", dataToSubmit);

    addSnapshotFromVM({ vmId, snapshotData: dataToSubmit },
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
                  check: (
                    <input
                      type="checkbox"
                      checked={selectedDisks.some((disk) => disk.id === d?.diskImageVo?.id)} // 선택된 디스크에 포함 여부 확인
                      onChange={(event) => handleDiskSelection(d?.diskImageVo, event.target.checked)} // `diskImageVo` 객체를 전달
                    />
                  ),
                })) || []}
              />
            </div>
            <div>
              <LabelCheckbox 
                label={"메모리 저장"}
                checked={formState.persistMemory} // ✅ persistMemory 값을 checked 상태에 반영
                onChange={() => setFormState((prev) => ({ ...prev, persistMemory: !prev.persistMemory }))} // ✅ true/false로 변경
              />
            </div>
          </div>
          <span>! 메모리를 저장하는 도중 가상 머신이 중지됨</span>
        </div>
      </div>
    </BaseModal>
  );
};

export default VmSnapshotModal;
