import { useMemo } from "react";
import toast from "react-hot-toast";
import BaseModal from "../BaseModal";
import {
  useActivateDomain,
  useDetachDomain,
} from "../../../api/RQHook";
import Localization from "../../../utils/Localization";

/**
 * @name DomainActionModal
 * @description 
 * action으로 type 전달
 *
 * @prop {boolean} isOpen
 * @returns
 */
const DomainActionModal = ({ 
  isOpen, 
  onClose, 
  action,
  // actionType=true, // actionType이 true 면 데이터센터에서 도메인을 바라보는 방향
  domains, 
  datacenterId 
}) => {
  const onSuccess = () => {
    toast.success(`${Localization.kr.DOMAIN} ${getContentLabel()} 완료`);
    onClose();
  };
  const { mutate: detachDomain } = useDetachDomain(onSuccess, () => onClose());
  const { mutate: activateDomain } = useActivateDomain(onSuccess, () => onClose());

  const { ids, names } = useMemo(() => {
    if (!domains) return { ids: [], names: [] };

    const dataArray = Array.isArray(domains) ? domains : [domains];
    return {
      ids: dataArray.map((item) => item.id),
      names: dataArray.map((item) => item.name),
    };
  }, [domains]);
  
  const getContentLabel = () => {
    const labels = {
      detach: "분리",
      activate: "활성",
    };
    return labels[action] || "";
  };

  const handleFormSubmit = () => {
    if (!ids.length) return toast.error("실행할 도메인이 없습니다.");

    const actionMap = {
      detach: detachDomain,
      activate: activateDomain,
      // maintenance: maintenanceDomain,
    };
    const actionFn = actionMap[action];

    ids.forEach((domainId) => {
      actionFn({ domainId, dataCenterId: datacenterId });
    });
  };

  return (
    <BaseModal targetName={Localization.kr.DOMAIN} submitTitle={getContentLabel(action)}
      isOpen={isOpen} onClose={onClose}      
      onSubmit={handleFormSubmit}
      promptText={`${names.join(", ")} 를(을) ${getContentLabel(action)} 하시겠습니까?`}
      contentStyle={{ width: "630px", height: "230px" }} 
      shouldWarn={true}
    />
  );
};

export default DomainActionModal;
