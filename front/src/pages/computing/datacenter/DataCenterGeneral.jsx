// DataCenterGeneral.jsx
import React, { useMemo } from "react";
import useGlobal from "@/hooks/useGlobal";
import { useDataCenter, useUsageDataCenter } from "@/api/RQHook";
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
  const { data: db } = useUsageDataCenter(datacenterId);

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

  const usageItems = useMemo(() => [
    {
      label: "CPU",
      value: db?.totalCpuUsagePercent ?? 0,
      description: `${db?.usedCpuCore ?? 0} CPU 사용됨 | 총 ${db?.totalCpuCore ?? 0} CPU | ${db?.totalCpuCore - db?.usedCpuCore ?? 0} CPU 사용 가능`,
    },
    {
      label: "메모리",
      value: db?.totalMemoryUsagePercent ?? 0,
      description: `${(db?.usedMemoryMB ?? 0).toFixed(2)} GB 사용됨 | 총 ${(db?.totalMemoryMB ?? 0).toFixed(2)} GB | ${(db?.totalMemoryUsagePercent ?? 0).toFixed(0)}% 사용 가능`,
    },
    {
      label: "스토리지",
      value: db?.totalStorageUsagePercent ?? 0,
      description: `${(db?.usedStorageGB ?? 0).toFixed(2)} GB 사용됨 | 총 ${(db?.totalStorageGB ?? 0).toFixed(2)} GB | ${(db?.totalMemoryUsagePercent ?? 0).toFixed(0)}% 사용 가능`,
    },
  ], [db]);

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
