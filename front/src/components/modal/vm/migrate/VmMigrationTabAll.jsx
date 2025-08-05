import { Separator }                    from "@/components/ui/separator"
import VmMigrationTabDisk               from "@/components/modal/vm/VmMigrationTabDisk";
import VmMigrationTabVM                 from "@/components/modal/vm/VmMigrationTabVM";

const VmMigrationTabAll = ({
  // VM 관련 props
  vmsSelected, vmList, targetHostId, setTargetHostId,
  clusterVo, hostsWithClusterOption, isCluster, setIsCluster,
  affinityClosure, setAffinityClosure,

  // Disk 관련 props
  diskList, domainList, targetDomains, setTargetDomains
}) => (
  <>
    <VmMigrationTabVM
      vmsSelected={vmsSelected}
      vmList={vmList}
      targetHostId={targetHostId}
      setTargetHostId={setTargetHostId}
      clusterVo={clusterVo}
      hostsWithClusterOption={hostsWithClusterOption}
      setIsCluster={setIsCluster}
      affinityClosure={affinityClosure}
      setAffinityClosure={setAffinityClosure}
    />
    <Separator />
    <VmMigrationTabDisk
      diskList={diskList}
      domainList={domainList}
      targetDomains={targetDomains}
      setTargetDomains={setTargetDomains}
    />
  </>
);

export default VmMigrationTabAll;