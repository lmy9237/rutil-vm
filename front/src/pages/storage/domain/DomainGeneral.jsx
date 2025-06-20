import React from "react";
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
import GeneralBoxProps            from "@/components/common/GeneralBoxProps";
import VmGeneralBarChart          from "@/pages/computing/vm/VmGeneralBarChart";
import DomainStorageUsageBarChart from "./DomainGeneralBarChart";
import GeneralLayout from "@/components/GeneralLayout";

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
    { label: "크기", value: checkZeroSizeToGiB(domain?.size) },
    { label: "사용 가능", value: checkZeroSizeToGiB(domain?.availableSize) },
    { label: "사용됨", value: checkZeroSizeToGiB(domain?.usedSize) },
    { label: "할당됨", value: checkZeroSizeToGiB(domain?.commitedSize) },
    {
      label: "오버 할당 비율",
      value: calculateOvercommitRatio(domain?.commitedSize, domain?.size),
    },
    { label: "이미지 개수", value: disks?.length || 0 },
    ...(diskSnapshots?.length > 0
      ? [{ label: "디스크 스냅샷 개수",value: diskSnapshots?.length || 0 }]
      : []),
    ...(domain?.storageVo?.type === "nfs"
      ? [{ label: "경로", value: `${domain?.storageVo?.address}:${domain?.storageVo?.path}` }]
      : []),
    { 
      label: "디스크 공간 부족 경고 표시", 
      value: `${domain?.warning} % (${((convertBytesToGB(domain?.size) / domain?.warning).toFixed(0))} GB)` 
    },
    { label: "심각히 부족한 디스크 공간의 동작 차단", value: `${domain?.spaceBlocker} GB`},
  ];

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
          <h3 className="box-title">게스트 운영체제</h3>
          <hr className="w-full" />
          <InfoTable tableRows={tableRows} />
        </div>
        <GeneralBoxProps title="용량 및 사용량">
          <DomainStorageUsageBarChart />
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
