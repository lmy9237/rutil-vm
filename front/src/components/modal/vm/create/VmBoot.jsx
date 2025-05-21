import { useEffect } from "react";
import LabelSelectOptions from "../../../label/LabelSelectOptions";
import LabelSelectOptionsID from "../../../label/LabelSelectOptionsID";
import LabelCheckbox from "../../../label/LabelCheckbox";
import { handleInputCheck, handleSelectIdChange } from "../../../label/HandleInput";

const VmBoot = ({
  isos, 
  isIsoLoading,
  formBootState,
  setFormBootState
}) => {
  const handleInputChange = (field) => (e) => {
    setFormBootState((prev) => ({ ...prev, [field]: e.target.value }));
  };
    
  // cd 체크가안되는문제로 변경
  useEffect(() => {
    setFormBootState((prev) => ({
      ...prev,
      isCdDvdChecked: !!formBootState.connVo?.id, // id가 있으면 true, 없으면 false
    }));
  }, [formBootState.connVo?.id]);

  return (
    <div className="host-second-content">
      <div className="cpu-res">
        <div className="py-2 font-bold">부트순서</div>

        <LabelSelectOptions label="첫 번째 장치"
          value={formBootState.firstDevice} 
          options={firstDeviceOptionList} 
          onChange={handleInputChange("firstDevice")} 
        />
        <LabelSelectOptions label="두 번째 장치" 
          value={formBootState.secDevice} 
          options={secDeviceOptionList}
          onChange={handleInputChange("secDevice")} 
        />
      </div>

      <div className="boot-checkboxs flex">
        <LabelCheckbox id="connectCdDvd" label="CD/DVD 연결"
          checked={formBootState.isCdDvdChecked}
          onChange={(e) => {
            const isChecked = e.target.checked;
            const firstIso = isos[0]?.id ? { id: isos[0].id, name: isos[0].name } : { id: "", name: "" };
            
            setFormBootState((prev) => ({
              ...prev,
              isCdDvdChecked: isChecked,
              connVo: isChecked ? firstIso : { id: "", name: "" },
            }));
          }}
        />
        <LabelSelectOptionsID
          value={formBootState.connVo?.id}
          disabled={!formBootState.isCdDvdChecked || isos.length === 0}
          loading={isIsoLoading}
          options={isos}
          onChange={(e) => {
            const selected = isos.find(i => i.id === (e?.target?.value ?? e?.id))
            if (selected) setFormBootState((prev) => ({ ...prev, connVo: { id: selected.id, name: selected.name }}))
            // TODO:handleSelectIdChange를 쓰려면 특정 prop에 값 변경하는 처리가 있어야함
          }}
        />
      </div>

      <LabelCheckbox id="enableBootMenu" label="부팅 메뉴를 활성화"
        checked={formBootState.bootingMenu}
        onChange={handleInputCheck(setFormBootState, "bootingMenu")}
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
  { value: "none", label: "없음" },
  { value: "cdrom", label: "CD-ROM" },
  { value: "network", label: "네트워크(PXE)" },
];
