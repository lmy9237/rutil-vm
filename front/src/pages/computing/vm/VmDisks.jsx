import useGlobal from "../../../hooks/useGlobal";
import OVirtWebAdminHyperlink from "../../../components/common/OVirtWebAdminHyperlink";
import VmDiskDupl from "../../../components/dupl/VmDiskDupl";
import { useDisksFromVM } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";

/**
 * @name VmDisks
 * @description 가상머신에 종속 된 디스크 목록
 *
 * @prop {string} vmId 가상머신 ID
 * @returns {JSX.Element} VmDisks
 */
const VmDisks = ({
  vmId
}) => {
  const {
    vmsSelected
  } = useGlobal()
  
  const {
    data: disks = [],
    isLoading: isDisksLoading,
    isError: isDisksError,
    isSuccess: isDisksSuccess,
    refetch: refetchDisks,
    isRefetching: isDisksRefetching,
  } = useDisksFromVM(vmId, (e) => ({ ...e }));
  
  return (
    <>
      <VmDiskDupl 
        vmDisks={disks}
        refetch={refetchDisks} isRefetching={isDisksRefetching}
        isLoading={isDisksLoading} isError={isDisksError} isSuccess={isDisksSuccess}
      />
      <OVirtWebAdminHyperlink
        name={`${Localization.kr.COMPUTING}>${Localization.kr.VM}>${vmsSelected[0]?.name}`}
        path={`vms-disks;name=${vmsSelected[0]?.name}`} 
      />
    </>
  );
};

export default VmDisks;
