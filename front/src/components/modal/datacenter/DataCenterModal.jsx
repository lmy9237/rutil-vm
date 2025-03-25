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
    checkName(formState.name);// 이름 검증

    if (checkKoreanName(formState.description))
      return "설명은 영어만 입력가능합니다.";
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
      contentStyle={{ width: "473px" }} 
    >
      <LabelInput id="name" label={Localization.kr.NAME}
        value={formState.name}
        onChange={handleInputChange("name")}
        autoFocus
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
