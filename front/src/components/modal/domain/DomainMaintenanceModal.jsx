import { useMemo, useState } from "react";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import BaseModal from "../BaseModal";
import LabelCheckbox from "../../label/LabelCheckbox";
import Localization from "../../../utils/Localization";
import Logger from "../../../utils/Logger";
import { useMaintenanceDomain } from "../../../api/RQHook";
import { RVI16, rvi16ChevronRight } from "@/components/icons/RutilVmIcons";

const DomainMaintenanceModal = ({
  isOpen,
  onClose,
}) => {
  // const { closeModal } = useUIState()
  const { datacentersSelected, domainsSelected } = useGlobal()
  // 만약 가상머신에 대한 임대가 포함되어 있다면 유지보수 불가능

  const { mutate: maintenanceDomain } = useMaintenanceDomain(onClose, onClose);

  const { ids, names } = useMemo(() => {
    if (!domainsSelected) return { ids: [], names: [] };
    return {
      ids: [...domainsSelected].map((item) => item.id),
      names: [...domainsSelected].map((item) => item.name),
    };
  }, [domainsSelected]);

  const [ignoreOVF, setIgnoreOVF] = useState(false);

  const handleSubmit = () => {
    Logger.debug("DomainMaintenanceModal > handleSubmit ... OVF 무시:", ignoreOVF);

    [...ids]?.forEach((domainId) => {
      maintenanceDomain({ domainId, dataCenterId: datacentersSelected[0]?.id, ovf: ignoreOVF });
    });
  };

  return (
    <BaseModal targetName={Localization.kr.DOMAIN} submitTitle={Localization.kr.MAINTENANCE}
      isOpen={isOpen} onClose={onClose}
      promptText={`다음의 ${Localization.kr.DOMAIN}을 ${Localization.kr.MAINTENANCE} 모드로 설정하시겠습니까?`}
      onSubmit={handleSubmit}
      isReady={!!(datacentersSelected.length && domainsSelected.length)}
      contentStyle={{ width: "600px" }}
      shouldWarn={true}      
    >
      <div className="flex f-start font-bold mb-3">
        <RVI16 iconDef={rvi16ChevronRight("black")} className="mr-2"/>
        {names.join(", ")}
      </div>
      
      <LabelCheckbox id="ignoreOvf" label="OVF 업데이트 실패 무시"
        checked={ignoreOVF}
        // onChange={(e) => setIgnoreOVF(e.target.checked)}
        onChange={(checked) => {
          validationToast.debug(`ignoreOVF: ${checked}`);
          setIgnoreOVF(checked)
        }}
      /> 
      {/* <span>{ignoreOVF === true ? "t" : "F"}</span> */}
      <br/>
    </BaseModal>
  );
};

export default DomainMaintenanceModal;
