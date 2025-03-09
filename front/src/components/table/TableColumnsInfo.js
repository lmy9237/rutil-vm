/**
 * @name TableColumnsInfo
 * @description 테이블 컬럼 정보
 */
const TableColumnsInfo = {
  DATACENTERS: [
    { header: '', accessor: 'icon', clickable: false, width: '3%'  },
    { header: '이름', accessor: 'name', clickable: true }, 
    { header: '코멘트', accessor: 'comment', clickable: false },
    { header: '스토리지 유형', accessor: 'storageType', clickable: false },    
    { header: '상태', accessor: 'status', clickable: false },
    { header: '호스트 수', accessor: 'hostCnt', clickable: false, width: '7%'  }, 
    { header: '클러스터 수', accessor: 'clusterCnt', clickable: false, width: '7%'  }, 
    { header: '호환 버전', accessor: 'version', clickable: false, width: '7%'   },
    { header: '설명', accessor: 'description', clickable: false },
  ],
  CLUSTERS_FROM_DATACENTER: [
    { header: '이름', accessor: 'name' },
    { header: '호환 버전', accessor: 'version' },
    { header: '설명', accessor: 'description' }
  ],
  STORAGES_FROM_DATACENTER: [
    { header: '상태', accessor: 'status' },
    { header: 'crown', accessor: 'hostedEngine' },
    { header: '도메인 이름', accessor: 'name' },
    { header: '도메인 유형', accessor: 'domainType' },
    { header: '여유 공간 (GiB)', accessor: 'availableSize', clickable: false },
    { header: '사용된 공간 (GiB)', accessor: 'usedSize', clickable: false },
    { header: '전체 공간 (GiB)', accessor: 'diskSize', clickable: false },
    { header: '설명', accessor: 'description' },
  ],
  NETWORK_FROM_DATACENTER: [
    { header: '이름', accessor: 'name', clickable: true, width: '14%'},
    { header: '설명', accessor: 'description', clickable: false },
  ],

  CLUSTERS: [
    { header: '이름', accessor: 'name', clickable: true, width: '13%'},
    { header: '설명', accessor: 'description', clickable: false },
    { header: '클러스터 CPU 유형', accessor: 'cpuType', clickable: false },
    { header: '호스트 수', accessor: 'hostCnt', clickable: false, width: '8%' },
    { header: '가상 머신 수', accessor: 'vmCnt', clickable: false, width: '9%'  },
    { header: '코멘트', accessor: 'comment', clickable: false },
  ],
  NETWORK_FROM_CLUSTER: [
    { header: '이름', accessor: 'name', clickable: true, width: '18%' },
    { header: '상태', accessor: 'status', clickable: false , width: '15%' },
    { header: '역할', accessor: 'role', clickable: false },
    { header: '설명', accessor: 'description', clickable: false },
  ],

  HOSTS: [
    { header: '', accessor: 'icon', clickable: false, width: '3%' },
    { header: '', accessor: 'hostedEngine', clickable: false, width: '4%' },
    { header: '이름', accessor: 'name', clickable: true, width: '12%' },
    { header: '코멘트', accessor: 'comment', clickable: false, width: '12%' },
    { header: '호스트 이름/IP', accessor: 'address', clickable: false, width: '12%' },
    { header: '클러스터', accessor: 'cluster', clickable: true, width: '12%' },
    { header: '데이터 센터', accessor: 'dataCenter', clickable: false, width: '10%' },
    { header: '가상 머신 개수', accessor: 'vmCnt', clickable: false, width: '10%' },
    { header: '상태', accessor: 'status', clickable: false },
    { header: '메모리', accessor: 'memoryUsage', clickable: false },
    { header: 'CPU', accessor: 'cpuUsage', clickable: false },
    { header: '네트워크', accessor: 'networkUsage', clickable: false },
    { header: 'SPM', accessor: 'spmStatus', clickable: false },
  ],
  VMS_FROM_HOST: [
    { header: '', accessor: 'icon', clickable: false, width: '10%' },
    { header: '이름', accessor: 'name', clickable: true, width: '20%' },
    { header: 'IP주소', accessor: 'ipv4', clickable: false, width: '20%' },
    { header: 'FQDN', accessor: 'fqdn', clickable: false, width: '20%' },
    { header: '상태', accessor: 'status', clickable: false, width: '10%' },
    { header: '클러스터', accessor: 'cluster', clickable: true, width: '20%' },
    { header: 'Memory', accessor: 'memoryUsage', clickable: false, width: '12%' },
    { header: 'CPU', accessor: 'cpuUsage', clickable: false, width: '12%' },
    { header: 'Network', accessor: 'networkUsage', clickable: false, width: '12%' },
    { header: '업타임', accessor: 'upTime', clickable: false, width: '20%' },
  ],
  NETWORK_INTERFACE_FROM_HOST:[
    { header: '이름', accessor: 'name' }, // 인터페이스 이름
    { header: 'MAC', accessor: 'macAddress' }, // MAC 주소
    { header: 'Rx 속도 (Mbps)', accessor: 'rxSpeed' }, // Rx 속도
    { header: 'Tx 속도 (Mbps)', accessor: 'txSpeed' }, // Tx 속도
    { header: '총 Rx (바이트)', accessor: 'rxTotalSpeed' }, // 총 Rx
    { header: '총 Tx (바이트)', accessor: 'txTotalSpeed' }, // 총 Tx
    { header: 'Mbps', accessor: 'speed' }, // 총 Mbps
    { header: 'Pkts', accessor: 'pkts' } // 패킷 수
  ],
  NETWORK_FROM_HOST:[
    // { header: '', accessor: 'icon', width: '5%' }, // 아이콘
    { header: '관리되지 않음', accessor: 'bridged' }, 
    { header: 'VLAN', accessor: 'vlan' },
    { header: '네트워크 이름', accessor: 'networkName', clickable: true }, 
    { header: 'IPv4 주소', accessor: 'ipv4' }, 
    { header: 'IPv6 주소', accessor: 'ipv6' } 
  ],
  NETWORK_FROM_HOST_SLAVE:[
    { header: '이름', accessor: 'name', clickable: false },
    { header: 'MAC', accessor: 'macAddress' }, // MAC 주소
    { header: '속도', accessor: 'speed' },
    { header: 'Rx 속도 (Mbps)', accessor: 'rxSpeed' }, // Rx 속도
    { header: 'Tx 속도 (Mbps)', accessor: 'txSpeed' }, // Tx 속도
    { header: '총 Rx (바이트)', accessor: 'rxTotalSpeed' },
    { header: '총 Tx (바이트)', accessor: 'txTotalSpeed' }, 
    { header: '중단', accessor: 'txTotalError' }, 
  ],
  DEVICE_FROM_HOST: [
    { header: '이름', accessor: 'name', clickable: false },
    { header: '기능', accessor: 'capability', clickable: false },
    { header: '벤더', accessor: 'vendorName', clickable: false },
    { header: '제품', accessor: 'productName', clickable: false },
    { header: '드라이버', accessor: 'driver', clickable: false },
  ],
  VMS: [
    { header: '', accessor: 'icon', clickable: false, width: '8%' },
    { header: '이름', accessor: 'name', clickable: true, width: '20%' },
    { header: '코멘트', accessor: 'comment', clickable: false, width: '20%' },
    { header: 'IP주소', accessor: 'ipv4', clickable: false, width: '20%' },
    { header: 'FQDN', accessor: 'fqdn', clickable: false, width: '20%' },
    { header: '상태', accessor: 'status', clickable: false, width: '10%' },
    { header: '호스트', accessor: 'host', clickable: true, width: '25%' },
    { header: '클러스터', accessor: 'cluster', clickable: true, width: '20%' },
    { header: '데이터센터', accessor: 'dataCenter', clickable: true, width: '20%' },
    { header: 'Memory', accessor: 'memoryUsage', clickable: false, width: '12%' },
    { header: 'CPU', accessor: 'cpuUsage', clickable: false, width: '12%' },
    { header: 'Network', accessor: 'networkUsage', clickable: false, width: '12%' },
    { header: '업타임', accessor: 'upTime', clickable: false, width: '12%' },
    { header: '설명', accessor: 'description', clickable: false, width: '25%' }
  ],
  DISKS_FROM_VM: [
    { header: '', accessor: 'icon', clickable: false,width:'4%' },
    { header: '별칭', accessor: 'alias', clickable: true ,width:'10%'},
    { header: '부팅가능', accessor: 'bootable', clickable: false,width:'4%' },
    { header: '공유가능', accessor: 'sharable', clickable: false,width:'4%' },
    { header: '읽기전용', accessor: 'readOnly', clickable: false,width:'4%' },
    { header: '가상 크기', accessor: 'virtualSize', clickable: false },
    { header: '연결 대상', accessor: 'connectionvm', clickable: false },
    { header: '인터페이스', accessor: 'interface', clickable: false },
    { header: '논리적 이름', accessor: 'logicalName', clickable: false },
    { header: '상태', accessor: 'status', clickable: false },
    { header: '유형', accessor: 'storageType', clickable: false },
    { header: '설명', accessor: 'description', clickable: false },
  ],
  DISK_IMAGES_FROM_VM: [
    { header: '', accessor: 'icon', clickable: false,width:'4%' },
    { header: '별칭', accessor: 'alias', clickable: true ,width:'10%'},
    { header: '부팅가능', accessor: 'bootable', clickable: false,width:'4%' },
    { header: '공유가능', accessor: 'sharable', clickable: false,width:'4%' },
    { header: '읽기전용', accessor: 'readOnly', clickable: false,width:'4%' },
    { header: '가상 크기', accessor: 'virtualSize', clickable: false },
    { header: '실제 크기', accessor: 'actualSize', clickable: false },
    { header: '할당 정책', accessor: 'sparse', clickable: false },
    { header: '스토리지 도메인', accessor: 'storageDomain', clickable: false },
    { header: '스토리지 유형', accessor: 'storageType', clickable: false },
    { header: '생성 일자', accessor: 'creationDate', clickable: false },
    { header: '연결 대상', accessor: 'connectionvm', clickable: false },
    { header: '인터페이스', accessor: 'interface', clickable: false },    
    { header: '논리적 이름', accessor: 'logicalName', clickable: false },
    { header: '상태', accessor: 'status', clickable: false },
    { header: '설명', accessor: 'description', clickable: false },
  ],
  DISK_LUN_FROM_VM: [
    { header: '', accessor: 'status', clickable: false,width:'4%' },
    { header: '별칭', accessor: 'alias', clickable: true ,width:'10%'},
    { header: '부팅가능', accessor: 'bootable', clickable: false,width:'4%' },
    { header: '공유가능', accessor: '', clickable: false,width:'4%' },
    { header: '읽기전용', accessor: '', clickable: false,width:'4%' },
    { header: '가상 크기', accessor: 'virtualSize', clickable: false },
    { header: 'LUN ID', accessor: 'lunId', clickable: false },
    { header: '시리얼', accessor: 'serial', clickable: false },
    { header: '벤더 ID', accessor: 'venderId', clickable: false },
    { header: '제품 ID', accessor: 'productId', clickable: false },
    { header: '연결 대상', accessor: 'connectionvm', clickable: false },
    { header: '인터페이스', accessor: 'interface', clickable: false },    
    { header: '논리적 이름', accessor: 'logicalName', clickable: false },
    { header: '설명', accessor: 'description', clickable: false },
  ],
  APPLICATIONS_FROM_VM: [
    { header: '설치된 애플리케이션', accessor: 'name' }
  ],
  HOST_DEVICE_FROM_VM: [
    { header: '이름', accessor: 'name', clickable: false },
    { header: '기능', accessor: 'capability', clickable: false },
    { header: '벤더', accessor: 'vendorName', clickable: false },
    { header: '제품', accessor: 'productName', clickable: false },
    { header: '드라이버', accessor: 'driver', clickable: false },
    { header: '현재 사용중', accessor: 'used', clickable: false },
  ],
  TEMPLATES: [
    { header: '이름', accessor: 'name', clickable: true },
    { header: '생성일자', accessor: 'creationTime', clickable: false },
    { header: '상태', accessor: 'status', clickable: false },
    { header: '버전', accessor: 'version', clickable: false },
    { header: '코멘트', accessor: 'comment', clickable: false },
    { header: '보관', accessor: 'status', clickable: false },
    { header: '클러스터', accessor: 'cluster', clickable: true },
    { header: '데이터센터', accessor: 'dataCenter', clickable: true },
    { header: '설명', accessor: 'description', clickable: false },
  ],
  VMS_FROM_TEMPLATE:[
    { header: '', accessor: 'icon', clickable: false, width: '5%' },
    { header: '이름', accessor: 'name', clickable: true, width: '10%' },
    { header: 'IP주소', accessor: 'ipv4', clickable: false, width: '10%' },
    { header: 'FQDN', accessor: 'fqdn', clickable: false, width: '10%' },
    { header: '상태', accessor: 'status', clickable: false, width: '10%' },
    { header: '호스트', accessor: 'host', clickable: true, width: '15%' },
    { header: '업타임', accessor: 'upTime', clickable: false, width: '20%' },
    { header: '설명', accessor: 'description', clickable: false, width: '25%' },
  ],
  NICS_FROM_TEMPLATE: [
    { header: '', accessor: 'status', clickable: false, width: '7%' },
    { header: '이름', accessor: 'name', clickable: false },
    { header: '연결됨', accessor: '_plugged', clickable: true},
    { header: '네트워크 이름', accessor: 'network', clickable: false },
    { header: '프로파일 이름', accessor: 'vnicProfile', clickable: false },
    { header: '링크 상태', accessor: '_linked', clickable: false },
    { header: '유형', accessor: 'interface_', clickable: false },
  ],
  NETWORKS: [
    { header: '이름', accessor: 'name', clickable: true },
    { header: '코멘트', accessor: 'comment', clickable: false },
    { header: '데이터센터', accessor: 'datacenter', clickable: false },
    { header: '설명', accessor: 'description', clickable: false, width: '20%' },
    { header: 'VLAN 태그', accessor: 'vlan' ,clickable: false },
    { header: '레이블', accessor: 'label', clickable: false },
    { header: 'MTU', accessor: 'mtu', clickable: false },
  ],
  VNIC_PROFILES_FROM_NETWORK: [
    { header: '이름', accessor: 'name', clickable: false },
    { header: '네트워크', accessor: 'network', clickable: false },
    { header: '데이터 센터', accessor: 'dataCenter', clickable: true },
    { header: '네트워크 필터', accessor: 'networkFilter', clickable: false },
    { header: '포트 미러링', accessor: 'portMirroring', clickable: false },
    { header: '통과', accessor: 'passThrough', clickable: false },
    { header: '설명', accessor: 'description', clickable: false },
  ],
  CLUSTERS_FRON_NETWORK: [
    { header: '이름', accessor: 'name', clickable: true, width: '15%' },
    { header: '연결된 네트워크', accessor: 'connect', clickable: false, width: '9%' },
    { header: '네트워크 상태', accessor: 'status', clickable: false , width: '10%'},
    { header: '필수 네트워크', accessor: 'required', clickable: false, width: '9%' },
    { header: '네트워크 역할', accessor: 'networkRole', clickable: false},
    { header: '설명', accessor: 'description', clickable: false },
  ],
  HOSTS_FROM_NETWORK: [
    { header: '', accessor: 'icon', clickable: false, width: '5%' },
    { header: '이름', accessor: 'host', clickable: false, width: '10%' },
    { header: '클러스터', accessor: 'cluster', clickable: true , width: '10%'},
    { header: '데이터 센터', accessor: 'dataCenter', clickable: true },
    { header: '네트워크 장치 상태', accessor: 'networkDeviceStatus', clickable: false, width: '10%'},
    { header: '비동기', accessor: 'async', clickable: false },
    { header: '네트워크 장치', accessor: 'networkDevice', clickable: false },
    { header: '속도', accessor: 'speed', clickable: false },
    { header: 'Rx(Mbps)', accessor: 'rx', clickable: false, width: '7%' },
    { header: 'Tx(Mbps)', accessor: 'tx', clickable: false, width: '7%' },
    { header: '총 Rx(byte)', accessor: 'totalRx', clickable: false },
    { header: '총 Tx(byte)', accessor: 'totalTx', clickable: false },
  ],
  HOSTS_DISCONNECT_FROM_NETWORK: [
    { header: '이름', accessor: 'name', clickable: false },
    { header: '클러스터', accessor: 'cluster', clickable: false },
    { header: '데이터 센터', accessor: 'dataCenter', clickable: false },
  ],

  VMS_FROM_NETWORK: [
    { header: '이름', accessor: 'name', clickable: false },
    { header: '클러스터', accessor: 'cluster', clickable: false },
    { header: 'IP 주소', accessor: 'ipAddress', clickable: false },
    { header: 'FQDN', accessor: 'fqdn', clickable: false },
    { header: 'vNIC 상태', accessor: 'icon', clickable: false },
    { header: 'vNIC', accessor: 'vnic', clickable: false },
    { header: 'vNIC Rx', accessor: 'vnicRx', clickable: false },
    { header: 'vNIC Tx', accessor: 'vnicTx', clickable: false },
    { header: '총 Rx', accessor: 'totalRx', clickable: false },
    { header: '총 Tx', accessor: 'totalTx', clickable: false },
    { header: '설명', accessor: 'description', clickable: false }
  ],
  TEMPLATES_FROM_NETWORK: [
    { header: '이름', accessor: 'name', clickable: false },
    { header: '버전', accessor: 'ver', clickable: false },
    { header: '상태', accessor: 'status', clickable: false },
    { header: '클러스터', accessor: 'clusterName', clickable: false },
    { header: 'vNic', accessor: 'nicName', clickable: false },
  ],

  VNIC_PROFILES: [
    { header: '이름', accessor: 'name', clickable: false },
    { header: '네트워크', accessor: 'network', clickable: true },
    { header: '데이터 센터', accessor: 'dataCenter', clickable: true },
    { header: '네트워크 필터', accessor: 'networkFilter', clickable: false },
    { header: '포트 미러링', accessor: 'portMirroring', clickable: false },
    { header: '통과', accessor: 'passThrough', clickable: false },
    { header: '설명', accessor: 'description', clickable: false },
  ],
  VMS_FROM_VNIC_PROFILES: [
    { header: '이름', accessor: 'name', clickable: false },
  ],
  TEMPLATE_FROM_VNIC_PROFILES: [
    { header: '이름', accessor: 'name', clickable: false },
    { header: '버전', accessor: 'versionNum', clickable: false },
  ],
  STORAGE_DOMAINS: [
    { header: '상태', accessor: 'icon', width: '4%' },
    { header: '', accessor: 'hostedEngine', width: '3%' },
    { header: '도메인 이름', accessor: 'name', width: '10%' },
    { header: '도메인 유형', accessor: 'domainType' },
    { header: '스토리지 유형', accessor: 'storageType', width: '10%' },
    { header: '포맷', accessor: 'format' },
    { header: '데이터 센터간 상태', accessor: 'status', width: '10%' },
    { header: '여유 공간', accessor: 'availableSize' },
    { header: '사용된 공간', accessor: 'usedSize' },
    { header: '전체 공간', accessor: 'diskSize' },
    { header: '설명', accessor: 'description' },
    { header: '코멘트', accessor: 'comment', width: '12%' },
  ],
  
  DATACENTERS_FROM_STORAGE_DOMAIN : [
    { header: '', accessor: 'icon', clickable: false, width: '4%' },
    { header: '이름', accessor: 'name', clickable: false , width: '17%'},
    { header: '데이터 센터 내의 도메인 상태', accessor: 'domainStatus', clickable: false },
  ],
  DATACENTERS_ATTACH_FROM_STORAGE_DOMAIN : [
    { header: '이름', accessor: 'name', clickable: false , width: '17%'},
    { header: '스토리지 유형', accessor: 'storageType', clickable: false },    
  ],
  TEMPLATES_FROM_STORAGE_DOMAIN: [
    { header: '별칭', accessor: 'name', clickable: false },
    { header: '디스크', accessor: 'disk', clickable: false },
    { header: '가상 크기', accessor: 'virtualSize', clickable: false },
    { header: '실제 크기', accessor: 'actualSize', clickable: false },
    { header: '생성 일자', accessor: 'creationTime', clickable: false },
  ],
  VMS_FROM_STORAGE_DOMAIN: [
    { header: '별칭', accessor: 'name', clickable: false },
    { header: '디스크', accessor: 'disk', clickable: false },
    { header: '가상 크기', accessor: 'virtualSize', clickable: false },
    { header: '실제 크기', accessor: 'actualSize', clickable: false },
    { header: '생성 일자', accessor: 'creationTime', clickable: false },
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
    { header: 'size', accessor: 'size', clickable: false },
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
    { header: 'name', accessor: 'name', clickable: true },
    { header: 'id', accessor: 'id', clickable: true },
  ],

//---------------------------
    // 템플릿
  
    
//------------------------------------------
  DISKS_FROM_STORAGE_DOMAIN: [
    { header: '별칭', accessor: 'alias', clickable: false , width: '16%' },
    { header: '부팅가능', accessor: 'icon1', clickable: false },
    { header: '공유가능', accessor: 'sharable', clickable: false },
    { header: '가상 크기', accessor: 'virtualSize', clickable: false },
    { header: '실제 크기', accessor: 'actualSize', clickable: false },
    { header: '할당 정책', accessor: 'sparse', clickable: false },
    // { header: '스토리지 도메인', accessor: 'storageDomain', clickable: false },
    // { header: '생성 일자', accessor: 'creationDate', clickable: false },
    { header: '연결 대상', accessor: 'connect', clickable: false },
    // { header: '연결 대상(템플릿)', accessor: 'connectTemplate', clickable: false },
    { header: '상태', accessor: 'status', clickable: false },
    { header: '유형', accessor: 'storageType', clickable: false },
    { header: '설명', accessor: 'description', clickable: false },
  ],


  DISK_SNAPSHOT_FROM_STORAGE_DOMAIN: [
    { header: '크기', accessor: 'actualSize', clickable: false },
    { header: '생성 일자', accessor: 'creationDate', clickable: false },
    { header: '스냅샷 생성일', accessor: 'alias', clickable: false },
    { header: '디스크 별칭', accessor: 'alias', clickable: false },
    { header: '스냅샷 설명', accessor: 'description', clickable: false },
    { header: '연결 대상', accessor: 'storageDomainVo.name', clickable: false },
    { header: '상태', accessor: 'status', clickable: false },
    { header: '디스크 스냅샷 ID', accessor: 'id', clickable: false },
  ],
  
  SNAPSHOT_INFO_FROM_VM: [
    { header: '날짜', accessor: 'date', clickable: false, width: '5%' },
    { header: '상태', accessor: 'status', clickable: false, width: '5%' },
    { header: '메모리', accessor: 'memorySize', clickable: false },
    { header: '설명', accessor: 'description', clickable: false },
    { header: '설정된 메모리', accessor: 'memorySize', clickable: false },
    { header: '할당할 실제 메모리', accessor: 'memoryActual', clickable: false },
    { header: 'CPU 코어 수', accessor: 'cpuCore', clickable: false },
  ],
  
  SNAPSHOT_DISK_FROM_VM: [
    { header: '상태', accessor: 'status', clickable: false, width: '5%' },
    { header: '별칭', accessor: 'alias', clickable: false, width: '17%' },
    { header: '생성 일자', accessor: 'date', clickable: false },
    { header: '가상 크기', accessor: 'provisionedSize', clickable: false },
    { header: '실제 크기', accessor: 'actualSize', clickable: false },
    { header: '할당 정책', accessor: 'sparse', clickable: false },
    { header: '인터페이스', accessor: 'interface', clickable: false },
    { header: '설명', accessor: 'description', clickable: false },
    { header: '디스크 스냅샷 ID', accessor: 'id', clickable: false, width: '16%' },
  ],
  
  SNAPSHOT_NIC_FROM_VM: [
    { header: '이름', accessor: 'name', clickable: false, width: '10%' },
    { header: '네트워크 이름', accessor: 'networkName', clickable: false, width: '15%' },
    { header: '프로파일 이름', accessor: 'profileName', clickable: false, width: '15%' },
    { header: '유형', accessor: 'interface', clickable: false, width: '10%' },
    { header: 'MAC', accessor: 'macAddress', clickable: false, width: '15%' },
    { header: 'Rx 속도 (Mbps)', accessor: 'rxSpeed', clickable: false, width: '10%' },
    { header: 'Tx 속도 (Mbps)', accessor: 'txSpeed', clickable: false, width: '10%' },
    { header: '중단 (Pkts)', accessor: 'rxTotalError', clickable: false, width: '10%' },
  ],
  
  SNAPSHOT_APPLICATION_FROM_VM: [
    { header: '애플리케이션 이름', accessor: 'name', clickable: false, width: '10%' },
    { header: '버전', accessor: 'version', clickable: false, width: '15%' },
    { header: '설명', accessor: 'description', clickable: false, width: '15%' },
  ],

  GET_VMS_TEMPLATES: [
    { header: '이름', accessor: 'name', clickable: false, width: '10%' },
    { header: '메모리', accessor: 'memory', clickable: false },
    { header: 'CPU', accessor: 'cpu', clickable: false },
    { header: '아키텍처', accessor: 'cpuArc', clickable: false },
    { header: '디스크', accessor: 'disk', clickable: false },
    { header: '중지 일자', accessor: 'stopTime', clickable: false },
    // { header: '내보낸 시점', accessor: 'exportedAt', clickable: false },
  ],  
  GET_DISK_TEMPLATES: [
    { header: '별칭', accessor: 'alias', clickable: true ,width:'10%'},
    { header: '가상 크기', accessor: 'virtualSize', clickable: false },
    { header: '생성 일자', accessor: 'creationTime', clickable: false },
    { header: '할당 정책', accessor: 'sparse', clickable: false },
    { header: '상태', accessor: 'status', clickable: false },
    { header: '스토리지 유형', accessor: 'storageType', clickable: false },    
    { header: '생성 일자', accessor: 'date', clickable: false },
    { header: '설명', accessor: 'description', clickable: false },
  ],
  GET_DISKS: [
    { header: '별칭', accessor: 'alias', clickable: false },
    { header: '실제 크기', accessor: 'actualSize', clickable: false },
    { header: '가상 크기', accessor: 'virtualSize', clickable: false },
    { header: '할당 정책', accessor: 'sparse', clickable: false },
    { header: '생성 일자', accessor: 'creationTime', clickable: false },
    { header: '설명', accessor: 'description', clickable: false },
  ],  
  TEMPLATE_VMS:[
    { header: '상태', accessor: 'icon', clickable: false, width: '5%' },
    { header: '이름', accessor: 'name', clickable: true, width: '20%' },
    { header: '호스트', accessor: 'hostVo', clickable: true, width: '25%' },
    { header: 'IP주소', accessor: 'ipv4', clickable: false, width: '20%' },
    { header: 'FQDN', accessor: 'fqdn', clickable: false, width: '20%' },
    { header: '상태', accessor: 'status', clickable: false, width: '10%' },
    { header: '업타임', accessor: 'upTime', clickable: false, width: '20%' },
    { header: '설명', accessor: 'description', clickable: false, width: '25%' },

  ],

  DISKS: [
    { header: '별칭', accessor: 'alias', clickable: true },
    { header: 'ID', accessor: 'id', clickable: false },
    // { header: '공유가능', accessor: 'icon1', clickable: false },
    { header: '연결 대상', accessor: 'connect', clickable: false },
    { header: '스토리지 도메인', accessor: 'storageDomain', clickable: false },
    { header: '가상 크기', accessor: 'virtualSize', clickable: false },
    { header: '상태', accessor: 'status', clickable: false },
    { header: '유형', accessor: 'storageType', clickable: false },
    { header: '설명', accessor: 'description', clickable: false },
  ],
  VMS_FROM_DISK: [
    { header: '', accessor: 'icon', clickable: false, width: '5%' },
    { header: '이름', accessor: 'name', clickable: false },
    { header: '클러스터', accessor: 'cluster', clickable: false },
    { header: 'IP 주소', accessor: 'ipAddress', clickable: false },
    { header: 'FQDN', accessor: 'fqdn', clickable: false },
    { header: 'Memory', accessor: 'memoryUsage', clickable: false, width: '12%' },
    { header: 'CPU', accessor: 'cpuUsage', clickable: false, width: '12%' },
    { header: 'Network', accessor: 'networkUsage', clickable: false, width: '12%' },
    { header: '상태', accessor: 'status', clickable: false },
    { header: '업타임', accessor: 'uptime', clickable: false },
  ],
  
  STORAGE_DOMAINS_FROM_DISK: [
    { header: '', accessor: 'icon', clickable: false, width: '5%'  },
    { header: '도메인 이름', accessor: 'storageDomain', clickable: false },
    { header: '도메인 유형', accessor: 'domainType', clickable: false },
    { header: '상태', accessor: 'status', clickable: false },
    // { header: '전체 공간', accessor: 'diskSize', clickable: false },
    { header: '여유 공간', accessor: 'availableSize', clickable: false },
    { header: '사용된 공간', accessor: 'usedSize', clickable: false },
    { header: '설명', accessor: 'description', clickable: false },
  ],

  VIRTUAL_DISK:  [
    { header: '', accessor: 'check', clickable: false, width: '5%'  },
    { header: '별칭', accessor: 'alias', clickable: true },
    { header: '설명', accessor: 'description', clickable: false },
    { header: 'ID', accessor: 'id', clickable: false },
    { header: '가상 크기', accessor: 'virtualSize', clickable: false },
    { header: '실제 크기', accessor: 'actualSize', clickable: false },
    { header: '스토리지 도메인', accessor: 'storageDomain', clickable: false, width: '15%'  },
    { header: '인터페이스', accessor: 'interface', clickable: false },
    { header: 'R/O', accessor: 'readonly', clickable: false, width: '5%'  },
    { header: 'bootable', accessor: 'bootable', clickable: false, width: '5%'  },
    { header: 'i', accessor: 'b', clickable: false, width: '5%'  },

  ],
// ---------------------------------------------------------------


  
  LUNS: [
    { header: '이름', accessor: 'name', clickable: true },
    { header: '상태', accessor: 'status', clickable: false },
    { header: '역할', accessor: 'role', clickable: false },
    { header: '설명', accessor: 'description', clickable: false }
  ],
  LUN_SIMPLE: [
    { header: '이름', accessor: 'logicalName' },
    { header: '설명', accessor: 'description' },
  ],

  ALL_DISK:  [
    { header: '이름', accessor: 'alias', clickable: true,width:'15%' },
    { header: 'ID', accessor: 'id', clickable: false ,width:'15%'},
    { header: '', accessor: 'icon1', clickable: false,width:'4%' },
    { header: '', accessor: 'icon2', clickable: false ,width:'4%'},
    { header: '연결 대상', accessor: 'connectionTarget', clickable: false },
    { header: '스토리지 도메인', accessor: 'storageDomain', clickable: false },
    { header: '가상 크기', accessor: 'virtualSize', clickable: false },
    { header: '상태', accessor: 'status', clickable: false },
    { header: '유형', accessor: 'storageType', clickable: false },
    { header: '설명', accessor: 'description', clickable: false },
  ],
  
  LUN_DISK:  [
    { header: '이름', accessor: 'alias', clickable: true,width:'10%' },
    { header: 'ID', accessor: 'id', clickable: false },
    { header: '', accessor: 'icon1', clickable: false,width:'4%' },
    { header: '연결 대상', accessor: 'connectionTarget', clickable: false },
    { header: '스토리지 도메인', accessor: 'storageDomain', clickable: false },
    { header: '가상 크기', accessor: 'virtualSize', clickable: false },
    { header: 'LUN ID', accessor: 'lunId', clickable: false },
    { header: '시리얼', accessor: 'serial', clickable: false },
    { header: '벤더 ID', accessor: 'vendorId', clickable: false },
    { header: '제품 ID', accessor: 'productId', clickable: false },    
    { header: '설명', accessor: 'description', clickable: false },
  ],

  
 
  
  CLUSTER_VM:[
    { header: '아이콘', accessor: 'icon', clickable: false },
    { header: '이름', accessor: 'name', clickable: false },
    { header: '상태', accessor: 'status', clickable: false },
    { header: '업타임', accessor: 'upTime', clickable: false },
    { header: 'CPU', accessor: 'cpu', clickable: false },
    { header: '메모리', accessor: 'memory', clickable: false },
    { header: '네트워크', accessor: 'network', clickable: false },
    { header: 'IP 주소', accessor: 'ipv4', clickable: false },
  ],
  

  
  CLUSTERS_DATA :[
    { header: '상태', accessor: 'status', clickable: false },
    { header: '이름', accessor: 'name', clickable: true },
    { header: '코멘트', accessor: 'comment', clickable: false },
    { header: '호환 버전', accessor: 'version', clickable: false },
    { header: '설명', accessor: 'description', clickable: false },
    { header: '클러스터 CPU 유형', accessor: 'cpuType', clickable: false },
    { header: '호스트 수', accessor: 'hostCount', clickable: false },
    { header: '가상 머신 수', accessor: 'vmCount', clickable: false },
    { header: '업그레이드 상태', accessor: 'upgrade', clickable: false },

  ],
  CLUSTERS_POPUP: [
    { header: '이름', accessor: 'name', clickable: false },
    { header: '모두 할당', accessor: 'allAssigned', clickable: false },
    { header: '모두 필요', accessor: 'allRequired', clickable: false },
    { header: '가상 머신 네트워크 관리', accessor: 'vmNetMgmt', clickable: false, width:'16%' },
    { header: '네트워크 출력', accessor: 'networkOutput', clickable: false },
    { header: '마이그레이션 네트워크', accessor: 'migrationNetwork', clickable: false , width:'16%'},
    { header: 'Gluster 네트워크', accessor: 'glusterNetwork', clickable: false },
    { header: '기본 라우팅', accessor: 'defaultRouting', clickable: false },
  ],
  

  
  HOSTS_DISCONNECTION: [
    { header: '', accessor: 'icon', clickable: false },
    { header: '이름', accessor: 'name', clickable: false },
    { header: '클러스터', accessor: 'cluster', clickable: false },
    { header: '데이터 센터', accessor: 'dataCenter', clickable: false },
  ],
  HOSTS_ALT: [
    { header: '상태', accessor: 'status', clickable: false },
    { header: '', accessor: 'iconWarning', clickable: false },
    { header: '', accessor: 'iconSPM', clickable: false },
    { header: '이름', accessor: 'name', clickable: true },
    { header: '코멘트', accessor: 'comment', clickable: false },
    { header: '호스트 이름/IP', accessor: 'address', clickable: false },
    { header: '클러스터', accessor: 'cluster', clickable: true }, // 클러스터 컬럼에 clickable 추가
    { header: '데이터 센터', accessor: 'dataCenter', clickable: false },
    { header: '가상 머신', accessor: 'vmCount', clickable: false },
    { header: '메모리', accessor: 'memoryUsage', clickable: false },
    { header: 'CPU', accessor: 'cpuUsage', clickable: false },
    { header: '네트워크', accessor: 'networkUsage', clickable: false },
    { header: 'SPM', accessor: 'spmStatus', clickable: false },
  ],
  HOSTS_FROM_CLUSTER: [
    { header: '', accessor: 'icon', clickable: false },  // 이모티콘 칸
    { header: '이름', accessor: 'name', clickable: false },
    { header: '호스트이름/IP', accessor: 'hostNameIP', clickable: false },
    { header: '상태', accessor: 'status', clickable: false },
    { header: '불러오기', accessor: 'loading', clickable: false },
    { header: '디스플레이 주소 덮어쓰기', accessor: 'displayAddress', clickable: false }
  ],
  HOSTS_ALL_DATA: [
    { header: '이름', accessor: 'name', clickable: false },
    { header: '코멘트', accessor: 'comment', clickable: false },
    { header: '호스트이름/IP', accessor: 'hostNameIP', clickable: false },
    { header: '클러스터', accessor: 'clusterVo', clickable: true },
    { header: '데이터센터', accessor: 'dataCenterVo', clickable: true },
    { header: '상태', accessor: 'status', clickable: false },
    { header: '가상머신', accessor: 'vm', clickable: false },
    { header: '메모리', accessor: 'memory', clickable: false },
    { header: 'CPU', accessor: 'cpu', clickable: false },
    { header: '네트워크', accessor: 'network', clickable: false },
    { header: 'SPM', accessor: 'spmStatus', clickable: false }
  ],
  VM_CHART:[
    { header: '', accessor: 'icon', clickable: false },  // 이모티콘 칸
    { header: '이름', accessor: 'name', clickable: true },
    { header: '코멘트', accessor: 'comment', clickable: false },
    { header: '호스트', accessor: 'hostVo', clickable: true },
    { header: 'IP주소', accessor: 'ipv4', clickable: false },
    { header: 'FQDN', accessor: 'fqdn', clickable: false },
    { header: '클러스터', accessor: 'clusterVo', clickable: true },
    { header: '상태', accessor: 'status', clickable: false },
    { header: '데이터센터', accessor: 'dataCenterVo', clickable: true },
    { header: '메모리', accessor: 'memory', clickable: false },
    { header: 'CPU', accessor: 'cpu', clickable: false },
    { header: '네트워크', accessor: 'network', clickable: false },
    { header: '업타임', accessor: 'upTime', clickable: false },
    { header: '설명', accessor: 'description', clickable: false },
  ],
  

  
  VMS_NIC: [
    { header: '', accessor: 'icon', clickable: false , width:'3%' },
    { header: '이름', accessor: 'name', clickable: false },
    { header: '클러스터', accessor: 'cluster', clickable: false },
    { header: 'IP 주소', accessor: 'ipAddress', clickable: false }, // 스웨거 정보없음
    { header: 'FQDN', accessor: 'fqdn', clickable: false },
    { header: 'vNIC 상태', accessor: 'vnicStatus', clickable: false , width:'7%' },
    { header: 'vNIC', accessor: 'vnic', clickable: false },
    { header: 'vNIC Rx', accessor: 'vnicRx', clickable: false },
    { header: 'vNIC Tx', accessor: 'vnicTx', clickable: false },
    { header: '총 Rx', accessor: 'totalRx', clickable: false },
    { header: '총 Tx', accessor: 'totalTx', clickable: false },
    { header: '설명', accessor: 'description', clickable: false }
  ],
  VM_BRING_POPUP:[
    { header: '이름', accessor: 'name', clickable: false },
  ],
  VMS_STOP: [
    { header: '', accessor: 'icon', clickable: false, width:'3%' },
    { header: '이름', accessor: 'name', clickable: false },
    { header: '클러스터', accessor: 'cluster', clickable: false },
    { header: 'IP 주소', accessor: 'ipAddress', clickable: false },
    { header: 'FQDN', accessor: 'fqdn', clickable: false },
    { header: 'vNIC 상태', accessor: 'vnicStatus', clickable: false , width:'7%'},
    { header: 'vNIC', accessor: 'vnic', clickable: false },
    { header: '설명', accessor: 'description', clickable: false }
  ],
  
  SNAPSHOT_NEW:[
    { header: '', accessor: 'snapshot_check', clickable: false, width:'6%'},
    { header: '이름', accessor: 'alias', clickable: false },
    { header: '설명', accessor: 'description', clickable: false }
  ],
  PERMISSIONS: [
    { header: '', accessor: 'icon', clickable: false },
    { header: '사용자', accessor: 'user', clickable: false },
    { header: '인증 공급자', accessor: 'provider', clickable: false },
    { header: '네임스페이스', accessor: 'nameSpace', clickable: false },
    { header: '역할', accessor: 'role', clickable: false },
    { header: '생성일', accessor: 'createDate', clickable: false },
    { header: 'Inherited From', accessor: 'inheritedFrom', clickable: false },
  ],
  AFFINITY_GROUP:[
    { header: '상태', accessor: 'status', clickable: false },
    { header: '이름', accessor: 'name', clickable: false },
    { header: '설명', accessor: 'description', clickable: false },
    { header: '우선 순위', accessor: 'priority', clickable: false },
    { header: '가상 머신 측 극성', accessor: 'vmConfig', clickable: false },
    { header: '가상 머신 강제 적용', accessor: 'vmEnforce', clickable: false },
    { header: '호스트 측 극성', accessor: 'hostConfig', clickable: false },
    { header: '호스트 강제 적용', accessor: 'hostEnforce', clickable: false },
    { header: '가상머신 멤버', accessor: 'vmMember', clickable: false },
    { header: '가상 머신 레이블', accessor: 'vmLabel', clickable: false },
    { header: '호스트 멤버', accessor: 'hostMember', clickable: false },
    { header: '호스트 레이블', accessor: 'hostLabel', clickable: false },
  ],
  AFFINITY_LABELS: [
    { header: '이름', accessor: 'name', clickable: false },
    { header: '가상머신 멤버', accessor: 'vmMember', clickable: false },
    { header: '호스트 멤버', accessor: 'hostMember', clickable: false },
  ],

  EVENTS: [
    { header: '시간', accessor: 'time', clickable: false, width:'14%' },
    { header: '알림', accessor: 'severity', clickable: false, width:'6%'},    
    { header: '메세지', accessor: 'description', clickable: false},
    // { header: '상관 관계 ID', accessor: 'correlationId', clickable: false },
    // // { header: '소스', accessor: 'source', clickable: false },
    // { header: '사용자 지정 이벤트 ID', accessor: 'customEventId', clickable: false }
  ],
  // 사용자
  SETTING_USER: [
    { header: '', accessor: 'icon', clickable: false, width:'16px' },
    { header: '이름', accessor: 'firstName', clickable: false },
    { header: '성', accessor: 'surName', clickable: false },
    { header: '사용자 이름', accessor: 'username', clickable: false },
    { header: '비활성화 여부', accessor: 'isDisabled', clickable: false, width:'4%' },
    { header: '인증 공급자', accessor: 'authProvider', clickable: false },
    { header: '네임스페이스', accessor: 'namespace', clickable: false, width:'8%'  },
    { header: '이메일', accessor: 'email', clickable: false },
    { header: '가입일자', accessor: 'createDate', clickable: false },
  ],
  // 활성사용사세션
  ACTIVE_USER_SESSION: [
    { header: '세션 DB ID', accessor: 'id', clickable: false },
    { header: '사용자 이름', accessor: 'userName', clickable: false },
    { header: '인증 공급자', accessor: 'authzName', clickable: false },
    { header: '사용자 ID', accessor: 'userId', clickable: false },
    { header: '소스 IP', accessor: 'sourceIp', clickable: false },
    { header: '세션 시작 시간', accessor: 'sessionStartTime', clickable: false },
    { header: '마지막 세션 활성', accessor: 'lastSessionActive', clickable: false },
  ],

  //설정 (역할)
  SETTING_ROLE:[
    { header: '', accessor: 'icon', clickable: false },
    { header: '이름', accessor: 'name', clickable: false },
    { header: '설명', accessor: 'description', clickable: false },
   
  ],
  //설정(인스턴스유형)
  SETTING_INSTANCE:[
    { header: '이름', accessor: 'name', clickable: false }
  ],
   //설정(시스템권한)
  SETTING_SYSTEM: [
    { header: '', accessor: 'icon', clickable: false },
    { header: '사용자', accessor: 'user', clickable: false },
    { header: '인증 공급자', accessor: 'provider', clickable: false },
    { header: '네임스페이스', accessor: 'nameSpace', clickable: false },
    { header: '역할', accessor: 'role', clickable: false }
  ],
  //설정 시스템권한 추가팝업(사용자)
  SETTING_POPUP_USER:[
    { header: '이름', accessor: 'name', clickable: false },
    { header: '성', accessor: 'lastName', clickable: false },
    { header: '사용자 이름', accessor: 'username', clickable: false },
  ],
  SETTING_LICENSING:[
    { header: '라이센스', accessor: 'license', clickable: false },
    { header: '라이센스 키', accessor: 'licenseKey', clickable: false },
    { header: '제품', accessor: 'product', clickable: false },
    { header: '상태', accessor: 'status', clickable: false },
    { header: '만료', accessor: 'expiration', clickable: false }
  ],
  SETTING_CERTIFICATES: [
    { header: 'ID', accessor: 'id', clickable: false },
    { header: '이름', accessor: 'alias', clickable: true },
    { header: '주소', accessor: 'address', clickable: false },
    { header: 'D-Day', accessor: 'dday', clickable: false },
    { header: '만료일자', accessor: 'notAfter', clickable: false },
    { header: '버전', accessor: 'version', clickable: false },
  ]
}

export default TableColumnsInfo;