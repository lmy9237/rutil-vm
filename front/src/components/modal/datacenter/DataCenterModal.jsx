import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import BaseModal from "../BaseModal";
import LabelInput from "../../label/LabelInput";
import LabelSelectOptions from "../../label/LabelSelectOptions";
import { checkKoreanName } from "../../../util";
import {
  useAddDataCenter,
  useEditDataCenter,
  useDataCenter,
} from "../../../api/RQHook";
import "./MDatacenter.css";
import Localization from "../../../utils/Localization";

const initialFormState = {
  id: "",
  name: "",
  comment: "",
  description: "",
  storageType: false,
  version: "4.7",
  quotaMode: "DISABLED",
};

const storageTypes = [
  { value: "false", label: "공유됨" },
  { value: "true", label: "로컬" },
];

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
const DataCenterModal = ({ isOpen, editMode = false, dcId, onClose }) => {
  const dcLabel = editMode ? "편집" : "생성";
  const [formState, setFormState] = useState(initialFormState);

  const { mutate: addDataCenter } = useAddDataCenter();
  const { mutate: editDataCenter } = useEditDataCenter();
  const { data: datacenter } = useDataCenter(dcId);

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
        storageType: String(datacenter.storageType),
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
    if (!checkKoreanName(formState.name)) return "이름이 유효하지 않습니다.";
    if (!formState.name) return "이름을 입력해주세요"
    if (!checkKoreanName(formState.description)) return "영어만 입력가능.";
    return null;
  };

  // 제출
  const handleFormSubmit = () => {
    console.log("DataCenterModal > handleFormSubmit ... ")
    const error = validateForm();
    if (error) {
      console.error(error);
      return toast.error(error);
    }

    const dataToSubmit = { ...formState };
    const onSuccess = () => {
      console.log("DataCenterModal > handleFormSubmit > onSuccess ... ")
      onClose();
      toast.success(`데이터센터 ${dcLabel} 완료`);
    };
    const onError = (err) =>
      toast.error(`Error ${dcLabel} data center: ${err}`);

    editMode
      ? editDataCenter(
          { dataCenterId: formState.id, dataCenterData: dataToSubmit },
          { onSuccess, onError }
        )
      : addDataCenter(dataToSubmit, { onSuccess, onError });
  };

  return (
    <BaseModal targetName={Localization.kr.DATA_CENTER}
      isOpen={isOpen} onClose={onClose}
      submitTitle={dcLabel}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "473px", height: "490px" }} 
    >
      {/* <div className="datacenter-new-popup modal"> */}
      <div className="datacenter-new-popup-outer">
        <LabelInput id="name" label="이름"
          value={formState.name}
          onChange={handleInputChange("name")}
          autoFocus
        />
        <LabelInput id="description" label="설명"
          value={formState.description}
          onChange={handleInputChange("description")}
        />
        <LabelInput id="comment" label="코멘트"
          value={formState.comment}
          onChange={handleInputChange("comment")}
        />
        <LabelSelectOptions id="storage-type" label="스토리지 타입"
          value={String(formState.storageType)}
          onChange={handleInputChange("storageType")}
          options={storageTypes}
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
      </div>
    </BaseModal>
  );
};

export default DataCenterModal;
