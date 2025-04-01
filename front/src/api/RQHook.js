import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ApiManager from "./ApiManager";
import toast from "react-hot-toast";
import Localization from "../utils/Localization";
import Logger from "../utils/Logger";

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
export const useAllTreeNavigations = (type = "none", mapPredicate=null) => {
  return useQuery({
    refetchOnWindowFocus: true,
    queryKey: ['allTreeNavigations', type],  // queryKey에 type을 포함시켜 type이 변경되면 데이터를 다시 가져옴
    queryFn: async () => {
      Logger.debug(`[allTreeNavigations] useAllTreeNavigations ... `);
      const res = await ApiManager.findAllTreeNaviations(type);  // type을 기반으로 API 호출
      return mapPredicate 
        ? validate(res)?.map((e) => mapPredicate(e)) ?? [] // 데이터 가공 처리
        : validate(res) ?? []; // 기본 데이터 반환
    }
  });
};
//#endregion

//#region: Dashboard
export const useDashboard = (mapPredicate=null) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['dashboard'],
  queryFn: async () => {
    Logger.debug(`[dashboard] useDashboard ...`);
    const res = await ApiManager.getDashboard()
    return validate(res)
  }
}); 

export const useDashboardCpuMemory = (mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['dashboardCpuMemory'],
  queryFn: async () => {
    Logger.debug(`useDashboardCpuMemory ...`);
    const res = await ApiManager.getCpuMemory()
    return validate(res) ?? []
    // return validate(res)?.map((e) => mapPredicate(e)) ?? []
  }
});
export const useDashboardStorage = (mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['dashboardStorage'],
  queryFn: async () => {
    const res = await ApiManager.getStorage()
    return validate(res) ?? []
    // return validate(res)?.map((e) => mapPredicate(e)) ?? []
  }
});
export const useDashboardHosts = (mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['dashboardHosts'],
  queryFn: async () => {
    Logger.debug(`useDashboardHosts ...`);
    const res = await ApiManager.getHosts()
    return validate(res) ?? []
    // return validate(res)?.map((e) => mapPredicate(e)) ?? []
  }
});
export const useDashboardDomain = (mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['dashboardDomain'],
  queryFn: async () => {
    Logger.debug(`useDashboardDomain ...`);
    const res = await ApiManager.getDomain()
    
    return validate(res) ?? []
    // return validate(res)?.map((e) => mapPredicate(e)) ?? []
  }
});
export const useDashboardHost = (hostId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['dashboardHost'],
  queryFn: async () => {
    Logger.debug(`useDashboardHost ...`, hostId);
    const res = await ApiManager.getHost(hostId)
    
    return validate(res) ?? []
    // return validate(res)?.map((e) => mapPredicate(e)) ?? []
  }
});
export const useDashboardVmCpu = (mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['dashboardVmCpu'],
  queryFn: async () => {
    Logger.debug(`useDashboardVmCpu ...`);
    const res = await ApiManager.getVmCpu()
    
    return validate(res) ?? []
    // return validate(res)?.map((e) => mapPredicate(e)) ?? []
  }
});
export const useDashboardVmMemory = (mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['dashboardVmMemory'],
  queryFn: async () => {
    Logger.debug(`useDashboardVmMemory ...`);
    const res = await ApiManager.getVmMemory()
    
    return validate(res) ?? []
    // return validate(res)?.map((e) => mapPredicate(e)) ?? []
  }
});
export const useDashboardStorageMemory = (mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['dashboardStorageMemory'],
  queryFn: async () => {
    Logger.debug(`useDashboardStorageMemory ...`);
    const res = await ApiManager.getStorageMemory()
    
    return validate(res) ?? []
    // return validate(res)?.map((e) => mapPredicate(e)) ?? []
  }
});

export const useDashboardPerVmCpu = (mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['dashboardPerVmCpu'],
  queryFn: async () => {
    Logger.debug(`dashboardPerVmCpu ...`);
    const res = await ApiManager.getPerVmCpu()
    
    return validate(res) ?? []
    // return validate(res)?.map((e) => mapPredicate(e)) ?? []
  }
});
export const useDashboardPerVmMemory = (mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['dashboardPerVmMemory'],
  queryFn: async () => {
    Logger.debug(`dashboardPerVmMemory ...`);
    const res = await ApiManager.getPerVmMemory()
    
    return validate(res) ?? []
    // return validate(res)?.map((e) => mapPredicate(e)) ?? []
  }
});
export const useDashboardPerVmNetwork = (mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['dashboardPerVmNetwork'],
  queryFn: async () => {
    Logger.debug(`dashboardPerVmNetwork ...`);
    const res = await ApiManager.getPerVmNetwork()
    
    return validate(res) ?? []
    // return validate(res)?.map((e) => mapPredicate(e)) ?? []
  }
});

export const useDashboardMetricVmCpu = (mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['dashboardMetricVmCpu'],
  queryFn: async () => {
    Logger.debug(`useDashboardMetricVmCpu ...`);
    const res = await ApiManager.getMetricVmCpu()
    return validate(res) ?? []
  }
});
export const useDashboardMetricVmMemory = (mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['dashboardMetricVmMemory'],
  queryFn: async () => {
    Logger.debug(`useDashboardMetricVmMemory ...`);
    const res = await ApiManager.getMetricVmMemory()
    return validate(res) ?? []
  }
});
export const useDashboardMetricStorage = (mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['dashboardMetricStorage'],
  queryFn: async () => {
    Logger.debug(`useDashboardMetricStorage ...`);
    const res = await ApiManager.getMetricStorage()
    return validate(res) ?? []
  }
});
//#endregion


//#region: DataCenter ----------------데이터센터----------------
/**
 * @name useAllDataCenters
 * @description 데이터센터 목록조회 useQuery훅
 *
 * @param {function} mapPredicate 객체 변형 처리
 * 
 * @see ApiManager.findAllDataCenters
 */
export const useAllDataCenters = (mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allDataCenters'],
  queryFn: async () => {
    Logger.debug(`useAllDataCenters ...`);
    const res = await ApiManager.findAllDataCenters()
    
    return validate(res)?.map((e) => mapPredicate(e)) ?? []
  }
});
/**
 * @name useDataCenter
 * @description 데이터센터 정보 useQuery훅
 *
 * @param {function} mapPredicate 객체 변형 처리
 * @see ApiManager.findDataCenter
 */
export const useDataCenter = (dataCenterId) => useQuery({
  refetchOnWindowFocus: true,  // 윈도우가 포커스될 때마다 데이터 리프레시
  queryKey: ['dataCenter', dataCenterId],  // queryKey에 dataCenterId를 포함시켜 dataCenterId가 변경되면 다시 요청
  queryFn: async () => {
    Logger.debug(`useDataCenter ...`);
    const res = await ApiManager.findDataCenter(dataCenterId);  // dataCenterId에 따라 API 호출
    return validate(res) ?? {};  // 데이터를 반환, 없는 경우 빈 객체 반환
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
export const useClustersFromDataCenter = (dataCenterId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['clustersFromDataCenter', dataCenterId], 
  queryFn: async () => {
    Logger.debug(`clustersFromDataCenter ...`);
    const res = await ApiManager.findAllClustersFromDataCenter(dataCenterId); 
    return validate(res)?.map(mapPredicate) ?? []; // 데이터 가공
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
export const useHostsFromDataCenter = (dataCenterId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['hostsFromDataCenter', dataCenterId], 
  queryFn: async () => {
    // if(dataCenterId === '') return [];
    Logger.debug(`hostsFromDataCenter ... ${dataCenterId}`);
    const res = await ApiManager.findAllHostsFromDataCenter(dataCenterId); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
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
export const useVMsFromDataCenter = (dataCenterId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['vmsFromDataCenter', dataCenterId], 
  queryFn: async () => {
    Logger.debug(`vmsFromDataCenter ... ${dataCenterId}`);
    const res = await ApiManager.findAllVmsFromDataCenter(dataCenterId); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
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
export const useDomainsFromDataCenter = (dataCenterId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['domainsFromDataCenter', dataCenterId], 
  queryFn: async () => {
    Logger.debug(`domainsFromDataCenter ... ${dataCenterId}`);
    const res = await ApiManager.findAllDomainsFromDataCenter(dataCenterId); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
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
export const useNetworksFromDataCenter = (dataCenterId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['networksFromDataCenter', dataCenterId], 
  queryFn: async () => {
    Logger.debug(`networksFromDataCenter ... ${dataCenterId}`);
    const res = await ApiManager.findAllNetworksFromDataCenter(dataCenterId); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
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
export const useEventsFromDataCenter = (dataCenterId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['eventsFromDataCenter', dataCenterId], 
  queryFn: async () => {
    Logger.debug(`eventsFromDataCenter ... ${dataCenterId}`);
    const res = await ApiManager.findAllEventsFromDataCenter(dataCenterId); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
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
export const useFindTemplatesFromDataCenter = (dataCenterId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['findTemplatesFromDataCenter', dataCenterId ], 
  queryFn: async () => {
    Logger.debug(`findTemplatesFromDataCenter ...`, dataCenterId);
    const res = await ApiManager.findTemplatesFromDataCenter(dataCenterId); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
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
export const useFindDiskListFromDataCenter = (dataCenterId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['FindDiskListFromDataCenter', dataCenterId ], 
  queryFn: async () => {
    Logger.debug(`FindDiskListFromDataCenter ...`, dataCenterId);
    const res = await ApiManager.findDiskListFromDataCenter(dataCenterId); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
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
export const useCDFromDataCenter = (dataCenterId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['CDFromDataCenter', dataCenterId], 
  queryFn: async () => {
    // Logger.debug(`useCDFromDataCenter ...`, dataCenterId);
    const res = await ApiManager.findAllISOFromDataCenter(dataCenterId); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
  },
  enabled: !!dataCenterId, 
});
/**
 * @name useAllvnicFromDataCenter
 * @description  가상머신 생성창-nic목록 목록조회 useQuery훅
 * 
 * @param {string} dataCenterId 데이터센터 id
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findVNicFromDataCenter
 */
export const useAllvnicFromDataCenter = (dataCenterId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['AllnicFromVM', dataCenterId], 
  queryFn: async () => {
    const res = await ApiManager.findVNicFromDataCenter(dataCenterId); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; 
  },
  enabled: !!dataCenterId, 
  staleTime: 0,
  cacheTime: 0,
})


/**
 * @name useAddDataCenter
 * @description 데이터센터 생성 useMutation 훅
 * 
 * @returns useMutation 훅
 * @see ApiManager.addDataCenter
 */
export const useAddDataCenter = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (dataCenterData) => await ApiManager.addDataCenter(dataCenterData),
    onSuccess: (data) => {
      Logger.debug('VM 생성데이터:', data);
      queryClient.invalidateQueries('allDataCenters'); // 데이터센터 추가 성공 시 'allDataCenters' 쿼리를 리패칭하여 목록을 최신화
      postSuccess()
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};
/**
 * @name useEditDataCenter
 * @description 데이터센터 수정 useMutation 훅
 * 
 * @returns useMutation 훅
 * @see ApiManager.editDataCenter
 */
export const useEditDataCenter = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  
  return useMutation({
    mutationFn: async ({ dataCenterId, dataCenterData }) => await ApiManager.editDataCenter(dataCenterId, dataCenterData),
    onSuccess: () => {
      queryClient.invalidateQueries('allDataCenters');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};
/**
 * @name useDeleteDataCenter
 * @description 데이터센터 삭제 useMutation 훅
 * 
 * @returns useMutation 훅
 * @see ApiManager.deleteDataCenter
 */
export const useDeleteDataCenter = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({ 
    mutationFn: async (dataCenterId) => await ApiManager.deleteDataCenter(dataCenterId),
    onSuccess: () => {
      queryClient.invalidateQueries('allDataCenters');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};

//#endregion: DataCenter


//#region: Cluster ----------------클러스터---------------------
/**
 * @name useAllClusters
 * @description 클러스터 목록조회 useQuery훅
 * 
 * @param {function} mapPredicate 객체 변형 처리
 * @see ApiManager.findAllClusters
 */
export const useAllClusters = (mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allClusters'],
  queryFn: async () => {
    Logger.debug(`useAllClusters ...`);
    const res = await ApiManager.findAllClusters()
    
    return validate(res)?.map((e) => mapPredicate(e)) ?? []
  }
})
/**
 * @name useAllUpClusters
 * @description 클러스터 (dc status=up) 목록조회 useQuery훅
 * 
 * @param {function} mapPredicate 객체 변형 처리
 * @see ApiManager.findAllUpClusters
 */
export const useAllUpClusters = (mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allClusters'],
  queryFn: async () => {
    Logger.debug(`useAllUpClusters ...`);
    const res = await ApiManager.findAllUpClusters()
    return validate(res)?.map((e) => mapPredicate(e)) ?? []
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
export const useCluster = (clusterId) => useQuery({
  refetchOnWindowFocus: true,  // 윈도우 포커스 시 데이터 리프레시
  queryKey: ['cluster', clusterId],  // queryKey에 clusterId를 포함시켜 clusterId가 변경되면 다시 요청
  queryFn: async () => {
    // if (!clusterId) return {};  // clusterId가 없을 때 빈 객체 반환
    Logger.debug(`useCluster ... ${clusterId}`);
    const res = await ApiManager.findCluster(clusterId);  // clusterId에 따라 API 호출
    return validate(res) ?? {};  // 반환값이 없으면 빈 객체 반환
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
export const useNetworkFromCluster = (clusterId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['networkFromCluster', clusterId], 
  queryFn: async () => {
    Logger.debug(`테스트해보기useNetworkFromCluster ... ${clusterId}`);
    const res = await ApiManager.findNetworksFromCluster(clusterId); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
  },
  enabled: !!clusterId, 
})
/**
 * @name useHostFromCluster
 * @description 클러스터 내 호스트 목록조회 useQuery훅
 * 
 * @param {string} clusterId 클러스터ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findHostsFromCluster
 */
export const useHostFromCluster = (clusterId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['hostsFromCluster', clusterId], 
  queryFn: async () => {
    Logger.debug(`useHostFromCluster ... ${clusterId}`);
    const res = await ApiManager.findHostsFromCluster(clusterId); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
  },
  enabled: !!clusterId, 
  staleTime: 0,
  cacheTime: 0,
})

/**
 * @name useVMFromCluster
 * @description 클러스터 내 가상머신 목록조회 useQuery훅
 * 
 * @param {string} clusterId 클러스터ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findVMsFromCluster
 */
export const useVMFromCluster = (clusterId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['vmsFromCluster', clusterId], 
  queryFn: async () => {
    Logger.debug(`useVMFromCluster ... ${clusterId}`);
    const res = await ApiManager.findVMsFromCluster(clusterId); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
  }
})
// /**
//  * @name usePermissionFromCluster
//  * @description 클러스터 내 권한 목록조회 useQuery훅
//  * 
//  * @param {string} clusterId 클러스터ID
//  * @param {function} mapPredicate 목록객체 변형 처리
//  * @returns useQuery훅
//  * 
//  * @see ApiManager.findPermissionsFromCluster
//  */
// export const usePermissionFromCluster = (clusterId, mapPredicate) => useQuery({
//   refetchOnWindowFocus: true,
//   queryKey: ['permissionsFromCluster', clusterId], 
//   queryFn: async () => {
//     Logger.debug(`usePermissionromCluster ... ${clusterId}`);
//     const res = await ApiManager.findPermissionsFromCluster(clusterId); 
//     return validate(res)?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
//   }
// })

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
export const useCpuProfilesFromCluster = (clusterId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['cpuProfilesFromCluster', clusterId], 
  queryFn: async () => {
    Logger.debug(`useHostFromCluster ... ${clusterId}`);
    const res = await ApiManager.findCpuProfilesFromCluster(clusterId); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
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
export const useOsSystemsFromCluster = (clusterId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['osSystemsFromCluster', clusterId], 
  queryFn: async () => {
    Logger.debug(`useOsSystemsFromCluster ... ${clusterId}`);
    const res = await ApiManager.findOsSystemsFromCluster(clusterId); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
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
export const useEventFromCluster = (clusterId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['eventsFromCluster', clusterId], 
  queryFn: async () => {
    Logger.debug(`useEventFromCluster ... ${clusterId}`);
    const res = await ApiManager.findEventsFromCluster(clusterId); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
  },
  enabled: !!clusterId, 
})

/**
 * @name useAddCluster
 * @description 클러스터 생성 useMutation 훅
 * 
 * @returns useMutation 훅
 * @see ApiManager.addCluster
 */
export const useAddCluster = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (clusterData) => await ApiManager.addCluster(clusterData),
    onSuccess: () => {
      queryClient.invalidateQueries('allClusters,clustersFromDataCenter');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};
/**
 * @name useEditCluster
 * @description 클러스터 수정 useMutation 훅
 * 
 * @returns useMutation 훅
 * @see ApiManager.editCluster
 */
export const useEditCluster = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  
  return useMutation({
    mutationFn: async ({ clusterId, clusterData }) => await ApiManager.editCluster(clusterId, clusterData),
    onSuccess: () => {
      queryClient.invalidateQueries('allClusters,clustersFromDataCenter');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};
/**
 * @name useDeleteCluster
 * @description 클러스터 삭제 useMutation 훅
 * 
 * @returns useMutation 훅
 * @see ApiManager.deleteCluster
 */
export const useDeleteCluster = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({ 
    mutationFn: async (clusterId) => await ApiManager.deleteCluster(clusterId),
    onSuccess: () => {
      queryClient.invalidateQueries('allClusters,clustersFromDataCenter');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
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
export const useAllHosts = (mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allHosts'],
  queryFn: async () => {
    const res = await ApiManager.findAllHosts()
    
    return validate(res)?.map((e) => mapPredicate(e)) ?? []
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
export const useHost = (hostId) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['HostById',hostId],
  queryFn: async () => {
    if (!hostId) throw new Error('Host ID is missing.');
    Logger.debug(`useHost ... ${hostId}`)
    const res = await ApiManager.findHost(hostId)
    return validate(res) ?? {}
  },
  enabled: !!hostId
  // onSuccess: (data) => {
  //   Logger.debug('host data:', data);
  // },
  // onError: (error) => {
  //   Logger.error('API 에러:', error.message);
  // },
})


/**
 * @name useVmFromHost
 * @description 호스트 내 가상머신 목록조회 useQuery훅
 * 
 * @param {string} hostId
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findVmsFromHost
 */
export const useVmFromHost = (hostId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['VmFromHost', hostId], 
  queryFn: async () => {
    Logger.debug(`useVmFromHost ... ${hostId}`);
    const res = await ApiManager.findVmsFromHost(hostId); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
  },
  enabled: !!hostId
})

/**
 * @name useNetworkInterfaceFromHost
 * @description 호스트 내 네트워크인터페이스 목록조회 useQuery훅
 * 
 * @param {string} hostId
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findHostNicsFromHost
 */
export const useNetworkInterfaceFromHost = (hostId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['NetworkInterfaceFromHost', hostId], 
  queryFn: async () => {
    Logger.debug(`useNetworkInterfaceFromHost ... ${hostId}`);
    const res = await ApiManager.findHostNicsFromHost(hostId); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
  },
  enabled: !!hostId
})

/**
 * @name useHostdeviceFromHost
 * @description 호스트 내 호스트장치 목록조회 useQuery훅
 * 
 * @param {string} clusterId 클러스터ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findHostdevicesFromHost
 */
export const useHostdeviceFromHost = (hostId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['HostdeviceFromHost', hostId], 
  queryFn: async () => {
    Logger.debug(`useHostdeviceFromHost ... ${hostId}`);
    const res = await ApiManager.findHostdevicesFromHost(hostId); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
  },
  enabled: !!hostId
})
/**
 * @name useEventFromHost
 * @description 호스트 내 이벤트 목록조회 useQuery훅
 * 
 * @param {string} clusterId 클러스터ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findEventsFromHost
 */
export const useEventFromHost = (hostId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['EventFromHost', hostId], 
  queryFn: async () => {
    Logger.debug(`EventFromHost ... ${hostId}`);
    const res = await ApiManager.findEventsFromHost(hostId); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
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
export const useIscsiFromHost = (hostId, mapPredicate, postSuccess=()=>{}, postError) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['IscsiFromHost', hostId], 
  queryFn: async () => {
    // if(hostId === null) return [];
    Logger.debug(`IscsiFromHost ... ${hostId}`);
    const res = await ApiManager.findAllIscsiFromHost(hostId); 
    const processedData = validate(res)?.map((e) => mapPredicate(e)) ?? [];
    Logger.debug('Processed iSCSI data:', processedData);
    return processedData; // 데이터 가공 후 반환
  },
  enabled: !!hostId,
  onSuccess: (data) => {
    Logger.debug('iSCSI data:', data);
    postSuccess();
  },
  onError: (error) => {
    Logger.error(error.message)
    postError && postError();
  },
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
export const useFibreFromHost = (hostId, mapPredicate, postSuccess=()=>{}, postError) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['fibreFromHost', hostId], 
  queryFn: async () => {
    if(hostId === null) return [];
    Logger.debug(`fibreFromHost ... ${hostId}`);
    const res = await ApiManager.findAllFibreFromHost(hostId); 
    const processedData = validate(res)?.map((e) => mapPredicate(e)) ?? [];
    Logger.debug('Processed Fibre data:', processedData);
    return processedData; // 데이터 가공 후 반환
  },
  enabled: !!hostId,
  onSuccess: (data) => {
    Logger.debug('Fibre data:', data);
    postSuccess();
  },
  onError: (error) => {
    Logger.error(error.message)
    postError && postError();
  },
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
export const useImportIscsiFromHost = (postSuccess=()=>{}, postError) => {
  // const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({hostId, iscsiData}) => await ApiManager.findImportIscsiFromHost(hostId, iscsiData),
    onSuccess: (data) => {
      Logger.debug('iSCSI 가져오기 성공:', data); // 성공한 응답 데이터 출력
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
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
export const useImportFcpFromHost = (postSuccess=()=>{}, postError) => {
  // const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ( { hostId } ) => await ApiManager.findImportFcpFromHost(hostId),
    onSuccess: (data) => {
      Logger.debug('fcp 가져오기 성공:', data);
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
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
export const useLoginIscsiFromHost = (postSuccess=()=>{}, postError) => {
  // const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({hostId, iscsiData}) => await ApiManager.findLoginIscsiFromHost(hostId, iscsiData),
    onSuccess: (data) => {
      Logger.debug('iSCSI 로그인 성공:', data); // 성공한 응답 데이터 출력
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};



/**
 * @name useAddHost
 * @description 호스트 생성 useMutation 훅
 * 
 * @returns useMutation 훅
 * @see ApiManager.addHost
 */
export const useAddHost = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({hostData, deployHostedEngine}) => await ApiManager.addHost(hostData, deployHostedEngine),
    onSuccess: () => {
      queryClient.invalidateQueries('allHosts'); // 호스트 추가 성공 시 'allDHosts' 쿼리를 리패칭하여 목록을 최신화   
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};
/**
 * @name useEditHost
 * @description Host 수정 useMutation 훅
 * 
 * @returns useMutation 훅
 * @see ApiManager.editHost
 */
export const useEditHost = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  
  return useMutation({
    mutationFn: async ({ hostId, hostData }) => await ApiManager.editHost(hostId, hostData),
    onSuccess: () => {
      queryClient.invalidateQueries('allHosts');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};
/**
 * @name useDeleteHost
 * @description Host 삭제 useMutation 훅
 * 
 * @returns useMutation 훅
 * @see ApiManager.deleteHost
 */
export const useDeleteHost = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({ 
    mutationFn: async (hostId) => await ApiManager.deleteHost(hostId),
    onSuccess: () => {
      queryClient.invalidateQueries('allHosts');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};

/**
 * @name useDeactivateHost
 * @description 호스트 유지보수 useMutation 훅
 * 
 * @returns useMutation 훅
 * @see ApiManager.deactivateHost
 */
export const useDeactivateHost = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (hostId) => await ApiManager.deactivateHost(hostId),
    onSuccess: () => {
      Logger.debug(`useDeactivateHost ... `);
      queryClient.invalidateQueries('allHosts');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};

/**
 * @name useActivateHost
 * @description 호스트 활성 useMutation 훅
 * 
 * @returns useMutation 훅
 * @see ApiManager.activateHost
 */
export const useActivateHost = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (hostId) => await ApiManager.activateHost(hostId),
    onSuccess: () => {
      queryClient.invalidateQueries('allHosts');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};

/**
 * @name useRestartHost
 * @description 호스트 재시작 useMutation 훅
 * 
 * @returns useMutation 훅
 * @see ApiManager.restartHost
 */
export const useRestartHost = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (hostId) => await ApiManager.restartHost(hostId),
    onSuccess: () => {
      Logger.debug(`useRestartHost ... `);
      queryClient.invalidateQueries('allHosts');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};
//#endregion: Host

//#region: VM ----------------가상머신---------------------
/**
 * @name useAllVMs
 * @description 가상머신 목록조회 useQuery훅
 * 
 * @param {function} mapPredicate 객체 변형 처리
 * @see ApiManager.findAllVMs
 */
export const useAllVMs = (mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allVMs'],
  queryFn: async () => {
    const res = await ApiManager.findAllVMs()
    
    return validate(res)?.map((e) => mapPredicate(e)) ?? []
  },
  staleTime: 2000, // 2초 동안 데이터 재요청 방지
})
/**
 * @name useVmById
 * @description 가상머신 상세조회 useQuery 훅
 * 
 * @param {string} vmId 가상머신 ID
 * @returns useQuery 훅
 * @see ApiManager.findVM
 */
export const useVmById = (vmId) => useQuery({
  queryKey: ['VmById', vmId],
  queryFn: async () => {
    if (!vmId) return {};  
    Logger.debug(`vmId ID: ${vmId}`);
    const res = await ApiManager.findVM(vmId);
    return validate(res) ?? {};
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
export const useFindEditVmById = (vmId) => useQuery({
  queryKey: ['editVmById', vmId],
  queryFn: async () => {
    if (!vmId) return {};  
    Logger.debug(`vmId ID: ${vmId}`);
    const res = await ApiManager.findEditVM(vmId);
    return validate(res) ?? {};
  },
  enabled: !!vmId
});

// 둘중에 하나 지워야함
/**
 * @name useVm
 * @description 가상머신 상세조회 useQuery 훅
 * 
 * @param {string} vmId 가상머신 ID
 * @returns useQuery 훅
 * * @see ApiManager.findVM
 */
export const useVm = (vmId) => useQuery({
  queryKey: ['VmById', vmId],
  queryFn: async () => {
    if (!vmId) return {};  
    Logger.debug(`vmId ID: ${vmId}`);
    const res = await ApiManager.findVM(vmId);
    return validate(res) ?? {};
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
export const useDisksFromVM = (vmId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['DisksFromVM', vmId], 
  queryFn: async () => {
    Logger.debug(`useDisksFromVM ... ${vmId}`);
    const res = await ApiManager.findDisksFromVM(vmId); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
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
export const useSnapshotsFromVM = (vmId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['SnapshotFromVM', vmId], 
  queryFn: async () => {
    Logger.debug(`useSnapshotFromVM ... ${vmId}`);
    const res = await ApiManager.findSnapshotsFromVM(vmId); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
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
export const useSnapshotDetailFromVM = (vmId, snapshotId) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['SnapshotDetailFromVM', vmId, snapshotId], // snapshotId 추가
  queryFn: async () => {
    if (!vmId || !snapshotId) {
      console.warn('Missing VM ID or Snapshot ID');
      return {};
    }
    Logger.debug(`Fetching snapshot details for VM ID: ${vmId}, Snapshot ID: ${snapshotId}`);
    const res = await ApiManager.findSnapshotFromVm(vmId, snapshotId); 
    return validate(res) ?? {}; 
  },
  enabled: !!vmId
});


/**
 * @name useAddSnapshotFromVM
 * @description 가상머신 스냅샷 생성 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useAddSnapshotFromVM = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    // mutationFn: async ({vmId,snapshotData}) => await ApiManager.addSnapshotFromVM(vmId,snapshotData),
    mutationFn: async ({vmId, snapshotData}) => {
      Logger.debug(`Hook vm: ${vmId}....  ${snapshotData}`)
      return await ApiManager.addSnapshotFromVM(vmId, snapshotData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries('SnapshotFromVM'); // 데이터센터 추가 성공 시 'allDataCenters' 쿼리를 리패칭하여 목록을 최신화
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};

/**
 * @name useDeleteSnapshot
 * @description 가상머신 스냅샷 삭제 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useDeleteSnapshot = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient(); // Query 캐싱을 위한 클라이언트
  return useMutation({
    mutationFn: async ({ vmId, snapshotId }) => {
      Logger.debug('Deleting snapshot:', vmId, snapshotId);
      const res = await ApiManager.deleteSnapshotFromVM(vmId, snapshotId);
      return validate(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('SnapshotFromVM'); // 쿼리 캐시 무효화
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};



/**
 * @name useHostdevicesFromVM
 * @description 가상머신 내 호스트 장치 목록조회 useQuery훅
 * 
 * @param {string} vmId 가상머신ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findHostdevicesFromVM
 */
export const useHostdevicesFromVM = (vmId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['HostdevicesFromVM', vmId], 
  queryFn: async () => {
    Logger.debug(`useHostdevicesFromVM ... ${vmId}`);
    const res = await ApiManager.findHostdevicesFromVM(vmId); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
  },
  enabled: !!vmId, 
  staleTime: 0,
  cacheTime: 0,
});

/**
 * @name useNetworkInterfaceFromVM
 * @description 가상머신 내 네트워크인터페이스 목록조회 useQuery훅
 * 
 * @param {string} vmId 가상머신ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findNicsFromVM
 */
export const useNetworkInterfaceFromVM = (vmId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['NetworkInterfaceFromVM', vmId], 
  queryFn: async () => {
    Logger.debug(`useNetworkInterfaceFromVM... ${vmId}`);
    const res = await ApiManager.findNicsFromVM(vmId); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
  },
  enabled: !!vmId, 
});

/**
 * @name useNetworkInterfaceByVMId
 * @description 가상머신 내 네트워크인터페이스 상세조회 useQuery훅
 * 
 * @param {string} vmId 가상머신ID
 *  * @param {string} nicId 닉ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findNicFromVM
 */
export const useNetworkInterfaceByVMId = (vmId,nicId) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['NetworkInterfaceByVMId', vmId], 
  queryFn: async () => {
    Logger.debug(`useNetworkInterfaceByVMId ... ${vmId}`);
    Logger.debug(`useNetworkInterfaceByVMId ... ${nicId}`);
    const res = await ApiManager.findNicFromVM(vmId,nicId); 
    Logger.debug('API Response:', res); // 반환된 데이터 구조 확인
    return validate(res) ?? {}; 
  },
  enabled: !!vmId, 
  staleTime: 0,
  cacheTime: 0,
});

/**
 * @name useApplicationFromVM
 * @description 가상머신 내 어플리케이션 목록조회 useQuery훅
 * 
 * @param {string} vmId 가상머신ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findApplicationsFromVM
 */
export const useApplicationFromVM = (vmId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['ApplicationFromVM', vmId], 
  queryFn: async () => {
    Logger.debug(`useApplicationFromVM ... ${vmId}`);
    const res = await ApiManager.findApplicationsFromVM(vmId); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
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
export const useAllEventFromVM = (vmId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allEventFromVM', vmId], 
  queryFn: async () => {
    Logger.debug(`useAllEventFromDomain ... ${vmId}`);
    const res = await ApiManager.findEventsFromVM(vmId); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; 
  },
  enabled: !!vmId
})


/**
 * @name useVmConsoleAccessInfo
 * @description 가상머신 콘솔 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useVmConsoleAccessInfo = (vmId, postSuccess=()=>{}, postError) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['vmConsoleAccessInfo', vmId], 
  queryFn: async () => {
    Logger.debug(`useAggregateVmConsole ... ${vmId}`);
    const res = await ApiManager.findVmConsoleAccessInfo(vmId);
    return validate(res);
  },
  enabled: !!vmId
})

/**
 * @name useAddVm
 * @description 가상머신 생성 
 * 
 * @returns useMutation 훅
 */
export const useAddVm = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (vmData) => {
      const res = await ApiManager.addVM(vmData)
      return validate(res);
    },
    onSuccess: (data) => {
      Logger.debug('VM 생성데이터:', data);
      queryClient.invalidateQueries('allVMs'); 
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};
/**
 * @name useEditVm
 * @description 가상머신 수정 
 * 
 * @returns useMutation 훅
 */
export const useEditVm = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ vmId, vmdata }) => {
      const res = await ApiManager.editVM(vmId, vmdata);
      return validate(res);
    },
    onSuccess: (data,{vmId}) => {
      Logger.debug('VM 편집한데이터:', data);
      queryClient.invalidateQueries('allVMs');
      queryClient.invalidateQueries(['vmId', vmId]); // 수정된 네트워크 상세 정보 업데이트
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};

/**
 * @name useDeleteVm
 * @description 가상머신 삭제 useMutation 훅(아이디 잘뜸)
 * 
 * @returns useMutation 훅
 */
export const useDeleteVm = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({ 
    mutationFn: async ({vmId, detachOnly}) => {
      Logger.debug(`Hook vm: ${vmId}....  ${detachOnly}`)
      return await ApiManager.deleteVM(vmId, detachOnly)
    },
    onSuccess: () => {
      queryClient.invalidateQueries('allVMs');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};

/**
 * @name useStartVM
 * @description 가상머신 실행 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useStartVM = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (vmId) => await ApiManager.startVM(vmId),
    onSuccess: () => {
      Logger.debug(`useStartVM ... `);
      queryClient.invalidateQueries('allVMs');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    }, 
  });
};
/**
 * @name usePauseVM
 * @description 가상머신 일시정지 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const usePauseVM = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (vmId) => await ApiManager.pauseVM(vmId),
    onSuccess: () => {
      Logger.debug(`usePauseVM ... `);
      queryClient.invalidateQueries('allVMs');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};

/**
 * @name useShutdownVM
 * @description 가상머신 종료 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useShutdownVM = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (vmId) => await ApiManager.shutdownVM(vmId),
    onSuccess: () => {
      Logger.debug(`useShutdownVM ... `);
      queryClient.invalidateQueries('allVMs');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};
/**
 * @name usePowerOffVM
 * @description 가상머신 전원끔 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const usePowerOffVM = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (vmId) => await ApiManager.powerOffVM(vmId),
    onSuccess: () => {
      Logger.debug(`usePowerOffVM ... `);
      queryClient.invalidateQueries('allVMs');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },  
  });
};

/**
 * @name useRebootVM
 * @description 가상머신 재부팅 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useRebootVM = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (vmId) => await ApiManager.rebootVM(vmId),
    onSuccess: () => {
      Logger.debug(`useRebootVM ... `);
      queryClient.invalidateQueries('allVMs');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    }, 
  });
};
/**
 * @name useResetVM
 * @description 가상머신 재설정 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useResetVM = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (vmId) => await ApiManager.resetVM(vmId),
    onSuccess: () => {
      Logger.debug(`useResetVM ... `);
      queryClient.invalidateQueries('allVMs');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    }, 
  });
};

/**
 * @name useHostsForMigration
 * @description 가상머신 마이그레이션 호스트목록  useQuery훅
 * 
 * @param {string} vmId vmid
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.migrateHostsFromVM
 */
export const useHostsForMigration = (vmId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['HostsForMigration', vmId], 
  queryFn: async () => {
    Logger.debug(`useAllVmsFromTemplate ... ${vmId}`);
    const res = await ApiManager.migrateHostsFromVM(vmId); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
  },
  enabled: !!vmId
})

/**
 * @name useMigration
 * @description 가상머신 마이그레이션 훅
 * 
 * @returns useMutation 훅
 */
export const useMigration = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({vmId,hostId}) => await ApiManager.migrateVM(vmId,hostId),
    onSuccess: () => {
      Logger.debug(`useMigration ... `);
      queryClient.invalidateQueries('HostsForMigration');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};

/**
 * @name useExportVM
 * @description 가상머신 내보내기 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useExportVM = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (vmId) => await ApiManager.exportVM(vmId),
    onSuccess: () => {
      Logger.debug(`useExportVM ... `);
      queryClient.invalidateQueries('allVMs');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};

/**
 * @name useAddNicFromVM
 * @description 가상머신 네트워크 인터페이스 생성 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useAddNicFromVM = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient(); // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({ vmId, nicData }) => {
      Logger.debug('Received vmId:', vmId); // vmId 출력
      Logger.debug('Received nicData:', nicData); // nicData 출력
      return await ApiManager.addNicFromVM(vmId, nicData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('NetworkInterfaceFromVM');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};
/** 수정해야됨
 * @name useEditNicFromVM
 * @description 가상머신 네트워크 인터페이스 수정 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useEditNicFromVM = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  
  return useMutation({
    mutationFn: async ({ vmId, nicId, nicData }) => {
      Logger.debug('EDIT NIC 요청 데이터:', { vmId, nicId, nicData });
      return await ApiManager.editNicFromVM(vmId, nicId, nicData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('NetworkInterfaceFromVM'); 
      queryClient.invalidateQueries(['NetworkInterfaceByVMId']);
      postSuccess();      
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};

/**
 * @name useDeleteNetworkInterface
 * @description 가상머신 네트워크 인터페이스 삭제 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useDeleteNetworkInterface = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({ vmId,nicId}) => {
      // ID들이 제대로 전달되는지 확인하기 위해 로그 추가
      Logger.debug('Deleting VnicProfile with vmId:', vmId);
      Logger.debug('Deleting VnicProfile with nicId:', nicId);
      return await ApiManager.deleteNicFromVM(vmId,nicId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('NetworkInterfaceFromVM');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
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
 * * @see ApiManager.findDiskattachmentFromVM
 */
export const useDiskAttachmentFromVm = (vmId, diskAttachmentId) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['DiskAttachmentFromVm', vmId, diskAttachmentId],
  queryFn: async () => {
    const res = await ApiManager.findDiskattachmentFromVM(vmId, diskAttachmentId);
    return validate(res) ?? {};
  },
  enabled: !!vmId && !!diskAttachmentId,
});



/**
 * @name useAddDiskFromVM
 * @description 가상머신 디스크 생성 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useAddDiskFromVM = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient(); // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({ vmId, diskData }) => {
      Logger.debug(`${Localization.kr.VM} 생성 디스크데이터 diskData: ${diskData}`); // nicData 출력
      return await ApiManager.addDiskFromVM(vmId, diskData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('DisksFromVM');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};

/**
 * @name useEditDiskFromVM
 * @description 가상머신 디스크 수정 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useEditDiskFromVM = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient(); // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({ vmId, diskAttachmentId, diskAttachment }) => {
      Logger.debug(`${Localization.kr.VM} 수정 디스크데이터: ${diskAttachment}`, );
      return await ApiManager.editDiskFromVM(vmId, diskAttachmentId, diskAttachment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('DisksFromVM');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};

/**
 * @name useDeleteDiskFromVM
 * @description 가상머신 디스크 삭제 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useDeleteDiskFromVM = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({ vmId, diskAttachmentId, detachOnly }) => {
      // ID들이 제대로 전달되는지 확인하기 위해 로그 추가
      Logger.debug(`vmId: ${vmId}, diskAttachmentId: ${diskAttachmentId}, detachOnly: ${detachOnly}`);
      await ApiManager.deleteDiskFromVM(vmId, diskAttachmentId, detachOnly);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('DisksFromVM');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};


/**
 * @name useConnDiskFromVM
 * @description 가상머신 디스크 연결 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useConnDiskFromVM = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({ vmId, diskAttachment }) => {
      return await ApiManager.attachDiskFromVM(vmId, diskAttachment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['DisksFromVM']); 
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};

/**
 * @name useConnDiskListFromVM
 * @description 가상머신 디스크 연결 복수 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useConnDiskListFromVM = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({ vmId, diskAttachmentList }) => {
      return await ApiManager.attachDisksFromVM(vmId, diskAttachmentList);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['DisksFromVM']); 
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};

/**
 * @name useDeactivateDiskFromVm
 * @description 가상머신 디스크 비활성화 useMutation 훅
 * 
 * @returns useMutation 훅
 * @see ApiManager.deactivateHost
 */
export const useDeactivateDiskFromVm = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({vmId, diskAttachmentId}) => await ApiManager.deactivateDisksFromVM(vmId, diskAttachmentId),
    onSuccess: () => {
      Logger.debug(`useDeactivateDiskFromVm ... `);
      queryClient.invalidateQueries('allDisksFromVm');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};

/**
 * @name useActivateDiskFromVm
 * @description 가상머신 디스크 활성 useMutation 훅
 * 
 * @returns useMutation 훅
 * @see ApiManager.activateHost
 */
export const useActivateDiskFromVm  = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({vmId, diskAttachmentId}) => await ApiManager.activateDisksFromVM(vmId, diskAttachmentId),
    onSuccess: () => {
      queryClient.invalidateQueries('allDisksFromVm');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    }, 
  });
};


// 보류
// /**
//  * @name useFindDiskFromVM
//  * @description 가상머신 연결한 디스크 useQuery훅
//  * 
//  * @param {string} vmId 가상머신ID
//  *  * @param {string} diskId 디스크 ID
//  * @param {function} mapPredicate 목록객체 변형 처리
//  * @returns useQuery훅
//  * 
//  * @see ApiManager.findNicFromVM
//  */
// export const useFindDiskFromVM = (vmId,diskId) => useQuery({
//   refetchOnWindowFocus: true,
//   queryKey: ['FindDiskFromVM', vmId], 
//   queryFn: async () => {
//     Logger.debug(`useFindDiskFromVM vm아이디... ${vmId}`);
//     Logger.debug(`useFindDiskFromVM 디스크아이디 ... ${diskId}`);
//     const res = await ApiManager.findDiskFromVM(vmId,diskId); 
//     Logger.debug('API Response:', res); // 반환된 데이터 구조 확인
//     return validate(res) ?? {}; 
//   },

// });


//#endregion: VM

//#region: TEMPLATE ----------------템플릿---------------------
/**
 * @name useAllTemplates
 * @description 템플릿 목록조회 useQuery훅
 * 
 * @param {function} mapPredicate 객체 변형 처리
 */
export const useAllTemplates = (mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allTemplates'],
  queryFn: async () => {
    const res = await ApiManager.findAllTemplates()
    
    return validate(res)?.map((e) => mapPredicate(e)) ?? []
  }
});

/**
 * @name useTemplate
 * @description Template 상세조회 useQuery 훅
 * 
 * @param {string} tId Template ID
 * @returns useQuery 훅
 */
export const useTemplate = (tId) => useQuery({
  queryKey: ['tId', tId],
  queryFn: async () => {
    if (!tId) return {};  
    Logger.debug(`Template ID: ${tId}`);
    const res = await ApiManager.findTemplate(tId);
    return validate(res) ?? {};
  },
  enabled: !!tId,
  staleTime: 0,
  cacheTime: 0,
});

/**
 * @name useAllVmsFromTemplate
 * @description Template 내 가상머신 목록조회 useQuery훅
 * 
 * @param {string} tId TemplateID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.useAllVmsFromTemplate
 */
export const useAllVmsFromTemplate = (tId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['AllVmsFromTemplate', tId], 
  queryFn: async () => {
    Logger.debug(`useAllVmsFromTemplate ... ${tId}`);
    const res = await ApiManager.findVMsFromTemplate(tId); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
  },
  enabled: !!tId,
})

/**
 * @name useAllNicsFromTemplate
 * @description Template 내 네트워크 목록조회 useQuery훅
 * 
 * @param {string} tId TemplateID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllVMsFromDomain
 */
export const useAllNicsFromTemplate = (tId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['AllNicsFromTemplate', tId], 
  queryFn: async () => {
    Logger.debug(`useAllNicsFromTemplate ... ${tId}`);
    const res = await ApiManager.findNicsFromTemplate(tId); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; 
  },
  enabled: !!tId,
  staleTime: 0,
  cacheTime: 0,
})

/**
 * @name useAllDisksFromTemplate
 * @description Template 내 디스크 목록조회 useQuery훅
 * 
 * @param {string} tId TemplateID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllVMsFromDomain
 */
export const useAllDisksFromTemplate = (tId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['AllDisksFromTemplate', tId], 
  queryFn: async () => {
    Logger.debug(`useAllDisksFromTemplate ... ${tId}`);
    const res = await ApiManager.findDisksFromTemplate(tId); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; 
  },
  enabled: !!tId,
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
export const useAllStoragesFromTemplate = (tId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['AllStoragesFromTemplate', tId], 
  queryFn: async () => {
    Logger.debug(`useAllStoragesFromTemplate ... ${tId}`);
    const res = await ApiManager.findStorageDomainsFromTemplate(tId); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; 
  },
  enabled: !!tId,
  staleTime: 0,
  cacheTime: 0,
})


/**
 * @name useAllEventFromTemplate
 * @description  Template 내  이벤트 목록조회 useQuery훅
 * 
 * @param {string} tId TemplateID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllDataCenterFromDomain
 */
export const useAllEventFromTemplate = (tId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['AllEventFromTemplate', tId], 
  queryFn: async () => {
    Logger.debug(`useAllEventFromTemplate ... ${tId}`);
    const res = await ApiManager.findEventsFromTemplate(tId); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; 
  },
  enabled: !!tId,
})

/**
 * @name useAddTemplate
 * @description Template 생성 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useAddTemplate = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({vmId, templateData} ) =>{
      Logger.debug(`Hook vm: ${vmId}....  ${templateData}`)
      return await ApiManager.addTemplate(vmId, templateData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries('allTemplates');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};
/**
 * @name useEditTemplate
 * @description Template 수정 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useEditTemplate = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  
  return useMutation({
    mutationFn: async ({ templateId, templateData }) => await ApiManager.editTemplate(templateId, templateData),
    onSuccess: (data, variables) => {
      const { templateId } = variables; // variables에서 templateId 추출
      queryClient.invalidateQueries('allTemplates');
      queryClient.invalidateQueries(['templateId', templateId]); // templateId 올바르게 사용
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};


/**
 * @name useDeleteTemplate
 * @description Template 삭제 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useDeleteTemplate = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({ 
    mutationFn: async (templateId) => await ApiManager.deleteTemplate(templateId),
    onSuccess: () => {
      queryClient.invalidateQueries('allTemplates');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};


/**
 * @name useAddNicFromTemplate
 * @description 템플릿 네트워크 생성 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useAddNicFromTemplate = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({templateId,nicData}) => await ApiManager.addNicFromTemplate(templateId,nicData),
    onSuccess: () => {
      queryClient.invalidateQueries('AllNicsFromTemplate'); // 데이터센터 추가 성공 시 'allDataCenters' 쿼리를 리패칭하여 목록을 최신화
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};
/**
 * @name useEditNicFromTemplate
 * @description 템플릿 네트워크 수정 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useEditNicFromTemplate = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ templateId, nicId, nicData }) => 
      await ApiManager.editNicFromTemplate(templateId, nicId, nicData), // nicId 추가
  
    onSuccess: () => {
      queryClient.invalidateQueries('AllNicsFromTemplate'); // 전체 네트워크 목록 업데이트
      // queryClient.invalidateQueries(['tId', templateId]); // 수정된 네트워크 상세 정보 업데이트
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};


/**
 * @name useDeleteNetworkFromTemplate
 * @description 템플릿 네트워크 삭제 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useDeleteNetworkFromTemplate = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({ templateId,nicId,detachOnly}) => {
      // ID들이 제대로 전달되는지 확인하기 위해 로그 추가
      Logger.debug('삭제할 템플릿id:', templateId );
      Logger.debug('Deleting VnicProfile with nicId:', nicId);
      return await ApiManager.deleteNicFromTemplate(templateId,nicId, detachOnly);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('AllNicsFromTemplate');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};

//#endregion: TEMPLATE



//#region: Network -----------------네트워크---------------------
/**
 * @name useAllNetworks
 * @description 네트워크 목록조회 useQuery훅
 * 
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 */
export const useAllNetworks = (mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allNetworks'],
  queryFn: async () => {
    const res = await ApiManager.findAllNetworks()
    
    return validate(res)?.map((e) => mapPredicate(e)) ?? []
  }
});
/**
 * @name useNetworkById
 * @description 네트워크 상세조회 useQuery 훅
 * 
 * @param {string} networkId 네트워크 ID
 * @returns useQuery 훅
 */
export const useNetworkById = (networkId) => useQuery({
  queryKey: ['networkById', networkId],
  queryFn: async () => {
    if (!networkId) return {};  // networkId가 없는 경우 빈 객체 반환
    Logger.debug(`Fetching network with ID: ${networkId}`);
    const res = await ApiManager.findNetwork(networkId);
    return validate(res) ?? {};
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
export const useAllClustersFromNetwork = (networkId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['clustersFromNetwork', networkId],
  queryFn: async () => {
    Logger.debug(`useAllClustersFromNetwork ... ${networkId}`);
    const res = await ApiManager.findAllClustersFromNetwork(networkId);  // 클러스터 목록을 가져오는 API 호출
    return validate(res)?.map((e) => mapPredicate(e)) ?? [];
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
export const useConnectedHostsFromNetwork = (networkId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['connectedHostsFromNetwork', networkId], 
  queryFn: async () => {
    Logger.debug(`useConnectedHostsFromNetwork ... ${networkId}`);
    const res = await ApiManager.findConnectedHostsFromNetwork(networkId); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
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
export const useDisconnectedHostsFromNetwork = (networkId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['disconnectedHostsFromNetwork', networkId], 
  queryFn: async () => {
    Logger.debug(`useDisconnectedHostsFromNetwork ... ${networkId}`);
    const res = await ApiManager.findDisconnectedHostsFromNetwork(networkId); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
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
export const useAllVmsFromNetwork = (networkId, mapPredicate) => useQuery({
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
export const useAllTemplatesFromNetwork = (networkId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['templateFromNetwork', networkId], 
  queryFn: async () => {
    if (!networkId) {
      throw new Error('Network ID is missing'); 
    }
    Logger.debug(`Fetching templates for Network ID: ${networkId}`);
    const res = await ApiManager.findAllTemplatesFromNetwork(networkId);
    Logger.debug('API Response:', res); // API 응답 확인
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
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
export const useAllVnicProfilesFromNetwork = (networkId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['vnicProfilesFromNetwork', networkId],
  queryFn: async () => {
    if (!networkId) {
      console.warn('networkId가 존재하지 않습니다.');
      return [];
    }
    Logger.debug(`useAllVnicProfilesFromNetwork ... ${networkId}`);
    const res = await ApiManager.findAllVnicProfilesFromNetwork(networkId);
    return validate(res)?.map((e) => mapPredicate(e)) ?? [];
  },
  enabled: !!networkId, 
});

/**
 * @name useAddNetwork
 * @description 네트워크 생성 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useAddNetwork = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (networkData) => await ApiManager.addNetwork(networkData),
    onSuccess: () => {
      queryClient.invalidateQueries('allNetworks'); // 데이터센터 추가 성공 시 'allDataCenters' 쿼리를 리패칭하여 목록을 최신화
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};

/**
 * @name useEditNetwork
 * @description 네트워크 수정 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useEditNetwork = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ networkId, networkData }) => await ApiManager.editNetwork(networkId, networkData),
    onSuccess: (data, { networkId }) => {
      queryClient.invalidateQueries('allNetworks'); // 전체 네트워크 목록 업데이트
      queryClient.invalidateQueries(['networkById', networkId]); // 수정된 네트워크 상세 정보 업데이트
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};

/**
 * @name useDeleteNetwork
 * @description 네트워크 삭제 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useDeleteNetwork = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({ 
    mutationFn: async (networkId) => await ApiManager.deleteNetwork(networkId),
    onSuccess: () => {
      queryClient.invalidateQueries('allNetworks');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
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
export const useAllNetworkProviders = (mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allNetworkProviders'],
  queryFn: async () => {
    const res = await ApiManager.findAllNetworkProviders()
    return validate(res)?.map((e) => mapPredicate(e)) ?? []
  }
});

//#region: VnicProfiles -----------------vnic프로파일---------------------
/**
 * @name useAllVnicProfiles
 * @description 모든 VNIC 프로파일 목록조회 useQuery훅
 * 
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllVnicProfiles
 */
export const useAllVnicProfiles = (mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allVnicProfiles'],
  queryFn: async () => {
    const res = await ApiManager.findAllVnicProfiles()
    return validate(res)?.map((e) => mapPredicate(e)) ?? []
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
    if (!vnicId) return {};  
    Logger.debug(`Fetching vnic profile with ID: ${vnicId}`);
    const res = await ApiManager.findVnicProfile( vnicId);
    return validate(res) ?? {};
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
export const useAllVmsFromVnicProfiles = (vnicProfileId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['AllVmsFromVnicProfiles', vnicProfileId],
  queryFn: async () => {
    Logger.debug(`useAllVmsFromVnicProfiles모든목록조회 ... ${vnicProfileId}`);
    const res = await ApiManager.findAllVmsFromVnicProfiles(vnicProfileId);
    return validate(res)?.map((e) => mapPredicate(e)) ?? [];
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
export const useAllTemplatesFromVnicProfiles = (vnicProfileId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['AllTemplatesFromVnicProfiles', vnicProfileId], 
  queryFn: async () => {
    Logger.debug(`useAllTemplatesFromVnicProfiles ... ${vnicProfileId}`);
    const res = await ApiManager.findAllTemplatesFromVnicProfiles(vnicProfileId); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; 
  },
  enabled: !!vnicProfileId,
  staleTime: 0,
  cacheTime: 0,
})


/**
 * @name useAddVnicProfile
 * @description vnic 새로만들기 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useAddVnicProfile = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (vnicData) => await ApiManager.addVnicProfiles(vnicData),
    onSuccess: () => {
      queryClient.invalidateQueries('allVnicProfiles');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};
/**
 * @name useEditVnicProfile
 * @description vnic 수정 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useEditVnicProfile = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  
  return useMutation({
    mutationFn: async ({vnicId, vnicData }) => await ApiManager.editVnicProfiles(vnicId, vnicData),
    onSuccess: () => {
      queryClient.invalidateQueries('allVnicProfiles');
      postSuccess();
    },
    onError: (error) => {
      Logger.error('Error editing vnic:', error);
    },
  });
};

/**
 * @name useDeleteVnicProfile
 * @description VnicProfile 삭제 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useDeleteVnicProfile = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (vnicProfileId ) => {
      Logger.debug('Deleting VnicProfile with vnicProfileId:', vnicProfileId);
      return await ApiManager.deleteVnicProfiles(vnicProfileId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('allVnicProfiles');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
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
export const useNetworkFilters = (mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allNetworkFilters'],
  queryFn: async () => {
    const res = await ApiManager.findAllNetworkFilters()
    return validate(res)?.map((e) => mapPredicate(e)) ?? []
  }
})
//#region: storage -----------------스토리지---------------------

/**
 * @name useAllStorageDomains
 * @description 모든 스토리지 도메인 목록조회 useQuery훅
 * 
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 */
export const useAllStorageDomains = (mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allStorageDomains'],
  queryFn: async () => {
    const res = await ApiManager.findAllStorageDomains()
    return validate(res)?.map((e) => mapPredicate(e)) ?? []
  }
})
/**
 * @name useDomainById
 * @description 도메인 상세조회 useQuery 훅
 * 
 * @param {string} domainId 도메인 ID
 * @returns useQuery 훅
 */
export const useDomainById = (storageDomainId) => useQuery({
  queryKey: ['DomainById', storageDomainId],
  queryFn: async () => {
    if (!storageDomainId) return {};  
    Logger.debug(`Fetching network with ID: ${storageDomainId}`);
    const res = await ApiManager.findDomain(storageDomainId);
    return validate(res) ?? {};
  },
  enabled: !!storageDomainId,
  staleTime: 0,
  cacheTime: 0,
});
/**
 * @name useAllActiveDomainFromDataCenter
 * @description active 도메인 목록조회 useQuery훅
 * 
 * @param {string} dataCenterId 도메인ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findActiveDomainFromDataCenter
 */
export const useAllActiveDomainFromDataCenter = (dataCenterId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['AllActiveDomainFromDataCenter', dataCenterId], 
  queryFn: async () => {
    if (!dataCenterId) {
      console.warn('dataCenterId is undefined. Skipping API call.');
      return []; // 빈 배열 반환
    }
    Logger.debug(`useAllActiveDomainFromDataCenter ... ${dataCenterId}`);
    const res = await ApiManager.findActiveDomainFromDataCenter(dataCenterId); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; 
  },
  enabled: !!dataCenterId,
})

/**
 * @name useAllDataCenterFromDomain
 * @description 도메인 내 데이터센터 목록조회 useQuery훅
 * 
 * @param {string} storageDomainId 도메인ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllDataCentersFromDomain
 */
export const useAllDataCenterFromDomain = (storageDomainId) => useQuery({
  // refetchOnWindowFocus: true,
  queryKey: ['AllDataCenterFromDomain', storageDomainId], 
  queryFn: async () => {
    Logger.debug(`Fetching datacenters with ID: ${storageDomainId}`);
    const res = await ApiManager.findAllDataCentersFromDomain(storageDomainId);
    return validate(res) ?? '';

    // Logger.debug(`useAllDataCenterFromDomain ... ${storageDomainId}`);
    // const res = await ApiManager.findAllDataCentersFromDomain(storageDomainId); 
    // Logger.debug('API Response:', res);
    // return validate(res)?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
  },
  enabled: !!storageDomainId,
})
/**
 * @name useAllHostFromDomain
 * @description 도메인 내 호스트 목록조회 useQuery훅
 * 
 * @param {string} storageDomainId 도메인ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllDataCentersFromDomain
 */
export const useAllHostFromDomain = (storageDomainId) => useQuery({
  queryKey: ['useAllHostFromDomain', storageDomainId], 
  queryFn: async () => {
    Logger.debug(`Fetching hosts with ID: ${storageDomainId}`);
    const res = await ApiManager.findAllHostsFromDomain(storageDomainId);
    return validate(res) ?? '';
  },
  enabled: !!storageDomainId,
})

/**
 * @name useAllVMFromDomain
 * @description 도메인 내 디스크 목록조회 useQuery훅
 * 
 * @param {string} storageDomainId 도메인ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllVMsFromDomain
 */
export const useAllVMFromDomain = (storageDomainId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['AllVMFromDomain', storageDomainId], 
  queryFn: async () => {
    Logger.debug(`useAllVMFromDomain ... ${storageDomainId}`);
    const res = await ApiManager.findAllVMsFromDomain(storageDomainId); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; 
  },
  enabled: !!storageDomainId,
  staleTime: 0,
  cacheTime: 0,
})

/**
 * @name useAllUnregisteredVMFromDomain
 * @description 도메인 내 가상머신 불러오기 목록조회 useQuery훅
 * 
 * @param {string} storageDomainId 도메인ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllUnregisterdVMsFromDomain
 */
export const useAllUnregisteredVMFromDomain = (storageDomainId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  // queryKey: ['AllVMFromDomain', storageDomainId], 
  queryFn: async () => {
    Logger.debug(`useAllUnregisteredVMFromDomain ... ${storageDomainId}`);
    const res = await ApiManager.findAllUnregisterdVMsFromDomain(storageDomainId); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; 
  },
  enabled: !!storageDomainId,
  staleTime: 0,
  cacheTime: 0,
})
/**
 * @name useAllDiskFromDomain
 * @description 도메인 내 디스크 목록조회 useQuery훅
 * 
 * @param {string} storageDomainId 도메인ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllDataCenterFromDomain
 */
export const useAllDiskFromDomain = (storageDomainId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['AllDiskFromDomain', storageDomainId], 
  queryFn: async () => {
    Logger.debug(`useAllDiskFromDomain ... ${storageDomainId}`);
    const res = await ApiManager.findAllDisksFromDomain(storageDomainId); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; 
  },
  enabled: !!storageDomainId,
})
/**
 * @name useAllUnregisteredDiskFromDomain
 * @description 도메인 내 디스크 가져오기 목록조회 useQuery훅
 * 
 * @param {string} storageDomainId 도메인ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllUnregisteredDisksFromDomain
 */
export const useAllUnregisteredDiskFromDomain = (storageDomainId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['AllUnregisteredDiskFromDomain', storageDomainId], 
  queryFn: async () => {
    Logger.debug(`useAllUnregisteredDiskFromDomain ... ${storageDomainId}`);
    const res = await ApiManager.findAllUnregisteredDisksFromDomain(storageDomainId); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; 
  },
  enabled: !!storageDomainId,
})
/**
 * @name useRegisteredDiskFromDomain
 * @description 도메인 디스크 불러오기
 * 
 * @returns useMutation 훅
 */
export const useRegisteredDiskFromDomain = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({storageDomainId, diskId}) => {
      return await ApiManager.registeredDiskFromDomain(storageDomainId, diskId)
    },
    onSuccess: () => {
      Logger.debug(`domain 디스크 불러오기 성공`)
      queryClient.invalidateQueries('allStorageDomains');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};
/**
 * @name useDeletRegisteredDiskFromDomain
 * @description 도메인 디스크 불러오기 삭제
 * 
 * @returns useMutation 훅
 */
export const useDeletRegisteredDiskFromDomain = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({ 
    mutationFn: async ({storageDomainId, diskId}) => await ApiManager.deleteRegisteredDiskFromDomain(storageDomainId, diskId),
    onSuccess: () => {
      queryClient.invalidateQueries('allStorageDomains');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};
/**
 * @name useAllTemplateFromDomain
 * @description 도메인 내 템플릿 목록조회 useQuery훅
 * 
 * @param {string} storageDomainId 도메인ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllTemplatesFromDomain
 */
export const useAllTemplateFromDomain = (storageDomainId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['AllTemplateFromDomain', storageDomainId], 
  queryFn: async () => {
    Logger.debug(`useAllTemplateFromDomain ... ${storageDomainId}`);
    const res = await ApiManager.findAllTemplatesFromDomain(storageDomainId); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; 
  },
  enabled: !!storageDomainId,
})
/**
 * @name useAllUnregisteredTemplateFromDomain
 * @description 도메인 내 템플릿 불러오기 목록조회 useQuery훅
 * 
 * @param {string} storageDomainId 도메인ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllUnregisteredTemplatesFromDomain
 */
export const useAllUnregisteredTemplateFromDomain = (storageDomainId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['AllUnregisteredTemplateFromDomain', storageDomainId], 
  queryFn: async () => {
    Logger.debug(`useAllUnregisteredTemplateFromDomain ... ${storageDomainId}`);
    const res = await ApiManager.findAllUnregisteredTemplatesFromDomain(storageDomainId); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; 
  },
  enabled: !!storageDomainId,
})
/**
 * @name useAllDiskProfileFromDomain
 * @description 도메인 내 디스크 프로파일 목록조회 useQuery훅
 * 
 * @param {string} storageDomainId 도메인ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllDataCenterFromDomain
 */
export const useAllDiskProfileFromDomain = (storageDomainId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['AllDiskProfileFromDomain', storageDomainId],
  queryFn: async () => {
    if (!storageDomainId) {
      console.warn('storageDomainId is undefined. Skipping API call.');
      return []; // 빈 배열 반환
    }
    Logger.debug(`useAllDiskProfileFromDomain ... ${storageDomainId}`);
    const res = await ApiManager.findAllDiskProfilesFromDomain(storageDomainId);
    return validate(res)?.map((e) => mapPredicate(e)) ?? [];
  },
  enabled: !!storageDomainId, // storageDomainId가 있을 때만 쿼리 실행
});
/**
 * @name useAllDiskSnapshotFromDomain
 * @description 도메인 내 디스크스냅샷 목록조회 useQuery훅
 * 
 * @param {string} storageDomainId 도메인ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllDataCenterFromDomain
 */
export const useAllDiskSnapshotFromDomain = (storageDomainId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['AllDiskSnapshotFromDomain', storageDomainId], 
  queryFn: async () => {
    Logger.debug(`useAllDiskSnapshotFromDomain ... ${storageDomainId}`);
    const res = await ApiManager.findAllDiskSnapshotsFromDomain(storageDomainId); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; 
  },
  enabled: !!storageDomainId,
  staleTime: 0,
  cacheTime: 0,
})
/**
 * @name useAllEventFromDomain
 * @description 도메인 내 이벤트 목록조회 useQuery훅
 * 
 * @param {string} storageDomainId 도메인ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllDataCenterFromDomain
 */
export const useAllEventFromDomain = (storageDomainId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['AllEventFromDomain', storageDomainId], 
  queryFn: async () => {
    if(storageDomainId === '') return [];
    Logger.debug(`useAllEventFromDomain ... ${storageDomainId}`);
    const res = await ApiManager.findAllEventsFromDomain(storageDomainId); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; 
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
export const useAllActiveDataCenters = (mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  // queryKey: ['AllEventFromDomain', storageDomainId], 
  queryFn: async () => {
    Logger.debug(`useAllEventFromDomain ...`);
    const res = await ApiManager.findActiveDataCenters(); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; 
  }
})

/**
 * @name useAddDomain
 * @description 도메인 생성 useMutation 훅(수정해야됨)
 * 
 * @returns useMutation 훅
 */
export const useAddDomain = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (domainData) => await ApiManager.addDomain(domainData),
    onSuccess: () => {
      Logger.debug('domain 생성성공')
      queryClient.invalidateQueries('allStorageDomains');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};

/**
 * @name useImportDomain
 * @description 도메인 가져오기 useMutation 훅(수정해야됨)
 * 
 * @returns useMutation 훅
 */
export const useImportDomain = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (domainData) => await ApiManager.importDomain(domainData),
    onSuccess: () => {
      Logger.debug('domain 가져오기 성공')
      queryClient.invalidateQueries('allStorageDomains,domainsFromDataCenter');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};
/**
 * @name useEditDomain
 * @description 도메인 수정 useMutation 훅(수정해야됨)
 * 
 * @returns useMutation 훅
 */
export const useEditDomain = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ domainId, domainData }) => await ApiManager.editDomain(domainId, domainData),
    onSuccess: () => {
      queryClient.invalidateQueries('allStorageDomains,domainsFromDataCenter');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};

/**
 * @name useDeleteDomain
 * @description 도메인 삭제 useMutation 훅(확인안해봄-생성해보고 삭제해보기)
 * 
 * @returns useMutation 훅
 */
export const useDeleteDomain = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({ 
    mutationFn: async ({domainId, format, hostName}) => {
      Logger.debug(` domainId: ${domainId}, format: ${format}, host: ${hostName}`);
      await ApiManager.deleteDomain(domainId, format, hostName)
    },
    onSuccess: () => {      
      queryClient.invalidateQueries('allStorageDomains,domainsFromDataCenter');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};

/**
 * @name useDestroyDomain
 * @description 도메인파괴 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useDestroyDomain = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (domainId) => await ApiManager.destroyDomain(domainId),
    onSuccess: () => {
      queryClient.invalidateQueries('allStorageDomains,domainsFromDataCenter');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};

/**
 * @name useRefreshLunDomain
 * @description 스토리지 도메인 디스크 검사 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useRefreshLunDomain = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (domainId) => await ApiManager.refreshLunDomain(domainId),
    onSuccess: () => {
      queryClient.invalidateQueries('allStorageDomains');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};

/**
 * @name useOvfUpdateDomain
 * @description 스토리지 도메인 ovf 업데이트 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useOvfUpdateDomain = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (domainId) => await ApiManager.updateOvfDomain(domainId),
    onSuccess: () => {
      queryClient.invalidateQueries('allStorageDomains');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};

/**
 * @name useActivateDomain
 * @description 도메인 활성 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useActivateDomain = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({domainId, dataCenterId}) => await ApiManager.activateDomain(domainId, dataCenterId),
    onSuccess: () => {
      queryClient.invalidateQueries('allStorageDomains,domainsFromDataCenter');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};

/**
 * @name useAttachDomain
 * @description 도메인 연결 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useAttachDomain = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({storageDomainId, dataCenterId}) => await ApiManager.attachDomain(storageDomainId, dataCenterId),
    onSuccess: () => {
      queryClient.invalidateQueries('allStorageDomains,domainsFromDataCenter');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};

/**
 * @name useDetachDomain
 * @description 도메인 분리 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useDetachDomain = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({domainId, dataCenterId}) => await ApiManager.detachDomain(domainId, dataCenterId),
    onSuccess: () => {
      queryClient.invalidateQueries('allStorageDomains,domainsFromDataCenter');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};

/**
 * @name useMaintenanceDomain
 * @description 도메인 유지보수 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useMaintenanceDomain = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({domainId, dataCenterId}) => await ApiManager.maintenanceDomain(domainId, dataCenterId),
    onSuccess: () => {
      queryClient.invalidateQueries('allStorageDomains,domainsFromDataCenter');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};


//#region: storage -----------------디스크---------------------
/**
 * @name useAllDisks
 * @description 모든 디스크목록조회 useQuery훅
 * 
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 */
export const useAllDisks = (mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allDisks'],
  queryFn: async () => {
    const res = await ApiManager.findAllDisks()
    return validate(res)?.map((e) => mapPredicate(e)) ?? [];
  },
  // staleTime: 2000, // 2초 동안 데이터 재요청 방지
})
/**
 * @name useDiskById
 * @description 디스크 상세조회 useQuery 훅
 * 
 * @param {string} diskId 디스크ID
 * @returns useQuery 훅
 */
export const useDiskById = (diskId) => useQuery({
  queryKey: ['DiskById', diskId],
  queryFn: async () => {
    if (!diskId) return {};  
    Logger.debug(`useDiskById: ${diskId}`);
    const res = await ApiManager.findDisk(diskId);
    return validate(res) ?? {};
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
export const useAllVmsFromDisk = (diskId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['AllVmsFromDisk', diskId], 
  queryFn: async () => {
    Logger.debug(`useAllVmsFromDisk ... ${diskId}`);
    const res = await ApiManager.findAllVmsFromDisk(diskId); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; 
  },
  enabled: !!diskId,
})

/**
 * @name useAllStorageDomainFromDisk
 * @description 디스크 내 스토리지 목록조회 useQuery훅
 * 
 * @param {string} diskId 디스크ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllStorageDomainsFromDisk
 */
export const useAllStorageDomainFromDisk = (diskId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['AllStorageDomainFromDisk', diskId], 
  queryFn: async () => {
    Logger.debug(`useAllStorageDomainFromDisk ... ${diskId}`);
    const res = await ApiManager.findAllStorageDomainsFromDisk(diskId); 
    return validate(res)?.map((e) => mapPredicate(e)) ?? []; 
  },
  enabled: !!diskId,
})

/**
 * @name useAddDisk
 * @description Disk 생성 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useAddDisk = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (diskData) => await ApiManager.addDisk(diskData),
    onSuccess: () => {
      queryClient.invalidateQueries('allDisks'); // 호스트 추가 성공 시 'allDHosts' 쿼리를 리패칭하여 목록을 최신화
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};
/**
 * @name useEditDisk
 * @description Disk 수정 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useEditDisk = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  
  return useMutation({
    mutationFn: async ({ diskId, diskData }) => await ApiManager.editDisk(diskId, diskData),
    onSuccess: () => {
      queryClient.invalidateQueries('allDisks');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};
/**
 * @name useDeleteDisk
 * @description Disk 삭제 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useDeleteDisk = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({ 
    mutationFn: async (diskId) => await ApiManager.deleteDisk(diskId),
    onSuccess: () => {
      queryClient.invalidateQueries('allDisks');
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};

/**
 * @name useUploadDisk
 * @description Disk 업로드 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useUploadDisk = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (diskData) => await ApiManager.uploadDisk(diskData),
    onSuccess: () => {
      queryClient.invalidateQueries('allDisks'); // 호스트 추가 성공 시 'allDHosts' 쿼리를 리패칭하여 목록을 최신화
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};
/**
 * @name useMoveDisk
 * @description Disk 이동 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useMoveDisk = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (diskData) => await ApiManager.moveDisk(diskData),
    onSuccess: () => {
      queryClient.invalidateQueries('allDisks'); // 호스트 추가 성공 시 'allDHosts' 쿼리를 리패칭하여 목록을 최신화
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};
/**
 * @name useCopyDisk
 * @description Disk 복사 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useCopyDisk = (postSuccess=()=>{}, postError) => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (diskData) => await ApiManager.copyDisk(diskData),
    onSuccess: () => {
      queryClient.invalidateQueries('allDisks'); // 호스트 추가 성공 시 'allDHosts' 쿼리를 리패칭하여 목록을 최신화
      postSuccess();
    },
    onError: (error) => {
      Logger.error(error.message)
      postError && postError();
    },
  });
};


//#region: event -----------------이벤트---------------------
/**
 * @name useAllEvents
 * @description 모든 이벤트 목록조회 useQuery훅
 * 
 * @param {function} mapPredicate 
 * @returns useQuery훅
 */
export const useAllEvents = (mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allEvents'],
  queryFn: async () => {
    const res = await ApiManager.findAllEvent()
    return validate(res)?.map((e) => mapPredicate(e)) ?? []
  }
})
//#endregion: event


//#region: User
/**
 * @name useAllUsers
 * @description 모든 사용자 목록조회 useQuery훅
 * 
 * @param {function} mapPredicate 
 * @returns useQuery훅
 */
export const useAllUsers = (mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allUsers'],
  queryFn: async () => {
    const res = await ApiManager.findAllUsers()
    return validate(res)?.map((e) => mapPredicate(e)) ?? []
  }
})
/**
 * @name useUser
 * @description 사용자 상세조회 useQuery훅
 * 
 * @param {string} username 사용자 oVirt ID
 * @returns useQuery훅
 */
export const useUser = (username, exposeDetail = false) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['user'],
  queryFn: async () => {
    Logger.debug(`useUser ... username: ${username}, exposeDetail: ${exposeDetail}`);
    const res = await ApiManager.findUser(username, exposeDetail)
    
    return validate(res)
    // return validate(res)?.map((e) => mapPredicate(e)) ?? []
  }
})
/**
 * @name useAuthenticate
 * @description 사용자 ID/PW 검증 useQuery훅
 * 
 * @param {function} mapPredicate 
 * @returns useQuery훅
 */
export const useAuthenticate = (username, password, _onSuccess, _onError) => useMutation({
  mutationFn: async () => {
    const res = await ApiManager.authenticate(username, password)
    return validate(res)
  },
  onSuccess: (res) => {
    const msgSuccess = `useAuthenticate > onSuccess ... res: ${res}`
    Logger.debug(msgSuccess)
    _onSuccess(res);
  },
  onError: (err) => {
    const msgErr = `useAuthenticate > onError ... err: ${err}`  
    Logger.error(msgErr);
    toast.error(msgErr);
    _onError(err);
  },
})

export const useIsAuthenticated = (username) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['isAuthenticated'],
  queryFn: async() => {
    const res = await localStorage.getItem("isUserAuthenticated") === "true"
    Logger.debug(`isAuthenticated ... username: ${username}, res: ${res}`)
    return validate(res)
  }
})
export const useUnAuthenticate = (username, _onSuccess, _onError) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      return true;
    },
    onSuccess: (res) => {
      const msgSuccess = `useUnAuthenticate > onSuccess ... res: ${res}`
      console.info(msgSuccess);
      toast.success(`사용자 생성 완료`);
      queryClient.invalidateQueries('isAuthenticated', false);
      _onSuccess(res)
    },
    onError: (err) => {
      const msgErr = `useUnAuthenticate > onError ... err: ${err}`  
      Logger.error(msgErr);
      toast.error(`사용자 생성 실패 ... 이유: ${err}`);
      _onError(err)
    },
  })
}

/**
 * @name useAddUser
 * @description 사용자 생성 useQuery훅
 * 
 * @returns useMutation 훅
 */
export const useAddUser = (user, onSuccess, onError) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => await ApiManager.addUser(user),
    onSuccess: (res) => {
      const msgSuccess = `useAddUser > onSuccess ... res: ${res}`
      console.info(msgSuccess);
      toast.success(`사용자 생성 완료`);
      queryClient.invalidateQueries('allUsers');
      queryClient.invalidateQueries(['user', user.username]); // 수정된 네트워크 상세 정보 업데이트
      onSuccess(res)
    },
    onError: (err) => {
      const msgErr = `useAddUser > onError ... err: ${err}`  
      Logger.error(msgErr);
      toast.error(`사용자 생성 실패 ... 이유: ${err}`);
      onError(err)
    },
  })
}
/**
 * @name useEditUser
 * @description 사용자 편집 useQuery훅
 * 
 * @returns useMutation 훅
 */
export const useEditUser = (user, onSuccess, onError) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => await ApiManager.editUser(user),
    onSuccess: (res) => {
      const _res = res ?? {}
      console.info(`useEditUser > onSuccess ... res: ${JSON.stringify(_res, null ,2)}`);
      if (_res?.code && _res?.code !== 200)  {
        toast.error(`사용자 편집 실패 ... 이유: ${res.head.message}`);
        return;
      }
      toast.success(`사용자 편집 완료`);
      queryClient.invalidateQueries('allUsers');
      queryClient.invalidateQueries(['user', user.username]); // 수정된 네트워크 상세 정보 업데이트
      onSuccess(res)
    },
    onError: (err) => {
      Logger.error(`useEditUser > onError ... err: ${err}`);
      toast.error(`사용자 편집 실패 ... 이유: ${err}`);
      onError(err)
    },
  });
};
export const useChangePasswordUser = (username, currentPassword, newPassword, onSuccess, onError) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => await ApiManager.changePassword(username, currentPassword, newPassword),
    onSuccess: (res) => {
      const _res = res ?? {}
      Logger.debug(`useChangePasswordUser > onSuccess ... res: ${JSON.stringify(_res, null ,2)}`);
      if (_res?.code && _res?.code !== 200)  {
        toast.error(`사용자 비밀번호변경 실패 ... 이유: ${res.message}`);
        return;
      }
      toast.success(`사용자 비밀번호변경 완료`);
      queryClient.invalidateQueries('allUsers');
      queryClient.invalidateQueries(['user', username]); // 수정된 네트워크 상세 정보 업데이트
      onSuccess(res)
    },
    onError: (err) => {
      Logger.error(`useChangePasswordUser > onError ... err: ${err}`);
      toast.error(`사용자 비밀번호변경 실패 ... 이유: ${err}`);
      onError(err)
    },
  });
}
/**
 * @name useRemoveUser
 * @description 사용자 삭제
 * 
 * @returns useMutation 훅
 */
export const useRemoveUser = () => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (username) => {
      Logger.debug(`Deleting user with username: ${username}`);
      const res = await ApiManager.removeUser(username)
      return validate(res)
    },
    onSuccess: () => {
      queryClient.invalidateQueries('allUsers');
    },
    onError: (error) => {
      Logger.error('Error deleting users:', error);
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
export const useAllUserSessions = (username = "", mapPredicate = null) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allUserSessions'],
  queryFn: async () => {
    const res = await ApiManager.findAllUserSessions(username)
    return validate(res)?.map((e) => mapPredicate(e)) ?? []
  }
})
//#endregion: UserSession
//#region: Certificate(s)
export const useAllCerts = (mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['allCerts'],
  queryFn: async () => {
    Logger.debug(`useUser ...`);
    const res = await ApiManager.findAllCerts()
    return validate(res)?.map((e) => mapPredicate(e)) ?? []
  }
})
export const useCert = (id) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['cert'],
  queryFn: async () => {
    Logger.debug(`useCert ... id: ${id}`);
    const res = await ApiManager.findCert(id)
    return validate(res)
  }
})
//#endregion: Certificate(s)

const validate = (res) => {
  if (res?.head?.code !== 200) {
    throw new Error(res?.head?.message || '알 수 없는 오류');
  }
  return res?.body;
}
