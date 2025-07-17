import React, { useEffect, useMemo, useState } from "react";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import TabNavButtonGroup                from "@/components/common/TabNavButtonGroup";
import ToggleSwitchButton               from "@/components/button/ToggleSwitchButton";
import BaseModal                        from "@/components/modal/BaseModal";
import LabelInput                       from "@/components/label/LabelInput";
import LabelSelectOptions               from "@/components/label/LabelSelectOptions";
import { 
  RVI36, rvi36Add, rvi36Remove
} from "@/components/icons/RutilVmIcons";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";

const HostNetworkEditModal = ({ 
  isOpen, onClose,
  networkModalState, setNetworkModalState,
  onNetworkEdit
}) => {
  const { validationToast } = useValidationToast();
  const [selectedModalTab, setSelectedModalTab] = useState("ipv4");  
  const tabs = useMemo(() => [
    { id: "ipv4",  label: "IPv4",    onClick: () => setSelectedModalTab("ipv4") },
    { id: "ipv6",  label: "IPv6",    onClick: () => setSelectedModalTab("ipv6") },
    { id: "dns",   label: "DNS 설정", onClick: () => setSelectedModalTab("dns") },
  ], []);
  const [initialInSync, setInitialInSync] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setInitialInSync(networkModalState.inSync);
    }
  }, [isOpen]);

  useEffect(() =>{
    setSelectedModalTab("ipv4");
  },[isOpen])

  useEffect(() =>{
    Logger.debug(`HostNetworkEditModal > useEffect ... networkModalState: `, networkModalState)
  },[isOpen])

  const handleChangeInSync = (field, value) => {
    Logger.debug(`HostNetworkEditModal > handleChangeInSync ... field: ${field}, value: ${value}`)
    setNetworkModalState((prev) => ({ ...prev, [field]: value }));
  };

  const handleIpv4Change = (field, value) => {
    Logger.debug(`HostNetworkEditModal > handleIpv4Change ... field: ${field}, value: ${value}`)
    setNetworkModalState(prev => {
      if (field === "protocol" && value !== "static") {
        return {
          ...prev,
          ipv4Values: {
            ...prev.ipv4Values,
            protocol: value,
            address: "",
            gateway: "",
            netmask: "",
          }
        }
      }
      return {
        ...prev,
        ipv4Values: { ...prev.ipv4Values, [field]: value }
      };
    });
  };

  const handleIpv6Change = (field, value) => {
    Logger.debug(`HostNetworkEditModal > handleIpv6Change ... field: ${field}, value: ${value}`)
    setNetworkModalState(prev => {
      if (field === "protocol" && value !== "static") {
        return {
          ...prev,
          ipv6Values: {
            ...prev.ipv6Values,
            protocol: value,
            address: "",
            gateway: "",
            netmask: "",
          }
        }
      }
      return {
        ...prev,
        ipv6Values: { ...prev.ipv6Values, [field]: value }
      };
    });
  };

  
  const validateForm = () => {
    Logger.debug(`HostNetworkEditModal > validateForm ... `)
    if (networkModalState.ipv4Values.protocol === "static") {
      if(networkModalState.ipv4Values.address === "") {
        return "ipv4의 IP를 입력해주세요"
      }
      if(networkModalState.ipv4Values.netmask === "") {
        return "ipv4의 넷마스크를 입력해주세요"
      }
    }
    if (networkModalState.ipv6Values.protocol === "static") {
      if(networkModalState.ipv6Values.address === "") {
        return "ipv6의 IP를 입력해주세요"
      }
      if(networkModalState.ipv6Values.netmask === "") {
        return "ipv6의 넷마스크를 입력해주세요"
      }
    }
    return null;
  };


  const handleOkClick = () => {
    Logger.debug(`HostNetworkEditModal > handleOkClick ... `)
    const error = validateForm();
    if (error) {
      validationToast.fail(error);
      return;
    }

    // IpAssignments 배열 만들기
    Logger.debug(`HostNetworkEditModal > handleOkClick ... `)
    const ipAssignments = [];
    // if (networkModalState.ipv4Values.protocol && networkModalState.ipv4Values.protocol !== "none") {
    //   ipAssignments.push({
    //     assignmentMethod: networkModalState.ipv4Values.protocol,
    //     ipVo: {
    //       version: "V4",
    //       ...(networkModalState.ipv4Values.protocol === "static"
    //         ? {
    //             address: networkModalState.ipv4Values.address,
    //             gateway: networkModalState.ipv4Values.gateway,
    //             netmask: networkModalState.ipv4Values.netmask,
    //           }
    //         : {} // static이 아니면 아예 값 없음
    //       ),
    //     },
    //   });
    // }
    // if (networkModalState.ipv6Values.protocol && networkModalState.ipv6Values.protocol !== "none") {
    //   ipAssignments.push({
    //     assignmentMethod: networkModalState.ipv6Values.protocol,
    //     ipVo: {
    //       version: "V6",
    //       ...(networkModalState.ipv6Values.protocol === "static"
    //         ? {
    //             address: networkModalState.ipv6Values.address,
    //             gateway: networkModalState.ipv6Values.gateway,
    //             netmask: networkModalState.ipv6Values.netmask,
    //           }
    //         : {} // static이 아니면 아예 값 없음
    //       ),
    //     },
    //   });

    if (networkModalState.ipv4Values.protocol) {
      ipAssignments.push({
        assignmentMethod: networkModalState.ipv4Values.protocol,
        ipVo: {
          version: "V4",
          ...(networkModalState.ipv4Values.protocol === "static"
            ? {
                address: networkModalState.ipv4Values.address,
                gateway: networkModalState.ipv4Values.gateway,
                netmask: networkModalState.ipv4Values.netmask,
              }
            : {} // static 아니면 값 없음
          )
        }
      });
    }

    if (networkModalState.ipv6Values.protocol) {
      ipAssignments.push({
        assignmentMethod: networkModalState.ipv6Values.protocol,
        ipVo: {
          version: "V6",
          ...(networkModalState.ipv6Values.protocol === "static"
            ? {
                address: networkModalState.ipv6Values.address,
                gateway: networkModalState.ipv6Values.gateway,
                netmask: networkModalState.ipv6Values.netmask,
              }
            : {} // static이 아니면 아예 값 없음
          ),
        },
      });
    }

    // NetworkAttachmentVo 형식 맞추기 (id는 기존 networkAttachment id)
    const networkEditData = {
      id: networkModalState.id,
      networkVo: networkModalState.networkVo,
      hostNicVo: networkModalState.hostNicVo,
      ipAddressAssignments: ipAssignments,
      dnsServers: networkModalState.dnsServers.filter(Boolean), 
      ...(initialInSync === false && networkModalState.inSync === true
        ? { inSync: true }  // 변경된 경우에만 포함
        : {} // 변경 안 되었으면 생략
      )
    };

    Logger.debug("HostNetworkEditModal > handleOkClick ... networkEditData:", networkEditData);
    // 부모로 넘김
    onNetworkEdit(networkEditData);
    onClose();
  };


  return (
    <BaseModal targetName={`${Localization.kr.NETWORK} ${networkModalState?.networkVo?.name}`} submitTitle={Localization.kr.UPDATE}
      isOpen={isOpen} onClose={onClose}
      isReady={
        networkModalState &&
        networkModalState.networkVo &&
        networkModalState.hostNicVo &&
        typeof networkModalState.inSync === "boolean"
      }
      onSubmit={handleOkClick}
      contentStyle={{ width: "800px" , height: "430px" }} 
    >
      <div className="popup-content-outer flex">
        <TabNavButtonGroup
          tabs={tabs}
          tabActive={selectedModalTab}
        />

        <div className="w-full px-4">
          <div className ="w-[57.5%]">
            <ToggleSwitchButton label={`${Localization.kr.NETWORK} 동기화`}
              disabled={networkModalState.inSync} // true면 비활성화
              onChange={() => {
                if (!networkModalState.inSync) {
                  handleChangeInSync("inSync", !networkModalState.inSync); // false일 경우에만 반전 허용
                }
              }}
              tType={"동기화"} fType={"비동기화"}
            />
            {/* TODO: insync 문제 */}
            <span>{networkModalState.inSync === true ? "T" : "F"}</span>
          </div>
          <hr/>
          {selectedModalTab === "ipv4" && (
            <div className="select-box-outer">
              <LabelSelectOptions id="ipv4_mtu" label="부트 프로토콜"                  
                value={networkModalState.ipv4Values.protocol}
                options={ipv4Options}
                disabled={!networkModalState.inSync}
                onChange={e => handleIpv4Change('protocol', e.target.value)}
              />
              <span>{networkModalState.ipv4Values.protocol}</span>
              <LabelInput id="ip_address" label="IP"
                value={networkModalState.ipv4Values.address}
                onChange={e => handleIpv4Change('address', e.target.value)}
                disabled={!networkModalState.inSync || networkModalState.ipv4Values.protocol !== "static"}
              />
              <LabelInput id="netmask" label="넷마스크 / 라우팅 접두사"
                value={networkModalState.ipv4Values.netmask}
                onChange={e => handleIpv4Change('netmask', e.target.value)}
                disabled={!networkModalState.inSync || networkModalState.ipv4Values.protocol !== "static"}
              />
              <LabelInput id="gateway" label="게이트웨이"
                value={networkModalState.ipv4Values.gateway}
                onChange={e => handleIpv4Change('gateway', e.target.value)}
                disabled={!networkModalState.inSync || networkModalState.ipv4Values.protocol !== "static"}
              />
            </div>
          )}

          {selectedModalTab === "ipv6" && (
            <div className="select-box-outer">
              <LabelSelectOptions id="ipv6_protocol" label="부트 프로토콜"
                value={networkModalState.ipv6Values.protocol}
                options={ipv6Options}
                disabled={!networkModalState.inSync}
                onChange={e => handleIpv6Change('protocol', e.target.value)}
              />
              <LabelInput id="ip_address" label="IP"
                value={networkModalState.ipv6Values.address}
                onChange={e => handleIpv6Change('address', e.target.value)}
                disabled={!networkModalState.inSync || networkModalState.ipv6Values.protocol !== "static"}
              />
              <LabelInput id="netmask" label="넷마스크 / 라우팅 접두사"
                value={networkModalState.ipv6Values.netmask}
                onChange={e => handleIpv6Change('netmask', e.target.value)}
                disabled={!networkModalState.inSync || networkModalState.ipv6Values.protocol !== "static"}
              />
              <LabelInput id="gateway" label="게이트웨이"
                value={networkModalState.ipv6Values.gateway}
                onChange={e => handleIpv6Change('gateway', e.target.value)}
                disabled={!networkModalState.inSync || networkModalState.ipv6Values.protocol !== "static"}
              />
            </div>
          )}

          {selectedModalTab === "dns" && (
            <>
              <div className="font-bold"> DNS 서버 </div>
                {networkModalState.dnsServers.length !== 0 ?
                  (networkModalState.dnsServers.map((dns, index) => (
                  <div key={index} className="f-btw" style={{ width: "100%", padding: 0 }}>
                    <LabelInput
                      value={dns}
                      onChange={(e) => {
                        const updated = [...networkModalState.dnsServers];
                        updated[index] = e.target.value;
                        setNetworkModalState(prev => ({ ...prev, dnsServers: updated }));
                      }}
                    />
                    <RVI36 className="btn-icon" currentColor="transparent"
                      iconDef={rvi36Add(false)}                     
                      onClick={() =>
                        setNetworkModalState(prev => ({ ...prev, dnsServers: [...prev.dnsServers, ""] }))
                      }
                    />
                    <RVI36 className="btn-icon" currentColor="transparent"
                      iconDef={rvi36Remove()}
                      onClick={() => {
                        const updated = [...networkModalState.dnsServers];
                        updated.splice(index, 1);
                        setNetworkModalState(prev => ({ ...prev, dnsServers: updated }));
                      }}
                    />
                  </div> 
                ))) :(
                  <span>해야함</span>
                )
              }
            </>
          )}
        </div>
      </div>
    </BaseModal>
  );
};

export default HostNetworkEditModal;

// ipv4 부트 프로토콜
const ipv4Options = [
  { value: "dhcp", label: "DHCP" },
  { value: "static", label: "정적" },
];
// ipv6 부트 프로토콜
const ipv6Options = [
  { value: "dhcp", label: "DHCP" },
  { value: "autoconf", label: `${Localization.kr.STATELESS} 주소 자동 설정` },
  { value: "poly_dhcp_autoconf", label: `DHCP 및 ${Localization.kr.STATELESS} 주소 자동 설정` },
  { value: "static", label: "정적" },
];
