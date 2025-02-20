import React, { useEffect, useState } from "react";
import BaseModal from "../BaseModal";

const NetworkHostPlusModal = ({
  isOpen,
  onClose,
  initialSelectedTab = "ipv4",
}) => {
  const [selectedModalTab, setSelectedModalTab] = useState(initialSelectedTab);

  useEffect(() => {
    // 모달이 열릴 때 기본 탭으로 초기화
    if (isOpen) {
      setSelectedModalTab("ipv4");
    }
  }, [isOpen]);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      targetName={"관리 네트워크 인터페이스 수정: ovirtmgmt"}
      submitTitle={"추가"}
      onSubmit={() => {}}
      contentStyle={{ width: "880px", height: "500px" }} 
    >
      {/* <div className="network-backup-edit modal"> */}
      <div className="popup-content-outer flex">
        <div className="network-backup-edit-nav">
          <div
            id="ipv4_tab"
            className={
              selectedModalTab === "ipv4" ? "active-tab" : "inactive-tab"
            }
            onClick={() => setSelectedModalTab("ipv4")}
          >
            IPv4
          </div>
          <div
            id="ipv6_tab"
            className={
              selectedModalTab === "ipv6" ? "active-tab" : "inactive-tab"
            }
            onClick={() => setSelectedModalTab("ipv6")}
          >
            IPv6
          </div>
          <div
            id="dns_tab"
            className={
              selectedModalTab === "dns" ? "active-tab" : "inactive-tab"
            }
            onClick={() => setSelectedModalTab("dns")}
          >
            DNS 설정
          </div>
        </div>

        {/* 탭 내용 */}
        <div className="backup-edit-content">
          <div
            className="host-plus-checkbox"
            style={{ borderBottom: "1px solid gray" }}
          >
            <input type="checkbox" id="allow_all_users" checked />
            <label htmlFor="allow_all_users">네트워크 동기화</label>
          </div>
          {selectedModalTab === "ipv4" && (
            <>
              <div className="backup-edit-radiobox">
                <div className="font-bold">부트 프로토콜</div>
                <div className="flex">
                  <input
                    type="radio"
                    id="default_mtu"
                    name="mtu"
                    value="default"
                    checked
                  />
                  <label htmlFor="default_mtu">없음</label>
                </div>
                <div className="flex">
                  <input type="radio" id="dhcp_mtu" name="mtu" value="dhcp" />
                  <label htmlFor="dhcp_mtu">DHCP</label>
                </div>
                <div className="flex">
                  <input
                    type="radio"
                    id="static_mtu"
                    name="mtu"
                    value="static"
                  />
                  <label htmlFor="static_mtu">정적</label>
                </div>
              </div>

              <div className="select-box-outer">
                <div className="select-box">
                  <label htmlFor="ip_address">IP</label>
                  <select id="ip_address" disabled>
                    <option value="#">#</option>
                  </select>
                </div>
                <div className="select-box">
                  <label htmlFor="netmask">넷마스크 / 라우팅 접두사</label>
                  <select id="netmask" disabled>
                    <option value="#">#</option>
                  </select>
                </div>
                <div className="select-box">
                  <label htmlFor="gateway">게이트웨이</label>
                  <select id="gateway" disabled>
                    <option value="#">#</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {selectedModalTab === "ipv6" && (
            <>
              <div className="backup-edit-radiobox">
                <div className="font-bold mb-0.5">부트 프로토콜</div>
                <div className="flex mb-0.5">
                  <input
                    type="radio"
                    id="default_mtu"
                    name="mtu"
                    value="default"
                    checked
                  />
                  <label htmlFor="default_mtu">없음</label>
                </div>
                <div className="flex mb-0.5">
                  <input type="radio" id="dhcp_mtu" name="mtu" value="dhcp" />
                  <label htmlFor="dhcp_mtu">DHCP</label>
                </div>
                <div className="flex mb-0.5">
                  <input type="radio" id="slaac_mtu" name="mtu" value="slaac" />
                  <label htmlFor="slaac_mtu">상태 비저장 주소 자동 설정</label>
                </div>
                <div className="flex mb-0.5">
                  <input
                    type="radio"
                    id="dhcp_slaac_mtu"
                    name="mtu"
                    value="dhcp_slaac"
                  />
                  <label htmlFor="dhcp_slaac_mtu">
                    DHCP 및 상태 비저장 주소 자동 설정
                  </label>
                </div>
                <div className="flex mb-0.5">
                  <input
                    type="radio"
                    id="static_mtu"
                    name="mtu"
                    value="static"
                  />
                  <label htmlFor="static_mtu">정적</label>
                </div>
              </div>

              <div className="select-box-outer mt-3">
                <div className="select-box">
                  <label htmlFor="ip_address" className="disabled">
                    IP
                  </label>
                  <select id="ip_address" className="disabled" disabled>
                    <option value="#">#</option>
                  </select>
                </div>
                <div className="select-box">
                  <label htmlFor="netmask" className="disabled">
                    넷마스크 / 라우팅 접두사
                  </label>
                  <select id="netmask" className="disabled" disabled>
                    <option value="#">#</option>
                  </select>
                </div>
                <div className="select-box">
                  <label htmlFor="gateway" className="disabled">
                    게이트웨이
                  </label>
                  <select id="gateway" className="disabled" disabled>
                    <option value="#">#</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {selectedModalTab === "dns" && (
            <>
              <div className="host-plus-checkbox">
                <input type="checkbox" id="qos_override" />
                <label htmlFor="qos_override">QoS 덮어쓰기</label>
              </div>
              <div className="p-1 font-bold">아웃바운드</div>
              <div className="select-box-outer">
                <div className="select-box">
                  <label htmlFor="weighted_share" className="disabled">
                    가중 공유
                  </label>
                  <input type="text" id="weighted_share" disabled />
                </div>
                <div className="select-box">
                  <label htmlFor="rate_limit" className="disabled">
                    속도 제한 [Mbps]
                  </label>
                  <input type="text" id="rate_limit" disabled />
                </div>
                <div className="select-box">
                  <label htmlFor="commit_rate" className="disabled">
                    커밋 속도 [Mbps]
                  </label>
                  <input type="text" id="commit_rate" disabled />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </BaseModal>
  );
};

export default NetworkHostPlusModal;
