import { useEffect } from "react";
import LabelSelectOptions from "../../../label/LabelSelectOptions";
import Localization from "../../../../utils/Localization";

// 마이그레이션 모드
const migrationModeOptionList = [
  { value: "migratable", label: "수동 및 자동 마이그레이션 허용" },
  { value: "user_migratable", label: "수동 마이그레이션만 허용" },
  { value: "pinned", label: "마이그레이션 불가" },
];

const VmHost = ({ editMode, hosts, formHostState, setFormHostState }) => {
  // hostVos 값이 있으면 hostInCluster를 false로 설정, 없으면 true
  useEffect(() => {
    if (formHostState.hostVos.length > 0) {
      setFormHostState((prev) => ({ ...prev, hostInCluster: false }));
    } else {
      setFormHostState((prev) => ({ ...prev, hostInCluster: true }));
    }
  }, [formHostState.hostVos, setFormHostState]);

  return (
    <div className="host-second-content">
      <div className="py-2">
        <div style={{ fontWeight: 600 }}>실행 호스트:</div>
        <div className="form-checks">
          <div className="f-start">
            <input
              className="form-check-input"
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
          <div id="select-host" >
            <div className="center  h-4">
              <input
                className="form-check-input"
                type="radio"
                name="hostSelection"
                id="specificHost"
                checked={!formHostState.hostInCluster}
                onChange={() =>
                  setFormHostState((prev) => ({
                    ...prev,
                    hostInCluster: false,
                  }))
                }
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
                  console.log("선택된 호스트 ID 목록:", selectedIds);
                  setFormHostState((prev) => ({
                    ...prev,
                    hostVos: hosts.filter((host) => selectedIds.includes(host.id)),
                  }));
                }}
                disabled={formHostState.hostInCluster}
              >
                {hosts.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name}
                  </option>
                ))}
              </select>

              <div style={{ marginTop: "10px" }}>
                <label>선택된 호스트:</label>
                <span style={{ marginLeft: "10px", fontWeight: "bold" }}>
                  {formHostState.hostVos && formHostState.hostVos.length > 0
                    ? formHostState.hostVos.map((host) => host.id).join(", ")
                    : "선택된 호스트가 없습니다."}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 마이그레이션 옵션 */}
      <div className="host-third-content">
        <div className="py-2" style={{ fontWeight: 600 }}>마이그레이션 옵션:</div>
        <LabelSelectOptions
          label={"마이그레이션 모드"}
          value={formHostState.migrationMode}
          onChange={(e) => setFormHostState((prev) => ({ ...prev, migrationMode: e.target.value, }))}
          options={migrationModeOptionList}
        />
      </div>
    </div>
  );
};

export default VmHost;
