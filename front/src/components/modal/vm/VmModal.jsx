import { useState, useEffect, useMemo } from "react";
import CONSTANT                         from "@/Constants";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import useGlobal                        from "@/hooks/useGlobal";
import TabNavButtonGroup                from "@/components/common/TabNavButtonGroup";
import BaseModal                        from "../BaseModal";
import LabelSelectOptions               from '@/components/label/LabelSelectOptions';
import LabelSelectOptionsID             from '@/components/label/LabelSelectOptionsID';
import { handleInputChange, handleSelectIdChange } from "../../label/HandleInput";
import {
  useAddVm,
  useEditVm,
  useAllUpClusters,
  useCDFromDataCenter,
  useHostsFromCluster,
  useAllActiveDomainsFromDataCenter,
  useOsSystemsFromCluster,
  useAllBiosTypes,
  useFindTemplatesFromDataCenter,
  useAllVnicsFromCluster,
  useAllNicsFromTemplate,
  useVm, 
} from '@/api/RQHook';
import VmCommon from './create/VmCommon';
import VmNic from './create/VmNic';
import VmDisk from './create/VmDisk';
import VmSystem from './create/VmSystem';
import VmInit from './create/VmInit';
import VmHost from './create/VmHost';
import VmHa from './create/VmHa';
import VmBoot from './create/VmBoot';
import { checkName }                    from "@/util";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";
import './MVm.css';

//시스템
const systemForm = {
  memorySize: 1024, // 메모리 크기
  memoryMax: (1024*4), // 최대 메모리
  memoryGuaranteed: 1024, // 할당할 실제메모리
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
  storageDomainVo: { id: "", name: "" },
};

// 부트옵션
const bootForm = {
  firstDevice: "hd", // 첫번째 장치
  secDevice: "", // 두번째 장치
  isCdDvdChecked: false, // cd/dvd 연결 체크박스
  cdRomVo: { id: "", name: "" }, // iso 파일
  biosBootMenu: false, // 부팅메뉴 활성화
};

const VmModal = ({ 
  isOpen, 
  onClose, 
  editMode=false,
  copyMode=false,
}) => {

  const { validationToast } = useValidationToast();
  const vLabel = editMode 
    ? Localization.kr.UPDATE
    : copyMode 
      ? "복제" 
      : Localization.kr.CREATE;

  const { vmsSelected } = useGlobal();
  const { templatesSelected } = useGlobal();
  const templateId = templatesSelected[0]?.id;

  const vmId = useMemo(() => [...vmsSelected][0]?.id, [vmsSelected]);
  const [selectedModalTab, setSelectedModalTab] = useState("common");
  const tabs = useMemo(() => [
    { id: "common",    label: Localization.kr.GENERAL, onClick: () => setSelectedModalTab("common") },
    { id: "system",    label: Localization.kr.SYSTEM,  onClick: () => setSelectedModalTab("system") },
    { id: "beginning", label: "초기 실행", onClick: () => setSelectedModalTab("beginning") },
    { id: "host",      label: Localization.kr.HOST,    onClick: () => setSelectedModalTab("host") },
    { id: "ha",        label: Localization.kr.HA,      onClick: () => setSelectedModalTab("ha") },
    { id: "boot",      label: "부트 옵션", onClick: () => setSelectedModalTab("boot") },
  ], []);

  const [architecture, setArchitecture] = useState("");
  const [dataCenterVo, setDataCenterVo] = useState({ id: "", name: "" });
  const [clusterVo, setClusterVo] = useState({ id: "", name: "" });
  const [templateVo, setTemplateVo] = useState({ id: "", name: "" });
  const [nicListState, setNicListState] = useState([
    { id: "", name: "nic1", vnicProfileVo: { id: "" } },
  ]);
  const [diskListState, setDiskListState] = useState([]);
    
  
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
    data: vm
  } = useVm(vmId);

  // 클러스터 목록 가져오기
  const { 
    data: clusters = [], 
    isLoading: isClustersLoading 
  } = useAllUpClusters((e) => ({ ...e }));

  // 템플릿 가져오기
  const { 
    data: templates = [], 
    isLoading: isTemplatesLoading 
  } = useFindTemplatesFromDataCenter(dataCenterVo.id, (e) => ({ ...e }));

  // 클러스터가 가지고 있는 nic 목록 가져오기
  const { 
    data: vnics = [], 
    isLoading: isNicsLoading 
  } = useAllVnicsFromCluster(clusterVo.id, (e) => ({ ...e }));

  // 편집: 가상머신이 가지고 있는 디스크 목록 가져오기
  // const { data: disks = [], isLoading: isDisksLoading } = 
  //   useDisksFromVM(vmId, (e) => ({ ...e }));
  const { 
    data: hosts = [], 
    isLoading: isHostsLoading 
  } = useHostsFromCluster(clusterVo.id, (e) => ({ ...e }));
  const { 
    data: osList = [], 
    isLoading: isOsListLoading
  } = useOsSystemsFromCluster(clusterVo.id, (e) => ({ ...e }));
  const {
    data: biosTypes = [],
    isLoading: isBiosTypesLoading
  } = useAllBiosTypes((e) => ({ 
    ...e,
    value: e?.id,
    label: e?.kr
  }))
  const { 
    data: domains = [], 
    isLoading: isDomainsLoading 
  } = useAllActiveDomainsFromDataCenter(dataCenterVo.id, (e) => ({ ...e }));
  const { 
    data: isos = [], 
    isLoading: isIsoLoading 
  } = useCDFromDataCenter(dataCenterVo.id, (e) => ({ ...e }));


  // 템플릿 id변경 시 NIC 초기화
  const {
    data: vnicProfilesFromTemplate = []
  } = useAllNicsFromTemplate(templateVo.id);

  // 일반
  const infoform = {
    id: "",
    name: "",
    description: "",
    comment: "",
    osType: "other_linux",
    biosType: "q35_ovmf" || biosTypes[0].value,
    optimizeOption: "server",
  };
  
  const [formInfoState, setFormInfoState] = useState(infoform);
  const [formSystemState, setFormSystemState] = useState(systemForm);
  const [formCloudState, setFormCloudState] = useState(cloudForm);
  const [formHostState, setFormHostState] = useState(hostForm);
  const [formHaState, setFormHaState] = useState(haForm);
  const [formBootState, setFormBootState] = useState(bootForm);

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
        setNicListState([
          {
            id: "",
            name: "nic1",
            vnicProfileVo: { id: "", name: "" },
            networkVo: { id: "", name: "" }
          }
        ]);
      }
    }
  }, [templateVo.id, isOpen, editMode, vnicProfilesFromTemplate]);
  const isDiskDisabled = templateVo.id !== CONSTANT.templateIdDefault;

  // 초기값 설정
  useEffect(() => {
    if (!isOpen) {
      setSelectedModalTab("common"); // 탭 상태 초기화
      setFormInfoState(infoform);
      setFormSystemState(systemForm);
      setFormCloudState(cloudForm);
      setFormHostState(hostForm);
      setFormHaState(haForm);
      setFormBootState(bootForm);
      setDataCenterVo({ id: "", name: "" })
      setClusterVo({ id: "", name: "" })
      setTemplateVo({ id: "", name: "" })
      setNicListState([{ id: "", name: "nic1", vnicProfileVo: { id: "" } }]);
      setDiskListState([]);
    }
    if (editMode && vm) { 
      setFormInfoState({
        id: vm?.id || "",
        name: vm?.name || "",
        description: vm?.description || "",
        comment: vm?.comment || "",
        osType: vm?.osType || "",
        biosType: vm?.biosType || "q35_ovmf",
        optimizeOption: vm?.optimizeOption || "server"
      });
      setFormSystemState({
        memorySize: vm?.memorySize / (1024 * 1024), // 입력된 값는 mb, 보낼 단위는 byte
        memoryMax: vm?.memoryMax / (1024 * 1024),
        memoryGuaranteed: vm?.memoryGuaranteed / (1024 * 1024),
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
        hostVos: (vm?.hostVos || [])?.map((host) => {
          return { id: host.id, name: host.name}}),
        migrationMode: vm?.migrationMode || "migratable",
      });
      setFormHaState({
        ha: vm?.ha || false,
        haPriority: vm?.haPriority || 1,
        storageDomainVo: {
          id: vm?.storageDomainVo?.id ,
          name: vm?.storageDomainVo?.name
        }
      });
      setFormBootState({
        firstDevice: vm?.firstDevice || "hd",
        secDevice: vm?.secDevice || "",
        isCdDvdChecked: !vm?.cdRomVo?.id,
        cdRomVo: {id: vm?.cdRomVo?.id, name: "" },
        biosBootMenu: vm?.biosBootMenu || false, 
      });
      setArchitecture("");
      setDataCenterVo({ id: vm?.dataCenterVo?.id, name: vm?.dataCenterVo?.name })
      setClusterVo({ id: vm?.clusterVo?.id, name: vm?.clusterVo?.name })
      setTemplateVo({ id: vm?.templateVo?.id, name: vm?.templateVo?.name })
      
      setNicListState([...vm.nicVos].map((nic) => ({
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

      setDiskListState([...vm?.diskAttachmentVos].map((d) => ({
        id: d?.id,
        alias: d?.diskImageVo?.alias,

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
  }, [isOpen, editMode, vm]);

  // 클러스터 변경에 따른 결과
  useEffect(() => {
    if (!clusterVo.id || clusters.length === 0) {
      return;
    }
    const selectedCluster = clusters.find((c) => c.id === clusterVo.id);
    if (selectedCluster) {
      setDataCenterVo((prev) => {
        return prev.id !== selectedCluster.dataCenterVo?.id
          ? { id: selectedCluster.dataCenterVo?.id || "", name: selectedCluster.dataCenterVo?.name || "" }
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

  
  // (확인용 , 삭제예정정)최소한 하나라도 vnicProfile이 선택되어 있는 경우만 로그 출력
  useEffect(() => {
    const hasSelectedNic = nicListState.some(nic => nic?.vnicProfileVo?.id);
    if (hasSelectedNic) {
      Logger.debug("VmModal > useEffect ... nicListState", nicListState);
    }
  }, [nicListState]);

  // 초기화 작업
  useEffect(() => {
    if (!editMode && clusters && clusters.length > 0) {
      
      const defaultC = clusters.find(c => c.name === "Default"); // 만약 "Default"라는 이름이 있다면 우선 선택
      if (defaultC) {
        setClusterVo({ id: defaultC.id, name: defaultC.name });
        setClusterVo({id: defaultC.id, name: defaultC.name});
        setDataCenterVo({id: defaultC.dataCenterVo?.id || "", name: defaultC.dataCenterVo?.name || ""});
        setArchitecture(defaultC.cpuArc || "");
      } else {
        const firstCluster = clusters[0];
        setClusterVo({id: firstCluster.id, name: firstCluster.name});
        setDataCenterVo({id: firstCluster.dataCenterVo?.id || "", name: firstCluster.dataCenterVo?.name || ""});
        setArchitecture(firstCluster.cpuArc || "");
      }      
    }
  }, [isOpen, clusters, editMode]);

  useEffect(() => {
    if (!editMode && isOpen && templates.length > 0) {
      if (templateId) {
        const found = templates.find(t => t.id === templateId);
        if (found) {
          setTemplateVo({ id: found.id, name: found.name });
        }
      } else {
        setTemplateVo({ id: CONSTANT.templateIdDefault });
      }
    }
  }, [isOpen, templates, editMode, templateId]);
  
  // 템플릿항목 숨기는 조건건
  const isTemplateHidden = editMode && templateVo.id === CONSTANT.templateIdDefault;
  
  const dataToSubmit = {
    // VmInfo
    ...formInfoState,
    clusterVo,
    templateVo,

    ...formSystemState,
    memorySize: formSystemState.memorySize * 1024 * 1024, 
    memoryMax: formSystemState.memoryMax * 1024 * 1024,
    memoryGuaranteed: formSystemState.memoryGuaranteed * 1024 * 1024,
    
    // VmInit
    ...formCloudState,

    // VmHost
    ...formHostState,
    hostVos: formHostState.hostVos.map((host) => ({ id: host.id })),

    // VmHa
    ...formHaState,
    storageDomainVo: {
      id: formHaState.storageDomainVo.id,
      name: formHaState.storageDomainVo.name
    },

    // VmBoot
    ...formBootState,

    // nic 목록
    nicVos: [...nicListState]?.map((nic) => ({
      id: nic?.id || "",
      name: nic?.name || "",
      vnicProfileVo: {
        id: nic?.vnicProfileVo && "id" in nic.vnicProfileVo
          ? nic.vnicProfileVo.id
          : null
      }
    })),

    // 디스크 데이터 (객체 형태 배열로 변환)
    diskAttachmentVos: diskListState.map((disk) => ({
      id: disk?.id || "",
      active: true,
      bootable: disk?.bootable,
      readOnly: disk?.readOnly,
      passDiscard: false,
      interface_: disk?.interface_,
      diskImageVo: {
        id: disk?.id || "", // 기존 디스크 ID (새 디스크일 경우 빈 문자열)
        size: disk?.size * 1024 * 1024 * 1024, // GB → Bytes 변환
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
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "850px", height: "730px" }}  
    >
      <div className="popup-content-outer flex">
        {/* 왼쪽 네비게이션 */}
        <TabNavButtonGroup 
          tabs={tabs}
          tabActive={selectedModalTab}
        />

      <div className="vm-edit-select-tab">
        <div className="edit-first-content pb-0.5">
          <LabelSelectOptionsID label={Localization.kr.CLUSTER}
            value={clusterVo.id}
            disabled={editMode}
            loading={isClustersLoading}
            options={clusters}
            onChange={handleSelectIdChange(setClusterVo, clusters)}            
            etcLabel={`[${Localization.kr.DATA_CENTER}: ${dataCenterVo.name}]`}
          />
          {!isTemplateHidden && (
            <LabelSelectOptionsID label={Localization.kr.TEMPLATE}
              value={templateVo.id}
              disabled={editMode}
              loading={isTemplatesLoading}
              options={templates}
              onChange={handleSelectIdChange(setTemplateVo, templates)}
            />
          )}
          <LabelSelectOptionsID label="운영 시스템"
            value={formInfoState.osType}
            options={osList.map((opt) => ({ id: opt.name, name: opt.description }))}
            onChange={handleInputChange(setFormInfoState, "osType") }
          />
          <LabelSelectOptions label="칩셋/펌웨어 유형"
            value={formInfoState.biosType}
            disabled={["PPC64", "S390X"].includes(architecture)}
            options={biosTypes}
            onChange={handleInputChange(setFormInfoState, "biosType") }
          />
          <LabelSelectOptions label="최적화 옵션"
            value={formInfoState.optimizeOption}
            options={optimizeOptionList}
            onChange={ handleInputChange(setFormInfoState, "optimizeOption") }
          />
        </div>
        <hr/>
        {selectedModalTab === "common" && (
          <>
            <VmCommon
              formInfoState={formInfoState}
              setFormInfoState={setFormInfoState}
            />
            {!copyMode && (
              <VmDisk
                editMode={editMode}
                vm={vm}
                vmName={formInfoState.name}
                dataCenterId={dataCenterVo.id}
                diskListState={diskListState}
                setDiskListState={setDiskListState}
                disabled={isDiskDisabled} // 기본템플릿이 아닐때는 버튼 disabled처리
              />
            )}
            <VmNic
              editMode={editMode}
              nics={vnics}
              nicsState={nicListState}
              setNicsState={setNicListState}
            />
          </>
        )}
        {selectedModalTab === "system" && (
          <VmSystem 
            formSystemState={formSystemState} setFormSystemState={setFormSystemState}
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
        {selectedModalTab === "ha" && (
          <VmHa
            editMode={editMode}
            domains={domains}
            formHaState={formHaState}
            setFormHaState={setFormHaState}
          />
        )}
        {selectedModalTab === "boot" && (
          <VmBoot
            isos={isos}
            isIsoLoading={isIsoLoading}
            formBootState={formBootState}
            setFormBootState={setFormBootState}
          />
        )}
      </div>
      </div>
    </BaseModal>
  );
};

export default VmModal;

// 칩셋 옵션
const chipsetOptionList = [
  { value: "i440fx_sea_bios", label: "BIOS의 I440FX 칩셋" },
  { value: "q35_ovmf", label: "UEFI의 Q35 칩셋" },
  { value: "q35_sea_bios", label: "BIOS의 Q35 칩셋" },
  { value: "q35_secure_boot", label: "UEFI SecureBoot의 Q35 칩셋" },
];

// 최적화옵션
const optimizeOptionList = [
  { value: "server", label: "서버" },
  { value: "high_performance", label: "고성능" },
  { value: "desktop", label: "데스크톱" },
];