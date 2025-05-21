import { useState, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import { useToast }           from "@/hooks/use-toast";
import useGlobal              from "@/hooks/useGlobal";
import useUIState             from "@/hooks/useUIState";
import { Switch }             from "@/components/ui/switch"
import BaseModal              from "@/components/modal/BaseModal";
import LabelInput             from "@/components/label/LabelInput";
import LabelSelectOptions     from "@/components/label/LabelSelectOptions";
import { handleInputChange }  from "@/components/label/HandleInput";
import ToggleSwitchButton     from "@/components/button/ToggleSwitchButton";
import {
  useAddDataCenter,
  useEditDataCenter,
  useDataCenter,
} from "@/api/RQHook";
import {
  checkKoreanName, checkName 
} from "@/util";
import Localization           from "@/utils/Localization";
import "./MDatacenter.css";

const initialFormState = {
  id: "",
  name: "",
  comment: "",
  description: "",
  storageType: false, // 공유됨이 false
  version: "4.7",
  quotaMode: "DISABLED",
};

/**
 * @name DataCenterModal
 * @description ...
 *
 * @param {boolean} isOpen ...
 * @returns
 */
const DataCenterModal = ({ 
  isOpen,
  onClose,
  editMode=false
}) => {
  const { toast } = useToast();
  // const { closeModal } = useUIState()
  const dcLabel = editMode ? Localization.kr.UPDATE : Localization.kr.CREATE;
  
  const { datacentersSelected } = useGlobal()
  const datacenterId = useMemo(() => [...datacentersSelected][0]?.id, [datacentersSelected])

  const [formState, setFormState] = useState(initialFormState);
  const { data: datacenter } = useDataCenter(datacenterId);
  const { mutate: addDataCenter } = useAddDataCenter(onClose, onClose);
  const { mutate: editDataCenter } = useEditDataCenter(onClose, onClose);

  // 모달 열릴때 초기화, 편집 정보넣기
  useEffect(() => {
    if (!isOpen) {
      return setFormState(initialFormState);
    }
    if (editMode && datacenter) {
      setFormState({
        id: datacenter.id,
        name: datacenter.name,
        comment: datacenter.comment,
        description: datacenter.description,
        storageType: Boolean(datacenter.storageType),
        version: datacenter.version,
        quotaMode: datacenter.quotaMode,
      });
    }
  }, [isOpen, editMode, datacenter]);

  // 값 검증
  const validateForm = () => {
    const nameError = checkName(formState.name);
    if (nameError) return nameError;
    if (checkKoreanName(formState.description)) return `${Localization.kr.DESCRIPTION}은 영어만 입력가능합니다.`;
    return null;
  };

  // 제출
  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) {
      toast({
        variant: "destructive",
        title: "문제가 발생하였습니다.",
        description: error,
      });
      return;
    }

    const dataToSubmit = { ...formState };

    editMode
      ? editDataCenter({ dataCenterId: formState.id, dataCenterData: dataToSubmit })
      : addDataCenter(dataToSubmit);
  };

  return (
    <BaseModal targetName={Localization.kr.DATA_CENTER} submitTitle={dcLabel}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "473px" }} 
    >
      <LabelInput id="name" label={Localization.kr.NAME}
        autoFocus
        value={formState.name}
        onChange={handleInputChange(setFormState, "name")}
      />
      <LabelInput id="description" label={Localization.kr.DESCRIPTION}
        value={formState.description}
        onChange={handleInputChange(setFormState, "description")}
      />
      <LabelInput id="comment" label={Localization.kr.COMMENT}
        value={formState.comment}
        onChange={handleInputChange(setFormState, "comment")}
      />
      <ToggleSwitchButton id="storage-type" label="스토리지 타입"
        checked={formState.storageType}
        onChange={() => setFormState((prev) => ({ ...prev, storageType: !formState.storageType }))}
        tType="로컬" fType="공유됨"
      />
      <LabelSelectOptions id="quarter-mode" label="쿼터 모드"
        value={formState.quotaMode}
        onChange={handleInputChange(setFormState, "quotaMode")}
        options={quotaModes}
      />
      <LabelSelectOptions id="version-compatible" label="호환버전"
        value={formState.version}
        onChange={handleInputChange(setFormState, "version")}
        options={versions}
      />
    </BaseModal>
  );
};

export default DataCenterModal;

const quotaModes = [
  { value: "DISABLED", label: `${Localization.kr.DEACTIVATE}` },
  { value: "AUDIT", label: "감사" },
  { value: "ENABLED", label: `${Localization.kr.ACTIVATE}` },
];

const versions = [{ value: "4.7", label: 4.7 }];
