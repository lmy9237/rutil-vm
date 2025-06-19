import { useEffect } from "react";
import LabelSelectOptions     from "@/components/label/LabelSelectOptions";
import {
  handleInputChange,
} from "@/components/label/HandleInput";
import {
  useAllMigrationSupports
} from "@/api/RQHook"
import Localization           from "@/utils/Localization";
import Logger                 from "@/utils/Logger";
import { useValidationToast } from "@/hooks/useSimpleToast";


const VmHost = ({
  hosts,
  formHostState,
  setFormHostState
}) => {
  const { validationToast } = useValidationToast()
  const {
    data: migrationSupports = [],
    isLoading: isMigrationSupportsLoading
  } = useAllMigrationSupports((e) => ({ 
    ...e,
    value: e?.id,
    label: e?.kr
  }))
  // 마이그레이션 모드
  /*
  const migrationModeOptionList = [
    { value: "migratable", label: `수동 및 자동 ${Localization.kr.MIGRATION} 허용` },
    { value: "user_migratable", label: `수동 마이그레이션만 허용` },
    { value: "pinned", label: `${Localization.kr.MIGRATION} 불가` },
  ];
  */

  // hostVos 값이 있으면 hostInCluster를 false로 설정, 없으면 true
  useEffect(() => {
    if (formHostState.hostVos.length > 0) {
      setFormHostState((prev) => ({ 
        ...prev,
        // hostVos: hosts.filter((h) => prev.hostVos.map((hh) => hh?.id).includes(h?.id)),
        hostInCluster: false 
      }));
    } else {
      setFormHostState((prev) => ({ 
        ...prev,
        hostInCluster: true
      }));
    }
  }, [hosts, formHostState.hostVos, setFormHostState]);

  return (
    <div className="host-second-content">
      <div className="py-2">
        <div style={{ fontWeight: 600 }}>실행 호스트</div>
        <div className="form-checks">
          <div className="f-start">
            <input
              type="radio"
              name="hostSelection"
              id="clusterHost"
              checked={formHostState.hostInCluster}
              onChange={() =>
                setFormHostState((prev) => ({
                  ...prev,
                  hostInCluster: true,
                  hostVos: [],
                }))
              }
            />
            <label className="form-check-label" htmlFor="clusterHost">
              {Localization.kr.CLUSTER} 내의 호스트
            </label>
          </div>

          {/* 특정 호스트 선택 */}
          <div className="select-host" >
            <div className="f-center h-4">
              <input
                className="form-check-input"
                type="radio"
                name="hostSelection"
                id="specificHost"
                checked={!formHostState.hostInCluster}
                onChange={() => setFormHostState((prev) => ({ ...prev, hostInCluster: false }))}
              />
              <label className="form-check-label" htmlFor="specificHost">
                특정 호스트
              </label>
            </div>
            <div>
              <select
                multiple
                value={formHostState.hostVos.map((host) => host.id)}
                onChange={(e) => {
                  const selectedIds = Array.from(e.target.selectedOptions, (option) => option.value);
                  Logger.debug(`선택된 호스트 ID 목록: ${selectedIds}`);
                  setFormHostState((prev) => ({
                    ...prev,
                    hostVos: hosts.filter((host) => selectedIds.includes(host.id)),
                  }));
                }}
                disabled={formHostState.hostInCluster}
              >
                <div className="host-select-list">
                  {hosts.map((host) => {
                    const isSelected = formHostState.hostVos.some((h) => h.id === host.id);
                    return (
                      <div
                        key={host.id}
                        className={`host-option-item p-1 ${isSelected ? "selected" : ""}`}
                        onClick={() => {
                          const updated = isSelected
                            ? formHostState.hostVos.filter((h) => h.id !== host.id) // 제거
                            : [...formHostState.hostVos, host]; // 추가

                          setFormHostState((prev) => ({
                            ...prev,
                            hostVos: updated,
                          }));
                        }}
                      >
                        {host.name}
                      </div>
                    );
                  })}
                </div>
              </select>
              <div style={{ marginTop: "10px" }}>
                <label>선택된 호스트:</label>
                <span style={{ 
                  marginLeft: "10px",
                  fontWeight: "bold"
                  }}
                >
                  {formHostState.hostVos && formHostState.hostVos.length > 0
                    ? formHostState.hostVos.map((h) => h?.name).join(", ") // id는 host.id로 출력
                    : "선택된 호스트가 없습니다."}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 마이그레이션 옵션 */}
      <div className="host-third-content">
        <div className="py-2" style={{ fontWeight: 600 }}>{Localization.kr.MIGRATION} 옵션</div>
        <LabelSelectOptions label={`${Localization.kr.MIGRATION} 모드`}
          value={formHostState.migrationMode}
          options={migrationSupports}
          loading={isMigrationSupportsLoading}
          onChange={handleInputChange(setFormHostState, "migrationMode", validationToast)}
        />
      </div>
    </div>
  );
};

export default VmHost;
