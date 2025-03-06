import React, { useState } from "react";
import BaseModal from "../BaseModal";
import LabelInput from "../../label/LabelInput";
import ModalNavButton from "../../navigation/ModalNavButton";

// 탭 메뉴
const tabs = [
  { id: "ipv4", label: "IPv4" },
  { id: "ipv6", label: "IPv6" },
  { id: "dns", label: "DNS 설정" },
];

// ipv4 부트 프로토콜
const ipv4Options = [
  { id: "default_mtu", value: "default", label: "없음" },
  { id: "dhcp_mtu", value: "dhcp", label: "DHCP" },
  { id: "static_mtu", value: "static", label: "정적" },
];

// ipv6 부트 프로토콜
const ipv6Options = [
  { id: "default_mtu", value: "default", label: "없음" },
  { id: "dhcp_mtu", value: "dhcp", label: "DHCP" },
  { id: "slaac_mtu", value: "slaac", label: "상태 비저장 주소 자동 설정" },
  { id: "dhcp_slaac_mtu", value: "dhcp_slaac", label: "DHCP 및 상태 비저장 주소 자동 설정" },
  { id: "static_mtu", value: "static", label: "정적" },
];


const HostNetworkEditModal = ({ 
  isOpen, 
  onClose,  
  network, 
  dnsState, 
  setDnsState 
}) => {
  const [selectedModalTab, setSelectedModalTab] = useState("ipv4");
  const [selectedIpv4Protocol, setSelectedIpv4Protocol] = useState("default");
  const [selectedIpv6Protocol, setSelectedIpv6Protocol] = useState("default");

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      targetName={`네트워크 수정: ${network?.name}`}
      submitTitle={""}
      onSubmit={() => {}}
      contentStyle={{ width: "880px", height: "500px" }} 
    >
      <div className="popup-content-outer flex">
        <ModalNavButton
          tabs={tabs}
          activeTab={selectedModalTab}
          onTabClick={setSelectedModalTab}
        />

        {/* 탭 내용 */}
        <div className="backup-edit-content">
          {selectedModalTab === "ipv4" && (
            <>
              <div className="backup-edit-radiobox">
                <div className="font-bold">부트 프로토콜</div>
                  {ipv4Options.map(({ id, value, label }, index) => (
                    <div className="flex" key={id}>
                      <input 
                        type="radio" name="ipv4_mtu" 
                        id={id} value={value} 
                        checked={selectedIpv4Protocol === value}
                        onChange={() => setSelectedIpv4Protocol(value)}
                      />
                      <label htmlFor={id}>{label}</label>
                    </div>
                  ))}
              </div>

              <div className="select-box-outer">
                <LabelInput id="ip_address" label="IP" disabled={selectedIpv4Protocol  !== "static"} />
                <LabelInput id="netmask" label="넷마스크 / 라우팅 접두사" disabled={selectedIpv4Protocol  !== "static"} />
                <LabelInput id="gateway" label="게이트웨이" disabled={selectedIpv4Protocol  !== "static"} />
              </div>
            </>
          )}

          {selectedModalTab === "ipv6" && (
            <>
              <div className="backup-edit-radiobox">
                <div className="font-bold mb-0.5">부트 프로토콜</div>
                  {ipv6Options.map(({ id, value, label }, index) => (
                    <div className="flex mb-0.5" key={id}>
                      <input 
                        type="radio" name="ipv6_mtu" 
                        id={id} value={value} 
                        checked={selectedIpv6Protocol === value}
                        onChange={() => setSelectedIpv6Protocol(value)}
                      />
                      <label htmlFor={id}>{label}</label>
                    </div>
                  ))}
              </div>
              <div className="select-box-outer mt-1">
                <LabelInput id="ip_address" label="IP" disabled={selectedIpv6Protocol !== "static"} />
                <LabelInput id="netmask" label="넷마스크 / 라우팅 접두사" disabled={selectedIpv6Protocol !== "static"} />
                <LabelInput id="gateway" label="게이트웨이" disabled={selectedIpv6Protocol !== "static"} />
              </div>
            </>
          )}

          {selectedModalTab === "dns" && (
            <>
              <div className="host-plus-checkbox">
                <input type="checkbox" id="dnsSetting" />
                <label htmlFor="dnsSetting">DNS 설정</label>
              </div>
            
            </>
          )}
        </div>
      </div>
    </BaseModal>
  );
};

export default HostNetworkEditModal;
