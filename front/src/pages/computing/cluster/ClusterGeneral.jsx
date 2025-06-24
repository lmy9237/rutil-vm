import OVirtWebAdminHyperlink     from "@/components/common/OVirtWebAdminHyperlink";
import { InfoTable }              from "@/components/table/InfoTable";
import { 
  useAllBiosTypes,
  useCluster
} from "@/api/RQHook";
import Localization               from "@/utils/Localization";
import { useMemo } from "react";
import GeneralBoxProps from "@/components/common/GeneralBoxProps";
import VmGeneralBarChart from "../vm/VmGeneralBarChart";
import GeneralLayout from "@/components/GeneralLayout";

/**
 * @name ClusterGeneral
 * @description 클러스터 일반정보
 * (/computing/clusters/<clusterId>)
 *
 * @param {string} clusterId 클러스터ID
 * @returns
 */
const ClusterGeneral = ({
  clusterId
}) => {
  const {
    data: cluster,
    isLoading: isClusterLoading,
    isError: isClusterError,
    isSuccess: isClusterSuccess,
  } = useCluster(clusterId);

  const {
    data: biosTypes = [],
    isLoading: isBiosTypesLoading,
  } = useAllBiosTypes();

  const renderBiosType = (biosType="") => [...biosTypes].filter((b) => {
    return b.id.toLowerCase() === biosType.toLowerCase()
  })[0]?.kr;

  const usageItems = useMemo(() => [
    {
      label: "CPU",
      value: 64,
      description: "64 CPU 사용됨 | 총 128 CPU | 20 CPU 사용 가능",
    },
    {
      label: "메모리",
      value: 66,
      description: "16.42 GB 사용됨 | 총 51.14 GB | 66% 사용 가능",
    },
    {
      label: "스토리지",
      value: 89,
      description: "4.56 TB 사용됨 | 총 5.11 TB",
    },
  ], []);

  const tableRows = [
    { label: Localization.kr.NAME, value: cluster?.name },
    { label: Localization.kr.DESCRIPTION, value: cluster?.description },
    { label: Localization.kr.DATA_CENTER, value: cluster?.dataCenterVo?.name },
    { label: "호환버전", value: cluster?.version },
    // { label: `${Localization.kr.CLUSTER} ID`, value: cluster?.id },
    { label: `${Localization.kr.CLUSTER} CPU 유형`, value: cluster?.cpuType },
    { label: "최대 메모리 오버 커밋", value: `${cluster?.memoryOverCommit}%` },
    { label: "칩셋/펌웨어 유형", value: renderBiosType(cluster?.biosType) },
    // { label: "총 볼륨 수", value: Localization.kr.NOT_ASSOCIATED },
    // { label: "Up 상태의 볼륨 수", value: Localization.kr.NOT_ASSOCIATED },
    // { label: "Down 상태의 볼륨 수", value: Localization.kr.NOT_ASSOCIATED },
    { label: `${Localization.kr.VM} 수`, value: cluster?.vmSize?.allCnt },
  ];

  return (
    <>
      <GeneralLayout
        top={
          <>
            <div className="grid-col-span-2 vm-box-default box-content">
              <h3 className="box-title">일반</h3>
              <hr className="w-full" />
              <InfoTable tableRows={tableRows} />
            </div>
            <GeneralBoxProps title="용량 및 사용량">
              <VmGeneralBarChart items={usageItems} />
            </GeneralBoxProps>
          </>
        }
        bottom={<></>}
      />
      <OVirtWebAdminHyperlink
        name={`${Localization.kr.COMPUTING}>${Localization.kr.CLUSTER}>${cluster?.name}`}
        path={`clusters-general;name=${cluster?.name}`} />
    </>
  );
};

export default ClusterGeneral;
