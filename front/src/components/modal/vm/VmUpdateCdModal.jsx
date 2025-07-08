import { useEffect, useMemo, useState } from "react";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import useGlobal                        from "@/hooks/useGlobal";
import BaseModal                        from "@/components/modal/BaseModal";
import LabelSelectOptionsID             from "@/components/label/LabelSelectOptionsID";
import {
  handleSelectIdChange
} from "@/components/label/HandleInput"
import {
  useCdromFromVm,
  useCDFromDataCenter,
  useUpdateCdromFromVM,
  useVm,
} from "@/api/RQHook";
import { emptyIdNameVo }                from "@/util";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";
/**
 * @name VmUpdateCdModal
 * @description CD변경 모달
 * 
 * @returns {JSX.Element} CD변경 모달
 */
const VmUpdateCdModal = ({
  isOpen, 
  onClose,
}) => {
  const { validationToast } = useValidationToast();
  const { vmsSelected, datacentersSelected } = useGlobal()
  const [dataCenterVo, setDataCenterVo] = useState(emptyIdNameVo());
  const [updateCdromVo, setUpdateCdromVo] = useState(emptyIdNameVo());

  const {
    data: cdroms = [],
    isLoading: isCdromsLoading,
  } = useCDFromDataCenter(dataCenterVo.id || undefined, (e) => ({ 
    ...e
  }));

  const { 
    data: vm = {}
  } = useVm(vmsSelected[0]?.id || undefined);
  
  const {
    data: cdrom,
    isLoading: isCdromLoading,
  } = useCdromFromVm(vmsSelected[0]?.id || undefined, true);

  const {
    mutate: updateCdromFromVm,
  } = useUpdateCdromFromVM(onClose, onClose);

  useEffect(() => {
    Logger.debug(`VmUpdateCdModal > useEffect ...`)
    if (vm && vm?.id) {
      setDataCenterVo(vm?.dataCenterVo)
    }
  }, [vm, vmsSelected])

  useEffect(() => {
    Logger.debug(`VmUpdateCdModal > useEffect ... cdroms FOUND! cdRom.id: ${cdrom?.id}`)
    setUpdateCdromVo({
      id: cdrom?.id,
      name: "",
    })
  }, [cdrom])
  
  const validateForm = () => {    
    Logger.debug(`VmUpdateCdModal > validateForm ... updateCdromVo: `, updateCdromVo)
    return null;
  }

  const handleFormSubmit = () => {
    Logger.debug(`VmUpdateCdModal > handleFormSubmit ...`)
    const error = validateForm();
    if (error) {
      validationToast.fail(error);
      return;
    }

    updateCdromFromVm({
      vmId: vmsSelected[0]?.id, 
      cdromFileId: updateCdromVo?.id,
      current: true,
    })
  }

  return (
    <BaseModal targetName={Localization.kr.VM} submitTitle={Localization.kr.UPDATE_CDROM}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "600px" }}
    >
      <LabelSelectOptionsID label={Localization.kr.CDROM_2UPDATE}
        value={updateCdromVo?.id || ""}
        disabled={[...cdroms].length === 0}
        loading={isCdromsLoading}
        options={cdroms}
        onChange={handleSelectIdChange(setUpdateCdromVo, cdroms, validationToast)}
      />
    </BaseModal>
  );
};

export default VmUpdateCdModal;
