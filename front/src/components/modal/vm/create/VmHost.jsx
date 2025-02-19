import LabelSelectOptions from "../../../label/LabelSelectOptions";

const VmHost = ({
  editMode,
  hosts,
  formHostState,
  setFormHostState,
}) => {
  const handleHostSelectionChange = (hostInCluster) => {
    setFormHostState((prev) => ({
      ...prev,
      hostInCluster,
      hostVos: hostInCluster ? [] : prev.hostVos,
    }));
  };

  // 마이그레이션 모드
  const migrationModeOptionList = [
    { value: "migratable", label: "수동 및 자동 마이그레이션 허용" },
    { value: "user_migratable", label: "수동 마이그레이션만 허용" },
    { value: "pinned", label: "마이그레이션 불가" },
  ];

  // 마이그레이션 정책
  const migrationPolicyOptionList = [
    { value: "minimal_downtime", label: "Minimal downtime" },
    { value: "post_copy", label: "Post-copy migration" },
    { value: "suspend_workload", label: "Suspend workload if needed" },
    { value: "very_large_vms", label: "Very large VMs" },
  ];

  return (
    <>
      <div className="host-second-content">
        <div style={{ fontWeight: 600 }}>실행 호스트:</div>
        <div className="form-checks">
          <div className="flex">
            <input
              className="form-check-input"
              type="radio"
              name="hostSelection"
              id="clusterHost"
              checked={formHostState.hostInCluster}
              onChange={() => handleHostSelectionChange(true)}
            />
            <label className="form-check-label" htmlFor="clusterHost">
              클러스터 내의 호스트
            </label>
          </div>

          {/* 특정 호스트 선택 */}
          <div className="mb-1">
            <div className="flex">
              <input
                className="form-check-input"
                type="radio"
                name="hostSelection"
                id="specificHost"
                checked={!formHostState.hostInCluster}
                onChange={() => handleHostSelectionChange(false)}
              />
              <label className="form-check-label" htmlFor="specificHost">
                특정 호스트
              </label>
            </div>

            {/* 호스트 선택 Select Box */}
            <div>
              {/* <label>호스트 목록</label> */}
              <select
                multiple
                id="specific_host_select"
                value={
                  formHostState.hostInCluster
                    ? []
                    : (formHostState.hostVos || []).map((host) => host.id)
                }
                onChange={(e) => {
                  const selectedIds = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  );
                  setFormHostState((prev) => ({
                    ...prev,
                    hostVos: hosts.filter((host) =>
                      selectedIds.includes(host.id)
                    ),
                  }));
                }}
                disabled={formHostState.hostInCluster}
                style={{ height: "100px" }}
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
                  {formHostState.hostInCluster || formHostState.hostVos.length === 0
                    ? "선택된 호스트가 없습니다."
                    : formHostState.hostVos.map((host) => host.name).join(", ")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="host-third-content">
          <div style={{ fontWeight: 600 }}>마이그레이션 옵션:</div>
          <LabelSelectOptions
            label={"마이그레이션 모드"}
            value={formHostState.migrationMode}
            onChange={(e) => setFormHostState((prev) => ({
              ...prev,
              migrationMode: e.target.value,
            }))}
            options={migrationModeOptionList}
          />

          {/* <CustomSelect
            label={'마이그레이션 정책'}
            value={formHostState.migrationPolicy}
            onChange={(e) => setFormHostState((prev) => ({ ...prev, migrationPolicy: e.target.value }))}
            options={migrationPolicyOptionList}
          />       */}
        </div>
      </div>
    </>
  );
};

export default VmHost;