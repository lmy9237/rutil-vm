import { useMemo } from "react";
import toast from "react-hot-toast";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import BaseModal from "../BaseModal";
import {
  useActivateDomain,
} from "../../../api/RQHook";
import Localization from "../../../utils/Localization";

/**
 * @name DomainActivateModal
 * @description 
 * action으로 type 전달
 *
 * @prop {boolean} isOpen
 * @returns
 */
const DomainActivateModal = ({ 
  isOpen, 
  onClose,
}) => {
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
  
  const handleFormSubmit = () => {
    if (!ids.length) {
      return toast.error("실행할 도메인이 없습니다.");
    }

    [...ids]?.forEach((domainId) => {
      activateDomain({ domainId, dataCenterId: datacentersSelected[0]?.id });
    });
  };

  return (
    <BaseModal targetName={Localization.kr.DOMAIN} submitTitle={"활성"}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleFormSubmit}
      promptText={`${names.join(", ")} 를(을) 활성화 하시겠습니까?`}
      contentStyle={{ width: "630px", height: "230px" }} 
      shouldWarn={true}
    />
  );
};

export default DomainActivateModal;
