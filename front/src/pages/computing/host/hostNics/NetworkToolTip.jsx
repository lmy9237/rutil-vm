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


  const ipv4Section = ipv4?.gateway
    ? `
      <strong>IPv4 </strong><br/>
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
      <strong>IPv6 </strong><br/>
      <strong>부트 프로토콜: </strong>${ipv6Method}<br/>
      <strong>주소: </strong>${ipv6.address || "없음"}<br/>
      <strong>서브넷: </strong>${ipv6.netmask || "없음"}<br/>
      <strong>게이트웨이: </strong>${ipv6.gateway || "없음"}<br/>`
    : `
      <strong>IPv6 </strong><br/>
      <strong>부트 프로토콜: </strong>${ipv6Method}<br/>
    `;

  return `
    <div style="text-align: left;">
      ${ipv4Section}
      ${ipv6Section}
    </div>
  `;
};

export default NetworkToolTip;