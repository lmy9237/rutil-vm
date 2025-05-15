import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import BaseModal from "../BaseModal";
import LabelInput from "../../label/LabelInput";
import ToggleSwitchButton from "../../button/ToggleSwitchButton";
import { useAddSnapshotFromVM } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";
import Logger from "../../../utils/Logger";
import "./MVm.css";

const initialFormState = {
  id: "",
  description: "",
  persistMemory: true, // 메모리 저장 
};

const VmSnapshotModal = ({
  isOpen,
  onClose,
}) => {
  const [formState, setFormState] = useState(initialFormState);
  // const { closeModal } = useUIState();
  const { vmsSelected } = useGlobal(); // ✅ vmsSelected 직접 읽기
  const selectedVm = vmsSelected?.[0] ?? null; // ✅ 첫 번째 VM 기준으로

  const { mutate: addSnapshotFromVM } = useAddSnapshotFromVM(onClose, onClose);
  
  useEffect(() => {
    if (isOpen  && selectedVm) {
      const now = new Date();
      const pad = (n) => n.toString().padStart(2, "0");

      const formattedDate = `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
      setFormState((prev) => ({ ...prev, description: `${selectedVm?.name || ""}_${formattedDate}`}));
    }
  }, [isOpen, selectedVm]);

  const handleFormSubmit = () => {
    const dataToSubmit = { 
      ...formState,
      persistMemory: Boolean(formState.persistMemory)
    };
    Logger.debug(`VmSnapshotModal > handleFormSubmit ... snap: ${JSON.stringify(dataToSubmit, null, 2)}`);

    addSnapshotFromVM({ vmId: selectedVm.id, snapshotData: dataToSubmit });
  };

  return (
    <BaseModal targetName={`${selectedVm?.name} ${Localization.kr.SNAPSHOT}`} submitTitle={Localization.kr.CREATE}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleFormSubmit}
      contentStyle={{ minWidth: "500px"}} 
    >
      <div className="min-h-[150px]">
        <LabelInput id="description" label={Localization.kr.DESCRIPTION}
          value={formState.description} 
          onChange={(e) => setFormState((prev) => ({ ...prev, description: e.target.value }))}
        />
        <ToggleSwitchButton label={`${Localization.kr.MEMORY} 저장`}
          checked={["DOWN"].includes(selectedVm?.status) ? false: formState.persistMemory}
          disabled={["DOWN"].includes(selectedVm?.status)}
          onChange={() => setFormState((prev) => ({ ...prev, persistMemory: !prev.persistMemory }))} // ✅ true/false로 변경
          tType={"저장"} fType={"저장안함"}
        />
        <br/>
        {["DOWN"].includes(selectedVm?.status) 
          ? <span></span> 
          : <span>! 메모리를 저장하는 도중 가상 머신이 중지됨</span>}
      </div>
    </BaseModal>
  );
};

export default VmSnapshotModal;
