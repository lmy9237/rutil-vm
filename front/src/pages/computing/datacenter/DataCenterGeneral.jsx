import React, { useMemo } from "react";
import useGlobal              from "@/hooks/useGlobal";
import GeneralLayout          from "@/components/GeneralLayout";
import GeneralBoxProps        from "@/components/common/GeneralBoxProps";
import OVirtWebAdminHyperlink from "@/components/common/OVirtWebAdminHyperlink";
import { InfoTable }          from "@/components/table/InfoTable";
import GeneralBarChart        from "@/components/Chart/GeneralBarChart";
import { 
  useAllDomainsFromDataCenter, 
  useAllNetworksFromDataCenter, 
  useClustersFromDataCenter, 
  useDataCenter, 
  useHostsFromDataCenter, 
  useUsageDataCenter, 
  useVMsFromDataCenter 
} from "@/api/RQHook";
import Localization           from "@/utils/Localization";

/**
 * @name DataCenterGeneral
 * @description 데이터센터 일반 정보
 * @prop {string} datacenterId 데이터센터 ID
 */
const DataCenterGeneral = ({ datacenterId }) => {
  const { datacentersSelected } = useGlobal();
  const { data: datacenter } = useDataCenter(datacenterId);

  const { data: clusters = [] } = useClustersFromDataCenter(datacenterId, (e) => ({...e,}));
  const { data: hosts = [] } = useHostsFromDataCenter(datacenterId, (e) => ({...e,}));
  const { data: vms = [] } = useVMsFromDataCenter(datacenterId, (e) => ({...e,}));
  const { data: domains = [] } = useAllDomainsFromDataCenter(datacenterId, (e) => ({...e,}));
  const { data: networks = [] } = useAllNetworksFromDataCenter(datacenterId, (e) => ({...e,}));

  const {
    data: usage,
    isLoading: isUsageLoading,
    isSuccess: isUsageSuccess,
    isError: isUsageError,
  } = useUsageDataCenter(datacenterId);


const tableRows = [
  { label: "ID", value: datacenter?.id },
  { label: Localization.kr.NAME, value: datacenter?.name },
  { label: Localization.kr.DESCRIPTION, value: datacenter?.description },
  { label: Localization.kr.CLUSTER, value: clusters?.length ?? 0 },
  { label: Localization.kr.HOST, value: hosts?.length ?? 0 },
  { label: Localization.kr.VM, value: vms?.length ?? 0 },
  { label: Localization.kr.NETWORK, value: networks?.length ?? 0 },
  { label: Localization.kr.DOMAIN, value: domains?.length ?? 0 },
  { label: Localization.kr.STATUS, value: Localization.kr.renderStatus(datacenter?.status) || Localization.kr.UP },
];

const usageItems = useMemo(() => {
  const cpu = usage?.totalCpuUsagePercent ?? 0;
  const memory = usage?.totalMemoryUsagePercent ?? 0;
  const storage = usage?.totalStorageUsagePercent ?? 0;

  return [
    {
      label: "CPU",
      value: cpu.toFixed(0),
      description: `${cpu.toFixed(0)}% 사용됨 | ${(100 - cpu).toFixed(0)}% 사용 가능`,
    }, {
      label: "메모리",
      value: memory.toFixed(0),
      description: `${memory.toFixed(0)}% 사용됨 | ${(100 - memory).toFixed(0)}% 사용 가능`,
    }, {
      label: "스토리지",
      value: storage.toFixed(0),
      description: `${storage.toFixed(0)}% 사용됨 | ${(100 - storage).toFixed(0)}% 사용 가능`,
    },
  ];
}, [datacenterId, usage]);

  return (<>
    <GeneralLayout
      top={
        <>
          <div className="grid-col-span-2 vm-box-default box-content">
            <h3 className="box-title">{Localization.kr.GENERAL}</h3>
            <hr className="w-full" />
            <InfoTable tableRows={tableRows} />
          </div>
          <GeneralBoxProps title={Localization.kr.USAGE}
            isLoading={isUsageLoading} 
            isSuccess={isUsageSuccess}
          >
            <GeneralBarChart items={usageItems} />
          </GeneralBoxProps>
        </>
      }
      bottom={<></>}
    />
    <OVirtWebAdminHyperlink
      name={`${Localization.kr.GENERAL}>${Localization.kr.DATA_CENTER}`}
      path={`dataCenters-storage;`}
    />
  </>);
};

export default DataCenterGeneral;
