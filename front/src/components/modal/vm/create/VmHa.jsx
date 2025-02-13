import { useEffect } from "react";
import LabelSelectOptionsID from "../../../label/LabelSelectOptionsID";
import LabelSelectOptions from "../../../label/LabelSelectOptions";

const VmHa = ({ editMode, domains, formHaState, setFormHaState }) => {
  const priorityList = [
    { value: 1, label: "낮음" },
    { value: 50, label: "중간" },
    { value: 100, label: "높음" },
  ];

  useEffect(() => {
    // 도메인 기본값 설정
    if (!editMode && domains.length > 0) {
      setFormHaState((prev) => ({
        ...prev,
        storageDomainVo: domains[0].id, // 첫 번째 도메인 ID 선택
      }));
    }
  }, [domains, editMode, setFormHaState]);

  return (
    <>
      <div className="ha-mode-second-content">
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
                storageDomainVo:
                  isChecked && domains.length > 0 ? domains[0].id : "", // 체크 시 첫 번째 도메인 선택
              }));
            }}
          />
          <label className="check_label" htmlFor="ha_mode_box">
            고가용성
          </label>
        </div>

        <LabelSelectOptionsID
          label="가상 머신 임대 대상 스토리지 도메인"
          value={formHaState.storageDomainVo}
          disabled={!formHaState.ha}
          onChange={(e) =>
            setFormHaState((prev) => ({
              ...prev,
              storageDomainVo: e.target.value,
            }))
          }
          options={domains}
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

        <div className="ha-mode-article">
          <span>실행/마이그레이션 큐에서 우선순위 : </span>
          <LabelSelectOptions
            label="우선 순위"
            value={formHaState.priority}
            onChange={(e) =>
              setFormHaState((prev) => ({ ...prev, priority: e.target.value }))
            }
            options={priorityList}
          />
        </div>
      </div>
    </>
  );
};

export default VmHa;