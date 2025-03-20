import { useDiskById } from "../../../api/RQHook";
import InfoTable from "../../../components/table/InfoTable";
import { checkZeroSizeToGB, convertBytesToGB } from "../../../util";

/**
 * @name DiskGeneral
 * @description 디스크 일반정보
 * (/storages/disks/<diskId>)
 *
 * @param {string} diskId 디스크ID
 * @returns
 */
const DiskGeneral = ({ diskId }) => {
  const {
    data: disk,
    isLoading: isDiskLoading,
    isError: isDiskError,
    isSuccess: isDiskSuccess,
  } = useDiskById(diskId);

  const tableRows = [
    { label: "별칭", value: disk?.alias },
    { label: "ID", value: disk?.id },
    { label: "설명", value: disk?.description },
    { label: "디스크 프로파일", value: disk?.storageDomainVo?.name },
    { label: "가상 크기", value: `${convertBytesToGB(disk?.virtualSize)} GB` },
    { label: "실제 크기", value: checkZeroSizeToGB(disk?.actualSize) },
  ];

  return <InfoTable tableRows={tableRows} />;
};

export default DiskGeneral;
