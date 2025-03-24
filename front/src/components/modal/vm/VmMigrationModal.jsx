import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import BaseModal from "../BaseModal";
import { useHostsForMigration, useMigration } from "../../../api/RQHook";
import "./MVm.css";

const VmMigrationModal = ({
  isOpen,
  onClose,
  selectedVm = {},
  selectedVms,
}) => {
  const [selectedHost, setSelectedHost] = useState();
  const [isHaMode, setIsHaMode] = useState(false);

  // 연결가능한 호스트목록
  const { data: ableHost } = useHostsForMigration(selectedVm.id);

  useEffect(() => {
    if (selectedVm.id) {
      console.log("VM id:", selectedVm.id);
      console.log("ABLEHOST:", ableHost);
    }
  }, [selectedVm.id, ableHost]);

  const { mutate: migration } = useMigration();

  // 되는지 안되는지모름
  const handleFormSubmit = () => {
    migration(
      {
        vmId: selectedVm.id,
        hostId: selectedHost,
      },
      {
        onSuccess: () => {
          console.log("Migration successful");
          onClose();
        },
        onError: (error) => {
          console.error("Migration error:", error);
        },
      }
    );
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={"가상머신"}
      submitTitle={"마이그레이션"}
      onSubmit={handleFormSubmit}
    >
      {/* <div className="migration-popup-content modal"> */}
      <div className="migration-article-outer">
        <span>1대의 가상 머신이 마이그레이션되는 호스트를 선택하십시오.</span>

        <div className="migration-article">
          <div>
            <div className="migration-dropdown f-btw">
              <label htmlFor="host">
                대상 호스트 <FontAwesomeIcon icon={faInfoCircle} fixedWidth />
              </label>

              <select
                id="host"
                value={selectedHost}
                onChange={(e) => setSelectedHost(e.target.value)}
                disabled={!ableHost || ableHost.length === 0}
              >
                {ableHost && ableHost.length > 0 ? (
                  ableHost.map((host) => (
                    <option key={host.id} value={host.id}>
                      {host.name}
                    </option>
                  ))
                ) : (
                  <option value="">사용 가능한 호스트가 없습니다</option>
                )}
              </select>
            </div>
          </div>

          <div className="checkbox_group mb-2">
            <input
              className="check_input"
              type="checkbox"
              id="ha_mode_box"
              checked={isHaMode}
              onChange={() => setIsHaMode(!isHaMode)}
            />
            <label className="check_label" htmlFor="ha_mode_box">
              선택한 가상 머신을 사용하여 양극 강제 연결 그룹의 모든 가상
              시스템을 마이그레이션합니다.
            </label>
            <FontAwesomeIcon
              icon={faInfoCircle}
              style={{ color: "rgb(83, 163, 255)" }}
              fixedWidth
            />
          </div>

          <div>
            <div className="font-bold">가상머신</div>
            <div>{selectedVm?.name || "N/A"}</div>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default VmMigrationModal;
