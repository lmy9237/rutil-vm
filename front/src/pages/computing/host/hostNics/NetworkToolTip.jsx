const NetworkToolTip = (network) => { 
  const ipList = network?.ipAddressAssignments

  const assignmentMethods = [
    { value: "none", label: "없음" },
    { value: "static", label: "정적" },
    { value: "poly_dhcp_autoconf", label: "DHCP 및 상태 비저장 주소 자동 설정" },
    { value: "autoconf", label: "상태 비저장 주소 자동 설정" },
    { value: "dhcp", label: "DHCP" },
  ];

  const ipv4 = ipList?.find(ip => ip?.ipVo?.version === "V4")?.ipVo || {};
  const ipv4AssignmentMethod = ipList?.find(ip => ip?.ipVo?.version === "V4")?.assignmentMethod || "없음";
  const ipv4Method = assignmentMethods.find((method) => method.value === ipv4AssignmentMethod)?.label || ipv4AssignmentMethod;
  
  const ipv6 = ipList?.find(ip => ip?.ipVo?.version === "V6")?.ipVo || {};
  const ipv6AssignmentMethod = ipList?.find(ip => ip?.ipVo?.version === "V6")?.assignmentMethod || "없음";
  const ipv6Method = assignmentMethods.find((method) => method.value === ipv6AssignmentMethod)?.label || ipv6AssignmentMethod;

  
  const usage = network?.networkVo?.usage
  const rvi16WrenchSvg = `<svg width="16" height="16" viewBox="0 0 16 16">
    <path fill="#555555" d="M11.4333 13.8L7.4 9.73333C7.17778 9.82222 6.95278 9.88889 6.725 9.93333C6.49722 9.97778 6.25556 10 6 10C4.88889 10 3.94444 9.61111 3.16667 8.83333C2.38889 8.05556 2 7.11111 2 6C2 5.6 2.05556 5.21944 2.16667 4.85833C2.27778 4.49722 2.43333 4.15556 2.63333 3.83333L5.06667 6.26667L6.26667 5.06667L3.83333 2.63333C4.15556 2.43333 4.49722 2.27778 4.85833 2.16667C5.21944 2.05556 5.6 2 6 2C7.11111 2 8.05556 2.38889 8.83333 3.16667C9.61111 3.94444 10 4.88889 10 6C10 6.25556 9.97778 6.49722 9.93333 6.725C9.88889 6.95278 9.82222 7.17778 9.73333 7.4L13.8 11.4333C13.9333 11.5667 14 11.7278 14 11.9167C14 12.1056 13.9333 12.2667 13.8 12.4L12.4 13.8C12.2667 13.9333 12.1056 14 11.9167 14C11.7278 14 11.5667 13.9333 11.4333 13.8Z"/>
  </svg>`;
  const rvi16MonitorSvg = `
    <svg width="16" height="16" viewBox="0 0 16 16">
      <path d="M5.33002 14V12.6667H2.66335C2.29669 12.6667 1.98279 12.5361 1.72168 12.275C1.46057 12.0139 1.33002 11.7 1.33002 11.3333V3.33333C1.33002 2.96667 1.46057 2.65278 1.72168 2.39167C1.98279 2.13056 2.29669 2 2.66335 2H13.33C13.6967 2 14.0106 2.13056 14.2717 2.39167C14.5328 2.65278 14.6634 2.96667 14.6634 3.33333V11.3333C14.6634 11.7 14.5328 12.0139 14.2717 12.275C14.0106 12.5361 13.6967 12.6667 13.33 12.6667H10.6634V14H5.33002ZM2.66335 11.3333H13.33V3.33333H2.66335V11.3333Z" fill="#555555"/>
    </svg>`;
  const rvil16MigrationSvg = `
    <svg width="16" height="16" viewBox="0 0 16 16">
      <path fill="#555555" d="M5.36816 9.31641L8.55176 6.21191L8.66211 6.10449L8.55176 5.99707L5.36816 2.89258L5.2627 2.79004L5.15723 2.89355L4.43652 3.60645L4.32812 3.71387L4.4375 3.82031L6.1123 5.4541H1.34961V6.75488H6.1123L4.4375 8.38867L4.32812 8.49512L4.43652 8.60254L5.15723 9.31543L5.2627 9.41895L5.36816 9.31641ZM10.8428 13.1064L11.5635 12.3936L11.6719 12.2861L11.5625 12.1797L9.8877 10.5459H14.6504V9.24512H9.8877L11.5625 7.61133L11.6719 7.50488L11.5635 7.39746L10.8428 6.68457L10.7373 6.58008L10.6318 6.68359L7.44824 9.78809L7.33789 9.89551L7.44824 10.0029L10.6318 13.1074L10.7373 13.21L10.8428 13.1064Z" stroke-width="0.3"/>
    </svg> `;
  const rvi16EventSvg = `
    <svg width="16" height="16" viewBox="0 0 16 16">
      <path fill="#555555" d="M4 14V2.66666H10.5C10.6556 2.66666 10.8 2.70277 10.9333 2.77499C11.0667 2.84721 11.1778 2.94443 11.2667 3.06666L13.3333 5.99999L11.2667 8.93332C11.1778 9.05555 11.0667 9.15277 10.9333 9.22499C10.8 9.29721 10.6556 9.33332 10.5 9.33332H5.33333V14H4Z"/>
    </svg>`;
  const rvi16VmNetworkSvg = `
    <svg width="16" height="16" viewBox="0 0 16 16">
      <path fill="#555555" d="M16 12C16 12.5523 15.5523 13 15 13H1C0.447715 13 0 12.5523 0 12V4C0 3.44772 0.447715 3 1 3H15C15.5523 3 16 3.44772 16 4V12ZM2.43622 5.18164C1.99645 5.18164 1.68767 5.61491 1.83119 6.0306L3.3143 10.3263C3.45348 10.7295 3.83305 11 4.25955 11H4.41883C4.84549 11 5.22516 10.7293 5.36422 10.3259L6.84538 6.02957C6.98854 5.6143 6.68005 5.18164 6.2408 5.18164V5.18164C5.96243 5.18164 5.71604 5.36171 5.6315 5.62692L4.37241 9.57696C4.36755 9.5922 4.3534 9.60254 4.33741 9.60254V9.60254C4.32141 9.60254 4.30725 9.59218 4.3024 9.57694L3.04618 5.62769C2.96168 5.36205 2.71498 5.18164 2.43622 5.18164V5.18164ZM8.74559 5.18164C8.24428 5.18164 7.83789 5.58803 7.83789 6.08934V10.4033C7.83789 10.7329 8.10503 11 8.43457 11V11C8.76411 11 9.03125 10.7329 9.03125 10.4033V7.22774C9.03125 7.21199 9.04402 7.19922 9.05977 7.19922V7.19922C9.07145 7.19922 9.08194 7.20633 9.08627 7.21717L10.4343 10.5941C10.5253 10.8221 10.746 10.9717 10.9915 10.9717V10.9717C11.2367 10.9717 11.4572 10.8225 11.5484 10.5948L12.8961 7.23082C12.9005 7.21999 12.911 7.21289 12.9226 7.21289V7.21289C12.9384 7.21289 12.9512 7.22567 12.9512 7.24143V10.4033C12.9512 10.7329 13.2183 11 13.5479 11V11C13.8774 11 14.1445 10.7329 14.1445 10.4033V6.08934C14.1445 5.58803 13.7381 5.18164 13.2368 5.18164V5.18164C12.8685 5.18164 12.5367 5.40423 12.397 5.74504L11.0384 9.05919C11.0305 9.07833 11.0119 9.09082 10.9912 9.09082V9.09082C10.9705 9.09082 10.9519 9.07833 10.9441 9.05919L9.58545 5.74504C9.44574 5.40423 9.11392 5.18164 8.74559 5.18164V5.18164Z"/>
    </svg>`;

    
  const ipv4Section = ipv4?.gateway
    ? `
      <strong>IPv4</strong><br/>
      <strong>부트 프로토콜: </strong>${ipv4Method}<br/>
      <strong>주소: </strong>${ipv4.address || "없음"}<br/>
      <strong>서브넷: </strong>${ipv4.netmask || "없음"}<br/>
      <strong>게이트웨이: </strong>${ipv4.gateway}<br/><br/>`
    : `
      <strong>IPv4 </strong><br/>
      <strong>부트 프로토콜: </strong>${ipv4Method}<br/>
    `;

  // IPv6은 그대로 출력
  const ipv6Section = ipv6?.gateway
    ? `
      <strong>IPv6</strong><br/>
      <strong>부트 프로토콜: </strong>${ipv6Method}<br/>
      <strong>주소: </strong>${ipv6.address || "없음"}<br/>
      <strong>서브넷: </strong>${ipv6.netmask || "없음"}<br/>
      <strong>게이트웨이: </strong>${ipv6.gateway || "없음"}<br/><br/>`
    : `
      <strong>IPv6 </strong><br/>
      <strong>부트 프로토콜: </strong>${ipv6Method}<br/><br/>
    `;

  const usageDetail = `
    <strong>사용 </strong><br/>
    ${usage?.management
      ? `<div class="f-start gap-6">${rvi16WrenchSvg} 관리</div>`
      : ""}
    ${usage?.display
      ? `<div class="f-start gap-6">${rvi16MonitorSvg} 디스플레이</div>`
      : ""}
    ${usage?.migration
      ? `<div class="f-start gap-6">${rvil16MigrationSvg} 마이그레이션</div>`
      : ""}
    ${usage?.defaultRoute
      ? `<div class="f-start gap-6">${rvi16EventSvg} 기본 라우터</div>`
      : ""}
    ${usage?.vm
      ? `<div class="f-start gap-6">${rvi16VmNetworkSvg} 가상머신 네트워크</div>`
      : ""}
  `;

  return `
    <div style="text-align: left;">
      ${ipv4Section}
      ${ipv6Section}
      ${usageDetail}
    </div>
  `;
};

export default NetworkToolTip;