import React, { useEffect, useState } from "react";
import BaseModal from "../BaseModal";
import LabelInput from "../../label/LabelInput";
import LabelCheckbox from "../../label/LabelCheckbox";
import ModalNavButton from "../../navigation/ModalNavButton";
import Localization from "../../../utils/Localization";
import LabelSelectOptions from "../../label/LabelSelectOptions";
import { RVI36, rvi36Add, rvi36Remove } from "../../icons/RutilVmIcons";
import ToggleSwitchButton from "../../button/ToggleSwitchButton";
import Logger from "../../../utils/Logger";

// 탭 메뉴
const tabs = [
  { id: "ipv4", label: "IPv4" },
  { id: "ipv6", label: "IPv6" },
  { id: "dns", label: "DNS 설정" },
];

// ipv4 부트 프로토콜
const ipv4Options = [
  { value: "none", label: "없음" },
  { value: "dhcp", label: "DHCP" },
  { value: "static", label: "정적" },
];
// ipv6 부트 프로토콜
const ipv6Options = [
  { value: "none", label: "없음" },
  { value: "dhcp", label: "DHCP" },
  { value: "autoconf", label: `${Localization.kr.STATELESS} 주소 자동 설정` },
  { value: "poly_dhcp_autoconf", label: `DHCP 및 ${Localization.kr.STATELESS} 주소 자동 설정` },
  { value: "static", label: "정적" },
];

const initialFormState = {
  id: "",
  inSync: true,
};

const HostNetworkEditModal = ({ 
  isOpen, 
  onClose,  
  networkAttachment, 
  dnsState, 
  setDnsState 
}) => {
  Logger.debug(`networkAttachment 데이터: ${JSON.stringify(networkAttachment, null, 2)}`);
  const [selectedModalTab, setSelectedModalTab] = useState("ipv4");  
  const [formState, setFormState] = useState(initialFormState);
    
  const [networkVo, setNetworkVo] = useState({ id: "", name: "" });
  const [ipv4Values, setIpv4Values] = useState({ protocol: "none", address: "", gateway: "", netmask: "" });
  const [ipv6Values, setIpv6Values] = useState({ protocol: "none", address: "", gateway: "", netmask: "" });
  const [dnsServers, setDnsServers] = useState([]); //nameServerList
  // const { mutate: addNetwork } = useAddNetwork(onSuccess, () => onClose());
  
  useEffect(() => {  
    if (networkAttachment) {
      setFormState({
        id: networkAttachment?.id,
        inSync: networkAttachment?.inSync
      });
  
      setNetworkVo({
        id: networkAttachment?.networkVo?.id,
        name: networkAttachment?.networkVo?.name
      });

      const assignments = networkAttachment.ipAddressAssignments || [];
      assignments.forEach((ip) => {
        const { assignmentMethod, ipVo } = ip;
        if (ipVo?.version === "V4") {
          setIpv4Values({
            protocol: assignmentMethod,
            address: ipVo.address || "",
            gateway: ipVo.gateway || "",
            netmask: ipVo.netmask || "",
          });
        }
        if (ipVo?.version === "V6") {
          setIpv6Values({
            protocol: assignmentMethod,
            address: ipVo.address || "",
            gateway: ipVo.gateway || "",
            netmask: ipVo.netmask || "",
          });
        }
      });
  
      setDnsServers(networkAttachment?.nameServerList || []);
    }
  }, [isOpen, networkAttachment]);  

  return (
    <BaseModal targetName={`네트워크 ${networkVo?.name}`} submitTitle={"수정"}
      isOpen={isOpen} onClose={onClose}      
      onSubmit={() => {}}
      contentStyle={{ width: "800px" , height: "430px" }} 
    >
      <div className="popup-content-outer flex">
        <ModalNavButton
          tabs={tabs}
          activeTab={selectedModalTab}
          onTabClick={setSelectedModalTab}
        />

        <div className="backup-edit-content">
          <LabelCheckbox id="in_sync" label="네트워크 동기화 (임시)"        
            value={formState.inSync}
            disabled={true}
            onChange={(e) => setFormState(prev => ({...prev, inSync: e.target.value}))}
          />
          <hr/>
        {/* <ToggleSwitchButton label={`${Localization.kr.NETWORK} 동기화`}
          checked={formState.inSync}
          // disabled={editMode}
          onChange={() => setFormState((prev) => ({ ...prev, inSync: !formState.inSync }))}
          tType={"동기화"} fType={"비동기화"}
        /> */}
          {selectedModalTab === "ipv4" && (
            <>
              <div className="select-box-outer">
                <LabelSelectOptions id="ipv4_mtu" label="부트 프로토콜"                  
                  value={ipv4Values.protocol}
                  options={ipv4Options}
                  onChange={(e) => setIpv4Values(prev => ({ ...prev, protocol: e.target.value }))}
                />
                <LabelInput id="ip_address" label="IP"
                  value={ipv4Values.address}
                  onChange={(e) => setIpv4Values(prev => ({ ...prev, address: e.target.value }))}
                  disabled={ipv4Values.protocol !== "static"}
                />
                <LabelInput id="netmask" label="넷마스크 / 라우팅 접두사"
                  value={ipv4Values.netmask}
                  onChange={(e) => setIpv4Values(prev => ({ ...prev, netmask: e.target.value }))}
                  disabled={ipv4Values.protocol !== "static"}
                />
                <LabelInput id="gateway" label="게이트웨이"
                  value={ipv4Values.gateway}
                  onChange={(e) => setIpv4Values(prev => ({ ...prev, gateway: e.target.value }))}
                  disabled={ipv4Values.protocol !== "static"}
                />
              </div>
            </>
          )}

          {selectedModalTab === "ipv6" && (
            <>
              <div className="select-box-outer">
                <LabelSelectOptions id="ipv6_protocol" label="부트 프로토콜"
                  value={ipv6Values.protocol}
                  disabled={false}
                  options={ipv6Options}
                  onChange={(e) => setIpv6Values(prev => ({ ...prev, protocol: e.target.value }))}
                />
                <LabelInput id="ip_address" label="IP"
                  value={ipv6Values.address}
                  onChange={(e) => setIpv6Values(prev => ({ ...prev, address: e.target.value }))}
                  disabled={ipv6Values.protocol !== "static"}
                />
                <LabelInput id="netmask" label="넷마스크 / 라우팅 접두사"
                  value={ipv6Values.netmask}
                  onChange={(e) => setIpv6Values(prev => ({ ...prev, netmask: e.target.value }))}
                  disabled={ipv6Values.protocol !== "static"}
                />
                <LabelInput id="gateway" label="게이트웨이"
                  value={ipv6Values.gateway}
                  onChange={(e) => setIpv6Values(prev => ({ ...prev, gateway: e.target.value }))}
                  disabled={ipv6Values.protocol !== "static"}
                />
              </div>
            </>
          )}

          {selectedModalTab === "dns" && (
            <>
              <div className="host-plus-checkbox">
                <div className="text-[15px] font-bold"> DNS 서버 </div>
                  {dnsServers.length !== 0 ?
                    (dnsServers.map((dns, index) => (
                    <div
                      key={index}
                      className="network-form-group f-btw"
                      style={{ width: "100%", padding: 0 }}
                    >
                      <LabelInput
                        value={dns}
                        onChange={(e) => {
                          const updated = [...dnsServers];
                          updated[index] = e.target.value;
                          setDnsServers(updated);
                        }}
                      />
                      <div className="dynamic-btns f-end">
                        <RVI36
                          iconDef={rvi36Add(false)}
                          className="btn-icon"
                          currentColor="transparent"
                          onClick={() => setDnsServers((prev) => [...prev, ""])}
                        />
                        <RVI36
                          iconDef={rvi36Remove()}
                          className="btn-icon"
                          currentColor="transparent"
                          onClick={() => {
                            const updated = [...dnsServers];
                            updated.splice(index, 1);
                            setDnsServers(updated);
                          }}
                        />
                      </div> 
                    </div>
                  ))) :(
                    <>
                    <span>t</span>
                    </>
                  )
                }
              </div>
            </>
          )}
        </div>
      </div>
    </BaseModal>
  );
};

export default HostNetworkEditModal;
