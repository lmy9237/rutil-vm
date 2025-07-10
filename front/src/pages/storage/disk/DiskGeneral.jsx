import { InfoTable }              from "@/components/table/InfoTable";
import {
  useDisk
} from "@/api/RQHook";
import {
  checkZeroSizeToGiB,
  convertBytesToGB
} from "@/util";
import Localization               from "@/utils/Localization";
import GeneralLayout from "@/components/GeneralLayout";
import GeneralBoxProps from "@/components/common/GeneralBoxProps";
import VmGeneralBarChart from "@/pages/computing/vm/VmGeneralBarChart";
import OVirtWebAdminHyperlink from "@/components/common/OVirtWebAdminHyperlink";
import useGlobal from "@/hooks/useGlobal";
import { useMemo } from "react";

/**
 * @name DiskGeneral
 * @description 디스크 일반정보
 * (/storages/disks/<diskId>)
 *
 * @param {string} diskId 디스크ID
 * @returns
 */
const DiskGeneral = ({
  diskId
}) => {
  const { disksSelected } = useGlobal()
  const {
    data: disk,
    isLoading: isDiskLoading,
    isError: isDiskError,
    isSuccess: isDiskSuccess,
  } = useDisk(diskId);

  const tableRows = [
    { label: "ID", value: disk?.id },
    { label: Localization.kr.ALIAS, value: disk?.alias },
    // { label: "ID", value: disk?.id },
    { label: Localization.kr.DESCRIPTION, value: disk?.description },
    { label: Localization.kr.DOMAIN, value: disk?.storageDomainVo?.name },
    { label: "가상 디스크 크기", value: `${convertBytesToGB(disk?.virtualSize)} GB` },
    { label: "실제 가상 디스크 크기", value: checkZeroSizeToGiB(disk?.actualSize) },
    { label: "할당 정책", value: disk?.sparse ? Localization.kr.THIN_PROVISIONING : Localization.kr.PREALLOCATED },
  ];

const usageItems = useMemo(() => {
  const virtualSizeGiB = (disk?.virtualSize ?? 0) / 1024 ** 3;
  const actualSizeGiB = (disk?.actualSize ?? 0) / 1024 ** 3;

  // 디스크 비율
  const diskTotalTB = 200; // 기준치
  const actualSizeTB = actualSizeGiB / 1024;
  const diskPercent = Math.round((actualSizeTB / diskTotalTB) * 100);

  // 스토리지 (예시 데이터)
  const storageTotalTB = 5.11;
  const storageUsedTB = 4.56;
  const storagePercent = Math.round((storageUsedTB / storageTotalTB) * 100);

  return [
    {
      label: "스토리지",
      value: storagePercent,
      description: `${storageUsedTB.toFixed(2)} TB 사용됨 | 총 ${storageTotalTB.toFixed(2)} TB`,
    },
    {
      label: "가상 디스크",
      value: diskPercent,
      description:
        actualSizeGiB < 1
          ? `< 1 GiB 사용됨 | 총 ${diskTotalTB} TB`
          : `${actualSizeTB.toFixed(2)} TB 사용됨 | 총 ${diskTotalTB} TB`,
    }
  ];
}, [disk]);


  // return <InfoTable tableRows={tableRows} />;
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
    bottom={
      <>
      </>
      }
    />
    {/* <OVirtWebAdminHyperlink
      name={`${Localization.kr.DOMAIN}>${Localization.kr.DOMAIN}>${disksSelected[0]?.name}`}
      path={`storage-general;name=${disksSelected[0]?.name}`}
    /> */}
    </>
  );
};

export default DiskGeneral;
