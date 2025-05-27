import { checkZeroSizeToMbps } from "@/util";

/**
 * NIC 데이터를 변환합니다.
 * @param {Array} hostNics
 * @param {Object} nicMap
 * @returns {Array}
 */
export function transNic(hostNics = [], nicMap = {}) {
  
  return (hostNics || [])
    .sort((a, b) => a?.name.localeCompare(b?.name))
    .filter((nic) => 
      !(hostNics || []).some((parent) =>
        Array.isArray(parent.bondingVo?.slaveVos)
          ? parent.bondingVo.slaveVos.some((slave) => slave.id === nic.id)
          : false
        )
    )
    .map((e) => ({
      ...e,
      bondingVo: {
        activeSlaveVo: {
          id: e?.bondingVo?.activeSlaveVo?.id,
          name: e?.bondingVo?.activeSlaveVo?.name,
        },
        slaveVos: Array.isArray(e?.bondingVo?.slaveVos)
          ? e.bondingVo.slaveVos.map((slave) => ({
              id: slave.id,
              name: slave.name,
              status: nicMap[slave.id]?.status,
            }))
          : [],
        optionVos: Array.isArray(e?.bondingVo?.optionVos)
          ? e.bondingVo.optionVos.map((option) => ({
              name: option.name,
              value: option.value,
            }))
          : [],
      },
      ip4: {
        address: e?.ip?.address,
        gateway: e?.ip?.gateway,
        netmask: e?.ip?.netmask,
        version: e?.ip?.version,
      },
      ip6: {
        address: e?.ipv6?.address,
        gateway: e?.ipv6?.gateway,
        netmask: e?.ipv6?.netmask,
        version: e?.ipv6?.version,
      },
      network: {
        id: e?.networkVo?.id,
        name: e?.networkVo?.name,
      },
      speed: checkZeroSizeToMbps(e?.speed),
      rxSpeed: checkZeroSizeToMbps(e?.rxSpeed),
      txSpeed: checkZeroSizeToMbps(e?.txSpeed),
      rxTotalSpeed: e?.rxTotalSpeed?.toLocaleString() || "0",
      txTotalSpeed: e?.txTotalSpeed?.toLocaleString() || "0",
      pkts: `${e?.rxTotalError ?? 1} Pkts`,
    }));
}


/**
 * 네트워크 어태치먼트와 클러스터 네트워크 정보 병합
 * @param {Array} networkAttachments
 * @param {Array} networks
 * @returns {Array}
 */
export function transNA(networkAttachments = [], networks = []) {
  return (networkAttachments || []).map((e) => {
    const networkFromCluster = (networks || []).find((net) => net.id === e?.networkVo?.id);
    return {
      ...e,
      networkVo: {
        id: e?.networkVo?.id,
        name: e?.networkVo?.name,
        status: networkFromCluster?.status || "UNKNOWN",
        vlan: networkFromCluster?.vlan,
      },
      nameServerList: e?.nameServerList || [],
    };
  });
}


/**
 * 할당되지 않은 네트워크 목록 반환
 * @param {Array} networks
 * @param {Array} networkAttachments
 * @returns {Array}
 */
export function transDetachNA(networks = [], networkAttachments = []) {
  const attachedIds = new Set((networkAttachments || []).map((na) => na.networkVo?.id));
  return (networks || [])
    .filter((net) => !attachedIds.has(net.id))
    .map((e) => ({
      id: e?.id,
      name: e?.name,
      status: e?.status || "NON_OPERATIONAL",
      vlan: e?.vlan,
      required: e?.required ? "필수" : "필수X",
      usageVm: !!e?.usage?.vm,
    }));
}



// 본딩 생성 시 모달에 넘길 값 생성 함수
export function getBondModalStateForCreate(nic1, nic2, baseNetworkAttachments = [], movedNetworkAttachments = []) {
  // NIC가 가지고 있는 네트워크 찾기 함수
  const getNetworksFromNic = (nicId) => 
    [...baseNetworkAttachments, ...movedNetworkAttachments].filter(
      na => na.hostNicVo?.id === nicId
    );

  return {
    name: "",
    optionMode: "1",
    userMode: "",
    editTarget: [
      { ...nic1, networks: getNetworksFromNic(nic1.id) },
      { ...nic2, networks: getNetworksFromNic(nic2.id) }
    ]
  };
}

// 본딩 편집 시 모달에 넘길 값 생성 함수
export function getBondModalStateForEdit(bond) {
  return {
    name: bond.name,
    optionMode: bond.bondingVo.optionVos.find(opt => opt.name === "mode")?.value ?? "1",
    userMode: bond.bondingVo.optionVos.map(opt => `${opt.name}=${opt.value}`).join(', ') || "",
    editTarget: bond
  };
}


// 네트워크 어태치먼트 상태 변환 함수
export function getNetworkAttachmentModalState(networkAttachment, baseNetworkAttachments = [], movedNetworkAttachments = []) {
  let targetNA;

  if (networkAttachment.id) {
    // 기존 할당
    targetNA = [...baseNetworkAttachments].find(na => na.id === networkAttachment.id);
  } else {
    // 신규 할당
    targetNA = [...movedNetworkAttachments].find(
      na => na.hostNicVo?.id === networkAttachment.hostNicVo?.id &&
            na.networkVo?.id === networkAttachment.networkVo?.id
    );
  }

  return {
    id: targetNA?.id,
    inSync: targetNA?.inSync ?? false,
    networkVo: targetNA?.networkVo ?? { id: "", name: "" },
    hostNicVo: targetNA?.hostNicVo ?? { id: "", name: "" },
    ipv4Values: {
      protocol: targetNA?.ipAddressAssignments?.find(ip => ip.ipVo?.version === "V4")?.assignmentMethod ?? "none",
      address: targetNA?.ipAddressAssignments?.find(ip => ip.ipVo?.version === "V4")?.ipVo?.address ?? "",
      gateway: targetNA?.ipAddressAssignments?.find(ip => ip.ipVo?.version === "V4")?.ipVo?.gateway ?? "",
      netmask: targetNA?.ipAddressAssignments?.find(ip => ip.ipVo?.version === "V4")?.ipVo?.netmask ?? "",
    },
    ipv6Values: {
      protocol: targetNA?.ipAddressAssignments?.find(ip => ip.ipVo?.version === "V6")?.assignmentMethod ?? "none",
      address: targetNA?.ipAddressAssignments?.find(ip => ip.ipVo?.version === "V6")?.ipVo?.address ?? "",
      gateway: targetNA?.ipAddressAssignments?.find(ip => ip.ipVo?.version === "V6")?.ipVo?.gateway ?? "",
      netmask: targetNA?.ipAddressAssignments?.find(ip => ip.ipVo?.version === "V6")?.ipVo?.netmask ?? "",
    },
    dnsServers: Array.isArray(targetNA?.dnsServers) ? [...targetNA.dnsServers] : [],
  };
}
