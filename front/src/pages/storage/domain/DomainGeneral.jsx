import React from "react";
import { useDomainById } from "../../../api/RQHook";
import { checkZeroSizeToGB } from "../../../util";
import InfoTable from "../../../components/table/InfoTable";

const overCommit = (commit, disk) => ((commit / disk) * 100).toFixed(0);

/**
 * @name DomainGeneral
 * @description 도메인 일반정보
 *
 * @prop {string} domainId 도메인ID
 * @returns {JSX.Element} DomainGeneral
 */
const DomainGeneral = ({ domainId }) => {
  const { data: domain } = useDomainById(domainId);

  const tableRows = [
    { label: "ID", value: domain?.id },
    { label: "크기", value: checkZeroSizeToGB(domain?.diskSize) },
    { label: "사용 가능", value: checkZeroSizeToGB(domain?.availableSize) },
    { label: "사용됨", value: checkZeroSizeToGB(domain?.usedSize) },
    { label: "할당됨", value: checkZeroSizeToGB(domain?.commitedSize) },
    {
      label: "오버 할당 비율",
      value: overCommit(domain?.availableSize, domain?.diskSize) + " %",
    },
    {
      label: "이미지: (약간의 문제)",
      value: domain?.diskImageVos?.length || 0,
    },
    { label: "경로", value: domain?.storageAddress }, // nfs 일때만
    // { label: "NFS 버전", value: domain?.nfsVersion },
    // { label: "디스크 공간 부족 경고 표시", value: {domain?.warning}% ({(convertBytesToGB(domain?.diskSize) / domain?.warning).toFixed(0)} GB) },
    {
      label: "심각히 부족한 디스크 공간의 동작 차단",
      value: `${domain?.spaceBlocker} GB`,
    },
  ];

  return <InfoTable tableRows={tableRows} />;
};

export default DomainGeneral;
