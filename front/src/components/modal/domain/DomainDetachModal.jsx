import toast from "react-hot-toast";
import BaseModal from "../BaseModal";
import { useDataCenter, useDetachDomain } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";

/**
 * @name DomainDetachModal
 * @description 
 *
 * @prop {boolean} isOpen
 * @returns
 */
const DomainDetachModal = ({ 
  isOpen, 
  onClose, 
  action,
  sourceContext,
  domain, 
  datacenterId
}) => {
  const title = sourceContext === "fromDomain" ? `${Localization.kr.DATA_CENTER}` : `${Localization.kr.DOMAIN}`;
  const label = sourceContext === "fromDomain"
  const onSuccess = () => {
    onClose();
    toast.success(`${title} 분리 완료`);
  };
  const { mutate: detachDomain } = useDetachDomain(onSuccess, () => onClose());
  const { data: datacenter } = useDataCenter(datacenterId);
  
  const handleFormSubmit = () => {
    detachDomain({ domainId: domain?.id, dataCenterId: datacenterId });
  };

  return (
    <BaseModal targetName={title} submitTitle={"분리"}
      isOpen={isOpen} onClose={onClose}      
      onSubmit={handleFormSubmit}
      promptText={`다음 ${label ? `${Localization.kr.DATA_CENTER}에서` : ""}  ${Localization.kr.DOMAIN}를 분리 하시겠습니까?`}
      contentStyle={{ width: "600px"}} 
      shouldWarn={true}
    >
      <div>
        <b>{label ? datacenter?.name : domain?.name}</b>
      </div>

      {!label && (
        <div className="destroy-text">
          The storage domain contains leases for the following VMs/Templates that having disks on other storage domains: .
          Please consider manually remove those VMs/Templates leases or move them before proceeding with the storage domain removal.
        </div>
      )}
      
      <div>분리 작업은 등록되지 않은 상태로 스토리지 도메인에 들어 있는 엔티티를 이동시킵니다.</div>

      <br/>
    </BaseModal>
  );
};

export default DomainDetachModal;
