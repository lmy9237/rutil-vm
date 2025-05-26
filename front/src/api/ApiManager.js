import ENDPOINTS from "./Endpoints"
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Logger from "@/utils/Logger";

if (process.env.NODE_ENV === 'production') {
  Logger.info("THIS IS PRODUCTION !!!")
  Logger.debug(`ApiManager.js ... process.env.VITE_RUTIL_VM_OVIRT_IP_ADDRESS: __RUTIL_VM_OVIRT_IP_ADDRESS__\n\n`)
  axios.defaults.baseURL = 'https://__RUTIL_VM_OVIRT_IP_ADDRESS__:6690';
}

axios.interceptors.request.use(config => {
  // config.headers['Content-Type'] = 'application/json;charset=utf-8';
  return config;
});

/**
 * @name makeAPICall
 * @description axios API 호출
 * 
 * @param {*} 파라미터
 * @returns 결과값
 */
// const makeAPICall = async ({method = "GET", url, data, defaultValues}) => {
const makeAPICall = async ({
  method = "GET", 
  responseType = "json",
  url,
  data,
}) => {
  try {
    const res = await axios({
      method: method,
      url: url,
      // TODO: access_token으로 모든 API 처리하기
      data: method === "GET" ? null : data,
      responseType: responseType
    });
    res.headers.get(`access_token`) && localStorage.setItem('token', res.headers.get(`access_token`)) // 로그인이 처음으로 성공했을 때 진행
    return res.data
  } catch(e) {
    Logger.debug(`Error handling endpoint '${url}':`, e);
    const err = e?.response?.data;
    err && toast({
      variant: "destructive",
      title: "API 오류가 발생하였습니다.",
      description: `${err?.head?.message} [${err?.head?.code}]`,
    });
    // toast.error(`${err?.head?.message} [${err?.head?.code}]`)
    return err;
  }
}

const ApiManager = {
  //#region: TreeNavigation
  /**
   * @name ApiManager.findAllTreeNaviations
   * @description cpu, memory api 불러오는 값
   * 
   * @returns 
   * 
   * @see Dashboard
   */
  findAllTreeNaviations: async (type = "none") => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_ALL_TREE_NAVIGATIONS(type), 
    // defaultValues: DEFAULT_VALUES.FIND_ALL_TREE_NAVIGATIONS
  }),
  //#endregion

  //#region: Dashboard--------------------------------------------
  /**
   * @name ApiManager.getDashboard
   * @description cpu, memory api 불러오는 값
   * 
   * @returns 
   * 
   * @see Dashboard.js (components)
   */
  getDashboard: async () => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.GET_DASHBOARD(), 
    // defaultValues: DEFAULT_VALUES.GET_DASHBOARD
  }),
  /**
   * @name ApiManager.getCpuMemory
   * @description cpu, memory api 불러오는 값
   * 
   * @returns 
   * 
   * @see Dashboard.js (components)
   */
  getCpuMemory: async () => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.GET_CPU_MEMORY(), 
    // defaultValues: DEFAULT_VALUES.GET_CPU_MEMORY
  }),
  /**
   * @name ApiManager.getStorage
   * @description storage 불러오는 값
   * 
   * @returns 
   * 
   * @see Dashboard.js (components)
   */
  getStorage: async () => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.GET_STORAGE(), 
    // defaultValues: DEFAULT_VALUES.GET_STORAGE
  }),
  /**
   * @name ApiManager.getHosts
   * @description host 전체 cpu,memory 평균값 불러오는 값
   * 
   * @returns 
   * 
   * @see Dashboard.js (components)
   */
  getHosts: async () => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.GET_PER_HOSTS(),
  }),
  /**
   * @name ApiManager.getDomain
   * @description storagedomain size 평균값 불러오는 값
   * 
   * @returns 
   * 
   * @see Dashboard.js (components)
   */
  getDomain: async () => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.GET_PER_DOMAIN(),
  }),
  /**
   * @name ApiManager.getHost
   * @description host 전체 cpu,memory 평균값 불러오는 값
   * 
   * @returns 
   * 
   * @see Dashboard.js (components)
   */
  getHost: async (hostId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.GET_PER_HOST(hostId),
  }),
  /**
   * @name ApiManager.getVmCpu
   * @description vmCpu 불러오는 값
   * 
   * @returns 
   * 
   * @see Dashboard.js (components)
   */
  getVmCpu: async () => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.GET_VM_CPU(),
  }),
  /**
   * @name ApiManager.getVmMemory
   * @description vmMemory 불러오는 값
   * 
   * @returns 
   * 
   * @see Dashboard.js (components)
   */
  getVmMemory: async () => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.GET_VM_MEMORY()
  }),
  /**
   * @name ApiManager.getStorageMemory
   * @description storageMemory 불러오는 값
   * 
   * @returns 
   * 
   * @see Dashboard.js (components)
   */
  getStorageMemory: async () => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.GET_STORAGE_MEMORY()
  }),

   /**
   * @name ApiManager.getPerVmCpu
   * @description vm 불러오는 값
   * 
   * @returns 
   * 
   * @see Dashboard.js (components)
   */
   getPerVmCpu: async () => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.GET_PER_VM_CPU()
  }),
   /**
   * @name ApiManager.getPerVmMemory
   * @description vm 불러오는 값
   * 
   * @returns 
   * 
   * @see Dashboard.js (components)
   */
   getPerVmMemory: async () => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.GET_PER_VM_MEMORY()
  }),
  /**
  * @name ApiManager.getPerVmNetwork
  * @description vm 불러오는 값
  * 
  * @returns 
  * 
  * @see Dashboard.js (components)
  */
  getPerVmNetwork: async () => makeAPICall({
   method: "GET", 
   url: ENDPOINTS.GET_PER_VM_NETWORK()
 }),

   /**
   * @name ApiManager.getMetricVmCpu
   * @description vm 불러오는 값
   * 
   * @returns 
   * 
   * @see Dashboard.js (components)
   */
   getMetricVmCpu: async () => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.GET_METRIC_VM_CPU()
  }),

   /**
   * @name ApiManager.getMetricVmMemory
   * @description vm 불러오는 값
   * 
   * @returns 
   * 
   * @see Dashboard.js (components)
   */
   getMetricVmMemory: async () => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.GET_METRIC_VM_MEMORY()
  }),
  
   /**
   * @name ApiManager.getMetricStorage
   * @description 스토리지 불러오는 값
   * 
   * @returns 
   * 
   * @see Dashboard.js (components)
   */
   getMetricStorage: async () => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.GET_METRIC_STORAGE()
  }),
  //#endregion: Dashboard

  //#region: DataCenter
  /**
   * @name ApiManager.findAllDataCenters
   * @description datacenter 목록 
   *
   * @returns 
   * 
   * @see Computing.js (components/Computing)
   */
  findAllDataCenters: async () => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_ALL_DATA_CENTERS(), 
    // defaultValues: DEFAULT_VALUES.FIND_ALL_DATA_CENTERS
  }),
  /**
   * @name ApiManager.findDataCenter
   * @description datacenter
   *
   * @param {string} dataCenterId
   * @returns 
   * 
   * @see Computing.js (components/Computing)
   */
  findDataCenter: async (dataCenterId) => makeAPICall({ 
    method: "GET",  
    url: ENDPOINTS.FIND_DATA_CENTER(dataCenterId), 
    // defaultValues: DEFAULT_VALUES.FIND_DATACENTER
  }),
  /**
   * @name ApiManager.findAllClustersFromDataCenter
   * @description  데이터 센터 내 클러스터
   * 
   * @param {string} dataCenterId
   * @returns 
   */
  findAllClustersFromDataCenter: async (dataCenterId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_CLUSTERS_FROM_DATA_CENTER(dataCenterId), 
    // defaultValues: DEFAULT_VALUES.FIND_CLUSTERS_FROM_DATA_CENTER
  }),
  /**
   * @name ApiManager.findAllHostsFromDataCenter
   * @description 데이터 센터 내 호스트
   * 
   * @param {string} dataCenterId
   * @returns 
   */
  findAllHostsFromDataCenter: async (dataCenterId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_HOSTS_FROM_DATA_CENTER(dataCenterId), 
    // defaultValues: DEFAULT_VALUES.FIND_ALL_TEMPLATES_FROM_NETWORK
  }),

  /**
   * @name ApiManager.findAllVmsFromDataCenter
   * @description  데이터 센터 내 가상머신
   *  
   * @param {string} dataCenterId
   * @returns 
   */
  findAllVmsFromDataCenter: async (dataCenterId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_VMS_FROM_DATA_CENTER(dataCenterId), 
    // defaultValues: DEFAULT_VALUES.FIND_ALL_VMS
  }),
  /**
   * @name ApiManager.findAllDomainsFromDataCenter
   * @description  데이터 센터 내 도메인
   * 
   * @param {string} dataCenterId
   * @returns 
   */
  findAllDomainsFromDataCenter: async (dataCenterId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_STORAGE_DOMAINS_FROM_DATA_CENTER(dataCenterId), 
    // defaultValues: DEFAULT_VALUES.FIND_ALL_STORAGE_DOMAINS
  }),
  /**
   * @name ApiManager.findAllNetworksFromDataCenter
   * @description  데이터 센터 내 네트워크
   * 
   * @param {string} dataCenterId
   * @returns 
   */
  findAllNetworksFromDataCenter: async (dataCenterId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_NETWORKS_FROM_DATA_CENTER(dataCenterId), 
    // defaultValues: DEFAULT_VALUES.FIND_NETWORKS_FROM_DATA_CENTER
  }),
  /**
   * @name ApiManager.findAllEventsFromDataCenter
   * @description  데이터 센터 내 이벤트
   * 
   * @param {string} dataCenterId
   * @returns 
   */
  findAllEventsFromDataCenter: async (dataCenterId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_EVENTS_FROM_DATA_CENTER(dataCenterId), 
    // defaultValues: DEFAULT_VALUES.FIND_EVENT
  }),

  /**
   * @name ApiManager.findTemplatesFromDataCenter
   * @description 연결할 수 있는 템플릿 목록
   * 
   * @param {string} dataCenterId
   * @returns 
   **/
  findTemplatesFromDataCenter : async (dataCenterId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_TEMPLATES_FROM_DATA_CENTER(dataCenterId), 
  }),  

  /**
   * @name ApiManager.findAllAttachedDisksFromDataCenter
   * @description 연결할 수 있는 디스크 목록
   * 
   * @param {string} dataCenterId
   * @returns 
   **/
  findAllAttachedDisksFromDataCenter : async (dataCenterId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_ATTACH_DISK_LIST_FROM_DATA_CENTER(dataCenterId), 
    // defaultValues: DEFAULT_VALUES.FIND_DISK_LIST_FROM_VM
  }),  
  /**
   * @name ApiManager.findAllISOFromDataCenter
   * @description iso 목록
   * 
   * @param {string} dataCenterId
   * @returns 
   **/
  findAllISOFromDataCenter : async (dataCenterId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_ISOS_FROM_DATA_CENTER(dataCenterId), 
    // defaultValues: DEFAULT_VALUES.FIND_ISOS_FROM_VM
  }),

  /**
   * @name ApiManager.addDataCenter
   * @description 새 데이터센터 생성
   * 
   * @param {Object} dataCenterData - 추가할 데이터센터 정보
   * @returns {Promise<Object>} API 응답 결과
   */
  addDataCenter: async (dataCenterData) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.ADD_DATA_CENTER(),
      data: dataCenterData, // POST 요청 시 전송할 데이터
      // defaultValues: DEFAULT_VALUES.ADD_DATA_CENTER
    });
  },
  /**
   * @name ApiManager.editDataCenter
   * @description 데이터센터 편집
   * 
   * @param {string} dataCenterId
   * @param {Object} dataCenterData - 추가할 데이터센터 정보
   * @returns {Promise<Object>} API 응답 결과
   */
    editDataCenter: async (dataCenterId, dataCenterData) => {
      return makeAPICall({
        method: "PUT",
        url: ENDPOINTS.EDIT_DATA_CENTER(dataCenterId),
        data: dataCenterData, // PUT 요청 시 전송할 데이터
      });
    },
  /**
   * @name ApiManager.deleteDataCenter
   * @description 데이터센터 삭제
   * 
   * @param {String} dataCenterId - 삭제할 데이터센터 ID
   * @returns {Promise<Object>} API 응답 결과
   */
  deleteDataCenter: async (dataCenterId) => {
    return makeAPICall({
      method: "DELETE",
      url: ENDPOINTS.DELETE_DATA_CENTER(dataCenterId),  // ID를 URL에 포함
      data: dataCenterId
    });
  },
  //#endregion: DataCenter

  //#region: Cluster
  /**
   * @name ApiManager.findAllClusters
   * @description 클러스터 목록 
   *
   * @returns 
   * 
   * @see
   */
  findAllClusters: async ()  => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_ALL_CLUSTERS(), 
    // defaultValues: DEFAULT_VALUES.FIND_ALL_CLUSTERS
  }),
  /**
   * @name ApiManager.findAllUpClusters
   * @description 클러스터 목록 (datacenter status=up)
   *
   * @returns 
   * 
   * @see
   */
  findAllUpClusters: async ()  => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_ALL_UP_CLUSTERS(), 
    // defaultValues: DEFAULT_VALUES.FIND_ALL_CLUSTERS
  }),
   /**
   * @name ApiManager.findCluster
   * @description 클러스터
   *
   * @param {string} clusterId
   * @returns 
   * 
   * @see
   */
  findCluster: async (clusterId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_CLUSTER(clusterId), 
    // defaultValues: DEFAULT_VALUES.FIND_CLUSTERS_BY_ID
  }),
  /**
   * @name ApiManager.findHostsFromCluster
   * @description 호스트 목록 
   *
   * @param {string} clusterId
   * @returns 
   * 
   * @see
   */
  findHostsFromCluster : async (clusterId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_HOSTS_FROM_CLUSTER(clusterId), 
    // defaultValues: DEFAULT_VALUES.FIND_HOST_FROM_CLUSTER
  }),
   /**
   * @name ApiManager.findVMsFromCluster
   * @description vm 목록 
   *
   * @param {string} clusterId
   * @returns 
   * 
   * @see
   */
  findVMsFromCluster : async (clusterId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_VMS_FROM_CLUSTER(clusterId), 
    // defaultValues: DEFAULT_VALUES.FIND_VM_FROM_CLUSTER
  }),
   /**
   * @name ApiManager.findNetworksFromCluster
   * @description 클러스터 네트워크 목록 
   *
   * @param {string} clusterId
   * @returns 
   * 
   * @see
   */
  findNetworksFromCluster : async (clusterId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_NETWORKS_FROM_CLUSTER(clusterId), 
    // defaultValues: DEFAULT_VALUES.FIND_HOST_FROM_CLUSTER
  }),
   /**
   * @name ApiManager.addNetworkFromCluster
   * @description 클러스터 새 네트워크 생성
   * 
   * @param {string} clusterId
   * @param {Object} networkData - 추가할 클러스터 정보
   * @returns {Promise<Object>} API 응답 결과
   */
   addNetworkFromCluster: async (clusterId, networkData) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.ADD_NETWORK_FROM_CLUSTER(clusterId),
      data: networkData, // POST 요청 시 전송할 데이터
      // defaultValues: DEFAULT_VALUES.ADD_NETWORK_CLUSTER
    });
  },
   /**
   * @name ApiManager.addNetworkFromCluster
   * @description 클러스터 네트워크 편집
   * 
   * @param {string} clusterId
   * @param {Object} networkData - 추가할 클러스터 정보
   * @returns {Promise<Object>} API 응답 결과
   */
    editNetworkFromCluster: async (clusterId, networkData) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.MANAGE_NETWORKS_FROM_CLUSTER(clusterId),
      data: networkData, // POST 요청 시 전송할 데이터
      // defaultValues: DEFAULT_VALUES.ADD_NETWORK_CLUSTER
    });
  },  
  /**
   * @name ApiManager.findVNicFromCluster
   * @description vnicprofile 목록
   * 
   * @returns 
   **/
  findVNicFromCluster : async (clusterId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_VNICPROFILES_FROM_CLUSTER(clusterId), 
    // defaultValues: DEFAULT_VALUES.FIND_NICS_FROM_CLUSTER
  }),
   /**
   * @name ApiManager.findEventsFromCluster
   * @description 이벤트 목록 
   *
   * @param {string} clusterId
   * @returns 
   * 
   * @see
   */
  findEventsFromCluster: async (clusterId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_EVENTS_FROM_CLUSTER(clusterId), 
    // defaultValues: DEFAULT_VALUES.FIND_EVENT_FROM_CLUSTER
  }),
   /**
   * @name ApiManager.findCpuProfilesFromCluster
   * @description cpuProfile 목록 
   *
   * @param {string} clusterId
   * @returns 
   * 
   * @see
   */
   findCpuProfilesFromCluster: async (clusterId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_CPU_PROFILES_FROM_CLUSTER(clusterId), 
    // defaultValues: DEFAULT_VALUES.FIND_CPU_PROFILES_FROM_CLUSTER
  }),
  /**
   * @name ApiManager.findOsSystemsFromCluster
   * @description 운영시스템 목록 
   *
   * @param {string} clusterId
   * @returns 
   * 
   * @see
   */
  findOsSystemsFromCluster: async (clusterId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_OS_SYSTEM_FROM_CLUSTER(clusterId), 
  }),


  /**
   * @name ApiManager.addCluster
   * @description 새 클러스터 생성
   * 
   * @param {Object} clusterData - 추가할 클러스터 정보
   * @returns {Promise<Object>} API 응답 결과
   */
  addCluster: async (clusterData) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.ADD_CLUSTER(),
      data: clusterData, // POST 요청 시 전송할 데이터
      // defaultValues: DEFAULT_VALUES.ADD_CLUSTER
    });
  },
  /**
   * @name ApiManager.editCluster
   * @description 클러스터 편집
   * 
   * @param {string} clusterId
   * @param {Object} clusterData - 추가할 클러스터 정보
   * @returns {Promise<Object>} API 응답 결과
   */
  editCluster: async (clusterId, clusterData) => {
    return makeAPICall({
      method: "PUT",
      url: ENDPOINTS.EDIT_CLUSTER(clusterId),
      data: clusterData, // PUT 요청 시 전송할 데이터
    });
  },
  /**
   * @name ApiManager.deleteCluster
   * @description 클러스터 삭제
   * 
   * @param {String} clusterId - 삭제할 클러스터 ID
   * @returns {Promise<Object>} API 응답 결과
   */
  deleteCluster: async (clusterId) => {
    return makeAPICall({
      method: "DELETE",
      url: ENDPOINTS.DELETE_CLUSTER(clusterId),  // ID를 URL에 포함
      data: clusterId
    });
  },
  //#endregion: Cluster

  //#region: Cluster Level
  findAllClusterLevels: async (cateogry="") => makeAPICall({
    method: "GET",
    url: ENDPOINTS.FIND_ALL_CLUSTER_LEVELS(cateogry),
  }),
  findClusterLevel: async (clusterLevelId="") => makeAPICall({
    method: "GET",
    url: ENDPOINTS.FIND_CLUSTER_LEVEL(clusterLevelId),
  }),
  //#endregion: Cluster Level

  //#region: Host
  /**
   * @name ApiManager.findAllHosts
   * @description 호스트 목록 
   *
   * @returns 
   * 
   * @see
   */
  findAllHosts : async () => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_ALL_HOSTS(), 
    // defaultValues: DEFAULT_VALUES.FIND_ALL_HOSTS
  }),
  /**
   * @name ApiManager.findHost
   * @description 호스트
   *
   * @param {string} hostId
   * @returns 
   * 
   * @see
   */
  findHost : async (hostId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_HOST(hostId), 
    // defaultValues: DEFAULT_VALUES.FIND_HOST
  }),
  /**
   * @name ApiManager.findVmsFromHost
   * @description 가상머신 목록
   *
   * @param {string} hostId
   * @returns 
   * 
   * @see
   */
  findVmsFromHost : async (hostId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_VMS_FROM_HOST(hostId), 
    // defaultValues: DEFAULT_VALUES.FIND_HOST_FROM_CLUSTER
  }),
  /**
   * @name ApiManager.findHostNicsFromHost
   * @description 호스트 Nic 목록
   *
   * @param {string} hostId
   * @returns 
   * 
   * @see
   */
  findHostNicsFromHost : async (hostId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_HOST_NICS_FROM_HOST(hostId), 
    // defaultValues: DEFAULT_VALUES.FIND_NICS_FROM_HOST
  }),
  /**
   * @name ApiManager.findHostNicFromHost
   * @description 호스트 Nic
   *
   * @param {string} hostId
   * @returns 
   * 
   * @see
   */
  findHostNicFromHost : async (hostId, nicId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_HOST_NIC_FROM_HOST(hostId, nicId), 
    // defaultValues: DEFAULT_VALUES.FIND_NICS_FROM_HOST
  }),
  /**
   * @name ApiManager.findNetworkAttachmentsFromHost
   * @description 호스트 NetworkAttachments 목록
   *
   * @param {string} hostId
   * @returns 
   * 
   * @see
   */
  findNetworkAttachmentsFromHost : async (hostId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_NETWORK_ATTACHMENTS_FROM_HOST(hostId), 
    // defaultValues: DEFAULT_VALUES.FIND_NICS_FROM_HOST
  }),
  /**
   * @name ApiManager.findNetworkAttachmentFromHost
   * @description 호스트 NetworkAttachments 목록
   *
   * @param {string} hostId
   * @returns 
   * 
   * @see
   */
  findNetworkAttachmentFromHost : async (hostId, networkAttachmentId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_NETWORK_ATTACHMENT_FROM_HOST(hostId, networkAttachmentId), 
  }),
  
  /**
   * @name ApiManager.setupHostNicsFromHost
   * @description 
   *
   * @param {string} hostId
   * @param {string} hostNetwork
   * @returns 
   * 
   * @see
   */
  setupHostNicsFromHost : async (hostId, hostNetwork) => makeAPICall({
    method: "POST", 
    url: ENDPOINTS.SETUP_HOST_NICS_FROM_HOST(hostId), 
    data: hostNetwork
  }),

  /**
   * @name ApiManager.editNetworkAttachmentFromHost
   * @description 
   *
   * @param {string} hostId
   * @param {string} networkAttachmentId
   * @returns 
   * 
   * @see
   */
  // editNetworkAttachmentFromHost : async (hostId, networkAttachmentId, networkAttachmentData) => makeAPICall({
  //   method: "PUT", 
  //   url: ENDPOINTS.EDIT_NETWORK_ATTACHMENT_FROM_HOST(hostId, networkAttachmentId), 
  //   data: networkAttachmentData
  // }),

  /**
   * @name ApiManager.addBonding
   * @description 새 Bonding 생성
   * 
   * @param {Object} hostId - 호스트 id
   * @param {Object} hostNicData - 추가할 본딩 정보
   * @returns {Promise<Object>} API 응답 결과
   */
  // addBonding: async (hostId, hostNicData) => {
  //   return makeAPICall({
  //     method: "POST",
  //     url: ENDPOINTS.ADD_BONDING_HOST_NIC_FROM_HOST(hostId),
  //     data: hostNicData, // POST 요청 시 전송할 데이터
  //   });
  // },
  /**
   * @name ApiManager.editBonding
   * @description Bonding 편집
   * 
   * @param {string} hostId
   * @param {Object} hostNicData - 추가할 본딩 정보
   * @returns {Promise<Object>} API 응답 결과
   */
  // editBonding: async (hostId, hostNicData) => {
  //   return makeAPICall({
  //     method: "PUT",
  //     url: ENDPOINTS.EDIT_BONDING_HOST_NICS_FROM_HOST(hostId),
  //     data: hostNicData, // PUT 요청 시 전송할 데이터
  //   });
  // },
  /**
   * @name ApiManager.deleteBonding
   * @description Bonding 삭제
   * 
   * @param {String} hostId - 호스트 ID
   * @returns {Promise<Object>} API 응답 결과
   */
  // deleteBonding: async (hostId) => {
  //   return makeAPICall({
  //     method: "DELETE",
  //     url: ENDPOINTS.DELETE_BONDING_HOST_NICS_FROM_HOST(hostId),  // ID를 URL에 포함
  //     data: hostId
  //   });
  // },

  /**
   * @name ApiManager.findHostdevicesFromHost
   * @description 호스트 장치 목록
   *
   * @param {string} hostId
   * @returns 
   * 
   * @see
   */
  findHostdevicesFromHost : async (hostId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_HOSTDEVICES_FROM_HOST(hostId), 
    // defaultValues: DEFAULT_VALUES.FIND_DEVICE_FROM_HOST
  }),
  /**
   * @name ApiManager.findEventsFromHost
   * @description 호스트 이벤트 목록
   *
   * @param {string} hostId
   * @returns 
   * 
   * @see
   */
  findEventsFromHost: async (hostId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_EVENTS_FROM_HOST(hostId), 
    // defaultValues: DEFAULT_VALUES.FIND_EVNET_FROM_HOST
  }),


  /**
   * @name ApiManager.addHost
   * @description 새 호스트 생성
   * 
   * @param {Object} hostData - 추가할 호스트 정보
   * @returns {Promise<Object>} API 응답 결과
   */
  addHost: async (hostData, deployHostedEngine) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.ADD_HOST(deployHostedEngine),
      data: hostData, // POST 요청 시 전송할 데이터
      // defaultValues: DEFAULT_VALUES.ADD_HOST
    });
  },
  /**
   * @name ApiManager.editHost
   * @description 호스트 편집
   * 
   * @param {string} hostId
   * @param {Object} hostData - 추가할 호스트 정보
   * @returns {Promise<Object>} API 응답 결과
   */
    editHost: async (hostId, hostData) => {
      return makeAPICall({
        method: "PUT",
        url: ENDPOINTS.EDIT_HOST(hostId),
        data: hostData, // PUT 요청 시 전송할 데이터
        // defaultValues: DEFAULT_VALUES.EDIT_HOST
      });
    },
  /**
   * @name ApiManager.deleteHost
   * @description 호스트 삭제
   * 
   * @param {String} hostId - 삭제할 호스트 ID
   * @returns {Promise<Object>} API 응답 결과
   */
  deleteHost: async (hostId) => {
    return makeAPICall({
      method: "DELETE",
      url: ENDPOINTS.DELETE_HOST(hostId),  // ID를 URL에 포함
      data: hostId
    });
  },

  /**
   * @name ApiManager.activateHost
   * @description 호스트 활성
   * 
   * @param {String} hostId - 호스트 ID
   * @returns {Promise<Object>} API 응답 결과
   */
  activateHost: async (hostId) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.ACTIVATE_HOST(hostId),  // ID를 URL에 포함
      data: hostId
    });
  },
  /**
   * @name ApiManager.deactivateHost
   * @description 호스트 유지보수
   * 
   * @param {String} hostId - 호스트 ID
   * @returns {Promise<Object>} API 응답 결과
   */
  deactivateHost: async (hostId) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.DEACTIVATE_HOST(hostId), 
      data: hostId
    });
  },
  /**
   * @name ApiManager.restartHost
   * @description 호스트 재시작
   * 
   * @param {String} hostId - 호스트 ID
   * @returns {Promise<Object>} API 응답 결과
   */
  restartHost: async (hostId) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.RESTART_HOST(hostId),  // ID를 URL에 포함
      data: hostId
    });
  },
  /**
   * @name ApiManager.stopHost
   * @description 호스트 중지
   * 
   * @param {String} hostId - 호스트 ID
   * @returns {Promise<Object>} API 응답 결과
   */
  stopHost: async (hostId) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.STOP_HOST(hostId),  // ID를 URL에 포함
      data: hostId
    });
  },
  /**
   * @name ApiManager.enrollHostCertificate
   * @description 호스트 인증서 등록처리
   * 
   * @param {String} hostId - 호스트 ID
   * @returns {Promise<Object>} API 응답 결과
   */
  enrollHostCertificate: async (hostId) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.ENROLL_HOST_CERTIFICATE(hostId), // ID를 URL에 포함
      data: hostId
    });
  },
  /**
     * @name ApiManager.refreshHost
     * @description 호스트 새로고침
     * 
     * @param {String} hostId - 호스트 ID
     * @returns {Promise<Object>} API 응답 결과
     */
  refreshHost: async (hostId) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.REFRESH_HOST(hostId),  // ID를 URL에 포함
      data: hostId
    });
  },
  /**
    * @name ApiManager.commitNetConfigHost
    * @description 호스트 재시작
    * 
    * @param {String} hostId - 호스트 ID
    * @returns {Promise<Object>} API 응답 결과
    */
  commitNetConfigHost: async (hostId) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.COMMIT_NET_CONFIG_HOST(hostId),  // ID를 URL에 포함
      data: hostId
    });
  },
  /**
    * @name ApiManager.activateGlobalHost
    * @description 호스트 글로벌 HA 유지관리 활성화
    * 
    * @param {String} hostId - 호스트 ID
    * @returns {Promise<Object>} API 응답 결과
    */
  activateGlobalHaHost: async (hostId) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.ACTIVATE_HA_HOST(hostId),  // ID를 URL에 포함
      data: hostId
    });
  },
  /**
    * @name ApiManager.deactivateGlobalHost
    * @description 호스트 글로벌 HA 유지관리 비활성화
    * 
    * @param {String} hostId - 호스트 ID
    * @returns {Promise<Object>} API 응답 결과
    */
  deactivateGlobalHaHost: async (hostId) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.DEACTIVATE_HA_HOST(hostId),  // ID를 URL에 포함
      data: hostId
    });
  },


  //#endregion: Host


  //#region : VM --------------------------------------------
  /**
   * @name ApiManager.findAllVMs
   * @description 가상머신 목록
   * 
   * @returns 
   **/
  findAllVMs : async () => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_ALL_VMS(), 
  }),
  /**
   * @name ApiManager.findVM
   * @description 가상머신
   *
   * @param {string} vmId
   * @returns 
   * 
   * @see
   */
  findVM : async (vmId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_VM(vmId), 
    // defaultValues: DEFAULT_VALUES.FIND_VM
  }),
  /**
   * @name ApiManager.findVM
   * @description 가상머신
   *
   * @param {string} vmId
   * @returns 
   * 
   * @see
   */
  findEditVM : async (vmId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_EDIT_VM(vmId), 
  }),

  /**
   * @name ApiManager.findDisksFromVM
   * @description 디스크 목록
   *
   * @param {string} vmId
   * @returns 
   * 
   * @see
   */
  findDisksFromVM : async (vmId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_DISKS_FROM_VM(vmId), 
    // defaultValues: DEFAULT_VALUES.FIND_DISKS_FROM_VM
  }),
  /**
   * @name ApiManager.findDiskattachmentFromVM
   * @description 디스크
   *
   * @param {string} vmId
   * @param {string} diskAttachmentId
   * @returns 
   * 
   * @see
   */
  findDiskattachmentFromVM : async (vmId, diskAttachmentId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_DISK_FROM_VM(vmId, diskAttachmentId), 
    // defaultValues: DEFAULT_VALUES.FIND_DISK_FROM_VM
  }),
  /**
   * @name ApiManager.addDiskFromVM
   * @description 가상머신 디스크 생성
   * 
   * @param {string} vmId
   * @param {Object} diskData - 추가할 디스크 정보
   * @returns {Promise<Object>} API 응답 결과
   */
  addDiskFromVM: async (vmId, diskData) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.ADD_DISK_FROM_VM(vmId),
      data: diskData, // POST 요청 시 전송할 데이터
      // defaultValues: DEFAULT_VALUES.ADD_DISK_FROM_VM
    });
  },
  /**
   * @name ApiManager.editDiskFromVM
   * @description 가상머신 디스크 편집
   * 
   * @param {string} vmId
   * @param {string} diskAttachmentId
   * @param {Object} diskData - 추가할 디스크 정보
   * @returns {Promise<Object>} API 응답 결과
   */
  editDiskFromVM: async (vmId, diskAttachmentId, diskAttachment) => {
    return makeAPICall({
      method: "PUT",
      url: ENDPOINTS.EDIT_DISK_FROM_VM(vmId, diskAttachmentId),
      data: diskAttachment, // PUT 요청 시 전송할 데이터
    });
  },
  /**
   * @name ApiManager.deleteDisksFromVM
   * @description 가상머신 디스크 삭제(여러개)
   * 
   * @param {String} vmId
   * @param {Object} List<string> diskAttachmentIds
   * @returns {Promise<Object>} API 응답 결과
   */
  deleteDisksFromVM: async (vmId, diskData) => {
    return makeAPICall({
      method: "DELETE",
      url: ENDPOINTS.DELETE_DISKS_FROM_VM(vmId), 
      data: diskData, // diskAttachmentId 목록
      // defaultValues: DEFAULT_VALUES.DELETE_DISKS_FROM_VM
    });
  },
    /**
   * @name ApiManager.deleteSnapshotsFromVM
   * @description 가상머신 디스크 삭제(한개)
   * 
   * @param {String} vmId
   * @param {Object} List
   * @returns {Promise<Object>} API 응답 결과
   */
    deleteDiskFromVM: async (vmId, diskAttachmentId, detachOnly) => {
      return makeAPICall({
        method: "DELETE",
        url: ENDPOINTS.DELETE_DISK_FROM_VM(vmId, diskAttachmentId, detachOnly), 
        data: diskAttachmentId, 
        // defaultValues: DEFAULT_VALUES.DELETE_SNAPSHOTS_FROM_VM
      });
    },
  /**
   * @name ApiManager.attachDiskFromVM
   * @description 가상머신 디스크 연결
   * 
   * @param {String} vmId
   * @param {Object} diskAttachment
   * @returns {Promise<Object>} API 응답 결과
   */
  attachDiskFromVM: async (vmId, diskAttachment) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.ATTACH_DISK_FROM_VM(vmId), 
      data: diskAttachment, 
    });
  },
  /**
   * @name ApiManager.attachDisksFromVM
   * @description 가상머신 디스크 연결(여러개)
   * 
   * @param {String} vmId
   * @param {Object} List<string> diskAttachmentList
   * @returns {Promise<Object>} API 응답 결과
   */
  attachDisksFromVM: async (vmId, diskAttachmentList) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.ATTACH_DISKS_FROM_VM(vmId), 
      data: diskAttachmentList, // diskAttachmentId 목록
      // defaultValues: DEFAULT_VALUES.ATTACH_DISKS_FROM_VM
    });
  },
  /**
   * @name ApiManager.attachDisksFromVM
   * @description 가상머신 디스크 연결(여러개)
   * 
   * @param {String} vmId
   * @param {Object} List<string> diskAttachmentIds
   * @returns {Promise<Object>} API 응답 결과
   */
  attachDisksFromVM: async (vmId, diskData) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.ATTACH_DISKS_FROM_VM(vmId), 
      data: diskData, // diskAttachmentId 목록
      // defaultValues: DEFAULT_VALUES.ATTACH_DISKS_FROM_VM
    });
  },
  /**
   * @name ApiManager.findStorageDomainsFromVM
   * @description 스토리지 도메인 목록
   *
   * @param {string} vmId
   * @param {string} diskAttachmentId
   * @returns 
   * 
   * @see
   */
  findStorageDomainsFromVM : async (vmId, diskAttachmentId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_STORAGE_DOMAINS_FROM_VM(vmId, diskAttachmentId), 
    // defaultValues: DEFAULT_VALUES.FIND_STORAGE_DOMAINS_FROM_VM
  }),
  /**
   * @name ApiManager.activateDisksFromVM
   * @description 가상머신 디스크 활성화(여러개)
   * 
   * @param {String} vmId
   * @param {Object} List<string> diskAttachmentIds
   * @returns {Promise<Object>} API 응답 결과
   */
  activateDisksFromVM: async (vmId, diskAttachmentId) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.ACTIVATE_DISK_FROM_VM(vmId, diskAttachmentId), 
      // defaultValues: DEFAULT_VALUES.ACTIVATE_DISKS_FROM_VM
      data:diskAttachmentId
    });
  },
  /**
   * @name ApiManager.deactivateDisksFromVM
   * @description 가상머신 디스크 비활성화(여러개)
   * 
   * @param {String} vmId
   * @param {Object} List<string> diskAttachmentIds
   * @returns {Promise<Object>} API 응답 결과
   */
  deactivateDisksFromVM: async (vmId, diskAttachmentId) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.DEACTIVATE_DISK_FROM_VM(vmId, diskAttachmentId), 
      // defaultValues: DEFAULT_VALUES.DEACTIVATE_DISKS_FROM_VM
      data:diskAttachmentId
    });
  },
  /**
   * @name ApiManager.moveDisksFromVM
   * @description 가상머신 디스크 이동(여러개)
   * 
   * @param {String} vmId
   * @param {Object} diskData
   * @returns {Promise<Object>} API 응답 결과
   */
  moveDisksFromVM: async (vmId, diskData) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.MOVE_DISK_FROM_VM(vmId), 
      data: diskData,
      // defaultValues: DEFAULT_VALUES.MOVE_DISK_FROM_VM
    });
  },
  /**
   * @name ApiManager.copyDisksFromVM
   * @description 가상머신 디스크 복사
   * 
   * @param {String} vmId
   * @param {Object} diskData
   * @returns {Promise<Object>} API 응답 결과
   */
  copyDisksFromVM: async (vmId, diskData) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.COPY_DISK_FROM_VM(vmId), 
      data: diskData,
      // defaultValues: DEFAULT_VALUES.MOVE_DISK_FROM_VM
    });
  },
  /**
   * @name ApiManager.findHostdevicesFromVM
   * @description 가상머신 호스트 장치 목록
   *
   * @param {string} vmId
   * @returns 
   * 
   * @see
   */
  findHostdevicesFromVM : async (vmId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_HOST_DEVICES_FROM_VM(vmId), 
    // defaultValues: DEFAULT_VALUES.FIND_DEVICE_FROM_HOST
  }),

    /**
   * @name ApiManager.findSnapshotsFromVM
   * @description 스냅샷 목록
   *
   * @param {string} vmId
   * @returns 
   * 
   * @see
   */
  findSnapshotsFromVM : async (vmId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_SNAPSHOTS_FROM_VM(vmId), 
    // defaultValues: DEFAULT_VALUES.FIND_SNAPSHOTS_FROM_VM
  }),
  /**
   * @name ApiManager.findSnapshotFromVm
   * @description 스냅샷 상세정보
   *
   * @param {string} vmId
   * @param {string} snapshotId
   * @returns 
   * 
   * @see
   */
  findSnapshotFromVm : async (vmId, snapshotId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_SNAPSHOT_FROM_VM(vmId, snapshotId), 
    // defaultValues: DEFAULT_VALUES.FIND_SNAPSHOT_FROM_VM
  }),
  /**
   * @name ApiManager.addSnapshotFromVM
   * @description 가상머신 스냅샷 생성
   * 
   * @param {string} vmId
   * @param {Object} snapshotData - 추가할 디스크 정보
   * @returns {Promise<Object>} API 응답 결과
   */
  addSnapshotFromVM: async (vmId, snapshotData) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.ADD_SNAPSHOT_FROM_VM(vmId),
      data: snapshotData, 
      // defaultValues: DEFAULT_VALUES.ADD_SNAPSHOT_FROM_VM
    });
  },
  /**
   * @name ApiManager.deleteSnapshotsFromVM
   * @description 가상머신 스냅샷 삭제(여러개)
   * 
   * @param {String} vmId
   * @param {Object} List<string> diskAttachmentIds
   * @returns {Promise<Object>} API 응답 결과
   */
  deleteSnapshotsFromVM: async (vmId, snapshotData) => {
    return makeAPICall({
      method: "DELETE",
      url: ENDPOINTS.DELETE_SNAPSHOTS_FROM_VM(vmId), 
      data: snapshotData, 
      // defaultValues: DEFAULT_VALUES.DELETE_SNAPSHOTS_FROM_VM
    });
  },

  /**
   * @name ApiManager.deleteSnapshotsFromVM
   * @description 가상머신 스냅샷 삭제(한개)
   * 
   * @param {String} vmId
   * @param {Object} List<string> diskAttachmentIds
   * @returns {Promise<Object>} API 응답 결과
   */
    deleteSnapshotFromVM: async (vmId, snapshotId) => {
      return makeAPICall({
        method: "DELETE",
        url: ENDPOINTS.DELETE_SNAPSHOT_FROM_VM(vmId,snapshotId), 
        data: snapshotId, 
        // defaultValues: DEFAULT_VALUES.DELETE_SNAPSHOTS_FROM_VM
      });
    },
  /**
   * @name ApiManager.previewSnapshotFromVM
   * @description 가상머신 스냅샷 미리보기
   * 
   * @param {string} vmId
   * @param {string} snapshotId
   * @returns {Promise<Object>} API 응답 결과
   */
  previewSnapshotFromVM: async (vmId, snapshotId) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.PREVIEW_SNAPSHOT_FROM_VM(vmId, snapshotId),
      // defaultValues: DEFAULT_VALUES.PREVIEW_SNAPSHOT_FROM_VM
    });
  },
  /**
   * @name ApiManager.cloneSnapshotFromVM
   * @description 가상머신 스냅샷 clone
   * 
   * @param {string} vmId
   * @returns {Promise<Object>} API 응답 결과
   */
  cloneSnapshotFromVM: async (vmId) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.CLONE_SNAPSHOTS_FROM_VM(vmId),
      // defaultValues: DEFAULT_VALUES.CLONE_SNAPSHOTS_FROM_VM
    });
  },
  /**
   * @name ApiManager.commitSnapshotFromVM
   * @description 가상머신 스냅샷 commit
   * 
   * @param {string} vmId
   * @returns {Promise<Object>} API 응답 결과
   */
  commitSnapshotFromVM: async (vmId) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.COMMIT_SNAPSHOTS_FROM_VM(vmId),
      // defaultValues: DEFAULT_VALUES.COMMIT_SNAPSHOTS_FROM_VM
    });
  },
  /**
   * @name ApiManager.undoSnapshotFromVM
   * @description 가상머신 스냅샷 undo
   * 
   * @param {string} vmId
   * @returns {Promise<Object>} API 응답 결과
   */
  undoSnapshotFromVM: async (vmId) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.UNDO_SNAPSHOTS_FROM_VM(vmId),
      // defaultValues: DEFAULT_VALUES.UNDO_SNAPSHOTS_FROM_VM
    });
  },

  /**
   * @name ApiManager.findNicsFromVM
   * @description nic 목록
   * 
   * @param {string} vmId
   * @returns 
   **/
  findNicsFromVM : async (vmId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_NICS_FROM_VM(vmId), 
    // defaultValues: DEFAULT_VALUES.FIND_NICS_FROM_VM
  }),
  /**
   * @name ApiManager.findNicFromVM
   * @description 가상머신 nic
   *
   * @param {string} vmId
   * @param {string} nicId
   * @returns 
   * 
   * @see
   */
  findNicFromVM : async (vmId, nicId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_NIC_FROM_VM(vmId, nicId), 
    // defaultValues: DEFAULT_VALUES.FIND_NIC_FROM_VM
  }),
  /**
   * @name ApiManager.addNicFromVM
   * @description 새 nic 생성
   * 
   * @param {string} vmId
   * @param {Object} nicData
   * @returns {Promise<Object>}
   */
  addNicFromVM: async (vmId, nicData) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.ADD_NICS_FROM_VM(vmId),
      data: nicData,
      // defaultValues: DEFAULT_VALUES.ADD_NICS_FROM_VM
    });
  },
  /**
   * @name ApiManager.editNicFromVM
   * @description 가상머신 nic 편집
   * 
   * @param {string} vmId
   * @param {string} nicId
   * @param {Object} nicData
   * @returns {Promise<Object>} API 응답 결과
   */
  editNicFromVM: async (vmId, nicId, nicData) => {
    Logger.debug(`ApiManager > editNicFromVM ... vmId: ${vmId}, nicId: ${nicId}, nicData: ${nicData}`);
    try {
      const res = await makeAPICall({
        method: "PUT",
        url: ENDPOINTS.EDIT_NIC_FROM_VM(vmId, nicId),
        data: nicData, // PUT 요청 시 전송할 데이터
      });
      Logger.debug(`ApiManager > editNicFromVM ... res: ${JSON.stringify(res, null, 2)}`);
      return res;
    } catch (error) {
      console.error('ApiManager > editNicFromVM ... error:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * @name ApiManager.deleteNicFromVM
   * @description 가상머신 nic 삭제
   * 
   * @param {string} nicId
   * @returns {Promise<Object>}
   */
  deleteNicFromVM: async (vmId, nicId) => {
    return makeAPICall({
      method: "DELETE",
      url: ENDPOINTS.DELETE_NIC_FROM_VM(vmId, nicId),
      data: nicId,
      // defaultValues: DEFAULT_VALUES.DELETE_NIC_FROM_VM
    });
  },

  /**
   * @name ApiManager.findApplicationsFromVM
   * @description applications 목록
   * 
   * @param {string} vmId
   * @returns 
   **/
  findApplicationsFromVM : async (vmId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_APPLICATIONS_FROM_VM(vmId), 
    // defaultValues: DEFAULT_VALUES.FIND_APPLICATIONS_FROM_VM
  }),
  /**
   * @name ApiManager.findHostDevicesFromVM
   * @description hostDevices 목록
   * 
   * @param {string} vmId
   * @returns 
   **/
  findHostDevicesFromVM : async (vmId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_HOST_DEVICES_FROM_VM(vmId), 
    // defaultValues: DEFAULT_VALUES.FIND_HOST_DEVICES_FROM_VM
  }),
  /**
   * @name ApiManager.findEventsFromVM
   * @description events 목록
   * 
   * @param {string} vmId
   * @returns 
   **/
  findEventsFromVM : async (vmId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_EVENTS_FROM_VM(vmId), 
    // defaultValues: DEFAULT_VALUES.FIND_EVENTS_FROM_VM
  }),

  /**
   * @name ApiManager.addVM
   * @description 새 가상머신 생성
   * 
   * @param {Object} vmData 
   * @returns {Promise<Object>}
   */
  addVM: async (vmData) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.ADD_VM(),
      data: vmData,
      // defaultValues: DEFAULT_VALUES.ADD_VM
    });
  },
  /**
   * @name ApiManager.editVM
   * @description 가상머신 편집
   * 
   * @param {string} vmId
   * @param {Object} vmData 
   * @returns {Promise<Object>}
   */
    editVM: async (vmId, vmData) => {
      return makeAPICall({
        method: "PUT",
        url: ENDPOINTS.EDIT_VM(vmId),
        data: vmData,
        // defaultValues: DEFAULT_VALUES.EDIT_VM
      });
    },
    
  /**
   * @name ApiManager.deleteVM
   * @description 가상머신 삭제
   * 
   * @param {String} vmId 
   * @param {String} detachOnly 
   * @returns {Promise<Object>}
   */
  deleteVM: async (vmId, detachOnly) => {
    return makeAPICall({
      method: "DELETE",
      url: ENDPOINTS.DELETE_VM(vmId, detachOnly),
      data: vmId,
    });
  },

  /**
   * @name ApiManager.startVM
   * @description 가상머신 시작
   * 
   * @param {String} vmId
   * @returns {Promise<Object>} 
   */
  startVM: async (vmId) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.START_VM(vmId),  // ID를 URL에 포함
      data: vmId
      // defaultValues: DEFAULT_VALUES.START_VM
    });
  },
  /**
   * @name ApiManager.pauseVM
   * @description 가상머신 일시정지
   * 
   * @param {String} vmId
   * @returns {Promise<Object>} 
   */
  pauseVM: async (vmId) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.PAUSE_VM(vmId),  // ID를 URL에 포함
      data: vmId
      // defaultValues: DEFAULT_VALUES.PAUSE_VM
    });
  },
  /**
   * @name ApiManager.rebootVM
   * @description 가상머신 재부팅
   * 
   * @param {String} vmId
   * @returns {Promise<Object>} 
   */
  rebootVM: async (vmId) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.REBOOT_VM(vmId),  // ID를 URL에 포함
      data: vmId
      // defaultValues: DEFAULT_VALUES.REBOOT_VM
    });
  },
  /**
   * @name ApiManager.powerOffVM
   * @description 가상머신 powerOff
   * 
   * @param {String} vmId
   * @returns {Promise<Object>} 
   */
  powerOffVM: async (vmId) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.POWER_OFF_VM(vmId),  // ID를 URL에 포함
      data: vmId
      // defaultValues: DEFAULT_VALUES.POWER_OFF_VM
    });
  },
  /**
   * @name ApiManager.shutdownVM
   * @description 가상머신 shutdown
   * 
   * @param {String} vmId
   * @returns {Promise<Object>} 
   */
  shutdownVM: async (vmId) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.SHUT_DOWN_VM(vmId),  // ID를 URL에 포함
      data: vmId
      // defaultValues: DEFAULT_VALUES.SHUT_DOWN_VM
    });
  },
  /**
   * @name ApiManager.resetVM
   * @description 가상머신 reset
   * 
   * @param {String} vmId
   * @returns {Promise<Object>} 
   */
  resetVM: async (vmId) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.RESET_VM(vmId),  // ID를 URL에 포함.
      data: vmId
      // defaultValues: DEFAULT_VALUES.RESET_VM
    });
  },
  /**
   * @name ApiManager.exportVM
   * @description 가상머신 export
   * 
   * @param {String} vmId
   * @returns {Promise<Object>} 
   */
  exportVM: async (vmId) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.EXPORT_VM(vmId),  // ID를 URL에 포함
      data: vmId
      // defaultValues: DEFAULT_VALUES.EXPORT_VM
    });
  },
  /**
   * @name ApiManager.migrateHostsFromVM
   * @description 가상머신 마이그레이션 호스트목록
   * 
   * @param {String} vmIds 가상 머신 ID
   */
  findAllMigratableHosts4Vms: async (vmIds) => {
    return makeAPICall({
      method: "GET",
      url: ENDPOINTS.FIND_ALL_MIGRATABLE_HOSTS_4_VMS(vmIds.join(",")),  // ID를 URL에 포함
    });
  },

  /**
   * @name ApiManager.migrateVM
   * @description 가상머신 마이그레이션
   * 
   * @param {String} vmId
   * @param {Vm} vm
   * @param {Boolean} affinityClosure
   * @returns {Promise<Object>} 
   */
  migrateVM: async (vmId, vm, affinityClosure) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.MIGRATE_VM(vmId, vm, affinityClosure),  // ID를 URL에 포함
      data: vm
      // defaultValues: DEFAULT_VALUES.MIGRATE_VM
    });
  },
  /**
   * @name ApiManager.findVmConsoleAccessInfo
   * @description 가상머신의 그래픽 콘솔의 모든 정보를 구성
   * 
   * @param {String} vmId
   * @returns {Promise<Object>} 
   */
  findVmConsoleAccessInfo: async (vmId) => {
    return makeAPICall({
      method: "GET",
      url: ENDPOINTS.CONSOLE_VM(vmId),  // ID를 URL에 포함
    });
  },
  
  /**
   * @name ApiManager.generateVmRemoteViewerConnectionFile
   * @description 가상머신의 그래픽 콘솔 접속을 위한 원격 뷰어 파일 생성 (console.vv)
   * 
   * @param {String} vmId
   * @returns {Promise<Object>} 
   */
  generateVmRemoteViewerConnectionFile: async (vmId) => {
    return makeAPICall({
      method: "GET",
      url: ENDPOINTS.REMOTE_VIEWER_CONNECTION_FILE_VM(vmId),  // ID를 URL에 포함
      ressponseType: "blob",
    });
  },
  //#endregion: VM ----------------------------------------------


  //#region: Template ---------------------------------------------
  /**
   * @name ApiManager.findAllTemplates
   * @description 템플릿 목록
   * 
   * @returns 
   **/
  findAllTemplates : async () => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_ALL_TEMPLATES(), 
    // defaultValues: DEFAULT_VALUES.FIND_ALL_TEMPLATES
  }),
  /**
   * @name ApiManager.findTemplate
   * @description 템플릿
   *
   * @param {string} templateId
   * @returns 
   * 
   * @see
   */
  findTemplate : async (templateId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_TEMPLATE(templateId), 
    // defaultValues: DEFAULT_VALUES.FIND_TEMPLATE
  }),
  /**
   * @name ApiManager.findVMsFromTemplate
   * @description 가상머신 목록
   *
   * @param {string} templateId
   * @returns 
   * 
   * @see
   */
  findVMsFromTemplate : async (templateId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_VMS_FROM_TEMPLATE(templateId), 
    // defaultValues: DEFAULT_VALUES.FIND_VMS_FROM_TEMPLATE
  }),
  /**
   * @name ApiManager.findNicsFromTemplate
   * @description nic 목록
   *
   * @param {string} templateId
   * @returns 
   * 
   * @see
   */
  findNicsFromTemplate : async (templateId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_NICS_FROM_TEMPLATE(templateId), 
    // defaultValues: DEFAULT_VALUES.FIND_NICS_FROM_TEMPLATE
  }),
  /**
   * @name ApiManager.addNicFromTemplate
   * @description 새 nic 생성
   * 
   * @param {string} templateId
   * @param {Object} nicData
   * @returns {Promise<Object>}
   */
  addNicFromTemplate: async (templateId, nicData) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.ADD_NICS_FROM_TEMPLATE(templateId),
      data: nicData,
      // defaultValues: DEFAULT_VALUES.ADD_NICS_FROM_TEMPLATE
    });
  },


  /**
   * @name ApiManager.editNicFromTemplate
   * @description NIC 수정 API 호출
   * 
   * @param {string} templateId - 템플릿 ID
   * @param {string} nicId - NIC ID
   * @param {Object} nicData - 수정할 NIC 데이터
   * @returns {Promise<Object>}
   */
  editNicFromTemplate: async (templateId, nicId, nicData) => {
    return makeAPICall({
      method: "PUT",
      url: ENDPOINTS.EDIT_NICS_FROM_TEMPLATE(templateId, nicId), // nicId가 올바르게 전달되도록 수정
      data: nicData,
    });
  },

    /**
   * @name ApiManager.deleteNicFromVM
   * @description 템플릿 nic 삭제
   * 
   * @param {string} nicId
   * @returns {Promise<Object>}
   */
    deleteNicFromTemplate: async (templateId, nicId,detachOnly) => {
      return makeAPICall({
        method: "DELETE",
        url: ENDPOINTS.DELETE_NICS_FROM_TEMPLATE(templateId, nicId,detachOnly),
        data: nicId, 
      });
    },
    
  /**
   * @name ApiManager.findDisksFromTemplate
   * @description disk 목록
   *
   * @param {string} templateId
   * @returns 
   * 
   * @see
   */
  findDisksFromTemplate : async (templateId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_DISKS_FROM_TEMPLATE(templateId), 
    // defaultValues: DEFAULT_VALUES.FIND_DISKS_FROM_TEMPLATE
  }),
  /**
   * @name ApiManager.findStorageDomainsFromTemplate
   * @description 스토리지도메인 목록
   *
   * @param {string} templateId
   * @returns 
   * 
   * @see
   */
  findStorageDomainsFromTemplate : async (templateId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_STORAGE_DOMAINS_FROM_TEMPLATE(templateId), 
    // defaultValues: DEFAULT_VALUES.FIND_STORAGE_DOMAINS_FROM_TEMPLATE
  }),
  /**
   * @name ApiManager.findEventsFromTemplate
   * @description 이벤트 목록
   *
   * @param {string} templateId
   * @returns 
   * 
   * @see
   */
  findEventsFromTemplate : async (templateId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_EVENTS_FROM_TEMPLATE(templateId), 
    // defaultValues: DEFAULT_VALUES.FIND_EVENTS_FROM_TEMPLATE
  }),

  /**
   * @name ApiManager.addTemplate
   * @description 새 템플릿 생성
   * 
   * @param {Object} templateData 
   * @returns {Promise<Object>}
   */
  addTemplate: async (vmId ,templateData) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.ADD_TEMPLATE(vmId),
      data: templateData, 
      // defaultValues: DEFAULT_VALUES.ADD_TEMPLATE
    });
  },
  /**
   * @name ApiManager.editTemplate
   * @description 템플릿 편집
   * 
   * @param {string} templateId
   * @param {Object} templateData 
   * @returns {Promise<Object>}
   */
    editTemplate: async (templateId, templateData) => {
      return makeAPICall({
        method: "PUT",
        url: ENDPOINTS.EDIT_TEMPLATE(templateId),
        data: templateData, 
        // defaultValues: DEFAULT_VALUES.EDIT_TEMPLATE
      });
    },
  /**
   * @name ApiManager.deleteTemplate
   * @description 템플릿 삭제
   * 
   * @param {String} templateId 
   * @returns {Promise<Object>}
   */
  deleteTemplate: async (templateId) => {
    return makeAPICall({
      method: "DELETE",
      url: ENDPOINTS.DELETE_TEMPLATE(templateId), 
      data: templateId
      // defaultValues: DEFAULT_VALUES.DELETE_TEMPLATE
    });
  },


  //#endregion : Template ---------------------------------------------


  //#region: Network------------------------------------------------
  /**
   * @name ApiManager.findAllNetworks
   * @description 네트워크 목록
   * 
   * @returns 
   **/
  findAllNetworks: async () => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_ALL_NETWORKS(),
    // defaultValues: DEFAULT_VALUES.FIND_ALL_NETWORKS
  }),
  /**
   * @name ApiManager.findNetwork
   * @description 네트워크
   *
   * @param {string} networkId
   * @returns 
   * 
   * @see
   */
  findNetwork: async (networkId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_NETWORK(networkId),
    // defaultValues: DEFAULT_VALUES.FIND_NETWORK_BY_ID
  }),
  /**
   * @name ApiManager.findAllVnicProfilesFromNetwork
   * @description vnicProfile 목록
   *
   * @param {string} networkId
   * @returns 
   * 
   * @see
   */
  findAllVnicProfilesFromNetwork: async (networkId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_VNIC_PROFILES_FROM_NETWORK(networkId),
  }),
  /**
   * @name ApiManager.findAllClustersFromNetwork
   * @description 클러스터 목록
   *
   * @param {string} networkId
   * @returns 
   * 
   * @see
   */
  findAllClustersFromNetwork : async (networkId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_CLUSTERS_FROM_NETWORK(networkId),
    // defaultValues: DEFAULT_VALUES.FIND_ALL_CLUSTERS_FROM_NETWORK
  }),
   /**
   * @name ApiManager.findConnectedHostsFromNetwork
   * @description 연결된 호스트 목록
   *
   * @param {string} networkId
   * @returns 
   * 
   * @see
   */
  findConnectedHostsFromNetwork : async (networkId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_CONNECTED_HOSTS_FROM_NETWORK(networkId),
    // defaultValues: DEFAULT_VALUES.FIND_ALL_HOST_FROM_NETWORK
  }),
   /**
   * @name ApiManager.findDisconnectedHostsFromNetwork
   * @description 연결해제 호스트 목록
   *
   * @param {string} networkId
   * @returns 
   * 
   * @see
   */
   findDisconnectedHostsFromNetwork : async (networkId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_DISCONNECTED_HOSTS_FROM_NETWORK(networkId),
    // defaultValues: DEFAULT_VALUES.FIND_ALL_HOST_FROM_NETWORK
  }),
  /**
   * @name ApiManager.findAllVmsFromNetwork
   * @description 가상머신 목록
   *
   * @param {string} networkId
   * @returns 
   * 
   * @see
   */
  findAllVmsFromNetwork : async (networkId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_VMS_FROM_NETWORK(networkId),
    // defaultValues: DEFAULT_VALUES.FIND_ALL_VMS_FROM_NETWORK
  }),
  /**
   * @name ApiManager.findAllTemplatesFromNetwork
   * @description 템플릿 목록
   *
   * @param {string} networkId
   * @returns 
   * 
   * @see
   */
  findAllTemplatesFromNetwork : async (networkId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_TEMPLATES_NETWORK(networkId),
    // defaultValues: DEFAULT_VALUES.FIND_ALL_TEMPLATES_FROM_NETWORK
  }),

  /**
   * @name ApiManager.addNetwork
   * @description 새 네트워크 생성
   * 
   * @param {Object} networkData 
   * @returns {Promise<Object>}
   */
  addNetwork: async (networkData) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.ADD_NETWORK(),
      data: networkData, 
      // defaultValues: DEFAULT_VALUES.ADD_NETWORK
    });
  },



  /**
   * @name ApiManager.editNetwork
   * @description 네트워크 편집
   * 
   * @param {string} networkId
   * @param {Object} networkData 
   * @returns {Promise<Object>}
   */
  editNetwork: async (networkId, networkData) => {
    return makeAPICall({
      method: "PUT",
      url: ENDPOINTS.EDIT_NETWORK(networkId),
      data: networkData, 
      // defaultValues: DEFAULT_VALUES.EDIT_NETWORK
    });
  },
  /**
   * @name ApiManager.deleteNetwork
   * @description 네트워크 삭제
   * 
   * @param {String} networkId 
   * @returns {Promise<Object>}
   */
  deleteNetwork: async (networkId) => {
    return makeAPICall({
      method: "DELETE",
      url: ENDPOINTS.DELETE_NETWORK(networkId), 
      data: networkId
    });
  },


  /**
   * @name ApiManager.findAllNetworkProviders
   * @description 네트워크 공급자 목록
   *
   * @returns 
   * 
   * @see
   */
  findAllNetworkProviders : async () => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_NETWORK_PROVIDERS(),
    // defaultValues: DEFAULT_VALUES.FIND_NETWORK_PROVIDERS
  }),
  /**
   * @name ApiManager.findAllNetworkFromProvider
   * @description 네트워크 목록
   *
   * @param {string} providerId
   * @returns 
   * 
   * @see
   */
  findAllNetworkFromProvider : async (providerId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_NETWORKS_FROM_PROVIDERS(providerId),
    // defaultValues: DEFAULT_VALUES.FIND_NETWORKS_FROM_PROVIDERS
  }),
  /**
   * @name ApiManager.findAllDatacentersFromNetwork
   * @description 데이터센터 목록
   *
   * @param {string} openstackNetworkId
   * @returns 
   * 
   * @see
   */
  findAllDatacentersFromNetwork : async (openstackNetworkId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_DATA_CENTERS_FROM_NETWORK(openstackNetworkId),
    // defaultValues: DEFAULT_VALUES.FIND_DATA_CENTERS_FROM_NETWORK
  }),
  /**
   * @name ApiManager.importNetwork
   * @description 네트워크 가져오기
   *
   * @param {Object} networkData 
   * @returns 
   * 
   * @see
   */
  importNetwork: async (networkData) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.IMPORT_NETWORK(),
      data: networkData, 
      // defaultValues: DEFAULT_VALUES.IMPORT_NETWORK
    });
  },

  //#endregion: Network
  
  // region: vnicprofile
  /**
   * @name ApiManager.findAllVnicProfiles
   * @description vnicprofile 목록
   *
   * @returns 
   * 
   * @see
   */
  findAllVnicProfiles : async () => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_ALL_VNIC_PROFILES(),
    // defaultValues: DEFAULT_VALUES.FIND_ALL_VNIC_PROFILES
  }),

  /**
   * @name ApiManager.findVnicProfile
   * @description vnic profile
   *
   * @param {string} vnicId
   * @returns 
   * 
   * @see
   */
  findVnicProfile: async (vnicId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_VNIC_PROFILE(vnicId),
  }),

 /**
   * @name ApiManager.findAllHostsFromNetwork
   * @description vnic profile내 가상머신 목록
   *
   * @param {string} vnicProfileId
   * @returns 
   * 
   * @see
   */
  findAllVmsFromVnicProfiles : async (vnicProfileId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_VMS_VNIC_PROFILE(vnicProfileId),
  }),

  /**
   * @name ApiManager.findNicsFromTemplate
   * @description vnic profile내 템플릿 목록
   *
   * @param {string} vnicProfileId
   * @returns 
   * 
   * @see
   */
  findAllTemplatesFromVnicProfiles : async (vnicProfileId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_TEMPLATE_VNIC_PROFILE(vnicProfileId), 
    // defaultValues: DEFAULT_VALUES.FIND_NICS_FROM_TEMPLATE
  }),

  /**
   * @name ApiManager.addVnicProfiles
   * @description 새 vnic프로파일생성
   * 
   * @param {Object} vnicData 
   * @returns {Promise<Object>} API 응답 결과
   */
  addVnicProfiles: async (vnicData) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.ADD_VNIC_PROFILE_FROM_NETWORK(),
      data: vnicData, 
    });
  },
  /**
   * @name ApiManager.editVnicProfiles
   * @description vnic프로파일 편집
   * 
   * @param {string} networkId
   * @param {Object} vnicData 
   * @returns {Promise<Object>} API 응답 결과
   */
    editVnicProfiles: async (vnicId, vnicData) => {
      return makeAPICall({
        method: "PUT",
        url: ENDPOINTS.EDIT_VNIC_PROFILE_FROM_NETWORK( vnicId),
        data: vnicData, 
      });
    },
  /**
   * @name ApiManager.deleteVnicProfiles
   * @description vnic프로파일 삭제
   * 
   * @param {String} nicId - 삭제할 호스트 ID
   * @returns {Promise<Object>} API 응답 결과
   */
  deleteVnicProfiles: async (vnicProfileId) => {
    return makeAPICall({
      method: "DELETE",
      url: ENDPOINTS.DELETE_VNIC_PROFILE_FROM_NETWORK(vnicProfileId),
      data: vnicProfileId,
    });
  },

    /**
   * @name ApiManager.findAllNetworkFilters
   * @description 네트워크 필터 목록
   * 
   *
   * @returns {Promise<Object>} API 응답 결과
   */
    findAllNetworkFilters : async () => makeAPICall({
      method: "GET", 
      url: ENDPOINTS.FIND_ALL_NETWORKFILTERS(),
    }),

  // endregion: vnicprofile




  
  //#region: Domain
  /**
   * @name ApiManager.findAllStorageDomains
   * @description storagedomain 목록
   *
   * @returns 
   * 
   * @see
   */
  findAllStorageDomains: async () => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_ALL_STORAGE_DOMAINS(),
  }),
  /**
   * @name ApiManager.findAllNfsStorageDomains
   * @description storagedomain Nfs 목록
   *
   * @returns 
   * 
   * @see
   */
  findAllNfsStorageDomains: async () => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_ALL_NFS_STORAGE_DOMAINS(),
  }),
  /**
   * @name ApiManager.findDomain
   * @description 네트워크
   *
   * @param {string} storageDomainId
   * @returns 
   * 
   * @see
   */
  findDomain: async (storageDomainId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_STORAGE_DOMAIN(storageDomainId),
    // defaultValues: DEFAULT_VALUES.FIND_DOMAIN_BY_ID
  }),
   /**
   * @name ApiManager.findActiveDomainFromDataCenter
   * @description 도메인 
   *
   * @param {string} storageDomainId
   * @returns 
   * 
   * @see
   */
   findActiveDomainFromDataCenter: async (dataCenterId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_ACTIVE_STORAGE_DOMAINS_FROM_DATA_CENTER(dataCenterId),
  }),
  /**
   * @name ApiManager.findAllDataCentersFromDomain
   * @description 데이터센터 목록
   *
   * @param {string} storageDomainId
   * @returns 
   * 
   * @see
   */
  findAllDataCentersFromDomain : async (storageDomainId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_DATA_CENTERS_FROM_STORAGE_DOMAINS(storageDomainId),
    // defaultValues: DEFAULT_VALUES.FIND_DATACENTER_FROM_DOMAIN
  }),
  /**
   * @name ApiManager.findAllHostsFromDomain
   * @description 호스트 목록
   *
   * @param {string} storageDomainId
   * @returns 
   * 
   * @see
   */
  findAllHostsFromDomain : async (storageDomainId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_HOSTS_FROM_STORAGE_DOMAINS(storageDomainId),
    // defaultValues: DEFAULT_VALUES.FIND_DATACENTER_FROM_DOMAIN
  }),
  /**
   * @name ApiManager.findAllVMsFromDomain
   * @description 가상머신 목록
   *
   * @param {string} storageDomainId
   * @returns 
   * 
   * @see
   */
  findAllVMsFromDomain : async (storageDomainId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_VMS_FROM_STORAGE_DOMAINS(storageDomainId),
    // defaultValues: DEFAULT_VALUES.FIND_VMS_FROM_STORAGE_DOMAINS
  }),
  /**
   * @name ApiManager.findAllUnregisterdVMsFromDomain
   * @description 가상머신 불러오기 목록
   *
   * @param {string} storageDomainId
   * @returns 
   * 
   * @see
   */
  findAllUnregisterdVMsFromDomain : async (storageDomainId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_UNREGISTERD_VMS_FROM_STORAGE_DOMAINS(storageDomainId),
    // defaultValues: DEFAULT_VALUES.FIND_VMS_FROM_STORAGE_DOMAINS
  }),
  /**
   * @name ApiManager.findAllDisksFromDomain
   * @description 디스크 목록
   *
   * @param {string} storageDomainId
   * @returns 
   * 
   * @see
   */
  findAllDisksFromDomain: async (storageDomainId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_DISKS_FROM_STORAGE_DOMAINS(storageDomainId),
    // defaultValues: DEFAULT_VALUES.FIND_DISK_FROM_DOMAIN
  }),
  /**
   * @name ApiManager.findAllUnregisteredDisksFromDomain
   * @description 디스크 가져오기 목록
   *
   * @param {string} storageDomainId
   * @returns 
   * 
   * @see
   */
  findAllUnregisteredDisksFromDomain: async (storageDomainId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_UNREGISTERD_DISKS_FROM_STORAGE_DOMAINS(storageDomainId),
    // defaultValues: DEFAULT_VALUES.FIND_DISK_FROM_DOMAIN
  }),
  /**
   * @name ApiManager.registeredDiskFromDomain
   * @description
   * 
   * @param {string} storageDomainId 
   * @param {string} diskId 
   * @returns {Promise<Object>}
   */
  registeredDiskFromDomain: async (storageDomainId, diskId) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.REGISTERD_DISK_FROM_STORAGE_DOMAINS(storageDomainId, diskId),
      data: storageDomainId, 
    });
  },
  /**
   * @name ApiManager.deleteRegisteredDiskFromDomain
   * @description
   * 
   * @param {string} storageDomainId 
   * @param {string} diskId 
   * @returns {Promise<Object>}
  */
  deleteRegisteredDiskFromDomain: async (storageDomainId, diskId) => {
    return makeAPICall({
      method: "DELETE",
      url: ENDPOINTS.DELETE_REGISTERD_DISK_FROM_STORAGE_DOMAINS(storageDomainId, diskId),
      data: storageDomainId, 
    });
  },

  /**
   * @name ApiManager.findAllTemplatesFromDomain
   * @description 템플릿 목록
   *
   * @param {string} storageDomainId
   * @returns 
   * 
   * @see
   */
  findAllTemplatesFromDomain: async (storageDomainId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_TEMPLATES_FROM_STORAGE_DOMAINS(storageDomainId),
    // defaultValues: DEFAULT_VALUES.TEMPLATE_FROM_DOMAIN
  }),
  /**
   * @name ApiManager.findAllUnregisteredTemplatesFromDomain
   * @description 템플릿 불러오기 목록
   *
   * @param {string} storageDomainId
   * @returns 
   * 
   * @see
   */
  findAllUnregisteredTemplatesFromDomain: async (storageDomainId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_UNREGISTERD_TEMPLATES_FROM_STORAGE_DOMAINS(storageDomainId),
    // defaultValues: DEFAULT_VALUES.TEMPLATE_FROM_DOMAIN
  }),
  /**
   * @name ApiManager.findAllDiskProfilesFromDomain
   * @description 디스크 프로파일 목록
   *
   * @param {string} storageDomainId
   * @returns 
   * 
   * @see
   */
  findAllDiskProfilesFromDomain: async (storageDomainId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_DISK_PROFILES_FROM_STORAGE_DOMAINS(storageDomainId),
    // defaultValues: DEFAULT_VALUES.FIND_DISK_FROM_DOMAIN
  }),
  /**
   * @name ApiManager.findAllDiskSnapshotsFromDomain
   * @description 디스크 스냅샷 목록
   *
   * @param {string} storageDomainId
   * @returns 
   * 
   * @see
   */
  findAllDiskSnapshotsFromDomain: async (storageDomainId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_DISK_SNAPSHOTS_FROM_STORAGE_DOMAINS(storageDomainId),
    // defaultValues: DEFAULT_VALUES.DISK_SNAPSHOT_FROM_DOMAIN
  }),
  /**
   * @name ApiManager.findAllEventsFromDomain
   * @description 이벤트 목록
   *
   * @param {string} storageDomainId
   * @returns 
   * 
   * @see
   */
  findAllEventsFromDomain: async (storageDomainId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_EVENTS_FROM_STORAGE_DOMAINS(storageDomainId),
    // defaultValues: DEFAULT_VALUES.FIND_EVENT
  }),
  /**
   * @name ApiManager.findActiveDataCenters
   * @description  목록
   *
   * @returns 
   * 
   * @see
   */
  findActiveDataCenters: async () => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_ACTIVE_DATA_CENTERS(),
    // defaultValues: DEFAULT_VALUES.FIND_EVENT
  }),


  /**
   * @name ApiManager.findAllStoragesFromHost
   * @description storages 목록
   *
   * @param {string} hostId
   * @returns 
   * 
   * @see
   */
  findAllStoragesFromHost: async (hostId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_STORAGES_FROM_HOST(hostId),
  }),
  /**
   * @name ApiManager.findAllFibreFromHost
   * @description fibre channel 목록
   *
   * @param {string} hostId
   * @returns 
   * 
   * @see
   */
  findAllFibreFromHost: async (hostId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_FIBRES_FROM_HOST(hostId),
  }),
  /**
   * @name ApiManager.findAllIscsiFromHost
   * @description iSCSI 목록
   *
   * @param {string} hostId
   * @returns 
   * 
   * @see
   */
  findAllIscsiFromHost: async (hostId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_ISCSIS_FROM_HOST(hostId)
  }),
  /**
   * @name ApiManager.findSearchIscsiFromHost
   * @description iSCSI 목록
   *
   * @param {string} hostId
   * @returns 
   * 
   * @see
   */
  findSearchIscsiFromHost: async (hostId, iscsiData) => makeAPICall({
    method: "POST", 
    url: ENDPOINTS.FIND_SEARCH_ISCSIS_FROM_HOST(hostId, iscsiData),
    data: iscsiData
  }),
  /**
   * @name ApiManager.findSearchFcFromHost
   * @description fcp 목록
   *
   * @param {string} hostId
   * @returns 
   * 
   * @see
   */
  findSearchFcFromHost: async (hostId) => makeAPICall({
    method: "POST", 
    url: ENDPOINTS.FIND_SEARCH_FCS_FROM_HOST(hostId),
    data: hostId
  }),
  
  /**
   * @name ApiManager.findLoginIscsiFromHost
   * @description iSCSI 로그인
   *
   * @param {string} hostId
   * @returns 
   * 
   * @see
   */
  findLoginIscsiFromHost: async (hostId, iscsiData) => makeAPICall({
    method: "POST", 
    url: ENDPOINTS.FIND_LOGIN_ISCSIS_FROM_HOST(hostId, iscsiData),
    data: iscsiData
  }),


  /**
   * @name ApiManager.addDomain
   * @description 새 스토리지도메인 생성
   * 
   * @param {Object} domainData 
   * @returns {Promise<Object>}
   */
  addDomain: async (domainData) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.ADD_STORAGE_DOMAIN(),
      data: domainData, 
    });
  },
  /**
   * @name ApiManager.importDomain
   * @description 스토리지도메인 가져오기
   * 
   * @param {Object} domainData 
   * @returns {Promise<Object>}
   */
  importDomain: async (domainData) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.IMPORT_STORAGE_DOMAIN(),
      data: domainData,
    });
  },
  /**
   * @name ApiManager.editDomain
   * @description 스토리지도메인 편집
   * 
   * @param {string} domainId
   * @param {Object} domaineData 
   * @returns {Promise<Object>}
   */
  editDomain: async (domainId, domainData) => {
    return makeAPICall({
      method: "PUT",
      url: ENDPOINTS.EDIT_STORAGE_DOMAIN(domainId),
      data: domainData, 
    });
  },

  /**
   * @name ApiManager.deleteDomain
   * @description 스토리지도메인 삭제
   * 
   * @param {String} domainId 
   * @returns {Promise<Object>}
   */
  deleteDomain: async (domainId, format, hostName) => {
    return makeAPICall({
      method: "DELETE",
      url: ENDPOINTS.DELETE_STORAGE_DOMAIN(domainId, format, hostName), 
      data: domainId,
    });
  },

  /**
   * @name ApiManager.activateDomain
   * @description 스토리지 도메인 파괴
   * 
   * @param {String} domainId - 도메인 ID
   * @returns {Promise<Object>} API 응답 결과
   */
  destroyDomain: async (storageDomainId) => {
    return makeAPICall({
      method: "DELETE",
      url: ENDPOINTS.DESTORY_STORAGE_DOMAIN(storageDomainId), 
      data: storageDomainId
    });
  },


  /**
   * @name ApiManager.updateOvfDomain
   * @description 스토리지 도메인 ovf 업데이트
   * 
   * @param {String} domainId - 도메인 ID
   * @returns {Promise<Object>} API 응답 결과
   */
  updateOvfDomain: async (domainId) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.OVF_UPDATE_STORAGE_DOMAIN(domainId), 
      data: {domainId}
    });
  },

  /**
   * @name ApiManager.refreshLunDomain
   * @description 스토리지 도메인 디스크 검사
   * 
   * @param {String} domainId - 도메인 ID
   * @returns {Promise<Object>} API 응답 결과
   */
  refreshLunDomain: async (domainId) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.REFRESH_LUN_STORAGE_DOMAIN(domainId),
      data: {domainId}
    });
  },

  /**
   * @name ApiManager.activateDomain
   * @description 스토리지 도메인 활성
   * 
   * @param {String} domainId - 도메인 ID
   * @param {String} dataCenterId - 데이터센터 ID
   * @returns {Promise<Object>} API 응답 결과
   */
  activateDomain: async (domainId, dataCenterId) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.ACTIVATE_FROM_DATACENTER(domainId, dataCenterId), 
      data: {domainId, dataCenterId}
    });
  },

  /**
   * @name ApiManager.attachDomain
   * @description 스토리지 도메인 연결
   * 
   * @param {String} domainId - 도메인 ID
   * @param {String} dataCenterId - 데이터센터 ID
   * @returns {Promise<Object>} API 응답 결과
   */
  attachDomain: async (storageDomainId, dataCenterId) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.ATTACH_FROM_DATACENTER(storageDomainId, dataCenterId), 
      data: {storageDomainId, dataCenterId}
    });
  },

  /**
   * @name ApiManager.detachDomain
   * @description 스토리지 도메인 분리
   * 
   * @param {String} domainId - 도메인 ID
   * @param {String} dataCenterId - 데이터센터 ID
   * @returns {Promise<Object>} API 응답 결과
   */
  detachDomain: async (domainId, dataCenterId) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.DETACH_FROM_DATACENTER(domainId, dataCenterId), 
      data: {domainId, dataCenterId}
    });
  },

  /**
   * @name ApiManager.maintenanceDomain
   * @description 스토리지 도메인 유지보수
   * 
   * @param {String} domainId - 도메인 ID
   * @param {String} dataCenterId - 데이터센터 ID
   * @returns {Promise<Object>} API 응답 결과
   */
  maintenanceDomain: async (domainId, dataCenterId, ovf) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.MAINTENANCE_FROM_DATACENTER(domainId, dataCenterId, ovf), 
      data: {domainId, dataCenterId}
    });
  },



  //#endregion: Domain



  //#region: Disk
  /**
   * @name ApiManager.findAllDisks
   * @description disk 목록
   *
   * @returns 
   * 
   * @see
   */
  findAllDisks: async () => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_ALL_DISKS(),
    // defaultValues: DEFAULT_VALUES.FIND_ALL_DISK
  }),
  /**
   * @name ApiManager.findCdromsDisk
   * @description disk 목록
   *
   * @returns 
   * 
   * @see
   */
  findCdromsDisk: async (diskId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_CDROMS_DISK(diskId),
  }),

  /**
   * @name ApiManager.findDisk
   * @description 디스크세부정보
   *
   * @param {string} diskId
   * @returns 
   * 
   * @see
   */
  findDisk: async (diskId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_DISK(diskId),
    // defaultValues: DEFAULT_VALUES.FIND_DISK_BY_ID
  }),

  /**
   * @name ApiManager.findAllVmsFromDisk
   * @description 가상머신
   *
   * @param {string} diskId
   * @returns 
   * 
   * @see
   */
  findAllVmsFromDisk: async (diskId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_VMS_FROM_DISK(diskId),
    // defaultValues: DEFAULT_VALUES.VMS_FROM_DISK
  }),

  /**
   * @name ApiManager.findAllStorageDomainsFromDisk
   * @description 스토리지
   *
   * @param {string} diskId
   * @returns 
   * 
   * @see
   */
  findAllStorageDomainsFromDisk: async (diskId) => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_STORAGE_DOMAINS_FROM_DISK(diskId),
    // defaultValues: DEFAULT_VALUES.FIND_STORAGE_DOMAINS_FROM_DISK
  }),

  /**
   * @name ApiManager.addDisk
   * @description 새 디스크 생성
   * 
   * @param {Object} diskData 
   * @returns {Promise<Object>}
   */
  addDisk: async (diskData) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.ADD_DISK(),
      data: diskData, 
      // defaultValues: DEFAULT_VALUES.ADD_DISK
    });
  },
  /**
   * @name ApiManager.editDisk
   * @description 디스크 편집
   * 
   * @param {string} diskId
   * @param {Object} diskData 
   * @returns {Promise<Object>}
   */
  editDisk: async (diskId, diskData) => {
    return makeAPICall({
      method: "PUT",
      url: ENDPOINTS.EDIT_DISK(diskId),
      data: diskData
    });
  },
  /**
   * @name ApiManager.deleteDisk
   * @description 디스크 삭제
   * 
   * @param {String} diskId 
   * @returns {Promise<Object>}
   */
  deleteDisk: async (diskId) => {
    return makeAPICall({
      method: "DELETE",
      url: ENDPOINTS.DELETE_DISK(diskId), 
      data: diskId
    });
  },
  /**
   * @name ApiManager.copyDisk
   * @description 디스크 복제
   * 
   * @param {String} diskId 
   * @param {Object} diskData 
   * @returns {Promise<Object>}
   */
  copyDisk: async (diskId, diskData) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.COPY_DISK(diskId),
      data: diskData, 
      // defaultValues: DEFAULT_VALUES.COPY_DISK
    });
  },
  /**
   * @name ApiManager.moveDisk
   * @description 디스크 이동
   * 
   * @param {String} diskId 
   * @param {Object} diskData 
   * @returns {Promise<Object>}
   */
  moveDisk: async (diskId, storageDomainId) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.MOVE_DISK(diskId, storageDomainId),
      data: {diskId, storageDomainId}, 
    });
  },
  /**
   * @name ApiManager.refresheDisk
   * @description 디스크 이동
   * 
   * @param {String} diskId 
   * @param {Object} diskData 
   * @returns {Promise<Object>}
   */
  refresheDisk: async (diskId, diskData) => {
    return makeAPICall({
      method: "POST",
      url: ENDPOINTS.REFRESH_LUN_DISK(diskId),
      data: diskData, 
      // defaultValues: DEFAULT_VALUES.REFRESH_LUN_DISK
    });
  },
  
  /**
   * @name ApiManager.uploadDisk
   * @description 디스크 업로드
   * 
   * @param {FormData} diskData 
   * @returns {Promise<Object>}
   */
  // uploadDisk: async (diskData) => {
  //   return makeAPICall({
  //     method: "POST",
  //     url: ENDPOINTS.UPLOAD_DISK(),
  //     data: diskData, 
  //   });
  // },

  uploadDisk: async (diskData, inProgress=null) => {
    const msg = `디스크 업로드 중 ...`
    const toastId = toast.loading(msg)
    try {
      const res = await axios({
          method: "POST",
          url: ENDPOINTS.UPLOAD_DISK(),
          headers: {
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
              if (progress > 0) inProgress && inProgress(progress, toastId)
            }
          },
          data: diskData
      }); 
      return res.data?.body
    } catch(e) {
      console.error(`Error fetching ':`, e);
      toast({
        variant: "destructive",
        title: "API 오류가 발생하였습니다.",
        description: `Error fetching '\n${e.message}`,
      });
      // toast.error(`Error fetching '\n${e.message}`)
    }
  },
  //#endregion: Disk

  //#region: event
  /**
   * @name ApiManager.findAllEvents
   * @description 이벤트 목록
   * 
   * @returns 
   **/
  findAllEvents: async (severityThreshold=null, pageNo=null, size=null) => {
    const _url = (pageNo || severityThreshold) ? ENDPOINTS.FIND_ALL_EVENTS_PAGE(severityThreshold, pageNo, size) : ENDPOINTS.FIND_ALL_EVENTS() 
    return makeAPICall({
      method: "GET", 
      url: _url,
      // defaultValues: DEFAULT_VALUES.FIND_ALL_EVENTS
    })
  },

  /**
   * @name ApiManager.removeEvent
   * @param {string} eventId (제거 할) 이벤트ID
   * @returns 
   */
  removeEvent: async (eventId) => makeAPICall({
    method: "DELETE", 
    url: ENDPOINTS.FIND_EVENT(eventId),
  }),

  /**
   * @name ApiManager.removeEvents
   * @param {string} eventId (제거 할) 이벤트 목록(모두삭제)
   * @returns 
   */
  removeEvents: async ({ eventIds = [] }) => makeAPICall({
    method: "DELETE", 
    url: ENDPOINTS.FIND_ALL_EVENTS(),
    data: { eventIds }
  }),
  //#endregion: event

  //#region: Job
  /**
   * @name ApiManager.findAllJobs
   * @description 작업 목록
   * 
   * @returns 
   **/
  findAllJobs: async () => makeAPICall({
    method: "GET",
    url: ENDPOINTS.FIND_ALL_JOBS()
  }),
  /**
   * @name ApiManager.findJob
   * @description 작업 상세
   * 
   * @returns 
   **/
  findJob: async (jobId) => makeAPICall({
    method: "GET",
    url: ENDPOINTS.FIND_JOB(jobId)
  }),
  /**
   * @name ApiManager.addJob
   * @description (외부) 작업 추가
   * 
   * @param {Object} job 추가할 작업 정보
   *
   * @returns {Promise<Object>} API 응답 결과
   */
  addJob: async(job) => makeAPICall({
    method: "POST", 
    url: ENDPOINTS.FIND_ALL_JOBS(), 
    data: job
  }),
  /**
   * @name ApiManager.endJob
   * @description (외부) 작업 종료
   * 
   * @returns {Promise<Object>} API 응답 결과
   */
  endJob: async(jobId) => makeAPICall({
    method: "PUT", 
    url: ENDPOINTS.END_JOB(jobId),
  }),
  /**
   * @name ApiManager.removeJob
   * @description 작업 제거
   * 
   * @returns {Promise<Object>} API 응답 결과
   */
  removeJob: async(jobId) => makeAPICall({
    method: "DELETE", 
    url: ENDPOINTS.FIND_JOB(jobId),
  }),
  /**
   * @name ApiManager.removeJobs
   * @description (외부) 작업목록 일괄제거
   * 
   * @returns {Promise<Object>} API 응답 결과
   */
  removeJobs: async(jobIds=[]) => makeAPICall({
    method: "DELETE", 
    url: ENDPOINTS.FIND_ALL_JOBS(),
    data: jobIds
  }),
  //#endregion: Job


  //#region: User
  /**
   * @name ApiManager.findAllUsers
   * @description User 목록 
   *
   * @returns 
   */
  findAllUsers: async () => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_ALL_USERS(), 
    // defaultValues: DEFAULT_VALUES.FIND_ALL_USERS
  }),
  /**
   * @name ApiManager.findUser
   * @description User 상세조회 
   *
   * @param {string} username 사용자 oVirt ID
   * @param {boolean} exposeDetail 상세정보 표출여부
   * 
   * @returns 
   */
  findUser: async(username, exposeDetail) => makeAPICall({
    method: "GET", 
    url: `${ENDPOINTS.FIND_USER(username)}/?exposeDetail=${exposeDetail}`, 
  }),
  /**
   * @name ApiManager.authenticate
   * @description 로그인
   * 
   * @returns 
   * 
   * @see Login.js (page)
   */
  authenticate: async(username, password) => makeAPICall({
    method: "POST", 
    url: ENDPOINTS.FIND_USER(username), 
    data: { password }
  }),
  /**
   * @name ApiManager.addUser
   * @description 사용자 추가
   * 
   * @param {Object} user 추가할 oVirt 사용자  정보
   *
   * @returns {Promise<Object>} API 응답 결과
   */
  addUser: async(user) => makeAPICall({
    method: "POST", 
    url: ENDPOINTS.FIND_ALL_USERS(), 
    data: user
  }),
  /**
   * @name ApiManager.editUser
   * @description 사용자 편집
   * 
   * @param {string} data 사용자 oVirt 상세정보
   *
   * @returns {Promise<Object>} API 응답 결과
   */
  editUser: async(data) => makeAPICall({
    method: "PUT", 
    url: ENDPOINTS.FIND_USER(data.username), 
    data: data,
  }),
  /**
   * @name ApiManager.updatePassword
   * @description 사용자 비밀번호 변경경
   * 
   * @param {string} username 사용자 oVirt ID
   * @param {string} currentPasword (기존) 사용자 oVirt 비밀번호
   * @param {string} newPassword (신규) 사용자 oVirt 비밀번호
   *
   * @returns {Promise<Object>} API 응답 결과
   */
  updatePassword: async(
    username,
    pwCurrent,pwNew,
    force,
  ) => makeAPICall({
    method: "PUT", 
    url: ENDPOINTS.UPDATE_PASSWORD_USER(username, force), 
    data: { pwCurrent, pwNew },
  }),
  /**
   * @name ApiManager.removeUser
   * @description 사용자 삭제
   * 
   * @param {string} username 사용자 oVirt ID
   *
   * @returns {Promise<Object>} API 응답 결과
   */
  removeUser: async(username) => makeAPICall({
    method: "DELETE", 
    url: ENDPOINTS.FIND_USER(username), 
  }),
  //#endregion: User
  //#region: UserSession
  /**
   * @name ApiManager.findAllUserSessions
   * @description 활성 사용자 세션션 목록 
   *
   * @returns 
   */
  findAllUserSessions: async (username = "") => makeAPICall({
    method: "GET", 
    url: ENDPOINTS.FIND_ALL_USER_SESSIONS(username),
  }),
  //#endregion: UserSession
  //#region: Certificate(s)
  /**
   * @name ApiManager.findAllCerts
   * @description oVirt 인증서 목록
   * 
   * @returns 
   **/
  findAllCerts: async () => makeAPICall({
    method: "GET",
    url: ENDPOINTS.FIND_ALL_CERTS(),
  }),
  /**
   * @name ApiManager.findCert
   * @description oVirt 인증서 목록
   * 
   * @returns 
   **/
  findCert: async (id) => makeAPICall({
    method: "GET",
    url: ENDPOINTS.FIND_CERT(id),
  })
  //#endregion: Certificate(s)
}

export default ApiManager