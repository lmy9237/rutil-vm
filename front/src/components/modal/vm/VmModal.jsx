// import { useState, useEffect } from "react";
// import Modal from "react-modal";
// import toast from "react-hot-toast";
// import { Tooltip } from "react-tooltip";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faTimes,
//   faInfoCircle,
//   faChevronCircleRight,
// } from "@fortawesome/free-solid-svg-icons";
// import {
//   useAddDisksFromVM,
//   useAddVm,
//   useAllnicFromVM,
//   useAllTemplates,
//   useAllVMs,
//   useCDFromDataCenter,
//   useClustersFromDataCenter,
//   useDiskById,
//   useDisksFromVM,
//   useEditVm,
//   useHostFromCluster,
//   useNetworkInterfaceFromVM,
//   useVmById,
// } from "../../../api/RQHook";
// import VmConnectionPlusModal from "./VmDiskConnectionModal";
// import DiskModal from "../../../storage/disk/modal/DiskModal";
// import "./MVm.css";

// const VmModal = ({
//   isOpen,
//   editMode = false,
//   vmdata,
//   vmId,
//   selectedVm,
//   onDiskSelection,
//   onClose,
// }) => {
//   // 일반
//   const [id, setId] = useState("");
//   const [clusterVoName, setClusterVoName] = useState(""); // 클러스터이름
//   const [clusterVoId, setClusterVoId] = useState();
//   const [name, setName] = useState("");
//   const [comment, setComment] = useState("");
//   const [dataCenterId, setDataCenterId] = useState("");
//   const [clusters, setClusters] = useState([]);
//   const [description, setDescription] = useState("");
//   const [stateless, setStateless] = useState(false); // 무상태
//   const [startPaused, setStartPaused] = useState(false); // 일시중지상태로시작
//   const [deleteProtected, setDeleteProtected] = useState(false); //삭제보호
//   const [templateId, setTemplateId] = useState("");
//   const [templateName, setTemplateName] = useState("");

//   //시스템
//   const [memorySize, setMemorySize] = useState(1024);
//   const [maxMemory, setMaxMemory] = useState(1024);
//   const [allocatedMemory, setAllocatedMemory] = useState(1024);
//   const [cpuTopologyCnt, setCpuTopologyCnt] = useState(1); //총cpu
//   const [cpuTopologyCore, setCpuTopologyCore] = useState(1); // 가상 소켓 당 코어
//   const [cpuTopologySocket, setCpuTopologySocket] = useState(1); // 가상소켓
//   const [cpuTopologyThread, setCpuTopologyThread] = useState(1); //코어당 스레드

//   // 초기실행
//   const [cloudInit, setCloudInit] = useState(false); // Cloud-lnit
//   const [script, setScript] = useState(""); // 스크립트

//   // 호스트
//   const [isSpecificHostSelected, setIsSpecificHostSelected] = useState(false); // 클러스터 호스트 라디오버튼클릭
//   const [migrationMode, setMigrationMode] = useState(""); // 마이그레이션 모드
//   const [migrationPolicy, setMigrationPolicy] = useState(""); // 마이그레이션 정책
//   const [hostsFromCluster, setHostsFromCluster] = useState([]); // 호스트 목록

//   // 고가용성
//   const [ha, setHa] = useState(false); // 고가용성(체크박스)
//   const [priority, setPriority] = useState(1); // 초기값

//   // 부트옵션
//   const [firstDevice, setFirstDevice] = useState("hd"); // 첫번째 장치
//   const [secDevice, setSecDevice] = useState(""); // 두번째 장치
//   const [connVoId, setConnVoId] = useState(""); // CD/DVD연결
//   const [connVoName, setConnVoName] = useState("");
//   const [bootingMenu, setBootingMenu] = useState(false); // 부팅메뉴 활성화

//   const { mutate: addVM } = useAddVm();
//   const { mutate: editVM } = useEditVm();

//   const { data: allvm } = useAllVMs((e) => ({
//     ...e,
//   }));

//   // 가상머신 상세데이터 가져오기
//   const { data: vm, refetch: refetchvms } = useVmById(vmId);

//   // 가상머신에 연결되어있는 디스크목록
//   const { data: disks } = useDisksFromVM(vmId, (e) => ({
//     ...e,
//   }));
//   const handleRemoveDisk = (diskId) => {
//     if (window.confirm("정말 이 디스크를 삭제하시겠습니까?")) {
//     }
//   };
//   const [showAddOptions, setShowAddOptions] = useState(false); // 추가 옵션 토글 상태

//   // 디스크 연결관련
//   const [selectedDisks, setSelectedDisks] = useState([]); // 선택된 디스크 상태 선언
//   const [selectedDiskId, setSelectedDiskId] = useState(null);
//   const { data: selectedDiskInfo, isLoading: isDiskLoading } =
//     useDiskById(selectedDiskId); // 디스크 상세정보 가져오기
//   const handleDiskSelection = (diskId, diskDetails) => {
//     // 디스크 선택 핸들러
//     console.log("선택된 디스크 ID:", diskId);
//     console.log("선택된 디스크 세부 정보:", diskDetails);
//     setSelectedDiskId(diskId); // 선택한 디스크 ID를 상태로 저장
//     setSelectedDisks((prev) => [...prev, { id: diskId, details: diskDetails }]);
//   };
//   const [vmdisks, setVmdisks] = useState([]); // VM에 연결된 디스크
//   const handleDiskCreated = (createdDisk) => {
//     console.log("새로 생성된 디스크:", createdDisk);
//     setVmdisks((prevDisks) => {
//       return [...prevDisks, createdDisk]; // 기존 목록에 새 디스크 추가
//     });
//   };
//   const { data: vmdisk } = useAddDisksFromVM(vmId);
//   const handleAddDiskOptions = () => {
//     setShowAddOptions(true);
//   };

//   // 데이터센터 ID 가져오기
//   useEffect(() => {
//     if (selectedVm?.dataCenterId) {
//       setDataCenterId(selectedVm.dataCenterId);
//     }
//   }, [selectedVm]);

//   // 1. 데이터센터 ID 추출 및 상태 저장
//   useEffect(() => {
//     if (!editMode && allvm) {
//       const uniqueDataCenters = Array.from(
//         new Set(allvm.map((vm) => vm?.dataCenterVo?.id).filter(Boolean))
//       );
//       if (uniqueDataCenters.length > 0) {
//         setDataCenterId(uniqueDataCenters[0]); // 첫 번째 데이터센터 선택
//         console.log("Unique DataCenter IDs:", uniqueDataCenters);
//       }
//     }
//   }, [allvm, editMode]);

//   // 2. 데이터센터 ID 기반 클러스터 목록 가져오기
//   const { data: clustersFromDataCenter } = useClustersFromDataCenter(
//     dataCenterId,
//     (cluster) => ({
//       id: cluster.id,
//       name: cluster.name,
//     })
//   );
//   // 클러스터 목록 업데이트 및 콘솔 출력
//   useEffect(() => {
//     if (clustersFromDataCenter) {
//       console.log("Fetched Clusters:", clustersFromDataCenter); // 콘솔 출력
//       setClusters(clustersFromDataCenter);
//       if (clustersFromDataCenter.length > 0) {
//         setClusterVoId(clustersFromDataCenter[0].id); // 기본 선택값 설정
//       }
//     } else {
//       console.log("No clusters fetched or dataCenterId is missing.");
//     }
//   }, [clustersFromDataCenter]);
//   // 클러스터 ID에대한 호스트목록
//   const { data: hostsData } = useHostFromCluster(clusterVoId, (e) => ({
//     id: e.id,
//     name: e.name,
//   }));

//   // nic옵션리스트
//   const { data: nicList } = useAllnicFromVM(clusterVoId, (e) => ({
//     id: e?.id,
//     name: e?.name,
//     networkVoName: e?.networkVo?.name,
//   }));

//   // 가상머신 내 네트워크인터페이스 목록
//   const { data: nics } = useNetworkInterfaceFromVM(vmId, (e) => ({
//     ...e,
//   }));
//   // NIC 상태 초기화
//   const [nicSelections, setNicSelections] = useState([]);

//   // NIC 편집 모드드
//   useEffect(() => {
//     if (editMode && nics?.length > 0) {
//       const existingNics = nics.map((nic, index) => ({
//         id: nic.id || "",
//         name: nic.name || `NIC${index + 1}`,
//         vnicProfileVo: nic.vnicProfileVo || {},
//       }));
//       setNicSelections(existingNics);
//     } else if (!editMode) {
//       // 생성 모드
//       setNicSelections([{ id: "", name: "NIC1", vnicProfileVo: {} }]);
//     }
//   }, [editMode, nics]);

//   // NIC 추가
//   const handleAddNic = () => {
//     setNicSelections((prev) => [
//       ...prev,
//       { id: "", name: `NIC${prev.length + 1}`, vnicProfileVo: {} },
//     ]);
//   };
//   // NIC 삭제
//   const handleRemoveNic = (index) => {
//     setNicSelections((prev) => prev.filter((_, i) => i !== index));
//   };
//   // NIC 변경
//   const handleNicChange = (index, field, value) => {
//     setNicSelections((prev) =>
//       prev.map((nic, i) => (i === index ? { ...nic, [field]: value } : nic))
//     );
//   };

//   // 템플릿 가져오기
//   const { data: templates } = useAllTemplates((e) => ({
//     ...e,
//   }));
//   useEffect(() => {
//     if (!editMode && templates && templates.length > 0) {
//       setTemplateId(templates[0].id); // 첫 번째 템플릿의 ID를 templateId 상태로 설정
//     }
//   }, [editMode, templates]);
//   // 특정 호스트 라디오 버튼 클릭 핸들러
//   const handleSpecificHostSelection = (e) => {
//     setIsSpecificHostSelected(e.target.checked); // 상태 업데이트
//   };
//   // useEffect로 hostsData를 상태로 업데이트
//   useEffect(() => {
//     if (hostsData) {
//       setHostsFromCluster(hostsData);
//     }
//   }, [hostsData]);

//   // CD/DVD 연결
//   const [isCdDvdChecked, setIsCdDvdChecked] = useState(false); // 체크박스 상태
//   const [selectedCd, setSelectedCd] = useState(""); // 선택된 CD/DVD
//   const [cdList, setCdList] = useState([]); // CD/DVD 목록

//   const { data: cdData } = useCDFromDataCenter((cd) => ({
//     id: cd?.id,
//     name: cd?.name,
//   }));

//   useEffect(() => {
//     if (cdData) {
//       setCdList(cdData || []);
//     }
//   }, [cdData]);

//   // 체크박스 핸들러
//   const handleCdDvdCheckboxChange = (e) => {
//     const isChecked = e.target.checked;
//     setIsCdDvdChecked(isChecked);

//     // 체크 해제 시 선택 초기화
//     if (!isChecked) {
//       setConnVoId("");
//       setConnVoName("");
//     }
//   };

//   // 드롭다운 변경 핸들러
//   const handleCdDvdChange = (e) => {
//     const selectedId = e.target.value;
//     const selectedCd = cdList.find((cd) => cd.id === selectedId);

//     setConnVoId(selectedId);
//     setConnVoName(selectedCd ? selectedCd.name : "");
//   };

//   useEffect(() => {
//     if (editMode && vm) {
//       if (vm?.disks) {
//         setVmdisks(vm.disks);
//       }
//     }
//   }, [editMode, vm]);

//   // 운영 시스템 및 칩셋 옵션 상태
//   const [osOptions, setOsOptions] = useState([
//     { value: "debian_7", label: "Debian 7+" },
//     { value: "debian_9", label: "Debian 9+" },
//     { value: "freebsd_9_2", label: "FreeBSD 9.2" },
//     { value: "freebsd_9_2_x64", label: "FreeBSD 9.2 x64" },
//     { value: "Linux", label: "Linux" },
//     { value: "other_linux_kernel_4", label: "Other Linux(kernel 4.x)" },
//     { value: "other_os", label: "Other OS" },
//     { value: "red_hat_atomic_7_x64", label: "Red Hat Atomic 7.x x64" },
//     {
//       value: "red_hat_enterprise_linux_3",
//       label: "Red Hat Enterprise Linux 3.x",
//     },
//     {
//       value: "red_hat_enterprise_linux_3_x64",
//       label: "Red Hat Enterprise Linux 3.x x64",
//     },
//     {
//       value: "red_hat_enterprise_linux_4",
//       label: "Red Hat Enterprise Linux 4.x",
//     },
//     {
//       value: "red_hat_enterprise_linux_4_x64",
//       label: "Red Hat Enterprise Linux 4.x x64",
//     },
//     {
//       value: "red_hat_enterprise_linux_5",
//       label: "Red Hat Enterprise Linux 5.x",
//     },
//     {
//       value: "red_hat_enterprise_linux_5_x64",
//       label: "Red Hat Enterprise Linux 5.x x64",
//     },
//     {
//       value: "red_hat_enterprise_linux_6",
//       label: "Red Hat Enterprise Linux 6.x",
//     },
//     {
//       value: "red_hat_enterprise_linux_6_x64",
//       label: "Red Hat Enterprise Linux 6.x x64",
//     },
//     {
//       value: "red_hat_enterprise_linux_7_x64",
//       label: "Red Hat Enterprise Linux 7.x x64",
//     },
//     {
//       value: "red_hat_enterprise_linux_8_x64",
//       label: "Red Hat Enterprise Linux 8.x x64",
//     },
//     {
//       value: "red_hat_enterprise_linux_9_x64",
//       label: "Red Hat Enterprise Linux 9.x x64",
//     },
//     {
//       value: "red_hat_enterprise_linux_coreos",
//       label: "Red Hat Enterprise Linux CoreOS",
//     },
//     {
//       value: "suse_linux_enterprise_server_11",
//       label: "SUSE Linux Enterprise Server 11+",
//     },
//     { value: "ubuntu_bionic_beaver_lts", label: "Ubuntu Bionic Beaver LTS+" },
//     {
//       value: "ubuntu_precise_pangolin_lts",
//       label: "Ubuntu Precise Pangolin LTS",
//     },
//     { value: "ubuntu_quantal_quetzal", label: "Ubuntu Quantal Quetzal" },
//     { value: "ubuntu_raring_ringtail", label: "Ubuntu Raring Ringtail" },
//     { value: "ubuntu_saucy_salamander", label: "Ubuntu Saucy Salamander" },
//     { value: "ubuntu_trusty_tahr_lts", label: "Ubuntu Trusty Tahr LTS+" },
//     { value: "windows_10", label: "Windows 10" },
//     { value: "windows_10_x64", label: "Windows 10 x64" },
//     { value: "windows_11", label: "Windows 11" },
//     { value: "windows_2003", label: "Windows 2003" },
//     { value: "windows_2003_x64", label: "Windows 2003 x64" },
//     { value: "windows_2008", label: "Windows 2008" },
//     { value: "windows_2008_r2_x64", label: "Windows 2008 R2 x64" },
//     { value: "windows_2012_x64", label: "Windows 2012 x64" },
//     { value: "windows_2012r2_x64", label: "Windows 2012R2 x64" },
//     { value: "windows_2016_x64", label: "Windows 2016 x64" },
//     { value: "windows_2019_x64", label: "Windows 2019 x64" },
//     { value: "windows_2022", label: "Windows 2022" },
//     { value: "windows_7", label: "Windows 7" },
//     { value: "windows_7_x64", label: "Windows 7 x64" },
//     { value: "windows_8", label: "Windows 8" },
//     { value: "windows_8_x64", label: "Windows 8 x64" },
//     { value: "windows_xp", label: "Windows XP" },
//   ]);
//   // 칩셋 옵션
//   const [chipsetOptions, setChipsetOptions] = useState([
//     { value: "CLUSTER_DEFAULT", label: "클러스터 기본값" },
//     { value: "I440FX_SEA_BIOS", label: "BIOS의 I440FX 칩셋" },
//     { value: "Q35_OVMF", label: "UEFI의 Q35 칩셋" },
//     { value: "Q35_SEA_BIOS", label: "BIOS의 Q35 칩셋" },
//     { value: "Q35_SECURE_BOOT", label: "UEFI SecureBoot의 Q35 칩셋" },
//   ]);
//   // 최적화옵션
//   const [optimizeOption, setOptimizeOption] = useState([
//     { value: "DESKTOP", label: "데스크톱" },
//     { value: "HIGH_PERFORMANCE", label: "고성능" },
//     { value: "SERVER", label: "서버" },
//   ]);
//   // 마이그레이션 모드
//   const [migrationModeOptions, setMigrationModeOptions] = useState([
//     { value: "migratable", label: "수동 및 자동 마이그레이션 허용" },
//     { value: "user_migratable", label: "수동 마이그레이션만 허용" },
//     { value: "pinned", label: "마이그레이션 불가" },
//   ]);
//   // 마이그레이션 정책
//   const [migrationPolicyOptions, setMigrationPolicyOptions] = useState([
//     { value: "minimal_downtime", label: "Minimal downtime" },
//     { value: "post_copy", label: "Post-copy migration" },
//     { value: "suspend_workload", label: "Suspend workload if needed" },
//     { value: "very_large_vms", label: "Very large VMs" },
//   ]);
//   // 고가용성
//   const priorityOptions = [
//     { value: 1, label: "낮음" },
//     { value: 50, label: "중간" },
//     { value: 100, label: "높음" },
//   ];
//   // 부트옵션(첫번째 장치)
//   const firstDeviceOptions = [
//     { value: "hd", label: "하드 디스크" },
//     { value: "cdrom", label: "CD-ROM" },
//     { value: "network", label: "네트워크(PXE)" },
//   ];
//   // 부트옵션(두번째 장치)
//   const secDeviceOptions = [
//     { value: "", label: "없음" },
//     { value: "ha", label: "하드 디스크" },
//     { value: "cdrom", label: "CD-ROM" },
//   ];

//   // 선택된 값 상태
//   const [selectedOs, setSelectedOs] = useState("debian_7"); // 운영 시스템 선택
//   const [selectedChipset, setSelectedChipset] = useState("Q35_OVMF"); // 칩셋 선택
//   const [selectedOptimizeOption, setSelectedOptimizeOption] =
//     useState("SERVER"); // 칩셋 선택

//   // 초기값 설정
//   useEffect(() => {
//     if (editMode && vm) {
//       console.log("편집 모드에서 가져온 VM 데이터:", vm);

//       setId(vm?.id);
//       setName(vm?.name);
//       setClusterVoName(vm?.clusterVo?.name || "");
//       setClusterVoId(vm?.clusterVo?.id || "");
//       setDescription(vm?.description || "");
//       setSelectedOs(vm?.osSystem || "Linux"); // 운영 체제
//       setSelectedChipset(vm?.chipsetFirmwareType || "Q35_OVMF"); // 칩셋
//       setSelectedOptimizeOption(vm?.optimizeOption || "SERVER"); // 최적화 옵션
//       setTemplateId(vm?.templateVo?.id || "");
//       setTemplateName(vm?.templateVo?.name || "");

//       setComment(vm?.comment || "");
//       setStateless(vm?.stateless || false);
//       setStartPaused(vm?.startPaused || false);
//       setDeleteProtected(vm?.deleteProtected || false);

//       // 시스템
//       setMemorySize(vm.memorySize / (1024 * 1024)); // B -> MB 변환
//       setMaxMemory(vm.memoryMax / (1024 * 1024) || 0); // B -> MB 변환
//       setAllocatedMemory(vm.memoryActual / (1024 * 1024)); // B -> MB 변환
//       setCpuTopologyCnt(vm?.cpuTopologyCnt || 1);
//       setCpuTopologyCore(vm?.cpuTopologyCore || 1);
//       setCpuTopologySocket(vm?.cpuTopologySocket || 1);
//       setCpuTopologyThread(vm?.cpuTopologyThread || 1);

//       //초기실행
//       setCloudInit(vm?.cloudInit);
//       setScript(vm?.setScript);

//       // 호스트
//       setMigrationMode(vm?.migrationMode || migrationModeOptions[0].value);
//       setMigrationPolicy(
//         vm?.migrationPolicy || migrationPolicyOptions[0].value
//       );

//       // 고가용성
//       setHa(vm?.ha || false);
//       setPriority(vm?.priority || 1);

//       // 부트옵션
//       setFirstDevice(vm?.firstDevice || firstDeviceOptions[0].value);
//       setSecDevice(vm?.secDevice || secDeviceOptions[0].value);
//       setBootingMenu(vm?.bootingMenu || false);
//       setConnVoId(vm?.connVo?.id);
//       setConnVoName(vm?.connVo?.name);
//     } else if (!editMode) {
//       resetForm();
//       setClusterVoId(clusters?.[0]?.id);
//       setMigrationMode(vm?.migrationMode || migrationModeOptions[0].value);
//       setMigrationPolicy(
//         vm?.migrationPolicy || migrationPolicyOptions[0].value
//       );
//     }
//   }, [isOpen, editMode, vm, osOptions, chipsetOptions, optimizeOption, vmId]);

//   const resetForm = () => {
//     setClusterVoId("");
//     setName("");
//     setDescription("");
//     setComment("");
//     setStateless(false); // 기본값 설정
//     setStartPaused(false); // 기본값 설정
//     setDeleteProtected(false); // 기본값 설정
//     setSelectedOs("Linux"); // 기본값
//     setSelectedChipset("Q35_SEA_BIOS"); // 기본값
//     setMaxMemory(1024); // 기본 최대 메모리 (KB 단위)
//     setAllocatedMemory(1024); // 기본 할당 메모리 (KB 단위)
//     setMemorySize(1024); // 기본 메모리 크기 (KB 단위)
//     setCpuTopologyCnt(1);
//     setCpuTopologyCnt(1);
//     setCpuTopologyCore(1);
//     setCpuTopologySocket(1);
//     setCpuTopologyThread(1);
//     setCloudInit(false);
//     setScript("");
//   };

//   const handleFormSubmit = () => {
//     // 디스크  연결은 id값 보내기 생성은 객체로 보내기

//     if (maxMemory > 9223372036854775807 || memorySize > 9223372036854775807) {
//       toast.error("메모리 값이 너무 큽니다. 다시 확인해주세요.");
//       return;
//     }

//     const selectedCluster = clusters.find((c) => c.id === clusterVoId);
//     if (!selectedCluster) {
//       toast.error("클러스터를 선택해주세요.");
//       return;
//     }
//     // 선택된 템플릿 찾기
//     const selectedTemplate = templates.find((t) => t.id === templateId);
//     if (!selectedTemplate) {
//       toast.error("네트워크를 선택해주세요.");
//       return;
//     }

//     const dataToSubmit = {
//       vmdisks,
//       clusterVo: {
//         id: selectedCluster.id,
//         name: selectedCluster.name,
//       },
//       templateVo: {
//         id: selectedTemplate.id,
//         name: selectedTemplate.name,
//       },
//       nicVos: nicSelections.map((nic) => ({
//         name: nic.name,
//         vnicProfileVo: {
//           id: nic.vnicProfileVo?.id || null,
//           name: nic.vnicProfileVo?.name || "",
//         },
//       })),
//       name,
//       description,
//       comment,
//       osOptions: selectedOs,
//       chipsetFirmwareType: selectedChipset, // 선택된 칩셋
//       optimizeOption: selectedOptimizeOption, // 선택된 최적화 옵션
//       stateless, // boolean
//       startPaused, // boolean
//       deleteProtected, // boolean

//       // 시스템 데이터
//       memorySize: memorySize * 1024 * 1024, // MB -> B 변환
//       memoryMax: maxMemory * 1024 * 1024, // MB -> B 변환
//       memoryActual: allocatedMemory * 1024 * 1024, // MB -> B 변환
//       cpuTopologyCnt, // 총가상 CPU
//       cpuTopologyCore, // 가상 소켓 당 코어
//       cpuTopologySocket, // 가상소켓
//       cpuTopologyThread, // 코어당 스레드

//       // 초기 실행 데이터 (예: cloud-init 관련)
//       cloudInit,
//       script,

//       // 호스트
//       migrationMode, // string 마이그레이션모드
//       migrationPolicy, // 마이그레이션 정책

//       // 고가용성
//       ha, // boolean
//       priority, // int

//       // 부트옵션
//       firstDevice, // string
//       secDevice, // string
//       connVo: isCdDvdChecked
//         ? {
//             id: connVoId,
//             name: connVoName,
//           }
//         : null,
//       bootingMenu, // boolean

//       // 디스크
//       diskAttachmentVos: vmdisks.map((disk) => ({
//         active: true,
//         bootable: disk.bootable || false,
//         detachOnly: false,
//         diskImageVo: {
//           id: disk.id || "",
//           alias: disk.alias || "Unknown Alias",
//           size: disk.size || 0,
//           description: disk.description || "No Description",
//           backup: disk.backup || false,
//           sharable: disk.sharable || false,
//           sparse: disk.sparse || false,
//           wipeAfterDelete: disk.wipeAfterDelete || false,
//           dataCenterVo: disk.dataCenterVo || { id: "", name: "No Data Center" },
//           diskProfileVo: disk.diskProfileVo || { id: "", name: "No Profile" },
//           storageDomainVo: disk.storageDomainVo || {
//             id: "",
//             name: "No Storage Domain",
//           },
//         },
//       })),
//     };
//     console.log("가상머신 생성or편집데이터 확인:", dataToSubmit);

//     if (editMode) {
//       dataToSubmit.id = id;
//       console.log("Editing VM with data:", dataToSubmit);
//       editVM(
//         {
//           vmId: id,
//           vmdata: dataToSubmit,
//         },
//         {
//           onSuccess: () => {
//             onClose();
//             toast.success("가상머신 편집 완료");
//           },
//           onError: (error) => {
//             toast.error("Error editing vm:", error);
//           },
//         }
//       );
//     } else {
//       addVM(dataToSubmit, {
//         onSuccess: () => {
//           onClose();
//           toast.success("가상머신 생성 완료");
//         },
//         onError: (error) => {
//           toast.error("Error adding vm:", error);
//         },
//       });
//     }
//   };

//   // const [activeSection, setActiveSection] = useState('common_outer');
//   // const [activeLunTab, setActiveLunTab] = useState('target_lun');
//   // const handleSectionChange = (section) => setActiveSection(section);
//   const [selectedModalTab, setSelectedModalTab] = useState("common");

//   // 추가 모달
//   const [isConnectionPopupOpen, setIsConnectionPopupOpen] = useState(false);
//   const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
//   const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);

//   // 새로만들기->초기실행 화살표 누르면 밑에열리기
//   const [isDomainHiddenBoxVisible, setDomainHiddenBoxVisible] = useState(false);
//   const toggleDomainHiddenBox = () => {
//     setDomainHiddenBoxVisible(!isDomainHiddenBoxVisible);
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onClose}
//       contentLabel="가상머신 생성"
//       className="Modal"
//       overlayClassName="Overlay"
//       shouldCloseOnOverlayClick={false}
//     >
//       <div className="vm-edit-popup">
//         <div className="popup-header">
//           <h1>{editMode ? "가상머신 편집" : "가상머신 생성"}</h1>
//           <button onClick={onClose}>
//             <FontAwesomeIcon icon={faTimes} fixedWidth />
//           </button>
//         </div>

//         <div className="vm_edit_popup_content">
//           <div
//             className="vm_new_nav"
//             style={{
//               fontSize: "0.33rem",
//               height: "71vh",
//               width: "30%",
//               backgroundColor: "#FAFAFA",
//               borderRight: "var(--border-simple)",
//               boxShadow: "1px 0 5px rgba(0, 0, 0, 0.1)",
//               fontWeight: 800,
//             }}
//           >
//             <div
//               id="common_tab"
//               className={
//                 selectedModalTab === "common" ? "active-tab" : "inactive-tab"
//               }
//               onClick={() => setSelectedModalTab("common")}
//             >
//               일반
//             </div>
//             <div
//               id="system_tab"
//               className={
//                 selectedModalTab === "system" ? "active-tab" : "inactive-tab"
//               }
//               onClick={() => setSelectedModalTab("system")}
//             >
//               시스템
//             </div>
//             <div
//               id="beginning_tab"
//               className={
//                 selectedModalTab === "beginning" ? "active-tab" : "inactive-tab"
//               }
//               onClick={() => setSelectedModalTab("beginning")}
//             >
//               초기 실행
//             </div>
//             <div
//               id="host_tab"
//               className={
//                 selectedModalTab === "host" ? "active-tab" : "inactive-tab"
//               }
//               onClick={() => setSelectedModalTab("host")}
//             >
//               호스트
//             </div>
//             <div
//               id="ha_mode_tab"
//               className={
//                 selectedModalTab === "ha_mode" ? "active-tab" : "inactive-tab"
//               }
//               onClick={() => setSelectedModalTab("ha_mode")}
//             >
//               고가용성
//             </div>
//             <div
//               id="boot_option_tab"
//               className={
//                 selectedModalTab === "boot_outer"
//                   ? "active-tab"
//                   : "inactive-tab"
//               }
//               onClick={() => setSelectedModalTab("boot_outer")}
//             >
//               부트 옵션
//             </div>
//           </div>

//           {/* 탭 내용 */}
//           <div className="vm_edit_select_tab">
//             <div className="edit-first-content">
//               <div>
//                 <label htmlFor="cluster">클러스터</label>
//                 <select
//                   id="cluster"
//                   value={clusterVoId}
//                   onChange={(e) => setClusterVoId(e.target.value)}
//                 >
//                   {clusters.length > 0 ? (
//                     clusters.map((cluster) => (
//                       <option key={cluster.id} value={cluster.id}>
//                         {cluster.name}
//                       </option>
//                     ))
//                   ) : (
//                     <option value="">클러스터 없음</option>
//                   )}
//                 </select>
//                 <span>
//                   선택된 클러스터:{" "}
//                   {clusters.find((cluster) => cluster.id === clusterVoId)
//                     ?.name || "선택되지 않음"}
//                 </span>
//               </div>

//               <div>
//                 <label htmlFor="template" style={{ color: "gray" }}>
//                   템플릿
//                 </label>
//                 <select
//                   id="template"
//                   value={templateId} // 선택된 템플릿 ID와 동기화
//                   onChange={(e) => setTemplateId(e.target.value)} // 상태 업데이트
//                   disabled={editMode} // 편집 모드일 경우 비활성화
//                 >
//                   {editMode && vmdata?.templateName ? (
//                     // 편집 모드에서는 고정된 템플릿만 표시
//                     <option value={vmdata.templateId}>
//                       {vmdata.templateName}
//                     </option>
//                   ) : (
//                     // 생성 모드에서는 템플릿 목록을 표시
//                     templates &&
//                     templates.map((template) => (
//                       <option key={template.id} value={template.id}>
//                         {template.name} {/* 템플릿 이름 표시 */}
//                       </option>
//                     ))
//                   )}
//                 </select>
//               </div>

//               <div className="network-form-group">
//                 <label htmlFor="os">운영 시스템</label>
//                 <select
//                   id="os"
//                   value={selectedOs} // 선택된 값과 동기화
//                   onChange={(e) => setSelectedOs(e.target.value)} // 값 변경 핸들러
//                 >
//                   {osOptions.map((os) => (
//                     <option key={os.value} value={os.value}>
//                       {os.label} {/* UI에 표시되는 값 */}
//                     </option>
//                   ))}
//                 </select>
//                 <span>
//                   선택된 운영 시스템:{" "}
//                   {osOptions.find((opt) => opt.value === selectedOs)?.label ||
//                     ""}
//                 </span>
//               </div>

//               <div className="network-form-group">
//                 <label htmlFor="chipset">칩셋/펌웨어 유형</label>
//                 <select
//                   id="chipset"
//                   value={selectedChipset}
//                   onChange={(e) => setSelectedChipset(e.target.value)}
//                 >
//                   {chipsetOptions.map((chipset) => (
//                     <option key={chipset.value} value={chipset.value}>
//                       {chipset.label} {/* 화면에 표시될 한글 */}
//                     </option>
//                   ))}
//                 </select>
//                 <span>선택된 칩셋: {selectedChipset}</span>
//               </div>

//               <div style={{ marginBottom: "2%" }}>
//                 <label htmlFor="optimization">최적화 옵션</label>
//                 <select
//                   id="optimization"
//                   value={selectedOptimizeOption} // 선택된 값과 동기화
//                   onChange={(e) => setSelectedOptimizeOption(e.target.value)} // 값 변경 핸들러
//                 >
//                   {optimizeOption.map((option) => (
//                     <option key={option.value} value={option.value}>
//                       {option.label} {/* UI에 표시되는 값 */}
//                     </option>
//                   ))}
//                 </select>
//                 <span>
//                   선택된 최적화 옵션:{" "}
//                   {optimizeOption.find(
//                     (opt) => opt.value === selectedOptimizeOption
//                   )?.label || ""}
//                 </span>
//               </div>
//             </div>

//             {selectedModalTab === "common" && (
//               <>
//                 <div className="edit-second-content mb-1">
//                   <div>
//                     <label htmlFor="name">이름ddd</label>
//                     <input
//                       type="text"
//                       id="name"
//                       value={name}
//                       onChange={(e) => setName(e.target.value)}
//                     />
//                   </div>
//                   <div>
//                     <label htmlFor="description">설명</label>
//                     <input
//                       type="text"
//                       id="description"
//                       value={description}
//                       onChange={(e) => setDescription(e.target.value)}
//                     />
//                   </div>
//                   <div>
//                     <label htmlFor="comment">코멘트</label>
//                     <input
//                       type="text"
//                       id="comment"
//                       value={comment}
//                       onChange={(e) => setComment(e.target.value)}
//                     />
//                   </div>
//                 </div>
//                 <div className="px-1 font-bold">인스턴스 이미지</div>
//                 <div
//                   className="edit-third-content"
//                   style={{
//                     borderBottom: "1px solid gray",
//                     marginBottom: "0.2rem",
//                   }}
//                 >
//                   {editMode ? (
//                     // 편집 모드일 때
//                     <div className="vm-plus-btn-outer">
//                       <div>
//                         {disks && disks.length > 0 ? (
//                           // 디스크가 있는 경우
//                           disks.map((disk, index) => (
//                             <div
//                               className="vm-plus-btn"
//                               key={index}
//                               style={{ marginBottom: "10px" }}
//                             >
//                               <span>
//                                 {disk.diskImageVo?.alias || "이름 없음"}: (
//                                 {disk.diskImageVo?.virtualSize || "0"} GB){" "}
//                                 {disk.bootable ? "(부팅)" : "(기본)"}
//                               </span>
//                               {/* <div>-디스크아이디: {disk.id}</div> */}
//                               <div className="flex">
//                                 <button
//                                   className="mr-1"
//                                   onClick={() => setIsEditPopupOpen(true)}
//                                 >
//                                   편집
//                                 </button>
//                                 <DiskModal
//                                   isOpen={isEditPopupOpen}
//                                   onRequestClose={() =>
//                                     setIsEditPopupOpen(false)
//                                   }
//                                   editMode={true}
//                                   diskId={disk.id} // 디스크 ID 전달
//                                   vmdisks={vmdisks}
//                                   type="vm"
//                                 />
//                                 <div className="flex">
//                                   {/* 마지막 디스크에만 + 버튼 추가 */}
//                                   {index === disks.length - 1 && (
//                                     <button
//                                       onClick={() =>
//                                         setShowAddOptions(!showAddOptions)
//                                       }
//                                     >
//                                       +
//                                     </button>
//                                   )}
//                                   <button
//                                     onClick={() => handleRemoveDisk(disk.id)}
//                                   >
//                                     -
//                                   </button>
//                                 </div>
//                               </div>
//                             </div>
//                           ))
//                         ) : (
//                           // 디스크가 없는 경우
//                           <div style={{ marginBottom: "10px" }}>
//                             <div className="vm-plus-btn">
//                               {vmdisks.length > 0 ? (
//                                 vmdisks.map((disk) => (
//                                   <div key={disk.id}>
//                                     <p>디스크 이름: {disk.alias}</p>
//                                     <p>크기: {disk.size} GB</p>
//                                   </div>
//                                 ))
//                               ) : (
//                                 <p>디스크가 없습니다.</p>
//                               )}
//                               <div className="flex">
//                                 <button
//                                   onClick={() => setIsConnectionPopupOpen(true)}
//                                 >
//                                   연결
//                                 </button>
//                                 <VmConnectionPlusModal
//                                   isOpen={isConnectionPopupOpen}
//                                   onRequestClose={() =>
//                                     setIsConnectionPopupOpen(false)
//                                   }
//                                   vmId={vmId} // vmId를 넘겨줍니다.
//                                   onSelectDisk={handleDiskSelection}
//                                   excludedDiskIds={selectedDisks.map(
//                                     (disk) => disk.id
//                                   )}
//                                 />

//                                 <button
//                                   className="mr-1"
//                                   onClick={() => setIsCreatePopupOpen(true)}
//                                 >
//                                   생성
//                                 </button>
//                                 <DiskModal
//                                   isOpen={isCreatePopupOpen}
//                                   onRequestClose={() =>
//                                     setIsCreatePopupOpen(false)
//                                   }
//                                   editMode={false}
//                                   vmId={vmId}
//                                   type="vm"
//                                   vmdisks={vmdisks}
//                                   onDiskCreated={(createdDisk) => {
//                                     handleDiskCreated(createdDisk); // 상태 업데이트
//                                   }}
//                                 />
//                                 <button disabled>+</button>
//                                 <button disabled>-</button>
//                               </div>
//                             </div>
//                           </div>
//                         )}

//                         {/* 추가 옵션 */}
//                         {showAddOptions && (
//                           <div style={{ marginTop: "10px" }}>
//                             <div className="flex float-right">
//                               <button
//                                 onClick={() => setIsConnectionPopupOpen(true)}
//                               >
//                                 연결
//                               </button>
//                               <VmConnectionPlusModal
//                                 isOpen={isConnectionPopupOpen}
//                                 onRequestClose={() =>
//                                   setIsConnectionPopupOpen(false)
//                                 }
//                                 vmId={vmId} // vmId를 넘겨줍니다.
//                                 onSelectDisk={handleDiskSelection}
//                                 excludedDiskIds={selectedDisks.map(
//                                   (disk) => disk.id
//                                 )}
//                               />
//                               <button
//                                 className="mr-1"
//                                 onClick={() => setIsCreatePopupOpen(true)}
//                               >
//                                 생성
//                               </button>
//                               <DiskModal
//                                 isOpen={isCreatePopupOpen}
//                                 onRequestClose={() =>
//                                   setIsCreatePopupOpen(false)
//                                 }
//                                 editMode={false}
//                                 vmId={vmId}
//                                 type="vm"
//                                 vmdisks={vmdisks}
//                                 onDiskCreated={handleDiskCreated}
//                               />
//                               <button disabled>+</button>
//                               <button disabled>-</button>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   ) : (
//                     // 생성 모드일 때
//                     <div className="vm-plus-btn-outer">
//                       {/* 디스크가 있는 경우 */}
//                       {vmdisks.length > 0 ? (
//                         vmdisks.map((disk, index) => (
//                           <div key={disk.id} className="vm-plus-btn">
//                             <span>
//                               {disk.details?.alias || "알 수 없음"} 연결 중
//                             </span>
//                             <div className="flex">
//                               {/* 편집 버튼 */}
//                               <button
//                                 className="mr-1"
//                                 onClick={() => setIsEditPopupOpen(true)}
//                               >
//                                 편집
//                               </button>
//                               <DiskModal
//                                 isOpen={isEditPopupOpen}
//                                 onRequestClose={() => setIsEditPopupOpen(false)}
//                                 editMode={true}
//                                 diskId={disk.id}
//                                 type="vm"
//                               />
//                               <div className="flex">
//                                 {/* 마지막 디스크에만 "+" 버튼 표시 */}
//                                 {index === vmdisks.length - 1 && (
//                                   <button
//                                     onClick={() =>
//                                       setShowAddOptions(!showAddOptions)
//                                     }
//                                   >
//                                     +
//                                   </button>
//                                 )}
//                                 {/* 삭제 버튼 */}
//                                 <button
//                                   onClick={() => handleRemoveDisk(disk.id)}
//                                 >
//                                   -
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         ))
//                       ) : (
//                         // 디스크가 없는 경우 연결/생성 버튼 표시
//                         <div className="flex float-right">
//                           <button
//                             onClick={() => setIsConnectionPopupOpen(true)}
//                           >
//                             연결
//                           </button>
//                           <VmConnectionPlusModal
//                             isOpen={isConnectionPopupOpen}
//                             onRequestClose={() =>
//                               setIsConnectionPopupOpen(false)
//                             }
//                             vmId={vmId}
//                             onSelectDisk={(diskId, diskDetails) => {
//                               if (diskId) {
//                                 const newDisk = {
//                                   id: diskId,
//                                   details: diskDetails,
//                                 };
//                                 setSelectedDiskId(diskId); // 선택된 디스크 ID 업데이트
//                                 setSelectedDisks((prev) => [...prev, newDisk]); // 선택된 디스크 추가
//                                 setVmdisks((prev) => [...prev, newDisk]); // vmdisks에 추가
//                                 setIsConnectionPopupOpen(false); // 모달 닫기
//                               } else {
//                                 toast.error("디스크를 선택하지 않았습니다!");
//                               }
//                             }}
//                             excludedDiskIds={selectedDisks.map(
//                               (disk) => disk.id
//                             )}
//                           />

//                           {/* 선택된 디스크 정보 표시 */}
//                           {selectedDisks.length > 0 && (
//                             <div className="selected-disks">
//                               <ul>
//                                 {selectedDisks.map((disk, index) => (
//                                   <li key={index}>
//                                     <span>
//                                       디스크 이름:{" "}
//                                       {disk.details?.alias || "알 수 없음"}
//                                     </span>{" "}
//                                     연결 중
//                                   </li>
//                                 ))}
//                               </ul>
//                             </div>
//                           )}

//                           <button
//                             className="mr-1"
//                             onClick={() => setIsCreatePopupOpen(true)}
//                           >
//                             생성
//                           </button>
//                           <DiskModal
//                             isOpen={isCreatePopupOpen}
//                             onRequestClose={() => setIsCreatePopupOpen(false)}
//                             editMode={false}
//                             vmId={vmId}
//                             type="vm"
//                             vmdisks={vmdisks}
//                             onDiskCreated={(createdDisk) => {
//                               handleDiskCreated(createdDisk); // 상태 업데이트
//                             }}
//                           />
//                           <button disabled={!selectedDisks.length}>+</button>
//                           <button disabled={!selectedDisks.length}>-</button>
//                         </div>
//                       )}

//                       {/* 추가 옵션: "+" 버튼을 눌렀을 때만 표시 */}
//                       {showAddOptions && (
//                         <div className="additional_disk_section">
//                           <div className="vm-plus-btn float-right">
//                             <button
//                               onClick={() => setIsConnectionPopupOpen(true)}
//                             >
//                               연결
//                             </button>
//                             <VmConnectionPlusModal
//                               isOpen={isConnectionPopupOpen}
//                               onRequestClose={() =>
//                                 setIsConnectionPopupOpen(false)
//                               }
//                               vmId={vmId}
//                               onSelectDisk={(diskId, diskDetails) => {
//                                 if (diskId) {
//                                   const newDisk = {
//                                     id: diskId,
//                                     details: diskDetails,
//                                   };
//                                   setSelectedDiskId(diskId); // 선택된 디스크 ID 업데이트
//                                   setSelectedDisks((prev) => [
//                                     ...prev,
//                                     newDisk,
//                                   ]); // 선택된 디스크 추가
//                                   setVmdisks((prev) => [...prev, newDisk]); // vmdisks에 추가
//                                   setIsConnectionPopupOpen(false); // 모달 닫기
//                                 } else {
//                                   toast.error("디스크를 선택하지 않았습니다!");
//                                 }
//                               }}
//                               excludedDiskIds={selectedDisks.map(
//                                 (disk) => disk.id
//                               )}
//                             />

//                             <button
//                               className="mr-1"
//                               onClick={() => setIsCreatePopupOpen(true)}
//                             >
//                               생성
//                             </button>
//                             <DiskModal
//                               isOpen={isCreatePopupOpen}
//                               onRequestClose={() => setIsCreatePopupOpen(false)}
//                               editMode={false}
//                               vmId={vmId}
//                               type="vm"
//                               vmdisks={vmdisks}
//                               onDiskCreated={(createdDisk) => {
//                                 handleDiskCreated(createdDisk);
//                               }}
//                             />
//                             <button disabled>+</button>
//                             <button onClick={() => setShowAddOptions(false)}>
//                               -
//                             </button>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//                 <div
//                   className="edit_fourth_content"
//                   style={{ borderTop: "none" }}
//                 >
//                   {/* NIC이 없을 경우 기본 NIC1 추가 */}
//                   {nicSelections.length === 0 ? (
//                     <div
//                       className="edit_fourth_content_row"
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         marginBottom: "10px",
//                       }}
//                     >
//                       <div
//                         className="edit_fourth_content_select"
//                         style={{
//                           flex: 1,
//                           display: "flex",
//                           alignItems: "center",
//                         }}
//                       >
//                         {/* 기본 NIC 이름 표시 */}
//                         <label
//                           htmlFor="network_adapter_0"
//                           style={{
//                             marginRight: "10px",
//                             width: "100px",
//                           }}
//                         >
//                           NIC1
//                         </label>

//                         {/* 기본 NIC 옵션 */}
//                         <select
//                           id="network_adapter_0"
//                           style={{ flex: 1 }}
//                           value="" // 기본적으로 선택되지 않음
//                           onChange={(e) =>
//                             setNicSelections([
//                               {
//                                 id: "",
//                                 name: "NIC1",
//                                 vnicProfileVo: { id: e.target.value },
//                               },
//                             ])
//                           }
//                         >
//                           {nicList?.length > 0 &&
//                             nicList.map((nicOption) => (
//                               <option key={nicOption.id} value={nicOption.id}>
//                                 {nicOption.name}/{nicOption.networkVoName}
//                               </option>
//                             ))}
//                         </select>
//                       </div>

//                       {/* + 버튼만 활성화 */}
//                       <div style={{ display: "flex", marginLeft: "10px" }}>
//                         <button
//                           onClick={handleAddNic}
//                           style={{ marginRight: "5px" }}
//                         >
//                           +
//                         </button>
//                       </div>
//                     </div>
//                   ) : (
//                     // NIC이 있는 경우 기존 로직 유지
//                     nicSelections.map((nic, index) => (
//                       <div
//                         key={index}
//                         className="edit_fourth_content_row"
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           marginBottom: "10px",
//                         }}
//                       >
//                         <div
//                           className="edit_fourth_content_select"
//                           style={{
//                             flex: 1,
//                             display: "flex",
//                             alignItems: "center",
//                           }}
//                         >
//                           {/* NIC 이름 표시 */}
//                           <label
//                             htmlFor={`network_adapter_${index}`}
//                             style={{
//                               marginRight: "10px",
//                               width: "100px",
//                             }}
//                           >
//                             {nic.name || `NIC ${index + 1}`}
//                           </label>

//                           {/* NIC 선택 */}
//                           <select
//                             id={`network_adapter_${index}`}
//                             style={{ flex: 1 }}
//                             value={nic.vnicProfileVo?.id || ""}
//                             onChange={(e) =>
//                               handleNicChange(index, "vnicProfileVo", {
//                                 ...nic.vnicProfileVo,
//                                 id: e.target.value,
//                               })
//                             }
//                           >
//                             {nicList?.length > 0 &&
//                               nicList.map((nicOption) => (
//                                 <option key={nicOption.id} value={nicOption.id}>
//                                   {nicOption.name}/{nicOption.networkVoName}
//                                 </option>
//                               ))}
//                           </select>
//                         </div>

//                         {/* NIC 추가 및 삭제 버튼 */}
//                         <div style={{ display: "flex", marginLeft: "10px" }}>
//                           {index === nicSelections.length - 1 && (
//                             <button
//                               onClick={handleAddNic}
//                               style={{ marginRight: "5px" }}
//                             >
//                               +
//                             </button>
//                           )}
//                           {nicSelections.length > 1 && (
//                             <button onClick={() => handleRemoveNic(index)}>
//                               -
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               </>
//             )}
//             {selectedModalTab === "system" && (
//               <>
//                 <div className="edit-second-content">
//                   <div>
//                     <label htmlFor="memory_size">메모리 크기</label>
//                     <input
//                       type="number"
//                       id="memory_size"
//                       value={memorySize} // 메모리 크기
//                       onChange={(e) => setMemorySize(Number(e.target.value))} // 상태 업데이트
//                     />
//                   </div>
//                   <div>
//                     <div>
//                       <label htmlFor="max_memory">최대 메모리</label>
//                       <FontAwesomeIcon
//                         icon={faInfoCircle}
//                         style={{
//                           color: "rgb(83, 163, 255)",
//                           marginLeft: "5px",
//                         }}
//                         data-tooltip-id="max-memory-tooltip"
//                       />
//                       <Tooltip
//                         id="max-memory-tooltip"
//                         className="icon_tooltip"
//                         place="top"
//                         effect="solid"
//                       >
//                         메모리 핫 플러그를 실행할 수 있는 가상 머신 메모리 상한
//                       </Tooltip>
//                     </div>
//                     <input
//                       type="number"
//                       id="max_memory"
//                       value={maxMemory} // 최대 메모리
//                       onChange={(e) => setMaxMemory(Number(e.target.value))} // 상태 업데이트
//                     />
//                   </div>

//                   <div>
//                     <div>
//                       <label htmlFor="actual_memory">할당할 실제 메모리</label>
//                       <FontAwesomeIcon
//                         icon={faInfoCircle}
//                         style={{
//                           color: "rgb(83, 163, 255)",
//                           marginLeft: "5px",
//                         }}
//                         data-tooltip-id="actual-memory-tooltip"
//                       />
//                       <Tooltip
//                         id="actual-memory-tooltip"
//                         className="icon_tooltip"
//                         place="top"
//                         effect="solid"
//                       >
//                         ballooning 기능 사용 여부에 관계없이 가상 머신에 확보된
//                         메모리 양입니다.
//                       </Tooltip>
//                     </div>
//                     <input
//                       type="number"
//                       id="actual_memory"
//                       value={allocatedMemory} // 실제 메모리
//                       onChange={(e) =>
//                         setAllocatedMemory(Number(e.target.value))
//                       } // 상태 업데이트
//                     />
//                   </div>

//                   <div>
//                     <div>
//                       <label htmlFor="total_cpu">총 가상 CPU</label>
//                       <FontAwesomeIcon
//                         icon={faInfoCircle}
//                         style={{
//                           color: "rgb(83, 163, 255)",
//                           marginLeft: "5px",
//                         }}
//                         data-tooltip-id="total-cpu-tooltip"
//                       />
//                       <Tooltip
//                         id="total-cpu-tooltip"
//                         className="icon_tooltip"
//                         place="top"
//                         effect="solid"
//                       >
//                         소켓 수를 변경하여 CPU를 핫애드합니다. CPU 핫애드가
//                         올바르게 지원되는지 확인하려면 게스트 운영 체제 관련
//                         문서를 참조하십시오.
//                       </Tooltip>
//                     </div>
//                     <input
//                       type="text"
//                       id="total_cpu"
//                       value={cpuTopologyCnt}
//                       onChange={(e) =>
//                         setCpuTopologyCnt(Number(e.target.value))
//                       }
//                       min="1"
//                     />
//                   </div>

//                   <div className="network_form_group">
//                     <label htmlFor="virtual_socket">가상 소켓</label>
//                     <select
//                       id="virtual_socket"
//                       value={cpuTopologySocket} // 현재 상태 값
//                       onChange={(e) => setCpuTopologySocket(e.target.value)} // 상태 업데이트
//                     >
//                       {editMode ? (
//                         // 편집 모드일 때 vm 값만 옵션으로 표시
//                         <option value={vm?.cpuTopologySocket || ""}>
//                           {vm?.cpuTopologySocket || "옵션 없음"}
//                         </option>
//                       ) : (
//                         // 생성 모드일 때 기본 옵션 목록 표시
//                         <>
//                           <option value="">가상 소켓 선택</option>
//                           <option value="1">1</option>
//                         </>
//                       )}
//                     </select>
//                   </div>

//                   <div className="network_form_group">
//                     <label htmlFor="core_per_socket">가상 소켓 당 코어</label>
//                     <select
//                       id="core_per_socket"
//                       value={cpuTopologyCore} // 현재 상태 값
//                       onChange={(e) => setCpuTopologyCore(e.target.value)} // 상태 업데이트
//                     >
//                       {editMode ? (
//                         // 편집 모드일 때 vm 값만 옵션으로 표시
//                         <option value={vm?.cpuTopologyCore || ""}>
//                           {vm?.cpuTopologyCore || "옵션 없음"}
//                         </option>
//                       ) : (
//                         <>
//                           <option value="">코어 수 선택</option>
//                           <option value="1">1</option>
//                         </>
//                       )}
//                     </select>
//                   </div>

//                   <div className="network_form_group">
//                     <label htmlFor="thread_per_core">코어당 스레드</label>
//                     <select
//                       id="thread_per_core"
//                       value={cpuTopologyThread} // 현재 상태 값
//                       onChange={(e) => setCpuTopologyThread(e.target.value)} // 상태 업데이트
//                     >
//                       {editMode ? (
//                         // 편집 모드일 때 vm 값만 옵션으로 표시
//                         <option value={vm?.cpuTopologyThread || ""}>
//                           {vm?.cpuTopologyThread || "옵션 없음"}
//                         </option>
//                       ) : (
//                         // 생성 모드일 때 기본 옵션 목록 표시
//                         <>
//                           <option value="">스레드 수 선택</option>
//                           <option value="1">1</option>
//                           <option value="2">2</option>
//                         </>
//                       )}
//                     </select>
//                   </div>
//                 </div>
//               </>
//             )}
//             {selectedModalTab === "beginning" && (
//               <>
//                 <div className="p-1.5">
//                   <div className="checkbox_group mb-1.5">
//                     <input
//                       type="checkbox"
//                       id="enableBootMenu"
//                       name="enableBootMenu"
//                       checked={cloudInit} // cloudInit 상태를 checked 속성에 바인딩
//                       onChange={(e) => {
//                         setCloudInit(e.target.checked); // 상태 업데이트
//                         if (!e.target.checked) {
//                           setDomainHiddenBoxVisible(false); // 체크 해제 시 숨김 처리
//                         }
//                       }}
//                     />
//                     <label htmlFor="enableBootMenu">Cloud-lnit</label>
//                   </div>

//                   {cloudInit && ( // Cloud-init이 체크된 경우에만 표시
//                     <div>
//                       <FontAwesomeIcon
//                         icon={faChevronCircleRight}
//                         id="domain_hidden_box_btn2"
//                         onClick={toggleDomainHiddenBox}
//                         fixedWidth
//                       />
//                       <span>사용자 지정 스크립트</span>
//                       <div
//                         className="mt-0.5"
//                         id="domain_hidden_box2"
//                         style={{
//                           display: isDomainHiddenBoxVisible ? "block" : "none",
//                         }} // 상태에 따라 표시 여부 제어
//                       >
//                         <textarea
//                           name="content"
//                           cols="40"
//                           rows="8"
//                           placeholder="여기에 스크립트를 입력하세요"
//                           value={script} // script 상태와 바인딩
//                           onChange={(e) => setScript(e.target.value)} // 상태 업데이트
//                         />
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </>
//             )}
//             {selectedModalTab === "host" && (
//               <>
//                 <div className="host-second-content">
//                   <div style={{ fontWeight: 600 }}>실행 호스트:</div>
//                   <div className="form-checks">
//                     <div>
//                       <input
//                         className="form-check-input"
//                         type="radio"
//                         name="hostSelection"
//                         id="flexRadioDefault1"
//                         checked={!isSpecificHostSelected}
//                         onChange={() => setIsSpecificHostSelected(false)} // 기본 클러스터 선택
//                       />
//                       <label
//                         className="form-check-label"
//                         htmlFor="flexRadioDefault1"
//                       >
//                         클러스터 내의 호스트
//                       </label>
//                     </div>
//                     <div>
//                       <div>
//                         <input
//                           className="form-check-input"
//                           type="radio"
//                           name="hostSelection"
//                           id="flexRadioDefault2"
//                           checked={isSpecificHostSelected}
//                           onChange={(e) => setIsSpecificHostSelected(true)} // 특정 호스트 선택
//                         />
//                         <label
//                           className="form-check-label"
//                           htmlFor="flexRadioDefault2"
//                         >
//                           특정 호스트
//                         </label>
//                       </div>
//                       <div>
//                         <select
//                           id="specific_host_select"
//                           disabled={!isSpecificHostSelected} // 특정 호스트 선택 여부에 따라 활성화
//                         >
//                           {hostsFromCluster.map((host) => (
//                             <option key={host.id} value={host.id}>
//                               {host.name}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="host-third-content">
//                   <div style={{ fontWeight: 600 }}>마이그레이션 옵션:</div>
//                   {/* 마이그레이션 모드 */}
//                   <div>
//                     <label htmlFor="migration_mode">마이그레이션 모드</label>
//                     <select
//                       id="migration_mode"
//                       value={migrationMode}
//                       onChange={(e) => setMigrationMode(e.target.value)}
//                     >
//                       {migrationModeOptions.map((option) => (
//                         <option key={option.value} value={option.value}>
//                           {option.label}
//                         </option>
//                       ))}
//                     </select>
//                     <p>
//                       선택된 마이그레이션 모드:{" "}
//                       {migrationModeOptions.find(
//                         (option) => option.value === migrationMode
//                       )?.label || "선택되지 않음"}
//                     </p>
//                   </div>
//                   {/* 마이그레이션 정책 */}
//                   <div>
//                     <label htmlFor="migration_policy">마이그레이션 정책</label>
//                     <select
//                       id="migration_policy"
//                       value={migrationPolicy}
//                       onChange={(e) => setMigrationPolicy(e.target.value)}
//                     >
//                       {migrationPolicyOptions.map((option) => (
//                         <option key={option.value} value={option.value}>
//                           {option.label}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <div>
//                       <span>마이그레이션 병행</span>
//                       <FontAwesomeIcon
//                         icon={faInfoCircle}
//                         style={{ color: "rgb(83, 163, 255)" }}
//                         fixedWidth
//                       />
//                     </div>
//                     <select id="parallel_migrations" readOnly>
//                       <option value="클러스터 기본값(Disabled)">
//                         클러스터 기본값(Disabled)
//                       </option>
//                     </select>
//                   </div>

//                   <div className="network_checkbox_type1 disabled">
//                     <label htmlFor="memory_size">마이그레이션 병행 개수</label>
//                     <input
//                       type="text"
//                       id="memory_size"
//                       value=""
//                       readOnly
//                       disabled
//                     />
//                   </div>
//                 </div>
//               </>
//             )}
//             {selectedModalTab === "ha_mode" && (
//               <>
//                 <div className="ha-mode-second-content">
//                   <div className="checkbox_group">
//                     <input
//                       className="check_input"
//                       type="checkbox"
//                       id="ha_mode_box"
//                       checked={ha} // ha 상태와 체크박스 동기화
//                       onChange={(e) => setHa(e.target.checked)} // 체크 변경 시 ha 상태 업데이트
//                     />
//                     <label className="check_label" htmlFor="ha_mode_box">
//                       고가용성
//                     </label>
//                   </div>

//                   <div>
//                     <div>
//                       <span>가상 머신 임대 대상 스토리지 도메인</span>
//                       <FontAwesomeIcon
//                         icon={faInfoCircle}
//                         style={{ color: "rgb(83, 163, 255)" }}
//                         fixedWidth
//                       />
//                     </div>
//                     <select id="no_lease" disabled={!ha}>
//                       {" "}
//                       {/* ha가 false면 disabled */}
//                       <option value="가상 머신 임대 없음">
//                         가상 머신 임대 없음
//                       </option>
//                     </select>
//                   </div>

//                   <div>
//                     <div>
//                       <span>재개 동작</span>
//                       <FontAwesomeIcon
//                         icon={faInfoCircle}
//                         style={{ color: "rgb(83, 163, 255)" }}
//                         fixedWidth
//                       />
//                     </div>
//                     <select id="force_shutdown">
//                       <option value="강제 종료">강제 종료</option>
//                     </select>
//                   </div>

//                   <div className="ha-mode-article">
//                     <span>실행/마이그레이션 큐에서 우선순위 : </span>
//                     <div>
//                       <span>우선 순위</span>
//                       <select
//                         id="priority"
//                         value={priority} // 선택된 값
//                         onChange={(e) =>
//                           setPriority(parseInt(e.target.value, 10))
//                         } // 값 업데이트
//                       >
//                         {priorityOptions.map((option) => (
//                           <option key={option.value} value={option.value}>
//                             {option.label}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             )}
//             {selectedModalTab === "boot_outer" && (
//               <>
//                 <div className="boot_outer_content">
//                   <div className="cpu-res">
//                     <span style={{ fontWeight: 600 }}>부트순서:</span>
//                     <div className="cpu-res-box">
//                       <span>첫 번째 장치</span>
//                       <select
//                         id="first_boot_device"
//                         value={firstDevice} // 선택된 값
//                         onChange={(e) => setFirstDevice(e.target.value)} // 값 변경 핸들러
//                       >
//                         {firstDeviceOptions.map((option) => (
//                           <option key={option.value} value={option.value}>
//                             {option.label}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div className="cpu-res-box">
//                       <span>두 번째 장치</span>
//                       <select
//                         id="second_boot_device"
//                         value={secDevice} // 선택된 값
//                         onChange={(e) => setSecDevice(e.target.value)} // 값 업데이트
//                       >
//                         {secDeviceOptions.map((option) => (
//                           <option key={option.value} value={option.value}>
//                             {option.label}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>

//                   <div className="boot-checkboxs">
//                     <div>
//                       <div className="checkbox_group">
//                         <input
//                           type="checkbox"
//                           id="connectCdDvd"
//                           name="connectCdDvd"
//                           checked={isCdDvdChecked} // 체크박스 상태
//                           onChange={handleCdDvdCheckboxChange} // 핸들러 호출
//                         />
//                         <label htmlFor="connectCdDvd">CD/DVD 연결</label>
//                       </div>
//                       <div className="text_icon_box">
//                         <select
//                           id="cd_dvd_select"
//                           disabled={!isCdDvdChecked || cdList.length === 0} // 체크 여부와 데이터 유무에 따라 비활성화
//                           value={connVoId}
//                           onChange={handleCdDvdChange} // 핸들러 호출
//                         >
//                           <option value="">CD/DVD 선택...</option>
//                           {cdList.map((cd) => (
//                             <option key={cd.id} value={cd.id}>
//                               {cd.name}
//                             </option>
//                           ))}
//                         </select>
//                         <FontAwesomeIcon
//                           icon={faInfoCircle}
//                           style={{ color: "rgb(83, 163, 255)" }}
//                           fixedWidth
//                         />
//                       </div>
//                     </div>

//                     <div className="checkbox_group mb-1.5">
//                       <input
//                         className="check_input"
//                         type="checkbox"
//                         id="enableBootMenu"
//                         checked={bootingMenu} // bootingMenu 상태와 동기화
//                         onChange={(e) => setBootingMenu(e.target.checked)} // 상태 업데이트
//                       />
//                       <label className="check_label" htmlFor="enableBootMenu">
//                         부팅 메뉴를 활성화
//                       </label>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>

//         <div className="edit-footer">
//           <button onClick={handleFormSubmit}>
//             {editMode ? "편집" : "생성"}
//           </button>
//           <button onClick={onClose}>취소</button>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default VmModal;
