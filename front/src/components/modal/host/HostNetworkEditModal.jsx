import React, { useState } from "react";
import BaseModal from "../BaseModal";
import LabelInput from "../../label/LabelInput";
import ModalNavButton from "../../navigation/ModalNavButton";
import Localization from "../../../utils/Localization";
import LabelSelectOptions from "../../label/LabelSelectOptions";

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
  { id: "slaac_mtu", value: "slaac", label: `${Localization.kr.STATELESS} 주소 자동 설정` },
  { id: "dhcp_slaac_mtu", value: "dhcp_slaac", label: `DHCP 및 ${Localization.kr.STATELESS} 주소 자동 설정` },
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
      targetName={`네트워크 ${network?.name}`}
      submitTitle={"수정"}
      onSubmit={() => {}}
      contentStyle={{ width: "880px" }} 
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
              <div className="select-box-outer">
                <LabelSelectOptions
                  label="부트 프로토콜"
                  id="ipv4_mtu"
                  value={selectedIpv4Protocol}
                  onChange={(e) => setSelectedIpv4Protocol(e.target.value)}
                  options={ipv4Options}
                  disabled={false}
                />
                <LabelInput id="ip_address" label="IP" disabled={selectedIpv4Protocol  !== "static"} />
                <LabelInput id="netmask" label="넷마스크 / 라우팅 접두사" disabled={selectedIpv4Protocol  !== "static"} />
                <LabelInput id="gateway" label="게이트웨이" disabled={selectedIpv4Protocol  !== "static"} />
              </div>
            </>
          )}

          {selectedModalTab === "ipv6" && (
            <>
            <div className="select-box-outer">
              <LabelSelectOptions
                  label="부트 프로토콜"
                  id="ipv6_protocol"
                  value={selectedIpv6Protocol}
                  onChange={(e) => setSelectedIpv6Protocol(e.target.value)}
                  disabled={false}
                  options={ipv6Options}
              />
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
