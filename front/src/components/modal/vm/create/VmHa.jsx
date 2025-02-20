import { useEffect } from "react";
import LabelSelectOptionsID from "../../../label/LabelSelectOptionsID";
import LabelSelectOptions from "../../../label/LabelSelectOptions";
import LabelCheckbox from "../../../label/LabelCheckbox";

const VmHa = ({ editMode, domains, formHaState, setFormHaState }) => {
  const priorityList = [
    { value: 1, label: "낮음" },
    { value: 50, label: "중간" },
    { value: 100, label: "높음" },
  ];

  useEffect(() => {
    // 편집 모드가 아니고, domains가 있을 경우 기본값 설정
    if (!editMode && domains.length > 0) {
      setFormHaState((prev) => ({
        ...prev,
        storageDomainVo: prev.ha ? { id: domains[0].id, name: domains[0].name } : { id: "", name: "" },
      }));
    }
  }, [domains, editMode, setFormHaState]);

  return (
    <>
      <div className="ha-mode-second-content">
{/* <<<<<<< HEAD */}
      <LabelCheckbox
          id="ha_mode_box"
          label="고가용성"
          checked={formHaState.ha}
          onChange={(e) => {
            const isChecked = e.target.checked;
            setFormHaState((prev) => ({
              ...prev,
              ha: isChecked,
              storageDomainVo: isChecked && domains.length > 0 ? { id: domains[0].id, name: domains[0].name } : { id: "", name: "" },
            }));
          }}
        />
{/* =======
        <div className="flex">
          <input
            className="check_input"
            type="checkbox"
            id="ha_mode_box"
            checked={formHaState.ha}
            onChange={(e) => {
              const isChecked = e.target.checked;
              setFormHaState((prev) => ({
                ...prev,
                ha: isChecked,
                storageDomainVo: isChecked && domains.length > 0 ? { id: domains[0].id, name: domains[0].name } : { id: "", name: "" },
              }));
            }}
          />
          <label className="check_label" htmlFor="ha_mode_box">
            고가용성
          </label>
        </div>
>>>>>>> 94a1835 ([fix] vm modal) */}

        <LabelSelectOptionsID
          label="가상 머신 임대 대상 스토리지 도메인"
          value={formHaState.storageDomainVo.id}
          disabled={!formHaState.ha}  // ha가 체크되어야만 활성화됨
          onChange={(e) => {
            const selectedDomain = domains.find((domain) => domain.id === e.target.value);
            setFormHaState((prev) => ({
              ...prev,
              storageDomainVo: { id: selectedDomain.id, name: selectedDomain.name },
            }));
          }}
          options={domains}
        />
        <div><span>{formHaState.storageDomainVo.id}</span></div>
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

        <span className="px-0.5 font-bold">실행/마이그레이션 큐에서 우선순위 : </span> 
        <div className="ha-mode-article">
          <LabelSelectOptions
            label="우선 순위"
            value={formHaState.priority}
            onChange={(e) =>setFormHaState((prev) => ({ ...prev, priority: e.target.value }))}
            options={priorityList}
          />
        </div>
      </div>
    </>
  );
};

export default VmHa;