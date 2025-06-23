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
import VmGeneralBarChart from "@/pages/computing/vm/VmGeneralBarChart";
import GeneralLayout from "@/components/GeneralLayout";
import { RVI24, rvi24Storage } from "@/components/icons/RutilVmIcons";

const overCommit = (commit, disk) => ((commit / disk) * 100).toFixed(0);

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
  { label: Localization.kr.SIZE_TOTAL, value: checkZeroSizeToGiB(domain?.size) },
  { label: Localization.kr.SIZE_AVAILABLE, value: checkZeroSizeToGiB(domain?.availableSize) },
  { label: Localization.kr.SIZE_USED, value: checkZeroSizeToGiB(domain?.usedSize) },
  { label: "할당됨", value: checkZeroSizeToGiB(domain?.commitedSize) },
  {
    label: "오버 할당 비율",
    value: calculateOvercommitRatio(domain?.commitedSize, domain?.size),
  },
  { label: `${Localization.kr.DISK} 이미지 개수`, value: disks?.length || 0 },

  // ...(diskSnapshots?.length > 0
  //   ? [{ label: `${Localization.kr.SNAPSHOT} 개수`, value: diskSnapshots?.length || 0 }]
  //   : []),

  ...(domain?.storageVo?.type === "NFS"
    ? [{
        label: Localization.kr.NFS_SHARE_PATH,
        value: `${domain?.storageVo?.address}:${domain?.storageVo?.path}`
      }]
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

  //그래프
  const usageItems = useMemo(() => [
    {
      label: "스토리지",
      value: 89, // 예시 값
      description: "4.56 TB 사용됨 | 총 5.11 TB",
    }
  ], []);

  return (
    <>
    {/* <div className="vm-detail-grid">
      <div className="vm-section section-top">
        <div className="grid-col-span-2 vm-box-default box-content">
          <h3 className="box-title">게스트 운영체제</h3>
          <hr className="w-full" />
            <InfoTable tableRows={tableRows} />
        </div>
        <GeneralBoxProps title="용량 및 사용량">
          <DomainStorageUsageBarChart />
        </GeneralBoxProps>
      </div>
    </div> */}
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
    <OVirtWebAdminHyperlink
      name={`${Localization.kr.DOMAIN}>${Localization.kr.DOMAIN}>${domainsSelected[0]?.name}`}
      path={`storage-general;name=${domainsSelected[0]?.name}`}
    />
    </>
  );
};

export default DomainGeneral;
