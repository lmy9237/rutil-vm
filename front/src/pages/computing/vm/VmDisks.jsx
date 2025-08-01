import { useMemo } from "react";
import useGlobal              from "@/hooks/useGlobal";
import OVirtWebAdminHyperlink from "@/components/common/OVirtWebAdminHyperlink";
import VmDiskDupl             from "@/components/dupl/VmDiskDupl";
import {
  useAllDiskAttachmentsFromVm,
  useAllSnapshotsFromVm
} from "@/api/RQHook";
import Localization           from "@/utils/Localization";
import Loading from "@/components/common/Loading";

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
  const { vmsSelected } = useGlobal()
  
  const {
    data: disks = [],
    isLoading: isDisksLoading,
    isError: isDisksError,
    isSuccess: isDisksSuccess,
    refetch: refetchDisks,
    isRefetching: isDisksRefetching,
  } = useAllDiskAttachmentsFromVm(vmId, (e) => ({ ...e }));
  
  // 스냅샷에서 미리보기(in_preview) 상태 확인
  const {
    data: snapshots = [],
    isLoading: isSnapshotsLoading
  } = useAllSnapshotsFromVm(vmId, (e) => ({ ...e }));

  const hasPreviewSnapshot = useMemo(() => {
    return snapshots.some(snap => snap?.status?.toUpperCase() === "in_preview");
  }, [snapshots]);

  return (
    <>
     {isSnapshotsLoading ? (
        <Loading />
      ) : hasPreviewSnapshot ? (
        <div className="text-center p-20 text-red-500 font-semibold w-full">
          {Localization.kr.SNAPSHOT} 미리보기 상태에서는 {Localization.kr.DISK} 정보를 표시할 수 없습니다.
        </div>
      ) : (  
        <VmDiskDupl 
          vmDisks={disks}
          refetch={refetchDisks} isRefetching={isDisksRefetching}
          isLoading={isDisksLoading} isError={isDisksError} isSuccess={isDisksSuccess}
        />
      )}
      
      <OVirtWebAdminHyperlink
        name={`${Localization.kr.COMPUTING}>${Localization.kr.VM}>${vmsSelected[0]?.name}`}
        path={`vms-disks;name=${vmsSelected[0]?.name}`} 
      />
    </>
  );
};

export default VmDisks;
