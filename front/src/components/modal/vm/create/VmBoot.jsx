import { useEffect } from "react";
import LabelSelectOptions from "../../../label/LabelSelectOptions";
import LabelSelectOptionsID from "../../../label/LabelSelectOptionsID";
import LabelCheckbox from "../../../label/LabelCheckbox";

const firstDeviceOptionList = [
  { value: "hd", label: "하드 디스크" },
  { value: "cdrom", label: "CD-ROM" },
  { value: "network", label: "네트워크(PXE)" },
];

const secDeviceOptionList = [
  { value: "", label: "없음" },
  { value: "cdrom", label: "CD-ROM" },
  { value: "network", label: "네트워크(PXE)" },
];

const VmBoot = ({ editMode, isos, formBootState, setFormBootState }) => {
  const handleInputChange = (field) => (e) => {
    setFormBootState((prev) => ({ ...prev, [field]: e.target.value }));
  };

  useEffect(() => {
    // `cdConn.id`가 존재하면 `isCdDvdChecked`를 true, 없으면 false
    setFormBootState((prev) => ({
      ...prev,
      isCdDvdChecked: Boolean(prev.cdConn?.id),
    }));
  }, [formBootState.cdConn?.id]);

  return (
    <div className="host-second-content">
      <div className="cpu-res">
        <div className="p-2 font-bold">부트순서:</div>
          <LabelSelectOptions className="cpu-res-box" label="첫 번째 장치" value={formBootState.firstDevice} onChange={handleInputChange("firstDevice")} options={firstDeviceOptionList} />
          <LabelSelectOptions className="cpu-res-box" label="두 번째 장치" value={formBootState.secDevice} onChange={handleInputChange("secDevice")} options={secDeviceOptionList}/>
      </div>

      <div className="boot-checkboxs">
        <div className="center">
          <LabelCheckbox
            id="connectCdDvd"
            label="CD/DVD 연결"
            checked={formBootState.isCdDvdChecked}
            onChange={(e) => {
              const isChecked = e.target.checked;
              setFormBootState((prev) => ({
                ...prev,
                isCdDvdChecked: isChecked,
                cdConn: isChecked ? { id: isos[0]?.id || "" } : { id: "" },
              }));
            }}
          />
          <LabelSelectOptionsID
            disabled={!formBootState.isCdDvdChecked || isos.length === 0}
            value={formBootState.cdConn?.id}
            onChange={(e) => setFormBootState((prev) => ({ ...prev, cdConn: { id: e.target.value },})) }
            options={isos}
          />
        </div>
        <LabelCheckbox
          id="enableBootMenu"
          label="부팅 메뉴를 활성화"
          checked={formBootState.bootingMenu}
          onChange={(e) =>
            setFormBootState((prev) => ({
              ...prev,
              bootingMenu: e.target.checked,
            }))
          }
        />
      </div>
    </div>
  );
};

export default VmBoot;
