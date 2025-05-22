import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import BaseModal from "../BaseModal";
import useGlobal from "../../../hooks/useGlobal";
import LabelInput from "../../label/LabelInput";
import TabNavButtonGroup from "../../common/TabNavButtonGroup";
import Localization from "../../../utils/Localization";
import LabelSelectOptions from "../../label/LabelSelectOptions";
import { RVI36, rvi36Add, rvi36Remove } from "../../icons/RutilVmIcons";
import Logger from "../../../utils/Logger";
import ToggleSwitchButton from "../../button/ToggleSwitchButton";

const HostNetworkEditModal = ({ 
  isOpen, 
  onClose,
  networkAttachment
}) => {
  // const { closeModal } = useUIState()
  const { hostsSelected } = useGlobal();
  const hostId = useMemo(() => [...hostsSelected][0]?.id, [hostsSelected]);
  const hostName = useMemo(() => [...hostsSelected][0]?.name, [hostsSelected]);

  const [selectedModalTab, setSelectedModalTab] = useState("ipv4");  
  // 탭 메뉴
  const tabs = useMemo(() => [
    { id: "ipv4",  label: "IPv4",    onClick: () => setSelectedModalTab("ipv4") },
    { id: "ipv6",  label: "IPv6",    onClick: () => setSelectedModalTab("ipv6") },
    // { id: "dns",   label: "DNS 설정", onClick: () => setSelectedModalTab("dns") },
  ], []);

  // const { mutate: editNetworkAttach} = useEditHostNetworkFromHost(onClose, onClose)
  
  const [id, setId] = useState("");
  const [inSync, setInSync] = useState(false);
  const [networkVo, setNetworkVo] = useState({ id: "", name: "" });
  const [ipv4Values, setIpv4Values] = useState({ protocol: "none", address: "", gateway: "", netmask: "" });
  const [ipv6Values, setIpv6Values] = useState({ protocol: "none", address: "", gateway: "", netmask: "" });
  const [dnsServers, setDnsServers] = useState([]); //nameServerList
  
  useEffect(() => {  
    if (isOpen) {
      setSelectedModalTab("ipv4"); // 모달 열릴 때 탭을 무조건 IPv4로 초기화
    }

    if (networkAttachment) {
      setId(networkAttachment?.id);
      setInSync(false);
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

  const validateForm = () => {
    // if (!networkVo.id) return `${Localization.kr.NETWORK}를 선택해주세요.`;
    return null;
  };

  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) return toast.error(error);

    const ipAssignments = [];

    if (ipv4Values.protocol !== "none") {
      ipAssignments.push({
        assignmentMethod: ipv4Values.protocol,
        ipVo: {
          version: "V4",
          address: ipv4Values.address,
          gateway: ipv4Values.gateway,
          netmask: ipv4Values.netmask,
        },
      });
    }

    if (ipv6Values.protocol !== "none") {
      ipAssignments.push({
        assignmentMethod: ipv6Values.protocol,
        ipVo: {
          version: "V6",
          address: ipv6Values.address,
          gateway: ipv6Values.gateway,
          netmask: ipv6Values.netmask,
        },
      });
    }

    const dataToSubmit = {
      networkVo: networkVo, // { id, name }
      hostNicVo: {
        id: networkAttachment?.hostNicVo?.id || "",
      },
      ipAddressAssignments: ipAssignments,
      nameServerList: dnsServers,
    };

    Logger.debug(`Form Data: ${JSON.stringify(dataToSubmit, null, 2)}`);

    // editNetworkAttach({
    //   hostId: hostId,
    //   networkAttachmentId: networkAttachment.id,
    //   networkAttachmentData: dataToSubmit,
    // });
  };


  return (
    <BaseModal targetName={`${Localization.kr.NETWORK} ${networkVo?.name}`} submitTitle={Localization.kr.UPDATE}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "800px" , height: "430px" }} 
    >
      <div className="popup-content-outer flex">
        {/* 왼쪽 네비게이션 */}
        <TabNavButtonGroup
          tabs={tabs}
          tabActive={selectedModalTab}
        />

        <div className="w-full px-4">
          <ToggleSwitchButton label={`${Localization.kr.NETWORK} 동기화 (임시)`}
            checked={inSync}
            disabled={true}
            onChange={() => setInSync((prev) => ({ ...prev, inSync: prev.target.value }))}
            tType={"동기화"} fType={"비동기화"}
          />
          <span>host {hostName} / {hostId}</span><br/>
          <span>nicname {networkAttachment?.hostNicVo?.name}</span><br/>
          <span>network {networkAttachment?.id}</span>
          <hr/>
          {selectedModalTab === "ipv4" && (
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
          )}

          {selectedModalTab === "ipv6" && (
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
          )}

          {selectedModalTab === "dns" && (
            <>
              <div className="font-bold"> DNS 서버 </div>
                {dnsServers.length !== 0 ?
                  (dnsServers.map((dns, index) => (
                  <div
                    key={index}
                    className="f-btw"
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
                  <span>t</span>
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
