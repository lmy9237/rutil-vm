import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ApiManager from "./ApiManager";
import toast from "react-hot-toast";
import Logger from "../utils/Logger";
import useUIState from "../hooks/useUIState";

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
}
//#endregion: 쿼리Key


//#region: Navigation
/**
 * @name useAllTreeNavigations
 * @description 트리네비게이션 API
 * 
 * @param {string} type =
 * @param {function} mapPredicate 변형 조건
 * 
 * @returns 
 * @see ApiManager.findAllTreeNaviations
 */
export const useAllTreeNavigations = (
  type="none", 
  mapPredicate=(e) => ({ ...e }),
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: [QK.ALL_TREE_NAVIGATIONS, type],  // queryKey에 type을 포함시켜 type이 변경되면 데이터를 다시 가져옴
  queryFn: async () => {
    const res = await ApiManager.findAllTreeNaviations(type);
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] 
      : validate(res) ?? []
    Logger.debug(`RQHook > useAllTreeNavigations ... type: ${type}, res: `, _res);
    return _res;
  },
});

//#endregion

//#region: Dashboard
export const useDashboard = (
  
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: [QK.DASHBOARD],
  queryFn: async () => {
    const res = await ApiManager.getDashboard()
    const _res = validate(res) ?? {}
    Logger.debug(`RQHook > useDashboard ... res: ${JSON.stringify(_res, null , 2)}`);
    return _res
  },
});

export const useDashboardCpuMemory = (
  
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: [QK.DASHBOARD_CPU_MEMORY],
  queryFn: async () => {
    const res = await ApiManager.getCpuMemory()
    const _res = validate(res) ?? {}
    Logger.debug(`RQHook > useDashboardCpuMemory ... res: `, _res);
    return _res
  },
});

export const useDashboardStorage = (

) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: [QK.DASHBOARD_STORAGE],
  queryFn: async () => {
    const res = await ApiManager.getStorage()
    const _res = validate(res) ?? {}
    Logger.debug(`RQHook > useDashboardStorage ... res: `, _res);
    return _res;
  },
});

export const useDashboardHosts = (
  
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: [QK.DASHBOARD_HOSTS],
  queryFn: async () => {
    const res = await ApiManager.getHosts()
    const _res = validate(res) ?? {}
    Logger.debug(`RQHook > useDashboardHosts ... res: `, _res);
    return _res
  },
});

export const useDashboardDomain = (
  mapPredicate=(e) => ({ ...e }),
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: [QK.DASHBOARD_DOMAIN],
  queryFn: async () => {
    const res = await ApiManager.getDomain()
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] 
      : validate(res) ?? []
    Logger.debug(`RQHook > useDashboardDomain ... res: `, _res);
    return _res
  },
});

export const useDashboardHost = (
  hostId,
  mapPredicate=(e) => ({ ...e }),
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: [QK.DASHBOARD_HOST],
  queryFn: async () => {
    const res = await ApiManager.getHost(hostId)
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] 
      : validate(res) ?? []
    Logger.debug(`RQHook > useDashboardHost ... hostId: ${hostId}, res: `, _res);
    return _res;
    // return validate(res)?.map((e) => mapPredicate(e)) ?? []
  },
});

export const useDashboardVmCpu = (
  mapPredicate=(e) => ({ ...e }),
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: [QK.DASHBOARD_VM_CPU],
  queryFn: async () => {
    const res = await ApiManager.getVmCpu();
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] 
      : validate(res) ?? []
    Logger.debug(`RQHook > useDashboardVmCpu ... res: `, _res);
    return _res;
    // return validate(res)?.map((e) => mapPredicate(e)) ?? []
  },
});

export const useDashboardVmMemory = (
  mapPredicate=(e) => ({ ...e }),
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['dashboardVmMemory'],
  queryFn: async () => {
    const res = await ApiManager.getVmMemory()
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] 
      : validate(res) ?? []
    Logger.debug(`RQHook > useDashboardVmMemory ... res: `, _res);
    return _res;
    // return validate(res)?.map((e) => mapPredicate(e)) ?? []
  },
});

export const useDashboardStorageMemory = (
  mapPredicate=(e) => ({ ...e }),
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['dashboardStorageMemory'],
  queryFn: async () => {
    const res = await ApiManager.getStorageMemory()
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] 
      : validate(res) ?? []
    Logger.debug(`RQHook > useDashboardStorageMemory ... res: `, _res);
    return _res
    // return validate(res)?.map((e) => mapPredicate(e)) ?? []
  },
});

export const useDashboardPerVmCpu = (
  mapPredicate=(e) => ({ ...e }),
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['dashboardPerVmCpu'],
  queryFn: async () => {
    const res = await ApiManager.getPerVmCpu()
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] 
      : validate(res) ?? []
    Logger.debug(`RQHook > dashboardPerVmCpu ... res: `, _res);
    return _res
  },
});

export const useDashboardPerVmMemory = (
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['dashboardPerVmMemory'],
  queryFn: async () => {
    const res = await ApiManager.getPerVmMemory()
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] 
      : validate(res) ?? []
    Logger.debug(`RQHook > dashboardPerVmMemory ... res: `, _res);
    return _res
    // return validate(res)?.map((e) => mapPredicate(e)) ?? []
  }
});
export const useDashboardPerVmNetwork = (
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['dashboardPerVmNetwork'],
  queryFn: async () => {
    Logger.debug(`dashboardPerVmNetwork ...`);
    const res = await ApiManager.getPerVmNetwork()
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] 
      : validate(res) ?? []
    Logger.debug(`RQHook > dashboardPerVmNetwork ... res: `, _res);
    return _res
    // return validate(res)?.map((e) => mapPredicate(e)) ?? []
  }
});

export const useDashboardMetricVmCpu = (
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['dashboardMetricVmCpu'],
  queryFn: async () => {
    Logger.debug(`useDashboardMetricVmCpu ...`);
    const res = await ApiManager.getMetricVmCpu()
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] 
      : validate(res) ?? []
    Logger.debug(`RQHook > useDashboardMetricVmCpu ... res: `, _res);
    return _res
  }
});
export const useDashboardMetricVmMemory = (
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['dashboardMetricVmMemory'],
  queryFn: async () => {
    const res = await ApiManager.getMetricVmMemory()
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] 
      : validate(res) ?? []
    Logger.debug(`RQHook > useDashboardMetricVmMemory ... res: `, _res);
    return _res
  }
});
export const useDashboardMetricStorage = (
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['dashboardMetricStorage'],
  queryFn: async () => {
    const res = await ApiManager.getMetricStorage()
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] 
      : validate(res) ?? []
    Logger.debug(`RQHook > useDashboardMetricStorage ... res: `, _res);
    return _res
  }
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
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allDataCenters'],
  queryFn: async () => {
    const res = await ApiManager.findAllDataCenters();
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] 
      : validate(res) ?? []
    Logger.debug(`RQHook > useAllDataCenters ... res: `, _res);
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
  refetchOnWindowFocus: true,  // 윈도우가 포커스될 때마다 데이터 리프레시
  queryKey: ['dataCenter', dataCenterId],  // queryKey에 dataCenterId를 포함시켜 dataCenterId가 변경되면 다시 요청
  queryFn: async () => {
    const res = await ApiManager.findDataCenter(dataCenterId);  // dataCenterId에 따라 API 호출
    const _res = validate(res) ?? {};  // 데이터를 반환, 없는 경우 빈 객체 반환
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
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['clustersFromDataCenter', dataCenterId], 
  queryFn: async () => {
    const res = await ApiManager.findAllClustersFromDataCenter(dataCenterId); 
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공 
      : validate(res) ?? []
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
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['hostsFromDataCenter', dataCenterId], 
  queryFn: async () => {
    // if(dataCenterId === '') return [];
    const res = await ApiManager.findAllHostsFromDataCenter(dataCenterId); 
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
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
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['vmsFromDataCenter', dataCenterId], 
  queryFn: async () => {
    const res = await ApiManager.findAllVmsFromDataCenter(dataCenterId); 
    const _res = mapPredicate 
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? []; // 데이터 가공
    Logger.debug(`RQHook > useVMsFromDataCenter ... dataCenterId: ${dataCenterId}, res: `, _res);
    return _res;
  },
  enabled: !!dataCenterId, // dataCenterId가 있을 때만 쿼리 실행
  staleTime: 0,
  cacheTime: 0,
});
/**
 * @name useDomainsFromDataCenter
 * @description 데이터센터 내 스토리지 도메인 목록조회 useQuery훅
 * 
 * @param {string} dataCenterId 데이터센터ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllDomainsFromDataCenter
 */
export const useDomainsFromDataCenter = (
  dataCenterId,
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['domainsFromDataCenter', dataCenterId], 
  queryFn: async () => {
    const res = await ApiManager.findAllDomainsFromDataCenter(dataCenterId); 
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
    Logger.debug(`RQHook > useDomainsFromDataCenter ... dataCenterId: ${dataCenterId}, res: `, _res);
    return _res;
  },
  enabled: !!dataCenterId, // dataCenterId가 있을 때만 쿼리 실행
});
/**
 * @name useNetworksFromDataCenter
 * @description 데이터센터 내 네트워크 목록조회 useQuery훅
 * 
 * @param {string} dataCenterId 데이터센터ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllNetworksFromDataCenter
 */
export const useNetworksFromDataCenter = (
  dataCenterId,
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['networksFromDataCenter', dataCenterId], 
  queryFn: async () => {
    const res = await ApiManager.findAllNetworksFromDataCenter(dataCenterId); 
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
    Logger.debug(`RQHook > useNetworksFromDataCenter ... dataCenterId: ${dataCenterId}, res: `, _res);
    return _res;
  },
  enabled: !!dataCenterId
});
/**
 * @name useEventsFromDataCenter
 * @description 데이터센터 내 이벤트 목록조회 useQuery훅
 * 
 * @param {string} dataCenterId 데이터센터ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllEventsFromDataCenter
 */
export const useEventsFromDataCenter = (
  dataCenterId,
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['eventsFromDataCenter', dataCenterId], 
  queryFn: async () => {
    const res = await ApiManager.findAllEventsFromDataCenter(dataCenterId); 
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
    Logger.debug(`RQHook > useEventsFromDataCenter ... dataCenterId: ${dataCenterId}, res: `, _res);
    return _res;
  }
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
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['templatesFromDataCenter', dataCenterId ], 
  queryFn: async () => {
    const res = await ApiManager.findTemplatesFromDataCenter(dataCenterId); 
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
    Logger.debug(`RQHook > useFindTemplatesFromDataCenter ... dataCenterId: ${dataCenterId}, res: `, _res);
    return _res;
  },
  enabled: !!dataCenterId, 
});
/**
 * @name useFindDiskListFromDataCenter
 * @description 가상머신 연결할 수 있는 디스크 useQuery훅
 * 
 * @param {string} dataCenterId 데이터센터ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findDiskListFromDataCenter
 */
export const useFindDiskListFromDataCenter = (
  dataCenterId,
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['diskListFromDataCenter', dataCenterId ], 
  queryFn: async () => {
    const res = await ApiManager.findDiskListFromDataCenter(dataCenterId); 
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
    Logger.debug(`RQHook > useFindDiskListFromDataCenter ... dataCenterId: ${dataCenterId}, res: `, _res);
    return _res;
  },
  enabled: !!dataCenterId, 
});

/**
 * @name useCDFromDataCenter
 * @description 가상머신 생성창 - CD/DVD 연결할 ISO 목록 useQuery훅
 * 
 * @param {string} dataCenterId 데이터센터ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllISOFromDataCenter
 */
export const useCDFromDataCenter = (
  dataCenterId,
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['CDFromDataCenter', dataCenterId], 
  queryFn: async () => {
    const res = await ApiManager.findAllISOFromDataCenter(dataCenterId); 
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
    Logger.debug(`RQHook > useCDFromDataCenter ... dataCenterId: ${dataCenterId}, res: `, _res);
    return _res
  },
  enabled: !!dataCenterId, 
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
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (dataCenterData) => {
      const res = await ApiManager.addDataCenter(dataCenterData)
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useAddDataCenter ... dataCenterData: ${JSON.stringify(dataCenterData, null, 2)}`)
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useAddDataCenter ... res: `, res);
      queryClient.invalidateQueries('allDataCenters'); // 데이터센터 추가 성공 시 'allDataCenters' 쿼리를 리패칭하여 목록을 최신화
      postSuccess()
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  
  return useMutation({
    mutationFn: async ({ dataCenterId, dataCenterData }) => {
      const res = await ApiManager.editDataCenter(dataCenterId, dataCenterData);
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useEditDataCenter ... dataCenterId: ${dataCenterId}, dataCenterData: ${JSON.stringify(dataCenterData, null, 2)}`)
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useEditDataCenter ... res: `, res)
      queryClient.invalidateQueries('allDataCenters');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({ 
    mutationFn: async (dataCenterId) => {
      const res = await ApiManager.deleteDataCenter(dataCenterId);
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useDeleteDataCenter ... dataCenterId: ${dataCenterId}`)
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useDeleteDataCenter ... res: `, res)
      queryClient.invalidateQueries('allDataCenters');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allClusters'],
  queryFn: async () => {
    const res = await ApiManager.findAllClusters()
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
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
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allClusters'],
  queryFn: async () => {
    const res = await ApiManager.findAllUpClusters()
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
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
  refetchOnWindowFocus: true,  // 윈도우 포커스 시 데이터 리프레시
  queryKey: ['cluster', clusterId],  // queryKey에 clusterId를 포함시켜 clusterId가 변경되면 다시 요청
  queryFn: async () => {
    const res = await ApiManager.findCluster(clusterId);
    const _res = validate(res) ?? {};
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
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['networkFromCluster', clusterId], 
  queryFn: async () => {
    const res = await ApiManager.findNetworksFromCluster(clusterId); 
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
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
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['hostsFromCluster', clusterId], 
  queryFn: async () => {
    const res = await ApiManager.findHostsFromCluster(clusterId); 
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
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
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['vmsFromCluster', clusterId], 
  queryFn: async () => {
    Logger.debug(`useVMsFromCluster ... ${clusterId}`);
    const res = await ApiManager.findVMsFromCluster(clusterId); 
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
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
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['permissionsFromCluster', clusterId], 
  queryFn: async () => {
    const res = await ApiManager.findPermissionsFromCluster(clusterId); 
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
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
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['cpuProfilesFromCluster', clusterId], 
  queryFn: async () => {
    const res = await ApiManager.findCpuProfilesFromCluster(clusterId); 
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
    Logger.debug(`RQHook > useCpuProfilesFromCluster ... ${clusterId}, res: `, _res);
    return _res
  },
  enabled: !!clusterId, 
  staleTime: 0,
  cacheTime: 0,
})

/**
 * @name useOsSystemsFromCluster
 * @description 클러스터 내 운영시스템 목록조회 useQuery훅
 * 
 * @param {string} clusterId 클러스터ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findOsSystemsFromCluster
 */
export const useOsSystemsFromCluster = (
  clusterId,
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['osSystemsFromCluster', clusterId], 
  queryFn: async () => {
    const res = await ApiManager.findOsSystemsFromCluster(clusterId); 
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
    Logger.debug(`RQHook > useOsSystemsFromCluster ... ${clusterId}, res: `, _res);
    return _res
  },
  enabled: !!clusterId, 
  staleTime: 0,
  cacheTime: 0,
})

/**
 * @name useAllvnicFromCluster
 * @description  가상머신 생성창-nic목록 목록조회 useQuery훅
 * 
 * @param {string} dataCenterId 데이터센터 id
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findVNicFromCluster
 */
export const useAllvnicFromCluster = (
  clusterId,
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['AllnicFromVM', clusterId], 
  queryFn: async () => {
    const res = await ApiManager.findVNicFromCluster(clusterId); 
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
    Logger.debug(`RQHook > useAllvnicFromCluster ... clusterId: ${clusterId}, res: `, _res);
    return _res
  },
  enabled: !!clusterId, 
  staleTime: 0,
  cacheTime: 0,
})

/**
 * @name useEventFromCluster
 * @description 클러스터 내 이벤트 목록조회 useQuery훅
 * 
 * @param {string} clusterId 클러스터ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findEventsFromCluster
 */
export const useEventFromCluster = (
  clusterId, 
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['eventsFromCluster', clusterId], 
  queryFn: async () => {
    const res = await ApiManager.findEventsFromCluster(clusterId); 
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
    Logger.debug(`RQHook > useEventFromCluster ... clusterId: ${clusterId}, res: `, _res);
    return _res
  },
  enabled: !!clusterId, 
})

/**
 * @name useAddCluster
 * @description 클러스터 생성 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 * @see ApiManager.addCluster
 */
export const useAddCluster = (
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (clusterData) => {
      const res = await ApiManager.addCluster(clusterData);
      return validate(res)
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useAddCluster ... res: `, res);
      queryClient.invalidateQueries('allClusters,clustersFromDataCenter');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  
  return useMutation({
    mutationFn: async ({ clusterId, clusterData }) => {
      const res = await ApiManager.editCluster(clusterId, clusterData);
      return validate(res)
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useEditCluster ... res: `, res);
      queryClient.invalidateQueries('allClusters,clustersFromDataCenter');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({ 
    mutationFn: async (clusterId) => {
      const res = await ApiManager.deleteCluster(clusterId)
      return validate(res)
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useDeleteCluster ... res: `, res);
      queryClient.invalidateQueries('allClusters,clustersFromDataCenter');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
      postError && postError(error);
    },
  });
};
//#endregion: Cluster

//#region: Host ----------------호스트---------------------
/**
 * @name useAllHosts
 * @description 호스트 목록조회 useQuery훅
 * 
 * @param {function} mapPredicate 객체 변형 처리
 * @see ApiManager.findAllHosts
 */
export const useAllHosts = (
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allHosts'],
  queryFn: async () => {
    const res = await ApiManager.findAllHosts()
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
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
  refetchOnWindowFocus: true,
  queryKey: ['HostById',hostId], // TODO: host로 변경
  queryFn: async () => {
    const res = await ApiManager.findHost(hostId)
    const _res = validate(res) ?? {}
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
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['vmFromHost', hostId], 
  queryFn: async () => {
    const res = await ApiManager.findVmsFromHost(hostId); 
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
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
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['NetworkInterfacesFromHost', hostId], 
  queryFn: async () => {
    const res = await ApiManager.findHostNicsFromHost(hostId); 
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
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
  refetchOnWindowFocus: true,
  queryKey: ['NetworkInterfaceFromHost', hostId, nicId], 
  queryFn: async () => {
    const res = await ApiManager.findHostNicFromHost(hostId, nicId); 
    const _res = validate(res) ?? {}
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
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['NetworkAttachmentsFromHost', hostId], 
  queryFn: async () => {
    const res = await ApiManager.findNetworkAttachmentsFromHost(hostId); 
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
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
  refetchOnWindowFocus: true,
  queryKey: ['NetworkAttachmentsFromHost', hostId, networkAttachmentId], 
  queryFn: async () => {
    const res = await ApiManager.findNetworkAttachmentFromHost(hostId, networkAttachmentId); 
    const _res = validate(res) ?? {}
    Logger.debug(`RQHook > useNetworkAttachmentFromHost ... hostId: ${hostId} networkAttachmentId: ${networkAttachmentId},  res: `, _res);
    return _res
  },
  enabled: !!hostId
})


/**
 * @name useAddBonding
 * @description 호스트 네트워크 본딩 생성 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 * @see ApiManager.addBonding
 */
export const useAddBonding = (
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (hostNicData) => {
      const res = await ApiManager.addBonding(hostNicData);
      return validate(res)
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useAddBonding ... res: `, res);
      queryClient.invalidateQueries('NetworkInterfacesFromHost');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
      postError && postError(error);
    },
  });
};
/**
 * @name useEditBonding
 * @description 호스트 네트워크 본딩 수정 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 * @see ApiManager.editCluster
 */
export const useEditBonding = (
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  
  return useMutation({
    mutationFn: async ({ hostId, hostNicData }) => {
      const res = await ApiManager.editBonding(hostId, hostNicData);
      return validate(res)
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useEditBonding ... res: `, res);
      queryClient.invalidateQueries('NetworkInterfacesFromHost');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
      postError && postError(error);
    },
  });
};
/**
 * @name useDeleteBonding
 * @description 호스트 네트워크 본딩 삭제 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 * @see ApiManager.deleteCluster
 */
export const useDeleteBonding = (
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({ 
    mutationFn: async (hostId, hostNicData) => {
      const res = await ApiManager.deleteBonding(hostId, hostNicData)
      return validate(res)
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useDeleteBonding ... res: `, res);
      queryClient.invalidateQueries('NetworkInterfacesFromHost');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
      postError && postError(error);
    },
  });
};


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
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['hostDevicesFromHost', hostId], 
  queryFn: async () => {
    const res = await ApiManager.findHostdevicesFromHost(hostId); 
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
    Logger.debug(`RQHook > useHostDevicesFromHost ... hostId: ${hostId},  res: `, _res);
    return _res
  },
  enabled: !!hostId
})
/**
 * @name useEventsFromHost
 * @description 호스트 내 이벤트 목록조회 useQuery훅
 * 
 * @param {string} clusterId 클러스터ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findEventsFromHost
 */
export const useEventsFromHost = (
  hostId,
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['eventsFromHost', hostId], 
  queryFn: async () => {
    const res = await ApiManager.findEventsFromHost(hostId);
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
    Logger.debug(`RQHook > useEventsFromHost ... hostId: ${hostId}, res: `, _res);
    return _res
  },
  enabled: !!hostId
})

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
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['iscsiFromHost', hostId], 
  queryFn: async () => {
    const res = await ApiManager.findAllIscsiFromHost(hostId);
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
    Logger.debug(`RQHook > useIscsiFromHost ... hostId: ${hostId}, res: `, _res);
    return _res; // 데이터 가공 후 반환
  },
  enabled: !!hostId,
})

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
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['fibreFromHost', hostId], 
  queryFn: async () => {    
    const res = await ApiManager.findAllFibreFromHost(hostId);
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? []; 
    Logger.debug(`RQHook > useFibreFromHost ... hostId: ${hostId}, res: `, _res);
    return _res
  },
  enabled: !!hostId,
})
/**
 * @name useImportIscsiFromHost
 * @description 호스트 가져오기 iscsi 목록조회 useQuery훅
 * 
 * @param {string} hostId
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findImportIscsiFromHost
 */
export const useImportIscsiFromHost = (
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({hostId, iscsiData}) => {
      const res = await ApiManager.findImportIscsiFromHost(hostId, iscsiData);
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useImportIscsiFromHost ... hostId: ${hostId}, iscsiData: `, iscsiData)
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useImportIscsiFromHost ... res: `, res);
      queryClient.invalidateQueries(['iscsiFromHost'])
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
      postError && postError(error);
    },
  });
};
/**
 * @name useImportFcpFromHost
 * @description 호스트 가져오기 fcp 목록조회 useQuery훅
 * 
 * @param {string} hostId
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findImportFcpFromHost
 */
export const useImportFcpFromHost = (
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ hostId }) => {
      const res = await ApiManager.findImportFcpFromHost(hostId);
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useImportFcpFromHost ... hostId: ${hostId}`)
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useImportFcpFromHost ... res: `, res);
      queryClient.invalidateQueries(['fcpsFromHost'])
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
      postError && postError(error);
    },
  });
};


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
export const useLoginIscsiFromHost = (
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ hostId, iscsiData }) => {
      const res = await ApiManager.findLoginIscsiFromHost(hostId, iscsiData);
      const _res = validate(res) || {}
      Logger.debug(`RQHook > useLoginIscsiFromHost ... hostId: ${hostId}`)
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useLoginIscsiFromHost ... res: `, res);
      queryClient.invalidateQueries(['iscsiFromHost'])
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({ hostData, deployHostedEngine }) => {
      const res = await ApiManager.addHost(hostData, deployHostedEngine);
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useLoginIscsiFromHost ... deployHostedEngine: ${deployHostedEngine}, hostData: `, hostData)
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useAddHost ... res: `, res);
      queryClient.invalidateQueries('allHosts'); // 호스트 추가 성공 시 'allDHosts' 쿼리를 리패칭하여 목록을 최신화   
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  
  return useMutation({
    mutationFn: async ({ hostId, hostData }) => {
      const res = await ApiManager.editHost(hostId, hostData)
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useEditHost ... hostId: ${hostId}, hostData: ${JSON.stringify(hostData, null ,2)}`)
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useEditHost ... res: `, res);
      queryClient.invalidateQueries('allHosts');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({ 
    mutationFn: async (hostId) => {
      const res = await ApiManager.deleteHost(hostId)
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useDeleteHost ... hostId: ${hostId}`)
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useDeleteHost ... res: `, res);
      queryClient.invalidateQueries('allHosts');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (hostId) => {
      const res = await ApiManager.deactivateHost(hostId);
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useDeactivateHost ... hostId: ${hostId}`)
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useDeactivateHost ... res: `, res);
      queryClient.invalidateQueries('allHosts');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (hostId) => {
      const res = await ApiManager.activateHost(hostId)
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useActivateHost ... hostId: ${hostId}`)
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useActivateHost ... res: `, res);
      queryClient.invalidateQueries('allHosts');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (hostId) => {
      const res = await ApiManager.restartHost(hostId);
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useRestartHost ... hostId: ${hostId}`)
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useRestartHost ... res: `, res);
      queryClient.invalidateQueries('allHosts');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
      postError && postError(error);
    },
  });
};

export const useEnrollHostCertificate = (
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (hostId) => {
      const res = await ApiManager.enrollHostCertificate(hostId);
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useEnrollHostCertificate ... hostId: ${hostId}`)
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useEnrollHostCertificate ... res: `, res);
      queryClient.invalidateQueries('allHosts');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
      postError && postError(error);
    },
  });
}


/**
 * @name useRefreshHost
 * @description 호스트 새로고침 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 * @see ApiManager.refreshHost
 */
export const useRefreshHost = (
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (hostId) => {
      const res = await ApiManager.refreshHost(hostId)
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useRefreshHost ... hostId: ${hostId}`)
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useRefreshHost ... res: `, res);
      queryClient.invalidateQueries('allHosts');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (hostId) => {
      const res = await ApiManager.commitNetConfigHost(hostId)
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > usecommitNetConfigHost ... hostId: ${hostId}`)
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > usecommitNetConfigHost ... res: `, res);
      queryClient.invalidateQueries('allHosts');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allVMs'],
  queryFn: async () => {
    const res = await ApiManager.findAllVMs()
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? []; 
    Logger.debug(`RQHook > useAllVMs ... res: `, _res);
    return _res;

  },
  staleTime: 2000, // 2초 동안 데이터 재요청 방지
})
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
  queryKey: ['vm', vmId],
  queryFn: async () => {
    const res = await ApiManager.findVM(vmId);
    const _res = validate(res) ?? {};
    Logger.debug(`RQHook > useVm ... vmId: ${vmId}, res: `, _res);
    return _res;
  },
  enabled: !!vmId
});
/**
 * @name useFindEditVmById
 * @description 가상머신 편집 상세조회 useQuery 훅
 * 
 * @param {string} vmId 가상머신 ID
 * @returns useQuery 훅
 * @see ApiManager.findVM
 */
export const useFindEditVmById = (
  vmId
) => useQuery({
  queryKey: ['editVmById', vmId],
  queryFn: async () => {
    const res = await ApiManager.findEditVM(vmId);
    const _res = validate(res) ?? {};
    Logger.debug(`RQHook > useFindEditVmById ... vmId: ${vmId}, res: `, _res);
    return _res;
  },
  enabled: !!vmId
});

/**
 * @name useDisksFromVM
 * @description 가상머신 내 디스크 목록조회 useQuery훅
 * 
 * @param {string} vmId 가상머신ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findDisksFromVM
 */
export const useDisksFromVM = (
  vmId,
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['disksFromVM', vmId], 
  queryFn: async () => {
    const res = await ApiManager.findDisksFromVM(vmId); 
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
    Logger.debug(`RQHook > useDisksFromVM ... vmId: ${vmId}, res: `, _res);
    return _res;
  },
  enabled: !!vmId, 
});
/**
 * @name useSnapshotsFromVM
 * @description 가상머신 내 스냅샷 목록조회 useQuery훅
 * 
 * @param {string} vmId 가상머신ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findSnapshotsFromVM
 */
export const useSnapshotsFromVM = (
  vmId,
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['SnapshotFromVM', vmId], 
  queryFn: async () => {
    Logger.debug(`useSnapshotFromVM ... ${vmId}`);
    const res = await ApiManager.findSnapshotsFromVM(vmId); 
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
    Logger.debug(`RQHook > useDisksFromVM ... vmId: ${vmId}, res: `, _res);
    return _res
  },
  enabled: !!vmId, 
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
  refetchOnWindowFocus: true,
  queryKey: ['snapshotDetailFromVM', vmId, snapshotId], // snapshotId 추가
  queryFn: async () => {
    if (!vmId || !snapshotId) {
      console.warn('Missing VM ID or Snapshot ID');
      return {};
    }
    const res = await ApiManager.findSnapshotFromVm(vmId, snapshotId); 
    const _res = validate(res) ?? {}; 
    Logger.debug(`RQHook > useSnapshotDetailFromVM ... vmId: ${vmId}, res: `, _res);
    return _res;
  },
  enabled: !!vmId && !!snapshotId
});


/**
 * @name useAddSnapshotFromVM
 * @description 가상머신 스냅샷 생성 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useAddSnapshotFromVM = (
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    // mutationFn: async ({vmId,snapshotData}) => await ApiManager.addSnapshotFromVM(vmId,snapshotData),
    mutationFn: async ({vmId, snapshotData}) => {
      const res = await ApiManager.addSnapshotFromVM(vmId, snapshotData)
      const _res = validate(res) ?? {};
      Logger.debug(`RQHook > useAddSnapshotFromVM ... vmId: ${vmId}, snapshotData: ${JSON.stringify(snapshotData, null, 2)}`)
      return _res
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useAddSnapshotFromVM ... res: ${JSON.stringify(res)}`)
      queryClient.invalidateQueries(['snapshotFromVM','snapshotDetailFromVM']); // 데이터센터 추가 성공 시 'allDataCenters' 쿼리를 리패칭하여 목록을 최신화
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient(); // Query 캐싱을 위한 클라이언트
  return useMutation({
    mutationFn: async ({ vmId, snapshotId }) => {
      const res = await ApiManager.deleteSnapshotFromVM(vmId, snapshotId);
      const _res = validate(res) ?? {};
      Logger.debug(`RQHook > useDeleteSnapshot ... vmId: ${vmId}, snapshotId: ${snapshotId}`)
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useDeleteSnapshot ... res: `, res)
      queryClient.invalidateQueries('snapshotsFromVM'); // 쿼리 캐시 무효화
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['hostDevicesFromVM', vmId], 
  queryFn: async () => {
    const res = await ApiManager.findHostdevicesFromVM(vmId); 
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
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
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['networkInterfacesFromVM', vmId], 
  queryFn: async () => {
    const res = await ApiManager.findNicsFromVM(vmId); 
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
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
  refetchOnWindowFocus: true,
  queryKey: ['networkInterfaceFromVM', vmId], 
  queryFn: async () => {
    const res = await ApiManager.findNicFromVM(vmId, nicId); 
    const _res = validate(res) ?? {}
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
 * 
 * @see ApiManager.findApplicationsFromVM
 */
export const useApplicationsFromVM = (
  vmId,
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['ApplicationFromVM', vmId], 
  queryFn: async () => {
    const res = await ApiManager.findApplicationsFromVM(vmId); 
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
    Logger.debug(`RQHook > useApplicationsFromVM ... vmId: ${vmId}, res: `, _res);
    return _res
  },
  enabled: !!vmId, 
  staleTime: 0,
  cacheTime: 0,
});
/**
 * @name useAllEventFromVM
 * @description 가상머신 내 이벤트 목록조회 useQuery훅
 * 
 * @param {string} vmId 가상머신ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllDataCenterFromDomain
 */
export const useAllEventsFromVM = (
  vmId,
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allEventFromVM', vmId], 
  queryFn: async () => {
    const res = await ApiManager.findEventsFromVM(vmId);
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
    Logger.debug(`RQHook > useAllEventsFromVM ... vmId: ${vmId}, res: `, _res);
    return _res;
  },
  enabled: !!vmId
})


/**
 * @name useVmConsoleAccessInfo
 * @description 가상머신 콘솔 접속정보 조회
 * 
 */
export const useVmConsoleAccessInfo = (
  vmId
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['vmConsoleAccessInfo', vmId], 
  queryFn: async () => {
    const res = await ApiManager.findVmConsoleAccessInfo(vmId);
    const _res = validate(res) ?? {}
    Logger.debug(`RQHook > useVmConsoleAccessInfo ... vmId: ${vmId}, res: `, _res);
    return validate(res);
  },
  enabled: !!vmId
})

/**
 * @name useAddVm
 * @description 가상머신 생성 
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useAddVm = (
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (vmData) => {
      const res = await ApiManager.addVM(vmData)
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useAddVm ... vmData: `, vmData);
      return _res
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useAddVm ... res: `, res);
      queryClient.invalidateQueries('allVMs'); 
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
      postError && postError(error);
    },
  });
};
/**
 * @name useEditVm
 * @description 가상머신 수정 
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useEditVm = (
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ vmId, vmData }) => {
      const res = await ApiManager.editVM(vmId, vmData);
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useEditVm ... vmData: ${JSON.stringify(vmData, null, 2)}`);
      return _res;
    },
    onSuccess: (res,{vmId}) => {
      Logger.debug(`RQHook > useEditVm ... res: `, res);
      queryClient.invalidateQueries('allVMs');
      queryClient.invalidateQueries(['vmId', vmId]); // 수정된 네트워크 상세 정보 업데이트
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      // toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({ 
    mutationFn: async ({ vmId, detachOnly }) => {
      const res = await ApiManager.deleteVM(vmId, detachOnly)
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useDeleteVm ... vmId: ${vmId}, detachOnly: ${detachOnly}`);
      return _res;
    },
    onSuccess: (res,{vmId}) => {
      Logger.debug(`RQHook > useDeleteVm ... res: `, res);
      queryClient.invalidateQueries('allVMs');
      queryClient.invalidateQueries('allDisksFromVm');
      queryClient.invalidateQueries(['vmId', vmId]); // 수정된 네트워크 상세 정보 업데이트
      queryClient.invalidateQueries(['editVmById', vmId])
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (vmId) => {
      const res = await ApiManager.startVM(vmId);
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useStartVM ... vmId: ${vmId}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useStartVM ... res: `, res);
      queryClient.invalidateQueries('allVMs');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (vmId) => {
      const res = await ApiManager.pauseVM(vmId);
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > usePauseVM ... vmId: ${vmId}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > usePauseVM ... res: `, res);
      queryClient.invalidateQueries('allVMs');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
      postError && postError(error);
    },
  });
};

/**
 * @name useShutdownVM
 * @description 가상머신 종료 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useShutdownVM = (
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (vmId) => {
      const res = await ApiManager.shutdownVM(vmId);
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useShutdownVM ... vmId: ${vmId}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useShutdownVM ... res: `, res);
      queryClient.invalidateQueries('allVMs');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (vmId) => { 
      const res = await ApiManager.powerOffVM(vmId)
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > usePowerOffVM ... vmId: ${vmId}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > usePowerOffVM ... res: `, res);
      queryClient.invalidateQueries('allVMs');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (vmId) => {
      const res = await ApiManager.rebootVM(vmId)
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useRebootVM ... vmId: ${vmId}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useRebootVM ... res: `, res);
      queryClient.invalidateQueries('allVMs');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (vmId) => { 
      const res = await ApiManager.resetVM(vmId)
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useResetVM ... vmId: ${vmId}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useResetVM ... res: `, res);
      queryClient.invalidateQueries('allVMs');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
      postError && postError(error);
    }, 
  });
};

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
export const useHostsForMigration = (
  vmId,
  mapPredicate
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['HostsForMigration', vmId], 
  queryFn: async () => {
    const res = await ApiManager.migrateHostsFromVM(vmId); 
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
    Logger.debug(`RQHook > useHostsForMigration ... vmId: ${vmId}, res: `, _res);
    return _res;
  },
  enabled: !!vmId
})

/**
 * @name useMigration
 * @description 가상머신 마이그레이션 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useMigration = (
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({ vmId, vm, affinityClosure }) => {
      const res = await ApiManager.migrateVM(vmId, vm, affinityClosure);
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useMigration ... vmId: ${vmId}, vm: ${vm}, affinityClosure: ${affinityClosure}`);
      return _res
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useMigration ... res: `, res);
      queryClient.invalidateQueries(['hostsForMigration', 'allVms']);
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (vmId) => {
      const res = await ApiManager.exportVM(vmId);
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useExportVM ... vmId: ${vmId}`);
      return _res
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useExportVM ... res: `, res);
      queryClient.invalidateQueries('allVMs');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient(); // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({ vmId, nicData }) => {
      const res = await ApiManager.addNicFromVM(vmId, nicData);
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useAddNicFromVM ... vmId: ${vmId}, nicData: ${nicData}`);
      return _res
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useAddNicFromVM ... res: `, res);
      queryClient.invalidateQueries('NetworkInterfaceFromVM');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  
  return useMutation({
    mutationFn: async ({ vmId, nicId, nicData }) => {
      const res = await ApiManager.editNicFromVM(vmId, nicId, nicData);
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useEditNicFromVM ... vmId: ${vmId}, nicId: ${nicId}, nicData: ${nicData}`);
      return _res
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useEditNicFromVM ... res: `, res);
      queryClient.invalidateQueries('NetworkInterfaceByVMId,NetworkInterfaceFromVM');
      postSuccess();      
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({ vmId, nicId }) => {
      const res = await ApiManager.deleteNicFromVM(vmId, nicId);
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useDeleteNetworkInterface ... vmId: ${vmId}, nicId: ${nicId}`);
      return _res
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useDeleteNetworkInterface ... res: `, res);
      queryClient.invalidateQueries('NetworkInterfaceFromVM');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
 * @see ApiManager.findDiskattachmentFromVM
 */
export const useDiskAttachmentFromVm = (
  vmId, diskAttachmentId
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['diskAttachmentFromVm', vmId, diskAttachmentId],
  queryFn: async () => {
    const res = await ApiManager.findDiskattachmentFromVM(vmId, diskAttachmentId);
    const _res = validate(res) ?? {};
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient(); // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({ vmId, diskData }) => {
      const res = await ApiManager.addDiskFromVM(vmId, diskData);
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useAddDiskFromVM ... vmId: ${vmId}, diskData: ${JSON.stringify(diskData, null, 2)}`);
      return _res
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useAddDiskFromVM ... res: `, res);
      queryClient.invalidateQueries('disksFromVM');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient(); // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({ vmId, diskAttachmentId, diskAttachment }) => {
      const res = await ApiManager.editDiskFromVM(vmId, diskAttachmentId, diskAttachment);
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useEditDiskFromVM ... vmId: ${vmId}, diskAttachmentId: ${diskAttachmentId}, diskAttachment: ${JSON.stringify(diskAttachment, null, 2)}`);
      return _res
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useEditDiskFromVM ... res: `, res);
      queryClient.invalidateQueries('disksFromVM');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({ vmId, diskAttachmentId, detachOnly }) => {
      const res = await ApiManager.deleteDiskFromVM(vmId, diskAttachmentId, detachOnly);
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useDeleteDiskFromVM ... vmId: ${vmId}, diskAttachmentId: ${diskAttachmentId}, detachOnly: ${detachOnly}`);
      return _res
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useDeleteDiskFromVM ... res: `, res);
      queryClient.invalidateQueries('allDisksFromVm');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({ vmId, diskAttachment }) => {
      const res = await ApiManager.attachDiskFromVM(vmId, diskAttachment);
      const _res = validate(res) ?? {};
      Logger.debug(`RQHook > useConnDiskFromVM ... vmId: ${vmId}, diskAttachment: ${JSON.stringify(diskAttachment, null, 2)}`);
      return _res
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useConnDiskFromVM ... res: `, res);
      queryClient.invalidateQueries(['allDisksFromVm']); 
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
      postError && postError(error);
    },
  });
};

/**
 * @name useConnDiskListFromVM
 * @description 가상머신 디스크 연결 복수 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useConnDiskListFromVM = (
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({ vmId, diskAttachmentList }) => {
      const res = await ApiManager.attachDisksFromVM(vmId, diskAttachmentList);
      const _res = validate(res) ?? {};
      Logger.debug(`RQHook > useConnDiskListFromVM ... vmId: ${vmId}, diskAttachmentList: ${JSON.stringify(diskAttachmentList, null, 2)}`);
      return _res
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useConnDiskListFromVM ... res: `, res);
      queryClient.invalidateQueries('allDisksFromVm');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
      postError && postError(error);
    },
  });
};

/**
 * @name useDeactivateDiskFromVm
 * @description 가상머신 디스크 비활성화 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 * @see ApiManager.deactivateHost
 */
export const useDeactivateDiskFromVm = (
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({ vmId, diskAttachmentId }) => {
      const res = await ApiManager.deactivateDisksFromVM(vmId, diskAttachmentId);
      const _res = validate(res) ?? {};
      Logger.debug(`RQHook > useDeactivateDiskFromVm ... vmId: ${vmId}, diskAttachmentId: ${diskAttachmentId}`);
      return _res
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useDeactivateDiskFromVm ... res: `, res);
      queryClient.invalidateQueries('allDisksFromVm');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({ vmId, diskAttachmentId }) => {
      const res = await ApiManager.activateDisksFromVM(vmId, diskAttachmentId);
      const _res = validate(res) ?? {};
      Logger.debug(`RQHook > useActivateDiskFromVm ... vmId: ${vmId}, diskAttachmentId: ${diskAttachmentId}`);
      return _res
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useActivateDiskFromVm ... res: `, res);
      queryClient.invalidateQueries('allDisksFromVm');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
   refetchOnWindowFocus: true,
   queryKey: ['FindDiskFromVM', vmId], 
   queryFn: async () => {
     Logger.debug(`useFindDiskFromVM vm아이디... ${vmId}`);
     Logger.debug(`useFindDiskFromVM 디스크아이디 ... ${diskId}`);
     const res = await ApiManager.findDiskFromVM(vmId,diskId); 
     Logger.debug('API Response:', res); // 반환된 데이터 구조 확인
     return validate(res) ?? {}; 
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
  mapPredicate=(e) => ({ ...e }),
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allTemplates'],
  queryFn: async () => {
    const res = await ApiManager.findAllTemplates()
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] 
      : validate(res) ?? []
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
  queryKey: ['template',templateId],
  queryFn: async () => {
    const res = await ApiManager.findTemplate(templateId);
    const _res =  validate(res) ?? {};
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
  mapPredicate=(e) => ({ ...e }),
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['AllVmsFromTemplate', templateId], 
  queryFn: async () => {
    const res = await ApiManager.findVMsFromTemplate(templateId); 
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] 
      : validate(res) ?? []
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
  mapPredicate=(e) => ({ ...e }),
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allNicsFromTemplate', templateId], 
  queryFn: async () => {
    const res = await ApiManager.findNicsFromTemplate(templateId);
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] 
      : validate(res) ?? []
    Logger.debug(`RQHook > useAllVmsFromTemplate ... templateId: ${templateId}, res: `, _res);
    return _res;
  },
  enabled: !!templateId,
  staleTime: 0,
  cacheTime: 0,
})

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
  mapPredicate=(e) => ({ ...e }),
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allDisksFromTemplate', templateId], 
  queryFn: async () => {
    const res = await ApiManager.findDisksFromTemplate(templateId); 
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] 
      : validate(res) ?? []
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
  mapPredicate=(e) => ({ ...e }),
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['AllStoragesFromTemplate', templateId], 
  queryFn: async () => {
    const res = await ApiManager.findStorageDomainsFromTemplate(templateId);
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] 
      : validate(res) ?? []
    Logger.debug(`RQHook > useAllDisksFromTemplate ... templateId: ${templateId}, res: `, _res);
    return _res;
  },
  enabled: !!templateId,
  staleTime: 0,
  cacheTime: 0,
})


/**
 * @name useAllEventFromTemplate
 * @description  Template 내  이벤트 목록조회 useQuery훅
 * 
 * @param {string} templateId TemplateID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllDataCenterFromDomain
 */
export const useAllEventFromTemplate = (
  templateId,
  mapPredicate=(e) => ({ ...e }),
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allEventFromTemplate', templateId], 
  queryFn: async () => {
    const res = await ApiManager.findEventsFromTemplate(templateId);
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] 
      : validate(res) ?? []
    Logger.debug(`RQHook > useAllEventFromTemplate ... templateId: ${templateId}, res: `, _res);
    return _res;
  },
  enabled: !!templateId,
})

/**
 * @name useAddTemplate
 * @description Template 생성 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useAddTemplate = (
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({ vmId, templateData }) => {
      const res = await ApiManager.addTemplate(vmId, templateData)
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useAddTemplate ... vmId: ${vmId}, templateData: ${JSON.stringify(templateData, null, 2)}`)
      return _res
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useAddTemplate ... res: `, res)
      queryClient.invalidateQueries('allTemplates');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  
  return useMutation({
    mutationFn: async ({ templateId, templateData }) => {
      const res = await ApiManager.editTemplate(templateId, templateData);
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useEditTemplate ... templateId: ${templateId}, templateData: ${JSON.stringify(templateData, null, 2)}`)
      return _res;
    },
    onSuccess: (res,{ templateId }) => {
      Logger.debug(`RQHook > useEditTemplate ... res: `, res)
      queryClient.invalidateQueries('allTemplates');
      queryClient.invalidateQueries(['template', templateId]); // templateId 올바르게 사용
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({ 
    mutationFn: async (templateId) => {
      const res = await ApiManager.deleteTemplate(templateId);
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useDeleteTemplate ... templateId: ${templateId}`)
      return _res;
    },
    onSuccess: (res,{templateId}) => {
      Logger.debug(`RQHook > useEditTemplate ... res: `, res)
      queryClient.invalidateQueries('allTemplates');
      queryClient.invalidateQueries(['template', templateId]); // templateId 올바르게 사용
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
      postError && postError(error);
    },
  });
};
/**
 * @name useAddNicFromTemplate
 * @description 템플릿 네트워크 생성 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useAddNicFromTemplate = (
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({ templateId, nicData }) => {
      const res = await ApiManager.addNicFromTemplate(templateId, nicData);
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useAddNicFromTemplate ... templateId: ${templateId}, nicData: ${JSON.stringify(nicData, null, 2)}`)
      return _res;
    },
    onSuccess: (res,{templateId}) => {
      Logger.debug(`RQHook > useAddNicFromTemplate ... res: `, res)
      queryClient.invalidateQueries(['allNicsFromTemplate', 'allTemplates']);
      queryClient.invalidateQueries(['template', templateId]); // templateId 올바르게 사용
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ templateId, nicId, nicData }) => {
      const res = await ApiManager.editNicFromTemplate(templateId, nicId, nicData);
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useEditNicFromTemplate ... templateId: ${templateId}, nicId: ${nicId}, nicData: ${JSON.stringify(nicData, null, 2)}`)
      return _res;
    },
    onSuccess: (res,{templateId}) => {
      Logger.debug(`RQHook > useEditNicFromTemplate ... res: `, res)
      queryClient.invalidateQueries(['allNicsFromTemplate', 'allTemplates']);
      queryClient.invalidateQueries(['template', templateId]); // templateId 올바르게 사용
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({ templateId, nicId, detachOnly }) => {
      const res = await ApiManager.deleteNicFromTemplate(templateId, nicId, detachOnly);
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useEditNicFromTemplate ... templateId: ${templateId}, nicId: ${nicId}, detachOnly: ${detachOnly}`)
      return _res;
    },
    onSuccess: (res,{templateId}) => {
      Logger.debug(`RQHook > useEditNicFromTemplate ... res: `, res)
      queryClient.invalidateQueries(['allNicsFromTemplate', 'allTemplates']);
      queryClient.invalidateQueries(['template', templateId]); // templateId 올바르게 사용
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allNetworks'],
  queryFn: async () => {
    const res = await ApiManager.findAllNetworks();
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
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
  queryKey: ['network', networkId],
  queryFn: async () => {
    const res = await ApiManager.findNetwork(networkId);
    const _res = validate(res) ?? {};
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
  mapPredicate=(e) => ({ ...e }),
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['clustersFromNetwork', networkId],
  queryFn: async () => {
    const res = await ApiManager.findAllClustersFromNetwork(networkId);
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
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
  mapPredicate=(e) => ({ ...e }),
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['connectedHostsFromNetwork', networkId], 
  queryFn: async () => {
    const res = await ApiManager.findConnectedHostsFromNetwork(networkId);
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
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
  mapPredicate=(e) => ({ ...e }),
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['disconnectedHostsFromNetwork', networkId], 
  queryFn: async () => {
    const res = await ApiManager.findDisconnectedHostsFromNetwork(networkId);
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
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
  mapPredicate=(e) => ({ ...e }),
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['vmFromNetwork', networkId], 
  queryFn: async () => {
    Logger.debug(`useAllVmsFromNetwork ... ${networkId}`);
    const res = await ApiManager.findAllVmsFromNetwork(networkId); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
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
  mapPredicate=(e) => ({ ...e }),
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['templateFromNetwork', networkId], 
  queryFn: async () => {
    const res = await ApiManager.findAllTemplatesFromNetwork(networkId);
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
    Logger.debug(`RQHook > useAllTemplatesFromNetwork ... networkId: ${networkId}, res: `, _res);
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
  mapPredicate=(e) => ({ ...e }),
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['vnicProfilesFromNetwork', networkId],
  queryFn: async () => {
    const res = await ApiManager.findAllVnicProfilesFromNetwork(networkId);
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
    Logger.debug(`RQHook > useAllVnicProfilesFromNetwork ... networkId: ${networkId}, res: `, _res);
    return _res;
  },
  enabled: !!networkId, 
});
/**
 * @name useAddNetwork
 * @description 네트워크 생성 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useAddNetwork = (
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (networkData) => {
      const res = await ApiManager.addNetwork(networkData);
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useAddNetwork ... networkData: ${JSON.stringify(networkData, null, 2)}`)
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useAddNetwork ... res: `, res)
      queryClient.invalidateQueries('allNetworks'); // 데이터센터 추가 성공 시 'allDataCenters' 쿼리를 리패칭하여 목록을 최신화
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ networkId, networkData }) => {
      const res = await ApiManager.editNetwork(networkId, networkData);
      const _res = validate(res) ?? {};
      Logger.debug(`RQHook > useEditNetwork ... networkId: ${networkId}, networkData: ${JSON.stringify(networkData, null, 2)}`)
      return _res;
    },
    onSuccess: (res, { networkId }) => {
      Logger.debug(`RQHook > useEditNetwork ... res: `, res)
      queryClient.invalidateQueries('allNetworks'); // 전체 네트워크 목록 업데이트
      queryClient.invalidateQueries(['networkById', networkId]); // 수정된 네트워크 상세 정보 업데이트
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({ 
    mutationFn: async (networkId) => {
      const res = await ApiManager.deleteNetwork(networkId)
      const _res = validate(res) ?? {};
      Logger.debug(`RQHook > useDeleteNetwork ... networkId: ${networkId}`)
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useDeleteNetwork ... res: `, res)
      queryClient.invalidateQueries('allNetworks');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
export const useAllNetworkProviders = (
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allNetworkProviders'],
  queryFn: async () => {
    const res = await ApiManager.findAllNetworkProviders();
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
    Logger.debug(`RQHook > useAllNetworkProviders ... res: `, _res);
    return _res;
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
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allVnicProfiles'],
  queryFn: async () => {
    const res = await ApiManager.findAllVnicProfiles();
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
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
  queryKey: ['vnicId', vnicId],
  queryFn: async () => {
    const res = await ApiManager.findVnicProfile(vnicId);
    const _res = validate(res) ?? {};
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
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['AllVmsFromVnicProfiles', vnicProfileId],
  queryFn: async () => {
    const res = await ApiManager.findAllVmsFromVnicProfiles(vnicProfileId);
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
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
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['AllTemplatesFromVnicProfiles', vnicProfileId], 
  queryFn: async () => {
    const res = await ApiManager.findAllTemplatesFromVnicProfiles(vnicProfileId); 
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (vnicData) => {
      const res = await ApiManager.addVnicProfiles(vnicData);
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useAddVnicProfile ... vnicData: ${JSON.stringify(vnicData, null, 2)}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useAddVnicProfile ... res: `, res);
      queryClient.invalidateQueries('allVnicProfiles');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  
  return useMutation({
    mutationFn: async ({ vnicId, vnicData }) => {
      const res = await ApiManager.editVnicProfiles(vnicId, vnicData);
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useEditVnicProfile ... vnicId: ${vnicId}, vnicData: ${JSON.stringify(vnicData, null, 2)}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useEditVnicProfile ... res: `, res);
      queryClient.invalidateQueries('allVnicProfiles');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (vnicProfileId) => {
      const res = await ApiManager.deleteVnicProfiles(vnicProfileId);
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useDeleteVnicProfile ... vnicProfileId: ${vnicProfileId}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useDeleteVnicProfile ... res: `, res);
      queryClient.invalidateQueries('allVnicProfiles');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
      postError && postError(error);
    },
  });
};

/**
 * @name useNetworkFilters
 * @description 네트워크 필터 목록조회 useQuery훅
 * 
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllNetworkFilters
 */
export const useNetworkFilters = (
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allNetworkFilters'],
  queryFn: async () => {
    const res = await ApiManager.findAllNetworkFilters();
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
    Logger.debug(`RQHook > useAllTemplatesFromVnicProfiles ... res: `, _res);
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
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allStorageDomains'],
  queryFn: async () => {
    const res = await ApiManager.findAllStorageDomains()
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
    Logger.debug(`RQHook > useAllStorageDomains ... res: `, _res);
    return _res;
  }
})
/**
 * @name useStroageDomain
 * @description 도메인 상세조회 useQuery 훅
 * 
 * @param {string} domainId 도메인 ID
 * @returns useQuery 훅
 */
export const useStroageDomain = (storageDomainId) => useQuery({
  queryKey: ['DomainById', storageDomainId],
  queryFn: async () => {
    const res = await ApiManager.findDomain(storageDomainId);
    const _res = validate(res) ?? {};
    Logger.debug(`RQHook > useStroageDomain ... storageDomainId: ${storageDomainId}, res: `, _res);
    return _res;
  },
  enabled: !!storageDomainId,
  staleTime: 0,
  cacheTime: 0,
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
export const useAllActiveDomainsFromDataCenter = (
  dataCenterId, 
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['AllActiveDomainsFromDataCenter', dataCenterId], 
  queryFn: async () => {
    const res = await ApiManager.findActiveDomainFromDataCenter(dataCenterId);
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
    Logger.debug(`RQHook > useAllActiveDomainsFromDataCenter ... dataCenterId: ${dataCenterId}, res: `, _res);
    return _res;
  },
  enabled: !!dataCenterId,
})

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
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allDataCentersFromDomain', storageDomainId], 
  queryFn: async () => {
    const res = await ApiManager.findAllDataCentersFromDomain(storageDomainId);
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
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
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  queryKey: ['allHostsFromDomain', storageDomainId],
  queryFn: async () => {
    const res = await ApiManager.findAllHostsFromDomain(storageDomainId);
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
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
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allVMsFromDomain', storageDomainId], 
  queryFn: async () => {
    const res = await ApiManager.findAllVMsFromDomain(storageDomainId);
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
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
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  // queryKey: ['AllVMFromDomain', storageDomainId], 
  queryFn: async () => {
    const res = await ApiManager.findAllUnregisterdVMsFromDomain(storageDomainId);
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
    Logger.debug(`RQHook > useAllUnregisteredVMsFromDomain ... storageDomainId: ${storageDomainId}, res: `, _res);
    return _res;
  },
  enabled: !!storageDomainId,
  staleTime: 0,
  cacheTime: 0,
})
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
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allDisksFromDomain', storageDomainId], 
  queryFn: async () => {
    const res = await ApiManager.findAllDisksFromDomain(storageDomainId);
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
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
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allUnregisteredDisksFromDomain', storageDomainId], 
  queryFn: async () => {
    const res = await ApiManager.findAllUnregisteredDisksFromDomain(storageDomainId);
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({storageDomainId, diskId}) => {
      const res = await ApiManager.registeredDiskFromDomain(storageDomainId, diskId);
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useDeleteVnicProfile ... storageDomainId: ${storageDomainId}, diskId: ${diskId}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useDeleteVnicProfile ... res: `, res);
      queryClient.invalidateQueries('allStorageDomains');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
      postError && postError(error);
    },
  });
};
/**
 * @name useDeletRegisteredDiskFromDomain
 * @description 도메인 디스크 불러오기 삭제
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useDeletRegisteredDiskFromDomain = (
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({ 
    mutationFn: async ({storageDomainId, diskId}) => {
      const res = await ApiManager.deleteRegisteredDiskFromDomain(storageDomainId, diskId);
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useDeletRegisteredDiskFromDomain ... storageDomainId: ${storageDomainId}, diskId: ${diskId}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useDeletRegisteredDiskFromDomain ... res: `, res);
      queryClient.invalidateQueries('allStorageDomains');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allTemplatesFromDomain', storageDomainId], 
  queryFn: async () => {
    const res = await ApiManager.findAllTemplatesFromDomain(storageDomainId);
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
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
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allUnregisteredTemplatesFromDomain', storageDomainId], 
  queryFn: async () => {
    const res = await ApiManager.findAllUnregisteredTemplatesFromDomain(storageDomainId);
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
    Logger.debug(`RQHook > useAllUnregisteredTemplatesFromDomain ... storageDomainId: ${storageDomainId}, res: `, _res);
    return _res;
  },
  enabled: !!storageDomainId,
})
/**
 * @name useAllDiskProfilesFromDomain
 * @description 도메인 내 디스크 프로파일 목록조회 useQuery훅
 * 
 * @param {string} storageDomainId 도메인ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllDataCenterFromDomain
 */
export const useAllDiskProfilesFromDomain = (
  storageDomainId, 
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allDiskProfilesFromDomain', storageDomainId],
  queryFn: async () => {
    const res = await ApiManager.findAllDiskProfilesFromDomain(storageDomainId);
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
    Logger.debug(`RQHook > useAllDiskProfilesFromDomain ... storageDomainId: ${storageDomainId}, res: `, _res);
    return _res;
  },
  enabled: !!storageDomainId, // storageDomainId가 있을 때만 쿼리 실행
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
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['AllDiskSnapshotFromDomain', storageDomainId], 
  queryFn: async () => {
    const res = await ApiManager.findAllDiskSnapshotsFromDomain(storageDomainId);
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
    Logger.debug(`RQHook > useAllDiskSnapshotsFromDomain ... storageDomainId: ${storageDomainId}, res: `, _res);
    return _res;
  },
  enabled: !!storageDomainId,
  staleTime: 0,
  cacheTime: 0,
})
/**
 * @name useAllEventsFromDomain
 * @description 도메인 내 이벤트 목록조회 useQuery훅
 * 
 * @param {string} storageDomainId 도메인ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllDataCenterFromDomain
 */
export const useAllEventsFromDomain = (
  storageDomainId, 
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['AllEventFromDomain', storageDomainId], 
  queryFn: async () => {
    if(storageDomainId === '') return [];
    const res = await ApiManager.findAllEventsFromDomain(storageDomainId);
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
    Logger.debug(`RQHook > useAllEventsFromDomain ... storageDomainId: ${storageDomainId}, res: `, _res);
    return _res;
  },
  enabled: !!storageDomainId,
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
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allActiveDataCenters'], 
  queryFn: async () => {
    const res = await ApiManager.findActiveDataCenters();
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (domainData) => {
      const res = await ApiManager.addDomain(domainData);
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useAddDomain ... domainData: ${JSON.stringify(domainData, null ,2)}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useAddDomain ... res: ${JSON.stringify(res, null ,2)}`);
      queryClient.invalidateQueries('allStorageDomains');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (domainData) => {
      const res = await ApiManager.importDomain(domainData)
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useImportDomain ... domainData: ${JSON.stringify(domainData, null ,2)}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useImportDomain ... res: ${JSON.stringify(res, null ,2)}`);
      queryClient.invalidateQueries('allStorageDomains,domainsFromDataCenter');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ domainId, domainData }) => {
      const res = await ApiManager.editDomain(domainId, domainData)
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useEditDomain ... domainId: ${domainId}, domainData: ${JSON.stringify(domainData, null ,2)}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useEditDomain ... res: ${JSON.stringify(res, null ,2)}`);
      queryClient.invalidateQueries('allStorageDomains,domainsFromDataCenter');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({ 
    mutationFn: async ({domainId, format, hostName }) => {
      const res = await ApiManager.deleteDomain(domainId, format, hostName);
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useDeleteDomain ... domainId: ${domainId}, format: ${format}, hostName: ${hostName}`);
      return _res;
    },
    onSuccess: (res) => {      
      Logger.debug(`RQHook > useDeleteDomain ... res: ${JSON.stringify(res, null ,2)}`);
      queryClient.invalidateQueries('allStorageDomains,domainsFromDataCenter');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (domainId) => {
      const res = await ApiManager.destroyDomain(domainId);
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useDestroyDomain ... domainId: ${domainId}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useDestroyDomain ... res: ${JSON.stringify(res, null ,2)}`);
      queryClient.invalidateQueries('allStorageDomains,domainsFromDataCenter');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (domainId) => {
      const res = await ApiManager.refreshLunDomain(domainId);
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useRefreshLunDomain ... domainId: ${domainId}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useRefreshLunDomain ... res: ${JSON.stringify(res, null ,2)}`);
      queryClient.invalidateQueries('allStorageDomains');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (domainId) => {
      const res = await ApiManager.updateOvfDomain(domainId);
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useOvfUpdateDomain ... domainId: ${domainId}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useOvfUpdateDomain ... res: ${JSON.stringify(res, null ,2)}`);
      queryClient.invalidateQueries('allStorageDomains');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({domainId, dataCenterId}) => {
      const res = await ApiManager.activateDomain(domainId, dataCenterId);
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useActivateDomain ... domainId: ${domainId}, dataCenterId: ${dataCenterId}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useActivateDomain ... res: ${JSON.stringify(res, null ,2)}`);
      queryClient.invalidateQueries('allStorageDomains,domainsFromDataCenter');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({storageDomainId, dataCenterId}) => {
      const res = await ApiManager.attachDomain(storageDomainId, dataCenterId);
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useActivateDomain ... storageDomainId: ${storageDomainId}, dataCenterId: ${dataCenterId}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useAttachDomain ... res: ${JSON.stringify(res, null ,2)}`);
      queryClient.invalidateQueries('allStorageDomains,domainsFromDataCenter');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({domainId, dataCenterId}) => {
      const res = await ApiManager.detachDomain(domainId, dataCenterId);
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useActivateDomain ... domainId: ${domainId}, dataCenterId: ${dataCenterId}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useDetachDomain ... res: ${JSON.stringify(res, null ,2)}`);
      queryClient.invalidateQueries('allStorageDomains,domainsFromDataCenter');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({domainId, dataCenterId}) => {
      const res = await ApiManager.maintenanceDomain(domainId, dataCenterId);
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useMaintenanceDomain ... domainId: ${domainId}, dataCenterId: ${dataCenterId}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useMaintenanceDomain ... res: ${JSON.stringify(res, null ,2)}`);
      queryClient.invalidateQueries('allStorageDomains,domainsFromDataCenter');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allDisks'],
  queryFn: async () => {
    const res = await ApiManager.findAllDisks()
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
    Logger.debug(`RQHook > useAllDisks ... res: `, _res);
    return _res;
  },
  // staleTime: 2000, // 2초 동안 데이터 재요청 방지
})
export const useCdromsDisks = (diskIds = []) =>
  useQuery({
    queryFn: async () => {
      const res = await Promise.all(
        diskIds.map((id) => ApiManager.findCdromsDisk(id))
      );
      return res.map((r, idx) => ({
        diskId: diskIds[idx],
        cdroms: validate(r) ?? [],
      }));
    },
    queryKey: ['cdromsForDisks', diskIds],
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
  queryKey: ['disk', diskId],
  queryFn: async () => {
    const res = await ApiManager.findDisk(diskId);
    const _res = validate(res) ?? {};
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
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allVmsFromDisk', diskId], 
  queryFn: async () => {
    const res = await ApiManager.findAllVmsFromDisk(diskId);
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
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
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allStorageDomainsFromDisk', diskId], 
  queryFn: async () => {
    const res = await ApiManager.findAllStorageDomainsFromDisk(diskId); 
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
    Logger.debug(`RQHook > useAllStorageDomainsFromDisk ... diskId: ${diskId}, res: `, _res);
    return _res;
  },
  enabled: !!diskId,
})

/**
 * @name useAddDisk
 * @description Disk 생성 useMutation 훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useAddDisk = (
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (diskData) => {
      const res = await ApiManager.addDisk(diskData);
      const _res = validate(res) ?? {};
      Logger.debug(`RQHook > useAddDisk ... diskData: ${JSON.stringify(diskData, null ,2)}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useAddDisk ... res: `, res);
      queryClient.invalidateQueries('allDisks'); // 호스트 추가 성공 시 'allDHosts' 쿼리를 리패칭하여 목록을 최신화
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  return useMutation({
    mutationFn: async ({ diskId, diskData }) => {
      const res = await ApiManager.editDisk(diskId, diskData);
      const _res = validate(res) ?? {};
      Logger.debug(`RQHook > useEditDisk ... diskId: ${diskId}, diskData: ${JSON.stringify(diskData, null ,2)}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useEditDisk ... res: `, res);
      queryClient.invalidateQueries('allDisks');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({ 
    mutationFn: async (diskId) => {
      const res = await ApiManager.deleteDisk(diskId);
      const _res = validate(res) ?? {};
      Logger.debug(`RQHook > useEditDisk ... diskId: ${diskId}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useDeleteDisk ... res: `, res);
      queryClient.invalidateQueries('allDisks');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (diskData) => {
      const res = await ApiManager.uploadDisk(diskData, inProgress);
      const _res = validate(res) ?? {};
      Logger.debug(`RQHook > useUploadDisk ... diskData: ${JSON.stringify(diskData, null, 2)}`);
      toast.success(`[200] 디스크 업로드 요청완료`)
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useUploadDisk ... res: `, res);
      queryClient.invalidateQueries('allDisks'); // 호스트 추가 성공 시 'allDHosts' 쿼리를 리패칭하여 목록을 최신화
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({diskId, storageDomainId}) => {
      const res = await ApiManager.moveDisk(diskId, storageDomainId)
      const _res = validate(res) ?? {};
      // Logger.debug(`RQHook > useMoveDisk ... diskData: ${JSON.stringify(diskId, storageDomainId, null, 2)}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useMoveDisk ... res: `, res);
      queryClient.invalidateQueries('allDisks'); 
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({diskId, diskImage}) => {
      const res = await ApiManager.copyDisk(diskId, diskImage)
      const _res = validate(res) ?? {};
      Logger.debug(`RQHook > useCopyDisk ... diskImage: ${JSON.stringify(diskImage, null, 2)}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useCopyDisk ... res: `, res);
      queryClient.invalidateQueries('allDisks'); 

      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
      postError && postError(error);
    },
  });
};
//#region: event (이벤트)
/**
 * @name useAllEvents
 * @description 모든 이벤트 목록조회 useQuery훅
 * 
 * @param {function} mapPredicate 
 * @returns useQuery훅
 */
export const useAllEvents = ({
  severityThreshold=null,
  pageNo=null, size=null,
  mapPredicate=(e) => ({ ...e })
}) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allEvents'],
  queryFn: async () => {
    const res = await ApiManager.findAllEvents(severityThreshold, pageNo, size)
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
    Logger.debug(`RQHook > useAllEvents ... res: `, _res);
    return _res;
  }
});
/**
 * @name useAllEventsNormal
 * @description 박스 안 정상 이벤트 목록조회 useQuery훅
 * 
 * @param {function} mapPredicate 
 * @returns useQuery훅
 */
export const useAllEventsNormal = (
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allEventsNormal'],
  queryFn: async () => {
    const res = await ApiManager.findAllEvents(null, 1, 100)
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
    Logger.debug(`RQHook > useAllEventsNormal ... res: `, _res);
    return _res;
  }
});

export const useAllNotiEvents = (
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allNotiEvents'],
  queryFn: async () => {
    const res = await ApiManager.findAllEvents("normal", 1, 40)
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
    Logger.debug(`RQHook > useAllNotiEvents ... res: `, _res);
    return _res;
  }
});

export const useRemoveEvent = (
  eventId, 
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await ApiManager.removeEvent(eventId)
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useRemoveEvent ... eventId: ${eventId}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useRemoveEvent ... res: `, res);
      queryClient.invalidateQueries(['allEvents','allNotiEvents','allEventsNormal']);
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
      postError && postError(error);
    },
  })
}
//#endregion: event

//#region: job
export const useAllJobs = (
  mapPredicate=(e) => ({ ...e })
  ,refetchInterval=5000,
) => {
  return useQuery({
    refetchOnWindowFocus: true,
    refetchInterval: refetchInterval, // 5초
    queryKey: ['allJobs'],
    queryFn: async () => {
      const res = await ApiManager.findAllJobs()
      const _res = mapPredicate
        ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
        : validate(res) ?? [];
      Logger.debug(`RQHook > useAllJobs ... res: `, _res);
      return _res;
    }
  })
}

/**
 * @name useJob
 * @description 작업 상세조회 useQuery훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useJob = (
  jobId,
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['job', jobId],
  queryFn: async () => {
    const res = await ApiManager.findJob(jobId)
    const _res = validate(res) ?? {}
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
  job,
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await ApiManager.addJob(job)
      const _res = validate(res) ?? {}
      toast.success(`[200] 작업 생성 요청 성공`)
      Logger.debug(`RQHook > useAddJob ... job: ${JSON.stringify(job, null ,2)}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useAddJob ... res: `, res);
      queryClient.invalidateQueries('allJobs');
      queryClient.invalidateQueries(['job', res.id]); // 수정된 네트워크 상세 정보 업데이트
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
      postError && postError(error);
    },
  })
}

/**
 * @name useAddJob
 * @description 작업 생성 useQuery훅
 * 
 * @returns {import("@tanstack/react-query").UseMutationResult} useMutation 훅
 */
export const useEndJob = (
  jobId,
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await ApiManager.endJob(jobId)
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useAddJob ... jobId: ${jobId}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useAddJob ... res: `, res);
      queryClient.invalidateQueries('allJobs');
      queryClient.invalidateQueries(['job', jobId]); // 수정된 네트워크 상세 정보 업데이트
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
      postError && postError(error);
    },
  })
}
//#endregion: job


//#region: User
/**
 * @name useAllUsers
 * @description 모든 사용자 목록조회 useQuery훅
 * 
 * @param {function} mapPredicate 
 * @returns useQuery훅
 */
export const useAllUsers = (
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allUsers'],
  queryFn: async () => {
    const res = await ApiManager.findAllUsers();
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
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
  exposeDetail=false
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['user'],
  queryFn: async () => {
    const res = await ApiManager.findUser(username, exposeDetail)
    const _res = validate(res) ?? {}
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
  username, password, 
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await ApiManager.authenticate(username, password)
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useAuthenticate ... username: ${username}, password: ${password}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useAuthenticate ... res: `, res);
      if (!res) throw Error("[403] 로그인에 실패했습니다. 사용자ID 또는 비밀번호가 다릅니다.")
      queryClient.invalidateQueries('allUsers,user');
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await ApiManager.addUser(user)
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useAddUser ... user: ${JSON.stringify(user, null ,2)}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useAddUser ... res: `, res);
      toast.success("사용자 생성 성공")
      queryClient.invalidateQueries('allUsers,user');
      queryClient.invalidateQueries(['user', user.username]); // 수정된 네트워크 상세 정보 업데이트
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await ApiManager.editUser(user)
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useEditUser ... user: ${JSON.stringify(user, null ,2)}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useEditUser ... res: `, res);
      toast.success("사용자 편집 성공")
      queryClient.invalidateQueries('allUsers');
      queryClient.invalidateQueries(['user', user.username]); // 수정된 네트워크 상세 정보 업데이트
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
      postError && postError(error);
    },
  });
};
export const useUpdatePasswordUser = (
  username, 
  pwCurrent, pwNew,
  force=false,
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await ApiManager.updatePassword(username, pwCurrent, pwNew, force)
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useChangePasswordUser ... username: ${username}, force: ${force}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useChangePasswordUser ... res: `, res);
      toast.success("사용자 비밀번호 변경 성공")
      queryClient.invalidateQueries('allUsers');
      queryClient.invalidateQueries(['user', username]); // 수정된 네트워크 상세 정보 업데이트
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
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
  postSuccess=()=>{},postError
) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (username) => {
      const res = await ApiManager.removeUser(username)
      const _res = validate(res) ?? {}
      Logger.debug(`RQHook > useRemoveUser ... username: ${username}`);
      return _res;
    },
    onSuccess: (res) => {
      Logger.debug(`RQHook > useRemoveUser ... res: `, res);
      toast.success("사용자 삭제 성공")
      queryClient.invalidateQueries('allUsers,user');
      queryClient.invalidateQueries(['user', username]); // 수정된 네트워크 상세 정보 업데이트
      postSuccess(res);
    },
    onError: (error) => {
      Logger.error(error.message);
      toast.error(error.message);
      postError && postError(error);
    },
  })
};
//#endregion: User

//#region: UserSession
/**
 * @name useAllUserSessions
 * @description 모든 활성 사용자 세션션 목록조회 useQuery훅
 * 
 * @param {function} mapPredicate 
 * @returns useQuery훅
 */
export const useAllUserSessions = (
  username="",
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allUserSessions'],
  queryFn: async () => {
    const res = await ApiManager.findAllUserSessions(username)
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
    Logger.debug(`RQHook > useAllUserSessions ... username: ${username} res: `, _res);
    return _res;
  }
})
//#endregion: UserSession

//#region: Certificate(s)
export const useAllCerts = (
  mapPredicate=(e) => ({ ...e })
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allCerts'],
  queryFn: async () => {
    Logger.debug(`useUser ...`);
    const res = await ApiManager.findAllCerts()
    const _res = mapPredicate
      ? validate(res)?.map(mapPredicate) ?? [] // 데이터 가공
      : validate(res) ?? [];
    Logger.debug(`RQHook > useAllCerts ... res: `, _res);
    return _res;
  }
})
export const useCert = (
  id
) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['cert'],
  queryFn: async () => {
    Logger.debug(`useCert ... id: ${id}`);
    const res = await ApiManager.findCert(id)
    const _res = validate(res) ?? {}
    Logger.debug(`RQHook > useCert ... id: ${id}, res: `, _res);
    return _res;
  }
})
//#endregion: Certificate(s)

const validate = (res) => {
  if (res?.head?.code !== 200) {
    throw new Error(res?.head?.message || '알 수 없는 오류');
  }
  return res?.body;
}
