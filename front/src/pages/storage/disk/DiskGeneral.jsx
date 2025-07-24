import { InfoTable }              from "@/components/table/InfoTable";
import {
  useAllStorageDomainsFromDisk,
  useDisk
} from "@/api/RQHook";
import {
  checkZeroSizeToGiB,
  convertBytesToGB
} from "@/util";
import Localization               from "@/utils/Localization";
import GeneralLayout from "@/components/GeneralLayout";
import GeneralBoxProps from "@/components/common/GeneralBoxProps";
import VmGeneralBarChart from "@/components/Chart/GeneralBarChart";
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

  const {
    data: domains = [],
  } = useAllStorageDomainsFromDisk(diskId, (e) => ({ ...e }));

  const tableRows = [
    { label: "ID", value: disk?.id },
    { label: Localization.kr.ALIAS, value: disk?.alias },
    { label: Localization.kr.DESCRIPTION, value: disk?.description },
    { label: Localization.kr.DOMAIN, value: disk?.storageDomainVo?.name },
    { label: Localization.kr.SIZE_VIRTUAL, value: `${convertBytesToGB(disk?.virtualSize)} GB` },
    { label: Localization.kr.SIZE_ACTUAL, value: checkZeroSizeToGiB(disk?.actualSize) },
    { label: "할당 정책", value: disk?.sparse ? Localization.kr.THIN_PROVISIONING : Localization.kr.PREALLOCATED },
  ];

  const usageItems = useMemo(() => {
    const virtualSizeGiB = checkZeroSizeToGiB(disk?.virtualSize ?? 0);
    const actualSizeGiB = checkZeroSizeToGiB(disk?.actualSize ?? 0);
    const diskPercent = (disk?.virtualSize > 0)
      ? Math.round((disk?.actualSize / disk?.virtualSize) * 100)
      : 0;

    const domain = domains[0];
    const diskSize = (domain?.size / (1024 ** 4)).toFixed(2);
    const usedSizeTB = (domain?.usedSize / (1024 ** 4)).toFixed(2);
    const storagePercent = domain?.size > 0
      ? Math.round((domain?.usedSize / domain?.size) * 100)
      : 0;

    return [
      {
        label: "스토리지",
        value: storagePercent,
        description: `${usedSizeTB} TB 사용됨 | 총 ${diskSize} TB`,
      },
      {
        label: "가상 디스크",
        value: diskPercent,
        description: `${actualSizeGiB} 사용됨 | 총 ${virtualSizeGiB}`,
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
