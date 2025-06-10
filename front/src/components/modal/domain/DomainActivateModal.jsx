import { useMemo } from "react";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import useUIState                       from "@/hooks/useUIState";
import useGlobal                        from "@/hooks/useGlobal";
import BaseModal                        from "../BaseModal";
import {
  useActivateDomain,
} from "@/api/RQHook";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";

/**
 * @name DomainActivateModal
 * @description 
 *
 * @prop {boolean} isOpen
 * @returns
 */
const DomainActivateModal = ({ 
  isOpen, 
  onClose,
}) => {
  const { validationToast } = useValidationToast();
  // const { closeModal } = useUIState()
  const { datacentersSelected, domainsSelected } = useGlobal()
  const { mutate: activateDomain } = useActivateDomain(onClose, onClose);

  const { ids, names } = useMemo(() => {
    if (!domainsSelected) return { ids: [], names: [] };

    return {
      ids: [...domainsSelected].map((item) => item.id),
      names: [...domainsSelected].map((item) => item.name),
    };
  }, [domainsSelected]);
  
  const validateForm = () => {
    Logger.debug(`DomainActivateModal > validateForm ... `)
    if (!ids.length) return "실행할 도메인이 없습니다"
    return null
  }
  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) {
      validationToast.fail(error);
      return;
    }

    Logger.debug(`DomainActivateModal > handleFormSubmit ... `)
    ids.forEach((domainId) => {
      activateDomain({ domainId, dataCenterId: datacentersSelected[0]?.id });
    });
  };

  return (
    <BaseModal targetName={Localization.kr.DOMAIN} submitTitle={"활성"}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleFormSubmit}
      promptText={`${names.join(", ")} 를(을) 활성화 하시겠습니까?`}
      contentStyle={{ width: "630px"}} 
      shouldWarn={true}
    />
  );
};

export default DomainActivateModal;
