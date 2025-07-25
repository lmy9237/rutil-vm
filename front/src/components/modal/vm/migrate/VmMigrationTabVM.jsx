import LabelSelectOptionsID             from "@/components/label/LabelSelectOptionsID";
import LabelCheckbox from "@/components/label/LabelCheckbox";
import { RVI16, rvi16ChevronRight } from "@/components/icons/RutilVmIcons";


const VmMigrationTabVM = ({ 
  vmsSelected, 
  vmList, 
  targetHostId, 
  hostsWithClusterOption, 
  setTargetHostId, 
  clusterVo, setIsCluster, 
  affinityClosure, setAffinityClosure 
}) => (
  <>
    <LabelSelectOptionsID id={`host`} label={`호스트 선택 (현재 ${vmsSelected[0]?.hostVo?.name})`}
      value={targetHostId}
      options={hostsWithClusterOption}
      onChange={(selected) => {
        if (selected?.id === "none") {
          setTargetHostId("");
          setIsCluster(false);
          return;
        }
        setTargetHostId(selected?.id ?? "");
        setIsCluster(selected?.id === clusterVo.id);
      }}
    />
    <LabelCheckbox
      id={`affinity`}
      label={`선택한 가상머신을 사용하여 양극 강제 연결 그룹의 모든 가상 시스템을 마이그레이션합니다.`}
      value=""
      onChange={(e) => setAffinityClosure(e.target.checked)}
      checked={affinityClosure}
    />
    <div className="mt-4">
      {vmList.map((vm) => (
        <div key={vm.id} className="font-bold flex f-start fs-13 mb-2">
          <div><RVI16 iconDef={rvi16ChevronRight("black")} className="mr-2"/></div>
          {vm.name}
        </div>
      ))}
    </div>
    <br/><br/>
 
  </>
);
export default VmMigrationTabVM;