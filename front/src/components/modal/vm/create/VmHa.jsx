import { useEffect } from "react";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import LabelSelectOptionsID             from "@/components/label/LabelSelectOptionsID";
import LabelSelectOptions               from "@/components/label/LabelSelectOptions";
import LabelCheckbox                    from "@/components/label/LabelCheckbox";
import { 
  handleInputChange
} from "@/components/label/HandleInput";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";

const VmHa = ({
  editMode,
  domains,
  formHaState, setFormHaState
}) => {
  const { validationToast } = useValidationToast()
  
  useEffect(() => {
    if (!editMode && domains.length > 0) {
      setFormHaState((prev) => {
        if (prev.ha && (!prev.storageDomainVo.id || prev.storageDomainVo.id === "")) {
          return {
            ...prev,
            storageDomainVo: { id: domains[0].id, name: domains[0].name },
          };
        }
        return prev;
      });
    }
  }, [domains, editMode, setFormHaState]);

  return (
    <>
      <LabelCheckbox id="ha_mode_box" label={Localization.kr.HA}
        checked={formHaState.ha}
        onChange={(e) => {
          const isChecked = e.target.checked;
          setFormHaState((prev) => ({
            ...prev,
            ha: isChecked,
            storageDomainVo: isChecked
              ? (domains[0] ? { id: domains[0].id, name: domains[0].name } : { id: "", name: "" })
              : { ...prev.storageDomainVo }, // 값 유지
          }));
        }}
      />
      <LabelSelectOptionsID
        label={`${Localization.kr.VM} 임대 대상 ${Localization.kr.DOMAIN}`}
        value={formHaState.storageDomainVo.id}
        disabled={!formHaState.ha}  // ha가 체크되어야만 활성화됨
        options={[ ...domains ]}
        onChange={(e) => {
          const selectedDomain = [...domains]?.find((domain) => domain.id === (e?.target?.value ?? e?.id));
          if (selectedDomain) {
            setFormHaState((prev) => ({
              ...prev, 
              storageDomainVo: { id: selectedDomain.id, name: selectedDomain.name },
            }));
          } else {
            setFormHaState((prev) => ({
              ...prev,
              storageDomainVo: { id: "", name: "" },
            }));
          }
        }}
      />
        {/* <div>
        <div>
          <span>재개 동작</span>
          <FontAwesomeIcon
            icon={faInfoCircle}
            style={{ color: "rgb(83, 163, 255)" }}
            fixedWidth
          />
        </div>
        <select id="force_shutdown">
          <option value="강제 종료">강제 종료</option>
        </select>
      </div> */}
      <div className="py-2 font-bold">실행/{Localization.kr.MIGRATION} 큐에서 우선순위</div> 
      
      <LabelSelectOptions label="우선 순위"
        value={formHaState.haPriority}
        options={priorities}
        onChange={handleInputChange(setFormHaState, "haPriority", validationToast)}
      />
    </>
  );
};

export default VmHa;

const priorities = [
  { value: 1, label: "낮음" },
  { value: 50, label: "중간" },
  { value: 100, label: "높음" },
];