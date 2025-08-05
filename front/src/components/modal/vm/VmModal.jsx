import { useState, useEffect, useMemo } from "react";
import CONSTANT                         from "@/Constants";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import useGlobal                        from "@/hooks/useGlobal";
import { Separator }                    from "@/components/ui/separator"
import TabNavButtonGroup                from "@/components/common/TabNavButtonGroup";
import BaseModal                        from "@/components/modal/BaseModal";
import LabelSelectOptions               from '@/components/label/LabelSelectOptions';
import LabelSelectOptionsID             from '@/components/label/LabelSelectOptionsID';
import { handleInputChange, handleSelectIdChange } from "@/components/label/HandleInput";
import {
  useAddVm,
  useEditVm,
  useAllUpClusters,
  useCdromFromDataCenter,
  useHostsFromCluster,
  useAllActiveDomainsFromDataCenter,
  useAllOpearatingSystemsFromCluster,
  useAllBiosTypes,
  useAllVmTypes,
  useFindTemplatesFromDataCenter,
  useAllVnicsFromCluster,
  useAllNicsFromTemplate,
  useVm4Edit,
  useAllDiskAttachmentsFromVm,
  useNetworkInterfacesFromVM,
  useAllVMs, 
} from '@/api/RQHook';
import VmCommon from './create/VmCommon';
import VmNic from './create/VmNic';
import VmDisk from './create/VmDisk';
import VmSystem from './create/VmSystem';
import VmInit from './create/VmInit';
import VmHost from './create/VmHost';
import VmConsole from "./create/VmConsole";
import VmHa from './create/VmHa';
import VmBoot from './create/VmBoot';
import {
  checkDuplicateName, 
  checkName,
  emptyIdNameVo
} from "@/util";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";
import './MVm.css';


// 일반
const infoform = {
  id: "",
  name: "",
  description: "",
  comment: "",
  osType: "other_linux",
  biosType: "q35_ovmf",
  optimizeOption: "server",
};

//시스템
const systemForm = {
  memorySize: 1, // 메모리 크기 in GB
  memoryMax: (1 * 4), // 최대 메모리 in GB
  memoryGuaranteed: 1, // 할당할 실제메모리 in GB
  cpuTopologyCnt: 1, // 총cpu
  cpuTopologyCore: 1, // 가상 소켓 당 코어
  cpuTopologySocket: 1, // 가상소켓
  cpuTopologyThread: 1, //코어당 스레드
};

// 초기실행
const cloudForm = {
  cloudInit: false, // Cloud-lnit
  script: "", // 스크립트
};

// 호스트
const hostForm = {
  hostInCluster: true, // 클러스터 내 호스트 버튼
  hostVos: [],
  migrationMode: "migratable", // 마이그레이션 모드
  // migrationEncrypt: 'INHERIT',  // 암호화
  // migrationPolicy: 'minimal_downtime',// 마이그레이션 정책
};

// 고가용성
const haForm = {
  ha: false, // 고가용성(체크박스)
  haPriority: 1, // 초기값
  storageDomainVo: emptyIdNameVo(),
};

// 콘솔
const consoleForm = {
  displayType: "vga",
  videoType: "vnc",
  consoleDisconnet: "",
};

// 부트옵션
const bootForm = {
  firstDevice: "hd", // 첫번째 장치
  secDevice: "", // 두번째 장치
  isCdDvdChecked: false, // cd/dvd 연결 체크박스
  cdRomVo: emptyIdNameVo(), // iso 파일
  biosBootMenu: false, // 부팅메뉴 활성화
};

const defaultNic = {
  id: "", 
  name: "nic1",
  vnicProfileVo: emptyIdNameVo(),
  networkVo: emptyIdNameVo(),
};


const VmModal = ({ 
  isOpen, 
  onClose, 
  editMode=false,
  // copyMode=false,
}) => {
  const { validationToast } = useValidationToast();
  const vLabel = editMode 
    ? Localization.kr.UPDATE : Localization.kr.CREATE;
    // : copyMode 
      // ? Localization.kr.COPY 
      
  const { 
    vmsSelected, templatesSelected, hostsSelected
  } = useGlobal();
  const vmId = useMemo(() => [...vmsSelected][0]?.id, [vmsSelected]);
  const templateId = templatesSelected[0]?.id;

  const [selectedModalTab, setSelectedModalTab] = useState("common");
  const tabs = useMemo(() => [
    { id: "common",    label: Localization.kr.GENERAL, onClick: () => setSelectedModalTab("common") },
    { id: "system",    label: Localization.kr.SYSTEM,  onClick: () => setSelectedModalTab("system") },
    { id: "beginning", label: "초기 실행",              onClick: () => setSelectedModalTab("beginning") },
    { id: "console",   label: Localization.kr.CONSOLE, onClick: () => setSelectedModalTab("console") },
    { id: "host",      label: Localization.kr.HOST,    onClick: () => setSelectedModalTab("host") },
    { id: "ha",        label: Localization.kr.HA,      onClick: () => setSelectedModalTab("ha") },
    { id: "boot",      label: "부트 옵션", onClick: () => setSelectedModalTab("boot") },
  ], []);

  const [formInfoState, setFormInfoState] = useState(infoform);
  const [formSystemState, setFormSystemState] = useState(systemForm);
  const [formCloudState, setFormCloudState] = useState(cloudForm);
  const [formConsoleState, setFormConsoleState] = useState(consoleForm);
  const [formHostState, setFormHostState] = useState({
    ...hostForm,
  });
  const [formHaState, setFormHaState] = useState(haForm);
  const [formBootState, setFormBootState] = useState(bootForm);

  const [architecture, setArchitecture] = useState("");
  const [dataCenterVo, setDataCenterVo] = useState(emptyIdNameVo());
  const [clusterVo, setClusterVo] = useState(emptyIdNameVo());
  const [templateVo, setTemplateVo] = useState(emptyIdNameVo());
  const [diskListState, setDiskListState] = useState([]);
  const [nicListState, setNicListState] = useState([ defaultNic ]);
  const [fetchIsosOnce, setFetchIsosOnce] = useState(false);
  
  const { mutate: addVM } = useAddVm(
    (result) => {
      if (!result?.id) {
        validationToast.fail("VM 생성 실패: ID가 반환되지 않았습니다.");
        return;
      }
      Logger.info("생성된 VM ID:", result.id);
      onClose();
    },
    (error) => {
      validationToast.fail("VM 생성 실패: " + error?.message);
      Logger.error("VM 생성 에러:", error);
    }
  );
  const { mutate: editVM } = useEditVm(onClose, onClose);

  // 가상머신 상세데이터 가져오기
  const {
    data: vm,
    isLoading: isVmLoading,
    isSuccess: isVmSuccess,
    isError: isVmError,
  } = useVm4Edit(vmId);

  const { data: vms } = useAllVMs();

  // 클러스터 목록 가져오기
  const { 
    data: clusters = [], 
    isLoading: isClustersLoading,
    isSuccess: isClustersSuccess
  } = useAllUpClusters((e) => ({ ...e }));

  // 템플릿 가져오기
  const { 
    data: templates = [], 
    isLoading: isTemplatesLoading,
    isSuccess: isTemplatesSuccess
  } = useFindTemplatesFromDataCenter(dataCenterVo.id, (e) => ({ ...e }));

  // 템플릿 id변경 시 NIC 초기화
  const {
    data: vnicProfilesFromTemplate = []
  } = useAllNicsFromTemplate(templateVo.id);

  // 클러스터가 가지고 있는 nic 목록 가져오기
  const { 
    data: nics = [], 
    isLoading: isNicsLoading 
  } = useAllVnicsFromCluster(clusterVo.id, (e) => ({ ...e }));

  // 편집: 가상머신이 가지고 있는 디스크 목록 가져오기
  const { 
    data: diskAttachments = [] 
  } = useAllDiskAttachmentsFromVm(vm?.id);

  const {
    data: vnics = [],
    isLoading: isvNicsLoading,
  } = useNetworkInterfacesFromVM(vm?.id);

  // 클러스터가 가지고 있는 호스트 목록 가져오기
  const { 
    data: hosts = [], 
    isLoading: isHostsLoading 
  } = useHostsFromCluster(clusterVo.id, (e) => ({ ...e }));

  // 클러스터가 가지고 있는 운영시스템 목록 가져오기
  const { 
    data: osList = [], 
    isLoading: isOsListLoading,
    isSuccess: isOsListSuccess
  } = useAllOpearatingSystemsFromCluster(clusterVo.id, (e) => ({ ...e }));

  // 불가능한 운영체제 (보류)
  const unsupportedOSList = [
    "Red Hat Enterprise Linux 3",
    "Red Hat Enterprise Linux 4",
    "Windows XP",
    "Windows 2000",
    "Ubuntu 10.04",
  ];

  // 칩셋 목록 가져오기
  const {
    data: biosTypes = [],
    isLoading: isBiosTypesLoading
  } = useAllBiosTypes((e) => ({ 
    ...e,
    value: e?.id,
    label: e?.kr
  }))

  // 최적화 옵션 가져오기
  const {
    data: vmTypes = [],
    isLoading: isVmTypesLoading
  } = useAllVmTypes((e) => ({ 
    ...e,
    value: e?.id?.toLowerCase(),
    label: e?.kr
  }))


  // 고가용성 - 임대대상 스토리지 도메인
  // 부팅디스크에 해당하는 스토리지 도메인이 우선 지정되어야하는듯 함 (일단 보류)
  const { 
    data: domains = [], 
    isLoading: isDomainsLoading 
  } = useAllActiveDomainsFromDataCenter(dataCenterVo.id, (e) => ({ ...e }));

  // 부트 옵션 - cd/dvd 연결
  const { 
    data: isos = [], 
    isLoading: isIsoLoading,
  } = useCdromFromDataCenter(dataCenterVo.id, (e) => ({ 
    ...e
  }), fetchIsosOnce, setFetchIsosOnce);


  // 초기값 설정
  useEffect(() => {
    setFetchIsosOnce(true)
    if (!isOpen) {
      setSelectedModalTab("common"); // 탭 상태 초기화
      setFormInfoState(infoform);
      setFormSystemState(systemForm);
      setFormCloudState(cloudForm);
      setFormHostState(hostForm);
      setFormHaState(haForm);
      setFormConsoleState(consoleForm);
      setFormBootState(bootForm);
      setDataCenterVo(emptyIdNameVo())
      setClusterVo(emptyIdNameVo())
      setTemplateVo(emptyIdNameVo())
      setNicListState([ defaultNic ]);
      setDiskListState([]);
    }
    if (editMode && vm) { 
    //if (editMode && vm && !formInfoState.id) { 
      setFormInfoState({
        id: vm?.id || "",
        name: vm?.name || "",
        description: vm?.description || "",
        comment: vm?.comment || "",
        osType: vm?.osType || "",
        biosType: vm?.biosType || "q35_ovmf",
        optimizeOption: vm?.optimizeOption?.toLowerCase() || "server",
      });
      setFormSystemState({
        memorySize: vm?.memorySize / (CONSTANT.GIB_IN_BYTE), // 입력된 값는 GiB, 보낼 단위는 byte
        memoryMax: vm?.memoryMax / (CONSTANT.GIB_IN_BYTE),
        memoryGuaranteed: vm?.memoryGuaranteed / (CONSTANT.GIB_IN_BYTE),
        cpuTopologyCnt: vm?.cpuTopologyCnt ?? 1,
        cpuTopologyCore: vm?.cpuTopologyCore ?? 1,
        cpuTopologySocket: vm?.cpuTopologySocket ?? 1,
        cpuTopologyThread: vm?.cpuTopologyThread ?? 1,
      });
      setFormCloudState({
        cloudInit: vm?.cloudInit || false,
        script: vm?.setScript || "",
      });
      setFormHostState({
        hostInCluster: vm?.hostInCluster || true,
        hostVos: (vm?.hostVos || [])?.map((h) => {
          return { id: h.id, name: h.name}}),
        migrationMode: vm?.migrationMode || "migratable",
      });
      setFormHaState({
        ha: vm?.ha,
        haPriority: vm?.haPriority || 1,
        storageDomainVo: {
          id: vm?.storageDomainVo?.id,
        }
      });
      setFormConsoleState({
        videoType: vm?.videoType || "vga",
        displayType: vm?.displayType || "vnc",
      });
      setFormBootState({
        firstDevice: vm?.firstDevice || "hd",
        secDevice: vm?.secDevice || "",
        isCdDvdChecked: !vm?.cdRomVo?.id,
        cdRomVo: {
          id: vm?.cdRomVo?.id, 
          name: "" 
        },
        biosBootMenu: vm?.biosBootMenu || false, 
      });
      setArchitecture("");
      setDataCenterVo({ 
        id: vm?.dataCenterVo?.id, 
        name: vm?.dataCenterVo?.name 
      })
      setClusterVo({ 
        id: vm?.clusterVo?.id, 
        name: vm?.clusterVo?.name 
      })
      setTemplateVo({ 
        id: vm?.templateVo?.id, 
        name: vm?.templateVo?.name 
      })
    } 
  }, [isOpen, editMode, vm]);

  // 클러스터 변경에 따른 결과
  useEffect(() => {
    if (!clusterVo.id) return;
    
    const selectedCluster = clusters.find((c) => c.id === clusterVo.id);
    if (selectedCluster) {
      setDataCenterVo((prev) => {
        return prev.id !== selectedCluster.dataCenterVo?.id
          ? { 
            id: selectedCluster.dataCenterVo?.id || "", 
            name: selectedCluster.dataCenterVo?.name || "" 
          }
          : prev;
      });

      setArchitecture(selectedCluster.cpuArc || "");

      if (!editMode) {
        const newOsSystem = osList.length > 0 ? osList[0].name : "other_linux";
        if (formInfoState.osSystem !== newOsSystem) {
          setFormInfoState((prev) => ({...prev, osSystem: newOsSystem }));
        }
      }
    }
  }, [clusterVo.id, clusters, osList.length, editMode]);


  // 초기화 작업
  useEffect(() => {
    if (!editMode && clusters && clusters.length > 0) {
      
      const defaultC = clusters.find(c => c.name === "Default"); // 만약 "Default"라는 이름이 있다면 우선 선택
      if (defaultC) {
        setClusterVo({ 
          id: defaultC.id, 
          name: defaultC.name 
        });
        setDataCenterVo({ 
          id: defaultC.dataCenterVo?.id || "", 
          name: defaultC.dataCenterVo?.name || "" 
        });
        setArchitecture(defaultC.cpuArc || "");
      } else {
        const firstCluster = clusters[0];
        setClusterVo({
          id: firstCluster.id, 
          name: firstCluster.name
        });
        setDataCenterVo({
          id: firstCluster.dataCenterVo?.id || "", 
          name: firstCluster.dataCenterVo?.name || ""
        });
        setArchitecture(firstCluster.cpuArc || "");
      }      
    }
  }, [isOpen, clusters, editMode]);
  
  useEffect(() => {
    if (!editMode && isOpen && templateVo.id) {
      if (vnicProfilesFromTemplate.length > 0) {
        // NIC 정보가 있을 때
        const formatted = vnicProfilesFromTemplate.map((nic) => ({
          id: "",
          name: nic.name || "", // 기존 NIC 이름 유지
          vnicProfileVo: {
            id: nic.vnicProfileVo?.id || "",
            name: nic.vnicProfileVo?.name || "",
          },
          networkVo: {
            id: nic.networkVo?.id || "",
            name: nic.networkVo?.name || "",
          },
        }));
        setNicListState(formatted);
      } else {
        // NIC 정보가 없을 때 → 기본 nic1 세팅
        setNicListState([ defaultNic ]);
      }
    }
  }, [templateVo.id, isOpen, editMode, vnicProfilesFromTemplate]);

  useEffect(() => {
    if (!editMode && isOpen && templates.length > 0) {
      if (templateId) {
        const found = templates.find(t => t.id === templateId);
        if (found) {
          setTemplateVo({ 
            id: found.id, 
            name: found.name 
          });
        }
      } else {
        setTemplateVo({ 
          id: CONSTANT.templateIdDefault 
        });
      }
    }
  }, [isOpen, templates, editMode, templateId]);

  useEffect(() => {
    if (editMode && [...diskAttachments].length > 0) {
      setDiskListState([...diskAttachments].map((d) => ({
        id: d?.id,
        alias: d?.diskImageVo?.alias,
        size: d?.diskImageVo?.virtualSize
          ? d?.diskImageVo?.virtualSize / (1024 * 1024 * 1024)
          : 0,
        virtualSize: d?.diskImageVo?.virtualSize
          ? d?.diskImageVo?.virtualSize / (1024 * 1024 * 1024)
          : 0,
        interface_: d?.interface_ || "VIRTIO_SCSI",
        readOnly: d?.readOnly || false,
        bootable: d?.bootable || false,
        storageDomainVo: { id: d?.diskImageVo?.storageDomainVo?.id || "" },
        diskProfileVo: { id: d?.diskImageVo?.diskProfileVo?.id || "" },
        isExisting: true,
      })));
    }
  }, [editMode, diskAttachments]);

  useEffect(() => {
    if (editMode && [...vnics].length > 0) {
      setNicListState([...vnics].map((nic) => ({
        id: nic?.id || "",
        name: nic?.name || "",
        vnicProfileVo: {
          id: nic?.vnicProfileVo?.id || "",
          name: nic?.vnicProfileVo?.name || "",
        },
        networkVo: {
          id: nic?.networkVo?.id || "",
          name: nic?.networkVo?.name || "",
        },
      })));
    }
  }, [editMode, vnics]);

  
  useEffect(() => {
    if (!editMode && [...hostsSelected].length > 0) {
      setFormHostState((prev) => ({
        ...prev,
        hostVos: ([...hostsSelected]).map((h) => ({
          id: h?.id,
          name: h?.name
        }))
      }));
    }
  }, [editMode, hostsSelected]);


  useEffect(() => {
    const selectedOS = formInfoState.osType;
    const found = unsupportedOSList.includes(selectedOS);
    if (isOpen && found) {
      validationToast.fail(`${selectedOS} 운영체제는 사용할 수 없습니다.`);
    }
  }, [formInfoState.osType, isOpen]);
    
  // 템플릿항목 숨기는 조건
  const isTemplateHidden = editMode && templateVo.id === CONSTANT.templateIdDefault;
  
  const dataToSubmit = {
    // VmInfo
    ...formInfoState,
    osType: formInfoState.osType,
    biosType: formInfoState.biosType,
    optimizeOption: formInfoState.optimizeOption,
    clusterVo,
    templateVo,

    ...formSystemState,
    memorySize: formSystemState.memorySize * 1024 * 1024 * 1024, 
    memoryMax: formSystemState.memoryMax * 1024 * 1024 * 1024,
    memoryGuaranteed: formSystemState.memoryGuaranteed * 1024 * 1024 * 1024,
    
    // VmInit
    ...formCloudState,
    
    // VmConsole
    ...formConsoleState,

    // VmHost
    ...formHostState,
    hostVos: (formHostState.hostVos || []).map((host) => ({ id: host.id })),

    // VmHa
    ...formHaState,
    storageDomainVo: {
      id: formHaState.storageDomainVo.id,
      name: formHaState.storageDomainVo.name
    },

    // VmBoot
    ...formBootState,

    // nic 목록
    nicVos: nicListState
      .filter(nic => !!nic?.vnicProfileVo?.id)
      .map(nic => ({
        id: nic?.id || "",
        name: nic?.name || "",
        vnicProfileVo: {
          id: nic.vnicProfileVo.id
        }
      })),

    // 디스크 데이터 (객체 형태 배열로 변환)
    diskAttachmentVos: diskListState
      .filter((disk) => !disk.deleted)
      .map((disk) => ({
        id: disk?.id || "",
        active: true,
        bootable: disk?.bootable,
        readOnly: disk?.readOnly,
        passDiscard: false,
        interface_: disk?.interface_,
        diskImageVo: {
          id: disk?.id || "", // 기존 디스크 ID (새 디스크일 경우 빈 문자열)
          size: disk?.size * 1024 * 1024 * 1024 || 0, // GB → Bytes 변환
          // appendSize: 0, // 임시
          alias: disk?.alias,
          description: disk?.description || "",
          storageDomainVo: { id: disk?.storageDomainVo?.id || "" },
          diskProfileVo: { id: disk?.diskProfileVo?.id || "" },
          sparse: disk?.sparse,
          wipeAfterDelete: disk?.wipeAfterDelete || false,
          sharable: disk?.sharable || false,
          backup: disk?.backup || false,
        },
      })),    
  };

  Logger.debug(`VmModal ... formHaState.storageDomainVo: `, formHaState.storageDomainVo);
  const validateForm = () => {
    const nameError = checkName(formInfoState.name);
    if (nameError) return nameError;
    
    const duplicateError = checkDuplicateName(vms, formInfoState.name, formInfoState.id);
    if (duplicateError) return duplicateError;

    if (!clusterVo.id) return `${Localization.kr.CLUSTER}를 선택해주세요.`;
    if(formSystemState.memorySize < formSystemState.memoryGuaranteed) return `최대 메모리 크기는 ${formSystemState.memorySize}입니다`
    return null;
  };

  const handleFormSubmit = (e) => {
    // 디스크  연결은 id값 보내기 생성은 객체로 보내기
    e.preventDefault();
    const error = validateForm();
    if (error) {
      validationToast.fail(error);
      return;
    }
    Logger.debug(`VmModal > handleFormSubmit ... dataToSubmit: `, dataToSubmit);
    editMode
      ? editVM({ vmId: vmId, vmData: dataToSubmit })
      : addVM(dataToSubmit);
  };

  return (
    <BaseModal targetName={Localization.kr.VM} submitTitle={vLabel}  
      isOpen={isOpen} onClose={onClose} 
      isReady={editMode
        ? (isClustersSuccess && isTemplatesSuccess && isOsListSuccess && !!vm)
        : (isClustersSuccess && isTemplatesSuccess && isOsListSuccess)
      }
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "850px", height: "730px" }}  
    >
      <div className="popup-content-outer flex">
        {/* 왼쪽 네비게이션 */}
        <TabNavButtonGroup  tabs={tabs} tabActive={selectedModalTab} />

        <div className="vm-edit-select-tab">
          <div className="edit-first-content pb-0.5">
            <LabelSelectOptionsID label={Localization.kr.CLUSTER}
              value={clusterVo.id}
              disabled={editMode}
              loading={isClustersLoading}
              options={clusters}
              onChange={handleSelectIdChange(setClusterVo, clusters, validationToast)}            
              etcLabel={`[${Localization.kr.DATA_CENTER}: ${dataCenterVo.name}]`}
            />
            {!isTemplateHidden && (
              <LabelSelectOptionsID label={Localization.kr.TEMPLATE}
                value={templateVo.id}
                disabled={editMode}
                loading={isTemplatesLoading}
                options={templates}
                onChange={handleSelectIdChange(setTemplateVo, templates, validationToast)}
              />
            )}
            <LabelSelectOptionsID label={Localization.kr.OPERATING_SYSTEM}
              value={formInfoState.osType}
              options={osList.map((opt) => ({ id: opt.name, name: opt.description }))}
              loading={isOsListLoading}
              onChange={handleInputChange(setFormInfoState, "osType", validationToast) }
            />
            <LabelSelectOptions label="칩셋/펌웨어 유형"
              value={formInfoState.biosType}
              disabled={["PPC64", "S390X"].includes(architecture)}
              options={biosTypes}
              loading={isBiosTypesLoading}
              onChange={handleInputChange(setFormInfoState, "biosType", validationToast) }
            />
            <LabelSelectOptions label="최적화 옵션"
              value={formInfoState.optimizeOption}
              options={vmTypes}
              loading={isVmTypesLoading}
              onChange={handleInputChange(setFormInfoState, "optimizeOption", validationToast)}
            />
          </div>
          <Separator />
          {selectedModalTab === "common" && (
            <>
              <VmCommon
                formInfoState={formInfoState}
                setFormInfoState={setFormInfoState}
              />
              {/* {!copyMode && ( */}
              <VmDisk
                editMode={editMode}
                vm={vm}
                vmName={formInfoState.name}
                dataCenterId={dataCenterVo.id}
                diskListState={diskListState} setDiskListState={setDiskListState}
                disabled={templateVo.id !== CONSTANT.templateIdDefault} // 기본템플릿이 아닐때는 버튼 disabled처리
              />
              {/* )} */}
              <VmNic editMode={editMode}
                nics={nics}
                nicsState={nicListState}
                setNicsState={setNicListState}
              />
            </>
          )}
          {selectedModalTab === "system" && (
            <VmSystem 
              formSystemState={formSystemState} 
              setFormSystemState={setFormSystemState}
            />
          )}
          {selectedModalTab === "beginning" && (
            <VmInit
              formCloudState={formCloudState}
              setFormCloudState={setFormCloudState}
            />
          )}
          {selectedModalTab === "host" && (
            <VmHost
              hosts={hosts}
              formHostState={formHostState}
              setFormHostState={setFormHostState}
            />
          )}
          {selectedModalTab === "console" && (
            <VmConsole
              formConsoleState={formConsoleState}
              setFormConsoleState={setFormConsoleState}
            />
          )}
          {selectedModalTab === "ha" && (
            <VmHa
              editMode={editMode}
              domains={domains}
              formHaState={formHaState}
              setFormHaState={setFormHaState}
            />
          )}
          {selectedModalTab === "boot" && (
            <VmBoot isos={isos}
              isIsoLoading={isIsoLoading}
              formBootState={formBootState}
              setFormBootState={setFormBootState}
              setFetchIsosOnce={setFetchIsosOnce}
            />
          )}
        </div>
      </div>
    </BaseModal>
  );
};

export default VmModal;
