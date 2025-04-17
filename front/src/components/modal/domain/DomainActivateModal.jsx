import { useMemo } from "react";
import toast from "react-hot-toast";
import BaseModal from "../BaseModal";
import {
  useActivateDomain,
  useDetachDomain,
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
  domains, 
  datacenterId 
}) => {
  const onSuccess = () => {
    onClose();
    toast.success(`${Localization.kr.DOMAIN} 활성화 완료`);
  };
  const { mutate: activateDomain } = useActivateDomain(onSuccess, () => onClose());

  const { ids, names } = useMemo(() => {
    if (!domains) return { ids: [], names: [] };

    const dataArray = Array.isArray(domains) ? domains : [domains];
    return {
      ids: dataArray.map((item) => item.id),
      names: dataArray.map((item) => item.name),
    };
  }, [domains]);
  
  const handleFormSubmit = () => {
    if (!ids.length) return toast.error("실행할 도메인이 없습니다.");

    ids.forEach((domainId) => {
      activateDomain({ domainId, dataCenterId: datacenterId });
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
