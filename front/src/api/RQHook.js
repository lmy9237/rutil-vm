import { useQuery, useQueries, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useApiToast }               from "@/hooks/useSimpleToast";
import useAuth                       from "@/hooks/useAuth";
import useUIState                    from "@/hooks/useUIState";
import useGlobal                     from "@/hooks/useGlobal";
import ApiManager                    from "@/api/ApiManager";
import { triggerDownload }           from "@/util";
import Localization                  from "@/utils/Localization";
import Logger                        from "@/utils/Logger";

export const DEFAULT_STALE_TIME = 1 * 60 * 1000; // 1 분
export const DEFAULT_CACHE_TIME = 5 * 60 * 1000; // 5분
export const DEFAULT_REFETCH_INTERVAL_IN_MILLI_SHORT = 10 * 1000; // 10초
export const DEFAULT_REFETCH_INTERVAL_IN_MILLI = 60 * 1000; // 30초
export const DEFAULT_REFETCH_INTERVAL_IN_MILLI_LONG = 1 * 60 * 1000; // 15초

//#region: 쿼리Key
const QK = {
  ALL_TREE_NAVIGATIONS: "allTreeNavigations",
  DASHBOARD: "dashboard",
  DASHBOARD_CPU_MEMORY: "dashboardCpuMemory",
  DASHBOARD_STORAGE: "dashboardStorage",
  DASHBOARD_HOSTS: "dashboardHosts",
  DASHBOARD_DOMAIN: "dashboardDomain",
  DASHBOARD_HOST: "dashboardHost",
  DASHBOARD_VM_CPU: "dashboardVmCpu",
  DASHBOARD_VM_MEMORY: "dashboardVmMemory",
  DASHBOARD_VM: "dashboardVm",
  DASHBOARD_STORAGE_MEMORY: "dashboardStorageMemory",
  DASHBOARD_PER_VM_CPU: "dashboardPerVmCpu",
  DASHBOARD_DATA_CENTER: "dashboardDataCenter",
  DASHBOARD_CLUSTER: "dashboardCluster",


  ALL_DATACENTERS: "allDataCenters",
  DATACENTER:'dataCenter',
  CLUSTERS_FROM_DATA_CENTER: "clustersFromDataCenter",
  HOSTS_FROM_DATA_CENTER: "hostsFromDataCenter",
  VMS_FROM_DATA_CENTER: "vmsFromDataCenter",
  DOMAINS_FROM_DATA_CENTER: "domainsFromDataCenter",
  ALL_ACTIVE_DOMAINS_FROM_DATA_CENTER: "AllActiveDomainsFromDataCenter",
  NETWORKS_FROM_DATA_CENTER: "networksFromDataCenter",
  TEMPLATES_FROM_DATA_CENTER: "templatesFromDataCenter",
  ALL_ATTACHED_DISKS_FROM_DATA_CENTER: "allAttachedDisksFromDataCenter",
  CD_FROM_DATA_CENTER: "CDFromDataCenter",
  ALL_ACTIVE_DATA_CENTERS: "allActiveDataCenters",

  ALL_CLUSTERS: "allClusters",
  CLUSTER: "cluster",
  NETWORK_FROM_CLUSTER: "networkFromCluster",
  HOSTS_FROM_CLUSTER: "hostsFromCluster",
  VMS_FROM_CLUSTER: "vmsFromCluster",
  PERMISSIONS_FROM_CLUSTER: "permissionsFromCluster",
  CPU_PROFILES_FROM_CLUSTER: "cpuProfilesFromCluster",
  OS_SYSTEMS_FROM_CLUSTER: "osSystemsFromCluster",
  ALL_VNIC_FROM_CLUSTER: "allVnicFromCluster",
  ALL_CLUSTER_LEVELS: "allClusterLevels",

  ALL_HOSTS: "allHosts",
  HOST: "host",
  VM_FROM_HOST: "vmFromHost",
  NETWORK_INTERFACES_FROM_HOST: "NetworkInterfacesFromHost", 
  NETWORK_INTERFACE_FROM_HOST: "NetworkInterfaceFromHost",
  NETWORK_ATTACHMENTS_FROM_HOST: "NetworkAttachmentsFromHost",
  HOST_DEVICES_FROM_HOST: "hostDevicesFromHost",
  STORAGES_FROM_HOST: "storagesFromHost",
  ISCSI_FROM_HOST: "iscsiFromHost",
  FIBRE_FROM_HOST: "fibreFromHost",
  SEARCH_FC_FROM_HOST: "searchFcFromHost",

  ALL_VMS: "allVms",
  VM: "vm",
  DISKS_FROM_VM: "disksFromVM",
  ALL_DISKS_FROM_VM: "allDisksFromVm",
  ALL_SNAPSHOTS_FROM_VM: "snapshotsFromVM",
  SNAPSHOT_DETAIL_FROM_VM: "snapshotDetailFromVM",
  HOST_DEVICES_FROM_VM: "hostDevicesFromVM",
  NETWORK_INTERFACES_FROM_VM: "networkInterfacesFromVM",
  NETWORK_INTERFACE_FROM_VM: "networkInterfaceFromVM",
  APPLICATION_FROM_VM: "ApplicationFromVM",
  VM_CONSOLE_ACCESS_INFO: "vmConsoleAccessInfo",
  ALL_MIGRATABLE_HOSTS_FROM_VM: "allMigratableHostsFromVm",
  ALL_MIGRATABLE_HOSTS_FOR_VMS: "allMigratableHosts4Vms",
  VM_SCREENSHOT: "vmScreenshot",
  CDROM_FROM_VM: "cdromFromVm",
  DISK_ATTACHMENT_FROM_VM: "diskAttachmentFromVm",

  ALL_TEMPLATES: "allTemplates",
  TEMPLATE: "template",
  ALL_VMS_FROM_TEMPLATE: "AllVmsFromTemplate",
  ALL_NICS_FROM_TEMPLATE: "allNicsFromTemplate",
  NIC_FROM_TEMPLATE: "nicFromTemplate",
  ALL_DISKS_FROM_TEMPLATE: "allDisksFromTemplate",
  ALL_STORAGES_FROM_TEMPLATE: "AllStoragesFromTemplate",

  ALL_NETWORKS: "allNetworks",
  NETWORK: "network",
  CLUSTERS_FROM_NETWORK: "clustersFromNetwork",
  CONNECTED_HOSTS_FROM_NETWORK: "connectedHostsFromNetwork",
  DISCONNECTED_HOSTS_FROM_NETWORK: "disconnectedHostsFromNetwork",
  VM_FROM_NETWORK: "vmFromNetwork",
  TEMPLATE_FROM_NETWORK: "templateFromNetwork",
  VNIC_PROFILES_FROM_NETWORK: "vnicProfilesFromNetwork",
  ALL_NETWORK_PROVIDERS: "allNetworkProviders",

  ALL_VNICPROFILES: "allVnicProfiles",
  VNIC_ID: "vnicId",
  ALL_VMS_FROM_VNIC_PROFILES: "AllVmsFromVnicProfiles",
  ALL_TEMPLATES_FROM_VNIC_PROFILES: "AllTemplatesFromVnicProfiles",
  ALL_NETWORK_FILTERS: "allNetworkFilters",

  ALL_DISKS:"allDisks",
  CDROMS_FOR_DISKS: "cdromsForDisks",
  DISK: "disk",
  ALL_VMS_FROM_DISK: "allVmsFromDisk",
  ALL_STORAGE_DOMAINS_FROM_DISK: "allStorageDomainsFromDisk",

  ALL_EVENTS: "allEvents",
  EVENTS_FROM_DATA_CENTER: "eventsFromDataCenter",
  EVENTS_FROM_CLUSTER: "eventsFromCluster",
  ALL_EVENTS_FROM_HOST: "eventsFromHost",
  EVENTS_FROM_VM: "allEventsFromVM",
  EVENTS_FROM_DOMAIN: "eventsFromDomain",
  EVENTS_FROM_TEMPLATE: "eventsFromTemplate",
  ALL_EVENTS_NORMAL: "allEventsNormal",
  ALL_NOTI_EVENTS: "allNotiEvents",

  ALL_JOBS: "allJobs",
  JOB: "job",

  ALL_PROVIDERS: "allProviders",
  PROVIDER: "provider",

  ALL_USERS: "allUsers",
  USER: "user",
  ALL_USER_SESSIONS:"allUserSessions",

  ALL_CERTS :"allCerts",
  CERT : "cert",
  
  ALL_STORAGEDOMAINS:"allStorageDomains",
  ALL_VALID_DOMAINS: "AllValidDomains",
  ALL_NFS_STORAGE_DOMAINS: "allNfsStorageDomains",
  DOMAIN_BY_ID: "DomainById",
  ALL_DATA_CENTERS_FROM_DOMAIN: "allDataCentersFromDomain",
  ALL_HOSTS_FROM_DOMAIN: "allHostsFromDomain",
  ALL_VMS_FROM_DOMAIN: "allVMsFromDomain",
  ALL_UNREGISTER_VM_FROM_DOMAIN: "AllUnregisterVMFromDomain",
  ALL_DISKS_FROM_DOMAIN: "allDisksFromDomain",
  ALL_TEMPLATES_FROM_DOMAIN: "allTemplatesFromDomain",
  ALL_UNREGISTERED_DISKS_FROM_DOMAIN: "allUnregisteredDisksFromDomain",
  ALL_UNREGISTERED_TEMPLATES_FROM_DOMAIN: "allUnregisteredTemplatesFromDomain",
  ALL_DISK_PROFILES_FROM_DOMAIN: "allDiskProfilesFromDomain",
  ALL_DISK_SNAPSHOT_FROM_DOMAIN: "AllDiskSnapshotFromDomain",


  DASHBOARD_METRIC_VM_CPU: "dashboardMetricVmCpu",
  DASHBOARD_METRIC_VM_MEMORY: "dashboardMetricVmMemory",
  DASHBOARD_METRIC_STORAGE: "dashboardMetricStorage",

  ALL_BIOS_TYPES: "allBiosTypes",
  ALL_DISK_CONTENT_TYPES: "allDiskContentTypes",
  ALL_MIGRATION_SUPPORTS: "allMigrationSupports",
  ALL_QUOTA_ENFORCEMENT_TYPES: "allQuotaEnforcementTypes",
  ALL_VM_TYPES: "allVmTypes", 
}

export const QP_DEFAULT = {
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  refetchInactive: true,
  staleTime: DEFAULT_STALE_TIME,
  cacheTime: DEFAULT_CACHE_TIME,
}
export const QP_DEFAULT_MOD = {
  refetchInterval: DEFAULT_CACHE_TIME,
  refetchInactive: true,
  staleTime: DEFAULT_STALE_TIME,
  cacheTime: DEFAULT_CACHE_TIME,
}
//#endregion: 쿼리Key

//#region: Navigation
const qpAllTreeNavigations = (
  type,
  mapPredicate = (e) => ({ ...e }),
) => ({
  ...QP_DEFAULT,
  queryKey: [QK.ALL_TREE_NAVIGATIONS, { type: type }],  // queryKey에 type을 포함시켜 type이 변경되면 데이터를 다시 가져옴
  queryFn: async () => {
    const res = await ApiManager.findAllTreeNaviations(type);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? []
      : validateAPI(res) ?? []
    Logger.debug(`RQHook > qpAllTreeNavigations ... type: ${type}, res: `, _res);
    return _res;
  },
})
/**
 * @name useAllTreeNavigations
 * @description 트리네비게이션 API
 * 
 * @param {string} type 
 * @param {function} mapPredicate 변형 조건
 * 
 * @returns 
 * @see ApiManager.findAllTreeNaviations
 */
export const useAllTreeNavigations = (
  type = "none",
  mapPredicate = (e) => ({ ...e }),
) => useQuery({
  ...qpAllTreeNavigations(type, mapPredicate),
});
//#endregion

//#region: Dashboard
export const useDashboard = (

) => useQuery({
  ...QP_DEFAULT,
  queryKey: [QK.DASHBOARD],
  queryFn: async () => {
    const res = await ApiManager.getDashboard()
    const _res = validateAPI(res) ?? {}
    Logger.debug(`RQHook > useDashboard ... res: `, _res);
    return _res
  },
});

export const useDashboardCpuMemory = (

) => useQuery({
  ...QP_DEFAULT,
  queryKey: [QK.DASHBOARD_CPU_MEMORY],
  queryFn: async () => {
    const res = await ApiManager.getCpuMemory()
    const _res = validateAPI(res) ?? {}
    Logger.debug(`RQHook > useDashboardCpuMemory ... res: `, _res);
    return _res
  },
});

export const useDashboardStorage = (

) => useQuery({
  ...QP_DEFAULT,
  queryKey: [QK.DASHBOARD_STORAGE],
  queryFn: async () => {
    const res = await ApiManager.getStorage()
    const _res = validateAPI(res) ?? {}
    Logger.debug(`RQHook > useDashboardStorage ... res: `, _res);
    return _res;
  },
});

export const useDashboardHosts = (

) => useQuery({
  ...QP_DEFAULT,
  queryKey: [QK.DASHBOARD_HOSTS],
  queryFn: async () => {
    const res = await ApiManager.getHosts()
    const _res = validateAPI(res) ?? {}
    Logger.debug(`RQHook > useDashboardHosts ... res: `, _res);
    return _res
  },
});

/**
 * 호스트 실시간 사용량 1분단위로 90만
 * @returns 
 */
export const useDashboardHostList = (
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI_SHORT, staleTime: DEFAULT_STALE_TIME, cacheTime: DEFAULT_CACHE_TIME,
  queryKey: ["allGrpahHosts"],
  queryFn: async () => {
    const res = await ApiManager.getHostList()
    const _res = validateAPI(res) ?? {}
    Logger.debug(`RQHook > useDashboardHostList ... res: `, _res);
    return _res
  },
});

export const useDashboardDomain = (
  mapPredicate = (e) => ({ ...e }),
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI_SHORT, staleTime: DEFAULT_STALE_TIME, cacheTime: DEFAULT_CACHE_TIME,
  queryKey: [QK.DASHBOARD_DOMAIN],
  queryFn: async () => {
    const res = await ApiManager.getDomain()
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? []
      : validateAPI(res) ?? []
    Logger.debug(`RQHook > useDashboardDomain ... res: `, _res);
    return _res
  },
});

export const useDashboardHost = (
  hostId,
  mapPredicate = (e) => ({ ...e }),
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI_SHORT, staleTime: DEFAULT_STALE_TIME, cacheTime: DEFAULT_CACHE_TIME,
  queryKey: [QK.DASHBOARD_HOST],
  queryFn: async () => {
    const res = await ApiManager.getHost(hostId)
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? []
      : validateAPI(res) ?? []
    Logger.debug(`RQHook > useDashboardHost ... hostId: ${hostId}, res: `, _res);
    return _res;
    // return validateAPI(res)?.map((e) => mapPredicate(e)) ?? []
  },
});

export const useDashboardVmCpu = (
  mapPredicate = (e) => ({ ...e }),
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI_SHORT, staleTime: DEFAULT_STALE_TIME, cacheTime: DEFAULT_CACHE_TIME,
  queryKey: [QK.DASHBOARD_VM_CPU],
  queryFn: async () => {
    const res = await ApiManager.getVmCpu();
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? []
      : validateAPI(res) ?? []
    Logger.debug(`RQHook > useDashboardVmCpu ... res: `, _res);
    return _res;
    // return validateAPI(res)?.map((e) => mapPredicate(e)) ?? []
  },
});

export const useDashboardVmMemory = (
  mapPredicate = (e) => ({ ...e }),
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI_SHORT, staleTime: DEFAULT_STALE_TIME, cacheTime: DEFAULT_CACHE_TIME,
  queryKey: [QK.DASHBOARD_VM_MEMORY],
  queryFn: async () => {
    const res = await ApiManager.getVmMemory()
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? []
      : validateAPI(res) ?? []
    Logger.debug(`RQHook > useDashboardVmMemory ... res: `, _res);
    return _res;
  },
});

export const useDashboardVm = (
  vmId,
  mapPredicate = (e) => ({ ...e }),
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI_SHORT, staleTime: DEFAULT_STALE_TIME, cacheTime: DEFAULT_CACHE_TIME,
  queryKey: [QK.DASHBOARD_VM],
  queryFn: async () => {
    const res = await ApiManager.getVm(vmId)
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? []
      : validateAPI(res) ?? []
    Logger.debug(`RQHook > useDashboardVm ... vmId: ${vmId}, res: `, _res);
    return _res;
  },
});


export const useDashboardStorageMemory = (
  mapPredicate = (e) => ({ ...e }),
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI_SHORT, staleTime: DEFAULT_STALE_TIME, cacheTime: DEFAULT_CACHE_TIME,
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.DASHBOARD_STORAGE_MEMORY],
  queryFn: async () => {
    const res = await ApiManager.getStorageMemory()
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? []
      : validateAPI(res) ?? []
    Logger.debug(`RQHook > useDashboardStorageMemory ... res: `, _res);
    return _res
  },
});

export const useDashboardPerVmCpu = (
  mapPredicate = (e) => ({ ...e }),
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.DASHBOARD_PER_VM_CPU],
  queryFn: async () => {
    const res = await ApiManager.getPerVmCpu()
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? []
      : validateAPI(res) ?? []
    Logger.debug(`RQHook > dashboardPerVmCpu ... res: `, _res);
    return _res
  },
});

export const useDashboardPerVmMemory = (
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: ['dashboardPerVmMemory'],
  queryFn: async () => {
    const res = await ApiManager.getPerVmMemory()
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? []
      : validateAPI(res) ?? []
    Logger.debug(`RQHook > dashboardPerVmMemory ... res: `, _res);
    return _res
    // return validateAPI(res)?.map((e) => mapPredicate(e)) ?? []
  }
});
// export const useDashboardPerVmNetwork = (
//   mapPredicate = (e) => ({ ...e })
// ) => useQuery({
//   refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
//   queryKey: ['dashboardPerVmNetwork'],
//   queryFn: async () => {
//     Logger.debug(`dashboardPerVmNetwork ...`);
//     const res = await ApiManager.getPerVmNetwork()
//     const _res = mapPredicate
//       ? validateAPI(res)?.map(mapPredicate) ?? []
//       : validateAPI(res) ?? []
//     Logger.debug(`RQHook > dashboardPerVmNetwork ... res: `, _res);
//     return _res
//     // return validateAPI(res)?.map((e) => mapPredicate(e)) ?? []
//   }
// });

export const useDashboardMetricVmCpu = (
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.DASHBOARD_METRIC_VM_CPU],
  queryFn: async () => {
    Logger.debug(`useDashboardMetricVmCpu ...`);
    const res = await ApiManager.getMetricVmCpu()
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? []
      : validateAPI(res) ?? []
    Logger.debug(`RQHook > useDashboardMetricVmCpu ... res: `, _res);
    return _res
  }
});
export const useDashboardMetricVmMemory = (
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.DASHBOARD_METRIC_VM_MEMORY],
  queryFn: async () => {
    const res = await ApiManager.getMetricVmMemory()
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? []
      : validateAPI(res) ?? []
    Logger.debug(`RQHook > useDashboardMetricVmMemory ... res: `, _res);
    return _res
  }
});
export const useDashboardMetricStorage = (
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.DASHBOARD_METRIC_STORAGE],
  queryFn: async () => {
    const res = await ApiManager.getMetricStorage()
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? []
      : validateAPI(res) ?? []
    Logger.debug(`RQHook > useDashboardMetricStorage ... res: `, _res);
    return _res
  }
});


export const useUsageDataCenter = (
  dataCenterId,
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI_SHORT, staleTime: DEFAULT_STALE_TIME, cacheTime: DEFAULT_CACHE_TIME,
  queryKey: [QK.DASHBOARD_DATA_CENTER, dataCenterId],
  queryFn: async () => {
    const res = await ApiManager.getDataCenter(dataCenterId)
    const _res = validateAPI(res) ?? {};  // 데이터를 반환, 없는 경우 빈 객체 반환
    Logger.debug(`RQHook > useDashboardDataCenter ... dataCenterId: ${dataCenterId}, res: `, _res);
    return _res;
    // return validateAPI(res)?.map((e) => mapPredicate(e)) ?? []
  },
});

export const useUsageCluster = (
  clusterId,
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI_SHORT, staleTime: DEFAULT_STALE_TIME, cacheTime: DEFAULT_CACHE_TIME,
  queryKey: [QK.DASHBOARD_CLUSTER, clusterId],
  queryFn: async () => {
    const res = await ApiManager.getCluster(clusterId)
    const _res = validateAPI(res) ?? {};  // 데이터를 반환, 없는 경우 빈 객체 반환
    Logger.debug(`RQHook > useDashboardCluster ... clusterId: ${clusterId}, res: `, _res);
    return _res;
    // return validateAPI(res)?.map((e) => mapPredicate(e)) ?? []
  },
});

//#endregion


//#region: DataCenter (데이터센터)
/**
 * @name useAllDataCenters
 * @description 데이터센터 목록조회 useQuery훅
 *
 * @param {function} mapPredicate 객체 변형 처리
 * 
 * @see ApiManager.findAllDataCenters
 */
export const useAllDataCenters = (
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI_SHORT, staleTime: DEFAULT_STALE_TIME, cacheTime: DEFAULT_CACHE_TIME,
  queryKey: [QK.ALL_DATACENTERS],
  queryFn: async () => {
    const res = await ApiManager.findAllDataCenters();
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? []
      : validateAPI(res) ?? []
    Logger.debug(`RQHook > useAllDataCenters ... res: `, _res);
    return _res;
  }
});
/**
 * @name useAllDataCentersWithHosts
 * @description 데이터센터 목록조회 useQuery훅
 *
 * @param {function} mapPredicate 객체 변형 처리
 * 
 * @see ApiManager.findAllDataCenters
 */
export const useAllDataCentersWithHosts = (
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI_SHORT, staleTime: DEFAULT_STALE_TIME, cacheTime: DEFAULT_CACHE_TIME,
  queryKey: [QK.ALL_DATACENTERS],
  queryFn: async () => {
    const res = await ApiManager.findAllDataCentersWithHosts();
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? []
      : validateAPI(res) ?? []
    Logger.debug(`RQHook > useAllDataCentersWithHosts ... res: `, _res);
    return _res;
  }
});
/**
 * @name useDataCenter
 * @description 데이터센터 정보 useQuery훅
 *
 * @param {function} mapPredicate 객체 변형 처리
 * @see ApiManager.findDataCenter
 */
export const useDataCenter = (
  dataCenterId,
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI_SHORT, staleTime: DEFAULT_STALE_TIME, cacheTime: DEFAULT_CACHE_TIME,
  queryKey: [QK.DATACENTER, dataCenterId],  // queryKey에 dataCenterId를 포함시켜 dataCenterId가 변경되면 다시 요청
  queryFn: async () => {
    const res = await ApiManager.findDataCenter(dataCenterId);  // dataCenterId에 따라 API 호출
    const _res = validateAPI(res) ?? {};  // 데이터를 반환, 없는 경우 빈 객체 반환
    Logger.debug(`RQHook > useDataCenter ... dataCenterId: ${dataCenterId}, res: `, _res);
    return _res;
  },
  enabled: !!dataCenterId,
});

/**
 * @name useClustersFromDataCenter
 * @description 데이터센터 내 클러스터 목록조회 useQuery훅
 * 
 * @param {string} dataCenterId 데이터센터ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllClustersFromDataCenter
 */
export const useClustersFromDataCenter = (
  dataCenterId,
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI_SHORT, staleTime: DEFAULT_STALE_TIME, cacheTime: DEFAULT_CACHE_TIME,
  queryKey: [QK.CLUSTERS_FROM_DATA_CENTER, dataCenterId],
  queryFn: async () => {
    const res = await ApiManager.findAllClustersFromDataCenter(dataCenterId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공 
      : validateAPI(res) ?? []
    Logger.debug(`RQHook > clustersFromDataCenter ... dataCenterId: ${dataCenterId}, res: `, _res);
    return _res
  },
  enabled: !!dataCenterId, // dataCenterId가 있을 때만 쿼리를 실행
});

/**
 * @name useHostsFromDataCenter
 * @description 데이터센터 내 호스트 목록조회 useQuery훅
 * 
 * @param {string} dataCenterId 데이터센터ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllHostsFromDataCenter
 */
export const useHostsFromDataCenter = (
  dataCenterId,
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI_SHORT, staleTime: DEFAULT_STALE_TIME, cacheTime: DEFAULT_CACHE_TIME,
  queryKey: [QK.HOSTS_FROM_DATA_CENTER, dataCenterId],
  queryFn: async () => {
    const res = await ApiManager.findAllHostsFromDataCenter(dataCenterId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useHostsFromDataCenter ... dataCenterId: ${dataCenterId}, res: `, _res);
    return _res
  },
  enabled: !!dataCenterId,
});
/**
 * @name useVMsFromDataCenter
 * @description 데이터센터 내 가상머신 목록조회 useQuery훅
 * 
 * @param {string} dataCenterId 데이터센터ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllVmsFromDataCenter
 */
export const useVMsFromDataCenter = (
  dataCenterId,
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI_SHORT,
  queryKey: [QK.VMS_FROM_DATA_CENTER, dataCenterId],
  queryFn: async () => {
    const res = await ApiManager.findAllVmsFromDataCenter(dataCenterId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? []; // 데이터 가공
    Logger.debug(`RQHook > useVMsFromDataCenter ... dataCenterId: ${dataCenterId}, res: `, _res);
    return _res;
  },
  enabled: !!dataCenterId, // dataCenterId가 있을 때만 쿼리 실행
  staleTime: 0,
  cacheTime: 0,
});
/**
 * @name qpAllDomainsFromDataCenter
 * @description useQuery용 데이터센터 내 스토리지 도메인 목록조회 쿼리 파라미터
 * 
 * @param {string} dataCenterId 데이터센터ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery용 쿼리 파라미터
 * 
 * @see ApiManager.findAllDomainsFromDataCenter
 */
const qpAllDomainsFromDataCenter = (
  dataCenterId,
  mapPredicate = (e) => ({ ...e })
) => ({
  // refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.DOMAINS_FROM_DATA_CENTER, dataCenterId],
  queryFn: async () => {
    const res = await ApiManager.findAllDomainsFromDataCenter(dataCenterId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > qpAllDomainsFromDataCenter ... dataCenterId: ${dataCenterId}, res: `, _res);
    return _res;
  },
  enabled: !!dataCenterId, // dataCenterId가 있을 때만 쿼리 실행
  // suspense: true,
})
/**
 * @name useAllDomainsFromDataCenter
 * @description 데이터센터 내 스토리지 도메인 목록조회 useQuery훅
 * 
 * @param {string} dataCenterId 데이터센터ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllDomainsFromDataCenter
 */
export const useAllDomainsFromDataCenter = (
  dataCenterId,
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  ...qpAllDomainsFromDataCenter(dataCenterId, mapPredicate)
});


/**
 * @name useAllActiveDomainsFromDataCenter
 * @description active 도메인 목록조회 useQuery훅
 * 
 * @param {string} dataCenterId 도메인ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findActiveDomainFromDataCenter
 */
export const qpAllActiveDomainsFromDataCenter = (
  dataCenterId,
  mapPredicate = (e) => ({ ...e })
) => ({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.ALL_ACTIVE_DOMAINS_FROM_DATA_CENTER, dataCenterId],
  queryFn: async () => {
    const res = await ApiManager.findActiveDomainFromDataCenter(dataCenterId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > qpAllActiveDomainsFromDataCenter ... dataCenterId: ${dataCenterId}, res: `, _res);
    return _res;
  },
  enabled: !!dataCenterId,
});

/**
 * @name useAllActiveDomainsFromDataCenter
 * @description 데이터센터 내 스토리지 도메인 목록조회 useQuery훅
 * 
 * @param {string} dataCenterId 데이터센터ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllDomainsFromDataCenter
 */
export const useAllActiveDomainsFromDataCenter = (
  dataCenterId,
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  ...qpAllActiveDomainsFromDataCenter(dataCenterId, mapPredicate)
});
/**
 * @name useAllActiveDomainsFromDataCenter4EachDisk
 * @description (디스크가 소속 된) 데이터센터 내 스토리지 도메인 목록조회 useQueries훅
 * 
 * @param {*} disks 디스크 목록
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQueries훅
 * 
 * @see ApiManager.findAllDomainsFromDataCenter
 */
export const useAllActiveDomainsFromDataCenter4EachDisk = (
  disks=[],
  mapPredicate = (e) => ({ ...e })
) => useQueries({
  queries: [...disks]?.map((d, i) => {
    Logger.debug(`RQHook > useAllActiveDomainsFromDataCenter4EachDisk ... d: `, d);
    return {
      ...qpAllActiveDomainsFromDataCenter(d?.dataCenterVo?.id, mapPredicate),
    }
  })
});


/**
 * @name qpAllNetworksFromDataCenter
 * @description 데이터센터 내 네트워크 목록조회 useQuery훅
 * 
 * @param {string} dataCenterId 데이터센터ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllNetworksFromDataCenter
 */
export const qpAllNetworksFromDataCenter = (
  dataCenterId,
  mapPredicate = (e) => ({ ...e })
) => ({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.NETWORKS_FROM_DATA_CENTER, dataCenterId],
  queryFn: async () => {
    const res = await ApiManager.findAllNetworksFromDataCenter(dataCenterId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > qpAllNetworksFromDataCenter ... dataCenterId: ${dataCenterId}, res: `, _res);
    return _res;
  },
  enabled: !!dataCenterId
});

export const useAllNetworksFromDataCenter = (
  datacenterId,
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  ...qpAllNetworksFromDataCenter(datacenterId, mapPredicate)
});

export const useAllNetworksFromDataCenter4EachDataCenter = (
  datacenters=[], 
  mapPredicate = (e) => ({ ...e })
) => useQueries({
  queries: [...datacenters].map((d) => ({
    ...qpAllNetworksFromDataCenter(d?.id, mapPredicate)
  }))
});


/**
 * @name useFindTemplatesFromDataCenter
 * @description 가상머신 연결할 수 있는 템플릿 useQuery훅
 * 
 * @param {string} dataCenterId 데이터센터ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findTemplatesFromDataCenter
 */
export const useFindTemplatesFromDataCenter = (
  dataCenterId,
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.TEMPLATES_FROM_DATA_CENTER, dataCenterId],
  queryFn: async () => {
    const res = await ApiManager.findTemplatesFromDataCenter(dataCenterId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useFindTemplatesFromDataCenter ... dataCenterId: ${dataCenterId}, res: `, _res);
    return _res;
  },
  enabled: !!dataCenterId,
});
/**
 * @name useAllAttachedDisksFromDataCenter
 * @description 가상머신 연결할 수 있는 디스크 useQuery훅
 * 
 * @param {string} dataCenterId 데이터센터ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findDiskListFromDataCenter
 */
export const useAllAttachedDisksFromDataCenter = (
  dataCenterId,
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.ALL_ATTACHED_DISKS_FROM_DATA_CENTER, dataCenterId],
  queryFn: async () => {
    const res = await ApiManager.findAllAttachedDisksFromDataCenter(dataCenterId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllAttachedDisksFromDataCenter ... dataCenterId: ${dataCenterId}, res: `, _res);
    return _res;
  },
  enabled: !!dataCenterId,
});

/**
 * @name useCdromFromDataCenter
 * @description 가상머신 생성창 - CD/DVD 연결할 ISO 목록 useQuery훅
 * 
 * @param {string} dataCenterId 데이터센터ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllISOFromDataCenter
 */
export const useCdromFromDataCenter = (
  dataCenterId,
  mapPredicate = (e) => ({ ...e }),
  allowedToFetch, setAllowToFetch
) => useQuery({
  ...QP_DEFAULT,
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI_LONG,
  queryKey: [QK.CD_FROM_DATA_CENTER, dataCenterId],
  queryFn: async () => {
    const res = await ApiManager.findAllISOFromDataCenter(dataCenterId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useCdromFromDataCenter ... dataCenterId: ${dataCenterId}, res: `, _res);
    await setAllowToFetch(false);
    return _res
  },
  enabled: !!dataCenterId && allowedToFetch,
});
/**
 * @name useAddDataCenter
 * @description 데이터센터 생성 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 * @see ApiManager.addDataCenter
 */
export const useAddDataCenter = (
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
  return useMutation({
    mutationFn: async (dataCenterData) => {
      closeModal()
      const res = await ApiManager.addDataCenter(dataCenterData)
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useAddDataCenter ... dataCenterData: ${JSON.stringify(dataCenterData, null, 2)}`)
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useAddDataCenter ... res: `, res);
      apiToast.ok(`${Localization.kr.DATA_CENTER} ${Localization.kr.CREATE} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_DATACENTERS]);
      postSuccess()
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_DATACENTERS]);
      postError && postError(error);
    },
  });
};
/**
 * @name useEditDataCenter
 * @description 데이터센터 수정 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 * @see ApiManager.editDataCenter
 */
export const useEditDataCenter = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
  return useMutation({
    mutationFn: async ({ dataCenterId, dataCenterData }) => {
      closeModal();
      const res = await ApiManager.editDataCenter(dataCenterId, dataCenterData);
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useEditDataCenter ... dataCenterId: ${dataCenterId}, dataCenterData: ${JSON.stringify(dataCenterData, null, 2)}`)
      return _res;
    },
    onSuccess: (res, { dataCenterId }) => {
      Logger.debug(`RQHook > useEditDataCenter ... res: `, res)
      apiToast.ok(`${Localization.kr.DATA_CENTER} ${Localization.kr.UPDATE} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_DATACENTERS]);
      queryClient.invalidateQueries(QK.DATACENTER, dataCenterId);
      postSuccess(res);
    },
    onError: (error, { dataCenterId }) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_DATACENTERS]);
      queryClient.invalidateQueries(QK.DATACENTER, dataCenterId);
      postError && postError(error);
    },
  });
};
/**
 * @name useDeleteDataCenter
 * @description 데이터센터 삭제 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 * @see ApiManager.deleteDataCenter
 */
export const useDeleteDataCenter = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
  const navigate = useNavigate();
    return useMutation({
    mutationFn: async (dataCenterId) => {
      closeModal();
      const res = await ApiManager.deleteDataCenter(dataCenterId);
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useDeleteDataCenter ... dataCenterId: ${dataCenterId}`)
      return _res;
    },
    onSuccess: (res, { dataCenterId }) => {
      Logger.debug(`RQHook > useDeleteDataCenter ... res: `, res)
      apiToast.ok(`${Localization.kr.DATA_CENTER} ${Localization.kr.REMOVE} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_DATACENTERS]);
      queryClient.removeQueries(QK.DATACENTER, dataCenterId);
      navigate(`/computing/rutil-manager/datacenters`)
      postSuccess()
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_DATACENTERS]);
      postError && postError(error);
    },
  });
};

//#endregion: DataCenter


//#region: Cluster (클러스터)
/**
 * @name useAllClusters
 * @description 클러스터 목록조회 useQuery훅
 * 
 * @param {function} mapPredicate 객체 변형 처리
 * @see ApiManager.findAllClusters
 */
export const useAllClusters = (
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.ALL_CLUSTERS],
  queryFn: async () => {
    const res = await ApiManager.findAllClusters()
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllClusters ... res: `, _res);
    return _res;
  }
})
/**
 * @name useAllUpClusters
 * @description 클러스터 (dc status=up) 목록조회 useQuery훅
 * 
 * @param {function} mapPredicate 객체 변형 처리
 * @see ApiManager.findAllUpClusters
 */
export const useAllUpClusters = (
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.ALL_CLUSTERS],
  queryFn: async () => {
    const res = await ApiManager.findAllUpClusters()
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllUpClusters ... res: `, _res);
    return _res
  }
})
/**
 * @name useCluster
 * @description 클러스터 상세조회 useQuery 훅
 * 
 * @param {string} clusterId 클러스터 ID
 * @returns useQuery 훅
 * 
 * @see ApiManager.findCluster
 */
export const useCluster = (
  clusterId
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,  // 윈도우 포커스 시 데이터 리프레시
  queryKey: [QK.CLUSTER, clusterId],  // queryKey에 clusterId를 포함시켜 clusterId가 변경되면 다시 요청
  queryFn: async () => {
    const res = await ApiManager.findCluster(clusterId);
    const _res = validateAPI(res) ?? {};
    Logger.debug(`RQHook > useCluster ... clusterId: ${clusterId}, res: `, _res);
    return _res
  },
  enabled: !!clusterId,
  staleTime: 0,  // 항상 최신 데이터를 유지
  cacheTime: 0,  // 캐시를 유지하지 않고 매번 새로운 데이터를 요청
});
/**
 * @name useNetworkFromCluster
 * @description 클러스터 내 논리네트워크 목록조회 useQuery훅
 * 
 * @param {string} clusterId 클러스터ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findNetworksFromCluster
 */
export const useNetworkFromCluster = (
  clusterId,
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.NETWORK_FROM_CLUSTER, clusterId],
  queryFn: async () => {
    const res = await ApiManager.findNetworksFromCluster(clusterId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useNetworkFromCluster ... clusterId: ${clusterId}, res: `, _res);
    return _res
  },
  enabled: !!clusterId,
})
/**
 * @name useHostsFromCluster
 * @description 클러스터 내 호스트 목록조회 useQuery훅
 * 
 * @param {string} clusterId 클러스터ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findHostsFromCluster
 */
export const useHostsFromCluster = (
  clusterId,
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.HOSTS_FROM_CLUSTER, clusterId],
  queryFn: async () => {
    const res = await ApiManager.findHostsFromCluster(clusterId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useHostsFromCluster ... clusterId: ${clusterId}, res: `, _res);
    return _res;
  },
  enabled: !!clusterId,
  staleTime: 0,
  cacheTime: 0,
})
/**
 * @name useVMsFromCluster
 * @description 클러스터 내 가상머신 목록조회 useQuery훅
 * 
 * @param {string} clusterId 클러스터ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findVMsFromCluster
 */
export const useVMsFromCluster = (
  clusterId,
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.VMS_FROM_CLUSTER, clusterId],
  queryFn: async () => {
    Logger.debug(`useVMsFromCluster ... ${clusterId}`);
    const res = await ApiManager.findVMsFromCluster(clusterId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useVMsFromCluster ... clusterId: ${clusterId}, res: `, _res);
    return _res;
  },
  enabled: !!clusterId,
})
/**
 * @name usePermissionsFromCluster
 * @description 클러스터 내 권한 목록조회 useQuery훅
 * 
 * @param {string} clusterId 클러스터ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findPermissionsFromCluster
 */
export const usePermissionsFromCluster = (
  clusterId,
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.PERMISSIONS_FROM_CLUSTER, clusterId],
  queryFn: async () => {
    const res = await ApiManager.findPermissionsFromCluster(clusterId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > usePermissionsFromCluster ... clusterId: ${clusterId}, res: `, _res);
    return _res
  },
  enabled: !!clusterId,
})

/**
 * @name useCpuProfilesFromCluster
 * @description 클러스터 내 cpuprofile 목록조회 useQuery훅
 * 
 * @param {string} clusterId 클러스터ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findCpuProfilesFromCluster
 */
export const useCpuProfilesFromCluster = (
  clusterId,
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.CPU_PROFILES_FROM_CLUSTER, clusterId],
  queryFn: async () => {
    const res = await ApiManager.findCpuProfilesFromCluster(clusterId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useCpuProfilesFromCluster ... ${clusterId}, res: `, _res);
    return _res
  },
  enabled: !!clusterId,
  staleTime: 0,
  cacheTime: 0,
})

/**
 * @name useAllOpearatingSystemsFromCluster
 * @description 클러스터 내 운영시스템 목록조회 useQuery훅
 * 
 * @param {string} clusterId 클러스터ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllOperatingSystemsFromCluster
 */
export const useAllOpearatingSystemsFromCluster = (
  clusterId,
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.OS_SYSTEMS_FROM_CLUSTER, clusterId],
  queryFn: async () => {
    const res = await ApiManager.findAllOperatingSystemsFromCluster(clusterId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllOpearatingSystemsFromCluster ... ${clusterId}, res: `, _res);
    return _res
  },
  enabled: !!clusterId,
  staleTime: 0,
  cacheTime: 0,
})

/**
 * @name useAllVnicsFromCluster
 * @description  가상머신 생성창-nic목록 목록조회 useQuery훅
 * 
 * @param {string} dataCenterId 데이터센터 id
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findVNicFromCluster
 */
export const useAllVnicsFromCluster = (
  clusterId,
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.ALL_VNIC_FROM_CLUSTER, clusterId],
  queryFn: async () => {
    const res = await ApiManager.findVNicFromCluster(clusterId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllVnicsFromCluster ... clusterId: ${clusterId}, res: `, _res);
    return _res
  },
  enabled: !!clusterId,
  staleTime: 0,
  cacheTime: 0,
})

/**
 * @name useAddCluster
 * @description 클러스터 생성 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 * @see ApiManager.addCluster
 */
export const useAddCluster = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async (clusterData) => {
      closeModal();
      const res = await ApiManager.addCluster(clusterData);
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useAddCluster ... clusterData: ${clusterData}`)
      return _res
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useAddCluster ... res: `, res);
      apiToast.ok(`${Localization.kr.CLUSTER} ${Localization.kr.CREATE} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_CLUSTERS, QK.CLUSTERS_FROM_DATA_CENTER]);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_CLUSTERS, QK.CLUSTERS_FROM_DATA_CENTER]);
      postError && postError(error);
    },
  });
};
/**
 * @name useEditCluster
 * @description 클러스터 수정 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 * @see ApiManager.editCluster
 */
export const useEditCluster = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async ({ clusterId, clusterData }) => {
      closeModal();
      const res = await ApiManager.editCluster(clusterId, clusterData);
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useEditCluster ... clusterId: ${clusterId}, clusterData: `, clusterData)
      return _res;
    },
    onSuccess: (res, { clusterId }) => {
      Logger.debug(`RQHook > useEditCluster ... res: `, res);
      apiToast.ok(`${Localization.kr.CLUSTER} ${Localization.kr.UPDATE} ${Localization.kr.REQ_COMPLETE}`);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_CLUSTERS,QK.CLUSTERS_FROM_DATA_CENTER]);
      queryClient.invalidateQueries(QK.ALL_CLUSTERS, clusterId);
      postSuccess(res);
    },
    onError: (error, { clusterId }) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_CLUSTERS,QK.CLUSTERS_FROM_DATA_CENTER]);
      queryClient.invalidateQueries(QK.ALL_CLUSTERS, clusterId);
      postError && postError(error);
    },
  });
};
/**
 * @name useDeleteCluster
 * @description 클러스터 삭제 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 * @see ApiManager.deleteCluster
 */
export const useDeleteCluster = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient()
  const { datacentersSelected, setClustersSelected } = useGlobal()
  const { closeModal, clearTabInPage } = useUIState();
  const { apiToast } = useApiToast();
  const navigate = useNavigate();
    return useMutation({
    mutationFn: async (clusterId) => {
      closeModal();
      const res = await ApiManager.deleteCluster(clusterId);
      const _res = validateAPI(res) ?? {};
      Logger.debug(`RQHook > useDeleteCluster ... clusterId: ${clusterId}`)
      return _res;
    },
    onSuccess: (res, { clusterId }) => {
      Logger.debug(`RQHook > useDeleteCluster ... res: `, res);
      apiToast.ok(`${Localization.kr.CLUSTER} ${Localization.kr.REMOVE} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_CLUSTERS, QK.CLUSTERS_FROM_DATA_CENTER]);
      queryClient.removeQueries(QK.CLUSTER, clusterId)
      setClustersSelected([])
      const datacenterId = datacentersSelected[0]?.id
      datacenterId && clearTabInPage("/computing/datacenters");
      navigate(datacenterId ? `/computing/datacenters/${datacenterId}/clusters` : `/computing/rutil-manager/clusters`)
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_CLUSTERS, QK.CLUSTERS_FROM_DATA_CENTER]);
      postError && postError(error);
    },
  });
};
//#endregion: Cluster


//#region: Cluster Level (클러스터레벨)
/**
 * @name useAllClusterLevels
 * @description 클러스터 레벨 목록조회 useQuery훅
 * 
 * @param {string} cateogry 카테고리 (arch/id/빈값)
 * @param {function} mapPredicate 객체 변형 처리
 * @see ApiManager.findAllClusterLevels
 */
export const useAllClusterLevels = (
  category="",
  mapPredicate=(e)=>({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.ALL_CLUSTER_LEVELS],
  queryFn: async () => {
    const res = await ApiManager.findAllClusterLevels(category)
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllClusterLevels ... res: `, _res);
    return _res;
  }
})
/**
 * @name useAllUpClusters
 * @description 클러스터 레벨 상세조회 useQuery훅
 * 
 * @param {string} clusterLevelId 클러스터 레벨 ID
 * @see ApiManager.findClusterLevel
 */
export const useClusterLevel = (
  clusterLevelId="",
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.ALL_CLUSTERS],
  queryFn: async () => {
    const res = await ApiManager.findClusterLevel(clusterLevelId)
    const _res = validateAPI(res) ?? {}
    Logger.debug(`RQHook > useClusterLevel ... useClusterLevel: ${clusterLevelId}`)
    return _res
  }
})
//#endregion: Cluster Level (클러스터레벨)

//#region: Host (호스트)
/**
 * @name useAllHosts
 * @description 호스트 목록조회 useQuery훅
 * 
 * @param {function} mapPredicate 객체 변형 처리
 * @see ApiManager.findAllHosts
 */
export const useAllHosts = (
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.ALL_HOSTS],
  queryFn: async () => {
    const res = await ApiManager.findAllHosts()
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllHosts ... res: `, _res);
    return _res
  }
})
/**
 * @name useHost
 * @description 호스트 상세조회 useQuery훅
 * 
 * @param {string} hostId 호스트ID
 * @returns useQuery훅
 * 
 * @see ApiManager.findHost
 */
export const useHost = (
  hostId
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.HOST, hostId], 
  queryFn: async () => {
    const res = await ApiManager.findHost(hostId)
    const _res = validateAPI(res) ?? {}
    Logger.debug(`RQHook > useHost ... hostId: ${hostId},  res: `, _res);
    return _res
  },
  enabled: !!hostId
})


/**
 * @name useVmsFromHost
 * @description 호스트 내 가상머신 목록조회 useQuery훅
 * 
 * @param {string} hostId
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findVmsFromHost
 */
export const useVmsFromHost = (
  hostId,
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.VM_FROM_HOST, hostId],
  queryFn: async () => {
    const res = await ApiManager.findVmsFromHost(hostId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useVmsFromHost ... hostId: ${hostId},  res: `, _res);
    return _res
  },
  enabled: !!hostId
})
/**
 * @name useNetworkInterfacesFromHost
 * @description 호스트 내 네트워크인터페이스 목록조회 useQuery훅
 * 
 * @param {string} hostId
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findHostNicsFromHost
 */
export const useNetworkInterfacesFromHost = (
  hostId,
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.NETWORK_INTERFACES_FROM_HOST, hostId],
  queryFn: async () => {
    const res = await ApiManager.findHostNicsFromHost(hostId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useNetworkInterfacesFromHost ... hostId: ${hostId},  res: `, _res);
    return _res
  },
  enabled: !!hostId
})
/**
 * @name useNetworkInterfaceFromHost
 * @description 호스트 내 네트워크인터페이스 조회 useQuery훅
 * 
 * @param {string} hostId
 * @param {string} nicId
 * @returns useQuery훅
 * 
 * @see ApiManager.findHostNicsFromHost
 */
export const useNetworkInterfaceFromHost = (
  hostId, nicId
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.NETWORK_INTERFACE_FROM_HOST, hostId, nicId],
  queryFn: async () => {
    const res = await ApiManager.findHostNicFromHost(hostId, nicId);
    const _res = validateAPI(res) ?? {}
    Logger.debug(`RQHook > useNetworkInterfaceFromHost ... hostId: ${hostId} nicId: ${nicId},  res: `, _res);
    return _res
  },
  enabled: !!hostId && !!nicId
})
/**
 * @name useNetworkAttachmentsFromHost
 * @description 호스트 내 네트워크 결합 목록조회 useQuery훅
 * 
 * @param {string} hostId
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findNetworkAttachmentsFromHost
 */
export const useNetworkAttachmentsFromHost = (
  hostId,
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.NETWORK_ATTACHMENTS_FROM_HOST, hostId],
  queryFn: async () => {
    const res = await ApiManager.findNetworkAttachmentsFromHost(hostId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useNetworkAttachmentsFromHost ... hostId: ${hostId},  res: `, _res);
    return _res
  },
  enabled: !!hostId
})
/**
 * @name useNetworkAttachmentFromHost
 * @description 호스트 내 네트워크 결합 조회 useQuery훅
 * 
 * @param {string} hostId
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findNetworkAttachmentFromHost
 */
export const useNetworkAttachmentFromHost = (
  hostId, networkAttachmentId
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.NETWORK_ATTACHMENTS_FROM_HOST, hostId, networkAttachmentId],
  queryFn: async () => {
    const res = await ApiManager.findNetworkAttachmentFromHost(hostId, networkAttachmentId);
    const _res = validateAPI(res) ?? {}
    Logger.debug(`RQHook > useNetworkAttachmentFromHost ... hostId: ${hostId} networkAttachmentId: ${networkAttachmentId},  res: `, _res);
    return _res
  },
  enabled: !!hostId
})

/**
 * @name useSetupNetworksFromHost
 * @description 호스트 인터페이스 수정 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 * @see ApiManager.editNetworkAttachmentFromHost
 */
export const useSetupNetworksFromHost = (
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async ({ hostId, hostNetworkVo }) => {
      closeModal();
      const res = await ApiManager.setupHostNicsFromHost(hostId, hostNetworkVo);
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useSetupNetworksFromHost ... hostId: ${hostId}, hostNetworkVo: `, hostNetworkVo)
      return _res
    },
    onSuccess: (res, { hostId }) => {
      Logger.debug(`RQHook > useSetupNetworksFromHost ... res: `, res);
      apiToast.ok(`${Localization.kr.HOST} ${Localization.kr.NICS} ${Localization.kr.UPDATE} ${Localization.kr.REQ_COMPLETE}`);
      invalidateQueriesWithDefault(queryClient, [QK.NETWORK_ATTACHMENTS_FROM_HOST]);
      queryClient.invalidateQueries(QK.HOST, hostId);
      // queryClient.removeQueries(QK.HOST, hostId);
      postSuccess(res);
    },
    onError: (error, { hostId }) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.NETWORK_ATTACHMENTS_FROM_HOST]);
      queryClient.invalidateQueries(QK.HOST, hostId);
      // queryClient.removeQueries(QK.HOST, hostId);
      postError && postError(error);
    },
  });
};

/**
 * @name useSyncallNetworksHost
 * @description 호스트 네트워크 동기화 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 * @see ApiManager.syncallNetworksHost
 */
export const useSyncallNetworksHost = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async (hostId) => {
      closeModal();
      const res = await ApiManager.syncallNetworksHost(hostId);
      const _res = validateAPI(res) ?? {};
      Logger.debug(`RQHook > useSyncallNetworksHost ... hostId: ${hostId}`);
      return _res;
    },
    onSuccess: (res, { hostId }) => {
      Logger.debug(`RQHook > useSyncallNetworksHost ... res: `, res);
      apiToast.ok(`${Localization.kr.HOST} ${Localization.kr.NETWORK} 동기화 ${Localization.kr.REQ_COMPLETE}`);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_HOSTS, QK.NETWORK_ATTACHMENTS_FROM_HOST]);
      queryClient.invalidateQueries(QK.HOST, hostId);
      postSuccess(res);
    },
    onError: (error, { hostId }) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_HOSTS, QK.NETWORK_ATTACHMENTS_FROM_HOST]);
      queryClient.invalidateQueries(QK.HOST, hostId);
      postError && postError(error);
    },
  });
};


/**
 * @name useEditHostNetworkFromHost
 * @description 호스트 네트워크 수정 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 * @see ApiManager.editNetworkAttachmentFromHost
 */
/*
export const useEditHostNetworkFromHost = (
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async ({ hostId, networkAttachmentId, networkAttachmentData }) => {
      closeModal();
      const res = await ApiManager.editNetworkAttachmentFromHost(hostId, networkAttachmentId, networkAttachmentData);
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useEditHostNetworkFromHost ... hostId: ${hostId}, networkAttachmentId: ${networkAttachmentId}, networkAttachmentData: `, networkAttachmentData)
      return _res
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useEditHostNetworkFromHost ... res: `, res);
      apiToast.ok(`${Localization.kr.HOST} ${Localization.kr.NETWORK} ${Localization.kr.UPDATE} ${Localization.kr.REQ_COMPLETE}`)
      queryClient.invalidateQueries('NetworkAttachmentsFromHost');
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      postError && postError(error);
    },
  });
};
*/
/*
/**
 * @name useAddBonding
 * @description 호스트 네트워크 본딩 생성 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 * @see ApiManager.addBonding
 */
/*
export const useAddBonding = (
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async ({ hostId, bonding }) => {
      closeModal();
      const res = await ApiManager.addBonding(hostId, bonding);
      const _res = validateAPI(res) ?? {};
      Logger.debug(`RQHook > useAddBonding ... hostId: ${hostId}, bonding: `, bonding);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useAddBonding ... res: `, res);
      apiToast.ok(`${Localization.kr.HOST} ${Localization.kr.NETWORK} 본딩 ${Localization.kr.CREATE} ${Localization.kr.REQ_COMPLETE}`)
      queryClient.invalidateQueries('NetworkInterfacesFromHost');
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      closeModal();
      postError && postError(error);
    },
  });
};
*/
/**
 * @name useEditBonding
 * @description 호스트 네트워크 본딩 수정 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 * @see ApiManager.editCluster
 */
/*
export const useEditBonding = (
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async ({ hostId, hostNicData }) => {
      closeModal();
      const res = await ApiManager.editBonding(hostId, hostNicData);
      const _res = validateAPI(res) ?? {};
      Logger.debug(`RQHook > useEditBonding ... hostId: ${hostId}, hostNicData: `, hostNicData);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useEditBonding ... res: `, res);
      apiToast.ok(`${Localization.kr.HOST} ${Localization.kr.NETWORK} 본딩 ${Localization.kr.UPDATE} ${Localization.kr.REQ_COMPLETE}`)
      queryClient.invalidateQueries('NetworkInterfacesFromHost');
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      postError && postError(error);
    },
  });
};
*/
/**
 * @name useDeleteBonding
 * @description 호스트 네트워크 본딩 삭제 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 * @see ApiManager.deleteCluster
 */
/*
export const useDeleteBonding = (
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({ 
    mutationFn: async (hostId, hostNicData) => {
      closeModal();
      const res = await ApiManager.deleteBonding(hostId, hostNicData);
      const _res = validateAPI(res) ?? {};
      Logger.debug(`RQHook > useDeleteBonding ... hostId: ${hostId}, hostNicData: `, hostNicData);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useDeleteBonding ... res: `, res);
      apiToast.ok(`${Localization.kr.HOST} ${Localization.kr.NETWORK} 본딩 ${Localization.kr.REMOVE} ${Localization.kr.REQ_COMPLETE}`)  
      queryClient.invalidateQueries('NetworkInterfacesFromHost');
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      postError && postError(error);
    },
  });
};
*/
/**
 * @name useHostDevicesFromHost
 * @description 호스트 내 호스트장치 목록조회 useQuery훅
 * 
 * @param {string} clusterId 클러스터ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findHostdevicesFromHost
 */
export const useHostDevicesFromHost = (
  hostId,
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.HOST_DEVICES_FROM_HOST, hostId],
  queryFn: async () => {
    const res = await ApiManager.findHostdevicesFromHost(hostId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useHostDevicesFromHost ... hostId: ${hostId},  res: `, _res);
    return _res
  },
  enabled: !!hostId
})

/**
 * @name useStoragesFromHost
 * @description 호스트 내 storages (생성) 목록조회 useQuery훅
 * 
 * @param {string} hostId
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllStoragesFromHost
 */
export const useStoragesFromHost = (
  hostId,
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.STORAGES_FROM_HOST, hostId],
  queryFn: async () => {
    const res = await ApiManager.findAllStoragesFromHost(hostId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useStoragesFromHost ... hostId: ${hostId}, res: `, _res);
    return _res; // 데이터 가공 후 반환
  },
  enabled: !!hostId,
});
/**
 * @name useIscsiFromHost
 * @description 호스트 내 iscsi (생성) 목록조회 useQuery훅
 * 
 * @param {string} hostId
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllIscsiFromHost
 */
export const useIscsiFromHost = (
  hostId,
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.ISCSI_FROM_HOST, hostId],
  queryFn: async () => {
    const res = await ApiManager.findAllIscsiFromHost(hostId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useIscsiFromHost ... hostId: ${hostId}, res: `, _res);
    return _res; // 데이터 가공 후 반환
  },
  enabled: !!hostId,
});
/**
 * @name useFibreFromHost
 * @description 호스트 내 fibre 목록조회 useQuery훅
 * 
 * @param {string} hostId
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllFibreFromHost
 */
export const useFibreFromHost = (
  hostId,
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.FIBRE_FROM_HOST, hostId],
  queryFn: async () => {
    const res = await ApiManager.findAllFibreFromHost(hostId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useFibreFromHost ... hostId: ${hostId}, res: `, _res);
    return _res
  },
  enabled: !!hostId,
});
/**
 * @name useSearchIscsiFromHost
 * @description 호스트 iscsi 목록조회 useQuery훅
 * 
 * @param {string} hostId
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findSearchIscsiFromHost
 */
//TODO: 변경필요 useSearchFcFromHost 참고 
export const useSearchIscsiFromHost = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient()
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async ({ hostId, iscsiData }) => {
      closeModal();
      const res = await ApiManager.findSearchIscsiFromHost(hostId, iscsiData);
      const _res = validateAPI(res) ?? {};
      Logger.debug(`RQHook > useSearchIscsiFromHost ... hostId: ${hostId}, iscsiData: `, iscsiData);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useSearchIscsiFromHost ... res: `, res);
      apiToast.ok(`iSCSI ${Localization.kr.IMPORT} ${Localization.kr.REQ_COMPLETE}`);
      invalidateQueriesWithDefault(queryClient, [QK.ISCSI_FROM_HOST, QK.ALL_HOSTS]);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ISCSI_FROM_HOST, QK.ALL_HOSTS]);
      postError && postError(error);
    },
  });
};
/**
 * @name useSearchFcFromHost
 * @description 호스트 fc 목록조회 useQuery훅
 * 
 * @param {string} hostId
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findSearchFcFromHost
 */
export const useSearchFcFromHost = (
  hostId,
  mapPredicate,
  postSuccess=()=>{}, postError
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.SEARCH_FC_FROM_HOST, hostId],
  queryFn: async () => {
    const res = await ApiManager.findSearchFcFromHost(hostId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useSearchFcFromHost ... hostId: ${hostId}, res: `, _res);
    return _res; // 데이터 가공 후 반환
  },
  enabled: !!hostId,
});
/*
=> {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async ({ hostId }) => {
      closeModal();
      const res = await ApiManager.findSearchFcFromHost(hostId);
      const _res = validateAPI(res) ?? {};
      Logger.debug(`RQHook > useSearchFcFromHost ... hostId: ${hostId}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useSearchFcFromHost ... res: `, res);
      apiToast.ok(`FC ${Localization.kr.IMPORT} 요청성공`)
      queryClient.invalidateQueries(['fcsFromHost']);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      postError && postError(error);
    },
  });
};
*/

/**
 * @name useLoginIscsiFromHost
 * @description 호스트 가져오기 iscsi 로그인 useQuery훅
 * 
 * @param {string} hostId
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findLoginIscsiFromHost
 */
//TODO: 변경필요 useSearchFcFromHost 참고
export const useLoginIscsiFromHost = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient()
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async ({ hostId, iscsiData }) => {
      closeModal();
      const res = await ApiManager.findLoginIscsiFromHost(hostId, iscsiData);
      const _res = validateAPI(res) ?? {};
      Logger.debug(`RQHook > useLoginIscsiFromHost ... hostId: ${hostId}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useLoginIscsiFromHost ... res: `, res);
      apiToast.ok(`${Localization.kr.HOST} ${Localization.kr.IMPORT} iscsi ${Localization.kr.LOGIN} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ISCSI_FROM_HOST, QK.ALL_HOSTS]);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ISCSI_FROM_HOST, QK.ALL_HOSTS]);
      postError && postError(error);
    },
  });
};

/**
 * @name useAddHost
 * @description 호스트 생성 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 * @see ApiManager.addHost
 */
export const useAddHost = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async ({ hostData, deployHostedEngine }) => {
      closeModal();
      const res = await ApiManager.addHost(hostData, deployHostedEngine);
      const _res = validateAPI(res) ?? {};
      Logger.debug(`RQHook > useLoginIscsiFromHost ... deployHostedEngine: ${deployHostedEngine}, hostData: `, hostData);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useAddHost ... res: `, res);
      apiToast.ok(`${Localization.kr.HOST} ${Localization.kr.CREATE} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ISCSI_FROM_HOST, QK.ALL_HOSTS]);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ISCSI_FROM_HOST, QK.ALL_HOSTS]);
      postError && postError(error);
    },
  });
};
/**
 * @name useEditHost
 * @description Host 수정 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 * @see ApiManager.editHost
 */
export const useEditHost = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async ({ hostId, hostData }) => {
      closeModal();
      const res = await ApiManager.editHost(hostId, hostData)
      const _res = validateAPI(res) ?? {};
      Logger.debug(`RQHook > useEditHost ... hostId: ${hostId}, hostData: `, hostData);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useEditHost ... res: `, res);
      apiToast.ok(`${Localization.kr.HOST} ${Localization.kr.UPDATE} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ISCSI_FROM_HOST, QK.ALL_HOSTS]);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ISCSI_FROM_HOST, QK.ALL_HOSTS]);
      postError && postError(error);
    },
  });
};
/**
 * @name useDeleteHost
 * @description Host 삭제 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 * @see ApiManager.deleteHost
 */
export const useDeleteHost = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
  const { clustersSelected } = useGlobal()
  return useMutation({
    mutationFn: async (hostId) => {
      closeModal();
      const res = await ApiManager.deleteHost(hostId)
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useDeleteHost ... hostId: ${hostId}`)
      return _res;
    },
    onSuccess: (res, { hostId }) => {
      Logger.debug(`RQHook > useDeleteHost ... res: `, res);
      apiToast.ok(`${Localization.kr.HOST} ${Localization.kr.REMOVE} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ISCSI_FROM_HOST, QK.ALL_HOSTS]);
      queryClient.invalidateQueries(QK.HOST, hostId)
      const clusterId = clustersSelected[0]?.id
      navigate(
        hostId
        ? `/computing/rutil-manager/hosts`
        : clusterId 
          ? `/computing/clusters/${clusterId}/hosts` 
          : `/computing/rutil-manager/hosts`
      )
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ISCSI_FROM_HOST, QK.ALL_HOSTS]);
      postError && postError(error);
    },
  });
};

/**
 * @name useDeactivateHost
 * @description 호스트 유지보수 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 * @see ApiManager.deactivateHost
 */
export const useDeactivateHost = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async (hostId) => {
      closeModal();
      const res = await ApiManager.deactivateHost(hostId);
      const _res = validateAPI(res) ?? {};
      Logger.debug(`RQHook > useDeactivateHost ... hostId: ${hostId}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useDeactivateHost ... res: `, res);
      apiToast.ok(`${Localization.kr.HOST} ${Localization.kr.MAINTENANCE} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_HOSTS]);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_HOSTS]);
      postError && postError(error);
    },
  });
};

/**
 * @name useActivateHost
 * @description 호스트 활성 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 * @see ApiManager.activateHost
 */
export const useActivateHost = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async (hostId) => {
      closeModal();
      const res = await ApiManager.activateHost(hostId)
      const _res = validateAPI(res) ?? {};
      Logger.debug(`RQHook > useActivateHost ... hostId: ${hostId}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useActivateHost ... res: `, res);
      apiToast.ok(`${Localization.kr.HOST} ${Localization.kr.ACTIVATE} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_HOSTS]);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_HOSTS]);
      postError && postError(error);
    },
  });
};

/**
 * @name useRestartHost
 * @description 호스트 재시작 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 * @see ApiManager.restartHost
 */
export const useRestartHost = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async (hostId) => {
      closeModal();
      const res = await ApiManager.restartHost(hostId);
      const _res = validateAPI(res) ?? {};
      Logger.debug(`RQHook > useRestartHost ... hostId: ${hostId}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useRestartHost ... res: `, res);
      apiToast.ok(`${Localization.kr.HOST} ${Localization.kr.RESTART} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_HOSTS]);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_HOSTS]);
      postError && postError(error);
    },
  });
};

/**
 * @name useEnrollHostCertificate
 * @description 호스트 인증서 등록 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 * @see ApiManager.enrollHostCertificate
 */
export const useEnrollHostCertificate = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async (hostId) => {
      closeModal();
      const res = await ApiManager.enrollHostCertificate(hostId);
      const _res = validateAPI(res) ?? {};
      Logger.debug(`RQHook > useEnrollHostCertificate ... hostId: ${hostId}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useEnrollHostCertificate ... res: `, res);
      apiToast.ok(`${Localization.kr.HOST} 인증서 등록 ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_HOSTS]);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_HOSTS]);
      postError && postError(error);
    },
  });
}
/**
 * @name useReinstallHost
 * @description 호스트 재설치 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 * @see ApiManager.refreshHost
 */
export const useReinstallHost = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async ({ hostId, hostData, deployHostedEngine }) => {
      closeModal();
      const res = await ApiManager.reinstallHost(hostId, hostData, deployHostedEngine);
      const _res = validateAPI(res) ?? {};
      Logger.debug(`RQHook > useReinstallHost ... hostId: ${hostId}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useReinstallHost ... res: `, res);
      apiToast.ok(`${Localization.kr.HOST} 기능을 ${Localization.kr.REFRESH} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_HOSTS]);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_HOSTS]);
      postError && postError(error);
    },
  });
};


/**
 * @name useRefreshHost
 * @description 호스트 새로고침 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 * @see ApiManager.refreshHost
 */
export const useRefreshHost = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async (hostId) => {
      closeModal();
      const res = await ApiManager.refreshHost(hostId);
      const _res = validateAPI(res) ?? {};
      Logger.debug(`RQHook > useRefreshHost ... hostId: ${hostId}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useRefreshHost ... res: `, res);
      apiToast.ok(`${Localization.kr.HOST} 기능을 ${Localization.kr.REFRESH} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_HOSTS]);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_HOSTS]);
      postError && postError(error);
    },
  });
};

/**
 * @name useCommitNetConfigHost
 * @description 호스트 재부팅 확인 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 * @see ApiManager.commitNetConfigHost
 */
export const useCommitNetConfigHost = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async (hostId) => {
      closeModal();
      const res = await ApiManager.commitNetConfigHost(hostId)
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > usecommitNetConfigHost ... hostId: ${hostId}`)
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > usecommitNetConfigHost ... res: `, res);
      apiToast.ok(`${Localization.kr.HOST} ${Localization.kr.REBOOT} 확인 ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_HOSTS]);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_HOSTS]);
      postError && postError(error);
    },
  });
};
/**
 * @name useActivateGlobalHaHost
 * @description 호스트 글로벌 HA 유지관리 활성화 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 * @see ApiManager.activateGlobalHaHost
 */
export const useActivateGlobalHaHost = (
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async (hostId) => {
      closeModal();
      const res = await ApiManager.activateGlobalHaHost(hostId)
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > ussActivateGlobalHaHost ... hostId: ${hostId}`)
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > ussActivateGlobalHaHost ... res: `, res);
      apiToast.ok(`${Localization.kr.HOST} 글로벌 HA 유지관리 활성화 ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_HOSTS]);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_HOSTS]);
      postError && postError(error);
    },
  });
};
/**
 * @name useDeactivateGlobalHaHost
 * @description 호스트 글로벌 HA 유지관리 비활활성화 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 * @see ApiManager.activateGlobalHaHost
 */
export const useDeactivateGlobalHaHost = (
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async (hostId) => {
      closeModal();
      const res = await ApiManager.deactivateGlobalHaHost(hostId)
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useDeactivateGlobalHaHost ... hostId: ${hostId}`)
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useDeactivateGlobalHaHost ... res: `, res);
      apiToast.ok(`${Localization.kr.HOST} 글로벌 HA 유지관리 비활성화 ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_HOSTS]);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_HOSTS]);
      postError && postError(error);
    },
  });
};
//#endregion: Host


//#region: VM (가상머신)
/**
 * @name useAllVMs
 * @description 가상머신 목록조회 useQuery훅
 * 
 * @param {function} mapPredicate 객체 변형 처리
 * @see ApiManager.findAllVMs
 */
export const useAllVMs = (
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.ALL_VMS],
  queryFn: async () => {
    const res = await ApiManager.findAllVMs()
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllVMs ... res: `, _res);
    return _res;
  },
  // staleTime: 2000, // 2초 동안 데이터 재요청 방지
})

export const qpVm = (
  vmId,
  variant="default",
) => {
  const qpDefault = (
    variant === "default" 
      ? QP_DEFAULT
      : {}
  )
  Logger.debug(`RQHook > qpVm ... variant: ${variant}`)
  return {
    ...qpDefault,
    queryKey: [QK.VM, vmId, variant],
    queryFn: async () => {
      const res = await ApiManager.findVM(vmId);
      const _res = validateAPI(res) ?? {};
      Logger.debug(`RQHook > qpVm ... vmId: ${vmId}, res: `, _res);
      return _res;
    },
    enabled: !!vmId
  }
}
/**  
 * @name useVm
 * @description 가상머신 상세조회 useQuery 훅
 * 
 * @param {string} vmId 가상머신 ID
 * @returns useQuery 훅
 * @see ApiManager.findVM
 */
export const useVm = (
  vmId
) => useQuery({
  ...qpVm(vmId),  
});
/**  
 * @name useVm4Edit
 * @description 가상머신 상세조회 useQuery 훅 (편집 중일 때)
 * 
 * @param {string} vmId 가상머신 ID
 * @returns useQuery 훅
 * @see ApiManager.findVM
 */
export const useVm4Edit = (
  vmId
) => useQuery({
  ...qpVm(vmId, "edit"),  
});
/**
 * @name useAllDiskAttachmentsFromVm
 * @description 가상머신 내 디스크 목록조회 useQuery훅
 * 
 * @param {string} vmId 가상머신ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllDiskAttachmentsFromVm
 */
export const useAllDiskAttachmentsFromVm = (
  vmId,
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  ...QP_DEFAULT,
  queryKey: [QK.ALL_DISKS_FROM_VM, vmId],
  queryFn: async () => {
    const res = await ApiManager.findAllDiskAttachmentsFromVm(vmId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllDiskAttachmentsFromVm ... vmId: ${vmId}, res: `, _res);
    return _res;
  },
  enabled: !!vmId,
  retry: false,
});
/**
 * @name useAllSnapshotsFromVm
 * @description 가상머신 내 스냅샷 목록조회 useQuery훅
 * 
 * @param {string} vmId 가상머신ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllSnapshotsFromVm
 */
export const useAllSnapshotsFromVm = (
  vmId,
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.ALL_SNAPSHOTS_FROM_VM, vmId],
  queryFn: async () => {
    const res = await ApiManager.findAllSnapshotsFromVm(vmId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllSnapshotsFromVm ... vmId: ${vmId}, res: `, _res);
    return _res
  },
  enabled: !!vmId,
  retry: false,
});

/**
 * @name useSnapshotDetailFromVM
 * @description 가상머신 내 스냅샷 상세정보 useQuery훅
 * 
 * @param {string} vmId 가상머신ID
 * @param {string} snapshotId 스냅샷샷ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findSnapshotFromVM
 */
export const useSnapshotDetailFromVM = (
  vmId, snapshotId
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.SNAPSHOT_DETAIL_FROM_VM, vmId, snapshotId], // snapshotId 추가
  queryFn: async () => {
    if (!vmId || !snapshotId) {
      Logger.warn('RQHook > useSnapshotDetailFromVM ... Missing VM ID or Snapshot ID');
      return {};
    }
    const res = await ApiManager.findSnapshotFromVm(vmId, snapshotId);
    const _res = validateAPI(res) ?? {};
    Logger.debug(`RQHook > useSnapshotDetailFromVM ... vmId: ${vmId}, res: `, _res);
    return _res;
  },
  enabled: !!vmId && !!snapshotId,
  retry: false,
});


/**
 * @name useAddSnapshotFromVm
 * @description 가상머신 스냅샷 생성 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useAddSnapshotFromVm = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async ({ vmId, snapshotData }) => {
      closeModal();
      const res = await ApiManager.addSnapshotFromVm(vmId, snapshotData)
      const _res = validateAPI(res) ?? {};
      Logger.debug(`RQHook > useAddSnapshotFromVm ... vmId: ${vmId}, snapshotData: ${JSON.stringify(snapshotData, null, 2)}`)
      return _res
    },
    onSuccess: (res, { vmId }) => {
      Logger.debug(`RQHook > useAddSnapshotFromVm ... res: ${JSON.stringify(res)}`)
      apiToast.ok(`${Localization.kr.VM}에서 ${Localization.kr.SNAPSHOT} ${Localization.kr.CREATE} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.SNAPSHOT_DETAIL_FROM_VM]);
      queryClient.invalidateQueries([QK.ALL_SNAPSHOTS_FROM_VM, vmId]);
      postSuccess(res);
    },
    onError: (error, { vmId }) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.SNAPSHOT_DETAIL_FROM_VM]);
      queryClient.invalidateQueries([QK.ALL_SNAPSHOTS_FROM_VM, vmId]);
      postError && postError(error);
    },
  });
};

/**
 * @name useDeleteSnapshot
 * @description 가상머신 스냅샷 삭제 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useDeleteSnapshot = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient(); // Query 캐싱을 위한 클라이언트
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async ({ vmId, snapshotId }) => {
      closeModal();
      const res = await ApiManager.deleteSnapshotFromVM(vmId, snapshotId);
      const _res = validateAPI(res) ?? {};
      Logger.debug(`RQHook > useDeleteSnapshot ... vmId: ${vmId}, snapshotId: ${snapshotId}`)
      return _res;
    },
    onSuccess: (res, { vmId }) => {
      Logger.debug(`RQHook > useDeleteSnapshot ... res: `, res)
      apiToast.ok(`${Localization.kr.SNAPSHOT} ${Localization.kr.REMOVE} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.SNAPSHOT_DETAIL_FROM_VM]);
      queryClient.invalidateQueries(QK.ALL_SNAPSHOTS_FROM_VM, vmId); // 데이터센터 추가 성공 시 'allDataCenters' 쿼리를 리패칭하여 목록을 최신화
      postSuccess(res);
    },
    onError: (error, { vmId }) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.SNAPSHOT_DETAIL_FROM_VM]);
      queryClient.invalidateQueries(QK.ALL_SNAPSHOTS_FROM_VM, vmId);
      postError && postError(error);
    },
  });
};

export const usePreviewSnapshot = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient(); // Query 캐싱을 위한 클라이언트
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async ({ vmId, snapshotId }) => {
      closeModal();
      const res = await ApiManager.previewSnapshotFromVM(vmId, snapshotId);
      const _res = validateAPI(res) ?? {};
      Logger.debug(`RQHook > usePreviewSnapshot ... vmId: ${vmId}, snapshotId: ${snapshotId}`)
      return _res;
    },
    onSuccess: (res, { vmId }) => {
      Logger.debug(`RQHook > usePreviewSnapshot ... res: `, res)
      apiToast.ok(`${Localization.kr.SNAPSHOT} ${Localization.kr.PREVIEW} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.SNAPSHOT_DETAIL_FROM_VM]);
      queryClient.invalidateQueries(QK.ALL_SNAPSHOTS_FROM_VM, vmId);
      postSuccess(res);
    },
    onError: (error, { vmId }) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.SNAPSHOT_DETAIL_FROM_VM]);
      queryClient.invalidateQueries(QK.ALL_SNAPSHOTS_FROM_VM, vmId);
      postError && postError(error);
    },
  });
};

export const useCommitSnapshot = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient(); // Query 캐싱을 위한 클라이언트
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async ({ vmId }) => {
      closeModal();
      const res = await ApiManager.commitSnapshotFromVM(vmId);
      const _res = validateAPI(res) ?? {};
      Logger.debug(`RQHook > useCommitSnapshot ... vmId: ${vmId}`);
      return _res;
    },
    onSuccess: (res, { vmId }) => {
      Logger.debug(`RQHook > useCommitSnapshot ... res: `, res)
      apiToast.ok(`${Localization.kr.SNAPSHOT} ${Localization.kr.COMMENT} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.SNAPSHOT_DETAIL_FROM_VM]);
      queryClient.invalidateQueries(QK.ALL_SNAPSHOTS_FROM_VM, vmId);
      postSuccess(res);
    },
    onError: (error, { vmId }) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.SNAPSHOT_DETAIL_FROM_VM]);
      postError && postError(error);
    },
  });
};

export const useUndoSnapshot = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient(); // Query 캐싱을 위한 클라이언트
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async ({ vmId }) => {
      closeModal();
      const res = await ApiManager.undoSnapshotFromVM(vmId);
      const _res = validateAPI(res) ?? {};
      Logger.debug(`RQHook > useUndoSnapshot ... vmId: ${vmId}`)
      return _res;
    },
    onSuccess: (res, { vmId }) => {
      Logger.debug(`RQHook > useUndoSnapshot ... res: `, res)
      apiToast.ok(`${Localization.kr.SNAPSHOT} ${Localization.kr.UNDO} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.SNAPSHOT_DETAIL_FROM_VM]);
      queryClient.invalidateQueries(QK.ALL_SNAPSHOTS_FROM_VM, vmId);
      postSuccess(res);
    },
    onError: (error, { vmId }) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.SNAPSHOT_DETAIL_FROM_VM]);
      queryClient.invalidateQueries(QK.ALL_SNAPSHOTS_FROM_VM, vmId);
      postError && postError(error);
    },
  });
};

/**
 * @name useHostDevicesFromVM
 * @description 가상머신 내 호스트 장치 목록조회 useQuery훅
 * 
 * @param {string} vmId 가상머신ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findHostdevicesFromVM
 */
export const useHostDevicesFromVM = (
  vmId,
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.HOST_DEVICES_FROM_VM, vmId],
  queryFn: async () => {
    const res = await ApiManager.findHostdevicesFromVM(vmId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useHostDevicesFromVM ... vmId: ${vmId}, res: `, _res);
    return _res
  },
  enabled: !!vmId,
  staleTime: 0,
  cacheTime: 0,
});

/**
 * @name useNetworkInterfacesFromVM
 * @description 가상머신 내 네트워크인터페이스 목록조회 useQuery훅
 * 
 * @param {string} vmId 가상머신ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findNicsFromVM
 */
export const useNetworkInterfacesFromVM = (
  vmId,
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.NETWORK_INTERFACES_FROM_VM, vmId],
  queryFn: async () => {
    const res = await ApiManager.findNicsFromVM(vmId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useNetworkInterfacesFromVM ... vmId: ${vmId}, res: `, _res);
    return _res
  },
  enabled: !!vmId,
});

/**
 * @name useNetworkInterfaceFromVM
 * @description 가상머신 내 네트워크인터페이스 상세조회 useQuery훅
 * 
 * @param {string} vmId 가상머신ID
 * @param {string} nicId 네트워크인터페이스ID
 * 
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findNicFromVM
 */
export const useNetworkInterfaceFromVM = (
  vmId,
  nicId
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.NETWORK_INTERFACE_FROM_VM, vmId],
  queryFn: async () => {
    const res = await ApiManager.findNicFromVM(vmId, nicId);
    const _res = validateAPI(res) ?? {}
    Logger.debug(`RQHook > useNetworkInterfaceFromVM ... vmId: ${vmId}, nicId: ${nicId}, res: `, _res);
    return _res
  },
  enabled: !!vmId && !!nicId,
  staleTime: 0,
  cacheTime: 0,
});

/**
 * @name useApplicationsFromVM
 * @description 가상머신 내 어플리케이션 목록조회 useQuery훅
 * 
 * @param {string} vmId 가상머신ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * ApplicationFromVM
 * @see ApiManager.findApplicationsFromVM
 */
export const useApplicationsFromVM = (
  vmId,
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.APPLICATION_FROM_VM, vmId],
  queryFn: async () => {
    const res = await ApiManager.findApplicationsFromVM(vmId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useApplicationsFromVM ... vmId: ${vmId}, res: `, _res);
    return _res
  },
  enabled: !!vmId,
  staleTime: 0,
  cacheTime: 0,
});

/**
 * @name useVmConsoleAccessInfo
 * @description 가상머신 콘솔 접속정보 조회
 * 
 */
export const useVmConsoleAccessInfo = (
  vmId
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.VM_CONSOLE_ACCESS_INFO, vmId],
  queryFn: async () => {
    const res = await ApiManager.findVmConsoleAccessInfo(vmId);
    const _res = validateAPI(res) ?? {}
    Logger.debug(`RQHook > useVmConsoleAccessInfo ... vmId: ${vmId}, res: `, _res);
    return validateAPI(res);
  },
  enabled: !!vmId
})

/**
 * @name useRemoteViewerConnectionFileFromVm
 * @description 가상머신 원격 뷰어 접속파일 다운로드 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 * @see ApiManager.activateHost
 */
export const useRemoteViewerConnectionFileFromVm = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async (vmId) => {
      closeModal();
      const res = await ApiManager.generateVmRemoteViewerConnectionFile(vmId);
      // const _res = validateAPI(res) ?? {};
      // 파일에 넣을 텍스트 파일을 전달
      Logger.debug(`RQHook > useRemoteViewerConnectionFileFromVm ... vmId: ${vmId}`);
      return res;
    },
    onSuccess: (res, { vmId }) => {
      Logger.debug(`RQHook > useRemoteViewerConnectionFileFromVm ... res: `, res);
      apiToast.ok(`${Localization.kr.VM} ${Localization.kr.CONSOLE} 원격 뷰어 접속파일 다운로드 ${Localization.kr.REQ_COMPLETE}`)
      triggerDownload(res, "console.vv")
      invalidateQueriesWithDefault(queryClient, [QK.ALL_VMS]);
      queryClient.invalidateQueries([QK.VM, vmId, "default"]);
      postSuccess(res);
    },
    onError: (error, { vmId }) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_VMS]);
      queryClient.invalidateQueries([QK.VM, vmId, "default"]);
      postError && postError(error);
    },
  });
}

/**
 * @name useAddVm
 * @description 가상머신 생성 
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useAddVm = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async (vmData) => {
      closeModal();
      const res = await ApiManager.addVM(vmData)
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useAddVm ... vmData: `, vmData);
      return _res
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useAddVm ... res: `, res);
      apiToast.ok(`${Localization.kr.VM} ${Localization.kr.CREATE} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_VMS]);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_VMS]);
      postError && postError(error);
    },
  });
};
/**
 * @name useEditVm
 * @description 가상머신 편집
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useEditVm = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async ({ vmId, vmData }) => {
      closeModal();
      const res = await ApiManager.editVM(vmId, vmData);
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useEditVm ... vmData: `, vmData);
      return _res;
    },
    onSuccess: (res, { vmId }) => {
      Logger.debug(`RQHook > useEditVm ... res: `, res);
      apiToast.ok(`${Localization.kr.VM} ${Localization.kr.UPDATE} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_VMS, QK.ALL_DISKS_FROM_VM]);
      queryClient.invalidateQueries([QK.VM, vmId, "default"]);
      queryClient.invalidateQueries([QK.VM, vmId, "edit"]);
      postSuccess(res);
    },
    onError: (error, { vmId }) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_VMS, QK.ALL_DISKS_FROM_VM]);
      queryClient.invalidateQueries([QK.VM, vmId, "default"]);
      queryClient.invalidateQueries([QK.VM, vmId, "edit"]);
      postError && postError(error);
    },
  });
};

/**
 * @name useDeleteVm
 * @description 가상머신 삭제 useMutation 훅(아이디 잘뜸)
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useDeleteVm = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
  const { vmsSelected, setVmsSelected, hostsSelected } = useGlobal();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async ({ vmId, detachOnly }) => {
      closeModal();
      const res = await ApiManager.deleteVM(vmId, detachOnly);
      const _res = validateAPI(res) ?? {};
      Logger.debug(`RQHook > useDeleteVm ... vmId: ${vmId}, detachOnly: ${detachOnly}`);
      return _res;
    },
    // onSuccess: (res, { vmId }) => {
    //   Logger.debug(`RQHook > useDeleteVm ... res: `, res);
    //   apiToast.ok(`${Localization.kr.VM} ${Localization.kr.REMOVE} ${Localization.kr.REQ_COMPLETE}`)
    //   invalidateQueriesWithDefault(queryClient, [QK.ALL_VMS, QK.ALL_DISKS_FROM_VM]);
    //   queryClient.invalidateQueries([QK.VM, vmId]);
    //   setVmsSelected([]);
    //   const hostId = hostsSelected[0]?.id
    //   navigate(hostId ? `/computing/hosts/${hostId}/vms` : `/computing/rutil-manager/vms`)
    //   postSuccess(res);
    // },
    onSuccess: (res, { vmId }) => {
      Logger.debug(`RQHook > useDeleteVm ... res: `, res);
      setVmsSelected([]);
      apiToast.ok(`${Localization.kr.VM} ${Localization.kr.REMOVE} ${Localization.kr.REQ_COMPLETE}`);
      queryClient.removeQueries([QK.VM, vmId, "default"]);
      queryClient.invalidateQueries([QK.ALL_VMS]);
      queryClient.invalidateQueries([QK.ALL_DISKS_FROM_VM]);
      queryClient.invalidateQueries([QK.SNAPSHOTS_FROM_VM, vmId]);

      // 라우팅
      const hostId = hostsSelected[0]?.id
      // navigate(!!hostId && hostId !== "null" 
      //   ? `/computing/hosts/${hostId}/vms`
      //   : `/computing/vms`
      // )
      navigate(`/computing/vms`)

      postSuccess(res);
    },
    onError: (error, { vmId }) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_VMS, QK.ALL_DISKS_FROM_VM]);
      queryClient.removeQueries([QK.VM, vmId]);
      postError && postError(error);
    },
  });
};

/**
 * @name useStartVM
 * @description 가상머신 실행 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useStartVM = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async (vmId) => {
      closeModal();
      const res = await ApiManager.startVM(vmId);
      const _res = validateAPI(res) ?? {};
      Logger.debug(`RQHook > useStartVM ... vmId: ${vmId}`);
      return _res;
    },
    onSuccess: (res, { vmId }) => {
      Logger.debug(`RQHook > useStartVM ... res: `, res);
      apiToast.ok(`${Localization.kr.VM} ${Localization.kr.START} ${Localization.kr.REQ_COMPLETE}`);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_VMS]);
      queryClient.invalidateQueries([QK.VM, vmId, "default"]);
      postSuccess(res);
    },
    onError: (error, { vmId }) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_VMS]);
      queryClient.invalidateQueries([QK.VM, vmId, "default"]);
      postError && postError(error);
    },
  });
};
/**
 * @name useStartOnceVM
 * @description 가상머신 한번 실행 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useStartOnceVM = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async ({ vmId, vmData }) => {
      closeModal();
      const res = await ApiManager.startOnceVM(vmId, vmData);
      const _res = validateAPI(res) ?? {};
      Logger.debug(`RQHook > useStartOnceVM ... vmData: ${vmData}`);
      return _res;
    },
    onSuccess: (res, { vmId }) => {
      Logger.debug(`RQHook > useStartOnceVM ... res: `, res);
      apiToast.ok(`${Localization.kr.VM} 한번 ${Localization.kr.START} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_VMS]);
      queryClient.invalidateQueries([QK.VM, vmId, "default"]);
      postSuccess(res);
    },
    onError: (error, { vmId }) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_VMS]);
      queryClient.invalidateQueries([QK.VM, vmId, "default"]);
      postError && postError(error);
    },
  });
};
/**
 * @name usePauseVM
 * @description 가상머신 일시정지 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const usePauseVM = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async (vmId) => {
      closeModal();
      const res = await ApiManager.pauseVM(vmId);
      const _res = validateAPI(res) ?? {};
      Logger.debug(`RQHook > usePauseVM ... vmId: ${vmId}`);
      return _res;
    },
    onSuccess: (res, { vmId }) => {
      Logger.debug(`RQHook > usePauseVM ... res: `, res);
      apiToast.ok(`${Localization.kr.VM} ${Localization.kr.PAUSE} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_VMS]);
      queryClient.invalidateQueries([QK.VM, vmId, "default"]);
      postSuccess(res);
    },
    onError: (error, { vmId }) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_VMS]);
      queryClient.invalidateQueries([QK.VM, vmId, "default"]);
      postError && postError(error);
    },
  });
};

/**
 * @name useShutdownVm
 * @description 가상머신 종료 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useShutdownVm = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async (vmId) => {
      closeModal();
      const res = await ApiManager.shutdownVM(vmId);
      const _res = validateAPI(res) ?? {};
      Logger.debug(`RQHook > useShutdownVm ... vmId: ${vmId}`);
      return _res;
    },
    onSuccess: (res, { vmId }) => {
      Logger.debug(`RQHook > useShutdownVm ... res: `, res);
      apiToast.ok(`${Localization.kr.VM} ${Localization.kr.END} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_VMS])
      queryClient.invalidateQueries(QK.VM, vmId);
      postSuccess(res);
    },
    onError: (error, { vmId }) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_VMS])
      queryClient.invalidateQueries(QK.VM, vmId);
      postError && postError(error);
    },
  });
};
/**
 * @name usePowerOffVM
 * @description 가상머신 전원 끔 (a.k.a 강제 종료) useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const usePowerOffVM = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async (vmId) => {
      closeModal();
      const res = await ApiManager.powerOffVM(vmId);
      const _res = validateAPI(res) ?? {};
      Logger.debug(`RQHook > usePowerOffVM ... vmId: ${vmId}`);
      return _res;
    },
    onSuccess: (res, { vmId }) => {
      Logger.debug(`RQHook > usePowerOffVM ... res: `, res);
      apiToast.ok(`${Localization.kr.VM} ${Localization.kr.POWER_OFF} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_VMS])
      queryClient.invalidateQueries(QK.VM, vmId);
      postSuccess(res);
    },
    onError: (error, { vmId }) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_VMS])
      queryClient.invalidateQueries(QK.VM, vmId);
      postError && postError(error);
    },
  });
};

/**
 * @name useRebootVM
 * @description 가상머신 재부팅 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useRebootVM = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async (vmId) => {
      closeModal()
      const res = await ApiManager.rebootVM(vmId);
      const _res = validateAPI(res) ?? {};
      Logger.debug(`RQHook > useRebootVM ... vmId: ${vmId}`);
      return _res;
    },
    onSuccess: (res, { vmId }) => {
      Logger.debug(`RQHook > useRebootVM ... res: `, res);
      apiToast.ok(`${Localization.kr.VM} ${Localization.kr.REBOOT} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_VMS])
      queryClient.invalidateQueries([QK.VM, vmId, "default"]);
      postSuccess(res);
    },
    onError: (error, { vmId }) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_VMS])
      queryClient.invalidateQueries([QK.VM, vmId, "default"]);
      postError && postError(error);
    },
  });
};
/**
 * @name useResetVM
 * @description 가상머신 재설정 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useResetVM = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async (vmId) => {
      closeModal()
      const res = await ApiManager.resetVM(vmId);
      const _res = validateAPI(res) ?? {};
      Logger.debug(`RQHook > useResetVM ... vmId: ${vmId}`);
      return _res;
    },
    onSuccess: (res, { vmId }) => {
      Logger.debug(`RQHook > useResetVM ... res: `, res);
      apiToast.ok(`${Localization.kr.VM} ${Localization.kr.RESET} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_VMS])
      queryClient.invalidateQueries([QK.VM, vmId, "default"]);
      postSuccess(res);
    },
    onError: (error, { vmId }) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_VMS])
      queryClient.invalidateQueries([QK.VM, vmId, "default"]);
      postError && postError(error);
    },
  });
};

/**
 * @name useAllMigratableHostsFromVM
 * @description 가상머신 마이그레이션 호스트목록  useQuery훅
 * 
 * @param {string} vmId 가상머신ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.migrateHostsFromVM
 */
export const useAllMigratableHostsFromVM = (
  vmId,
  mapPredicate
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.ALL_MIGRATABLE_HOSTS_FROM_VM, vmId],
  queryFn: async () => {
    const res = await ApiManager.findAllMigratableHostsFromVM(vmId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllMigratableHostsFromVM ... vmId: ${vmId}, res: `, _res);
    return _res;
  },
  enabled: !!vmId
})

/**
 * @name useHostsForMigration
 * @description 가상머신 마이그레이션 호스트목록  useQuery훅
 * 
 * @param {string} vmId 가상머신ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.migrateHostsFromVM
 */
export const useAllMigratableHosts4Vms = (
  vmIds=[],
  mapPredicate
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.ALL_MIGRATABLE_HOSTS_FOR_VMS, ...vmIds],
  queryFn: async () => {
    const res = await ApiManager.findAllMigratableHosts4Vms(vmIds);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllMigratableHosts4Vms ... vmIds: ${vmIds}, res: `, _res);
    return _res;
  },
  enabled: !!vmIds
})

/**
 * @name useMigration
 * @description 가상머신 마이그레이션 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useMigration = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
  return useMutation({
    mutationFn: async ({ vmId, vm, affinityClosure }) => {
      closeModal()
      const res = await ApiManager.migrateVM(vmId, vm, affinityClosure);
      const _res = validateAPI(res) ?? {};
      Logger.debug(`RQHook > useMigration ... vmId: ${vmId}, vm: ${vm}, affinityClosure: ${affinityClosure}`);
      return _res
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useMigration ... res: `, res);
      apiToast.ok(`${Localization.kr.VM} ${Localization.kr.MIGRATION} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_VMS])
      queryClient.invalidateQueries(['hostsForMigration']);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_VMS])
      queryClient.invalidateQueries(['hostsForMigration']);
      postError && postError(error);
    },
  });
};

/**
 * @name useVmScreenshot
 * @description 가상머신 스크린샷 출력 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useVmScreenshot = (
  vmId
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.VM_SCREENSHOT, vmId],
  queryFn: async () => {
    const res = await ApiManager.takeVmScreenshot(vmId);
    const _res = validateAPI(res) ?? {};
    Logger.debug(`RQHook > useVmScreenshot ... vmId: ${vmId}, res: `, _res);
    return _res[[vmId]];
  },
  enabled: !!vmId
})

/**
 * @name useCdromFromVm
 * @description 가상머신 CD-ROM 조회 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useCdromFromVm = (
  vmId, current=false,
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.CDROM_FROM_VM, vmId],
  queryFn: async () => {
    const res = await ApiManager.findCdromFromVm(vmId, current);
    const _res = validateAPI(res) ?? {};
    Logger.debug(`RQHook > useCdromFromVm ... vmId: ${vmId}, current: ${current}, res: `, _res);
    return _res
  },
  enabled: !!vmId
})
/**
 * @name useUpdateCdromFromVM
 * @description 가상머신 CD 변경
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useUpdateCdromFromVM = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
  return useMutation({
    mutationFn: async ({ vmId, cdromFileId, current=true }) => {
      closeModal()
      const res = await ApiManager.updateCdromFromVm(vmId, cdromFileId, current);
      const _res = validateAPI(res) ?? {};
      Logger.debug(`RQHook > useUpdateCdromFromVM ... vmId: ${vmId}, cdromFileId: ${cdromFileId}, current: ${current}`);
      return _res
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useUpdateCdromFromVM ... res: `, res);
      apiToast.ok(`${Localization.kr.VM} ${Localization.kr.UPDATE_CDROM} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_VMS]);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_VMS]);
      postError && postError(error);
    },
  });
};
/**
 * @name useExportVM
 * @description 가상머신 내보내기 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useExportVM = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async (vmId) => {
      closeModal();
      const res = await ApiManager.exportVM(vmId);
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useExportVM ... vmId: ${vmId}`);
      return _res
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useExportVM ... res: `, res);
      apiToast.ok(`${Localization.kr.VM} ${Localization.kr.EXPORT} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_VMS]);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_VMS]);
      postError && postError(error);
    },
  });
};

/**
 * @name useAddNicFromVM
 * @description 가상머신 네트워크 인터페이스 생성 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useAddNicFromVM = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async ({ vmId, nicData }) => {
      closeModal();
      const res = await ApiManager.addNicFromVM(vmId, nicData);
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useAddNicFromVM ... vmId: ${vmId}, nicData: ${nicData}`);
      return _res
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useAddNicFromVM ... res: `, res);
      apiToast.ok(`${Localization.kr.VM}에 ${Localization.kr.NICS} ${Localization.kr.CREATE} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.NETWORK_INTERFACE_FROM_VM]);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.NETWORK_INTERFACE_FROM_VM]);
      postError && postError(error);
    },
  });
};
/** 
 * @name useEditNicFromVM
 * @description 가상머신 네트워크 인터페이스 수정 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 * 
 * @todo 수정해야됨
 */
export const useEditNicFromVM = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async ({ vmId, nicId, nicData }) => {
      closeModal();
      const res = await ApiManager.editNicFromVM(vmId, nicId, nicData);
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useEditNicFromVM ... vmId: ${vmId}, nicId: ${nicId}, nicData: ${nicData}`);
      return _res
    },
    onSuccess: (res, { vmId }) => {
      Logger.debug(`RQHook > useEditNicFromVM ... res: `, res);
      apiToast.ok(`${Localization.kr.VM}에 ${Localization.kr.NICS} ${Localization.kr.UPDATE} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.NETWORK_INTERFACE_FROM_VM]);
      queryClient.invalidateQueries([QK.NETWORK_INTERFACES_FROM_VM, vmId]); 
      postSuccess(res);
    },
    onError: (error, { vmId }) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.NETWORK_INTERFACE_FROM_VM]);
      queryClient.invalidateQueries([QK.NETWORK_INTERFACES_FROM_VM, vmId]); 
      postError && postError(error);
    },
  });
};

/**
 * @name useDeleteNetworkInterface
 * @description 가상머신 네트워크 인터페이스 삭제 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useDeleteNetworkInterface = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    // closeModal();
  return useMutation({
    mutationFn: async ({ vmId, nicId }) => {
      closeModal();
      const res = await ApiManager.deleteNicFromVM(vmId, nicId);
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useDeleteNetworkInterface ... vmId: ${vmId}, nicId: ${nicId}`);
      return _res
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useDeleteNetworkInterface ... res: `, res);
      apiToast.ok(`${Localization.kr.VM}에 ${Localization.kr.NICS} ${Localization.kr.REMOVE} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.NETWORK_INTERFACE_FROM_VM]);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.NETWORK_INTERFACE_FROM_VM]);
      postError && postError(error);
    },
  });
};
/**
 * @name useDiskAttachmentFromVm
 * @description 가상머신 상세조회 useQuery 훅
 * 
 * @param {string} vmId 가상머신 ID
 * @param {string} diskAttachmentId diskAtachment ID
 * @returns useQuery 훅
 * 
 * @see ApiManager.findDiskAttachmentFromVm
 */
export const useDiskAttachmentFromVm = (
  vmId, diskAttachmentId
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.DISK_ATTACHMENT_FROM_VM, vmId, diskAttachmentId],
  queryFn: async () => {
    const res = await ApiManager.findDiskAttachmentFromVm(vmId, diskAttachmentId);
    const _res = validateAPI(res) ?? {};
    Logger.debug(`RQHook > useDiskAttachmentFromVm ... vmId: ${vmId}, diskAttachmentId: ${diskAttachmentId}, res: `, _res);
    return _res;
  },
  enabled: !!vmId && !!diskAttachmentId,
});
/**
 * @name useAddDiskFromVM
 * @description 가상머신 디스크 생성 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useAddDiskFromVM = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async ({ vmId, diskData }) => {
      closeModal();
      const res = await ApiManager.addDiskFromVM(vmId, diskData);
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useAddDiskFromVM ... vmId: ${vmId}, diskData: ${JSON.stringify(diskData, null, 2)}`);
      return _res
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useAddDiskFromVM ... res: `, res);
      apiToast.ok(`${Localization.kr.DISK} ${Localization.kr.CREATE} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_DISKS_FROM_VM]);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_DISKS_FROM_VM]);
      postError && postError(error);
    },
  });
};

/**
 * @name useEditDiskFromVM
 * @description 가상머신 디스크 수정 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useEditDiskFromVM = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async ({ vmId, diskAttachmentId, diskAttachment }) => {
      closeModal();
      const res = await ApiManager.editDiskFromVM(vmId, diskAttachmentId, diskAttachment);
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useEditDiskFromVM ... vmId: ${vmId}, diskAttachmentId: ${diskAttachmentId}, diskAttachment: ${JSON.stringify(diskAttachment, null, 2)}`);
      return _res
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useEditDiskFromVM ... res: `, res);
      apiToast.ok(`${Localization.kr.DISK} ${Localization.kr.UPDATE} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_DISKS_FROM_VM]);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_DISKS_FROM_VM]);
      postError && postError(error);
    },
  });
};

/**
 * @name useDeleteDiskFromVM
 * @description 가상머신 디스크 삭제 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useDeleteDiskFromVM = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async ({ vmId, diskAttachmentId, detachOnly }) => {
      closeModal();
      const res = await ApiManager.deleteDiskFromVM(vmId, diskAttachmentId, detachOnly);
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useDeleteDiskFromVM ... vmId: ${vmId}, diskAttachmentId: ${diskAttachmentId}, detachOnly: ${detachOnly}`);
      return _res
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useDeleteDiskFromVM ... res: `, res);
      apiToast.ok(`${Localization.kr.DISK} ${Localization.kr.REMOVE} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_DISKS_FROM_VM]);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_DISKS_FROM_VM]);
      postError && postError(error);
    },
  });
};


/**
 * @name useConnDiskFromVM
 * @description 가상머신 디스크 연결 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useConnDiskFromVM = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async ({ vmId, diskAttachment }) => {
      closeModal();
      const res = await ApiManager.attachDiskFromVM(vmId, diskAttachment);
      const _res = validateAPI(res) ?? {};
      Logger.debug(`RQHook > useConnDiskFromVM ... vmId: ${vmId}, diskAttachment: ${JSON.stringify(diskAttachment, null, 2)}`);
      return _res
    },
    onSuccess: (res, { vmId }) => {
      Logger.debug(`RQHook > useConnDiskFromVM ... res: `, res);
      apiToast.ok(`${Localization.kr.DISK} ${Localization.kr.CONNECTION} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_DISKS_FROM_VM]);
      queryClient.invalidateQueries(QK.VM, vmId);
      postSuccess(res);
    },
    onError: (error, { vmId } ) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_DISKS_FROM_VM]);
      queryClient.invalidateQueries(QK.VM, vmId);
      postError && postError(error);
    },
  });
};

/**
 * @name useConnDiskListFromVM
 * @description 가상머신 디스크 일괄 연결 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useConnDiskListFromVM = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async ({ vmId, diskAttachmentList }) => {
      const res = await ApiManager.attachDisksFromVM(vmId, diskAttachmentList);
      const _res = validateAPI(res) ?? {};
      Logger.debug(`RQHook > useConnDiskListFromVM ... vmId: ${vmId}, diskAttachmentList: ${JSON.stringify(diskAttachmentList, null, 2)}`);
      return _res
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useConnDiskListFromVM ... res: `, res);
      apiToast.ok(`${Localization.kr.DISK} 일괄 ${Localization.kr.CONNECTION} ${Localization.kr.REQ_COMPLETE}`);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_DISKS_FROM_VM]);
      queryClient.invalidateQueries(QK.VM, vmId);
      // closeModal("vmdisk:connect")
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_DISKS_FROM_VM]);
      queryClient.invalidateQueries(QK.VM, vmId);
      // closeModal("vmdisk:connect")
      postError && postError(error);
    },
  });
};

/**
 * @name useDeactivateDiskFromVm
 * @description 가상머신 디스크 유지보수 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 * @see ApiManager.deactivateHost
 */
export const useDeactivateDiskFromVm = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { apiToast } = useApiToast();;
  return useMutation({
    mutationFn: async ({ vmId, diskAttachmentId }) => {
      const res = await ApiManager.deactivateDisksFromVM(vmId, diskAttachmentId);
      const _res = validateAPI(res) ?? {};
      Logger.debug(`RQHook > useDeactivateDiskFromVm ... vmId: ${vmId}, diskAttachmentId: ${diskAttachmentId}`);
      return _res
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useDeactivateDiskFromVm ... res: `, res);
      apiToast.ok(`${Localization.kr.DISK} 일괄 ${Localization.kr.MAINTENANCE} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_DISKS_FROM_VM]);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_DISKS_FROM_VM]);
      postError && postError(error);
    },
  });
};

/**
 * @name useActivateDiskFromVm
 * @description 가상머신 디스크 활성 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 * @see ApiManager.activateHost
 */
export const useActivateDiskFromVm = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { apiToast } = useApiToast();
  return useMutation({
    mutationFn: async ({ vmId, diskAttachmentId }) => {
      const res = await ApiManager.activateDisksFromVM(vmId, diskAttachmentId);
      const _res = validateAPI(res) ?? {};
      Logger.debug(`RQHook > useActivateDiskFromVm ... vmId: ${vmId}, diskAttachmentId: ${diskAttachmentId}`);
      return _res
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useActivateDiskFromVm ... res: `, res);
      apiToast.ok(`${Localization.kr.DISK} 일괄 ${Localization.kr.ACTIVATE} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_DISKS_FROM_VM]);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_DISKS_FROM_VM]);
      postError && postError(error);
    },
  });
};

/**
 * @name useImportVm
 * @description 가상머신 가져오기 
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useImportVm = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  // const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async (vmData) => {
      // closeModal();
      const res = await ApiManager.importVM(vmData)
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useImportVm ... vmData: `, vmData);
      return _res
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useImportVm ... res: `, res);
      apiToast.ok(`${Localization.kr.VM} ${Localization.kr.IMPORT} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_VMS]);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_VMS]);
      postError && postError(error);
    },
  });
};

// 보류
/**
 * @name useFindDiskFromVM
 * @description 가상머신 연결한 디스크 useQuery훅
 * 
 * @param {string} vmId 가상머신ID
 *  * @param {string} diskId 디스크 ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findNicFromVM
 */
/*
export const useFindDiskFromVM = (vmId,diskId) => useQuery({
   refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
   queryKey: ['FindDiskFromVM', vmId], 
   queryFn: async () => {
     Logger.debug(`useFindDiskFromVM vm아이디... ${vmId}`);
     Logger.debug(`useFindDiskFromVM 디스크아이디 ... ${diskId}`);
     const res = await ApiManager.findDiskFromVM(vmId,diskId); 
     Logger.debug('API Response:', res); // 반환된 데이터 구조 확인
     return validateAPI(res) ?? {}; 
   },
});
*/


//#endregion: VM

//#region: Template (템플릿)
/**
 * @name useAllTemplates
 * @description 템플릿 목록조회 useQuery훅
 * 
 * @param {function} mapPredicate 객체 변형 처리
 */
export const useAllTemplates = (
  mapPredicate = (e) => ({ ...e }),
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.ALL_TEMPLATES],
  queryFn: async () => {
    const res = await ApiManager.findAllTemplates()
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? []
      : validateAPI(res) ?? []
    Logger.debug(`RQHook > useAllTemplates ... res: `, _res);
    return _res;
  }
});

/**
 * @name useTemplate
 * @description Template 상세조회 useQuery 훅
 * 
 * @param {string} templateId Template ID
 * @returns useQuery 훅
 */
export const useTemplate = (
  templateId
) => useQuery({
  queryKey: [QK.TEMPLATE, templateId],
  queryFn: async () => {
    const res = await ApiManager.findTemplate(templateId);
    const _res = validateAPI(res) ?? {};
    Logger.debug(`RQHook > useTemplate ... templateId: ${templateId} res: `, _res);
    return _res;
  },
  enabled: !!templateId,
  staleTime: 0,
  cacheTime: 0,
});

/**
 * @name useAllVmsFromTemplate
 * @description Template 내 가상머신 목록조회 useQuery훅
 * 
 * @param {string} templateId TemplateID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.useAllVmsFromTemplate
 */
export const useAllVmsFromTemplate = (
  templateId,
  mapPredicate = (e) => ({ ...e }),
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.ALL_VMS_FROM_TEMPLATE, templateId],
  queryFn: async () => {
    const res = await ApiManager.findVMsFromTemplate(templateId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? []
      : validateAPI(res) ?? []
    Logger.debug(`RQHook > useAllVmsFromTemplate ... templateId: ${templateId}, res: `, _res);
    return _res;
  },
  enabled: !!templateId,
})

/**
 * @name useAllNicsFromTemplate
 * @description Template 내 네트워크 목록조회 useQuery훅
 * 
 * @param {string} templateId TemplateID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllVMsFromDomain
 */
export const useAllNicsFromTemplate = (
  templateId,
  mapPredicate = (e) => ({ ...e }),
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.ALL_NICS_FROM_TEMPLATE, templateId],
  queryFn: async () => {
    const res = await ApiManager.findAllNicsFromTemplate(templateId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? []
      : validateAPI(res) ?? []
    Logger.debug(`RQHook > useAllVmsFromTemplate ... templateId: ${templateId}, res: `, _res);
    return _res;
  },
  enabled: !!templateId,
  staleTime: 0,
  cacheTime: 0,
})

/**
 * @name useNicFromTemplate
 * @description Template 내 네트워크 상세정보 useQuery훅
 * 
 * @param {string} templateId 탬플릿ID
 * @param {string} nicId nic ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllVMsFromDomain
 */
export const useNicFromTemplate = (
  templateId,
  nicId,
  mapPredicate = (e) => ({ ...e }),
) =>
  useQuery({
    queryKey: [QK.NIC_FROM_TEMPLATE, templateId, nicId],
    queryFn: async () => {
      const res = await ApiManager.findNicFromTemplate(templateId, nicId);
      const validated = validateAPI(res); 
      return mapPredicate ? mapPredicate(validated) : validated;
    },
    enabled: !!templateId && !!nicId,
  });
/**
 * @name useAllDisksFromTemplate
 * @description Template 내 디스크 목록조회 useQuery훅
 * 
 * @param {string} templateId TemplateID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllVMsFromDomain
 */
export const useAllDisksFromTemplate = (
  templateId,
  mapPredicate = (e) => ({ ...e }),
) => useQuery({
  ...QP_DEFAULT,
  queryKey: [QK.ALL_DISKS_FROM_TEMPLATE, templateId],
  queryFn: async () => {
    const res = await ApiManager.findDisksFromTemplate(templateId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? []
      : validateAPI(res) ?? []
    Logger.debug(`RQHook > useAllDisksFromTemplate ... templateId: ${templateId}, res: `, _res);
    return _res;
  },
  enabled: !!templateId,
})

/**
 * @name useAllStoragesFromTemplate
 * @description Template 내 스토리지 목록조회 useQuery훅
 * 
 * @param {string} tId TemplateID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findStorageDomainsFromTemplate
 */
export const useAllStoragesFromTemplate = (
  templateId,
  mapPredicate = (e) => ({ ...e }),
) => useQuery({
  ...QP_DEFAULT,
  queryKey: [QK.ALL_STORAGES_FROM_TEMPLATE, templateId],
  queryFn: async () => {
    const res = await ApiManager.findStorageDomainsFromTemplate(templateId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? []
      : validateAPI(res) ?? []
    Logger.debug(`RQHook > useAllDisksFromTemplate ... templateId: ${templateId}, res: `, _res);
    return _res;
  },
  enabled: !!templateId,
  staleTime: 0,
  cacheTime: 0,
})

/**
 * @name useAddTemplate
 * @description Template 생성 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useAddTemplate = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async ({ vmId, templateData }) => {
      closeModal();
      const res = await ApiManager.addTemplate(vmId, templateData)
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useAddTemplate ... vmId: ${vmId}, templateData: ${JSON.stringify(templateData, null, 2)}`)
      return _res
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useAddTemplate ... res: `, res)
      apiToast.ok(`${Localization.kr.TEMPLATE} ${Localization.kr.CREATE} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_TEMPLATES]);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_TEMPLATES]);
      postError && postError(error);
    },
  });
};
/**
 * @name useEditTemplate
 * @description Template 수정 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useEditTemplate = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async ({ templateId, templateData }) => {
      closeModal();
      const res = await ApiManager.editTemplate(templateId, templateData);
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useEditTemplate ... templateId: ${templateId}, templateData: ${JSON.stringify(templateData, null, 2)}`)
      return _res;
    },
    onSuccess: (res, { templateId }) => {
      Logger.debug(`RQHook > useEditTemplate ... res: `, res)
      
      apiToast.ok(`${Localization.kr.TEMPLATE} ${Localization.kr.UPDATE} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_TEMPLATES]);
      queryClient.invalidateQueries([QK.TEMPLATE, templateId]);
      postSuccess(res);
    },
    onError: (error, { templateId }) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_TEMPLATES]);
      queryClient.invalidateQueries([QK.TEMPLATE, templateId]);
      postError && postError(error);
    },
  });
};
/**
 * @name useDeleteTemplate
 * @description Template 삭제 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useDeleteTemplate = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async (templateId) => {
      closeModal();
      const res = await ApiManager.deleteTemplate(templateId);
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useDeleteTemplate ... templateId: ${templateId}`)
      return _res;
    },
    onSuccess: (res, { templateId }) => {
      Logger.debug(`RQHook > useEditTemplate ... res: `, res)
      apiToast.ok(`${Localization.kr.TEMPLATE} ${Localization.kr.REMOVE} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_TEMPLATES]);
      queryClient.removeQueries([QK.TEMPLATE, templateId]);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_TEMPLATES]);
      postError && postError(error);
    },
  });
};


//#region: Type
/**
 * @name useAllBiosTypes
 * @description  BIOS 유형 (a.k.a. 칩셋옵션) 목록 조회 useQuery훅
 * 
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllBiosTypes
 */
export const useAllBiosTypes = (
  mapPredicate = (e) => ({ ...e }),
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.ALL_BIOS_TYPES],
  queryFn: async () => {
    const res = await ApiManager.findAllBiosTypes();
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? []
      : validateAPI(res) ?? []
    Logger.debug(`RQHook > useAllBiosTypes ... res: `, _res);
    return _res;
  },
})
/**
 * @name useAllDiskContentTypes
 * @description 디스크 유형 목록 조회 useQuery훅
 * 
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllBiosTypes
 */
export const useAllDiskContentTypes = (
  mapPredicate = (e) => ({ ...e }),
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.ALL_DISK_CONTENT_TYPES],
  queryFn: async () => {
    const res = await ApiManager.findAllDiskContentTypes();
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? []
      : validateAPI(res) ?? []
    Logger.debug(`RQHook > useAllDiskContentTypes ... res: `, _res);
    return _res;
  },
})
/**
 * @name useAllMigrationSupports
 * @description 마이그레이션 모드 목록 조회 useQuery훅
 * 
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllMigrationSupports
 */
export const useAllMigrationSupports = (
  mapPredicate = (e) => ({ ...e }),
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.ALL_MIGRATION_SUPPORTS],
  queryFn: async () => {
    const res = await ApiManager.findAllMigrationSupports();
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? []
      : validateAPI(res) ?? []
    Logger.debug(`RQHook > useAllMigrationSupports ... res: `, _res);
    return _res;
  },
});
/**
 * @name useAllQuotaEnforcementTypes
 * @description 마이그레이션 모드 목록 조회 useQuery훅
 * 
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllMigrationSupports
 */
export const useAllQuotaEnforcementTypes = (
  mapPredicate = (e) => ({ ...e }),
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.ALL_QUOTA_ENFORCEMENT_TYPES],
  queryFn: async () => {
    const res = await ApiManager.findAllQuotaEnforcementTypes();
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? []
      : validateAPI(res) ?? []
    Logger.debug(`RQHook > useAllQuotaEnforcementTypes ... res: `, _res);
    return _res;
  },
});
/**
 * @name useAllVmTypes
 * @description 가상머신 유형 (a.k.a. 최적화 옵션) 목록 조회 useQuery훅
 * 
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllVmTypes
 */
export const useAllVmTypes = (
  mapPredicate = (e) => ({ ...e }),
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.ALL_VM_TYPES],
  queryFn: async () => {
    const res = await ApiManager.findAllVmTypes();
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? []
      : validateAPI(res) ?? []
    Logger.debug(`RQHook > useAllVmTypes ... res: `, _res);
    return _res;
  },
});
//#endregion: Type


/**
 * @name useAddNicFromTemplate
 * @findAllMigrationSupportsdescription 템플릿 네트워크 생성 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useAddNicFromTemplate = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async ({ templateId, nicData }) => {
      closeModal();
      const res = await ApiManager.addNicFromTemplate(templateId, nicData);
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useAddNicFromTemplate ... templateId: ${templateId}, nicData: ${JSON.stringify(nicData, null, 2)}`)
      return _res;
    },
    onSuccess: (res, { templateId }) => {
      Logger.debug(`RQHook > useAddNicFromTemplate ... res: `, res)
      
      apiToast.ok(`${Localization.kr.TEMPLATE} ${Localization.kr.NICS} ${Localization.kr.CREATE} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_NICS_FROM_TEMPLATE, QK.ALL_TEMPLATES]);
      queryClient.invalidateQueries([QK.TEMPLATE, templateId]); 
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_NICS_FROM_TEMPLATE, QK.ALL_TEMPLATES]);
      queryClient.invalidateQueries([QK.TEMPLATE, templateId]); 
      postError && postError(error);
    },
  });
};
/**
 * @name useEditNicFromTemplate
 * @description 템플릿 네트워크 수정 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useEditNicFromTemplate = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient()
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async ({ templateId, nicId, nicData }) => {
      closeModal();
      const res = await ApiManager.editNicFromTemplate(templateId, nicId, nicData);
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useEditNicFromTemplate ... templateId: ${templateId}, nicId: ${nicId}, nicData: ${JSON.stringify(nicData, null, 2)}`)
      return _res;
    },
    onSuccess: (res, { templateId }) => {
      Logger.debug(`RQHook > useEditNicFromTemplate ... res: `, res)
      apiToast.ok(`${Localization.kr.TEMPLATE} ${Localization.kr.NICS} ${Localization.kr.UPDATE} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_NICS_FROM_TEMPLATE, QK.ALL_TEMPLATES]);
      queryClient.invalidateQueries([QK.TEMPLATE, templateId]); 
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_NICS_FROM_TEMPLATE, QK.ALL_TEMPLATES]);
      queryClient.invalidateQueries([QK.TEMPLATE, templateId]); 
      postError && postError(error);
    },
  });
};


/**
 * @name useDeleteNetworkFromTemplate
 * @description 템플릿 네트워크 삭제 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useDeleteNetworkFromTemplate = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async ({ templateId, nicId, detachOnly }) => {
      closeModal();
      const res = await ApiManager.deleteNicFromTemplate(templateId, nicId, detachOnly);
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useEditNicFromTemplate ... templateId: ${templateId}, nicId: ${nicId}, detachOnly: ${detachOnly}`)
      return _res;
    },
    onSuccess: (res, { templateId }) => {
      Logger.debug(`RQHook > useEditNicFromTemplate ... res: `, res)
      apiToast.ok(`${Localization.kr.TEMPLATE} ${Localization.kr.NICS} ${Localization.kr.REMOVE} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_NICS_FROM_TEMPLATE, QK.ALL_TEMPLATES]);
      queryClient.removeQueries([QK.TEMPLATE, templateId]); 
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_NICS_FROM_TEMPLATE, QK.ALL_TEMPLATES]);
      postError && postError(error);
    },
  });
};
//#endregion: Template (탬플릿)

//#region: Network (네트워크)
/**
 * @name useAllNetworks
 * @description 네트워크 목록조회 useQuery훅
 * 
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 */
export const useAllNetworks = (
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.ALL_NETWORKS],
  queryFn: async () => {
    const res = await ApiManager.findAllNetworks();
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useFibreFromHost ... res: `, _res);
    return _res
  }
});
/**
 * @name useNetwork
 * @description 네트워크 상세조회 useQuery 훅
 * 
 * @param {string} networkId 네트워크 ID
 * @returns useQuery 훅
 */
export const useNetwork = (
  networkId
) => useQuery({
  queryKey: [QK.NETWORK, networkId],
  queryFn: async () => {
    const res = await ApiManager.findNetwork(networkId);
    const _res = validateAPI(res) ?? {};
    Logger.debug(`RQHook > useFibreFromHost ... networkId: ${networkId}, res: `, _res);
    return _res;
  },
  enabled: !!networkId,
  staleTime: 0,
  cacheTime: 0,
});
/**
 * @name useAllClustersFromNetwork
 * @description 네트워크 내 클러스터 목록조회 useQuery훅
 * 
 * @param {string} networkId 네트워크ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllClustersFromNetwork
 */
export const useAllClustersFromNetwork = (
  networkId,
  mapPredicate = (e) => ({ ...e }),
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.CLUSTERS_FROM_NETWORK, networkId],
  queryFn: async () => {
    const res = await ApiManager.findAllClustersFromNetwork(networkId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllClustersFromNetwork ... networkId: ${networkId}, res: `, _res);
    return _res;
  },
  enabled: !!networkId,
})
/**
 * @name useConnectedHostsFromNetwork
 * @description 네트워크 내 호스트 연결된 목록조회 useQuery훅
 * 
 * @param {string} networkId 네트워크 ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findConnectedHostsFromNetwork
 */
export const useConnectedHostsFromNetwork = (
  networkId,
  mapPredicate = (e) => ({ ...e }),
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.CONNECTED_HOSTS_FROM_NETWORK, networkId],
  queryFn: async () => {
    const res = await ApiManager.findConnectedHostsFromNetwork(networkId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useConnectedHostsFromNetwork ... networkId: ${networkId}, res: `, _res);
    return _res;
  },
  enabled: !!networkId,
  staleTime: 0,
  cacheTime: 0,
  //staleTime: 60000, // 1분 동안 데이터 재요청 방지
  //cacheTime: 300000, // 5분 동안 데이터 캐싱 유지  
})
/**
 * @name useDisconnectedHostsFromNetwork
 * @description 네트워크 내 호스트 연결해제 목록조회 useQuery훅
 * 
 * @param {string} networkId 네트워크 ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findDisconnectedHostsFromNetwork
 */
export const useDisconnectedHostsFromNetwork = (
  networkId,
  mapPredicate = (e) => ({ ...e }),
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.DISCONNECTED_HOSTS_FROM_NETWORK, networkId],
  queryFn: async () => {
    const res = await ApiManager.findDisconnectedHostsFromNetwork(networkId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useDisconnectedHostsFromNetwork ... networkId: ${networkId}, res: `, _res);
    return _res;
  },
  enabled: !!networkId,
  staleTime: 0,
  cacheTime: 0,
  //staleTime: 60000, // 1분 동안 데이터 재요청 방지
  //cacheTime: 300000, // 5분 동안 데이터 캐싱 유지  
})
/**
 * @name useAllVmsFromNetwork
 * @description 네트워크 내 가상머신 목록조회 useQuery훅
 * 
 * @param {string} networkId 네트워크ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllVmsFromNetwork
 */
export const useAllVmsFromNetwork = (
  networkId,
  mapPredicate = (e) => ({ ...e }),
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.VM_FROM_NETWORK, networkId],
  queryFn: async () => {
    Logger.debug(`useAllVmsFromNetwork ... ${networkId}`);
    const res = await ApiManager.findAllVmsFromNetwork(networkId);
    return validateAPI(res)?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
  },
  enabled: !!networkId,
})
/**
 * @name useAllTemplatesFromNetwork
 * @description 네트워크 내 템플릿 목록조회 useQuery훅
 * 
 * @param {string} networkId 네트워크ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllTemplatesFromNetwork
 */
export const useAllTemplatesFromNetwork = (
  networkId,
  mapPredicate = (e) => ({ ...e }),
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.TEMPLATE_FROM_NETWORK, networkId],
  queryFn: async () => {
    const res = await ApiManager.findAllTemplatesFromNetwork(networkId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllTemplatesFromNetwork ... networkId: ${networkId}, res: `, _res);
    return _res;
  },
  enabled: !!networkId,
})
/**
 * @name qpAllVnicProfilesFromNetwork
 * @description useQuery용 네트워크 내 VNIC 프로필 목록조회 쿼리 파라미터
 * 
 * @param {string} networkId 네트워크ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllVnicProfilesFromNetwork
 */
const qpAllVnicProfilesFromNetwork = (
  networkId,
  mapPredicate = (e) => ({ ...e }),
) => ({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.VNIC_PROFILES_FROM_NETWORK, networkId],
  queryFn: async () => {
    const res = await ApiManager.findAllVnicProfilesFromNetwork(networkId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > qpAllVnicProfilesFromNetwork ... networkId: ${networkId}, res: `, _res);
    return _res;
  },
  enabled: !!networkId,
})
/**
 * @name useAllVnicProfilesFromNetwork
 * @description 네트워크 내 VNIC 프로필 목록조회 useQuery훅
 * 
 * @param {string} networkId 네트워크ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllVnicProfilesFromNetwork
 */
export const useAllVnicProfilesFromNetwork = (
  networkId,
  mapPredicate = (e) => ({ ...e }),
) => useQuery({ 
  ...qpAllVnicProfilesFromNetwork(networkId, mapPredicate)
});
/**
 * @name useAllVnicProfilesFromNetwork4EachNetwork
 * @description (각 내트워크 별) 네트워크 내 VNIC 프로필 목록조회 useQueries 훅
 * 
 * @param {[*]} networks 네트워크 목록
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQueries 훅
 * 
 * @see ApiManager.useAllVnicProfilesFromNetwork4EachNetwork
 */
export const useAllVnicProfilesFromNetwork4EachNetwork = (
  networks=[],
  mapPredicate = (e) => ({ ...e }),
) => useQueries({
  queries: [...networks].map((n) => ({
    ...qpAllVnicProfilesFromNetwork(n?.id, mapPredicate)
  }))
});

/**
 * @name useAddNetwork
 * @description 네트워크 생성 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useAddNetwork = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async (networkData) => {
      closeModal();
      const res = await ApiManager.addNetwork(networkData);
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useAddNetwork ... networkData: ${JSON.stringify(networkData, null, 2)}`)
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useAddNetwork ... res: `, res)
      apiToast.ok(`${Localization.kr.NETWORK} ${Localization.kr.CREATE} ${Localization.kr.REQ_COMPLETE}`);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_NETWORKS]);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_NETWORKS]);
      postError && postError(error);
    },
  });
};
/**
 * @name useEditNetwork
 * @description 네트워크 수정 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useEditNetwork = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient()
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async ({ networkId, networkData }) => {
      closeModal();
      const res = await ApiManager.editNetwork(networkId, networkData);
      const _res = validateAPI(res) ?? {};
      Logger.debug(`RQHook > useEditNetwork ... networkId: ${networkId}, networkData: ${JSON.stringify(networkData, null, 2)}`)
      return _res;
    },
    onSuccess: (res, { networkId }) => {
      Logger.debug(`RQHook > useEditNetwork ... res: `, res)
      apiToast.ok(`${Localization.kr.NETWORK} ${Localization.kr.UPDATE} ${Localization.kr.REQ_COMPLETE}`);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_NETWORKS]);
      queryClient.invalidateQueries([QK.NETWORK, networkId]);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_NETWORKS]);
      queryClient.invalidateQueries([QK.NETWORK, networkId]);
      closeModal();
      
      postError && postError(error);
    },
  });
};

/**
 * @name useDeleteNetwork
 * @description 네트워크 삭제 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useDeleteNetwork = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async (networkId) => {
      closeModal();
      const res = await ApiManager.deleteNetwork(networkId)
      const _res = validateAPI(res) ?? {};
      Logger.debug(`RQHook > useDeleteNetwork ... networkId: ${networkId}`)
      return _res;
    },
    onSuccess: (res, { networkId }) => {
      Logger.debug(`RQHook > useDeleteNetwork ... res: `, res)
      apiToast.ok(`${Localization.kr.NETWORK} ${Localization.kr.REMOVE} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_NETWORKS]);
      queryClient.removeQueries([QK.NETWORK, networkId]);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_NETWORKS]);
      postError && postError(error);
    },
  });
};

/**
 * @name useAllNetworkProviders
 * @description 네트워크 공급자 목록 useQuery훅
 * 
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 */
// export const useAllNetworkProviders = (
//   mapPredicate = (e) => ({ ...e })
// ) => useQuery({
//   refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
//   queryKey: [QK.ALL_NETWORK_PROVIDERS],
//   queryFn: async () => {
//     const res = await ApiManager.findAllNetworkProviders(); 
//     const _res = mapPredicate
//       ? validateAPI(res)?.map(mapPredicate) ?? []  //  validateAPI(res)?이 null -> .map실행안됨 출력x
//       : validateAPI(res) ?? [];
//     Logger.debug(`RQHook > useAllNetworkProviders ... res: `, _res);
//     return _res;
//   }
// });
// TODO: 네트워크공급자가 일단 한건만 오는 API로 만들었는데 백엔드 설명에는 목록을 주는 걸로 돼있음.  왜 단일건으로 조회되게 만들었는지 확인필요
  export const useAllNetworkProviders = (
    mapPredicate = (e) => ({ ...e })
  ) => useQuery({
    refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
    queryKey: [QK.ALL_NETWORK_PROVIDERS],
    queryFn: async () => {
      const res = await ApiManager.findAllNetworkProviders();
      const validated = validateAPI(res);  // 항상 배열로 변환됨 validateAPI(res)가 단일 객체여도 .map() 동작
      const parsed = (Array.isArray(validated) ? validated : [validated]).map(mapPredicate);
      return parsed;
    }
  });



//#region: VnicProfiles (vNic 프로파일)
/**
 * @name useAllVnicProfiles
 * @description 모든 VNIC 프로파일 목록조회 useQuery훅
 * 
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllVnicProfiles
 */
export const useAllVnicProfiles = (
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.ALL_VNICPROFILES],
  queryFn: async () => {
    const res = await ApiManager.findAllVnicProfiles();
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllVnicProfiles ... res: `, _res);
    return _res;
  }
})

/**
 * @name useVnicProfile
 * @description vnic profile 상세조회 useQuery 훅
 * 
 * @param {string} vnicId vnic profile ID
 * @returns useQuery 훅
 */
export const useVnicProfile = (vnicId) => useQuery({
  queryKey: [QK.VNIC_ID, vnicId],
  queryFn: async () => {
    const res = await ApiManager.findVnicProfile(vnicId);
    const _res = validateAPI(res) ?? {};
    Logger.debug(`RQHook > useVnicProfile ... vnicId: ${vnicId}, res: `, _res);
    return _res;
  },
  enabled: !!vnicId,
  staleTime: 0,
  cacheTime: 0,
});

/**
 * @name useAllVmsFromVnicProfiles
 * @description  VNIC 내 가상머신  목록조회 useQuery훅
 * 
 * @param {string} vnicProfileId vnic아이디
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllVmsFromVnicProfiles
 */
export const useAllVmsFromVnicProfiles = (vnicProfileId,
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.ALL_VMS_FROM_VNIC_PROFILES, vnicProfileId],
  queryFn: async () => {
    const res = await ApiManager.findAllVmsFromVnicProfiles(vnicProfileId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllVmsFromVnicProfiles ... vnicProfileId: ${vnicProfileId}, res: `, _res);
    return _res;
  },
  enabled: !!vnicProfileId,
});

/**
 * @name useAllTemplatesFromVnicProfiles
 * @description vnic내 템플릿 목록조회 useQuery훅
 * 
 * @param {string} vnicProfileId vnic아이디
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllTemplatesFromVnicProfiles
 */
export const useAllTemplatesFromVnicProfiles = (vnicProfileId,
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.ALL_TEMPLATES_FROM_VNIC_PROFILES, vnicProfileId],
  queryFn: async () => {
    const res = await ApiManager.findAllTemplatesFromVnicProfiles(vnicProfileId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllTemplatesFromVnicProfiles ... vnicProfileId: ${vnicProfileId}, res: `, _res);
    return _res;
  },
  enabled: !!vnicProfileId,
  staleTime: 0,
  cacheTime: 0,
})


/**
 * @name useAddVnicProfile
 * @description vnic 새로만들기 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useAddVnicProfile = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async (vnicData) => {
      closeModal();
      const res = await ApiManager.addVnicProfiles(vnicData);
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useAddVnicProfile ... vnicData: ${JSON.stringify(vnicData, null, 2)}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useAddVnicProfile ... res: `, res);
      apiToast.ok(`${Localization.kr.VNIC_PROFILE} ${Localization.kr.CREATE} ${Localization.kr.REQ_COMPLETE}`);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_VNICPROFILES]);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_VNICPROFILES]);
      postError && postError(error);
    },
  });
};
/**
 * @name useEditVnicProfile
 * @description vnic 수정 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useEditVnicProfile = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async ({ vnicId, vnicData }) => {
      closeModal()
      const res = await ApiManager.editVnicProfiles(vnicId, vnicData);
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useEditVnicProfile ... vnicId: ${vnicId}, vnicData: ${JSON.stringify(vnicData, null, 2)}`);
      return _res;
    },
    onSuccess: (res, { vnicId }) => {
      Logger.debug(`RQHook > useEditVnicProfile ... res: `, res);
      apiToast.ok(`${Localization.kr.VNIC_PROFILE} ${Localization.kr.UPDATE} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_VNICPROFILES]);
      queryClient.invalidateQueries(QK.VNIC_ID, vnicId);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_VNICPROFILES]);
      postError && postError(error);
    },
  });
};

/**
 * @name useDeleteVnicProfile
 * @description VnicProfile 삭제 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useDeleteVnicProfile = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async (vnicProfileId) => {
      closeModal();
      const res = await ApiManager.deleteVnicProfiles(vnicProfileId);
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useDeleteVnicProfile ... vnicProfileId: ${vnicProfileId}`);
      return _res;
    },
    onSuccess: (res, { vnicId }) => {
      Logger.debug(`RQHook > useDeleteVnicProfile ... res: `, res);
      apiToast.ok(`${Localization.kr.VNIC_PROFILE} ${Localization.kr.REMOVE} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_VNICPROFILES]);
      queryClient.removeQueries(QK.VNIC_ID, vnicId);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_VNICPROFILES]);
      postError && postError(error);
    },
  });
};

/**
 * @name useAllNetworkFilters
 * @description 네트워크 필터 목록조회 useQuery훅
 * 
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllNetworkFilters
 */
export const useAllNetworkFilters = (
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.ALL_NETWORK_FILTERS],
  queryFn: async () => {
    const res = await ApiManager.findAllNetworkFilters();
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllNetworkFilters ... res: `, _res);
    return _res;
  }
})
//#endreion VnicProfile (vNic 프로파일)


//#region: Storage (스토리지)
/**
 * @name useAllStorageDomains
 * @description 모든 스토리지 도메인 목록조회 useQuery훅
 * 
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 */
export const useAllStorageDomains = (
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.ALL_STORAGEDOMAINS],
  queryFn: async () => {
    const res = await ApiManager.findAllStorageDomains()
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllStorageDomains ... res: `, _res);
    return _res;
  }
});
// export const qpAllValidDomains = (
//   mapPredicate = (e) => ({ ...e })
// ) => useQuery({
//   // refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
//   queryKey: [QK.ALL_VALID_DOMAINS],
//   queryFn: async () => {
//     const res = await ApiManager.findAllValidStorageDomains();
//     Logger.debug('findAllValidStorageDomains raw result:', res);
//     const _res = mapPredicate
//     ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
//     : validateAPI(res) ?? [];
//     Logger.debug(`RQHook > qpAllValidDomains ...`, _res);
//     return _res;
//   },
// });
/**
 * @name useAllNfsStorageDomains
 * @description 모든 NFS 스토리지 도메인 목록조회 useQuery훅
 * 
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 */
export const useAllNfsStorageDomains = (
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.ALL_NFS_STORAGE_DOMAINS],
  queryFn: async () => {
    const res = await ApiManager.findAllNfsStorageDomains()
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllNfsStorageDomains ... res: `, _res);
    return _res;
  }
})
/**
 * @name useStorageDomain
 * @description 도메인 상세조회 useQuery 훅
 * 
 * @param {string} domainId 도메인 ID
 * @returns useQuery 훅
 */
export const useStorageDomain = (storageDomainId) => useQuery({
  queryKey: [QK.DOMAIN_BY_ID, storageDomainId],
  queryFn: async () => {
    const res = await ApiManager.findDomain(storageDomainId);
    const _res = validateAPI(res) ?? {};
    Logger.debug(`RQHook > useStorageDomain ... storageDomainId: ${storageDomainId}, res: `, _res);
    return _res;
  },
  enabled: !!storageDomainId,
  staleTime: 0,
  cacheTime: 0,
});
/**
 * @name useAllDataCentersFromDomain
 * @description 도메인 내 데이터센터 목록조회 useQuery훅
 * 
 * @param {string} storageDomainId 도메인ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllDataCentersFromDomain
 */
export const useAllDataCentersFromDomain = (
  storageDomainId,
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.ALL_DATA_CENTERS_FROM_DOMAIN, storageDomainId],
  queryFn: async () => {
    const res = await ApiManager.findAllDataCentersFromDomain(storageDomainId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllDataCentersFromDomain ... storageDomainId: ${storageDomainId}, res: `, _res);
    return _res;
  },
  enabled: !!storageDomainId,
})
/**
 * @name useAllHostsFromDomain
 * @description 도메인 내 호스트 목록조회 useQuery훅
 * 
 * @param {string} storageDomainId 도메인ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllDataCentersFromDomain
 */
export const useAllHostsFromDomain = (
  storageDomainId,
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  queryKey: [QK.ALL_HOSTS_FROM_DOMAIN, storageDomainId],
  queryFn: async () => {
    const res = await ApiManager.findAllHostsFromDomain(storageDomainId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllHostsFromDomain ... storageDomainId: ${storageDomainId}, res: `, _res);
    return _res;
  },
  enabled: !!storageDomainId,
})

/**
 * @name useAllVMsFromDomain
 * @description 도메인 내 디스크 목록조회 useQuery훅
 * 
 * @param {string} storageDomainId 도메인ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllVMsFromDomain
 */
export const useAllVMsFromDomain = (storageDomainId,
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.ALL_VMS_FROM_DOMAIN, storageDomainId],
  queryFn: async () => {
    const res = await ApiManager.findAllVMsFromDomain(storageDomainId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllVMsFromDomain ... storageDomainId: ${storageDomainId}, res: `, _res);
    return _res;
  },
  enabled: !!storageDomainId,
  staleTime: 0,
  cacheTime: 0,
})

/**
 * @name useAllUnregisteredVMsFromDomain
 * @description 도메인 내 가상머신 불러오기 목록조회 useQuery훅
 * 
 * @param {string} storageDomainId 도메인ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllUnregisterdVMsFromDomain
 */
export const useAllUnregisteredVMsFromDomain = (storageDomainId,
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.ALL_UNREGISTER_VM_FROM_DOMAIN, storageDomainId], 
  queryFn: async () => {
    const res = await ApiManager.findAllUnregisterdVMsFromDomain(storageDomainId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllUnregisteredVMsFromDomain ... storageDomainId: ${storageDomainId}, res: `, _res);
    return _res;
  },
  enabled: !!storageDomainId,
  staleTime: 0,
  cacheTime: 0,
})


/**
 * @name useRegisteredVmFromDomain
 * @description 도메인 가상머신 불러오기
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useRegisteredVmFromDomain = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async ({ storageDomainId, vmVo, partialAllow, relocation }) => {
      closeModal();
      const res = await ApiManager.registeredVmFromDomain(storageDomainId, vmVo, partialAllow, relocation);
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useRegisteredVmFromDomain ... storageDomainId: ${storageDomainId}, vmVo: ${vmVo}, partialAllow: ${partialAllow}, relocation: ${relocation}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useRegisteredVmFromDomain ... res: `, res);
      apiToast.ok(`${Localization.kr.DOMAIN} ${Localization.kr.VM} ${Localization.kr.IMPORT} 요청완료`,)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_STORAGEDOMAINS]);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_STORAGEDOMAINS]);
      postError && postError(error);
    },
  });
};

/**
 * @name useAllDisksFromDomain
 * @description 도메인 내 디스크 목록조회 useQuery훅
 * 
 * @param {string} storageDomainId 도메인ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllDataCenterFromDomain
 */
export const useAllDisksFromDomain = (storageDomainId,
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  ...QP_DEFAULT,
  queryKey: [QK.ALL_DISKS_FROM_DOMAIN, storageDomainId],
  queryFn: async () => {
    const res = await ApiManager.findAllDisksFromDomain(storageDomainId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllDisksFromDomain ... storageDomainId: ${storageDomainId}, res: `, _res);
    return _res;
  },
  enabled: !!storageDomainId,
})
/**
 * @name useAllUnregisteredDisksFromDomain
 * @description 도메인 내 디스크 가져오기 목록조회 useQuery훅
 * 
 * @param {string} storageDomainId 도메인ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllUnregisteredDisksFromDomain
 */
export const useAllUnregisteredDisksFromDomain = (storageDomainId,
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  ...QP_DEFAULT,
  queryKey: [QK.ALL_UNREGISTERED_DISKS_FROM_DOMAIN, storageDomainId],
  queryFn: async () => {
    const res = await ApiManager.findAllUnregisteredDisksFromDomain(storageDomainId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllUnregisteredDisksFromDomain ... storageDomainId: ${storageDomainId}, res: `, _res);
    return _res;
  },
  enabled: !!storageDomainId,
})

/**
 * @name useRegisteredDiskFromDomain
 * @description 도메인 디스크 불러오기
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useRegisteredDiskFromDomain = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async ({ storageDomainId, diskImageVo }) => {
      closeModal();
      const res = await ApiManager.registeredDiskFromDomain(storageDomainId, diskImageVo);
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useRegisteredDiskFromDomain ... storageDomainId: ${storageDomainId}, diskImageVo: ${diskImageVo}`);
      return _res;
    },
    onSuccess: (res,{storageDomainId}) => {
      Logger.debug(`RQHook > useRegisteredDiskFromDomain ... res: `, res);
      apiToast.ok(`${Localization.kr.DOMAIN} ${Localization.kr.DISK} ${Localization.kr.IMPORT} 요청완료`,)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_STORAGEDOMAINS]);
      queryClient.invalidateQueries(QK.ALL_DISK_PROFILES_FROM_DOMAIN, storageDomainId);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_STORAGEDOMAINS]);
      postError && postError(error);
    },
  });
};

// export const useSearchFcFromHost = (
//   hostId,
//   mapPredicate,
//   postSuccess=()=>{}, postError
// ) => useQuery({
//   refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
//   queryKey: ['searchFcFromHost', hostId],
//   queryFn: async () => {
//     const res = await ApiManager.findSearchFcFromHost(hostId);
//     const _res = mapPredicate
//       ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
//       : validateAPI(res) ?? [];
//     Logger.debug(`RQHook > useSearchFcFromHost ... hostId: ${hostId}, res: `, _res);
//     return _res; // 데이터 가공 후 반환
//   },
//   enabled: !!hostId,
// });
/**
 * @name useDeletRegisteredDiskFromDomain
 * @description 도메인 디스크 불러오기 삭제
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useDeletRegisteredDiskFromDomain = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async ({ storageDomainId, diskId }) => {
      closeModal();
      const res = await ApiManager.deleteRegisteredDiskFromDomain(storageDomainId, diskId);
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useDeletRegisteredDiskFromDomain ... storageDomainId: ${storageDomainId}, diskId: ${diskId}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useDeletRegisteredDiskFromDomain ... res: `, res);
      apiToast.ok(`${Localization.kr.DOMAIN} ${Localization.kr.DISK} ${Localization.kr.IMPORT} ${Localization.kr.REMOVE} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_STORAGEDOMAINS]);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_STORAGEDOMAINS]);
      postError && postError(error);
    },
  });
};
/**
 * @name useAllTemplatesFromDomain
 * @description 도메인 내 템플릿 목록조회 useQuery훅
 * 
 * @param {string} storageDomainId 도메인ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllTemplatesFromDomain
 */
export const useAllTemplatesFromDomain = (
  storageDomainId,
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.ALL_TEMPLATES_FROM_DOMAIN, storageDomainId],
  queryFn: async () => {
    const res = await ApiManager.findAllTemplatesFromDomain(storageDomainId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllTemplatesFromDomain ... storageDomainId: ${storageDomainId}, res: `, _res);
    return _res;
  },
  enabled: !!storageDomainId,
})
/**
 * @name useAllUnregisteredTemplatesFromDomain
 * @description 도메인 내 템플릿 불러오기 목록조회 useQuery훅
 * 
 * @param {string} storageDomainId 도메인ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllUnregisteredTemplatesFromDomain
 */
export const useAllUnregisteredTemplatesFromDomain = (
  storageDomainId,
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.ALL_UNREGISTERED_TEMPLATES_FROM_DOMAIN, storageDomainId],
  queryFn: async () => {
    const res = await ApiManager.findAllUnregisteredTemplatesFromDomain(storageDomainId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllUnregisteredTemplatesFromDomain ... storageDomainId: ${storageDomainId}, res: `, _res);
    return _res;
  },
  enabled: !!storageDomainId,
})


/**
 * @name qpAllDiskProfilesFromDomain
 * @description 도메인 내 디스크 프로파일 목록조회 useQuery훅
 * 
 * @param {string} storageDomainId 도메인ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllDiskProfilesFromDomain
 */
export const qpAllDiskProfilesFromDomain = (
  storageDomainId,
  mapPredicate = (e) => ({ ...e })
) => ({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.ALL_DISK_PROFILES_FROM_DOMAIN, storageDomainId],
  queryFn: async () => {
    const res = await ApiManager.findAllDiskProfilesFromDomain(storageDomainId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllDiskProfilesFromDomain ... storageDomainId: ${storageDomainId}, res: `, _res);
    return _res;
  },
  enabled: !!storageDomainId, // storageDomainId가 있을 때만 쿼리 실행
});
/**
 * @name useAllDiskProfilesFromDomain
 * @description 도메인 내 디스크 프로파일 목록조회 useQuery훅
 * 
 * @param {string} storageDomainId 도메인ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllDiskProfilesFromDomain
 */
export const useAllDiskProfilesFromDomain = (
  storageDomainId,
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  ...qpAllDiskProfilesFromDomain(storageDomainId, mapPredicate)
});

/**
 * @name useAllDiskProfilesFromDomain4EachDomain
 * @description 도메인 내 디스크 프로파일 목록조회 useQueries훅
 * 
 * @param {*} domains 도메인 목록
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQueries훅
 * 
 * @see ApiManager.findAllDiskProfilesFromDomain
 */
export const useAllDiskProfilesFromDomain4EachDomain = (
  domains=[],
  mapPredicate = (e) => ({ ...e })
) => useQueries({
  queries: [...domains]?.map((d, i) => {
    Logger.debug(`RQHook > useAllDiskProfilesFromDomain4EachDomain ... d: `, d);
    return {
      ...qpAllDiskProfilesFromDomain(d?.id, mapPredicate),
    }
  })
});



/**
 * @name useAllDiskSnapshotsFromDomain
 * @description 도메인 내 디스크스냅샷 목록조회 useQuery훅
 * 
 * @param {string} storageDomainId 도메인ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllDataCenterFromDomain
 */
export const useAllDiskSnapshotsFromDomain = (
  storageDomainId,
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.ALL_DISK_SNAPSHOT_FROM_DOMAIN, storageDomainId],
  queryFn: async () => {
    const res = await ApiManager.findAllDiskSnapshotsFromDomain(storageDomainId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllDiskSnapshotsFromDomain ... storageDomainId: ${storageDomainId}, res: `, _res);
    return _res;
  },
  enabled: !!storageDomainId,
  staleTime: 0,
  cacheTime: 0,
})
/**
 * @name useAllActiveDataCenters
 * @description 데이터센터 목록조회 useQuery훅
 * 
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findActiveDataCenters
 */
export const useAllActiveDataCenters = (
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.ALL_ACTIVE_DATA_CENTERS],
  queryFn: async () => {
    const res = await ApiManager.findActiveDataCenters();
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllActiveDataCenters ... res: `, _res);
    return _res;
  }
})

/**
 * @name useAddDomain
 * @description 도메인 생성 useMutation 훅(수정해야됨)
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useAddDomain = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async (domainData) => {
      closeModal();
      const res = await ApiManager.addDomain(domainData);
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useAddDomain ... domainData: ${JSON.stringify(domainData, null, 2)}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useAddDomain ... res: `, res);
      apiToast.ok(`${Localization.kr.DOMAIN} ${Localization.kr.CREATE} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_STORAGEDOMAINS]);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_STORAGEDOMAINS]);
      postError && postError(error);
    },
  });
};

/**
 * @name useImportDomain
 * @description 도메인 가져오기 useMutation 훅(수정해야됨)
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useImportDomain = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async (domainData) => {
      closeModal();
      const res = await ApiManager.importDomain(domainData)
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useImportDomain ... domainData: ${JSON.stringify(domainData, null, 2)}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useImportDomain ... res: `, res);
      apiToast.ok(`${Localization.kr.DOMAIN} ${Localization.kr.IMPORT} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_STORAGEDOMAINS, QK.DOMAINS_FROM_DATA_CENTER]);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_STORAGEDOMAINS, QK.DOMAINS_FROM_DATA_CENTER]);
      postError && postError(error);
    },
  });
};
/**
 * @name useEditDomain
 * @description 도메인 수정 useMutation 훅(수정해야됨)
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useEditDomain = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient()
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async ({ domainId, domainData }) => {
      closeModal();
      const res = await ApiManager.editDomain(domainId, domainData)
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useEditDomain ... domainId: ${domainId}, domainData: ${JSON.stringify(domainData, null, 2)}`);
      return _res;
    },
    onSuccess: (res, { domainId }) => {
      Logger.debug(`RQHook > useEditDomain ... res: `, res);
      apiToast.ok(`${Localization.kr.DOMAIN} ${Localization.kr.UPDATE} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_STORAGEDOMAINS, QK.DOMAINS_FROM_DATA_CENTER]);
      queryClient.invalidateQueries(QK.DOMAIN_BY_ID, domainId);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_STORAGEDOMAINS, QK.DOMAINS_FROM_DATA_CENTER]);
      queryClient.invalidateQueries(QK.DOMAIN_BY_ID, domainId);
      postError && postError(error);
    },
  });
};

/**
 * @name useDeleteDomain
 * @description 도메인 삭제 useMutation 훅(확인안해봄-생성해보고 삭제해보기)
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useDeleteDomain = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async ({ domainId, format, hostName }) => {
      closeModal();
      const res = await ApiManager.deleteDomain(domainId, format, hostName);
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useDeleteDomain ... domainId: ${domainId}, format: ${format}, hostName: ${hostName}`);
      return _res;
    },
    onSuccess: (res, { domainId }) => {
      Logger.debug(`RQHook > useDeleteDomain ... res: `, res);
      apiToast.ok(`${Localization.kr.DOMAIN} ${Localization.kr.REMOVE} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_STORAGEDOMAINS, QK.DOMAINS_FROM_DATA_CENTER]);
      queryClient.removeQueries(QK.DOMAIN_BY_ID, domainId);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_STORAGEDOMAINS, QK.DOMAINS_FROM_DATA_CENTER]);
      postError && postError(error);
    },
  });
};

/**
 * @name useDestroyDomain
 * @description 도메인파괴 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useDestroyDomain = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async (storageDomainId) => {
      closeModal();
      const res = await ApiManager.destroyDomain(storageDomainId);
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useDestroyDomain ... storageDomainId: ${storageDomainId}`);
      return _res;
    },
    onSuccess: (res, { domainId }) => {
      Logger.debug(`RQHook > useDestroyDomain ... res: `, res);
      apiToast.ok(`${Localization.kr.DOMAIN} ${Localization.kr.DESTROY} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_STORAGEDOMAINS, QK.DOMAINS_FROM_DATA_CENTER]);
      queryClient.removeQueries(QK.DOMAIN_BY_ID, domainId);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_STORAGEDOMAINS, QK.DOMAINS_FROM_DATA_CENTER]);
      postError && postError(error);
    },
  });
};

/**
 * @name useRefreshLunDomain
 * @description 스토리지 도메인 디스크 검사 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useRefreshLunDomain = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async (domainId) => {
      closeModal();
      const res = await ApiManager.refreshLunDomain(domainId);
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useRefreshLunDomain ... domainId: ${domainId}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useRefreshLunDomain ... res: `, res);
      apiToast.ok(`${Localization.kr.DOMAIN} ${Localization.kr.DISK} 검사 ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_STORAGEDOMAINS, QK.DOMAINS_FROM_DATA_CENTER]);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_STORAGEDOMAINS, QK.DOMAINS_FROM_DATA_CENTER]);
      postError && postError(error);
    },
  });
};

/**
 * @name useOvfUpdateDomain
 * @description 스토리지 도메인 ovf 업데이트 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useOvfUpdateDomain = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async (domainId) => {
      closeModal();
      const res = await ApiManager.updateOvfDomain(domainId);
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useOvfUpdateDomain ... domainId: ${domainId}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useOvfUpdateDomain ... res: `, res);
      apiToast.ok(`${Localization.kr.DOMAIN} ${Localization.kr.DISK} ovf ${Localization.kr.UPDATE} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_STORAGEDOMAINS, QK.DOMAINS_FROM_DATA_CENTER]);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_STORAGEDOMAINS, QK.DOMAINS_FROM_DATA_CENTER]);
      postError && postError(error);
    },
  });
};

/**
 * @name useActivateDomain
 * @description 도메인 활성 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useActivateDomain = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async ({ domainId, dataCenterId }) => {
      closeModal();
      const res = await ApiManager.activateDomain(domainId, dataCenterId);
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useActivateDomain ... domainId: ${domainId}, dataCenterId: ${dataCenterId}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useActivateDomain ... res: `, res);
      apiToast.ok(`${Localization.kr.DOMAIN} ${Localization.kr.ACTIVATE} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_STORAGEDOMAINS, QK.DOMAINS_FROM_DATA_CENTER]);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_STORAGEDOMAINS, QK.DOMAINS_FROM_DATA_CENTER]);
      postError && postError(error);
    },
  });
};

/**
 * @name useAttachDomain
 * @description 도메인 연결 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useAttachDomain = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient()
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async ({ storageDomainId, dataCenterId }) => {
      closeModal();
      const res = await ApiManager.attachDomain(storageDomainId, dataCenterId);
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useActivateDomain ... storageDomainId: ${storageDomainId}, dataCenterId: ${dataCenterId}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useAttachDomain ... res: `, res);
      apiToast.ok(`${Localization.kr.DOMAIN} ${Localization.kr.ATTACH} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_STORAGEDOMAINS, QK.DOMAINS_FROM_DATA_CENTER]);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_STORAGEDOMAINS, QK.DOMAINS_FROM_DATA_CENTER]);
      postError && postError(error);
    },
  });
};

/**
 * @name useDetachDomain
 * @description 도메인 분리 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useDetachDomain = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient()
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async ({ domainId, dataCenterId }) => {
      closeModal();
      const res = await ApiManager.detachDomain(domainId, dataCenterId);
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useActivateDomain ... domainId: ${domainId}, dataCenterId: ${dataCenterId}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useDetachDomain ... res: `, res);
      apiToast.ok(`${Localization.kr.DOMAIN} ${Localization.kr.DETACH} ${Localization.kr.REQ_COMPLETE}`);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_STORAGEDOMAINS, QK.DOMAINS_FROM_DATA_CENTER]);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_STORAGEDOMAINS, QK.DOMAINS_FROM_DATA_CENTER]);
      postError && postError(error);
    },
  });
};

/**
 * @name useMaintenanceDomain
 * @description 도메인 유지보수 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useMaintenanceDomain = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient()
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async ({ domainId, dataCenterId, ovf }) => {
      closeModal();
      const res = await ApiManager.maintenanceDomain(domainId, dataCenterId, ovf);
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useMaintenanceDomain ... domainId: ${domainId}, dataCenterId: ${dataCenterId} ovf: ${ovf}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useMaintenanceDomain ... res: `, res);
      apiToast.ok(`${Localization.kr.DOMAIN} ${Localization.kr.MAINTENANCE} ${Localization.kr.REQ_COMPLETE}`);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_STORAGEDOMAINS, QK.DOMAINS_FROM_DATA_CENTER]);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_STORAGEDOMAINS, QK.DOMAINS_FROM_DATA_CENTER]);
      postError && postError(error);
    },
  });
};
//#endregion

//#region: Disk (디스크)
/**
 * @name useAllDisks
 * @description 모든 디스크목록조회 useQuery훅
 * 
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 */
export const useAllDisks = (
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  ...QP_DEFAULT,
  queryKey: [QK.ALL_DISKS],
  queryFn: async () => {
    const res = await ApiManager.findAllDisks()
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllDisks ... res: `, _res);
    return _res;
  },
  // staleTime: 2000, // 2초 동안 데이터 재요청 방지
})
export const useCdromsDisks = (
  diskIds = []
) => useQuery({
  ...QP_DEFAULT,
  queryKey: [QK.CDROMS_FOR_DISKS, diskIds],
  queryFn: async () => {
    const res = await Promise.all(
      diskIds.map((id) => ApiManager.findCdromsDisk(id))
    );
    return res.map((r, idx) => ({
      diskId: diskIds[idx],
      cdroms: validateAPI(r) ?? [],
    }));
  },
  enabled: diskIds.length > 0,
});

/**
 * @name useDisk
 * @description 디스크 상세조회 useQuery 훅
 * 
 * @param {string} diskId 디스크ID
 * @returns useQuery 훅
 */
export const useDisk = (
  diskId
) => useQuery({
  queryKey: [QK.DISK, diskId],
  queryFn: async () => {
    const res = await ApiManager.findDisk(diskId);
    const _res = validateAPI(res) ?? {};
    Logger.debug(`RQHook > useDisk ... diskId: ${diskId}, res: `, _res);
    return _res;
  },
  enabled: !!diskId,
  staleTime: 0,
  cacheTime: 0,
});
/**
 * @name useAllVmsFromDisk
 * @description 디스크 내 가상머신 목록조회 useQuery훅
 * 
 * @param {string} diskId 디스크ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllVmsFromDisk
 */
export const useAllVmsFromDisk = (
  diskId,
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.ALL_VMS_FROM_DISK, diskId],
  queryFn: async () => {
    const res = await ApiManager.findAllVmsFromDisk(diskId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllDisks ... diskId: ${diskId}, res: `, _res);
    return _res;
  },
  enabled: !!diskId,
})

/**
 * @name useAllStorageDomainsFromDisk
 * @description 디스크 내 스토리지 목록조회 useQuery훅
 * 
 * @param {string} diskId 디스크ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllStorageDomainsFromDisk
 */
export const useAllStorageDomainsFromDisk = (
  diskId,
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  ...QP_DEFAULT,
  queryKey: [QK.ALL_STORAGE_DOMAINS_FROM_DISK, diskId],
  queryFn: async () => {
    const res = await ApiManager.findAllStorageDomainsFromDisk(diskId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllStorageDomainsFromDisk ... diskId: ${diskId}, res: `, _res);
    return _res;
  },
  enabled: !!diskId,
})

/**
 * @name qpAllStorageDomainsToMoveFromDisk
 * @description 디스크 이동할수 있는 스토리지 도메인 목록조회 useQuery훅
 * 
 * @param {string} diskId 디스크 ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllStorageDomainsToMoveFromDisk
 */
export const qpAllStorageDomainsToMoveFromDisk = (
  diskId,
  mapPredicate = (e) => ({ ...e })
) => ({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: ['allStorageDomainsToMoveFromDisk', diskId],
  queryFn: async () => {
    const res = await ApiManager.findAllStorageDomainsToMoveFromDisk(diskId);
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > qpAllStorageDomainsToMoveFromDisk ... diskId: ${diskId}, res: `, _res);
    return _res;
  },
  enabled: !!diskId, // diskId 있을 때만 쿼리 실행
});
/**
 * @name useAllStorageDomainsToMoveFromDisk
 * @description 디스크 이동할수 있는 스토리지 도메인 목록조회 useQuery훅
 * 
 * @param {string} diskId 디스크 ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllStorageDomainsToMoveFromDisk
 */
export const useAllStorageDomainsToMoveFromDisk = (
  diskId,
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  ...qpAllStorageDomainsToMoveFromDisk(diskId, mapPredicate)
});

/**
 * @name useAllStorageDomainsToMoveFromDisk4EachDisk
 * @description 디스크 이동할수 있는 스토리지 도메인 목록조회 useQueries훅
 * 
 * @param {*} disks 디스크 목록
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQueries훅
 * 
 * @see ApiManager.findAllStorageDomainsToMoveFromDisk
 */
export const useAllStorageDomainsToMoveFromDisk4EachDisk = (
  disks=[],
  mapPredicate = (e) => ({ ...e })
) => useQueries({
  queries: [...disks]?.map((d, i) => {
    Logger.debug(`RQHook > useAllStorageDomainsToMoveFromDisk4EachDisk ... d: `, d);
    return {
      ...qpAllStorageDomainsToMoveFromDisk(d?.id, mapPredicate),
    }
  })
});


/**
 * @name useAddDisk
 * @description Disk 생성 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useAddDisk = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async (diskData) => {
      closeModal();
      const res = await ApiManager.addDisk(diskData);
      const _res = validateAPI(res) ?? {};
      Logger.debug(`RQHook > useAddDisk ... diskData: ${JSON.stringify(diskData, null, 2)}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useAddDisk ... res: `, res);
      apiToast.ok(`${Localization.kr.DISK} ${Localization.kr.CREATE} ${Localization.kr.REQ_COMPLETE}`);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_DISKS]);      
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_DISKS]);
      postError && postError(error);
    },
  });
};
/**
 * @name useEditDisk
 * @description Disk 수정 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useEditDisk = (
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async ({ diskId, diskData }) => {
      closeModal();
      const res = await ApiManager.editDisk(diskId, diskData);
      const _res = validateAPI(res) ?? {};
      Logger.debug(`RQHook > useEditDisk ... diskId: ${diskId}, diskData: ${JSON.stringify(diskData, null, 2)}`);
      return _res;
    },
    onSuccess: (res, { diskId }) => {
      Logger.debug(`RQHook > useEditDisk ... res: `, res);
      apiToast.ok(`${Localization.kr.DISK} ${Localization.kr.UPDATE} ${Localization.kr.REQ_COMPLETE}`);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_DISKS]);
      queryClient.invalidateQueries(QK.DISK, diskId);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_DISKS]);
      queryClient.invalidateQueries(QK.DISK, diskId);
      postError && postError(error);
    },
  });
};
/**
 * @name useDeleteDisk
 * @description Disk 삭제 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useDeleteDisk = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { domainsSelected } = useGlobal();
  const { apiToast } = useApiToast();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (diskId) => {
      closeModal();
      const res = await ApiManager.deleteDisk(diskId);
      const _res = validateAPI(res) ?? {};
      Logger.debug(`RQHook > useDeleteDisk ... diskId: ${diskId}`);
      return _res;
    },
    onSuccess: (res, { diskId }) => {
      Logger.debug(`RQHook > useDeleteDisk ... res: `, res);
      apiToast.ok(`${Localization.kr.DISK} ${Localization.kr.REMOVE} ${Localization.kr.REQ_COMPLETE}`);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_DISKS]);
      queryClient.removeQueries(QK.DISK, diskId);
      queryClient.removeQueries(QK.ALL_STORAGE_DOMAINS_FROM_DISK, diskId);
      const domainId = domainsSelected[0]?.id
      navigate(domainId ? `/storages/domains/${domainId}/disks` : `/storages/disks`)
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_DISKS]);
      postError && postError(error);
    },
  });
};
/**
 * @name useUploadDisk
 * @description Disk 업로드 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useUploadDisk = (
  inProgress=()=>{},postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async (diskData) => {
      closeModal();
      const res = await ApiManager.uploadDisk(diskData, inProgress);
      Logger.debug(`RQHook > useUploadDisk ... diskData: ${JSON.stringify(diskData, null, 2)}`);
      return res;
    },
    onSuccess: (res, { diskData }) => {
      Logger.debug(`RQHook > useUploadDisk ... res: `, res);
      apiToast.ok(`${Localization.kr.DISK} ${Localization.kr.UPLOAD} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_DISKS]);
      queryClient.invalidateQueries(QK.DISK, diskData.id); 
      postSuccess(res);
    },
    onError: (error, { diskData }) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_DISKS]);
      queryClient.invalidateQueries(QK.DISK, diskData.id); 
      postError && postError(error);
    },
  });
};
/**
 * @name useCancelImageTransfer4Disk
 * @description 이미지 전송 취소 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useCancelImageTransfer4Disk = (
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async (diskId) => {
      closeModal();
      const res = await ApiManager.cancelImageTransfer4Disk(diskId);
      Logger.debug(`RQHook > useCancelImageTransfer4Disk ... diskId: ${diskId}`);
      return res;
    },
    onSuccess: (res, { diskId }) => {
      Logger.debug(`RQHook > useCancelImageTransfer4Disk ... res: `, res);
      apiToast.ok(`${Localization.kr.IMAGE_TRANSFER} ${Localization.kr.CANCEL} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_DISKS]);
      queryClient.invalidateQueries(QK.DISK, diskId); 
      postSuccess(res);
    },
    onError: (error, { diskId }) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_DISKS]);
      queryClient.invalidateQueries(QK.DISK, diskId); 
      postError && postError(error);
    },
  });
};
/**
 * @name usePauseImageTransfer4Disk
 * @description 이미지 전송 일시정지 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const usePauseImageTransfer4Disk = (
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async (diskId) => {
      closeModal();
      const res = await ApiManager.pauseImageTransfer4Disk(diskId);
      Logger.debug(`RQHook > usePauseImageTransfer4Disk ... diskId: ${diskId}`);
      return res;
    },
    onSuccess: (res, { diskId }) => {
      Logger.debug(`RQHook > usePauseImageTransfer4Disk ... res: `, res);
      apiToast.ok(`${Localization.kr.IMAGE_TRANSFER} ${Localization.kr.PAUSE} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_DISKS]);
      queryClient.invalidateQueries(QK.DISK, diskId); 
      postSuccess(res);
    },
    onError: (error, { diskId }) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_DISKS]);
      queryClient.invalidateQueries(QK.DISK, diskId); 
      postError && postError(error);
    },
  });
};
/**
 * @name useResumeImageTransfer4Disk
 * @description 이미지 전송 재개 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useResumeImageTransfer4Disk = (
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async (diskId) => {
      closeModal();
      const res = await ApiManager.resumeImageTransfer4Disk(diskId);
      Logger.debug(`RQHook > useResumeImageTransfer4Disk ... diskId: ${diskId}`);
      return res;
    },
    onSuccess: (res, { diskId }) => {
      Logger.debug(`RQHook > useResumeImageTransfer4Disk ... res: `, res);
      apiToast.ok(`${Localization.kr.IMAGE_TRANSFER} ${Localization.kr.RESUME} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_DISKS]);
      queryClient.invalidateQueries(QK.DISK, diskId); 
      postSuccess(res);
    },
    onError: (error, { diskId }) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_DISKS]);
      queryClient.invalidateQueries(QK.DISK, diskId); 
      postError && postError(error);
    },
  });
};
/**
 * @name useMoveDisk
 * @description Disk 이동 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useMoveDisk = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async ({ diskId, storageDomainId }) => {
      closeModal();
      const res = await ApiManager.moveDisk(diskId, storageDomainId)
      const _res = validateAPI(res) ?? {};
      // Logger.debug(`RQHook > useMoveDisk ... diskData: ${JSON.stringify(diskId, storageDomainId, null, 2)}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useMoveDisk ... res: `, res);
      apiToast.ok(`${Localization.kr.DISK} ${Localization.kr.MOVE} ${Localization.kr.REQ_COMPLETE}`);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_DISKS]);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_DISKS]);
      postError && postError(error);
    },
  });
};
/**
 * @name useCopyDisk
 * @description Disk 복사 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useCopyDisk = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async ({ diskId, diskImage }) => {
      closeModal();
      const res = await ApiManager.copyDisk(diskId, diskImage)
      const _res = validateAPI(res) ?? {};
      Logger.debug(`RQHook > useCopyDisk ... diskImage: ${JSON.stringify(diskImage, null, 2)}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useCopyDisk ... res: `, res);
      apiToast.ok(`${Localization.kr.DISK} ${Localization.kr.COPY} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_DISKS]);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_DISKS]);
      postError && postError(error);
    },
  });
};


//#region: event (이벤트)
/**
 * @name useAllEvents
 * @description 모든 이벤트 목록조회 useQuery훅
 * 
 * @param {number} page 페이지 인덱스 번호 (0부터 시작)
 * @param {number} size 단일 쿼리 총 조회결과 개수
 * @param {string} minSeverity 이벤트 심각도 (normal, alert, ...)
 * @param {string} startDate 조회범위 시작시간 (YYYYMMDD)
 * @param {function} mapPredicate 
 * @returns useQuery훅
 */
export const useAllEvents = ({
  page = null, size = null, minSeverity = null, startDate = null,
  mapPredicate = (e) => ({ ...e })
}) => useQuery({
  ...QP_DEFAULT,
  refetchInterval: DEFAULT_CACHE_TIME,
  queryKey: [QK.ALL_EVENTS, page],
  queryFn: async () => {
    const res = await ApiManager.findAllEvents(page, size, minSeverity, startDate)
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllEvents ... res: `, _res);
    return _res;
  },
  keepPreviousData: true,
});

/**
 * @name useAllEventsFromDataCenter
 * @description 데이터센터 내 이벤트 목록조회 useQuery훅
 * 
 * @param {number} page 페이지 인덱스 번호 (0부터 시작)
 * @param {number} size 단일 쿼리 총 조회결과 개수
 * @param {string} datacenterId 데이터센터ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllEvents
 */
export const useAllEventsFromDataCenter = ({
  page=null, size=null, datacenterId,
  mapPredicate = (e) => ({ ...e })
}) => useQuery({
  ...QP_DEFAULT,
  queryKey: [QK.EVENTS_FROM_DATA_CENTER, datacenterId],
  queryFn: async () => {
    const res = await ApiManager.findAllEvents({ page, size, datacenterId });
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllEventsFromDataCenter ... datacenterId: ${datacenterId}, res: `, _res);
    return _res;
  }
});

/**
 * @name useAllEventsFromCluster
 * @description 클러스터 내 이벤트 목록조회 useQuery훅
 * 
 * @param {number} page 페이지 인덱스 번호 (0부터 시작)
 * @param {number} size 단일 쿼리 총 조회결과 개수
 * @param {string} clusterId 클러스터ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllEvents
 */
export const useAllEventsFromCluster = ({
  page=null, size=null, clusterId,
  mapPredicate = (e) => ({ ...e })
}) => useQuery({
  ...QP_DEFAULT,
  queryKey: [QK.EVENTS_FROM_CLUSTER, clusterId],
  queryFn: async () => {
    const res = await ApiManager.findAllEvents({ page, size, clusterId });
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllEventsFromCluster ... clusterId: ${clusterId}, res: `, _res);
    return _res
  },
  enabled: !!clusterId,
})

/**
 * @name useAllEventsFromHost
 * @description 호스트 내 이벤트 목록조회 useQuery훅
 * 
 * @param {number} page 페이지 인덱스 번호 (0부터 시작)
 * @param {number} size 단일 쿼리 총 조회결과 개수
 * @param {string} hostId 호스트ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllEvents
 */
export const useAllEventsFromHost = ({
  page=null, size=null, hostId,
  mapPredicate = (e) => ({ ...e })
}) => useQuery({
  ...QP_DEFAULT,
  queryKey: [QK.ALL_EVENTS_FROM_HOST, hostId],
  queryFn: async () => {
    const res = await ApiManager.findAllEvents({ page, size, hostId });
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllEventsFromHost ... hostId: ${hostId}, res: `, _res);
    return _res
  },
  enabled: !!hostId
})

/**
 * @name useAllEventFromVM
 * @description 가상머신 내 이벤트 목록조회 useQuery훅
 * 
 * @param {number} page 페이지 인덱스 번호 (0부터 시작)
 * @param {number} size 단일 쿼리 총 조회결과 개수
 * @param {string} vmId 가상머신ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllEvents
 */
export const useAllEventsFromVM = ({
  page=null, size=null, vmId,
  mapPredicate = (e) => ({ ...e })
}) => useQuery({
  ...QP_DEFAULT,
  queryKey: [QK.EVENTS_FROM_VM, vmId],
  queryFn: async () => {
    const res = await ApiManager.findAllEvents({ page, size, vmId });
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllEventsFromVM ... vmId: ${vmId}, res: `, _res);
    return _res;
  },
  enabled: !!vmId
})

/**
 * @name useAllEventsFromDomain
 * @description 도메인 내 이벤트 목록조회 useQuery훅
 * 
 * @param {number} page 페이지 인덱스 번호 (0부터 시작)
 * @param {number} size 단일 쿼리 총 조회결과 개수
 * @param {string} storageDomainId 도메인ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllEvents
 */
export const useAllEventsFromDomain = ({
  page=null, size=null, storageDomainId,
  mapPredicate = (e) => ({ ...e })
}) => useQuery({
  ...QP_DEFAULT,
  queryKey: [QK.EVENTS_FROM_DOMAIN, storageDomainId],
  queryFn: async () => {
    const res = await ApiManager.findAllEvents({ page, size, storageDomainId });
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllEventsFromDomain ... storageDomainId: ${storageDomainId}, res: `, _res);
    return _res;
  },
  enabled: !!storageDomainId,
})

/**
 * @name useAllEventsFromTemplate
 * @description  탬플릿 내 이벤트 목록조회 useQuery훅
 * 
 * @param {number} page 페이지 인덱스 번호 (0부터 시작)
 * @param {number} size 단일 쿼리 총 조회결과 개수
 * @param {string} templateId 탬플릿 ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllEvents
 */
export const useAllEventsFromTemplate = ({
  page=null, size=null, templateId,
  mapPredicate = (e) => ({ ...e })
}) => useQuery({
  ...QP_DEFAULT,
  queryKey: [QK.EVENTS_FROM_TEMPLATE, templateId],
  queryFn: async () => {
    const res = await ApiManager.findAllEvents({ page, size, templateId });
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? []
      : validateAPI(res) ?? []
    Logger.debug(`RQHook > useAllEventsFromTemplate ... templateId: ${templateId}, res: `, _res);
    return _res;
  },
  enabled: !!templateId,
})

/**
 * @name useAllEventsNormal
 * @description 박스 안 정상 이벤트 목록조회 useQuery훅
 * 
 * @param {function} mapPredicate 
 * @returns useQuery훅
 */
export const useAllEventsNormal = (
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  ...QP_DEFAULT,
  queryKey: [QK.ALL_EVENTS_NORMAL],
  queryFn: async () => {
    const res = await ApiManager.findAllEvents({
      page: 0, size: 100
    })
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllEventsNormal ... res: `, _res);
    return _res;
  }
});

export const useAllEventsAlert = (
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  ...QP_DEFAULT,
  queryKey: [QK.ALL_NOTI_EVENTS],
  queryFn: async () => {
    const res = await ApiManager.findAllEvents({
      page: 0, size: 20, minSeverity: "alert", startDate: "recent",
    })
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllEventsAlert ... res: `, _res);
    return _res;
  }
});

export const useRemoveEvent = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient() 
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
  return useMutation({
    mutationFn: async (eventId) => {
      closeModal();
      const res = await ApiManager.removeEvent(eventId)
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useRemoveEvent ... eventId: ${eventId}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useRemoveEvent ... res: `, res);
      apiToast.ok(`${Localization.kr.EVENT} ${Localization.kr.REMOVE} ${Localization.kr.REQ_COMPLETE}`)
      queryClient.invalidateQueries([QK.DASHBOARD, QK.ALL_EVENTS, QK.ALL_NOTI_EVENTS , QK.ALL_EVENTS_NORMAL]);
      closeModal();
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      closeModal();
      postError && postError(error);
    },
  })
}

export const useRemoveEvents = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient()
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async (eventIds = []) => {
      closeModal();
      const res = await ApiManager.removeEvents({ eventIds });
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useRemoveEvents ... eventIds: ${eventIds}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useRemoveEvents ... res: `, res);
      apiToast.ok(`${Localization.kr.EVENT} ${Localization.kr.REMOVE} ${Localization.kr.REQ_COMPLETE}`)
      queryClient.invalidateQueries([QK.DASHBOARD, QK.ALL_EVENTS, QK.ALL_NOTI_EVENTS , QK.ALL_EVENTS_NORMAL]);
      closeModal();
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      closeModal();
      postError && postError(error);
    },
  })
}
//#endregion: event

//#region: job
export const useAllJobs = (
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  ...QP_DEFAULT,
  queryKey: [QK.ALL_JOBS],
  queryFn: async () => {
    const res = await ApiManager.findAllJobs()
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllJobs ... res: `, _res);
    return _res;
  }
})

/**
 * @name useJob
 * @description 작업 상세조회 useQuery훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useJob = (
  jobId,
) => useQuery({
  ...QP_DEFAULT,
  queryKey: [QK.JOB, jobId],
  queryFn: async () => {
    const res = await ApiManager.findJob(jobId)
    const _res = validateAPI(res) ?? {}
    Logger.debug(`RQHook > useJob ... jobId: ${jobId}, res: `, _res);
    return _res;
  },
  enabled: !!jobId
});

/**
 * @name useAddJob
 * @description 작업 생성 useQuery훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useAddJob = (
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient()
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
  return useMutation({
    mutationFn: async (job) => {
      closeModal();
      const res = await ApiManager.addJob(job)
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useAddJob ... job: ${JSON.stringify(job, null, 2)}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useAddJob ... res: `, res);
      apiToast.ok(`${Localization.kr.JOB} ${Localization.kr.CREATE} ${Localization.kr.REQ_COMPLETE}`)
      queryClient.invalidateQueries(QK.ALL_JOBS);      
      closeModal();
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      queryClient.invalidateQueries(QK.ALL_JOBS);      
      closeModal();
      postError && postError(error);
    },
  })
}

/**
 * @name useEndJob
 * @description 작업 종료 useQuery훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useEndJob = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient()
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async ({ jobId }) => {
      closeModal();
      const res = await ApiManager.endJob(jobId)
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useEndJob ... jobId: ${jobId}`);
      return _res;
    },
    onSuccess: (res, { jobId }) => {
      Logger.debug(`RQHook > useEndJob ... res: `, res);
      apiToast.ok(`${Localization.kr.JOB} ${Localization.kr.END} ${Localization.kr.REQ_COMPLETE}`)
      queryClient.invalidateQueries(QK.ALL_JOBS);
      queryClient.invalidateQueries(QK.JOB, jobId); // 수정된 네트워크 상세 정보 업데이트
      closeModal();
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      queryClient.invalidateQueries(QK.ALL_JOBS);
      closeModal();
      postError && postError(error);
    },
  })
}

/**
 * @name useRemoveJob
 * @description 작업 제거 useQuery훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useRemoveJob = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient()
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async (jobId) => {
      closeModal();
      const res = await ApiManager.removeJob(jobId)
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useRemoveJob ... jobId: ${jobId}`);
      return _res;
    },
    onSuccess: (res, { jobId }) => {
      Logger.debug(`RQHook > useRemoveJob ... res: `, res);
      apiToast.ok(`${Localization.kr.JOB} ${Localization.kr.REMOVE} ${Localization.kr.REQ_COMPLETE}`)
      queryClient.invalidateQueries(QK.ALL_JOBS);
      queryClient.removeQueries(QK.JOB, jobId); // 수정된 네트워크 상세 정보 업데이트
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      queryClient.invalidateQueries(QK.ALL_JOBS);
      queryClient.removeQueries(QK.JOB, jobId); // 수정된 네트워크 상세 정보 업데이트
      postError && postError(error);
    },
  })
}

/**
 * @name removeJobs
 * @description 작업 제거 useQuery훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useRemoveJobs = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient()
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async (jobIds) => {
      closeModal();
      const res = await ApiManager.removeJob(jobIds)
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > removeJobs ... jobIds: ${jobIds}`);
      return _res;
    },
    onSuccess: (res, { jobIds }) => {
      Logger.debug(`RQHook > removeJobs ... res: `, res);
      apiToast.ok(`${Localization.kr.JOB} 일괄${Localization.kr.REMOVE} ${Localization.kr.REQ_COMPLETE}`)
      queryClient.invalidateQueries(QK.ALL_JOBS);
      closeModal();
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      closeModal();
      postError && postError(error);
    },
  })
}
//#endregion: job


//#region: Provider
/**
 * @name useAllProviders
 * @description 모든 공급자 목록조회 useQuery훅
 * 
 * @param {function} mapPredicate 
 * @returns useQuery훅
 */
export const useAllProviders = (
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  ...QP_DEFAULT,
  queryKey: [QK.ALL_PROVIDERS],
  queryFn: async () => {
    const res = await ApiManager.findAllProviders();
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllProviders ... res: `, _res);
    return _res;
  }
})
/**
 * @name useProvider
 * @description 공급자 상세조회 useQuery훅
 * 
 * @param {string} providerId 공급자 oVirt ID
 * @returns useQuery훅
 */
export const useProvider = (
  providerId,
) => useQuery({
  ...QP_DEFAULT,
  queryKey: [QK.PROVIDER, providerId], 
  queryFn: async () => {
    const res = await ApiManager.findProvider(providerId); 
    const _res = validateAPI(res) ?? {};
    Logger.debug(`RQHook > useProvider ... providerId: ${providerId}, res: `, _res);
    return _res;
  },
  enabled: !!providerId,
});
/**
 * @name useAddProvider
 * @description 외부공급자 생성 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 * @see ApiManager.useAddProvider
 */
export const useAddProvider = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
  return useMutation({
    mutationFn: async (providerData) => {
      closeModal()
      const res = await ApiManager.addProvider(providerData)
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useAddProvider ... providerData: ${JSON.stringify(providerData, null, 2)}`)
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useAddProvider ... res: `, res);
      apiToast.ok(`${Localization.kr.PROVIDER} ${Localization.kr.CREATE} ${Localization.kr.REQ_COMPLETE}`)
      queryClient.invalidateQueries('allProviders'); // provider 추가 성공 시 'allProviders' 쿼리를 리패칭하여 목록을 최신화
      postSuccess()
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      postError && postError(error);
    },
  });
};
/**
 * @name useEditProvider
 * @description 외부공급자 수정 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 * @see ApiManager.useEditProvider
 */
export const useEditProvider = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
  return useMutation({
    mutationFn: async ({ providerId, providerData }) => {
      closeModal();
      const res = await ApiManager.editProvider(providerId, providerData);
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useEditProvider ... providerId: ${providerId}, providerData: ${JSON.stringify(providerData, null, 2)}`)
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useEditProvider ... res: `, res)
      apiToast.ok(`${Localization.kr.PROVIDER} ${Localization.kr.UPDATE} ${Localization.kr.REQ_COMPLETE}`)
      queryClient.invalidateQueries('allProviders');
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      postError && postError(error);
    },
  });
};
/**
 * @name useDeleteProvider
 * @description 외부공급자 삭제 useMutation 훅
 * 
 * @param {*} postSuccess 
 * @param {*} postError 
 * @returns 
 */
export const useDeleteProvider = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient()
  const { setProvidersSelected } = useGlobal()
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async (providerId) => {
      closeModal();
      const res = await ApiManager.deleteProvider(providerId);
      const _res = validateAPI(res) ?? {};
      Logger.debug(`RQHook > useDeleteProvider ... providerId: ${providerId}`)
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useDeleteProvider ... res: `, res);
      apiToast.ok(`${Localization.kr.PROVIDER} ${Localization.kr.REMOVE}  ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_TREE_NAVIGATIONS]);
      queryClient.removeQueries(`allProviders,${QK.ALL_TREE_NAVIGATIONS}`);
      setProvidersSelected([])
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      postError && postError(error);
    },
  });
};
//#endregion: Provider


//#region: VMWare
/**
 * @name useAuthenticate4VMWare
 * @description VMware 사용자 ID/PW 인증 훅
 *
 * @param {Function} postSuccess - 성공 후 콜백
 * @param {Function} postError - 실패 후 콜백
 */
export const useAuthenticate4VMWare = (
  postSuccess=()=>{},postError
) => {
  // const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
  return useMutation({
    mutationFn: async ({ baseUrl, username, password }) => {
      // closeModal();
      const res = await ApiManager.authenticate4VMWare({ baseUrl, username, password });
      const _res = validateAPI(res) ?? {};
      Logger.debug("RQHook > useAuthenticate4VMWare > token: ", _res);
      return _res;
    },
    onSuccess: (res, { baseUrl, username }) => {
      if (!res.value) {
        throw new Error("인증 실패: 토큰이 존재하지 않습니다.");
      }
      // 이후 저장하거나 연결된 동작 추가 가능
      Logger.debug(`인증 성공 - 사용자: ${username}, 토큰: ${res.value}`);
      postSuccess(res.value);
    },
    onError: (error) => {
      Logger.error("RQHook > useAuthenticate4VMWare > error: ", error);
      apiToast.error(error.message);
      postError && postError(error);
    },
  });
};

/**
 * @name useVmsFromVMWare
 * @description VMware 인증된 세션으로 VM 목록 조회하는 훅
 */
export const useVmsFromVMWare = ({
  baseUrl="", sessionId="", 
  mapPredicate = (e) => ({ ...e })
}) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: ['allVmsFromVMWare', baseUrl, sessionId],
  queryFn: async () => {
    const res = await ApiManager.findAllVmsFromVMWare({ baseUrl, sessionId }); 
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useVmsFromVMWare ... baseUrl: ${baseUrl}, sessionId: ${sessionId}, res: `, _res);
    return _res;
  },
  enabled: !!(sessionId && baseUrl),
});

/**
 * @name useVmFromVMWare
 * @description VMware 인증된 세션으로 VM 상세조회 훅
 */
export const useVmFromVMWare = ({
  baseUrl="", sessionId="", vmIds="",
  mapPredicate = (e) => ({ ...e })
}) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: ['vmFromVMWare', vmIds], 
  queryFn: async () => {
    const res = await ApiManager.findVmFromVMWare({ baseUrl, sessionId, vmIds }); 
    const _res = validateAPI(res) ?? {};
    Logger.debug(`RQHook > useVmFromVMWare ... baseUrl: ${baseUrl}, sessionId: ${sessionId}, vmIds: ${vmIds}, res: `, _res);
    return _res;
  },
  enabled: !!(sessionId && baseUrl),
});

//#endregion: VMWare


//#region: User
/**
 * @name useAllUsers
 * @description 모든 사용자 목록조회 useQuery훅
 * 
 * @param {function} mapPredicate 
 * @returns useQuery훅
 */
export const useAllUsers = (
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.ALL_USERS],
  queryFn: async () => {
    const res = await ApiManager.findAllUsers();
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllUsers ... res: `, _res);
    return _res;
  }
})
/**
 * @name useUser
 * @description 사용자 상세조회 useQuery훅
 * 
 * @param {string} username 사용자 oVirt ID
 * @returns useQuery훅
 */
export const useUser = (
  username,
  exposeDetail = false
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.USER],
  queryFn: async () => {
    const res = await ApiManager.findUser(username, exposeDetail)
    const _res = validateAPI(res) ?? {}
    Logger.debug(`RQHook > useUser ... username: ${username}, exposeDetail: ${exposeDetail}, res: `, _res);
    return _res;
  },
  enabled: !!username,
})
/**
 * @name useAuthenticate
 * @description 사용자 ID/PW 검증 useQuery훅
 * 
 * @param {function} mapPredicate 
 * @returns useQuery훅
 */
export const useAuthenticate = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient()
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    const { setAuth } = useAuth();
  return useMutation({
    mutationFn: async ({username, password}) => {
      closeModal();
      const res = await ApiManager.authenticate(username, password)
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useAuthenticate ... username: ${username}, password: ${password}`);
      return _res;
    },
    onSuccess: (res, { username }) => {
      Logger.debug(`RQHook > useAuthenticate ... res: `, res);
      if (!res) throw Error("[403] 로그인에 실패했습니다. 사용자ID 또는 비밀번호가 다릅니다.")
      setAuth({ 
        username: username,
        isUserAuthenticated: res,
      })
      invalidateQueriesWithDefault(queryClient, [QK.ALL_USERS,[QK.USER, username]]);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_USERS,[QK.USER, user.username]]);
      postError && postError(error);
    },
  })
}

/**
 * @name useAddUser
 * @description 사용자 생성 useQuery훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useAddUser = (
  user,
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient()
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async () => {
      closeModal();
      const res = await ApiManager.addUser(user)
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useAddUser ... user: ${JSON.stringify(user, null, 2)}`);
      return _res;
    },
    onSuccess: (res ) => {
      Logger.debug(`RQHook > useAddUser ... res: `, res);
      apiToast.ok(`${Localization.kr.USER} ${Localization.kr.CREATE} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_USERS,QK.USER]);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_USERS,QK.USER]);
      postError && postError(error);
    },
  })
}
/**
 * @name useEditUser
 * @description 사용자 편집 useQuery훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useEditUser = (
  user,
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient()
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async () => {
      closeModal();
      const res = await ApiManager.editUser(user)
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useEditUser ... user: ${JSON.stringify(user, null, 2)}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useEditUser ... res: `, res);
      apiToast.ok(`${Localization.kr.USER} ${Localization.kr.UPDATE} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_USERS]);
      queryClient.invalidateQueries([QK.USER, user.username]); 
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      postError && postError(error);
    },
  });
};
export const useUpdatePasswordUser = (
  username,
  pwCurrent, pwNew,
  force = false,
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient()
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async () => {
      closeModal();
      const res = await ApiManager.updatePassword(username, pwCurrent, pwNew, force)
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useChangePasswordUser ... username: ${username}, force: ${force}`);
      return _res;
    },
    onSuccess: (res,{username}) => {
      Logger.debug(`RQHook > useChangePasswordUser ... res: `, res);
      apiToast.ok(`${Localization.kr.USER} 비밀번호 ${Localization.kr.UPDATE} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_USERS]);
      queryClient.invalidateQueries([QK.USER, username]); 
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_USERS]);
      queryClient.invalidateQueries([QK.USER, username]); 
      postError && postError(error);
    },
  });
}
/**
 * @name useRemoveUser
 * @description 사용자 삭제
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useRemoveUser = (
  username,
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async (username) => {
      closeModal();
      const res = await ApiManager.removeUser(username)
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useRemoveUser ... username: ${username}`);
      return _res;
    },
    onSuccess: (res,{username}) => {
      Logger.debug(`RQHook > useRemoveUser ... res: `, res);
      apiToast.ok(`${Localization.kr.USER} ${Localization.kr.REMOVE} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_USERS,QK.USER]);
      queryClient.removeQueries([QK.USER, username]);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_USERS,QK.USER]);
      postError && postError(error);
    },
  })
};
//#endregion: User

//#region: UserSession
/**
 * @name useAllUserSessions
 * @description 모든 활성 사용자 세션 목록조회 useQuery훅
 * 
 * @param {function} mapPredicate 
 * @returns useQuery훅
 */
export const useAllUserSessions = (
  username = "",
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.ALL_USER_SESSIONS],
  queryFn: async () => {
    const res = await ApiManager.findAllUserSessions(username)
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllUserSessions ... username: ${username} res: `, _res);
    return _res;
  }
})
//#endregion: UserSession

//#region: Certificate(s)
export const useAllCerts = (
  mapPredicate = (e) => ({ ...e })
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.ALL_CERTS],
  queryFn: async () => {
    Logger.debug(`useUser ...`);
    const res = await ApiManager.findAllCerts()
    const _res = mapPredicate
      ? validateAPI(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validateAPI(res) ?? [];
    Logger.debug(`RQHook > useAllCerts ... res: `, _res);
    return _res;
  }
})
export const useCert = (
  id
) => useQuery({
  refetchInterval: DEFAULT_REFETCH_INTERVAL_IN_MILLI,
  queryKey: [QK.CERT],
  queryFn: async () => {
    Logger.debug(`useCert ... id: ${id}`);
    const res = await ApiManager.findCert(id)
    const _res = validateAPI(res) ?? {}
    Logger.debug(`RQHook > useCert ... id: ${id}, res: `, _res);
    return _res;
  }
})

export const useAttachCert = (
  postSuccess=()=>{}, postError
) => {
  const queryClient = useQueryClient();
  const { closeModal } = useUIState();
  const { apiToast } = useApiToast();
    return useMutation({
    mutationFn: async (certReq) => {
      closeModal();
      const res = await ApiManager.attachCert(certReq)
      const _res = validateAPI(res) ?? {}
      Logger.debug(`RQHook > useAttachCert ... certReq: `, certReq);
      return _res;
    },
    onSuccess: (res ,{username}) => {
      Logger.debug(`RQHook > useAttachCert ... res: `, res);
      apiToast.ok(`${Localization.kr.CERTIFICATE} ${Localization.kr.ATTACH} ${Localization.kr.REQ_COMPLETE}`)
      invalidateQueriesWithDefault(queryClient, [QK.ALL_CERTS]);
      queryClient.invalidateQueries([QK.CERT, username]); 
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      apiToast.error(error.message);
      invalidateQueriesWithDefault(queryClient, [QK.ALL_CERTS]);
      queryClient.invalidateQueries([QK.CERT, username]); 
      postError && postError(error);
    },
  })
};
//#endregion: Certificate(s)

export async function invalidateQueriesWithDefault(
  queryClient = null,
  qks=[],
) {
  for (let qk of qks) {
    await queryClient.invalidateQueries(qk);
  }
  await queryClient.invalidateQueries({
    queryKey: [QK.ALL_JOBS],
    refetchType: 'active',
  });
  await queryClient.invalidateQueries({
    queryKey: [QK.ALL_TREE_NAVIGATIONS, { type: "cluster" }],
    refetchType: 'active'
  });
  await queryClient.invalidateQueries({
    queryKey: [QK.ALL_TREE_NAVIGATIONS, { type: "network" }],
    refetchType: 'active'
  });
  await queryClient.invalidateQueries({
    queryKey: [QK.ALL_TREE_NAVIGATIONS, { type: "storage" }],
    refetchType: 'active'
  });
}

export const validateAPI = (res) => {
  if (res?.head?.code !== 200) {
    throw new Error(`[${res?.head?.code ?? 500}] ${res?.head?.message ?? '알 수 없는 오류'}`);
  }
  return res?.body;
}
