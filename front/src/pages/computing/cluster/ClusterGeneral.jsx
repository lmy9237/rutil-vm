import InfoTable from "../../../components/table/InfoTable";
import Localization from "../../../utils/Localization";
import { useCluster } from "../../../api/RQHook";

/**
 * @name ClusterGeneral
 * @description 클러스터 일반정보
 * (/computing/clusters/<clusterId>)
 *
 * @param {string} clusterId 클러스터ID
 * @returns
 */
const ClusterGeneral = ({ clusterId }) => {
  const {
    data: cluster,
    isLoading: isClusterLoading,
    isError: isClusterError,
    isSuccess: isClusterSuccess,
  } = useCluster(clusterId);

  const biosTypeLabels = {
    CLUSTER_DEFAULT: "자동 감지",
    Q35_OVMF: "UEFI의 Q35 칩셋",
    I440FX_SEA_BIOS: "BIOS의 I440FX 칩셋",
    Q35_SEA_BIOS: "BIOS의 Q35 칩셋",
    Q35_SECURE_BOOT: "UEFI SecureBoot의 Q35 칩셋",
  };
  const renderBiosType = (biosType) => biosTypeLabels[biosType] || biosType;

  const tableRows = [
    { label: Localization.kr.NAME, value: cluster?.name },
    { label: Localization.kr.DESCRIPTION, value: cluster?.description },
    { label: Localization.kr.DATA_CENTER, value: cluster?.dataCenterVo?.name },
    { label: "호환버전", value: cluster?.version },
    { label: `${Localization.kr.CLUSTER} ID`, value: cluster?.id },
    { label: `${Localization.kr.CLUSTER} CPU 유형`, value: cluster?.cpuType },
    { label: "최대 메모리 오버 커밋", value: `${cluster?.memoryOverCommit}%` },
    { label: "칩셋/펌웨어 유형", value: renderBiosType(cluster?.biosType) },
    { label: "가상 머신 수", value: cluster?.vmSize?.allCnt },
    // { label: "총 볼륨 수", value: "해당 없음" },
    // { label: "Up 상태의 볼륨 수", value: "해당 없음" },
    // { label: "Down 상태의 볼륨 수", value: "해당 없음" },
    { label: `${Localization.kr.VM} 수`, value: cluster?.vmSize?.allCnt },
  ];

  return <InfoTable tableRows={tableRows} />;
};

export default ClusterGeneral;
