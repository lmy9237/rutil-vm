import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import TabNavButtonGroup                from "@/components/common/TabNavButtonGroup";
import BaseModal                        from "@/components/modal/BaseModal";
import LabelInput                       from "@/components/label/LabelInput";
import LabelSelectOptions               from "@/components/label/LabelSelectOptions";
import { 
  RVI36, rvi36Add, rvi36Remove
} from "@/components/icons/RutilVmIcons";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";
import LabelCheckbox from "@/components/label/LabelCheckbox";

const DnsInputRow = ({ value, onChange, onAdd, onRemove, isLast }) => (
  <div className="f-btw" style={{ width: "100%", padding: 0 }}>
    <LabelInput value={value} onChange={onChange} />
    <RVI36 className="btn-icon" currentColor="transparent"
      iconDef={rvi36Add(false)} onClick={onAdd} />
    <RVI36 className="btn-icon" currentColor="transparent"
      iconDef={rvi36Remove()} onClick={onRemove} />
  </div>
);

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
  const [initialInSync, setInitialInSync] = useState(true);

  useEffect(() => {
    if(isOpen){
      setInitialInSync(networkModalState.inSync);
      setSelectedModalTab("ipv4");
      Logger.debug(`HostNetworkEditModal > useEffect ... networkModalState: `, networkModalState)
    }
  }, [isOpen]);

  const handleChange = useCallback((section, field, value) => {
    if (section === "inSync") {
      setNetworkModalState(prev => ({ ...prev, inSync: value }));
    } else {
      setNetworkModalState(prev => ({
        ...prev,
        [`${section}Values`]: { ...prev[`${section}Values`], [field]: value },
      }));
    }
  }, [setNetworkModalState]);

  const handleDnsChange = (idx, value) => {
    setNetworkModalState(prev => {
      const updated = [...prev.dnsServers];
      updated[idx] = value;
      return { ...prev, dnsServers: updated };
    });
  };
  const handleDnsAdd = () => {
    setNetworkModalState(prev => ({ ...prev, dnsServers: [...prev.dnsServers, ""] }));
  };
  const handleDnsRemove = (idx) => {
    setNetworkModalState(prev => {
      const updated = [...prev.dnsServers];
      updated.splice(idx, 1);
      return { ...prev, dnsServers: updated };
    });
  };
  
  const validateForm = () => {
    const { ipv4Values, ipv6Values } = networkModalState;
    if (ipv4Values.protocol === "static") {
      if (!ipv4Values.address) return "ipv4의 IP를 입력하세요";
      if (!ipv4Values.netmask) return "ipv4의 넷마스크를 입력하세요";
    }
    if (ipv6Values.protocol === "static") {
      if (!ipv6Values.address) return "ipv6의 IP를 입력하세요";
      if (!ipv6Values.netmask) return "ipv6의 넷마스크를 입력하세요";
    }
    return null;
  };

/*
  const handleOkClick = () => {
    Logger.debug(`HostNetworkEditModal > handleOkClick ... `)
    const error = validateForm();
    if (error) {
      validationToast.fail(error);
      return;
    }
    // IpAssignments 배열 만들기
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
      // }
      

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

    const attachmentsToSync = (initialInSync === false && networkModalState.inSync === true)
      ? [{ ...networkModalState }]
      : [];

    const attachmentsToModify = [{
      id: networkModalState.id,
      networkVo: networkModalState.networkVo,
      hostNicVo: networkModalState.hostNicVo,
      ipAddressAssignments: ipAssignments,
      dnsServers: networkModalState.dnsServers.filter(Boolean)
    }];

    onNetworkEdit({
      synchronizedNetworkAttachments: attachmentsToSync,
      modifiedNetworkAttachments: attachmentsToModify
    });
    onClose();
  };
  */

  const handleOkClick = () => {
    const error = validateForm();
    if (error) {
      validationToast.fail(error);
      return;
    }

    const ipAssignments = [];
    ["ipv4", "ipv6"].forEach(version => {
      const val = networkModalState[`${version}Values`];
      if (val.protocol) {
        ipAssignments.push({
          assignmentMethod: val.protocol,
          ipVo: {
            version: version.toUpperCase().replace("IPV", "V"),
            ...(val.protocol === "static"
              ? { 
                  address: val.address, 
                  gateway: val.gateway, 
                  netmask: val.netmask 
                }
              : {}
            ),
          }
        });
      }
    });

    // const attachmentsToSync = (!initialInSync && networkModalState.inSync)
    //   ? [{ ...networkModalState }]
    //   : [];
    const attachmentsToModify = [{
      id: networkModalState.id,
      networkVo: networkModalState.networkVo,
      hostNicVo: networkModalState.hostNicVo,
      ipAddressAssignments: ipAssignments,
      dnsServers: networkModalState.dnsServers.filter(Boolean)
    }];
    onNetworkEdit(attachmentsToModify);
    onClose();
  };


  return (
    <BaseModal targetName={`${Localization.kr.NETWORK} ${networkModalState?.networkVo?.name}`} submitTitle={Localization.kr.UPDATE}
      isOpen={isOpen} onClose={onClose}
      isReady={ networkModalState && networkModalState.networkVo && networkModalState.hostNicVo }
      onSubmit={handleOkClick}
      contentStyle={{ width: "800px" , height: "430px" }} 
    >
      <div className="popup-content-outer flex">
        <TabNavButtonGroup tabs={tabs} tabActive={selectedModalTab} />
        <div className="w-full px-4">
          <>
            {initialInSync === false && ( 
              <>
                <LabelCheckbox label={`${Localization.kr.NETWORK} 동기화`}
                  checked={networkModalState.inSync} 
                  onChange={checked => handleChange("inSync", null, !networkModalState.inSync)}
                />
                <hr/>
                {import.meta.env.DEV && <pre>initialInSync: {initialInSync === true ? "T" : "F"} networkModalState: {networkModalState.inSync === true ? "T" : "F"}</pre>}
              </>
            )}
          </>
          
          {selectedModalTab === "ipv4" && (
            <div className="select-box-outer">
  {import.meta.env.DEV && 
  <>
    <pre>protocol: {networkModalState.ipv4Values.protocol}</pre>
    <pre>address:{networkModalState.ipv4Values.address}, netmask: {networkModalState.ipv4Values.netmask}, gateway:{networkModalState.ipv4Values.gateway}</pre>
  </>
  }
              <LabelSelectOptions id="ipv4_mtu" label="부트 프로토콜"                  
                value={networkModalState.ipv4Values.protocol}
                options={ipv4Options}
                disabled={!networkModalState.inSync}
                onChange={e => handleChange("ipv4", "protocol", e.target.value)}
              />
              <LabelInput id="ip_address" label="IP"
                value={networkModalState.ipv4Values.address}
                disabled={!networkModalState.inSync || networkModalState.ipv4Values.protocol !== "static"}
                onChange={e => handleChange("ipv4", "address", e.target.value)}
              />
              <LabelInput id="netmask" label="넷마스크 / 라우팅 접두사"
                value={networkModalState.ipv4Values.netmask}
                disabled={!networkModalState.inSync || networkModalState.ipv4Values.protocol !== "static"}
                onChange={e => handleChange("ipv4", "netmask", e.target.value)}
              />
              <LabelInput id="gateway" label="게이트웨이"
                value={networkModalState.ipv4Values.gateway}
                disabled={!networkModalState.inSync || networkModalState.ipv4Values.protocol !== "static"}
                onChange={e => handleChange("ipv4", "gateway", e.target.value)}
              />
            </div>
          )}

          {selectedModalTab === "ipv6" && (
            <div className="select-box-outer">
              <LabelSelectOptions id="ipv6_protocol" label="부트 프로토콜"
                value={networkModalState.ipv6Values.protocol}
                options={ipv6Options}
                disabled={!networkModalState.inSync}
                onChange={e => handleChange("ipv6", "protocol", e.target.value)}
              />
              <LabelInput id="ip_address" label="IP"
                value={networkModalState.ipv6Values.address}
                disabled={!networkModalState.inSync || networkModalState.ipv6Values.protocol !== "static"}
                onChange={e => handleChange("ipv6", "address", e.target.value)}
              />
              <LabelInput id="netmask" label="넷마스크 / 라우팅 접두사"
                value={networkModalState.ipv6Values.netmask}
                disabled={!networkModalState.inSync || networkModalState.ipv6Values.protocol !== "static"}
                onChange={e => handleChange("ipv6", "netmask", e.target.value)}
              />
              <LabelInput id="gateway" label="게이트웨이"
                value={networkModalState.ipv6Values.gateway}
                disabled={!networkModalState.inSync || networkModalState.ipv6Values.protocol !== "static"}
                onChange={e => handleChange("ipv6", "gateway", e.target.value)}
              />
            </div>
          )}

          {selectedModalTab === "dns" && (
            <>
              <div className="font-bold">DNS 서버</div>
              {networkModalState.dnsServers.length > 0 ?
                networkModalState.dnsServers.map((dns, idx) => (
                  <DnsInputRow key={idx} value={dns}
                    onChange={e => handleDnsChange(idx, e.target.value)}
                    onAdd={handleDnsAdd}
                    onRemove={() => handleDnsRemove(idx)}
                  />
                )) : <span />}
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
