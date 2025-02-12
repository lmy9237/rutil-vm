import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ApiManager from "./ApiManager";

//region: User
export const useAuthenticate = (username, password, _onSuccess, _onError) => useMutation({
  mutationFn: async () => {
    const res = await ApiManager.authenticate(username, password)
    return res
  },
  onSuccess: _onSuccess,
  onError: _onError,
})
//endregion: User

//region: Navigation


// Custom hook to fetch tree navigations
export const useAllTreeNavigations = (type = "none", mapPredicate = null) => {
  return useQuery({
    refetchOnWindowFocus: true,
    queryKey: ['allTreeNavigations', type],  // queryKey에 type을 포함시켜 type이 변경되면 데이터를 다시 가져옴
    queryFn: async () => {
      const res = await ApiManager.findAllTreeNaviations(type);  // type을 기반으로 API 호출
      if (mapPredicate)
        return res?.map((e) => mapPredicate(e)) ?? [];  // 데이터 가공 처리
      else 
        return res ?? [];  // 기본 데이터 반환
    }
  });
};
//endregion

//region: Dashboard
export const useDashboard = (mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['dashboard'],
  queryFn: async () => {
    console.log(`useDashboard ...`);
    const res = await ApiManager.getDashboard()
    // setShouldRefresh(prevValue => false)
    return res
    // return res?.map((e) => mapPredicate(e)) ?? []
  }
}); 

export const useDashboardCpuMemory = (mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['dashboardCpuMemory'],
  queryFn: async () => {
    console.log(`useDashboardCpuMemory ...`);
    const res = await ApiManager.getCpuMemory()
    // setShouldRefresh(prevValue => false)
    return res ?? []
    // return res?.map((e) => mapPredicate(e)) ?? []
  }
});
export const useDashboardStorage = (mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['dashboardStorage'],
  queryFn: async () => {
    const res = await ApiManager.getStorage()
    // setShouldRefresh(prevValue => false)
    return res ?? []
    // return res?.map((e) => mapPredicate(e)) ?? []
  }
});
export const useDashboardVmCpu = (mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['dashboardVmCpu'],
  queryFn: async () => {
    console.log(`useDashboardVmCpu ...`);
    const res = await ApiManager.getVmCpu()
    // setShouldRefresh(prevValue => false)
    return res ?? []
    // return res?.map((e) => mapPredicate(e)) ?? []
  }
});
export const useDashboardVmMemory = (mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['dashboardVmMemory'],
  queryFn: async () => {
    console.log(`useDashboardVmMemory ...`);
    const res = await ApiManager.getVmMemory()
    // setShouldRefresh(prevValue => false)
    return res ?? []
    // return res?.map((e) => mapPredicate(e)) ?? []
  }
});
export const useDashboardStorageMemory = (mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['dashboardStorageMemory'],
  queryFn: async () => {
    console.log(`useDashboardStorageMemory ...`);
    const res = await ApiManager.getStorageMemory()
    // setShouldRefresh(prevValue => false)
    return res ?? []
    // return res?.map((e) => mapPredicate(e)) ?? []
  }
});

export const useDashboardPerVmCpu = (mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['dashboardPerVmCpu'],
  queryFn: async () => {
    console.log(`dashboardPerVmCpu ...`);
    const res = await ApiManager.getPerVmCpu()
    // setShouldRefresh(prevValue => false)
    return res ?? []
    // return res?.map((e) => mapPredicate(e)) ?? []
  }
});
export const useDashboardPerVmMemory = (mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['dashboardPerVmMemory'],
  queryFn: async () => {
    console.log(`dashboardPerVmMemory ...`);
    const res = await ApiManager.getPerVmMemory()
    // setShouldRefresh(prevValue => false)
    return res ?? []
    // return res?.map((e) => mapPredicate(e)) ?? []
  }
});
export const useDashboardPerVmNetwork = (mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['dashboardPerVmNetwork'],
  queryFn: async () => {
    console.log(`dashboardPerVmNetwork ...`);
    const res = await ApiManager.getPerVmNetwork()
    // setShouldRefresh(prevValue => false)
    return res ?? []
    // return res?.map((e) => mapPredicate(e)) ?? []
  }
});

export const useDashboardMetricVm = (mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['dashboardMetricVm'],
  queryFn: async () => {
    console.log(`useDashboardMetricVm ...`);
    const res = await ApiManager.getMetricVm()
    return res ?? []
  }
});
export const useDashboardMetricStorage = (mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['dashboardMetricStorage'],
  queryFn: async () => {
    console.log(`useDashboardMetricStorage ...`);
    const res = await ApiManager.getMetricStorage()
    return res ?? []
  }
});
//endregion


//region: DataCenter ----------------데이터센터----------------
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
    console.log(`useAllDataCenters ...`);
    const res = await ApiManager.findAllDataCenters()
    // setShouldRefresh(prevValue => false)
    return res?.map((e) => mapPredicate(e)) ?? []
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
    console.log(`useDataCenter ...`);
    const res = await ApiManager.findDataCenter(dataCenterId);  // dataCenterId에 따라 API 호출
    return res ?? {};  // 데이터를 반환, 없는 경우 빈 객체 반환
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
    console.log(`clustersFromDataCenter ...`);
    const res = await ApiManager.findAllClustersFromDataCenter(dataCenterId); 
    return res?.map(mapPredicate) ?? []; // 데이터 가공
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
    console.log(`hostsFromDataCenter ... ${dataCenterId}`);
    const res = await ApiManager.findAllHostsFromDataCenter(dataCenterId); 
    return res?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
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
    console.log(`vmsFromDataCenter ... ${dataCenterId}`);
    const res = await ApiManager.findAllVmsFromDataCenter(dataCenterId); 
    return res?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
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
    console.log(`domainsFromDataCenter ... ${dataCenterId}`);
    const res = await ApiManager.findAllDomainsFromDataCenter(dataCenterId); 
    return res?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
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
    console.log(`networksFromDataCenter ... ${dataCenterId}`);
    const res = await ApiManager.findAllNetworksFromDataCenter(dataCenterId); 
    return res?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
  },
  enabled: !!dataCenterId, 
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
    console.log(`eventsFromDataCenter ... ${dataCenterId}`);
    const res = await ApiManager.findAllEventsFromDataCenter(dataCenterId); 
    return res?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
  }
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
    console.log(`FindDiskListFromDataCenter ...`, dataCenterId);
    const res = await ApiManager.findDiskListFromDataCenter(dataCenterId); 
    return res?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
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
    // console.log(`useCDFromDataCenter ...`, dataCenterId);
    const res = await ApiManager.findAllISOFromDataCenter(dataCenterId); 
    return res?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
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
    return res?.map((e) => mapPredicate(e)) ?? []; 
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
export const useAddDataCenter = () => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (dataCenterData) => await ApiManager.addDataCenter(dataCenterData),
    onSuccess: () => {
      queryClient.invalidateQueries('allDataCenters'); // 데이터센터 추가 성공 시 'allDataCenters' 쿼리를 리패칭하여 목록을 최신화
    },
    onError: (error) => {
      console.error('Error adding data center:', error);
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
export const useEditDataCenter = () => {
  const queryClient = useQueryClient();  
  return useMutation({
    mutationFn: async ({ dataCenterId, dataCenterData }) => await ApiManager.editDataCenter(dataCenterId, dataCenterData),
    onSuccess: () => {
      queryClient.invalidateQueries('allDataCenters');
    },
    onError: (error) => {
      console.error('Error editing data center:', error);
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
export const useDeleteDataCenter = () => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({ 
    mutationFn: async (dataCenterId) => await ApiManager.deleteDataCenter(dataCenterId),
    onSuccess: () => {
      queryClient.invalidateQueries('allDataCenters');
    },
    onError: (error) => {
      console.error('Error deleting data center:', error);
    },
  });
};

//endregion: DataCenter


//region: Cluster ----------------클러스터---------------------
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
    console.log(`useAllClusters ...`);
    const res = await ApiManager.findAllClusters()
    // setShouldRefresh(prevValue => false)
    return res?.map((e) => mapPredicate(e)) ?? []
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
    console.log(`useAllUpClusters ...`);
    const res = await ApiManager.findAllUpClusters()
    return res?.map((e) => mapPredicate(e)) ?? []
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
    console.log(`useCluster ... ${clusterId}`);
    const res = await ApiManager.findCluster(clusterId);  // clusterId에 따라 API 호출
    return res ?? {};  // 반환값이 없으면 빈 객체 반환
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
    console.log(`테스트해보기useNetworkFromCluster ... ${clusterId}`);
    const res = await ApiManager.findNetworksFromCluster(clusterId); 
    return res?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
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
    console.log(`useHostFromCluster ... ${clusterId}`);
    const res = await ApiManager.findHostsFromCluster(clusterId); 
    return res?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
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
    console.log(`useVMFromCluster ... ${clusterId}`);
    const res = await ApiManager.findVMsFromCluster(clusterId); 
    return res?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
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
//     console.log(`usePermissionromCluster ... ${clusterId}`);
//     const res = await ApiManager.findPermissionsFromCluster(clusterId); 
//     return res?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
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
    console.log(`useHostFromCluster ... ${clusterId}`);
    const res = await ApiManager.findCpuProfilesFromCluster(clusterId); 
    return res?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
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
    console.log(`useEventFromCluster ... ${clusterId}`);
    const res = await ApiManager.findEventsFromCluster(clusterId); 
    return res?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
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
export const useAddCluster = () => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (clusterData) => await ApiManager.addCluster(clusterData),
    onSuccess: () => {
      queryClient.invalidateQueries('allClusters'); // 데이터센터 추가 성공 시 'allDataCenters' 쿼리를 리패칭하여 목록을 최신화
    },
    onError: (error) => {
      console.error('Error adding cluster:', error);
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
export const useEditCluster = () => {
  const queryClient = useQueryClient();  
  return useMutation({
    mutationFn: async ({ clusterId, clusterData }) => await ApiManager.editCluster(clusterId, clusterData),
    onSuccess: () => {
      queryClient.invalidateQueries('allClusters');
    },
    onError: (error) => {
      console.error('Error editing cluster:', error);
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
export const useDeleteCluster = () => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({ 
    mutationFn: async (clusterId) => await ApiManager.deleteCluster(clusterId),
    onSuccess: () => {
      queryClient.invalidateQueries('allClusters');
    },
    onError: (error) => {
      console.error('Error deleting cluster:', error);
    },
  });
};
//endregion: Cluster

//region: Host ----------------호스트---------------------
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
    // setShouldRefresh(prevValue => false)
    return res?.map((e) => mapPredicate(e)) ?? []
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
    console.log(`useHost ... ${hostId}`)
    const res = await ApiManager.findHost(hostId)
    return res ?? {}
  },
  enabled: !!hostId
  // onSuccess: (data) => {
  //   console.log('host data:', data);
  // },
  // onError: (error) => {
  //   console.error('API 에러:', error.message);
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
    console.log(`useVmFromHost ... ${hostId}`);
    const res = await ApiManager.findVmsFromHost(hostId); 
    return res?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
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
    console.log(`useNetworkInterfaceFromHost ... ${hostId}`);
    const res = await ApiManager.findHostNicsFromHost(hostId); 
    return res?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
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
    console.log(`useHostdeviceFromHost ... ${hostId}`);
    const res = await ApiManager.findHostdevicesFromHost(hostId); 
    return res?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
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
    console.log(`EventFromHost ... ${hostId}`);
    const res = await ApiManager.findEventsFromHost(hostId); 
    return res?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
  },
  enabled: !!hostId
})

// /**
//  * @name usePermissionFromHost
//  * @description 클러스터 내 권한 목록조회 useQuery훅
//  * 
//  * @param {string} clusterId 클러스터ID
//  * @param {function} mapPredicate 목록객체 변형 처리
//  * @returns useQuery훅
//  * 
//  * @see ApiManager.usePermissionFromHost
//  */
// export const usePermissionFromHost = (hostId, mapPredicate) => useQuery({
//   refetchOnWindowFocus: true,
//   queryKey: ['PermissionFromHost', hostId], 
//   queryFn: async () => {
//     console.log(`usePermissionFromHost ... ${hostId}`);
//     const res = await ApiManager.findPermissionsFromHost(hostId); 
//     return res?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
//   }
// })


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
export const useIscsiFromHost = (hostId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['IscsiFromHost', hostId], 
  queryFn: async () => {
    // if(hostId === null) return [];
    console.log(`IscsiFromHost ... ${hostId}`);
    const res = await ApiManager.findAllIscsiFromHost(hostId); 
    const processedData = res?.map((e) => mapPredicate(e)) ?? [];
    console.log('Processed iSCSI data:', processedData);
    return processedData; // 데이터 가공 후 반환
  },
  enabled: !!hostId,
  onSuccess: (data) => {
    console.log('iSCSI data:', data);
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
export const useFibreFromHost = (hostId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['fibreFromHost', hostId], 
  queryFn: async () => {
    if(hostId === null) return [];
    console.log(`fibreFromHost ... ${hostId}`);
    const res = await ApiManager.findAllFibreFromHost(hostId); 
    const processedData = res?.map((e) => mapPredicate(e)) ?? [];
    console.log('Processed Fibre data:', processedData);
    return processedData; // 데이터 가공 후 반환
  },
  enabled: !!hostId,
  onSuccess: (data) => {
    console.log('Fibre data:', data);
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
export const useImportIscsiFromHost = () => {
  // const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({hostId, iscsiData}) => await ApiManager.findImportIscsiFromHost(hostId, iscsiData),
    onSuccess: (data) => {
      console.log('iSCSI 가져오기 성공:', data); // 성공한 응답 데이터 출력
    },
    onError: (error) => {
      console.error('iSCSI 가져오기 에러:', error);
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
export const useImportFcpFromHost = () => {
  // const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ( { hostId } ) => await ApiManager.findImportFcpFromHost(hostId),
    onSuccess: (data) => {
      console.log('fcp 가져오기 성공:', data);
    },
    onError: (error) => {
      console.error('fcp 가져오기 에러:', error);
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
export const useLoginIscsiFromHost = () => {
  // const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({hostId, iscsiData}) => await ApiManager.findLoginIscsiFromHost(hostId, iscsiData),
    onSuccess: (data) => {
      console.log('iSCSI 로그인 성공:', data); // 성공한 응답 데이터 출력
    },
    onError: (error) => {
      console.error('iSCSI 로그인 에러:', error);
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
export const useAddHost = () => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({hostData, deploy_hosted_engine}) => await ApiManager.addHost(hostData, deploy_hosted_engine),
    onSuccess: () => {
      queryClient.invalidateQueries('allHosts'); // 호스트 추가 성공 시 'allDHosts' 쿼리를 리패칭하여 목록을 최신화
    },
    onError: (error) => {
      console.error('Error adding host:', error);
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
export const useEditHost = () => {
  const queryClient = useQueryClient();  
  return useMutation({
    mutationFn: async ({ hostId, hostData }) => await ApiManager.editHost(hostId, hostData),
    onSuccess: () => {
      queryClient.invalidateQueries('allHosts');
    },
    onError: (error) => {
      console.error('Error editing host:', error);
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
export const useDeleteHost = () => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({ 
    mutationFn: async (hostId) => await ApiManager.deleteHost(hostId),
    onSuccess: () => {
      queryClient.invalidateQueries('allHosts');
    },
    onError: (error) => {
      console.error('Error deleting host:', error);
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
export const useDeactivateHost = () => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (hostId) => await ApiManager.deactivateHost(hostId),
    onSuccess: () => {
      console.log(`useDeactivateHost ... `);
      queryClient.invalidateQueries('allHosts');
    },
    onError: (error) => {
      console.error('Error deactivate host:', error);
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
export const useActivateHost = () => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (hostId) => await ApiManager.activateHost(hostId),
    onSuccess: () => {
      queryClient.invalidateQueries('allHosts');
    },
    onError: (error) => {
      console.error('Error deactivate host:', error);
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
export const useRestartHost = () => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (hostId) => await ApiManager.restartHost(hostId),
    onSuccess: () => {
      console.log(`useRestartHost ... `);
      queryClient.invalidateQueries('allHosts');
    },
    onError: (error) => {
      console.error('Error restart host:', error);
    },  
  });
};
//endregion: Host

//region: VM ----------------가상머신---------------------
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
    // setShouldRefresh(prevValue => false)
    return res?.map((e) => mapPredicate(e)) ?? []
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
    console.log(`vmId ID: ${vmId}`);
    const res = await ApiManager.findVM(vmId);
    return res ?? {};
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
    console.log(`vmId ID: ${vmId}`);
    const res = await ApiManager.findVM(vmId);
    return res ?? {};
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
    console.log(`useDisksFromVM ... ${vmId}`);
    const res = await ApiManager.findDisksFromVM(vmId); 
    return res?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
  },
  enabled: !!vmId, 
});

/**
 * @name useSnapshotFromVM
 * @description 가상머신 내 스냅샷 목록조회 useQuery훅
 * 
 * @param {string} vmId 가상머신ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findSnapshotsFromVM
 */
export const useSnapshotFromVM = (vmId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['SnapshotFromVM', vmId], 
  queryFn: async () => {
    console.log(`useSnapshotFromVM ... ${vmId}`);
    const res = await ApiManager.findSnapshotsFromVM(vmId); 
    return res?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
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
    console.log(`Fetching snapshot details for VM ID: ${vmId}, Snapshot ID: ${snapshotId}`);
    const res = await ApiManager.findSnapshotFromVm(vmId, snapshotId); 
    return res ?? {}; 
  },
  enabled: !!vmId
});


/**
 * @name useAddSnapshotFromVM
 * @description 가상머신 스냅샷 생성 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useAddSnapshotFromVM = () => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    // mutationFn: async ({vmId,snapshotData}) => await ApiManager.addSnapshotFromVM(vmId,snapshotData),
    mutationFn: async ({vmId, snapshotData}) => {
      console.log(`Hook vm: ${vmId}....  ${snapshotData}`)
      return await ApiManager.addSnapshotFromVM(vmId, snapshotData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries('SnapshotFromVM'); // 데이터센터 추가 성공 시 'allDataCenters' 쿼리를 리패칭하여 목록을 최신화
    },
    onError: (error) => {
      console.error('Error adding snapshot:', error);
    },  
  });
};

/**
 * @name useDeleteSnapshot
 * @description 가상머신 스냅샷 삭제 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useDeleteSnapshot = () => {
  const queryClient = useQueryClient(); // Query 캐싱을 위한 클라이언트
  return useMutation({
    mutationFn: async ({ vmId, snapshotId }) => {
      console.log('Deleting snapshot:', vmId, snapshotId);
      const response = await ApiManager.deleteSnapshotFromVM(vmId, snapshotId);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('SnapshotFromVM'); // 쿼리 캐시 무효화
    },
    onError: (error) => {
      console.error('Error during snapshot deletion:', error);
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
    console.log(`useHostdevicesFromVM ... ${vmId}`);
    const res = await ApiManager.findHostdevicesFromVM(vmId); 
    return res?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
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
    console.log(`useNetworkInterfaceFromVM... ${vmId}`);
    const res = await ApiManager.findNicsFromVM(vmId); 
    return res?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
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
    console.log(`useNetworkInterfaceByVMId ... ${vmId}`);
    console.log(`useNetworkInterfaceByVMId ... ${nicId}`);
    const res = await ApiManager.findNicFromVM(vmId,nicId); 
    console.log('API Response:', res); // 반환된 데이터 구조 확인
    return res ?? {}; 
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
    console.log(`useApplicationFromVM ... ${vmId}`);
    const res = await ApiManager.findApplicationsFromVM(vmId); 
    return res?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
  },
  enabled: !!vmId, 
  staleTime: 0,
  cacheTime: 0,

});
/**
 * @name useAllEventFromVM
 * @description  가상머신 내  이벤트 목록조회 useQuery훅
 * 
 * @param {string} vmId 가상머신ID
 * @param {function} mapPredicate 목록객체 변형 처리
 * @returns useQuery훅
 * 
 * @see ApiManager.findAllDataCenterFromDomain
 */
export const useAllEventFromVM = (vmId, mapPredicate) => useQuery({
  refetchOnWindowFocus: true,
  queryKey: ['AllEventFromVM', vmId], 
  queryFn: async () => {
    console.log(`useAllEventFromDomain ... ${vmId}`);
    const res = await ApiManager.findEventsFromVM(vmId); 
    return res?.map((e) => mapPredicate(e)) ?? []; 
  },
  enabled: !!vmId
})


/**
 * @name useVmConsole
 * @description 가상머신 콘솔 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useVmConsole = () => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (vmId) => await ApiManager.consoleVM(vmId),
    onSuccess: () => {
      queryClient.invalidateQueries('allVMs'); 
    },
    onError: (error) => {
      console.error('Error console vm:', error);
    },      
  });
};

/**
 * @name useAddVm
 * @description 가상머신 생성 
 * 
 * @returns useMutation 훅
 */
export const useAddVm = () => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (vmData) => await ApiManager.addVM(vmData),
    onSuccess: () => {
      queryClient.invalidateQueries('allVMs'); 
    },
    onError: (error) => {
      console.error('Error adding VM:', error);
    },  
  });
};

/**
 * @name useEditVm
 * @description 가상머신 수정 
 * 
 * @returns useMutation 훅
 */
export const useEditVm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ vmId, vmdata }) => await ApiManager.editVM(vmId, vmdata),
    onSuccess: (data,{vmId}) => {
      console.log('VM 편집한데이터:', data);
      queryClient.invalidateQueries('allVMs');
      queryClient.invalidateQueries(['vmId', vmId]); // 수정된 네트워크 상세 정보 업데이트
    },
    onError: (error) => {
      console.error('Error editing VM:', error);
    },
  });
};

/**
 * @name useDeleteVm
 * @description 가상머신 삭제 useMutation 훅(아이디 잘뜸)
 * 
 * @returns useMutation 훅
 */
export const useDeleteVm = () => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({ 
    mutationFn: async ({vmId, detachOnly}) => {
      console.log(`Hook vm: ${vmId}....  ${detachOnly}`)
      return await ApiManager.deleteVM(vmId, detachOnly)
    },
    onSuccess: () => {
      queryClient.invalidateQueries('allVMs');
    },
    onError: (error) => {
      console.error('Error deleting vm:', error);
    },
  });
};

/**
 * @name useStartVM
 * @description 가상머신 실행 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useStartVM = () => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (vmId) => await ApiManager.startVM(vmId),
    onSuccess: () => {
      console.log(`useStartVM ... `);
      queryClient.invalidateQueries('allVMs');
    },
    onError: (error) => {
      console.error('Error start vm:', error);
    },  
  });
};
/**
 * @name usePauseVM
 * @description 가상머신 일시정지 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const usePauseVM = () => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (vmId) => await ApiManager.pauseVM(vmId),
    onSuccess: () => {
      console.log(`usePauseVM ... `);
      queryClient.invalidateQueries('allVMs');
    },
    onError: (error) => {
      console.error('Error pause vm:', error);
    },  
  });
};

/**
 * @name useShutdownVM
 * @description 가상머신 종료 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useShutdownVM = () => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (vmId) => await ApiManager.shutdownVM(vmId),
    onSuccess: () => {
      console.log(`useShutdownVM ... `);
      queryClient.invalidateQueries('allVMs');
    },
    onError: (error) => {
      console.error('Error shutdown vm:', error);
    },  
  });
};
/**
 * @name usePowerOffVM
 * @description 가상머신 전원끔 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const usePowerOffVM = () => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (vmId) => await ApiManager.powerOffVM(vmId),
    onSuccess: () => {
      console.log(`usePowerOffVM ... `);
      queryClient.invalidateQueries('allVMs');
    },
    onError: (error) => {
      console.error('Error powerOff vm:', error);
    },  
  });
};

/**
 * @name useRebootVM
 * @description 가상머신 재부팅 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useRebootVM = () => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (vmId) => await ApiManager.rebootVM(vmId),
    onSuccess: () => {
      console.log(`useRebootVM ... `);
      queryClient.invalidateQueries('allVMs');
    },
    onError: (error) => {
      console.error('Error reboot vm:', error);
    },  
  });
};
/**
 * @name useResetVM
 * @description 가상머신 재설정 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useResetVM = () => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (vmId) => await ApiManager.resetVM(vmId),
    onSuccess: () => {
      console.log(`useResetVM ... `);
      queryClient.invalidateQueries('allVMs');
    },
    onError: (error) => {
      console.error('Error reset vm:', error);
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
    console.log(`useAllVmsFromTemplate ... ${vmId}`);
    const res = await ApiManager.migrateHostsFromVM(vmId); 
    return res?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
  },
  enabled: !!vmId
})

/**
 * @name useMigration
 * @description 가상머신 마이그레이션 훅
 * 
 * @returns useMutation 훅
 */
export const useMigration = () => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({vmId,hostId}) => await ApiManager.migrateVM(vmId,hostId),
    onSuccess: () => {
      console.log(`useMigration ... `);
      queryClient.invalidateQueries('HostsForMigration');
    },
    onError: (error) => {
      console.error('Error Migration :', error);
    },  
  });
};

/**
 * @name useExportVM
 * @description 가상머신 내보내기 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useExportVM = () => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (vmId) => await ApiManager.exportVM(vmId),
    onSuccess: () => {
      console.log(`useExportVM ... `);
      queryClient.invalidateQueries('allVMs');
    },
    onError: (error) => {
      console.error('Error export vm:', error);
    },  
  });
};

/**
 * @name useAddNicFromVM
 * @description 가상머신 네트워크 인터페이스 생성 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useAddNicFromVM = () => {
  const queryClient = useQueryClient(); // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({ vmId, nicData }) => {
      console.log('Received vmId:', vmId); // vmId 출력
      console.log('Received nicData:', nicData); // nicData 출력
      return await ApiManager.addNicFromVM(vmId, nicData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('NetworkInterfaceFromVM');
    },
    onError: (error) => {
      console.error('Error adding data center:', error);
    },
  });
};
/** 수정해야됨
 * @name useEditNicFromVM
 * @description 가상머신 네트워크 인터페이스 수정 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useEditNicFromVM = () => {
  const queryClient = useQueryClient();  
  return useMutation({
    mutationFn: async ({ vmId, nicId, nicData }) => {
      console.log('EDIT NIC 요청 데이터:', { vmId, nicId, nicData });
      return await ApiManager.editNicFromVM(vmId, nicId, nicData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('NetworkInterfaceFromVM'); 
      queryClient.invalidateQueries(['NetworkInterfaceByVMId']);
      
    },
    onError: (error) => {
      console.error('Error editing data center:', error);
    },
  });
};

/**
 * @name useDeleteNetworkInterface
 * @description 가상머신 네트워크 인터페이스 삭제 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useDeleteNetworkInterface = () => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({ vmId,nicId}) => {
      // ID들이 제대로 전달되는지 확인하기 위해 로그 추가
      console.log('Deleting VnicProfile with vmId:', vmId);
      console.log('Deleting VnicProfile with nicId:', nicId);
      return await ApiManager.deleteNicFromVM(vmId,nicId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('NetworkInterfaceFromVM');
    },
    onError: (error) => {
      console.error('Error deleting NetworkInterface:', error);
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
  queryKey: ['DiskAttachmentFromVm', vmId],
  queryFn: async () => {
    const res = await ApiManager.findDiskattachmentFromVM(vmId, diskAttachmentId);
    return res ?? {};
  },
  enabled: !!vmId
});


/**
 * @name useAddDiskFromVM
 * @description 가상머신 디스크 생성 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useAddDiskFromVM = () => {
  const queryClient = useQueryClient(); // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({ vmId, diskData }) => {
      console.log('가상머신 생성 디스크데이터 diskData:', diskData); // nicData 출력
      return await ApiManager.addDiskFromVM(vmId, diskData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('DisksFromVM');
    },
    onError: (error) => {
      console.error('Error adding disk:', error);
    },
  });
};

/**
 * @name useEditDiskFromVM
 * @description 가상머신 디스크 수정 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useEditDiskFromVM = () => {
  const queryClient = useQueryClient(); // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({ vmId, diskAttachmentId, diskAttachment }) => {
      console.log('가상머신 수정 디스크데이터:', diskAttachment);
      return await ApiManager.editDiskFromVM(vmId, diskAttachmentId, diskAttachment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('DisksFromVM');
    },
    onError: (error) => {
      console.error('Error edit disk:', error);
    },
  });
};

/**
 * @name useDeleteDiskFromVM
 * @description 가상머신 디스크 삭제 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useDeleteDiskFromVM = () => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({ vmId, diskAttachmentId, detachOnly }) => {
      // ID들이 제대로 전달되는지 확인하기 위해 로그 추가
      console.log(`vmId: ${vmId}, diskAttachmentId: ${diskAttachmentId}, detachOnly: ${detachOnly}`);
      await ApiManager.deleteDiskFromVM(vmId, diskAttachmentId, detachOnly);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('DisksFromVM');
    },
    onError: (error) => {
      console.error('Error deleting Disk:', error);
    },
  });
};


/**
 * @name useConnDisksFromVM
 * @description 가상머신 디스크 연결 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useConnDiskFromVM = () => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({ vmId, diskAttachment }) => {
      return await ApiManager.attachDiskFromVM(vmId, diskAttachment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['DisksFromVM']); 
    },
    onError: (error) => {
      console.error('Error attaching disks to VM:', error);
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
export const useDeactivateDiskFromVm = () => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({vmId, diskAttachmentId}) => await ApiManager.deactivateDisksFromVM(vmId, diskAttachmentId),
    onSuccess: () => {
      console.log(`useDeactivateDiskFromVm ... `);
      queryClient.invalidateQueries('allDisksFromVm');
    },
    onError: (error) => {
      console.error('Error deactivate disk vm:', error);
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
export const useActivateDiskFromVm  = () => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({vmId, diskAttachmentId}) => await ApiManager.activateDisksFromVM(vmId, diskAttachmentId),
    onSuccess: () => {
      queryClient.invalidateQueries('allDisksFromVm');
    },
    onError: (error) => {
      console.error('Error deactivate disk vm:', error);
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
//     console.log(`useFindDiskFromVM vm아이디... ${vmId}`);
//     console.log(`useFindDiskFromVM 디스크아이디 ... ${diskId}`);
//     const res = await ApiManager.findDiskFromVM(vmId,diskId); 
//     console.log('API Response:', res); // 반환된 데이터 구조 확인
//     return res ?? {}; 
//   },

// });


//endregion: VM

//region: TEMPLATE ----------------템플릿---------------------
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
    // setShouldRefresh(prevValue => false)
    return res?.map((e) => mapPredicate(e)) ?? []
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
    console.log(`Template ID: ${tId}`);
    const res = await ApiManager.findTemplate(tId);
    return res ?? {};
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
    console.log(`useAllVmsFromTemplate ... ${tId}`);
    const res = await ApiManager.findVMsFromTemplate(tId); 
    return res?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
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
    console.log(`useAllNicsFromTemplate ... ${tId}`);
    const res = await ApiManager.findNicsFromTemplate(tId); 
    return res?.map((e) => mapPredicate(e)) ?? []; 
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
    console.log(`useAllDisksFromTemplate ... ${tId}`);
    const res = await ApiManager.findDisksFromTemplate(tId); 
    return res?.map((e) => mapPredicate(e)) ?? []; 
  },
  enabled: !!tId,
  staleTime: 0,
  cacheTime: 0,
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
    console.log(`useAllStoragesFromTemplate ... ${tId}`);
    const res = await ApiManager.findStorageDomainsFromTemplate(tId); 
    return res?.map((e) => mapPredicate(e)) ?? []; 
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
    console.log(`useAllEventFromTemplate ... ${tId}`);
    const res = await ApiManager.findEventsFromTemplate(tId); 
    return res?.map((e) => mapPredicate(e)) ?? []; 
  },
  enabled: !!tId,
})

/**
 * @name useAddTemplate
 * @description Template 생성 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useAddTemplate = () => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({vmId,templateData} ) =>{
      console.log(`Hook vm: ${vmId}....  ${templateData}`)
      return await ApiManager.addTemplate(vmId,templateData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries('allTemplates');
    },
    onError: (error) => {
      console.error('Error adding Template:', error);
    },  
  });
};
/**
 * @name useEditTemplate
 * @description Template 수정 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useEditTemplate = () => {
  const queryClient = useQueryClient();  
  return useMutation({
    mutationFn: async ({ templateId, templateData }) => await ApiManager.editTemplate(templateId, templateData),
    onSuccess: (data, variables) => {
      const { templateId } = variables; // variables에서 templateId 추출
      queryClient.invalidateQueries('allTemplates');
      queryClient.invalidateQueries(['templateId', templateId]); // templateId 올바르게 사용
    },
    onError: (error) => {
      console.error('Error editing Template:', error);
    },
  });
};


/**
 * @name useDeleteTemplate
 * @description Template 삭제 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({ 
    mutationFn: async (templateId) => await ApiManager.deleteTemplate(templateId),
    onSuccess: () => {
      queryClient.invalidateQueries('allTemplates');
    },
    onError: (error) => {
      console.error('Error deleting Template:', error);
    },
  });
};


/**
 * @name useAddNicFromTemplate
 * @description 템플릿 네트워크 생성 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useAddNicFromTemplate = () => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({templateId,nicData}) => await ApiManager.addNicFromTemplate(templateId,nicData),
    onSuccess: () => {
      queryClient.invalidateQueries('AllNicsFromTemplate'); // 데이터센터 추가 성공 시 'allDataCenters' 쿼리를 리패칭하여 목록을 최신화
    },
    onError: (error) => {
      console.error('Error adding Template network:', error);
    },  
  });
};
/**
 * @name useEditNicFromTemplate
 * @description 템플릿 네트워크 수정 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useEditNicFromTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ templateId, nicId, nicData }) => 
      await ApiManager.editNicFromTemplate(templateId, nicId, nicData), // nicId 추가
  
    onSuccess: () => {
      queryClient.invalidateQueries('AllNicsFromTemplate'); // 전체 네트워크 목록 업데이트
      // queryClient.invalidateQueries(['tId', templateId]); // 수정된 네트워크 상세 정보 업데이트
    },
  
    onError: (error) => {
      console.error('Error editing Template network:', error);
    },
  });
};


/**
 * @name useDeleteNetworkFromTemplate
 * @description 템플릿 네트워크 삭제 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useDeleteNetworkFromTemplate = () => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({ templateId,nicId}) => {
      // ID들이 제대로 전달되는지 확인하기 위해 로그 추가
      console.log('Deleting VnicProfile with templateId:', templateId);
      console.log('Deleting VnicProfile with nicId:', nicId);
      return await ApiManager.deleteNicFromTemplate(templateId,nicId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('AllNicsFromTemplate');
    },
    onError: (error) => {
      console.error('Error deleting NetworkInterface:', error);
    },
  });
};

//endregion: TEMPLATE



//region: Network -----------------네트워크---------------------
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
    // setShouldRefresh(prevValue => false)
    return res?.map((e) => mapPredicate(e)) ?? []
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
    console.log(`Fetching network with ID: ${networkId}`);
    const res = await ApiManager.findNetwork(networkId);
    return res ?? {};
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
    console.log(`useAllClustersFromNetwork ... ${networkId}`);
    const res = await ApiManager.findAllClustersFromNetwork(networkId);  // 클러스터 목록을 가져오는 API 호출
    return res?.map((e) => mapPredicate(e)) ?? [];
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
    console.log(`useConnectedHostsFromNetwork ... ${networkId}`);
    const res = await ApiManager.findConnectedHostsFromNetwork(networkId); 
    return res?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
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
    console.log(`useDisconnectedHostsFromNetwork ... ${networkId}`);
    const res = await ApiManager.findDisconnectedHostsFromNetwork(networkId); 
    return res?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
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
    console.log(`useAllVmsFromNetwork ... ${networkId}`);
    const res = await ApiManager.findAllVmsFromNetwork(networkId); 
    return res?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
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
    console.log(`Fetching templates for Network ID: ${networkId}`);
    const res = await ApiManager.findAllTemplatesFromNetwork(networkId);
    console.log('API Response:', res); // API 응답 확인
    return res?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
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
    console.log(`useAllVnicProfilesFromNetwork모든목록조회 ... ${networkId}`);
    const res = await ApiManager.findAllVnicProfilesFromNetwork(networkId);
    return res?.map((e) => mapPredicate(e)) ?? [];
  },
  enabled: !!networkId, 
});

/**
 * @name useAddNetwork
 * @description 네트워크 생성 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useAddNetwork = () => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (networkData) => await ApiManager.addNetwork(networkData),
    onSuccess: () => {
      queryClient.invalidateQueries('allNetworks'); // 데이터센터 추가 성공 시 'allDataCenters' 쿼리를 리패칭하여 목록을 최신화
    },
    onError: (error) => {
      console.error('Error adding network:', error);
    },  
  });
};

/**
 * @name useEditNetwork
 * @description 네트워크 수정 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useEditNetwork = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ networkId, networkData }) => await ApiManager.editNetwork(networkId, networkData),
    onSuccess: (data, { networkId }) => {
      queryClient.invalidateQueries('allNetworks'); // 전체 네트워크 목록 업데이트
      queryClient.invalidateQueries(['networkById', networkId]); // 수정된 네트워크 상세 정보 업데이트
    },
    onError: (error) => {
      console.error('Error editing network:', error);
    },
  });
};

/**
 * @name useDeleteNetwork
 * @description 네트워크 삭제 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useDeleteNetwork = () => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({ 
    mutationFn: async (networkId) => await ApiManager.deleteNetwork(networkId),
    onSuccess: () => {
      queryClient.invalidateQueries('allNetworks');
    },
    onError: (error) => {
      console.error('Error deleting cluster:', error);
    },
  });
};


//region: VnicProfiles -----------------vnic프로파일---------------------
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
    return res?.map((e) => mapPredicate(e)) ?? []
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
    console.log(`Fetching vnic profile with ID: ${vnicId}`);
    const res = await ApiManager.findVnicProfile( vnicId);
    return res ?? {};
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
    console.log(`useAllVmsFromVnicProfiles모든목록조회 ... ${vnicProfileId}`);
    const res = await ApiManager.findAllVmsFromVnicProfiles(vnicProfileId);
    return res?.map((e) => mapPredicate(e)) ?? [];
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
    console.log(`useAllTemplatesFromVnicProfiles ... ${vnicProfileId}`);
    const res = await ApiManager.findAllTemplatesFromVnicProfiles(vnicProfileId); 
    return res?.map((e) => mapPredicate(e)) ?? []; 
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
export const useAddVnicProfile = () => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (vnicData) => await ApiManager.addVnicProfiles(vnicData),
    onSuccess: () => {
      queryClient.invalidateQueries('allVnicProfiles');
    },
    onError: (error) => {
      console.error('Error adding vnic:', error);
    },  
  });
};
/**
 * @name useEditVnicProfile
 * @description vnic 수정 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useEditVnicProfile = () => {
  const queryClient = useQueryClient();  
  return useMutation({
    mutationFn: async ({vnicId, vnicData }) => await ApiManager.editVnicProfiles(vnicId, vnicData),
    onSuccess: () => {
      queryClient.invalidateQueries('allVnicProfiles');
    },
    onError: (error) => {
      console.error('Error editing vnic:', error);
    },
  });
};

/**
 * @name useDeleteVnicProfile
 * @description VnicProfile 삭제 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useDeleteVnicProfile = () => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (vnicProfileId ) => {
      console.log('Deleting VnicProfile with vnicProfileId:', vnicProfileId);
      return await ApiManager.deleteVnicProfiles(vnicProfileId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('allVnicProfiles');
    },
    onError: (error) => {
      console.error('Error deleting VnicProfile:', error);
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
    return res?.map((e) => mapPredicate(e)) ?? []
  }
})
//region: storage -----------------스토리지---------------------

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
    return res?.map((e) => mapPredicate(e)) ?? []
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
    console.log(`Fetching network with ID: ${storageDomainId}`);
    const res = await ApiManager.findDomain(storageDomainId);
    return res ?? {};
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
    console.log(`useAllActiveDomainFromDataCenter ... ${dataCenterId}`);
    const res = await ApiManager.findActiveDomainFromDataCenter(dataCenterId); 
    return res?.map((e) => mapPredicate(e)) ?? []; 
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
    console.log(`Fetching datacenters with ID: ${storageDomainId}`);
    const res = await ApiManager.findAllDataCentersFromDomain(storageDomainId);
    return res ?? '';

    // console.log(`useAllDataCenterFromDomain ... ${storageDomainId}`);
    // const res = await ApiManager.findAllDataCentersFromDomain(storageDomainId); 
    // console.log('API Response:', res);
    // return res?.map((e) => mapPredicate(e)) ?? []; // 데이터 가공
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
    console.log(`useAllVMFromDomain ... ${storageDomainId}`);
    const res = await ApiManager.findAllVMsFromDomain(storageDomainId); 
    return res?.map((e) => mapPredicate(e)) ?? []; 
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
  queryKey: ['AllVMFromDomain', storageDomainId], 
  queryFn: async () => {
    console.log(`useAllUnregisteredVMFromDomain ... ${storageDomainId}`);
    const res = await ApiManager.findAllUnregisterdVMsFromDomain(storageDomainId); 
    return res?.map((e) => mapPredicate(e)) ?? []; 
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
    console.log(`useAllDiskFromDomain ... ${storageDomainId}`);
    const res = await ApiManager.findAllDisksFromDomain(storageDomainId); 
    return res?.map((e) => mapPredicate(e)) ?? []; 
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
    console.log(`useAllUnregisteredDiskFromDomain ... ${storageDomainId}`);
    const res = await ApiManager.findAllUnregisteredDisksFromDomain(storageDomainId); 
    return res?.map((e) => mapPredicate(e)) ?? []; 
  },
  enabled: !!storageDomainId,
})
/**
 * @name useRegisteredDiskFromDomain
 * @description 도메인 디스크 불러오기
 * 
 * @returns useMutation 훅
 */
export const useRegisteredDiskFromDomain = () => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({storageDomainId, diskId}) => {
      return await ApiManager.registeredDiskFromDomain(storageDomainId, diskId)
    },
    onSuccess: () => {
      console.log(`domain 디스크 불러오기 성공`)
      queryClient.invalidateQueries('allStorageDomains');
    },
    onError: (error) => {
      console.error('Error register disk to storageDomain:', error);
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
    console.log(`useAllTemplateFromDomain ... ${storageDomainId}`);
    const res = await ApiManager.findAllTemplatesFromDomain(storageDomainId); 
    return res?.map((e) => mapPredicate(e)) ?? []; 
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
    console.log(`useAllUnregisteredTemplateFromDomain ... ${storageDomainId}`);
    const res = await ApiManager.findAllUnregisteredTemplatesFromDomain(storageDomainId); 
    return res?.map((e) => mapPredicate(e)) ?? []; 
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
    console.log(`useAllDiskProfileFromDomain ... ${storageDomainId}`);
    const res = await ApiManager.findAllDiskProfilesFromDomain(storageDomainId);
    return res?.map((e) => mapPredicate(e)) ?? [];
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
    console.log(`useAllDiskSnapshotFromDomain ... ${storageDomainId}`);
    const res = await ApiManager.findAllDiskSnapshotsFromDomain(storageDomainId); 
    return res?.map((e) => mapPredicate(e)) ?? []; 
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
    console.log(`useAllEventFromDomain ... ${storageDomainId}`);
    const res = await ApiManager.findAllEventsFromDomain(storageDomainId); 
    return res?.map((e) => mapPredicate(e)) ?? []; 
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
    console.log(`useAllEventFromDomain ...`);
    const res = await ApiManager.findActiveDataCenters(); 
    return res?.map((e) => mapPredicate(e)) ?? []; 
  }
})

/**
 * @name useAddDomain
 * @description 도메인 생성 useMutation 훅(수정해야됨)
 * 
 * @returns useMutation 훅
 */
export const useAddDomain = () => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (domainData) => await ApiManager.addDomain(domainData),
    onSuccess: () => {
      console.log('domain 생성성공')
      queryClient.invalidateQueries('allStorageDomains');
    },
    onError: (error) => {
      console.error('Error adding storageDomain:', error);
    },  
  });
};

/**
 * @name useImportDomain
 * @description 도메인 가져오기 useMutation 훅(수정해야됨)
 * 
 * @returns useMutation 훅
 */
export const useImportDomain = () => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (domainData) => await ApiManager.importDomain(domainData),
    onSuccess: () => {
      console.log('domain 가져오기 성공')
      queryClient.invalidateQueries('allStorageDomains');
    },
    onError: (error) => {
      console.error('Error adding storageDomain:', error);
    },  
  });
};
/**
 * @name useEditDomain
 * @description 도메인 수정 useMutation 훅(수정해야됨)
 * 
 * @returns useMutation 훅
 */
export const useEditDomain = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ domainId, domainData }) => await ApiManager.editDomain(domainId, domainData),
    onSuccess: () => {
      queryClient.invalidateQueries('allStorageDomains');
    },
    onError: (error) => {
      console.error('Error editing domain:', error);
    },
  });
};

/**
 * @name useDeleteDomain
 * @description 도메인 삭제 useMutation 훅(확인안해봄-생성해보고 삭제해보기)
 * 
 * @returns useMutation 훅
 */
export const useDeleteDomain = () => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({ 
    mutationFn: async ({domainId, format, hostName}) => {
      console.log(` domainId: ${domainId}, format: ${format}, host: ${hostName}`);
      await ApiManager.deleteDomain(domainId, format, hostName)
    },
    onSuccess: () => {      
      queryClient.invalidateQueries('allStorageDomains');
    },
    onError: (error) => {
      console.error('Error deleting domain:', error);
    },
  });
};

/**
 * @name useDestroyDomain
 * @description 도메인파괴 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useDestroyDomain = () => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (domainId) => await ApiManager.destroyDomain(domainId),
    onSuccess: () => {
      queryClient.invalidateQueries('allStorageDomains');
    },
    onError: (error) => {
      console.error('Error destroy domain:', error);
    },  
  });
};

/**
 * @name useActivateDomain
 * @description 호스트 활성 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useActivateDomain = () => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async ({domainId, dataCenterId}) => await ApiManager.activateDomain(domainId, dataCenterId),
    onSuccess: () => {
      queryClient.invalidateQueries('allStorageDomains');
    },
    onError: (error) => {
      console.error('Error activate domain:', error);
    },  
  });
};

/**
 * @name useAttachDomain
 * @description 호스트 연결 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useAttachDomain = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({storageDomainId, dataCenterId}) => await ApiManager.attachDomain(storageDomainId, dataCenterId),
    onSuccess: () => {
      queryClient.invalidateQueries('allStorageDomains');
    },
    onError: (error) => {
      console.error('Error attach Domain:', error);
    },  
  });
};

/**
 * @name useDetachDomain
 * @description 호스트 분리 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useDetachDomain = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({domainId, dataCenterId}) => await ApiManager.detachDomain(domainId, dataCenterId),
    onSuccess: () => {
      queryClient.invalidateQueries('allStorageDomains');
    },
    onError: (error) => {
      console.error('Error detach Domain:', error);
    },  
  });
};

/**
 * @name useMaintenanceDomain
 * @description 호스트 유지보수 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useMaintenanceDomain = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({domainId, dataCenterId}) => await ApiManager.maintenanceDomain(domainId, dataCenterId),
    onSuccess: () => {
      queryClient.invalidateQueries('allStorageDomains');
    },
    onError: (error) => {
      console.error('Error maintenance Domain:', error);
    },  
  });
};


//region: storage -----------------디스크---------------------
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
    return res?.map((e) => mapPredicate(e)) ?? [];
  },
  staleTime: 2000, // 2초 동안 데이터 재요청 방지
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
    console.log(`useDiskById: ${diskId}`);
    const res = await ApiManager.findDisk(diskId);
    return res ?? {};
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
    console.log(`useAllVmsFromDisk ... ${diskId}`);
    const res = await ApiManager.findAllVmsFromDisk(diskId); 
    return res?.map((e) => mapPredicate(e)) ?? []; 
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
    console.log(`useAllStorageDomainFromDisk ... ${diskId}`);
    const res = await ApiManager.findAllStorageDomainsFromDisk(diskId); 
    return res?.map((e) => mapPredicate(e)) ?? []; 
  },
  enabled: !!diskId,
})

/**
 * @name useAddDisk
 * @description Disk 생성 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useAddDisk = () => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (diskData) => await ApiManager.addDisk(diskData),
    onSuccess: () => {
      queryClient.invalidateQueries('allDisks'); // 호스트 추가 성공 시 'allDHosts' 쿼리를 리패칭하여 목록을 최신화
    },
    onError: (error) => {
      console.error('Error adding disk:', error);
    },  
  });
};
/**
 * @name useEditDisk
 * @description Disk 수정 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useEditDisk = () => {
  const queryClient = useQueryClient();  
  return useMutation({
    mutationFn: async ({ diskId, diskData }) => await ApiManager.editDisk(diskId, diskData),
    onSuccess: () => {
      queryClient.invalidateQueries('allDisks');
    },
    onError: (error) => {
      console.error('Error editing disk:', error);
    },
  });
};
/**
 * @name useDeleteDisk
 * @description Disk 삭제 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useDeleteDisk = () => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({ 
    mutationFn: async (diskId) => await ApiManager.deleteDisk(diskId),
    onSuccess: () => {
      queryClient.invalidateQueries('allDisks');
    },
    onError: (error) => {
      console.error('Error deleting disk:', error);
    },
  });
};

/**
 * @name useUploadDisk
 * @description Disk 업로드 useMutation 훅
 * 
 * @returns useMutation 훅
 */
export const useUploadDisk = () => {
  const queryClient = useQueryClient();  // 캐싱된 데이터를 리패칭할 때 사용
  return useMutation({
    mutationFn: async (diskData) => await ApiManager.uploadDisk(diskData),
    onSuccess: () => {
      queryClient.invalidateQueries('allDisks'); // 호스트 추가 성공 시 'allDHosts' 쿼리를 리패칭하여 목록을 최신화
    },
    onError: (error) => {
      console.error('Error uploading disk:', error);
    },  
  });
};


//region: event -----------------이벤트---------------------
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
    return res?.map((e) => mapPredicate(e)) ?? []
  }
})
// endregion: event

//region: setting -----------------설정---------------------
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
    const res = await ApiManager.findUsers()
    return res?.map((e) => mapPredicate(e)) ?? []
  }
})



// endregion: setting