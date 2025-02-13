import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
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
    { label: "이름", value: cluster?.name },
    { label: "설명", value: cluster?.description },
    { label: "데이터센터", value: cluster?.dataCenterVo?.name },
    { label: "호환버전", value: cluster?.version },
    { label: "클러스터 ID", value: cluster?.id },
    {
      label: "클러스터 CPU 유형",
      value: (
        <>
          {cluster?.cpuType}
          <FontAwesomeIcon
            icon={faInfoCircle}
            style={{ color: "rgb(83, 163, 255)", marginLeft: "3px" }}
            fixedWidth
          />
        </>
      ),
    },
    { label: "최대 메모리 오버 커밋", value: `${cluster?.memoryOverCommit}%` },
    { label: "칩셋/펌웨어 유형", value: renderBiosType(cluster?.biosType) },
    { label: "가상 머신 수", value: cluster?.vmSize?.allCnt },
    { label: "총 볼륨 수", value: "해당 없음" },
    { label: "Up 상태의 볼륨 수", value: "해당 없음" },
    { label: "Down 상태의 볼륨 수", value: "해당 없음" },
  ];

  console.log("...");
  return (
    <>
      <table className="table">
        <tbody>
          {tableRows.map((row, index) => (
            <tr key={index}>
              <th>{row.label}:</th>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ClusterGeneral;
