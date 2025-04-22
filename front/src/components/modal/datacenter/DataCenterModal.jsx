import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import BaseModal from "../BaseModal";
import LabelInput from "../../label/LabelInput";
import LabelSelectOptions from "../../label/LabelSelectOptions";
import { checkKoreanName, checkName } from "../../../util";
import {
  useAddDataCenter,
  useEditDataCenter,
  useDataCenter,
} from "../../../api/RQHook";
import "./MDatacenter.css";
import Localization from "../../../utils/Localization";
import ToggleSwitchButton from "../../button/ToggleSwitchButton";

const initialFormState = {
  id: "",
  name: "",
  comment: "",
  description: "",
  storageType: false, // 공유됨이 false
  version: "4.7",
  quotaMode: "DISABLED",
};

const quotaModes = [
  { value: "DISABLED", label: "비활성화됨" },
  { value: "AUDIT", label: "감사" },
  { value: "ENABLED", label: "활성화됨" },
];

const versions = [{ value: "4.7", label: 4.7 }];

/**
 * @name DataCenterModal
 * @description ...
 *
 * @param {boolean} isOpen ...
 * @returns
 */
const DataCenterModal = ({ 
  isOpen, 
  editMode = false, 
  datacenterId, 
  onClose 
}) => {
  const dcLabel = editMode ? Localization.kr.UPDATE : Localization.kr.CREATE;
  const [formState, setFormState] = useState(initialFormState);
  
  const onSuccess = () => {
    onClose();
    toast.success(`${Localization.kr.DATA_CENTER} ${dcLabel} 완료`);
    // TODO: 제거 RQHook에서 처리하도록 구현
  };
  const { data: datacenter } = useDataCenter(datacenterId);
  const { mutate: addDataCenter } = useAddDataCenter(onSuccess, () => onClose());
  const { mutate: editDataCenter } = useEditDataCenter(onSuccess, () => onClose());

  // 모달 열릴때 초기화, 편집 정보넣기
  useEffect(() => {
    if (!isOpen) {
      /* 열리기 전 */
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

  const handleInputChange = (field) => (e) => {
    setFormState((prev) => ({ ...prev, [field]: e.target.value }));
  };

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
    if (error) return toast.error(error);

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
        onChange={handleInputChange("name")}
      />
      <LabelInput id="description" label={Localization.kr.DESCRIPTION}
        value={formState.description}
        onChange={handleInputChange("description")}
      />
      <LabelInput id="comment" label={Localization.kr.COMMENT}
        value={formState.comment}
        onChange={handleInputChange("comment")}
      />
      <ToggleSwitchButton id="storage-type" label="스토리지 타입"
        checked={formState.storageType}
        onChange={() => setFormState((prev) => ({ ...prev, storageType: !formState.storageType }))}
        tType="로컬" fType="공유됨"
      />
      <LabelSelectOptions id="quarter-mode" label="쿼터 모드"
        value={formState.quotaMode}
        onChange={handleInputChange("quotaMode")}
        options={quotaModes}
      />
      <LabelSelectOptions id="version-compatible" label="호환버전"
        value={formState.version}
        onChange={handleInputChange("version")}
        options={versions}
      />
    </BaseModal>
  );
};

export default DataCenterModal;
