import { useDisk } from "../../../api/RQHook";
import InfoTable from "../../../components/table/InfoTable";
import { checkZeroSizeToGiB, convertBytesToGB } from "../../../util";
import Localization from "../../../utils/Localization";

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
  } = useDisk(diskId);

  const tableRows = [
    { label: Localization.kr.ALIAS, value: disk?.alias },
    { label: "ID", value: disk?.id },
    { label: Localization.kr.DESCRIPTION, value: disk?.description },
    { label: "디스크 프로파일", value: disk?.diskProfileVo?.name },
    { label: "가상 크기", value: `${convertBytesToGB(disk?.virtualSize)} GB` },
    { label: "실제 크기", value: checkZeroSizeToGiB(disk?.actualSize) },
  ];

  return <InfoTable tableRows={tableRows} />;
};

export default DiskGeneral;
