const ENDPOINT_API_V1 = `/api/v1`
const ENDPOINTS = {
  //#region: TreeNavigation
  FIND_ALL_TREE_NAVIGATIONS: (type) =>                                     `${ENDPOINT_API_V1}/navigation/${type}`,
  //#endregion: TreeNavigation

  //#region: Dashboard
  GET_DASHBOARD: () =>                                                     `${ENDPOINT_API_V1}/dashboard`,
  GET_CPU_MEMORY: () =>                                                    `${ENDPOINT_API_V1}/dashboard/hosts/usage`,
  GET_STORAGE: () =>                                                       `${ENDPOINT_API_V1}/dashboard/storages/usage`,
  GET_VM_CPU: () =>                                                        `${ENDPOINT_API_V1}/dashboard/vms/usage/cpu`,
  GET_VM_MEMORY: () =>                                                     `${ENDPOINT_API_V1}/dashboard/vms/usage/memory`,
  GET_STORAGE_MEMORY: () =>                                                `${ENDPOINT_API_V1}/dashboard/storages/usage/memory`,

  GET_PER_HOSTS: () =>                                                     `${ENDPOINT_API_V1}/dashboard/hosts/usage/avg`,
  GET_PER_DOMAIN: () =>                                                    `${ENDPOINT_API_V1}/dashboard/storages/usage/avg`,
  GET_HOSTS: () =>                                                         `${ENDPOINT_API_V1}/dashboard/hosts`,

  GET_PER_VM_CPU: () =>                                                    `${ENDPOINT_API_V1}/dashboard/vmCpuPerList`,
  GET_PER_VM_MEMORY: () =>                                                 `${ENDPOINT_API_V1}/dashboard/vmMemoryPerList`,
  // GET_PER_VM_NETWORK: () =>                                                `${ENDPOINT_API_V1}/dashboard/vmNetworkPerList`,
         
  GET_METRIC_VM_CPU: () =>                                                 `${ENDPOINT_API_V1}/dashboard/vms/metric/cpu`,
  GET_METRIC_VM_MEMORY: () =>                                              `${ENDPOINT_API_V1}/dashboard/vms/metric/memory`,
  GET_METRIC_STORAGE: () =>                                                `${ENDPOINT_API_V1}/dashboard/storages/metric`,
  
  GET_PER_HOST: (hostId) =>                                                `${ENDPOINT_API_V1}/dashboard/hosts/${hostId}/usage`,
  GET_PER_VM: (vmId) =>                                                    `${ENDPOINT_API_V1}/dashboard/vms/${vmId}/usage`,
  GET_PER_DATA_CENTER: (dataCenterId) =>                                   `${ENDPOINT_API_V1}/dashboard/datacenters/${dataCenterId}/usage`,
  GET_PER_CLUSTER: (clusterId) =>                                          `${ENDPOINT_API_V1}/dashboard/clusters/${clusterId}/usage`,


  //#endregion: Dashboard
  
  //#region: DataCenter
  FIND_ALL_DATA_CENTERS: () =>                                             `${ENDPOINT_API_V1}/computing/datacenters`,
  FIND_ALL_DATA_CENTERS_WITH_HOSTS: () =>                                   `${ENDPOINT_API_V1}/computing/datacenters/hosts`,
  FIND_DATA_CENTER: (dataCenterId) =>                                      `${ENDPOINT_API_V1}/computing/datacenters/${dataCenterId}`, 
  FIND_CLUSTERS_FROM_DATA_CENTER: (dataCenterId) =>                        `${ENDPOINT_API_V1}/computing/datacenters/${dataCenterId}/clusters`, 
  FIND_HOSTS_FROM_DATA_CENTER: (dataCenterId) =>                           `${ENDPOINT_API_V1}/computing/datacenters/${dataCenterId}/hosts`, 
  FIND_VMS_FROM_DATA_CENTER: (dataCenterId) =>                             `${ENDPOINT_API_V1}/computing/datacenters/${dataCenterId}/vms`, 
  FIND_STORAGE_DOMAINS_FROM_DATA_CENTER: (dataCenterId) =>                 `${ENDPOINT_API_V1}/computing/datacenters/${dataCenterId}/storageDomains`, 
  FIND_ACTIVE_STORAGE_DOMAINS_FROM_DATA_CENTER: (dataCenterId) =>          `${ENDPOINT_API_V1}/computing/datacenters/${dataCenterId}/storageDomains/active`,
  FIND_NETWORKS_FROM_DATA_CENTER: (dataCenterId) =>                        `${ENDPOINT_API_V1}/computing/datacenters/${dataCenterId}/networks`, 
  FIND_TEMPLATES_FROM_DATA_CENTER: (dataCenterId) =>                       `${ENDPOINT_API_V1}/computing/datacenters/${dataCenterId}/templates`,
  FIND_ATTACH_DISK_LIST_FROM_DATA_CENTER:(dataCenterId) =>                 `${ENDPOINT_API_V1}/computing/datacenters/${dataCenterId}/unattachedDiskImages`,
  FIND_ISOS_FROM_DATA_CENTER:(dataCenterId) =>                             `${ENDPOINT_API_V1}/computing/datacenters/${dataCenterId}/iso`, 
  
  ADD_DATA_CENTER: () =>                                                   `${ENDPOINT_API_V1}/computing/datacenters`,
  EDIT_DATA_CENTER: (dataCenterId) =>                                      `${ENDPOINT_API_V1}/computing/datacenters/${dataCenterId}`, 
  REMOVE_DATA_CENTER: (dataCenterId) =>                                    `${ENDPOINT_API_V1}/computing/datacenters/${dataCenterId}`, 
  //#endregion: DataCenter
  
  // region: Cluster
  FIND_ALL_CLUSTERS: () =>                                                 `${ENDPOINT_API_V1}/computing/clusters`,
  FIND_ALL_UP_CLUSTERS: () =>                                              `${ENDPOINT_API_V1}/computing/clusters/up`,
  FIND_CLUSTER: (clusterId) =>                                             `${ENDPOINT_API_V1}/computing/clusters/${clusterId}`, 
  FIND_HOSTS_FROM_CLUSTER:(clusterId) =>                                   `${ENDPOINT_API_V1}/computing/clusters/${clusterId}/hosts`, 
  FIND_VMS_FROM_CLUSTER:(clusterId) =>                                     `${ENDPOINT_API_V1}/computing/clusters/${clusterId}/vms`, 
  
  FIND_NETWORKS_FROM_CLUSTER:(clusterId) =>                                `${ENDPOINT_API_V1}/computing/clusters/${clusterId}/networks`, 
  ADD_NETWORK_FROM_CLUSTER:(clusterId) =>                                  `${ENDPOINT_API_V1}/computing/clusters/${clusterId}/networks`,
  MANAGE_NETWORKS_FROM_CLUSTER:(clusterId) =>                              `${ENDPOINT_API_V1}/computing/clusters/${clusterId}/manageNetworks`, 
  FIND_VNICPROFILES_FROM_CLUSTER:(clusterId) =>                            `${ENDPOINT_API_V1}/computing/clusters/${clusterId}/vnicProfiles`, 
  FIND_ALL_OPERATING_SYSTEMS_FROM_CLUSTER:(clusterId) =>                   `${ENDPOINT_API_V1}/computing/clusters/${clusterId}/operatingSystems`, 

  FIND_EVENTS_FROM_CLUSTER: (clusterId) =>                                 `${ENDPOINT_API_V1}/computing/clusters/${clusterId}/events`,
  FIND_CPU_PROFILES_FROM_CLUSTER:(clusterId) =>                            `${ENDPOINT_API_V1}/computing/clusters/${clusterId}/cpuProfiles`, 
    
  ADD_CLUSTER: () =>                                                       `${ENDPOINT_API_V1}/computing/clusters`,
  EDIT_CLUSTER: (clusterId) =>                                             `${ENDPOINT_API_V1}/computing/clusters/${clusterId}`, 
  REMOVE_CLUSTER: (clusterId) =>                                           `${ENDPOINT_API_V1}/computing/clusters/${clusterId}`, 
  // endregion: Cluster

  // region: Cluster Level
  FIND_ALL_CLUSTER_LEVELS: (category=""/* arch, id */) =>                  `${ENDPOINT_API_V1}/computing/clusterlevels?category=${category}`,
  FIND_CLUSTER_LEVEL: (clusterLevelId) =>                                  `${ENDPOINT_API_V1}/computing/clusterlevels/${clusterLevelId}`,
  // endregion: Cluster Level

  //#region: Host
  FIND_ALL_HOSTS: () =>                                                    `${ENDPOINT_API_V1}/computing/hosts`,
  FIND_HOST: (hostId) =>                                                   `${ENDPOINT_API_V1}/computing/hosts/${hostId}`, 
  FIND_VMS_FROM_HOST:(hostId) =>                                           `${ENDPOINT_API_V1}/computing/hosts/${hostId}/vms`, 

  FIND_HOST_NICS_FROM_HOST: (hostId) =>                                    `${ENDPOINT_API_V1}/computing/hosts/${hostId}/nics`, 
  FIND_HOST_NIC_FROM_HOST: (hostId, nicId) =>                              `${ENDPOINT_API_V1}/computing/hosts/${hostId}/nics/${nicId}`, 
  FIND_NETWORK_ATTACHMENTS_FROM_HOST: (hostId) =>                          `${ENDPOINT_API_V1}/computing/hosts/${hostId}/networkAttachments`, 
  FIND_NETWORK_ATTACHMENT_FROM_HOST: (hostId, networkAttachmentId) =>      `${ENDPOINT_API_V1}/computing/hosts/${hostId}/networkAttachments/${networkAttachmentId}`, 
  
  EDIT_NETWORK_ATTACHMENT_FROM_HOST: (hostId, networkAttachmentId) =>      `${ENDPOINT_API_V1}/computing/hosts/${hostId}/networkAttachments/${networkAttachmentId}`, 
  DELETE_NETWORK_ATTACHMENT_FROM_HOST: (hostId) =>                         `${ENDPOINT_API_V1}/computing/hosts/${hostId}/networkAttachments`, 

  ADD_BONDING_HOST_NIC_FROM_HOST: (hostId) =>                              `${ENDPOINT_API_V1}/computing/hosts/${hostId}/nics/bonding`, 
  EDIT_BONDING_HOST_NICS_FROM_HOST: (hostId) =>                            `${ENDPOINT_API_V1}/computing/hosts/${hostId}/nics/bonding`, 
  DELETE_BONDING_HOST_NICS_FROM_HOST: (hostId) =>                          `${ENDPOINT_API_V1}/computing/hosts/${hostId}/nics/bonding`, 

  SETUP_HOST_NICS_FROM_HOST: (hostId) =>                                   `${ENDPOINT_API_V1}/computing/hosts/${hostId}/nics/setup`, 
  SYNCALL_NETWORKS_FROM_HOST: (hostId) =>                                  `${ENDPOINT_API_V1}/computing/hosts/${hostId}/syncallNetworks`, 

  FIND_HOSTDEVICES_FROM_HOST:(hostId) =>                                   `${ENDPOINT_API_V1}/computing/hosts/${hostId}/devices`, 
  FIND_ALL_EVENTS_FROM_HOST:(hostId) =>                                        `${ENDPOINT_API_V1}/computing/hosts/${hostId}/events`, 

  FIND_STORAGES_FROM_HOST: (hostId) =>                                     `${ENDPOINT_API_V1}/computing/hosts/${hostId}/storages`,
  FIND_FIBRES_FROM_HOST: (hostId) =>                                       `${ENDPOINT_API_V1}/computing/hosts/${hostId}/fibres`,
  FIND_ISCSIS_FROM_HOST: (hostId) =>                                       `${ENDPOINT_API_V1}/computing/hosts/${hostId}/iscsis`,
  FIND_SEARCH_ISCSIS_FROM_HOST: (hostId) =>                                `${ENDPOINT_API_V1}/computing/hosts/${hostId}/searchIscsi`,
  FIND_SEARCH_FCS_FROM_HOST: (hostId) =>                                   `${ENDPOINT_API_V1}/computing/hosts/${hostId}/searchFc`,
  FIND_LOGIN_ISCSIS_FROM_HOST: (hostId) =>                                 `${ENDPOINT_API_V1}/computing/hosts/${hostId}/iscsiToLogin`,

  ADD_HOST: (deployHostedEngine) =>                                        `${ENDPOINT_API_V1}/computing/hosts?deployHostedEngine=${deployHostedEngine}`,
  EDIT_HOST: (hostId) =>                                                   `${ENDPOINT_API_V1}/computing/hosts/${hostId}`, 
  DELETE_HOST: (hostId) =>                                                 `${ENDPOINT_API_V1}/computing/hosts/${hostId}`, 
  ACTIVATE_HOST: (hostId) =>                                               `${ENDPOINT_API_V1}/computing/hosts/${hostId}/activate`, 
  DEACTIVATE_HOST: (hostId) =>                                             `${ENDPOINT_API_V1}/computing/hosts/${hostId}/deactivate`, 
  RESTART_HOST: (hostId) =>                                                `${ENDPOINT_API_V1}/computing/hosts/${hostId}/restart`, 
  STOP_HOST: (hostId) =>                                                   `${ENDPOINT_API_V1}/computing/hosts/${hostId}/stop`, 
  ENROLL_HOST_CERTIFICATE: (hostId) =>                                     `${ENDPOINT_API_V1}/computing/hosts/${hostId}/enrollCert`, 
  REINSTALL_HOST: (hostId, deployHostedEngine) =>                          `${ENDPOINT_API_V1}/computing/hosts/${hostId}/reinstall?deployHostedEngine=${deployHostedEngine}`,
  REFRESH_HOST: (hostId) =>                                                `${ENDPOINT_API_V1}/computing/hosts/${hostId}/refresh`, 
  COMMIT_NET_CONFIG_HOST: (hostId) =>                                      `${ENDPOINT_API_V1}/computing/hosts/${hostId}/commitNetConfig`, 
  ACTIVATE_HA_HOST: (hostId) =>                                            `${ENDPOINT_API_V1}/computing/hosts/${hostId}/activateGlobal`,
  DEACTIVATE_HA_HOST: (hostId) =>                                          `${ENDPOINT_API_V1}/computing/hosts/${hostId}/deactivateGlobal`,
  //#endregion: Host

  //#region: Vm
  FIND_ALL_VMS: () =>                                                      `${ENDPOINT_API_V1}/computing/vms`,
  FIND_VM: (vmId) =>                                                       `${ENDPOINT_API_V1}/computing/vms/${vmId}`, 
  
  FIND_ALL_DISK_ATTACHMENTS_FROM_VM: (vmId) =>                             `${ENDPOINT_API_V1}/computing/vms/${vmId}/disks`, 
  FIND_DISK_ATTACHMENT_FROM_VM: (vmId, diskAttachmentId) =>                `${ENDPOINT_API_V1}/computing/vms/${vmId}/disks/${diskAttachmentId}`,
  ADD_DISK_FROM_VM: (vmId) =>                                              `${ENDPOINT_API_V1}/computing/vms/${vmId}/disks`, 
  EDIT_DISK_FROM_VM: (vmId, diskAttachmentId) =>                           `${ENDPOINT_API_V1}/computing/vms/${vmId}/disks/${diskAttachmentId}`,
  DELETE_DISK_FROM_VM:(vmId, diskAttachmentId, detachOnly) =>              `${ENDPOINT_API_V1}/computing/vms/${vmId}/disks/${diskAttachmentId}?detachOnly=${detachOnly}`,
  DELETE_DISKS_FROM_VM: (vmId) =>                                          `${ENDPOINT_API_V1}/computing/vms/${vmId}/disks`, 
  ATTACH_DISK_FROM_VM: (vmId) =>                                           `${ENDPOINT_API_V1}/computing/vms/${vmId}/disks/attach`, 
  ATTACH_DISKS_FROM_VM: (vmId) =>                                          `${ENDPOINT_API_V1}/computing/vms/${vmId}/disks/attachs`, 
  FIND_STORAGE_DOMAINS_FROM_VM: (vmId, diskAttachmentId) =>                `${ENDPOINT_API_V1}/computing/vms/${vmId}/disks/${diskAttachmentId}/storageDomains`,
  ACTIVATE_DISK_FROM_VM: (vmId, diskAttachmentId) =>                       `${ENDPOINT_API_V1}/computing/vms/${vmId}/disks/${diskAttachmentId}/activate`, 
  DEACTIVATE_DISK_FROM_VM: (vmId, diskAttachmentId) =>                     `${ENDPOINT_API_V1}/computing/vms/${vmId}/disks/${diskAttachmentId}/deactivate`, 
  MOVE_DISK_FROM_VM: (vmId) =>                                             `${ENDPOINT_API_V1}/computing/vms/${vmId}/disks/move`, 
  COPY_DISK_FROM_VM: (vmId) =>                                             `${ENDPOINT_API_V1}/computing/vms/${vmId}/disks/copy`, 

  FIND_ALL_SNAPSHOTS_FROM_VM: (vmId) =>                                    `${ENDPOINT_API_V1}/computing/vms/${vmId}/snapshots`, 
  FIND_SNAPSHOT_FROM_VM: (vmId, snapshotId) =>                             `${ENDPOINT_API_V1}/computing/vms/${vmId}/snapshots/${snapshotId}`, 
  ADD_SNAPSHOT_FROM_VM: (vmId) =>                                          `${ENDPOINT_API_V1}/computing/vms/${vmId}/snapshots`, 
  DELETE_ALL_SNAPSHOTS_FROM_VM: (vmId) =>                                  `${ENDPOINT_API_V1}/computing/vms/${vmId}/snapshots`, // 스냅샷 여러개
  DELETE_SNAPSHOT_FROM_VM: (vmId,snapshotId) =>                            `${ENDPOINT_API_V1}/computing/vms/${vmId}/snapshots/${snapshotId}`, 
  PREVIEW_SNAPSHOT_FROM_VM: (vmId, snapshotId) =>                          `${ENDPOINT_API_V1}/computing/vms/${vmId}/snapshots/${snapshotId}/preview`,
  CLONE_SNAPSHOTS_FROM_VM: (vmId) =>                                       `${ENDPOINT_API_V1}/computing/vms/${vmId}/snapshots/clone`, 
  COMMIT_SNAPSHOTS_FROM_VM: (vmId) =>                                      `${ENDPOINT_API_V1}/computing/vms/${vmId}/snapshots/commit`, 
  UNDO_SNAPSHOTS_FROM_VM: (vmId) =>                                        `${ENDPOINT_API_V1}/computing/vms/${vmId}/snapshots/undo`, 

  FIND_NICS_FROM_VM: (vmId) =>                                             `${ENDPOINT_API_V1}/computing/vms/${vmId}/nics`, 
  FIND_NIC_FROM_VM: (vmId, nicId) =>                                       `${ENDPOINT_API_V1}/computing/vms/${vmId}/nics/${nicId}`, 
  ADD_NICS_FROM_VM: (vmId) =>                                              `${ENDPOINT_API_V1}/computing/vms/${vmId}/nics`, 
  EDIT_NIC_FROM_VM: (vmId, nicId) =>                                       `${ENDPOINT_API_V1}/computing/vms/${vmId}/nics/${nicId}`, 
  ATTACH_NIC_FROM_VM: (vmId, nicId) =>                                     `${ENDPOINT_API_V1}/computing/vms/${vmId}/nics/${nicId}/attach`, 
  DETACH_NIC_FROM_VM: (vmId, nicId) =>                                     `${ENDPOINT_API_V1}/computing/vms/${vmId}/nics/${nicId}/detach`, 
  DELETE_NIC_FROM_VM: (vmId, nicId) =>                                     `${ENDPOINT_API_V1}/computing/vms/${vmId}/nics/${nicId}`, 

  FIND_APPLICATIONS_FROM_VM:(vmId) =>                                      `${ENDPOINT_API_V1}/computing/vms/${vmId}/applications`, 
  FIND_HOST_DEVICES_FROM_VM:(vmId) =>                                      `${ENDPOINT_API_V1}/computing/vms/${vmId}/hostDevices`, 
  FIND_EVENTS_FROM_VM:(vmId) =>                                            `${ENDPOINT_API_V1}/computing/vms/${vmId}/events`, 

  ADD_VM: () =>                                                            `${ENDPOINT_API_V1}/computing/vms`,
  EDIT_VM: (vmId) =>                                                       `${ENDPOINT_API_V1}/computing/vms/${vmId}`, 
  DELETE_VM: (vmId, detachOnly) =>                                         `${ENDPOINT_API_V1}/computing/vms/${vmId}?detachOnly=${detachOnly}`,
  
  START_VM: (vmId) =>                                                      `${ENDPOINT_API_V1}/computing/vms/${vmId}/start`, 
  START_ONCE_VM: (vmId) =>                                                 `${ENDPOINT_API_V1}/computing/vms/${vmId}/startOnce`, 
  PAUSE_VM: (vmId) =>                                                      `${ENDPOINT_API_V1}/computing/vms/${vmId}/pause`, 
  POWER_OFF_VM: (vmId) =>                                                  `${ENDPOINT_API_V1}/computing/vms/${vmId}/powerOff`, 
  SHUT_DOWN_VM: (vmId) =>                                                  `${ENDPOINT_API_V1}/computing/vms/${vmId}/shutdown`, 
  REBOOT_VM: (vmId) =>                                                     `${ENDPOINT_API_V1}/computing/vms/${vmId}/reboot`, 
  RESET_VM: (vmId) =>                                                      `${ENDPOINT_API_V1}/computing/vms/${vmId}/reset`, 
  EXPORT_VM: (vmId) =>                                                     `${ENDPOINT_API_V1}/computing/vms/${vmId}/export`, 
  CONSOLE_VM: (vmId) =>                                                    `${ENDPOINT_API_V1}/computing/vms/${vmId}/console`,
  REMOTE_VIEWER_CONNECTION_FILE_VM: (vmId) =>                              `${ENDPOINT_API_V1}/computing/vms/${vmId}/remoteviewerconnection`,
  FIND_ALL_MIGRATABLE_HOSTS_FROM_VM: (vmId) =>                             `${ENDPOINT_API_V1}/computing/vms/${vmId}/migratableHosts`,
  FIND_ALL_MIGRATABLE_HOSTS_4_VMS: (vmIds) =>                              `${ENDPOINT_API_V1}/computing/vms/migratableHosts?vmIds=${vmIds}`, 
  MIGRATE_VM: (vmId, affinityClosure) => {
    let url = `${ENDPOINT_API_V1}/computing/vms/${vmId}/migrate`;
    const flag = affinityClosure === true || affinityClosure === 'true';
    if(affinityClosure){
      url += `?affinityClosure=${flag}`
    }
    return url;
  },
  FIND_CDROM_FROM_VM: (vmId, current) =>                                   `${ENDPOINT_API_V1}/computing/vms/${vmId}/cdroms?current=${current}`,
  UPDATE_CDROM_FROM_VM: (vmId, cdromFileId, current) =>                    `${ENDPOINT_API_V1}/computing/vms/${vmId}/cdroms/${cdromFileId}?current=${current}`,
  TAKE_VM_SCREENSHOT: (vmId) =>                                            `${ENDPOINT_API_V1}/computing/vms/${vmId}/screenshot`,
  
  IMPORT_VM: () =>                                                         `${ENDPOINT_API_V1}/computing/vms/vmware`,
  
  //#endregion: Vm

  //#region: Template
  FIND_ALL_TEMPLATES :() =>                                                `${ENDPOINT_API_V1}/computing/templates`,
  FIND_TEMPLATE: (templateId) =>                                           `${ENDPOINT_API_V1}/computing/templates/${templateId}`, 
  FIND_VMS_FROM_TEMPLATE: (templateId) =>                                  `${ENDPOINT_API_V1}/computing/templates/${templateId}/vms`, 
  FIND_NICS_FROM_TEMPLATE: (templateId) =>                                 `${ENDPOINT_API_V1}/computing/templates/${templateId}/nics`,
  FIND_NIC_FROM_TEMPLATE:  (templateId, nicId) =>                          `${ENDPOINT_API_V1}/computing/templates/${templateId}/nics/${nicId}`,
  ADD_NICS_FROM_TEMPLATE: (templateId) =>                                  `${ENDPOINT_API_V1}/computing/templates/${templateId}/nics`,
  EDIT_NICS_FROM_TEMPLATE: (templateId, nicId) =>                          `${ENDPOINT_API_V1}/computing/templates/${templateId}/nics/${nicId}`,
  DELETE_NICS_FROM_TEMPLATE: (templateId, nicId) =>                        `${ENDPOINT_API_V1}/computing/templates/${templateId}/nics/${nicId}`,
  FIND_DISKS_FROM_TEMPLATE: (templateId) =>                                `${ENDPOINT_API_V1}/computing/templates/${templateId}/disks`,  
  FIND_STORAGE_DOMAINS_FROM_TEMPLATE: (templateId) =>                      `${ENDPOINT_API_V1}/computing/templates/${templateId}/storageDomains`, 
  FIND_EVENTS_FROM_TEMPLATE: (templateId) =>                               `${ENDPOINT_API_V1}/computing/templates/${templateId}/events`, 

  ADD_TEMPLATE: (vmId) =>                                                  `${ENDPOINT_API_V1}/computing/templates/${vmId}`, 
  EDIT_TEMPLATE: (templateId) =>                                           `${ENDPOINT_API_V1}/computing/templates/${templateId}`, 
  DELETE_TEMPLATE: (templateId) =>                                         `${ENDPOINT_API_V1}/computing/templates/${templateId}`, 
  //#endregion: Template

  //#region: Type
  FIND_ALL_BIOS_TYPES: () =>                                               `${ENDPOINT_API_V1}/types/bios`,
  FIND_ALL_DISK_CONTENT_TYPES: () =>                                       `${ENDPOINT_API_V1}/types/diskContentType`,
  FIND_ALL_MIGRATION_SUPPORTS: () =>                                       `${ENDPOINT_API_V1}/types/migrationSupport`,
  FIND_ALL_QUOTA_ENFORCEMENT_TYPES: () =>                                  `${ENDPOINT_API_V1}/types/quotaEnforcementType`,
  FIND_ALL_VM_TYPES: () =>                                                 `${ENDPOINT_API_V1}/types/vmType`,
  //#endregion: Type

  //#region: Network
  FIND_ALL_NETWORKS: () =>                                                 `${ENDPOINT_API_V1}/networks`,
  FIND_NETWORK: (networkId) =>                                             `${ENDPOINT_API_V1}/networks/${networkId}`,

  FIND_CLUSTERS_FROM_NETWORK:(networkId) =>                                `${ENDPOINT_API_V1}/networks/${networkId}/clusters`,
  FIND_CONNECTED_HOSTS_FROM_NETWORK:(networkId) =>                         `${ENDPOINT_API_V1}/networks/${networkId}/connectHosts`,
  FIND_DISCONNECTED_HOSTS_FROM_NETWORK:(networkId) =>                      `${ENDPOINT_API_V1}/networks/${networkId}/disconnectHosts`,
  FIND_VMS_FROM_NETWORK:(networkId) =>                                     `${ENDPOINT_API_V1}/networks/${networkId}/vms`,
  FIND_TEMPLATES_NETWORK:(networkId) =>                                    `${ENDPOINT_API_V1}/networks/${networkId}/templates`,

  ADD_NETWORK: () =>                                                       `${ENDPOINT_API_V1}/networks`,
  EDIT_NETWORK: (networkId) =>                                             `${ENDPOINT_API_V1}/networks/${networkId}`,
  DELETE_NETWORK: (networkId) =>                                           `${ENDPOINT_API_V1}/networks/${networkId}`,
  FIND_DATA_CENTERS_FROM_NETWORK: (openstackNetworkId) =>                  `${ENDPOINT_API_V1}/networks/import/datacenters/${openstackNetworkId}`,
  IMPORT_NETWORK: () =>                                                    `${ENDPOINT_API_V1}/networks/import`,
  
  FIND_VNIC_PROFILES_FROM_NETWORK: (networkId) =>                          `${ENDPOINT_API_V1}/networks/${networkId}/vnicProfiles`,
  FIND_ALL_NETWORK_FILTERS: () =>                                          `${ENDPOINT_API_V1}/networks/networkFilters`,
  //#endregion: Network

  //#region: Network Provider
  FIND_ALL_NETWORK_PROVIDERS: () =>                                        `${ENDPOINT_API_V1}/networkproviders/`,
  FIND_NETWORKS_FROM_NETWORK_PROVIDER: (providerId) =>                     `${ENDPOINT_API_V1}/networkproviders/${providerId}`,
  //#endregion: Network Provider

  //#region: VnicProfile
  FIND_ALL_VNIC_PROFILES: () =>                                            `${ENDPOINT_API_V1}/vnicProfiles`,
  FIND_VNIC_PROFILE: (vnicProfileId) =>                                    `${ENDPOINT_API_V1}/vnicProfiles/${vnicProfileId}`,
  FIND_VMS_VNIC_PROFILE: (vnicProfileId) =>                                `${ENDPOINT_API_V1}/vnicProfiles/${vnicProfileId}/vms`,
  FIND_TEMPLATE_VNIC_PROFILE: (vnicProfileId) =>                           `${ENDPOINT_API_V1}/vnicProfiles/${vnicProfileId}/templates`,
  ADD_VNIC_PROFILE_FROM_NETWORK: (networkId) =>                            `${ENDPOINT_API_V1}/vnicProfiles`,
  EDIT_VNIC_PROFILE_FROM_NETWORK: (vnicProfileId) =>                       `${ENDPOINT_API_V1}/vnicProfiles/${vnicProfileId}`,
  DELETE_VNIC_PROFILE_FROM_NETWORK: (vnicProfileId) =>                     `${ENDPOINT_API_V1}/vnicProfiles/${vnicProfileId}`,
  //#endregion: VnicProfile

  //#region: StorageDomain
  FIND_ALL_STORAGE_DOMAINS: () =>                                          `${ENDPOINT_API_V1}/storages/domains`,
  // FIND_ALL_VALID_STORAGE_DOMAINS: () =>                                    `${ENDPOINT_API_V1}/storages/domains/valid`,
  FIND_ALL_NFS_STORAGE_DOMAINS: () =>                                      `${ENDPOINT_API_V1}/storages/domains/nfs`,
  FIND_STORAGE_DOMAIN: (storageDomainId) =>                                `${ENDPOINT_API_V1}/storages/domains/${storageDomainId}`,
  
  FIND_DATA_CENTERS_FROM_STORAGE_DOMAINS: (storageDomainId) =>             `${ENDPOINT_API_V1}/storages/domains/${storageDomainId}/dataCenters`,
  FIND_HOSTS_FROM_STORAGE_DOMAINS: (storageDomainId) =>                    `${ENDPOINT_API_V1}/storages/domains/${storageDomainId}/hosts`,
  ACTIVATE_FROM_DATACENTER: (storageDomainId, dataCenterId) =>             `${ENDPOINT_API_V1}/storages/domains/${storageDomainId}/dataCenters/${dataCenterId}/activate`,
  ATTACH_FROM_DATACENTER: (storageDomainId, dataCenterId) =>               `${ENDPOINT_API_V1}/storages/domains/${storageDomainId}/dataCenters/${dataCenterId}/attach`,
  DETACH_FROM_DATACENTER: (storageDomainId, dataCenterId) =>               `${ENDPOINT_API_V1}/storages/domains/${storageDomainId}/dataCenters/${dataCenterId}/detach`,
  MAINTENANCE_FROM_DATACENTER: (storageDomainId, dataCenterId, ovf) =>     `${ENDPOINT_API_V1}/storages/domains/${storageDomainId}/dataCenters/${dataCenterId}/maintenance?ovf=${ovf}`,
  
  FIND_VMS_FROM_STORAGE_DOMAINS: (storageDomainId) =>                      `${ENDPOINT_API_V1}/storages/domains/${storageDomainId}/vms`,
  FIND_UNREGISTERD_VMS_FROM_STORAGE_DOMAINS: (storageDomainId) =>          `${ENDPOINT_API_V1}/storages/domains/${storageDomainId}/vms/unregistered`,
  REGISTERD_VM_FROM_STORAGE_DOMAINS: (storageDomainId, partialAllow, relocation) =>                  `${ENDPOINT_API_V1}/storages/domains/${storageDomainId}/vms/register?partialAllow=${partialAllow}&relocation=${relocation}`,
  FIND_DISKS_FROM_STORAGE_DOMAINS: (storageDomainId) =>                    `${ENDPOINT_API_V1}/storages/domains/${storageDomainId}/disks`,
  FIND_UNREGISTERD_DISKS_FROM_STORAGE_DOMAINS: (storageDomainId) =>        `${ENDPOINT_API_V1}/storages/domains/${storageDomainId}/disks/unregistered`,
  REGISTERD_DISK_FROM_STORAGE_DOMAINS: (storageDomainId) =>                `${ENDPOINT_API_V1}/storages/domains/${storageDomainId}/disks/register`,
  DELETE_REGISTERD_DISK_FROM_STORAGE_DOMAINS: (storageDomainId, diskId) => `${ENDPOINT_API_V1}/storages/domains/${storageDomainId}/disks/${diskId}`,
  FIND_TEMPLATES_FROM_STORAGE_DOMAINS: (storageDomainId) =>                `${ENDPOINT_API_V1}/storages/domains/${storageDomainId}/templates`,
  FIND_UNREGISTERD_TEMPLATES_FROM_STORAGE_DOMAINS: (storageDomainId) =>    `${ENDPOINT_API_V1}/storages/domains/${storageDomainId}/templates/unregistered`,
  REGISTERD_TEMPLATES_FROM_STORAGE_DOMAINS: (storageDomainId) =>           `${ENDPOINT_API_V1}/storages/domains/${storageDomainId}/templates/register`,
  FIND_DISK_PROFILES_FROM_STORAGE_DOMAINS: (storageDomainId) =>            `${ENDPOINT_API_V1}/storages/domains/${storageDomainId}/diskProfiles`,
  FIND_DISK_SNAPSHOTS_FROM_STORAGE_DOMAINS: (storageDomainId) =>           `${ENDPOINT_API_V1}/storages/domains/${storageDomainId}/diskSnapshots`,
  FIND_EVENTS_FROM_STORAGE_DOMAINS: (storageDomainId) =>                   `${ENDPOINT_API_V1}/storages/domains/${storageDomainId}/events`,
  FIND_ACTIVE_DATA_CENTERS: () =>                                          `${ENDPOINT_API_V1}/storages/domains/dataCenters`,
  
  
  ADD_STORAGE_DOMAIN: () =>                                                `${ENDPOINT_API_V1}/storages/domains`,
  IMPORT_STORAGE_DOMAIN: () =>                                             `${ENDPOINT_API_V1}/storages/domains/import`,
  EDIT_STORAGE_DOMAIN: (domainId) =>                                       `${ENDPOINT_API_V1}/storages/domains/${domainId}`,
  DELETE_STORAGE_DOMAIN: (domainId, format, hostName) => {
    // format 
    //   ? `/api/v1/storages/domains/${domainId}?format=true&host=${hostName}`
    //   : `/api/v1/storages/domains/${domainId}&host=${hostName}`
    let url = `/api/v1/storages/domains/${domainId}`;
    if (format) {
      url += `?format=true&host=${hostName}`;
    } else {
      url += `?host=${hostName}`;
    }
    return url;
    // `/api/v1/storages/domains/${domainId}?${format ? 'format=true&' : ''}host=${hostName}`;
  },  
  DESTORY_STORAGE_DOMAIN: (storageDomainId) =>                             `${ENDPOINT_API_V1}/storages/domains/${storageDomainId}/destroy`, 
  OVF_UPDATE_STORAGE_DOMAIN: (storageDomainId) =>                          `${ENDPOINT_API_V1}/storages/domains/${storageDomainId}/updateOvf`,
  REFRESH_LUN_STORAGE_DOMAIN: (storageDomainId) =>                         `${ENDPOINT_API_V1}/storages/domains/${storageDomainId}/refreshLun`,

  //#endregion: StorageDomain

  //#region: Disk
  FIND_ALL_DISKS: () =>                                                    `${ENDPOINT_API_V1}/storages/disks`,
  FIND_CDROMS_DISK: (diskId) =>                                            `${ENDPOINT_API_V1}/storages/disks/${diskId}/cdRoms`,
  FIND_DISK: (diskId) =>                                                   `${ENDPOINT_API_V1}/storages/disks/${diskId}`,
  FIND_VMS_FROM_DISK: (diskId) =>                                          `${ENDPOINT_API_V1}/storages/disks/${diskId}/vms`,
  FIND_STORAGE_DOMAINS_FROM_DISK: (diskId) =>                              `${ENDPOINT_API_V1}/storages/disks/${diskId}/storageDomains`,

  ADD_DISK: () =>                                                          `${ENDPOINT_API_V1}/storages/disks`,
  EDIT_DISK: (diskId) =>                                                   `${ENDPOINT_API_V1}/storages/disks/${diskId}`,
  DELETE_DISK: (diskId) =>                                                 `${ENDPOINT_API_V1}/storages/disks/${diskId}`,
  COPY_DISK: (diskId) =>                                                   `${ENDPOINT_API_V1}/storages/disks/${diskId}/copy`,
  FIND_STORAGE_DOMAINS_TO_MOVE_DISK: (diskId) =>                           `${ENDPOINT_API_V1}/storages/disks/${diskId}/storageDomains/move`,
  MOVE_DISK: (diskId, storageDomainId) =>                                  `${ENDPOINT_API_V1}/storages/disks/${diskId}/move/${storageDomainId}`,
  REFRESH_LUN_DISK: (diskId) =>                                            `${ENDPOINT_API_V1}/storages/disks/${diskId}/refreshLun`,
  UPLOAD_DISK: () =>                                                       `${ENDPOINT_API_V1}/storages/disks/upload`,
  CANCEL_IMAGE_TRANSFER_FOR_DISK: (diskId) =>                              `${ENDPOINT_API_V1}/storages/disks/${diskId}/cancel`,
  PAUSE_IMAGE_TRANSFER_FOR_DISK: (diskId) =>                               `${ENDPOINT_API_V1}/storages/disks/${diskId}/pause`,
  RESUME_IMAGE_TRANSFER_FOR_DISK: (diskId) =>                              `${ENDPOINT_API_V1}/storages/disks/${diskId}/resume`,
  //#endregion: Disk
  
  //#region: Event
  FIND_ALL_EVENTS: (page=0,size=1000) =>                                   `${ENDPOINT_API_V1}/events?page=${page}&size=${size}`,
  FIND_ALL_EVENTS_PAGE: ({
    page=0,
    size,
    datacenterId=null, clusterId=null, hostId=null, vmId=null, templateId=null, storageDomainId=null,
    minSeverity=null,
    startDate=null
  }) =>                                                                    `${ENDPOINT_API_V1}/events?${page ? `page=${page}` : ""}${size ? `&size=${size}` : ""}${datacenterId ? `&datacenterId=${datacenterId}` : ""}${clusterId ? `&clusterId=${clusterId}` : ""}${hostId ? `&hostId=${hostId}` : ""}${vmId ? `&vmId=${vmId}` : ""}${templateId ? `&templateId=${templateId}` : ""}${storageDomainId ? `&storageDomainId=${storageDomainId}` : ""}${minSeverity ? `&minSeverity=${minSeverity}` : ""}${startDate ? `&startDate=${startDate}` : ""}`,
  FIND_EVENT: (eventId) =>                                                 `${ENDPOINT_API_V1}/events/${eventId}`,
  //#endregion: Event

  //#region: Job
  FIND_ALL_JOBS: () =>                                                     `${ENDPOINT_API_V1}/jobs/`,
  FIND_JOB: (jobId) =>                                                     `${ENDPOINT_API_V1}/jobs/${jobId}`,
  END_JOB: (jobId) =>                                                      `${ENDPOINT_API_V1}/jobs/${jobId}/end`,
  //#endregion: Job

  //#region: Provider
  FIND_ALL_PROVIDERS: () =>                                                `${ENDPOINT_API_V1}/providers`,
  FIND_PROVIDER: (providerId) =>                                           `${ENDPOINT_API_V1}/providers/${providerId}`, 

  ADD_PROVIDER: () =>                                                       `${ENDPOINT_API_V1}/providers`,
  EDIT_PROVIDER: (providerId) =>                                            `${ENDPOINT_API_V1}/providers/${providerId}`, 
  DELETE_PROVIDER: (providerId) =>                                          `${ENDPOINT_API_V1}/providers/${providerId}`, 
  //#endregion: provider

  //#region: VMWare
  AUTHENTICATE_VMWARE : () =>                                              `${ENDPOINT_API_V1}/vw/auth`,
  FIND_VMS_FROM_VMWARE : () =>                                             `${ENDPOINT_API_V1}/vw/vms`,
  FIND_VM_FROM_VMWARE : (vmIds) =>                                          `${ENDPOINT_API_V1}/vw/vms/${vmIds}`,
  //#endregion: VMWare
  
  //#region: User
  FIND_ALL_USERS: () =>                                                    `${ENDPOINT_API_V1}/auth/users`,
  FIND_USER: (username) =>                                                 `${ENDPOINT_API_V1}/auth/users/${username}`,
  UPDATE_PASSWORD_USER: (username, force) =>                               `${ENDPOINT_API_V1}/auth/users/${username}/password?force=${force}`,
  //#endregion: User
  
  //#region: UserSession
  FIND_ALL_USER_SESSIONS: (username) =>                                    `${ENDPOINT_API_V1}/auth/user-sessions?username=${username}`,
  //#endregion: UserSession

  //#region: Certificates
  FIND_ALL_CERTS: () =>                                                    `${ENDPOINT_API_V1}/admin/certs`,
  FIND_CERT: (id) =>                                                       `${ENDPOINT_API_V1}/admin/certs/{id}`,
  ATTACH_CERT: () =>                                                       `${ENDPOINT_API_V1}/admin/certs/attach`,
  //#endregion: Certificates
}

export default ENDPOINTS