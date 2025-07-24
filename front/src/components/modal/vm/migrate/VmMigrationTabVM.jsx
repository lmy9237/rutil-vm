import LabelSelectOptionsID             from "@/components/label/LabelSelectOptionsID";
import LabelCheckbox from "@/components/label/LabelCheckbox";


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
    <div>
      {vmList.map((vm) => (
        <div key={vm.id} className="flex fw-bold">
          <div className="mr-1.5">- <span>{vm.name}</span></div>
        </div>
      ))}
    </div>
    <br/><br/>
    <LabelCheckbox
      id={`affinity`}
      label={`선택한 가상머신을 사용하여 양극 강제 연결 그룹의 모든 가상 시스템을 마이그레이션합니다.`}
      value=""
      onChange={(e) => setAffinityClosure(e.target.checked)}
      checked={affinityClosure}
    />
  </>
);
export default VmMigrationTabVM;