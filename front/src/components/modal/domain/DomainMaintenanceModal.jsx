import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import useGlobal from "../../../hooks/useGlobal";
import BaseModal from "../BaseModal";
import LabelCheckbox from "../../label/LabelCheckbox";
import Localization from "../../../utils/Localization";
import Logger from "../../../utils/Logger";
import { useMaintenanceDomain } from "../../../api/RQHook";

const DomainMaintenanceModal = ({  // TODO: 이름수정 -> DomainMaintenanceModal
  isOpen,
  onClose
}) => {
  const { datacentersSelected, domainsSelected } = useGlobal()
  // 만약 가상머신에 대한 임대가 포함되어 있다면 유지보수 불가능

  const onSuccess = () => {
    onClose();
    toast.success(`${Localization.kr.DOMAIN} 유지보수 완료`);
  }; 
  const { mutate: maintenanceDomain } = useMaintenanceDomain(onSuccess, () => onClose());

  const { ids, names } = useMemo(() => {
    if (!domainsSelected) return { ids: [], names: [] };
    return {
      ids: [...domainsSelected].map((item) => item.id),
      names: [...domainsSelected].map((item) => item.name),
    };
  }, [domainsSelected]);

  const [ignoreOVF, setIgnoreOVF] = useState(false);

  const handleSubmit = () => {
    Logger.debug("OVF 무시:", ignoreOVF);

    [...ids]?.forEach((domainId) => {
      maintenanceDomain({ domainId, dataCenterId: datacentersSelected[0]?.id, ovf: ignoreOVF });
    });
  };

  return (
    <BaseModal targetName={Localization.kr.DOMAIN} submitTitle={Localization.kr.MANAGEMENT}
      isOpen={isOpen} onClose={onClose}      
      promptText={`다음의 ${Localization.kr.DOMAIN}을 유지 ${Localization.kr.MANAGEMENT} 모드로 설정하시겠습니까?`}
      onSubmit={handleSubmit}
      contentStyle={{ width: "600px" }}
      shouldWarn={true}      
    >
      <div className="domain-name-box">
        {names.join(", ")}
      </div>
      
      <LabelCheckbox id="ignoreOvf" label="OVF 업데이트 실패 무시"
        checked={ignoreOVF}
        onChange={(e) => setIgnoreOVF(e.target.checked)}
      /> 
      {/* <span>{ignoreOVF === true ? "t" : "F"}</span> */}
      <br/>
    </BaseModal>
  );
};

export default DomainMaintenanceModal;
