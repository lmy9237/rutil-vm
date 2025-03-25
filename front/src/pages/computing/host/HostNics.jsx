import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown, faTimes } from "@fortawesome/free-solid-svg-icons";
import HostNetworkModal from "../../../components/modal/host/HostNetworkModal";
import { useHost, useNetworkFromCluster, useNetworkInterfaceFromHost } from "../../../api/RQHook";
import { renderTFStatusIcon, renderUpDownStatusIcon } from "../../../components/Icon";
import { checkZeroSizeToMbps } from "../../../util";

const interfaces = [
  {
    name: "bond0",
    interfaces: ["ens161", "ens124"],
    network: "ovirtmgmt",
  },
  {
    name: "ens224",
    network: ["test1 (VLAN 12)", "test2 (VLAN 123)"],
  },
  {
    name: "ens257",
    network: [],
  },
];

const unassignedRequired = ["test1 (VLAN 12)", "test2 (VLAN 123)", "windows"];
const unassignedNotRequired = ["sfdujufoap0-saf"];

const HostNics = ({ hostId }) => {
  const { data: host } = useHost(hostId);
  
  const { data: hostNics = [] } = useNetworkInterfaceFromHost(hostId, (e) => ({ ...e }));
  const { data: networks = [] } = useNetworkFromCluster(host?.clusterVo?.id, (e) => ({ ...e }));  // 할당되지 않은 논리 네트워크 조회

  const transformedData = hostNics.map((e) => ({
    ...e,
    id: e?.id,
    name: e?.name,
    bondingVo: {
      // ...e?.bondingVo,
      activeSlave: {
        id: e?.bondingVo?.activeSlave?.id, 
        name: e?.bondingVo?.activeSlave?.name
      },
      slaves: e?.bondingVo?.slaves?.map((slave) => ({
        id: slave.id,
        name: slave.name,
      })),
    },
    bridged: e?.bridged,
    ipv4BootProtocol: e?.bootProtocol,
    ipv4Address: e?.ip?.address,
    ipv4Gateway: e?.ip?.gateway,
    ipv4Netmask: e?.ip?.netmask,
    ipv6BootProtocol: e?.ipv6BootProtocol,
    ipv6Address: e?.ipv6?.address,
    ipv6Gateway: e?.ipv6?.gateway,
    ipv6Netmask: e?.ipv6?.netmask,
    macAddress: e?.macAddress,
    mtu: e?.mtu,
    status: e?.status,
    network: {id: e?.networkVo?.id, name: e?.networkVo?.name},
    speed: checkZeroSizeToMbps(e?.speed),
    rxSpeed: checkZeroSizeToMbps(e?.rxSpeed),
    txSpeed: checkZeroSizeToMbps(e?.txSpeed),
    rxTotalSpeed: e?.rxTotalSpeed?.toLocaleString() || "0",
    txTotalSpeed: e?.txTotalSpeed?.toLocaleString() || "0",
    pkts: `${e?.rxTotalError} Pkts` || "1 Pkts",
  }));
  
  const transNetworkData = networks.map((e) => ({
    id: e?.id,
    name: e?.name,
    status: e?.status,
    vlan: e?.vlan,
    usageVm: e?.usage?.vm, 
  }));

  // NIC 데이터 변환
  // const transformedData = nics.map((e) => ({
  //   ...e,
  //   icon: renderUpDownStatusIcon(e?.status),
  //   ipv4: e?.ip?.address || "없음",
  //   ipv6: e?.ipv6?.address || "없음",
  //   macAddress: e?.macAddress || "정보없음",
  //   mtu: e?.mtu || "정보없음",
  //   speed: checkZeroSizeToMbps(e?.speed),
  //   rxSpeed: checkZeroSizeToMbps(e?.rxSpeed),
  //   txSpeed: checkZeroSizeToMbps(e?.txSpeed),
  //   rxTotalSpeed: e?.rxTotalSpeed?.toLocaleString() || "0",
  //   txTotalSpeed: e?.txTotalSpeed?.toLocaleString() || "0",
  //   pkts: `${e?.rxTotalError} Pkts` || "1 Pkts",
  //   status: e?.status,
  //   bondingVo: {
  //     ...e?.bondingVo,
  //     slaves: e?.bondingVo?.slaves?.map((slave) => ({
  //       id: slave.id,
  //       name: slave.name,
  //     })),
  //   },
  // }));

  useEffect(() => {
    console.log("NIC 데이터 확인:", transformedData);
  }, [transformedData]);

  return (
    <div className="p-4 grid grid-cols-2 gap-4">
      <div className="host-network-contents">
        <div className="col-span-1">
          <div className="p-4 space-y-4">
            <h2 className="text-lg font-semibold">인터페이스</h2>

            {transformedData.map((nic) => (
              <div key={nic.id} className="border rounded-xl p-3 space-y-2 bg-gray-50">
                <div className="font-medium">{nic.name}</div>
                {nic.bondingVo?.slaves?.map((s) => (
                  <div key={s.id} className="text-sm text-green-600">{renderTFStatusIcon(nic?.status==="OPERATIONAL")} {s.name}</div>
                ))}
                {nic.network?.name ? (
                  <div className="mt-2 border-t pt-2 flex items-center gap-2">
                    <div className="text-green-600 font-semibold">↔ {nic.network.name}</div>
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm">할당된 네트워크가 없음</div>
                )}
              </div>
            ))}

          </div>
        </div>

        <div className="col-span-1">
          <div className="p-4">
            <h2 className="text-lg font-semibold">할당된 논리 네트워크</h2>
              {transformedData.filter(n => n.network?.name).map((item) => (
                <div key={item.id} className="mt-2 border rounded-xl p-3 flex items-center gap-2">
                  <div className="text-green-600 font-semibold">↔ {item.network.name}</div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="host-network-contents">
        <div className="col-span-1">
          <div className="p-4">
            <h2 className="text-lg font-semibold">할당되지 않은 논리 네트워크</h2>

            <div className="bg-gray-100 p-2 text-xs rounded-md font-medium mb-2">필수</div>
              {transNetworkData.filter((n) => n.usageVm).map((net) => (
                <div key={net.id} className="border rounded-xl p-3 mt-3 flex items-center justify-between">
                  <div className="text-red-600">▼ {net.name}</div>
                </div>
              ))}

            <div className="bg-gray-100 p-2 text-xs rounded-md font-medium mt-4 mb-2">필요하지 않음</div>
              {transNetworkData.filter((n) => !n.usageVm).map((net) => (
                <div key={net.id} className="border rounded-xl p-3 mt-3 flex items-center justify-between">
                  <div className="text-red-600">▼ {net.name}</div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HostNics;