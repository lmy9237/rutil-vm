import { useState, useEffect, useMemo } from "react";
import useUIState                       from "@/hooks/useUIState";
import useGlobal                        from "@/hooks/useGlobal";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import BaseModal                        from "@/components/modal/BaseModal";
import LabelInput                       from "@/components/label/LabelInput";
import LabelInputNum                    from "@/components/label/LabelInputNum";
import { 
  handleInputChange, 
} from "@/components/label/HandleInput";
import {
  useAttachCert
} from "@/api/RQHook";
import {
  checkEmpty
} from "@/util";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";

const ACTIONS = {
  "cert:attach": { label: Localization.kr.ATTACH, hook: useAttachCert },
};

/**
 * @name SettingCertModal
 * @description 인증서 관리 모달 모음
 * 
 * @returns {JSX.Element} SettingCertModal
 */
const SettingCertModal = ({
  isOpen,
  onClose,
  // data
}) => {
  const { activeModal, closeModal } = useUIState();
  const { certsSelected } = useGlobal();
  const { validationToast } = useValidationToast();
  const { label = "", hook } = ACTIONS[activeModal()] || {};
  const { 
    mutate
  } = hook ? hook(closeModal, closeModal) : { mutate: null };

  const initialFormState = {
    address: certsSelected[0]?.address || "",
    port: 22,
    rootPassword: "",
  };
  const [formState, setFormState] = useState(initialFormState);
  
  const {
    names
  } = useMemo(() => {
    return { names: [...certsSelected].map((e) => e.address || "undefined")}
  }, [certsSelected])

  useEffect(() => {
    Logger.debug(`SettingCertModal > useEffect ... `)
    if (!isOpen) {
      setFormState(initialFormState)
    }

    if (certsSelected[0]) {
      setFormState({
        address: certsSelected[0]?.address || "",
        port: certsSelected[0]?.connInfo?.port || 22,
        rootPassword: "",
      })
    }
  }, [isOpen]); 

  const validateForm = () => {
    Logger.debug(`SettingCertModal > validateForm ... `)
    if (checkEmpty(formState.address)) return "입력 된 주소가 없습니다."
    if (checkEmpty(formState.port)) return "입력 된 포트번호호가 없습니다."
    if (checkEmpty(formState.rootPassword)) return "입력 된 root 사용자의 비밀번호가 없습니다."
    return null;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      validationToast.fail(error);
      return;
    }
    mutate(formState)
  }

  return (
    <BaseModal targetName={Localization.kr.CERTIFICATE} submitTitle={label}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleFormSubmit}
      promptText={`${names.join(", ")} 를(을) ${label} 하시겠습니까?`}
      contentStyle={{ width: "473px" }} 
    >
      <div className="font-semibold py-1.5">
        <label>SSH 연결</label>
      </div>
      <LabelInput id="address" label={`${Localization.kr.HOST} 이름/IP`}
        value={formState.address}
        disabled={true}
        onChange={handleInputChange(setFormState, "address")}
      />
      <LabelInputNum id="port" label="SSH 포트"
        value={formState.port}
        disabled={true}
        onChange={handleInputChange(setFormState, "port")}
      />
      <LabelInput id="username" label={`${Localization.kr.USER} ${Localization.kr.NAME}`}
        value="root" disabled={true} />
      <LabelInput id="rootPassword" label={Localization.kr.PLACEHOLDER_PASSWORD}
        type="password"           
        value={formState.rootPassword}
        onChange={handleInputChange(setFormState, "rootPassword")}
      />
    </BaseModal>
  )
}

export default SettingCertModal