import React from "react";
import Localization from "../../utils/Localization";

const DEFAULT_WIDTH_ICON_COLUMN = "48px";
/**
 * @name TableColumnsInfo
 * @description 테이블 컬럼 정보
 */
const TableColumnsInfo = {
  DATACENTERS: [
    { accessor: "icon", clickable: false,         header: '', width: DEFAULT_WIDTH_ICON_COLUMN },
    { accessor: '_name', clickable: true ,        header: Localization.kr.NAME },
    { accessor: 'comment', clickable: false ,     header: Localization.kr.COMMENT },
    { accessor: 'storageType', clickable: false , header: '스토리지 유형' },
    { accessor: 'status', clickable: false,       header: Localization.kr.STATUS, },
    { accessor: 'hostCnt', clickable: false,      header: `${Localization.kr.HOST} 수`, width: '7%' }, 
    { accessor: 'clusterCnt', clickable: false,   header: `${Localization.kr.CLUSTER} 수`, width: '7%'  }, 
    { accessor: 'version', clickable: false,      header: '호환 버전', width: '7%' },
    { accessor: 'description', clickable: false,  header: Localization.kr.DESCRIPTION },
  ],
  CLUSTERS_FROM_DATACENTER: [
    { accessor: '_name',       header: Localization.kr.NAME},
    { accessor: 'version',     header: '호환 버전'},
    { accessor: 'description', header: Localization.kr.DESCRIPTION },
  ],
  STORAGES_FROM_DATACENTER: [
    { header: Localization.kr.STATUS, accessor: 'status' },
    { header: 'crown', accessor: 'hostedEngine' },
    { header: '도메인 이름', accessor: '_name' },
    { header: '도메인 유형', accessor: 'domainType' },
    { header: `${Localization.kr.SIZE_AVAILABLE} (GiB)`, accessor: 'availableSize', clickable: false },
    { header: `${Localization.kr.SIZE_USED} (GiB)`, accessor: 'usedSize', clickable: false },
    { header: `${Localization.kr.SIZE_TOTAL} (GiB)`, accessor: 'diskSize', clickable: false },
    { header: Localization.kr.DESCRIPTION, accessor: 'description' },
  ],
  NETWORK_FROM_DATACENTER: [
    { header: Localization.kr.NAME, accessor: '_name', clickable: true, width: '14%'},
    { header: Localization.kr.DESCRIPTION, accessor: 'description', clickable: false },
  ],

  CLUSTERS: [
    { header: Localization.kr.NAME, accessor: '_name', clickable: true, width: '13%'},
    { header: Localization.kr.DESCRIPTION, accessor: 'description', clickable: false },
    { header: `${Localization.kr.CLUSTER} ${Localization.kr.CPU} 유형`, accessor: 'cpuType', clickable: false },
    { header: `${Localization.kr.HOST} 수`, accessor: 'hostCnt', clickable: false, width: '8%' },
    { header: `${Localization.kr.VM} 수`, accessor: 'vmCnt', clickable: false, width: '9%'  },
    { header: Localization.kr.COMMENT, accessor: 'comment', clickable: false },
  ],
  NETWORK_FROM_CLUSTER: [
    { header: Localization.kr.NAME, accessor: '_name', clickable: true, width: '18%' },
    { header: Localization.kr.STATUS, accessor: 'status', clickable: false , width: '15%' },
    { header: Localization.kr.ROLE, accessor: 'role', clickable: false },
    { header: Localization.kr.DESCRIPTION, accessor: 'description', clickable: false },
  ],

  HOSTS: [
    { header: '', accessor: "icon", clickable: false, width: DEFAULT_WIDTH_ICON_COLUMN },
    { header: '', accessor: "hostedEngine", clickable: false, width: DEFAULT_WIDTH_ICON_COLUMN },
    { header: Localization.kr.NAME, accessor: '_name', clickable: true, width: '12%' },
    { header: Localization.kr.COMMENT, accessor: 'comment', clickable: false, width: '12%' },
    { header: `${Localization.kr.HOST} 이름/IP`, accessor: 'address', clickable: false, width: '12%' },
    { header: Localization.kr.CLUSTER, accessor: 'cluster', clickable: true, width: '12%' },
    { header: Localization.kr.DATA_CENTER, accessor: 'dataCenter', clickable: false, width: '10%' },
    { header: `${Localization.kr.VM} 수`, accessor: 'vmCnt', clickable: false, width: '10%' },
    { header: Localization.kr.STATUS, accessor: 'status', clickable: false },
    { header: Localization.kr.MEMORY, accessor: 'memoryUsage', clickable: false },
    { header: Localization.kr.CPU, accessor: 'cpuUsage', clickable: false },
    { header: Localization.kr.NETWORK, accessor: 'networkUsage', clickable: false },
    { header: 'SPM', accessor: 'spmStatus', clickable: false },
  ],
  VMS_FROM_HOST: [
    { header: '', accessor: "icon", clickable: false, width: '10%' },
    { header: Localization.kr.NAME, accessor: 'name', clickable: true, width: '20%' },
    { header: Localization.kr.IP_ADDRESS, accessor: 'ipv4', clickable: false, width: '20%' },
    { header: 'FQDN', accessor: 'fqdn', clickable: false, width: '20%' },
    { header: Localization.kr.STATUS, accessor: 'status', clickable: false, width: '10%' },
    { header: Localization.kr.CLUSTER, accessor: 'cluster', clickable: true, width: '20%' },
    { header: 'Memory', accessor: 'memoryUsage', clickable: false, width: '12%' },
    { header: Localization.kr.CPU, accessor: 'cpuUsage', clickable: false, width: '12%' },
    { header: 'Network', accessor: 'networkUsage', clickable: false, width: '12%' },
    { header: Localization.kr.UP_TIME, accessor: 'upTime', clickable: false, width: '20%' },
  ],
  NETWORK_INTERFACE_FROM_HOST:[
    { header: "", accessor: "icon", width: DEFAULT_WIDTH_ICON_COLUMN },
    { header: Localization.kr.NAME, accessor: 'name' }, // 인터페이스 이름
    { header: 'MAC', accessor: 'macAddress' }, // MAC 주소
    { header: Localization.kr.SPEED_RX, accessor: 'rxSpeed' }, // Rx 속도
    { header: Localization.kr.SPEED_TX, accessor: 'txSpeed' }, // Tx 속도
    { header: Localization.kr.TOTAL_BYTE_RX, accessor: 'rxTotalSpeed' }, // 총 Rx
    { header: Localization.kr.TOTAL_BYTE_TX, accessor: 'txTotalSpeed' }, // 총 Tx
    { header: Localization.kr.SPEED, accessor: 'speed' }, // 총 Mbps
    { header: 'Pkts', accessor: 'pkts' } // 패킷 수
  ],
  NETWORK_FROM_HOST:[
    // { header: '', accessor: "icon", width: DEFAULT_WIDTH_ICON_COLUMN }, // 아이콘
    { header: '관리되지 않음', accessor: 'bridged' }, 
    { header: 'VLAN', accessor: 'vlan' },
    { header: `${Localization.kr.NETWORK} ${Localization.kr.NAME}`, accessor: 'networkName', clickable: true }, 
    { header: 'IPv4 주소', accessor: 'ipv4' }, 
    { header: 'IPv6 주소', accessor: 'ipv6' } 
  ],
  NETWORK_FROM_HOST_SLAVE:[
    { header: Localization.kr.NAME, accessor: 'name', clickable: false },
    { header: 'MAC', accessor: 'macAddress' }, // MAC 주소
    { header: Localization.kr.SPEED, accessor: 'speed' },
    { header: Localization.kr.SPEED_RX, accessor: 'rxSpeed' },
    { header: Localization.kr.SPEED_TX, accessor: 'txSpeed' },
    { header: Localization.kr.TOTAL_BYTE_RX, accessor: 'rxTotalSpeed' },
    { header: Localization.kr.TOTAL_BYTE_TX, accessor: 'txTotalSpeed' }, 
    { header: '중단', accessor: 'txTotalError' }, 
  ],
  DEVICE_FROM_HOST: [
    { header: Localization.kr.NAME, accessor: 'name', clickable: false },
    { header: '기능', accessor: 'capability', clickable: false },
    { header: '벤더', accessor: 'vendorName', clickable: false },
    { header: '제품', accessor: 'productName', clickable: false },
    { header: '드라이버', accessor: 'driver', clickable: false },
  ],
  PROVIDER_NETWORKS: [
    { key: "select", label: "", width: "40px" },
    { key: "name", label: "이름" },
    { key: "networkId", label: "공급자의 네트워크 ID" },
  ],
  IMPORT_NETWORKS: [
    { key: "select", label: "", width: "40px" },
    { key: "name", label: "이름" },
    { key: "networkId", label: "공급자의 네트워크 ID" },
    { key: "dataCenter", label: "데이터센터" },
    { key: "allowAll", label: "모두 허용" },
  ],
  VMS: [
    { header: '', accessor: "icon", clickable: false, width: DEFAULT_WIDTH_ICON_COLUMN, },
    { header: '', accessor: 'engine', clickable: false, width: DEFAULT_WIDTH_ICON_COLUMN, },
    { header: Localization.kr.NAME, accessor: '_name', clickable: true, width: '20%' },
    { header: Localization.kr.COMMENT, accessor: 'comment', clickable: false, width: '20%' },
    { header: Localization.kr.IP_ADDRESS, accessor: 'ipv4', clickable: false, width: '20%' },
    { header: 'FQDN', accessor: 'fqdn', clickable: false, width: '20%' },
    { header: Localization.kr.STATUS, accessor: 'status', clickable: false, width: '10%' },
    { header: Localization.kr.HOST, accessor: 'host', clickable: true, width: '25%' },
    { header: Localization.kr.CLUSTER, accessor: 'cluster', clickable: true, width: '20%' },
    { header: Localization.kr.DATA_CENTER, accessor: 'dataCenter', clickable: true, width: '20%' },
    { header: 'Memory', accessor: 'memoryUsage', clickable: false, width: '12%' },
    { header: Localization.kr.CPU, accessor: 'cpuUsage', clickable: false, width: '12%' },
    { header: 'Network', accessor: 'networkUsage', clickable: false, width: '12%' },
    { header: Localization.kr.UP_TIME, accessor: 'upTime', clickable: false, width: '12%' },
    { header: Localization.kr.DESCRIPTION, accessor: 'description', clickable: false, width: '25%' }
  ],
  NICS_FROM_VMS: [
    { header: '연결됨', accessor: 'linked', clickable: false, width: '7%' },
    { header: `${Localization.kr.NETWORK} ${Localization.kr.NAME}`, accessor: 'networkName', clickable: false },
    { header: '프로파일 이름', accessor: 'vnicProfileName', clickable: false },
    { header: '링크 상태', accessor: 'status', clickable: false },
    { header: '유형', accessor: 'interface_', clickable: false },
    { header: Localization.kr.SPEED, accessor: 'speed', clickable: false },
    { header: '포트 미러링', accessor: 'portMirroring', clickable: false },
    { header: '게스트 인터페이스 이름', accessor: 'guestInterfaceName', clickable: false },
  ],
  NICS_CALC_FROM_VMS: [
    { header: Localization.kr.SPEED_RX, accessor: 'rxSpeed', clickable: false, width: '7%' },
    { header: Localization.kr.SPEED_TX, accessor: 'txSpeed', clickable: false },
    { header: Localization.kr.TOTAL_BYTE_RX, accessor: 'rxTotalSpeed', clickable: false },
    { header: Localization.kr.TOTAL_BYTE_TX, accessor: 'txTotalSpeed', clickable: false },
    { header: '중단 (Pkts)', accessor: 'pkts', clickable: false },
  ],
  DISKS_FROM_VM: [
    { header: '', accessor: "icon", clickable: false, width: DEFAULT_WIDTH_ICON_COLUMN },
    { header: Localization.kr.ALIAS, accessor: '_alias', clickable: true ,width:'10%'},
    { header: Localization.kr.IS_BOOTABLE, accessor: 'bootable', clickable: false,width:'4%' },
    { header: Localization.kr.IS_SHARABLE, accessor: 'sharable', clickable: false,width:'4%' },
    { header: Localization.kr.IS_READ_ONLY, accessor: 'readOnly', clickable: false,width:'4%' },
    { header: Localization.kr.SIZE_VIRTUAL, accessor: 'virtualSize', clickable: false },
    { header: `${Localization.kr.CONNECTION} ${Localization.kr.TARGET}`, accessor: 'connectionvm', clickable: false },
    { header: '인터페이스', accessor: 'interface', clickable: false },
    { header: '논리적 이름', accessor: 'logicalName', clickable: false },
    { header: Localization.kr.STATUS, accessor: 'status', clickable: false },
    { header: '스토리지 유형', accessor: 'storageType', clickable: false },
    { header: Localization.kr.DESCRIPTION, accessor: 'description', clickable: false },
  ],
  DISK_IMAGES_FROM_VM: [
    { header: '', accessor: "icon", clickable: false,width:'4%' },
    { header: Localization.kr.ALIAS, accessor: '_alias', clickable: true ,width:'10%'},
    { header: Localization.kr.IS_BOOTABLE, accessor: 'bootable', clickable: false,width:'4%' },
    { header: Localization.kr.IS_SHARABLE, accessor: 'sharable', clickable: false,width:'4%' },
    { header: Localization.kr.IS_READ_ONLY, accessor: 'readOnly', clickable: false,width:'4%' },
    { header: Localization.kr.SIZE_VIRTUAL, accessor: 'virtualSize', clickable: false },
    { header: Localization.kr.SIZE_ACTUAL, accessor: 'actualSize', clickable: false },
    { header: Localization.kr.SPARSE, accessor: 'sparse', clickable: false },
    { header: '스토리지 도메인', accessor: 'storageDomain', clickable: false },
    { header: '스토리지 유형', accessor: 'storageType', clickable: false },
    { header: Localization.kr.DATE_CREATED, accessor: 'creationDate', clickable: false },
    { header: `${Localization.kr.CONNECTION} ${Localization.kr.TARGET}`, accessor: 'connectionvm', clickable: false },
    { header: '인터페이스', accessor: 'interface', clickable: false },    
    { header: '논리적 이름', accessor: 'logicalName', clickable: false },
    { header: Localization.kr.STATUS, accessor: 'status', clickable: false },
    { header: Localization.kr.DESCRIPTION, accessor: 'description', clickable: false },
  ],
  DISK_LUN_FROM_VM: [
    { header: '', accessor: 'status', clickable: false,width:'4%' },
    { header: Localization.kr.ALIAS, accessor: '_alias', clickable: true ,width:'10%'},
    { header: Localization.kr.IS_BOOTABLE, accessor: 'bootable', clickable: false,width:'4%' },
    { header: Localization.kr.IS_SHARABLE, accessor: 'sharable', clickable: false,width:'4%' },
    { header: Localization.kr.IS_READ_ONLY, accessor: 'readOnly', clickable: false,width:'4%' },
    { header: Localization.kr.SIZE_VIRTUAL, accessor: 'virtualSize', clickable: false },
    { header: 'LUN ID', accessor: 'lunId', clickable: false },
    { header: '시리얼', accessor: 'serial', clickable: false },
    { header: '벤더 ID', accessor: 'venderId', clickable: false },
    { header: '제품 ID', accessor: 'productId', clickable: false },
    { header: `${Localization.kr.CONNECTION} ${Localization.kr.TARGET}`, accessor: 'connectionvm', clickable: false },
    { header: '인터페이스', accessor: 'interface', clickable: false },    
    { header: '논리적 이름', accessor: 'logicalName', clickable: false },
    { header: Localization.kr.DESCRIPTION, accessor: 'description', clickable: false },
  ],
  APPLICATIONS_FROM_VM: [
    { header: '설치된 애플리케이션', accessor: 'name' }
  ],
  HOST_DEVICE_FROM_VM: [
    { header: Localization.kr.NAME, accessor: 'name', clickable: false },
    { header: '기능', accessor: 'capability', clickable: false },
    { header: '벤더', accessor: 'vendorName', clickable: false },
    { header: '제품', accessor: 'productName', clickable: false },
    { header: '드라이버', accessor: 'driver', clickable: false },
    { header: '현재 사용중', accessor: 'used', clickable: false },
  ],
  TEMPLATES: [
    { header: Localization.kr.NAME, accessor: '_name', clickable: true },
    { header: Localization.kr.DATE_CREATED, accessor: 'creationTime', clickable: false },
    { header: Localization.kr.STATUS, accessor: 'status', clickable: false },
    { header: '버전', accessor: 'version', clickable: false },
    { header: Localization.kr.COMMENT, accessor: 'comment', clickable: false },
    { header: '보관', accessor: 'status', clickable: false },
    { header: Localization.kr.CLUSTER, accessor: 'cluster', clickable: true },
    { header: Localization.kr.DATA_CENTER, accessor: 'dataCenter', clickable: true },
    { header: Localization.kr.DESCRIPTION, accessor: 'description', clickable: false },
  ],
  VMS_FROM_TEMPLATE:[
    { header: '', accessor: "icon", clickable: false, width: DEFAULT_WIDTH_ICON_COLUMN },
    { header: Localization.kr.NAME, accessor: '_name', clickable: true, width: '10%' },
    { header: Localization.kr.IP_ADDRESS, accessor: 'ipv4', clickable: false, width: '10%' },
    { header: 'FQDN', accessor: 'fqdn', clickable: false, width: '10%' },
    { header: Localization.kr.STATUS, accessor: 'status', clickable: false, width: '10%' },
    { header: Localization.kr.HOST, accessor: 'host', clickable: true, width: '15%' },
    { header: Localization.kr.UP_TIME, accessor: 'upTime', clickable: false, width: '20%' },
    { header: Localization.kr.DESCRIPTION, accessor: 'description', clickable: false, width: '25%' },
  ],
  NICS_FROM_TEMPLATE: [
    { header: '', accessor: 'status', clickable: false, width: '7%' },
    { header: Localization.kr.NAME, accessor: 'name', clickable: false },
    { header: '연결됨', accessor: '_plugged', clickable: true},
    { header: `${Localization.kr.NETWORK} ${Localization.kr.NAME}`, accessor: 'network', clickable: false },
    { header: '프로파일 이름', accessor: 'vnicProfile', clickable: false },
    { header: '링크 상태', accessor: '_linked', clickable: false },
    { header: '유형', accessor: 'interface_', clickable: false },
  ],
  DISKS_FROM_TEMPLATE: [
    { header: Localization.kr.ALIAS, accessor: '_alias', clickable: false, width: '7%' },
    { header: 'R/O', accessor: 'name', clickable: false },
    { header: Localization.kr.SIZE_VIRTUAL, accessor: 'virtualSize', clickable: true},
    { header: Localization.kr.SIZE_ACTUAL, accessor: 'actualSize', clickable: false },
    { header: Localization.kr.STATUS, accessor: 'status', clickable: false },
    { header: '스토리지 도메인', accessor: 'storageDomainName', clickable: false },
    { header: Localization.kr.SPARSE, accessor: 'policy', clickable: false },
    { header: '인터페이스', accessor: 'interfaceType', clickable: false },
    { header: '유형', accessor: 'storageType', clickable: false },
    // { header: Localization.kr.DATE_CREATED, accessor: 'creationTime', clickable: false },
  ],


  NETWORKS: [
    { header: Localization.kr.NAME, accessor: '_name', clickable: true },
    { header: Localization.kr.COMMENT, accessor: 'comment', clickable: false },
    { header: Localization.kr.DATA_CENTER, accessor: 'datacenter', clickable: false },
    { header: Localization.kr.DESCRIPTION, accessor: 'description', clickable: false, width: '20%' },
    { header: 'VLAN 태그', accessor: 'vlan' ,clickable: false },
    // { header: '레이블', accessor: 'label', clickable: false },
    { header: 'MTU', accessor: 'mtu', clickable: false },
  ],
  VNIC_PROFILES_FROM_NETWORK: [
    { header: Localization.kr.NAME, accessor: '_name', clickable: false },
    { header: Localization.kr.NETWORK, accessor: 'network', clickable: false },
    { header: Localization.kr.DATA_CENTER, accessor: 'dataCenter', clickable: true },
    { header: Localization.kr.NETWORK_FILTER, accessor: 'networkFilter', clickable: false },
    { header: '포트 미러링', accessor: 'portMirroring', clickable: false },
    { header: '통과', accessor: 'passThrough', clickable: false },
    { header: Localization.kr.DESCRIPTION, accessor: 'description', clickable: false },
  ],
  CLUSTERS_FRON_NETWORK: [
    { header: Localization.kr.NAME, accessor: '_name', clickable: true, width: '15%' },
    { header: '연결된 네트워크', accessor: 'connect', clickable: false, width: '9%' },
    { header: '네트워크 상태', accessor: 'status', clickable: false , width: '10%'},
    { header: '필수 네트워크', accessor: 'required', clickable: false, width: '9%' },
    { header: '네트워크 역할', accessor: 'networkRole', clickable: false},
    { header: Localization.kr.DESCRIPTION, accessor: 'description', clickable: false },
  ],
  HOSTS_FROM_NETWORK: [
    { header: '', accessor: "icon", clickable: false, width: DEFAULT_WIDTH_ICON_COLUMN },
    { header: Localization.kr.NAME, accessor: 'host', clickable: false, width: '10%' },
    { header: Localization.kr.CLUSTER, accessor: 'cluster', clickable: true , width: '10%'},
    { header: Localization.kr.DATA_CENTER, accessor: 'dataCenter', clickable: true },
    { header: '네트워크 장치 상태', accessor: 'networkDeviceStatus', clickable: false, width: '10%'},
    { header: '비동기', accessor: 'async', clickable: false },
    { header: '네트워크 장치', accessor: 'networkDevice', clickable: false },
    { header: Localization.kr.SPEED, accessor: 'speed', clickable: false },
    { header: Localization.kr.SPEED_RX, accessor: 'rx', clickable: false, width: '7%' },
    { header: Localization.kr.SPEED_TX, accessor: 'tx', clickable: false, width: '7%' },
    { header: Localization.kr.TOTAL_BYTE_RX, accessor: 'totalRx', clickable: false },
    { header: Localization.kr.TOTAL_BYTE_TX, accessor: 'totalTx', clickable: false },
  ],
  HOSTS_DISCONNECT_FROM_NETWORK: [
    { header: '', accessor: "icon", clickable: false, width: DEFAULT_WIDTH_ICON_COLUMN },
    { header: Localization.kr.NAME, accessor: 'name', clickable: false },
    { header: Localization.kr.CLUSTER, accessor: 'cluster', clickable: false },
    { header: Localization.kr.DATA_CENTER, accessor: 'dataCenter', clickable: false },
  ],
  VMS_FROM_NETWORK: [
    { header: '', accessor: "icon", clickable: false , width:DEFAULT_WIDTH_ICON_COLUMN },
    { header: Localization.kr.NAME, accessor: 'name', clickable: false },
    { header: Localization.kr.CLUSTER, accessor: 'cluster', clickable: false },
    { header: Localization.kr.IP_ADDRESS, accessor: 'ipAddress', clickable: false },
    { header: 'FQDN', accessor: 'fqdn', clickable: false },
    { header: `${Localization.kr.VNIC} ${Localization.kr.STATUS}`, accessor: "icon", clickable: false },
    { header: Localization.kr.VNIC, accessor: 'vnic', clickable: false },
    { header: 'vNIC Rx', accessor: 'vnicRx', clickable: false },
    { header: 'vNIC Tx', accessor: 'vnicTx', clickable: false },
    { header: Localization.kr.TOTAL_BYTE_RX, accessor: 'totalRx', clickable: false },
    { header: Localization.kr.TOTAL_BYTE_TX, accessor: 'totalTx', clickable: false },
    { header: Localization.kr.DESCRIPTION, accessor: 'description', clickable: false }
  ],
  VMS_UP_FROM_NETWORK: [
    { header: '', accessor: "icon", clickable: false , width: DEFAULT_WIDTH_ICON_COLUMN, },
    { header: Localization.kr.NAME, accessor: '_name', clickable: false },
    // { header: Localization.kr.CLUSTER, accessor: 'cluster', clickable: false },
    { header: Localization.kr.IP_ADDRESS, accessor: 'ipAddress', clickable: false }, // 스웨거 정보없음
    { header: 'FQDN', accessor: 'fqdn', clickable: false },
    { header: `${Localization.kr.VNIC} ${Localization.kr.STATUS}`, accessor: 'vnicStatus', clickable: false , width:'7%' },
    { header: Localization.kr.VNIC, accessor: 'vnic', clickable: false },
    { header: 'vNIC Rx', accessor: 'vnicRx', clickable: false },
    { header: 'vNIC Tx', accessor: 'vnicTx', clickable: false },
    { header: Localization.kr.TOTAL_BYTE_RX, accessor: 'totalRx', clickable: false },
    { header: Localization.kr.TOTAL_BYTE_TX, accessor: 'totalTx', clickable: false },
    { header: Localization.kr.DESCRIPTION, accessor: 'description', clickable: false }
  ],
  VMS_STOP_FROM_NETWORK: [
    { header: '', accessor: "icon", clickable: false, width: DEFAULT_WIDTH_ICON_COLUMN },
    { header: Localization.kr.NAME, accessor: '_name', clickable: false },
    // { header: Localization.kr.CLUSTER, accessor: 'cluster', clickable: false },
    { header: Localization.kr.IP_ADDRESS, accessor: 'ipAddress', clickable: false },
    { header: 'FQDN', accessor: 'fqdn', clickable: false },
    { header: `${Localization.kr.VNIC} ${Localization.kr.STATUS}`, accessor: 'vnicStatus', clickable: false , width:'7%'},
    { header: Localization.kr.VNIC, accessor: 'vnic', clickable: false },
    { header: Localization.kr.DESCRIPTION, accessor: 'description', clickable: false }
  ],
  TEMPLATES_FROM_NETWORK: [
    { header: Localization.kr.NAME, accessor: 'name', clickable: false },
    { header: '버전', accessor: 'ver', clickable: false },
    { header: Localization.kr.STATUS, accessor: 'status', clickable: false },
    { header: Localization.kr.CLUSTER, accessor: 'clusterName', clickable: false },
    { header: Localization.kr.VNIC, accessor: 'nicName', clickable: false },
  ],


  VNIC_PROFILES: [
    { header: Localization.kr.NAME, accessor: '_name', clickable: false },
    { header: Localization.kr.NETWORK, accessor: 'network', clickable: true },
    { header: Localization.kr.DATA_CENTER, accessor: 'dataCenter', clickable: true },
    { header: Localization.kr.NETWORK_FILTER, accessor: 'networkFilter', clickable: false },
    { header: '포트 미러링', accessor: 'portMirroring', clickable: false },
    { header: '통과', accessor: 'passThrough', clickable: false },
    { header: Localization.kr.DESCRIPTION, accessor: 'description', clickable: false },
  ],
  VMS_FROM_VNIC_PROFILES: [
    { header: Localization.kr.NAME, accessor: 'name', clickable: false },
  ],
  TEMPLATE_FROM_VNIC_PROFILES: [
    { header: Localization.kr.NAME, accessor: '_name', clickable: false },
    { header: '버전', accessor: 'versionNum', clickable: false },
  ],
  STORAGE_DOMAINS: [
    { header: Localization.kr.STATUS, accessor: "icon", width: DEFAULT_WIDTH_ICON_COLUMN },
    { header: '', accessor: 'hostedEngine', width: '3%' },
    { header: '도메인 이름', accessor: '_name', width: '10%' },
    { header: '도메인 유형', accessor: 'domainType' },
    { header: '스토리지 유형', accessor: 'storageType', width: '10%' },
    { header: '포맷', accessor: 'format' },
    { header: '데이터 센터간 상태', accessor: 'status', width: '10%' },
    { header: Localization.kr.SIZE_AVAILABLE, accessor: 'availableSize' },
    { header: Localization.kr.SIZE_USED, accessor: 'usedSize' },
    { header: Localization.kr.SIZE_TOTAL, accessor: 'diskSize' },
    { header: Localization.kr.DESCRIPTION, accessor: 'description' },
    { header: Localization.kr.COMMENT, accessor: 'comment', width: '12%' },
  ],
  
  DATACENTERS_FROM_STORAGE_DOMAIN : [
    { header: '', accessor: "icon", clickable: false, width: DEFAULT_WIDTH_ICON_COLUMN },
    { header: Localization.kr.NAME, accessor: '_name', clickable: false , width: '17%'},
    { header: '데이터 센터 내의 도메인 상태', accessor: 'domainStatus', clickable: false },
  ],
  DATACENTERS_ATTACH_FROM_STORAGE_DOMAIN : [
    { header: Localization.kr.NAME, accessor: 'name', clickable: false , width: '17%'},
    { header: '스토리지 유형', accessor: 'storageType', clickable: false },    
  ],
  TEMPLATES_FROM_STORAGE_DOMAIN: [
    { header: Localization.kr.ALIAS, accessor: '_name', clickable: false },
    { header: '디스크', accessor: 'disk', clickable: false },
    { header: Localization.kr.SIZE_VIRTUAL, accessor: 'virtualSize', clickable: false },
    { header: Localization.kr.SIZE_ACTUAL, accessor: 'actualSize', clickable: false },
    { header: Localization.kr.DATE_CREATED, accessor: 'creationTime', clickable: false },
  ],
  VMS_FROM_STORAGE_DOMAIN: [
    { header: Localization.kr.ALIAS, accessor: '_name', clickable: false },
    { header: '디스크', accessor: 'disk', clickable: false },
    { header: '스냅샷', accessor: 'snapshot', clickable: false },
    { header: Localization.kr.SIZE_VIRTUAL, accessor: 'virtualSize', clickable: false },
    { header: Localization.kr.SIZE_ACTUAL, accessor: 'actualSize', clickable: false },
    { header: Localization.kr.DATE_CREATED, accessor: 'creationTime', clickable: false },
  ],
  TARGETS_LUNS: [
    { header: 'Select', accessor: 'checkbox', clickable: true },
    { header: 'Target Name', accessor: 'target', clickable: true },
    { header: 'address', accessor: 'address', clickable: true },
    { header: 'port', accessor: 'port', clickable: true },
  ],
  LUNS_TARGETS: [
    { header: '여부', accessor: 'abled', clickable: false },
    { header: 'status', accessor: 'status', clickable: false },
    { header: 'Lun ID', accessor: 'id', clickable: false },
    { header: Localization.kr.SIZE_ACTUAL, accessor: 'size', clickable: false },
    { header: '#path', accessor: 'paths', clickable: false },
    { header: 'vendor ID', accessor: 'vendorId', clickable: false },
    { header: 'product ID', accessor: 'productId', clickable: false },
    { header: 'serial', accessor: 'serial', clickable: false },
    
    { header: 'Target Name', accessor: 'target', clickable: true },
    { header: 'address', accessor: 'address', clickable: true },
    { header: 'port', accessor: 'port', clickable: true },
  ],
  
  FIBRE: [
    { header: '', accessor: 'check', clickable: true },
    { header: 'status', accessor: 'status', clickable: false },
    { header: 'Lun ID', accessor: 'id', clickable: false },
    { header: 'size', accessor: 'size', clickable: false },
    { header: '#path', accessor: 'paths', clickable: false },
    { header: 'vendor ID', accessor: 'vendorId', clickable: false },
    { header: 'product ID', accessor: 'productId', clickable: false },
    { header: 'serial', accessor: 'serial', clickable: false },
  ],

  FIBRE_IMPORT: [
    { header: 'checkbox', accessor: 'check', clickable: true },
    { header: Localization.kr.NAME, accessor: 'name', clickable: true },
    { header: 'id', accessor: 'id', clickable: true },
  ],

//---------------------------
    // 템플릿
  
    
//------------------------------------------
  DISKS_FROM_STORAGE_DOMAIN: [
    { header: Localization.kr.ALIAS, accessor: '_alias', clickable: false , width: '16%' },
    { header: Localization.kr.IS_BOOTABLE, accessor: 'icon1', clickable: false },
    { header: Localization.kr.IS_SHARABLE, accessor: 'sharable', clickable: false },
    { header: Localization.kr.SIZE_VIRTUAL, accessor: 'virtualSize', clickable: false },
    { header: Localization.kr.SIZE_ACTUAL, accessor: 'actualSize', clickable: false },
    { header: Localization.kr.SPARSE, accessor: 'sparse', clickable: false },
    // { header: '스토리지 도메인', accessor: 'storageDomain', clickable: false },
    // { header: Localization.kr.DATE_CREATED, accessor: 'creationDate', clickable: false },
    { header: `${Localization.kr.CONNECTION} ${Localization.kr.TARGET}`, accessor: 'connect', clickable: false },
    // { header: `${Localization.kr.CONNECTION} ${Localization.kr.TARGET}(템플릿)`, accessor: 'connectTemplate', clickable: false },
    { header: Localization.kr.STATUS, accessor: 'status', clickable: false },
    { header: '유형', accessor: 'storageType', clickable: false },
    { header: Localization.kr.DESCRIPTION, accessor: 'description', clickable: false },
  ],


  DISK_SNAPSHOT_FROM_STORAGE_DOMAIN: [
    { header: Localization.kr.SIZE_ACTUAL, accessor: 'actualSize', clickable: false },
    { header: Localization.kr.DATE_CREATED, accessor: 'creationDate', clickable: false },
    { header: Localization.kr.DATE_CREATED, accessor: 'alias', clickable: false },
    { header: '디스크 별칭', accessor: 'alias', clickable: false },
    { header: `${Localization.kr.SNAPSHOT} ${Localization.kr.DESCRIPTION}`, accessor: 'description', clickable: false },
    { header: `${Localization.kr.CONNECTION} ${Localization.kr.TARGET}`, accessor: 'storageDomainVo.name', clickable: false },
    { header: Localization.kr.STATUS, accessor: 'status', clickable: false },
    { header: '디스크 스냅샷 ID', accessor: 'id', clickable: false },
  ],
  
  SNAPSHOT_INFO_FROM_VM: [
    { header: Localization.kr.NAME, accessor: 'description', clickable: false },
    { header: Localization.kr.DATE, accessor: 'date', clickable: false, width: '5%' },
    { header: Localization.kr.STATUS, accessor: 'status', clickable: false, width: '5%' },
    { header: '가상 시스템 메모리 스냅샷 생성', accessor: 'persistMemory', clickable: false },
    { header: '설정된 메모리', accessor: 'memorySize', clickable: false },
    { header: '할당할 실제 메모리', accessor: 'memoryActual', clickable: false },
  ],
  
  SNAPSHOT_DISK_FROM_VM: [
    { header: Localization.kr.STATUS, accessor: 'status', clickable: false, width: '5%' },
    { header: Localization.kr.ALIAS, accessor: 'alias', clickable: false, width: '17%' },
    { header: Localization.kr.DATE_CREATED, accessor: 'date', clickable: false },
    { header: Localization.kr.SIZE_VIRTUAL, accessor: 'provisionedSize', clickable: false },
    { header: Localization.kr.SIZE_ACTUAL, accessor: 'actualSize', clickable: false },
    { header: Localization.kr.SPARSE, accessor: 'sparse', clickable: false },
    { header: '인터페이스', accessor: 'interface_', clickable: false },
    { header: Localization.kr.DESCRIPTION, accessor: 'description', clickable: false },
    { header: '디스크 스냅샷 ID', accessor: 'imageId', clickable: false, width: '16%' },
  ],
  
  SNAPSHOT_NIC_FROM_VM: [
    { header: Localization.kr.NAME, accessor: 'name', clickable: false, width: '10%' },
    { header: `${Localization.kr.NETWORK} ${Localization.kr.NAME}`, accessor: 'networkName', clickable: false, width: '15%' },
    { header: '프로파일 이름', accessor: 'profileName', clickable: false, width: '15%' },
    { header: '유형', accessor: 'interface_', clickable: false, width: '10%' },
    { header: 'MAC', accessor: 'macAddress', clickable: false, width: '15%' },
    { header: 'Rx 속도 (Mbps)', accessor: 'rxSpeed', clickable: false, width: '10%' },
    { header: 'Tx 속도 (Mbps)', accessor: 'txSpeed', clickable: false, width: '10%' },
    { header: '중단 (Pkts)', accessor: 'txTotalError', clickable: false, width: '10%' },
  ],
  
  SNAPSHOT_APPLICATION_FROM_VM: [
    { header: '애플리케이션 이름', accessor: 'name', clickable: false, width: '10%' },
    { header: '버전', accessor: 'version', clickable: false, width: '15%' },
    { header: Localization.kr.DESCRIPTION, accessor: 'description', clickable: false, width: '15%' },
  ],

  GET_VMS_TEMPLATES: [
    { header: Localization.kr.NAME, accessor: 'name', clickable: false, width: '10%' },
    { header: Localization.kr.MEMORY, accessor: 'memory', clickable: false },
    { header: Localization.kr.CPU, accessor: Localization.kr.CPU, clickable: false },
    { header: '아키텍처', accessor: 'cpuArc', clickable: false },
    { header: '디스크', accessor: 'disk', clickable: false },
    { header: '중지 일자', accessor: 'stopTime', clickable: false },
    // { header: '내보낸 시점', accessor: 'exportedAt', clickable: false },
  ],  
  GET_DISK_TEMPLATES: [
    { header: Localization.kr.ALIAS, accessor: 'alias', clickable: true ,width:'10%'},
    { header: Localization.kr.SIZE_VIRTUAL, accessor: 'virtualSize', clickable: false },
    { header: Localization.kr.DATE_CREATED, accessor: 'creationTime', clickable: false },
    { header: Localization.kr.SPARSE, accessor: 'sparse', clickable: false },
    { header: Localization.kr.STATUS, accessor: 'status', clickable: false },
    { header: '스토리지 유형', accessor: 'storageType', clickable: false },    
    { header: Localization.kr.DATE_CREATED, accessor: 'date', clickable: false },
    { header: Localization.kr.DESCRIPTION, accessor: 'description', clickable: false },
  ],
  GET_DISKS: [
    { header: Localization.kr.ALIAS, accessor: 'alias', clickable: false },
    { header: Localization.kr.SIZE_ACTUAL, accessor: 'actualSize', clickable: false },
    { header: Localization.kr.SIZE_VIRTUAL, accessor: 'virtualSize', clickable: false },
    { header: Localization.kr.SPARSE, accessor: 'sparse', clickable: false },
    { header: Localization.kr.DATE_CREATED, accessor: 'creationTime', clickable: false },
    { header: Localization.kr.DESCRIPTION, accessor: 'description', clickable: false },
  ],  
  TEMPLATE_VMS:[
    { header: Localization.kr.STATUS, accessor: "icon", clickable: false, width: DEFAULT_WIDTH_ICON_COLUMN },
    { header: Localization.kr.NAME, accessor: 'name', clickable: true, width: '20%' },
    { header: Localization.kr.HOST, accessor: 'hostVo', clickable: true, width: '25%' },
    { header: Localization.kr.IP_ADDRESS, accessor: 'ipv4', clickable: false, width: '20%' },
    { header: 'FQDN', accessor: 'fqdn', clickable: false, width: '20%' },
    { header: Localization.kr.STATUS, accessor: 'status', clickable: false, width: '10%' },
    { header: Localization.kr.UP_TIME, accessor: 'upTime', clickable: false, width: '20%' },
    { header: Localization.kr.DESCRIPTION, accessor: 'description', clickable: false, width: '25%' },

  ],

  DISKS: [
    { header: Localization.kr.ALIAS, accessor: '_alias', clickable: true },
    { header: 'ID', accessor: 'id', clickable: false },
    // { header: Localization.kr.IS_SHARABLE, accessor: 'icon1', clickable: false },
    { header: `${Localization.kr.CONNECTION} ${Localization.kr.TARGET}`, accessor: 'connect', clickable: false },
    { header: '스토리지 도메인', accessor: 'storageDomain', clickable: false },
    { header: Localization.kr.SIZE_VIRTUAL, accessor: 'virtualSize', clickable: false },
    { header: Localization.kr.STATUS, accessor: 'status', clickable: false },
    { header: '유형', accessor: 'storageType', clickable: false },
    { header: Localization.kr.DESCRIPTION, accessor: 'description', clickable: false },
  ],
  VMS_FROM_DISK: [
    { header: '', accessor: "icon", clickable: false, width: DEFAULT_WIDTH_ICON_COLUMN },
    { header: Localization.kr.NAME, accessor: 'name', clickable: false },
    { header: Localization.kr.CLUSTER, accessor: 'cluster', clickable: false },
    { header: Localization.kr.IP_ADDRESS, accessor: 'ipAddress', clickable: false },
    { header: Localization.kr.UP_TIME, accessor: 'uptime', clickable: false },
  ],
  
  STORAGE_DOMAINS_FROM_DISK: [
    { header: '', accessor: "icon", clickable: false, width: DEFAULT_WIDTH_ICON_COLUMN  },
    { header: '도메인 이름', accessor: 'storageDomain', clickable: false },
    { header: '도메인 유형', accessor: 'domainType', clickable: false },
    { header: Localization.kr.STATUS, accessor: 'status', clickable: false },
    // { header: Localization.kr.SIZE_TOTAL, accessor: 'diskSize', clickable: false },
    { header: Localization.kr.SIZE_AVAILABLE, accessor: 'availableSize', clickable: false },
    { header: Localization.kr.SIZE_USED, accessor: 'usedSize', clickable: false },
    { header: Localization.kr.DESCRIPTION, accessor: 'description', clickable: false },
  ],

  VIRTUAL_DISK:  [
    { header: '', accessor: 'check', clickable: false, width: '5%'  },
    { header: Localization.kr.ALIAS, accessor: 'alias', clickable: true },
    { header: Localization.kr.DESCRIPTION, accessor: 'description', clickable: false },
    { header: 'ID', accessor: 'id', clickable: false },
    { header: Localization.kr.SIZE_VIRTUAL, accessor: 'virtualSize', clickable: false },
    { header: Localization.kr.SIZE_ACTUAL, accessor: 'actualSize', clickable: false },
    { header: '스토리지 도메인', accessor: 'storageDomain', clickable: false, width: '15%'  },
    { header: '인터페이스', accessor: 'interface', clickable: false },
    { header: 'R/O', accessor: 'readonly', clickable: false, width: '5%'  },
    { header: 'bootable', accessor: 'bootable', clickable: false, width: '5%'  },
    { header: 'i', accessor: 'b', clickable: false, width: '5%'  },

  ],
// ---------------------------------------------------------------


  
  LUNS: [
    { header: Localization.kr.NAME, accessor: 'name', clickable: true },
    { header: Localization.kr.STATUS, accessor: 'status', clickable: false },
    { header: Localization.kr.ROLE, accessor: 'role', clickable: false },
    { header: Localization.kr.DESCRIPTION, accessor: 'description', clickable: false }
  ],
  LUN_SIMPLE: [
    { header: Localization.kr.NAME, accessor: 'logicalName' },
    { header: Localization.kr.DESCRIPTION, accessor: 'description' },
  ],

  ALL_DISK:  [
    { header: Localization.kr.NAME, accessor: 'alias', clickable: true,width:'15%' },
    { header: 'ID', accessor: 'id', clickable: false ,width:'15%'},
    { header: '', accessor: 'icon1', clickable: false,width:'4%' },
    { header: '', accessor: 'icon2', clickable: false ,width:'4%'},
    { header: `${Localization.kr.CONNECTION} ${Localization.kr.TARGET}`, accessor: 'connectionTarget', clickable: false },
    { header: '스토리지 도메인', accessor: 'storageDomain', clickable: false },
    { header: Localization.kr.SIZE_VIRTUAL, accessor: 'virtualSize', clickable: false },
    { header: Localization.kr.STATUS, accessor: 'status', clickable: false },
    { header: '유형', accessor: 'storageType', clickable: false },
    { header: Localization.kr.DESCRIPTION, accessor: 'description', clickable: false },
  ],
  
  LUN_DISK:  [
    { header: Localization.kr.NAME, accessor: 'alias', clickable: true,width:'10%' },
    { header: 'ID', accessor: 'id', clickable: false },
    { header: '', accessor: 'icon1', clickable: false,width:'4%' },
    { header: `${Localization.kr.CONNECTION} ${Localization.kr.TARGET}`, accessor: 'connectionTarget', clickable: false },
    { header: '스토리지 도메인', accessor: 'storageDomain', clickable: false },
    { header: Localization.kr.SIZE_VIRTUAL, accessor: 'virtualSize', clickable: false },
    { header: 'LUN ID', accessor: 'lunId', clickable: false },
    { header: '시리얼', accessor: 'serial', clickable: false },
    { header: '벤더 ID', accessor: 'vendorId', clickable: false },
    { header: '제품 ID', accessor: 'productId', clickable: false },    
    { header: Localization.kr.DESCRIPTION, accessor: 'description', clickable: false },
  ],

  CLUSTER_VM:[
    { header: '아이콘', accessor: "icon", clickable: false, width: DEFAULT_WIDTH_ICON_COLUMN },
    { header: Localization.kr.NAME, accessor: 'name', clickable: false },
    { header: Localization.kr.STATUS, accessor: 'status', clickable: false },
    { header: Localization.kr.UP_TIME, accessor: 'upTime', clickable: false },
    { header: Localization.kr.CPU, accessor: Localization.kr.CPU, clickable: false },
    { header: Localization.kr.MEMORY, accessor: 'memory', clickable: false },
    { header: Localization.kr.NETWORK, accessor: 'network', clickable: false },
    { header: Localization.kr.IP_ADDRESS, accessor: 'ipv4', clickable: false },
  ],
  

  
  CLUSTERS_DATA :[
    { accessor: 'status', clickable: false,      header: Localization.kr.STATUS},
    { accessor: 'name', clickable: true,         header: Localization.kr.NAME},
    { accessor: 'comment', clickable: false,     header: Localization.kr.COMMENT},
    { accessor: 'version', clickable: false,     header: '호환 버전'},
    { accessor: 'description', clickable: false, header: Localization.kr.DESCRIPTION, },
    { accessor: 'cpuType', clickable: false,     header: `${Localization.kr.CLUSTER} ${Localization.kr.CPU} 유형`, },
    { accessor: 'hostCount', clickable: false,   header: `${Localization.kr.HOST} 수`},
    { accessor: 'vmCount', clickable: false,     header: `${Localization.kr.VM} 수`},
    { accessor: 'upgrade', clickable: false,     header: '업그레이드 상태' },

  ],
  CLUSTERS_POPUP: [
    { header: Localization.kr.NAME, accessor: 'name', clickable: false },
    { header: '모두 할당', accessor: 'allAssigned', clickable: false },
    { header: '모두 필요', accessor: 'allRequired', clickable: false },
    { header: `${Localization.kr.VM} 네트워크 관리`, accessor: 'vmNetMgmt', clickable: false, width:'16%' },
    { header: '네트워크 출력', accessor: 'networkOutput', clickable: false },
    { header: '마이그레이션 네트워크', accessor: 'migrationNetwork', clickable: false , width:'16%'},
    { header: 'Gluster 네트워크', accessor: 'glusterNetwork', clickable: false },
    { header: '기본 라우팅', accessor: 'defaultRouting', clickable: false },
  ],
  
  HOSTS_DISCONNECTION: [
    { header: '', accessor: "icon", clickable: false, width: DEFAULT_WIDTH_ICON_COLUMN },
    { header: Localization.kr.NAME, accessor: 'name', clickable: false },
    { header: Localization.kr.CLUSTER, accessor: 'cluster', clickable: false },
    { header: Localization.kr.DATA_CENTER, accessor: 'dataCenter', clickable: false },
  ],
  HOSTS_ALT: [
    { header: Localization.kr.STATUS, accessor: 'status', clickable: false },
    { header: '', accessor: 'iconWarning', clickable: false },
    { header: '', accessor: 'iconSPM', clickable: false },
    { header: Localization.kr.NAME, accessor: 'name', clickable: true },
    { header: Localization.kr.COMMENT, accessor: 'comment', clickable: false },
    { header: `${Localization.kr.HOST} 이름/IP`, accessor: 'address', clickable: false },
    { header: Localization.kr.CLUSTER, accessor: 'cluster', clickable: true }, // 클러스터 컬럼에 clickable 추가
    { header: Localization.kr.DATA_CENTER, accessor: 'dataCenter', clickable: false },
    { header: `${Localization.kr.VM} 수`, accessor: 'vmCount', clickable: false },
    { header: Localization.kr.MEMORY, accessor: 'memoryUsage', clickable: false },
    { header: Localization.kr.CPU, accessor: 'cpuUsage', clickable: false },
    { header: Localization.kr.NETWORK, accessor: 'networkUsage', clickable: false },
    { header: 'SPM', accessor: 'spmStatus', clickable: false },
  ],
  HOSTS_FROM_CLUSTER: [
    { header: '', accessor: "icon", clickable: false, width: DEFAULT_WIDTH_ICON_COLUMN },  // 이모티콘 칸
    { header: Localization.kr.NAME, accessor: 'name', clickable: false },
    { header: `${Localization.kr.HOST} 이름/IP`, accessor: 'hostNameIP', clickable: false },
    { header: Localization.kr.STATUS, accessor: 'status', clickable: false },
    { header: '불러오기', accessor: 'loading', clickable: false },
    { header: '디스플레이 주소 덮어쓰기', accessor: 'displayAddress', clickable: false }
  ],
  HOSTS_ALL_DATA: [
    { header: Localization.kr.NAME, accessor: 'name', clickable: false },
    { header: Localization.kr.COMMENT, accessor: 'comment', clickable: false },
    { header: `${Localization.kr.HOST} 이름/IP`, accessor: 'hostNameIP', clickable: false },
    { header: Localization.kr.CLUSTER, accessor: 'clusterVo', clickable: true },
    { header: Localization.kr.DATA_CENTER, accessor: 'dataCenterVo', clickable: true },
    { header: Localization.kr.STATUS, accessor: 'status', clickable: false },
    { header: Localization.kr.VM, accessor: 'vm', clickable: false },
    { header: Localization.kr.MEMORY, accessor: 'memory', clickable: false },
    { header: Localization.kr.CPU, accessor: Localization.kr.CPU, clickable: false },
    { header: Localization.kr.NETWORK, accessor: 'network', clickable: false },
    { header: 'SPM', accessor: 'spmStatus', clickable: false }
  ],
  VM_CHART:[
    { header: '', accessor: "icon", clickable: false, width: DEFAULT_WIDTH_ICON_COLUMN },  // 이모티콘 칸
    { header: Localization.kr.NAME, accessor: 'name', clickable: true },
    { header: Localization.kr.COMMENT, accessor: 'comment', clickable: false },
    { header: Localization.kr.HOST, accessor: 'hostVo', clickable: true },
    { header: Localization.kr.IP_ADDRESS, accessor: 'ipv4', clickable: false },
    { header: 'FQDN', accessor: 'fqdn', clickable: false },
    { header: Localization.kr.CLUSTER, accessor: 'clusterVo', clickable: true },
    { header: Localization.kr.STATUS, accessor: 'status', clickable: false },
    { header: Localization.kr.DATA_CENTER, accessor: 'dataCenterVo', clickable: true },
    { header: Localization.kr.MEMORY, accessor: 'memory', clickable: false },
    { header: Localization.kr.CPU, accessor: Localization.kr.CPU, clickable: false },
    { header: Localization.kr.NETWORK, accessor: 'network', clickable: false },
    { header: Localization.kr.UP_TIME, accessor: 'upTime', clickable: false },
    { header: Localization.kr.DESCRIPTION, accessor: 'description', clickable: false },
  ],
  

  VM_BRING_POPUP:[
    { header: Localization.kr.NAME, accessor: 'name', clickable: false },
  ],
  
  
  SNAPSHOT_NEW:[
    { header: '', accessor: 'check', clickable: false, width:'6%'},
    { header: Localization.kr.NAME, accessor: 'alias', clickable: false },
    { header: Localization.kr.DESCRIPTION, accessor: 'description', clickable: false }
  ],
  PERMISSIONS: [
    { header: '', accessor: "icon", clickable: false, width: DEFAULT_WIDTH_ICON_COLUMN },
    { header: Localization.kr.USER, accessor: 'user', clickable: false },
    { header: '인증 공급자', accessor: 'provider', clickable: false },
    { header: '네임스페이스', accessor: 'nameSpace', clickable: false },
    { header: Localization.kr.ROLE, accessor: 'role', clickable: false },
    { header: Localization.kr.DATE_CREATED, accessor: 'createDate', clickable: false },
    { header: 'Inherited From', accessor: 'inheritedFrom', clickable: false },
  ],
  AFFINITY_GROUP:[
    { header: Localization.kr.STATUS, accessor: 'status', clickable: false },
    { header: Localization.kr.NAME, accessor: 'name', clickable: false },
    { header: Localization.kr.DESCRIPTION, accessor: 'description', clickable: false },
    { header: '우선 순위', accessor: 'priority', clickable: false },
    { header: `${Localization.kr.VM} 측 극성`, accessor: 'vmConfig', clickable: false },
    { header: `${Localization.kr.VM} 강제 적용`, accessor: 'vmEnforce', clickable: false },
    { header: `${Localization.kr.HOST} 측 극성`, accessor: 'hostConfig', clickable: false },
    { header: `${Localization.kr.HOST} 강제 적용`, accessor: 'hostEnforce', clickable: false },
    { header: `${Localization.kr.VM} 멤버`, accessor: 'vmMember', clickable: false },
    { header: `${Localization.kr.VM} 레이블`, accessor: 'vmLabel', clickable: false },
    { header: `${Localization.kr.HOST} 멤버`, accessor: 'hostMember', clickable: false },
    { header: `${Localization.kr.HOST} 레이블`, accessor: 'hostLabel', clickable: false },
  ],
  AFFINITY_LABELS: [
    { header: Localization.kr.NAME, accessor: 'name', clickable: false },
    { header: `${Localization.kr.VM} 멤버`, accessor: 'vmMember', clickable: false },
    { header: `${Localization.kr.HOST} 멤버`, accessor: 'hostMember', clickable: false },
  ],

  EVENTS: [
    { header: Localization.kr.TIME, accessor: 'time', clickable: false, width:'140px' },
    { header: '알림', accessor: '_severity', clickable: false, width:'40px'},    
    { header: '메세지', accessor: 'description', clickable: false},
    // { header: '상관 관계 ID', accessor: 'correlationId', clickable: false },
    // // { header: '소스', accessor: 'source', clickable: false },
    // { header: '사용자 지정 이벤트 ID', accessor: 'customEventId', clickable: false }
  ],
  // 사용자
  SETTING_USER: [
    { header: '', accessor: "icon", clickable: false, width: DEFAULT_WIDTH_ICON_COLUMN },
    { header: Localization.kr.NAME, accessor: 'firstName', clickable: false },
    { header: '성', accessor: 'surName', clickable: false },
    { header: Localization.kr.USER_ID, accessor: 'username', clickable: false },
    { header: '비활성화 여부', accessor: 'isDisabled', clickable: false, width:'4%' },
    { header: '인증 공급자', accessor: 'authProvider', clickable: false },
    { header: '네임스페이스', accessor: 'namespace', clickable: false, width:'8%'  },
    { header: '이메일', accessor: 'email', clickable: false },
    { header: '가입일자', accessor: 'createDate', clickable: false },
  ],
  // 활성사용사세션
  ACTIVE_USER_SESSION: [
    { header: '세션 DB ID', accessor: 'id', clickable: false },
    { header: Localization.kr.USER_ID, accessor: 'userName', clickable: false },
    { header: '인증 공급자', accessor: 'authzName', clickable: false },
    { header: '사용자 ID', accessor: 'userId', clickable: false },
    { header: '소스 IP', accessor: 'sourceIp', clickable: false },
    { header: `세션 시작 ${Localization.kr.TIME}`, accessor: 'sessionStartTime', clickable: false },
    { header: '마지막 세션 활성', accessor: 'lastSessionActive', clickable: false },
  ],

  //설정 (역할)
  SETTING_ROLE:[
    { header: '', accessor: "icon", clickable: false, width: DEFAULT_WIDTH_ICON_COLUMN },
    { header: Localization.kr.NAME, accessor: 'name', clickable: false },
    { header: Localization.kr.DESCRIPTION, accessor: 'description', clickable: false },
  ],
  //설정(인스턴스유형)
  SETTING_INSTANCE:[
    { header: Localization.kr.NAME, accessor: 'name', clickable: false }
  ],
   //설정(시스템권한)
  SETTING_SYSTEM: [
    { header: '', accessor: "icon", clickable: false, width: DEFAULT_WIDTH_ICON_COLUMN },
    { header: Localization.kr.USER_ID, accessor: 'user', clickable: false },
    { header: '인증 공급자', accessor: 'provider', clickable: false },
    { header: '네임스페이스', accessor: 'nameSpace', clickable: false },
    { header: Localization.kr.ROLE, accessor: 'role', clickable: false }
  ],
  //설정 시스템권한 추가팝업(사용자)
  SETTING_POPUP_USER:[
    { header: Localization.kr.NAME, accessor: 'name', clickable: false },
    { header: '성', accessor: 'lastName', clickable: false },
    { header: Localization.kr.USER_ID, accessor: 'username', clickable: false },
  ],
  SETTING_LICENSING:[
    { header: '라이센스', accessor: 'license', clickable: false },
    { header: '라이센스 키', accessor: 'licenseKey', clickable: false },
    { header: '제품', accessor: 'product', clickable: false },
    { header: Localization.kr.STATUS, accessor: 'status', clickable: false },
    { header: '만료', accessor: 'expiration', clickable: false }
  ],
  SETTING_CERTIFICATES: [
    { header: 'ID', accessor: 'id', clickable: false },
    { header: Localization.kr.NAME, accessor: 'alias', clickable: true },
    { header: '주소', accessor: 'address', clickable: false },
    { header: 'D-Day', accessor: 'dday', clickable: false },
    { header: '만료일자', accessor: 'notAfter', clickable: false },
    { header: '버전', accessor: 'version', clickable: false },
  ]
}

export default TableColumnsInfo;