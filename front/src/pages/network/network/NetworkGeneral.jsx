import React from "react";
import useGlobal                        from "@/hooks/useGlobal";
import OVirtWebAdminHyperlink           from "@/components/common/OVirtWebAdminHyperlink";
import { InfoTable }                    from "@/components/table/InfoTable";
import GeneralLayout                    from "@/components/GeneralLayout";
import GeneralBoxProps                  from "@/components/common/GeneralBoxProps";
import VmGeneralBarChart                from "@/components/Chart/GeneralBarChart";
import {
  useNetwork
} from "@/api/RQHook";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";

/**
 * @name NetworkGeneral
 * @description 네트워크 일반정보
 *
 * @prop {string} networkId 네트워크 ID
 * @returns {JSX.Element} NetworkGeneral
 */
const NetworkGeneral = ({
  networkId
}) => {
  const {
    datacentersSelected, networksSelected,
  } = useGlobal()
  
  const {
    data: network,
    isLoading: isNetworkLoading,
    isSuccess: isNetworkSuccess,
    isError: isNetworkError,
  } = useNetwork(networkId);

  const tableRows = [
    { label: "ID", value: network?.id },
    { label: Localization.kr.NAME, value: network?.name },
    { label: Localization.kr.DESCRIPTION, value: network?.description },
    { label: "VDSM 이름", value: network?.vdsmName },
    { label: `${Localization.kr.VM} 네트워크`, value: network?.usage?.vm ? Localization.kr.YES : Localization.kr.NO },
    { label: "VLAN 태그", value: network?.vlan === 0 ? "없음" : network?.vlan },
    { label: "MTU", value: network?.mtu === 0 ? "기본값 (1500)" : network?.mtu },
  ];

  return (<>
    <GeneralLayout
      top={
      <>
      <div className="grid-col-span-2 vm-box-default box-content">
        <h3 className="box-title">{Localization.kr.GENERAL}</h3>
        <hr className="w-full" />
        <InfoTable tableRows={tableRows}/>
      </div>
      <GeneralBoxProps 
        title={Localization.kr.VNIC_PROFILE}
        count={network?.vnicProfileVos?.length}
      >
        <div className="py-3">
          {network?.vnicProfileVos?.length > 0 ? (
            network.vnicProfileVos.map((vnic, idx) => (
              <div key={vnic.id || idx} className="mb-2">
                - {vnic.name} : 
                {vnic.customProperties?.filter ? ` (${vnic.customProperties.filter} 필터)` : " (필터 없음)"} |  {" "}
                {`${network.portIsolation} (포트 미러링)`} | {" "}
                {`통과 (${!!vnic.passThrough ? Localization.kr.YES : Localization.kr.NO})`}
              </div>
            ))
          ) : (
            <span className="text-gray-400">{Localization.kr.VNIC_PROFILE}이 없습니다.</span>
          )}
        </div>
      </GeneralBoxProps>
      </>
    }
    bottom={
      <>
      </>
      }
    />
    <OVirtWebAdminHyperlink
      name={`${Localization.kr.NETWORK}>${Localization.kr.NETWORK}>${networksSelected[0]?.name}`}
      path={`networks-general;name=${networksSelected[0]?.name};dataCenter=${datacentersSelected[0]?.name}`}
    />
  </>);
};

export default NetworkGeneral;
