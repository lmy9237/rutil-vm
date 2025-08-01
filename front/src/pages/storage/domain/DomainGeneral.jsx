import React, { useMemo } from "react";
import useGlobal                  from "@/hooks/useGlobal";
import OVirtWebAdminHyperlink     from "@/components/common/OVirtWebAdminHyperlink";
import { InfoTable }              from "@/components/table/InfoTable";
import {
  useAllDisksFromDomain,
  useAllDiskSnapshotsFromDomain,
  useStorageDomain 
} from "@/api/RQHook";
import {
  calculateOvercommitRatio,
  checkZeroSizeToGiB,
  convertBytesToGB
} from "@/util";
import Localization               from "@/utils/Localization";
import GeneralBoxProps from "@/components/common/GeneralBoxProps";
import VmGeneralBarChart from "@/components/Chart/GeneralBarChart";
import GeneralLayout from "@/components/GeneralLayout";
import { RVI24, rvi24Storage } from "@/components/icons/RutilVmIcons";


/**
 * @name DomainGeneral
 * @description 도메인 일반정보
 *
 * @prop {string} domainId 도메인ID
 * @returns {JSX.Element} DomainGeneral
 */
const DomainGeneral = ({
  domainId
}) => {
  const {
    domainsSelected
  } = useGlobal()
  const { data: domain } = useStorageDomain(domainId);
  const { data: diskSnapshots = [] } = useAllDiskSnapshotsFromDomain(domainId, (e) => ({ ...e }));
  const { data: disks = [] } = useAllDisksFromDomain(domainId, (e) => ({ ...e }));


  const tableRows = [
    { label: "ID", value: domain?.id },
    // { label: "a", value: domain?.storageDomainType },
    { label: Localization.kr.SIZE_TOTAL, value: checkZeroSizeToGiB(domain?.size) },
    { label: Localization.kr.SIZE_AVAILABLE, value: checkZeroSizeToGiB(domain?.availableSize) },
    { label: Localization.kr.SIZE_USED, value: checkZeroSizeToGiB(domain?.usedSize) },
    { label: "할당된 크기", value: checkZeroSizeToGiB(domain?.commitedSize) },
    ...(domain?.storageDomainType !== "import_export" ? [
      {
        label: "오버 할당 비율",
        value: calculateOvercommitRatio(domain?.commitedSize, domain?.size),
      },
      { label: `${Localization.kr.DISK} 이미지 개수`, value: disks?.length || 0 },
      ]:[
        
      ]
    ),
    ...(diskSnapshots?.length > 0
      ? [{ label: `${Localization.kr.SNAPSHOT} 개수`, value: diskSnapshots?.length || 0 }]
      : []),

    ...(domain?.storageVo?.type === "nfs"
      ? [{
          label: Localization.kr.NFS_SHARE_PATH,
          value: `${domain?.storageVo?.address}:${domain?.storageVo?.path}`
        }]
      : domain?.storageVo?.type === "fcp"
        ? []
        : [{
            label: `경로`,
            value: `${domain?.storageVo?.address}:${domain?.storageVo?.path}`
          }]
    ),
    {
      label: `${Localization.kr.DISK} 공간 부족 경고 표시`,
      value: `${domain?.warning} % (${((convertBytesToGB(domain?.size) / domain?.warning).toFixed(0))} GB)`,
    },
    {
      label: `부족한 ${Localization.kr.DISK} 공간의 동작 차단`,
      value: `${domain?.spaceBlocker} GB`,
    },
  ];

  //그래프(TODO 값 맞는지 확인필요)
  const usageItems = useMemo(() => {
    const totalTB = (domain?.size ?? 0) / 1024 ** 4;     // 바이트 → TB
    const usedTB = (domain?.usedSize ?? 0) / 1024 ** 4;
    const percent = totalTB ? Math.round((usedTB / totalTB) * 100) : 0;

    return [{
      label: "스토리지",
      value: percent,
      description: `${usedTB.toFixed(2)} TB 사용됨 | 총 ${totalTB.toFixed(2)} TB`
    }];
  }, [domain]);

  return (
    <>
    {/* <div className="vm-detail-grid">
      <div className="vm-section section-top">
        <div className="grid-col-span-2 vm-box-default box-content">
          <h3 className="box-title">게스트 운영체제</h3>
          <hr className="w-full" />
            <InfoTable tableRows={tableRows} />
        </div>
        <GeneralBoxProps title={Localization.kr.USAGE}>
          <DomainStorageUsageBarChart />
        </GeneralBoxProps>
      </div>
    </div> */}
    <GeneralLayout
      top={<>
      <div className="grid-col-span-2 vm-box-default box-content">
        <h3 className="box-title">{Localization.kr.GENERAL}</h3>
        <hr className="w-full" />
        <InfoTable tableRows={tableRows} />
      </div>
      <GeneralBoxProps title={Localization.kr.USAGE}>
        <VmGeneralBarChart items={usageItems} />
      </GeneralBoxProps>
      </>}
      bottom={<>
      </>}
    />
    <OVirtWebAdminHyperlink
      name={`${Localization.kr.DOMAIN}>${Localization.kr.DOMAIN}>${domainsSelected[0]?.name}`}
      path={`storage-general;name=${domainsSelected[0]?.name}`}
    />
    </>
  );
};

export default DomainGeneral;
