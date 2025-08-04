import LabelSelectOptionsID             from "@/components/label/LabelSelectOptionsID";
import LabelCheckbox from "@/components/label/LabelCheckbox";
import { RVI16, rvi16ChevronRight } from "@/components/icons/RutilVmIcons";
import { useMemo } from "react";
import Localization from "@/utils/Localization";


const VmMigrationTabVM = ({ 
  vmsSelected, 
  // vmList, 
  hosts,
  targetHostId, 
  setTargetHostId, 
  clusterVo, setIsCluster, 
  affinityClosure, setAffinityClosure 
}) => {
  const vm = useMemo(() => [...vmsSelected][0], [vmsSelected]);
  const hostsWithClusterOption = useMemo(() => {
    if (!clusterVo) return [];

    if (hosts.length > 0) {
      const clusterHostOption = {
        id: clusterVo.id ?? "",
        name: `${Localization.kr.CLUSTER} ${clusterVo?.name} 내의 ${Localization.kr.HOST} 자동선택`,
      };
      return [clusterHostOption, ...hosts];
    }else {
      setTargetHostId("");
    }
  }, [hosts, clusterVo]);

  return (
    <>
      <LabelSelectOptionsID id={`host`} label={`호스트 선택 (현재 ${vmsSelected[0]?.hostVo?.name})`}
        value={targetHostId}
        options={hostsWithClusterOption}
        disabled={hosts.length === 0}
        onChange={(selected) => {
          if (!selected || selected.id === "") {
            setTargetHostId("");
            setIsCluster(false);
            return;
          }
          setTargetHostId(selected.id);
          setIsCluster(selected.id === clusterVo.id);
        }}
      />
      <LabelCheckbox id={`affinity`}
        label={`선택한 ${Localization.kr.VM}을 사용하여 양극 강제 연결 그룹의 모든 가상 시스템을 ${Localization.kr.MIGRATION}합니다.`}
        value=""
        disabled={hosts.length === 0}
        onChange={(checked) => setAffinityClosure(checked)}
        checked={affinityClosure}
      />
      <div className="mt-4">
        {/* 복수의 가상머신이였을 때 */}
        {/* {vmList.map((vm) => (
          <div key={vm.id} className="font-bold flex f-start fs-13 mb-2">
            <div><RVI16 iconDef={rvi16ChevronRight("black")} className="mr-2"/></div>
            {vm.name}
          </div>
        ))} */}
        <div key={vm.id} className="font-bold flex f-start fs-13 mb-2">
          <div><RVI16 iconDef={rvi16ChevronRight("black")} className="mr-2"/></div>
          {vm.name}
        </div>
      </div>
      <br/><br/>
      {/* <div>
        {vm.name} 를 "   " 로 {Localization.kr.MIGRATION} 합니다
      </div>      
      <br/><br/> */}
    </>
  )
};
export default VmMigrationTabVM;