// DataCenterGeneral.jsx
import React, { useMemo } from "react";
import useGlobal from "@/hooks/useGlobal";
import { useDataCenter } from "@/api/RQHook";
import { InfoTable } from "@/components/table/InfoTable";
import GeneralBoxProps from "@/components/common/GeneralBoxProps";
import GeneralLayout from "@/components/GeneralLayout";
import VmGeneralBarChart from "@/pages/computing/vm/VmGeneralBarChart";
import { RVI24, rvi24Datacenter } from "@/components/icons/RutilVmIcons";
import Localization from "@/utils/Localization";

/**
 * @name DataCenterGeneral
 * @description 데이터센터 일반 정보
 * @prop {string} datacenterId 데이터센터 ID
 */
const DataCenterGeneral = ({ datacenterId }) => {
  const { datacentersSelected } = useGlobal();
  const { data: datacenter } = useDataCenter(datacenterId);

const tableRows = [
  { label: "ID", value: datacenter?.id },
  { label: Localization.kr.NAME, value: datacenter?.name },
  { label: Localization.kr.DESCRIPTION, value: datacenter?.description },
  { label: Localization.kr.CLUSTER, value: datacenter?.clusterVos?.length ?? 0 },
  { label: Localization.kr.HOST, value: datacenter?.hostCnt ?? 0 },
  { label: Localization.kr.VM, value: datacenter?.vmSize?.allCnt ?? 0 },
  { label: Localization.kr.NETWORK, value: datacenter?.networkVos?.length ?? 0 },
  { label: Localization.kr.DOMAIN, value: datacenter?.storageDomainVos?.length ?? 0 },
  { label: Localization.kr.STATUS, value: Localization.kr.renderStatus(datacenter?.status) || Localization.kr.UP },
];

  // 그래프 표시용 임의 값 구성 (향후 실제 계산 반영 가능)
  const usageItems = useMemo(() => [
    {
      label: "CPU",
      value: 64,
      description: "64 CPU 사용됨 | 총 128 CPU | 20 CPU 사용 가능",
    },
    {
      label: "메모리",
      value: 66,
      description: "16.42 GB 사용됨 | 총 51.14 GB | 66% 사용 가능",
    },
    {
      label: "스토리지",
      value: 89,
      description: "4.56 TB 사용됨 | 총 5.11 TB",
    },
  ], []);

  return (
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
      bottom={<></>}
    />
  );
};

export default DataCenterGeneral;
