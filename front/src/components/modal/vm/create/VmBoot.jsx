import { useEffect } from "react";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import LabelSelectOptions               from "@/components/label/LabelSelectOptions";
import LabelSelectOptionsID             from "@/components/label/LabelSelectOptionsID";
import LabelCheckbox                    from "@/components/label/LabelCheckbox";
import { 
  handleInputCheck,
  handleInputChange,
  handleSelectIdChange
} from "@/components/label/HandleInput";
import { emptyIdNameVo }                from "@/util";
import Logger                           from "@/utils/Logger";


const VmBoot = ({
  isos, 
  isIsoLoading,
  formBootState,
  setFormBootState,
  setFetchIsosOnce
}) => {
  const { validationToast } = useValidationToast();
  
  /* const handleInputChange = (field) => (e) => {
    Logger.debug(`VmBoot > handleInputChange ... field: ${field}, value: ${e.target.value}`)
    validationToast.debug(`field: ${field}, value: ${e.target.value}`)
    setFormBootState((prev) => ({ ...prev, [field]: e.target.value }));
  }; */
    
  // cd 체크가안되는문제로 변경
  useEffect(() => {
    Logger.debug(`VmBoot > useEffect ... cdRomVo: `, formBootState.cdRomVo)
    setFormBootState((prev) => ({
      ...prev,
      isCdDvdChecked: !!formBootState.cdRomVo?.id, // id가 있으면 true, 없으면 false
    }));
    setFetchIsosOnce(false)
    // 한번만 실행
  }, []);

  return (
    <div className="host-second-content">
      <div className="cpu-res">
        <div className="py-2 font-bold">부트순서</div>

        <LabelSelectOptions id="firstDevice" label="첫 번째 장치"
          value={formBootState.firstDevice} 
          options={firstDeviceOptionList} 
          onChange={handleInputChange(setFormBootState, "firstDevice", validationToast)} 
        />
        <LabelSelectOptions id="secDevice" label="두 번째 장치" 
          value={formBootState.secDevice}
          options={secDeviceOptionList}
          onChange={handleInputChange(setFormBootState, "secDevice", validationToast)} 
          placeholderLabel="없음"
          placeholderValue="none"
        />
      </div>

      <div className="f-btw">
        <LabelCheckbox id="connectCdDvd" label="CD/DVD 연결"
          checked={formBootState.isCdDvdChecked}
          disabled={isos.length === 0}
          onChange={(checked) => {
            const firstIso = isos[0]?.id 
              ? { id: isos[0].id, name: isos[0].name }
              : emptyIdNameVo();
            const _cdRomVo = checked ? firstIso : emptyIdNameVo()
            validationToast.debug(`field: isCdDvdChecked, value: ${checked}\nfield: cdRomVo: value: ${JSON.stringify(_cdRomVo, 2, null)}`)
            setFormBootState((prev) => ({
              ...prev,
              isCdDvdChecked: checked,
              cdRomVo: _cdRomVo,
            }));
          }}
          /* 
          onChange={(e) => {
            const isChecked = e.target.checked;
            const firstIso = isos[0]?.id ? { id: isos[0].id, name: isos[0].name } : emptyIdNameVo();
            
            setFormBootState((prev) => ({
              ...prev,
              isCdDvdChecked: isChecked,
              cdRomVo: isChecked ? firstIso : emptyIdNameVo(),
            }));
          }}
          */
        />
        <div style={{width:"55%"}}>
          <LabelSelectOptionsID
            value={formBootState.cdRomVo?.id}
            disabled={!formBootState.isCdDvdChecked}
            loading={isIsoLoading}
            options={isos}
            onChange={(e) => {
              const selected = isos.find(i => i.id === (e?.target?.value ?? e?.id))
              if (selected) {
                const _cdRomVo = {
                  id: selected.id, 
                  name: selected.name,
                }
                validationToast.debug(`field: cdRomVo, value: ${JSON.stringify(_cdRomVo, 2, null)}`)
                setFormBootState((prev) => ({ ...prev, cdRomVo: { ..._cdRomVo }}))
              }
            }}
          />
        </div>
      </div>

      <LabelCheckbox id="enableBootMenu" label="부팅 메뉴를 활성화"
        checked={formBootState.biosBootMenu}
        onChange={handleInputCheck(setFormBootState, "biosBootMenu")}
      />
    </div>
  );
};

export default VmBoot;

const firstDeviceOptionList = [
  { value: "hd", label: "하드 디스크" },
  { value: "cdrom", label: "CD-ROM" },
  { value: "network", label: "네트워크(PXE)" },
];

const secDeviceOptionList = [
  { value: "cdrom", label: "CD-ROM" },
  { value: "network", label: "네트워크(PXE)" },
];
