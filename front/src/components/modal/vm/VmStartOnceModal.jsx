import { useValidationToast }           from "@/hooks/useSimpleToast";
import BaseModal                        from "@/components/modal/BaseModal";
import {
  useCDFromDataCenter,
  useStartVM,
  useVm
} from "@/api/RQHook";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";
import LabelCheckbox from "@/components/label/LabelCheckbox";
import { useEffect, useMemo, useState } from "react";
import { emptyIdNameVo } from "@/util";
import useGlobal from "@/hooks/useGlobal";
import { handleInputCheck } from "@/components/label/HandleInput";
import LabelSelectOptionsID from "@/components/label/LabelSelectOptionsID";


const initialFormState = {
  id: "",
  isCdDvdChecked: false,
  cdRomVo: emptyIdNameVo(),
  windowGuest: false,
  biosBootMenu: true,
};

const VmStartOnceModal = ({
  isOpen,
  onClose,
}) => {  
  const { validationToast } = useValidationToast();
  const { vmsSelected } = useGlobal();
  const vmId = useMemo(() => [...vmsSelected][0]?.id, [vmsSelected]);
  
  const [formState, setFormState] = useState(initialFormState);

  const { data: vm } = useVm(vmId);

  // 부트 옵션 - cd/dvd 연결
  const { 
    data: isos = [], 
    isLoading: isIsoLoading 
  } = useCDFromDataCenter(vm?.dataCenterVo.id, (e) => ({ ...e }));
  
  useEffect(() => {
    if (formState.isCdDvdChecked && isos.length > 0 && formState.cdRomVo.id === "") {
      const firstIso = { id: isos[0].id, name: isos[0].name };
      setFormState((prev) => ({ ...prev, cdRomVo: firstIso }));
    }
  }, [isos, formState.isCdDvdChecked]);


  const validateForm = () => {
    Logger.debug(`VmActionModal > validateForm ... `)
    if(formState.cdRomVo.id === "") return "파일을 선택해주세요";
    return null
  }


  const handleSubmit = () => {
    const error = validateForm();
    if (error) {
      validationToast.fail(error);
      return;
    }
    Logger.debug(`VmStartOnceModal > handleSubmit ... `)
  };

  return (
    <BaseModal targetName={Localization.kr.VM} submitTitle={`${Localization.kr.START} 옵션`}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleSubmit}
      contentStyle={{ width: "650px" }}
    > 
      <span>- 부트 옵션</span>
      <div className="f-btw">
        <LabelCheckbox id="connectCdDvd" label="CD/DVD 연결"
          checked={formState.isCdDvdChecked}
          onChange={(e) => {
            const isChecked = e.target.checked;
            const firstIso = isos[0]?.id ? { id: isos[0].id, name: isos[0].name } : emptyIdNameVo();
            setFormState((prev) => ({
              ...prev,
              isCdDvdChecked: isChecked,
              cdRomVo: isChecked ? firstIso : emptyIdNameVo(),
              windowGuest: isChecked ? prev.windowGuest : false,
            }));
          }}
        />
        <div style={{width:"55%"}}>
          <LabelSelectOptionsID
            value={formState.cdRomVo?.id}
            disabled={!formState.isCdDvdChecked || isos.length === 0}
            loading={isIsoLoading}
            options={isos}
            onChange={(e) => {
              const selected = isos.find(i => i.id === (e?.target?.value ?? e?.id))
              if (selected) setFormState((prev) => ({ ...prev, cdRomVo: { id: selected.id, name: selected.name }}))
            }}
          />
        </div>
      </div>

      <LabelCheckbox id="windowGuest" label="Windows 게스트 툴 CD 첨부"
        disabled={!formState.isCdDvdChecked}
        checked={formState.windowGuest}
        onChange={handleInputCheck(setFormState, "windowGuest")}
      />

      <LabelCheckbox id="enableBootMenu" label="부팅 메뉴를 활성화"
        checked={formState.biosBootMenu}
        onChange={handleInputCheck(setFormState, "biosBootMenu")}
      />

    </BaseModal>
  );
};

export default VmStartOnceModal;
