import { checkZeroSizeToMbps, emptyIdNameVo } from "@/util";

/**
 * 본딩 및 nic 반환
 * @param {Array} hostNics
 * @param {Object} nicMap
 * @returns {Array}
 */
export function transNic(hostNics = [], nicMap = {}) {
  return (hostNics || [])
    .sort((a, b) => a?.name.localeCompare(b?.name)) // 이름으로
    .filter((nic) => 
      !hostNics.some((parent) =>
        Array.isArray(parent.bondingVo?.slaveVos)
          ? parent.bondingVo.slaveVos.some((slave) => slave.name === nic.name)
          : false
        )
    )
    .map((e) => ({
      ...e,
      bondingVo: {
        activeSlaveVo: e?.bondingVo?.activeSlaveVo,
        slaveVos: Array.isArray(e?.bondingVo?.slaveVos)
          ? e.bondingVo.slaveVos.map((slave) => ({
              id: slave.id,
              name: slave.name,
              status: nicMap[slave.name]?.status,
            }))
          : [],
        optionVos: Array.isArray(e?.bondingVo?.optionVos)
          ? e.bondingVo.optionVos.map((option) => ({
              name: option.name,
              value: option.value,
            }))
          : [],
      },
      ip4: e?.ip,
      ip6: e?.ipv6,
      network: {
        id: e?.networkVo?.id,
        name: e?.networkVo?.name,
        usage: {
          vm: e?.networkVo?.usage?.vm,
          management: e?.networkVo?.usage?.management,
          display: e?.networkVo?.usage?.display,
          migration: e?.networkVo?.usage?.migration,
          gluster: e?.networkVo?.usage?.gluster,
          defaultRoute: e?.networkVo?.usage?.defaultRoute,
        }
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
 * 할당된 네트워크 반환 (클러스터 네트워크 정보 병합)
 * @param {Array} networkAttachments
 * @param {Array} networks
 * @returns {Array}
 */
export function transNA(networkAttachments = [], networks = []) {
  return (networkAttachments || []).map((e) => {
    const networkFromCluster = (networks || []).find((net) => net.id === e?.networkVo?.id);
    return {
      ...e,
      id: e?.id,
      inSync: e?.inSync,
      networkVo: {
        id: e?.networkVo?.id,
        name: e?.networkVo?.name,
        status: networkFromCluster?.status || "UNKNOWN",
        vlan: networkFromCluster?.vlan,
        usage: networkFromCluster?.usage,
      },
      nameServerList: e?.nameServerList || [],
    };
  });
}

/**
 * 할당되지 않은 네트워크 반환
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
      required: e?.required,
      usage: e?.usage
    }));
}




/**
 * 본딩 생성 시 모달에 넘길 값 생성 함수
 * @param {*} nic1 
 * @param {*} nic2 
 * @param {*} baseNetworkAttachments 
 * @param {*} movedNetworkAttachments 
 * @returns 
 */
export function getBondModalStateForCreate(
  nic1, nic2, 
  baseNetworkAttachments = [], movedNetworkAttachments = []
) {
  // NIC가 가지고 있는 네트워크 찾기 함수
  // 네트워크 연결을 위해 필요 (이름을 비교해서 출력)  
  const getNetworksFromNic = (nic) => {
    const arr = [...baseNetworkAttachments, ...movedNetworkAttachments].filter(
      na => na.hostNicVo?.name === nic.name
    );
    return Array.isArray(arr) ? arr : [];
  };

  return {
    id: "",
    name: "",
    optionVos: [{ name: "mode", value: 1 }], // 기본값
    editTarget: [
      { ...nic1, networks: getNetworksFromNic(nic1) },
      { ...nic2, networks: getNetworksFromNic(nic2) }
    ]
  };
}


/**
 * 본딩 편집 시 모달에 넘길 값 생성 함수
 * @param {*} bond 
 * @returns 
 */
export function getBondModalStateForEdit(bond) {
  return {
    id: bond.id,
    name: bond.name,
    optionVos: bond.bondingVo?.optionVos ?? [],
    editTarget: {
      ...bond,
      bondingVo: {
        ...bond.bondingVo,
        slaveVos: bond.bondingVo?.slaveVos ?? []
      }
    }
  };
}


/**
 * 할당된 네트워크 편집 시 상태 변환 함수
 * @param {*} networkAttachment 
 * @param {*} baseNetworkAttachments 
 * @param {*} movedNetworkAttachments 
 * @param {*} modifiedNAs 
 * @param {*} recentlyUnassignedNAs 
 * @returns 
 */
export function getNetworkAttachmentModalState(
  networkAttachment, 
  baseNetworkAttachments = [], 
  movedNetworkAttachments = [],
  modifiedNAs = [],
  tempUnassignedNAs = {}
) {
  // 1. 최신 편집값 우선
  let targetNA = modifiedNAs.find(na =>
    na.hostNicVo?.name === networkAttachment.hostNicVo?.name &&
    na.networkVo?.id === networkAttachment.networkVo?.id
  );

  // 2. id 매칭
  if (!targetNA && networkAttachment.id) {
    targetNA = [...baseNetworkAttachments].find(na => na.id === networkAttachment.id);
  }

  // 3. (hostNicVo.name + networkVo.id) 매칭
  if (!targetNA) {
    targetNA = [...movedNetworkAttachments].find(na =>
      na.hostNicVo?.name === networkAttachment.hostNicVo?.name &&
      na.networkVo?.id === networkAttachment.networkVo?.id
    );
  }

  // **4. tempUnassignedNAs 찾기**
  if (!targetNA) {
    // (1) 우선 networkVo.id+hostNicVo.name으로 매칭
    const foundCache = Object.values(tempUnassignedNAs).find(
      cache =>
        cache.networkVo?.id === networkAttachment.networkVo?.id
        // && cache.hostNicVo?.name === networkAttachment.hostNicVo?.name  // 주석: NIC가 바뀌었으니 name까지 비교하지 않는다!
    );
    if (foundCache) {
      targetNA = {
        ...foundCache,
        hostNicVo: networkAttachment.hostNicVo, // 새로운 NIC 정보로 덮어씀
        ipAddressAssignments: [...(foundCache.ipAddressAssignments || [])],
        dnsServers: [...(foundCache.dnsServers || foundCache.nameServerList || [])]
      };
    }
  }

  // 5. fallback: networkAttachment 자체(최소화)
  if (!targetNA) {
    targetNA = networkAttachment;
  }

  return {
    id: targetNA?.id,
    inSync: targetNA?.inSync ?? false,
    networkVo: targetNA?.networkVo ?? emptyIdNameVo(),
    hostNicVo: targetNA?.hostNicVo ?? emptyIdNameVo(),
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
