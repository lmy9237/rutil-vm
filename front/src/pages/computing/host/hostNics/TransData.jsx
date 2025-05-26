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
    .filter((nic) => !(hostNics || []).some((parent) =>
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
    const networkFromCluster = (networks || []).find(
      (net) => net.id === e?.networkVo?.id
    );
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
  const attachedIds = new Set(
    (networkAttachments || []).map((na) => na.networkVo?.id)
  );
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
