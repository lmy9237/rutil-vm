import { useMemo, useState } from "react";
import LabelCheckbox from "../../label/LabelCheckbox";
import BaseModal from "../BaseModal";
import Localization from "../../../utils/Localization";
import Logger from "../../../utils/Logger";
import toast from "react-hot-toast";
import { useMaintenanceDomain } from "../../../api/RQHook";
import useGlobal from "../../../hooks/useGlobal";

const DomainMainTenanceModal = ({ isOpen, onClose }) => {
  const { datacentersSelected, domainsSelected } = useGlobal()

  const onSuccess = () => {
    onClose();
    toast.success(`${Localization.kr.DOMAIN} 유지보수 완료`);
  };  
  const { mutate: maintenanceDomain } = useMaintenanceDomain(onSuccess, () => onClose());

  const { ids, names } = useMemo(() => {
    if (!domainsSelected) return { ids: [], names: [] };

    const dataArray = Array.isArray(domainsSelected) ? domainsSelected : [domainsSelected];
    return {
      ids: dataArray.map((item) => item.id),
      names: dataArray.map((item) => item.name),
    };
  }, [domainsSelected]);

  const [ignoreOVF, setIgnoreOVF] = useState(false);

  const handleSubmit = () => {
    Logger.debug("OVF 무시:", ignoreOVF);

    ids.forEach((domainId) => {
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
      <span>{ignoreOVF === true ? "t" : "F"}</span>
      <br/>
    </BaseModal>
  );
};

export default DomainMainTenanceModal;
