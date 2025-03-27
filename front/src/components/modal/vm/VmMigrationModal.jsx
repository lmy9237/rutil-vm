import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import BaseModal from "../BaseModal";
import { useHostsForMigration, useMigration } from "../../../api/RQHook";
import "./MVm.css";
import LabelCheckbox from "../../label/LabelCheckbox";
import LabelSelectOptions from "../../label/LabelSelectOptions";

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
          onClose();
          console.log("Migration successful");
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
      contentStyle={{ width: "770px"}}
    >
      {/* <div className="migration-popup-content modal"> */}
      <div className="migration-article-outer">
        <h1>1대의 가상 머신이 마이그레이션되는 호스트를 선택하십시오.</h1>

        <div className="migration-article">
          <LabelSelectOptions
            className="migration-dropdown f-btw"
            id="host"
            label="대상 호스트"
            value={selectedHost}
            onChange={(e) => setSelectedHost(e.target.value)}
            disabled={!ableHost || ableHost.length === 0}
            options={
              ableHost && ableHost.length > 0
                ? ableHost.map((host) => ({
                    value: host.id,
                    label: host.name,
                  }))
                : [{ value: "", label: "사용 가능한 호스트가 없습니다" }]
            }
          />

          <LabelCheckbox
            className="checkbox_group mb-2"
            id="ha_mode_box"
            label="선택한 가상 머신을 사용하여 양극 강제 연결 그룹의 모든 가상 시스템을 마이그레이션합니다."
            checked={isHaMode}
            onChange={() => setIsHaMode(!isHaMode)}
          />

     
          <div>가상머신 : {selectedVm?.name || ""}</div>
        </div>
      </div>
    </BaseModal>
  );
};

export default VmMigrationModal;
