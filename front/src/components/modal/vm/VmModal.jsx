import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import BaseModal from "../BaseModal";
import {
  useVmById,
  useAddVm,
  useEditVm,
  useAllUpClusters,
  useAllTemplates,
  useCDFromDataCenter,
  useDisksFromVM,
  useHostFromCluster,
  useAllActiveDomainFromDataCenter,
  useAllvnicFromDataCenter,
  useOsSystemsFromCluster,
  useCluster,  
} from '../../../api/RQHook';
import VmCommon from './create/VmCommon';
import VmNic from './create/VmNic';
import VmDisk from './create/VmDisk';
import VmSystem from './create/VmSystem';
import VmInit from './create/VmInit';
import VmHost from './create/VmHost';
import VmHa from './create/VmHa';
import VmBoot from './create/VmBoot';
import LabelSelectOptions from '../../label/LabelSelectOptions';
import LabelSelectOptionsID from '../../label/LabelSelectOptionsID';
import './MVm.css';

// 탭 메뉴
const tabs = [
  { id: "common_tab", value: "common", label: "일반" },
  { id: "system_tab", value: "system", label: "시스템" },
  { id: "beginning_tab", value: "beginning", label: "초기 실행" },
  { id: "host_tab", value: "host", label: "호스트" },
  { id: "ha_mode_tab", value: "ha_mode", label: "고가용성" },
  { id: "boot_option_tab", value: "boot_outer", label: "부트 옵션" },
];

// 칩셋 옵션
const chipsetOptionList = [
  { value: "I440FX_SEA_BIOS", label: "BIOS의 I440FX 칩셋" },
  { value: "Q35_OVMF", label: "UEFI의 Q35 칩셋" },
  { value: "Q35_SEA_BIOS", label: "BIOS의 Q35 칩셋" },
  { value: "Q35_SECURE_BOOT", label: "UEFI SecureBoot의 Q35 칩셋" },
];

// 최적화옵션
const optimizeOptionList = [
  { value: "DESKTOP", label: "데스크톱" },
  { value: "HIGH_PERFORMANCE", label: "고성능" },
  { value: "SERVER", label: "서버" },
];


// 일반
const infoform = {
  id: "",
  name: "",
  comment: "",
  description: "",
  stateless: false, // 무상태
  startPaused: false, // 일시중지상태로시작
  deleteProtected: false, //삭제보호
};

//시스템
const systemForm = {
  memorySize: 1024, // 메모리 크기
  memoryMax: 1024, // 최대 메모리
  memoryActual: 1024, // 할당할 실제메모리
  cpuTopologyCnt: 1, //총cpu
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
  priority: 1, // 초기값
  storageDomainVo: "",
};

// 부트옵션
const bootForm = {
  firstDevice: "hd", // 첫번째 장치
  secDevice: "", // 두번째 장치
  isCdDvdChecked: false, // cd/dvd 연결 체크박스
  cdConn: "", // iso 파일
  bootingMenu: false, // 부팅메뉴 활성화
};

const VmModal = ({ isOpen, editMode = false, vmId, onClose }) => {
  const vLabel = editMode ? "편집" : "생성";
  const [selectedModalTab, setSelectedModalTab] = useState("common");

  const [formInfoState, setFormInfoState] = useState(infoform);
  const [formSystemState, setFormSystemState] = useState(systemForm);
  const [formCloudState, setFormCloudState] = useState(cloudForm);
  const [formHostState, setFormHostState] = useState(hostForm);
  const [formHaState, setFormHaState] = useState(haForm);
  const [formBootState, setFormBootState] = useState(bootForm);
  const [dataCenterName, setDataCenterName] = useState(""); // dc 이름출력용
  const [dataCenterId, setDataCenterId] = useState(""); // 데이터센터 id
  const [clusterVoId, setClusterVoId] = useState(""); // 클러스터 id
  const [templateVoId, setTemplateVoId] = useState(""); // 템플릿 id
  const [architecture, setArchitecture] = useState(""); // cluster arc
  const [osSystem, setOsSystem] = useState(""); // 운영 시스템
  const [chipsetOption, setChipsetOption] = useState("I440FX_SEA_BIOS"); // 칩셋
  const [optimizeOption, setOptimizeOption] = useState("SERVER"); // 최적화옵션

  // 초기 vnicprofile 세팅 (배열)
  const [nicListState, setNicListState] = useState([
    { id: "", name: "nic1", vnicProfileVo: { id: "" } },
  ]);
  // 디스크 목록, 연결+생성 (배열)
  const [diskListState, setDiskListState] = useState([]);

  const { mutate: addVM } = useAddVm();
  const { mutate: editVM } = useEditVm();

  // 가상머신 상세데이터 가져오기
  const { data: vm } = useVmById(vmId);

  // 클러스터 목록 가져오기
  const { data: clusters = [], isLoading: isClustersLoading } =
    useAllUpClusters((e) => ({ ...e }));

  // 템플릿 가져오기
  const { data: templates = [], isLoading: isTemplatesLoading } =
    useAllTemplates((e) => ({ ...e }));

  // 클러스터가 가지고 있는 nic 목록 가져오기
  const { data: nics = [], isLoading: isNicsLoading } =
    useAllvnicFromDataCenter(dataCenterId, (e) => ({ ...e }));

  // 편집: 가상머신이 가지고 있는 디스크 목록 가져오기
  const { data: disks = [], isLoading: isDisksLoading } = 
    useDisksFromVM(vmId, (e) => ({ ...e }));

  const { data: hosts = [], isLoading: isHostsLoading } = 
    useHostFromCluster(clusterVoId, (e) => ({ ...e }));

  const { data: osList = [], isLoading: isOssLoading } = 
    useOsSystemsFromCluster(clusterVoId, (e) => ({ ...e }));

  const { data: domains = [], isLoading: isDomainsLoading } =
    useAllActiveDomainFromDataCenter(dataCenterId, (e) => ({ ...e }));

  const { data: isos = [], isLoading: isIsoLoading } = 
    useCDFromDataCenter(dataCenterId, (e) => ({ ...e }));

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
      setDataCenterName("");
      setDataCenterId("");
      setClusterVoId("");
      setTemplateVoId("");
      setOsSystem("");
      setChipsetOption("I440FX_SEA_BIOS");
      setOptimizeOption("SERVER");
      setNicListState([{ id: "", name: "nic1", vnicProfileVo: { id: "" } }]);
      setDiskListState([]);
    }
    if (editMode && vm) {
      setFormInfoState({
        id: vm?.id || "",
        name: vm?.name || "",
        comment: vm?.comment || "",
        description: vm?.description || "",
        stateless: vm?.stateless || false,
        startPaused: vm?.startPaused || false,
        deleteProtected: vm?.deleteProtected || false,
      });
      setFormSystemState({
        memorySize: vm?.memorySize / (1024 * 1024), // 입력된 값는 mb, 보낼 단위는 byte
        memoryMax: vm?.memoryMax / (1024 * 1024),
        memoryActual: vm?.memoryActual / (1024 * 1024),
        cpuTopologyCnt: vm?.cpuTopologyCnt || 1,
        cpuTopologyCore: vm?.cpuTopologyCore || 1,
        cpuTopologySocket: vm?.cpuTopologySocket || 1,
        cpuTopologyThread: vm?.cpuTopologyThread || 1,
      });
      setFormCloudState({
        cloudInit: vm?.cloudInit || false,
        script: vm?.setScript || "",
      });
      setFormHostState({
        hostInCluster: vm?.hostInCluster || true,
        hostVos: vm?.hostVos || [],
        migrationMode: vm?.migrationMode || "migratable",
        // migrationPolicy: vm?.migrationPolicy || 'minimal_downtime',
      });
      setFormHaState({
        ha: vm?.ha || false,
        priority: vm?.priority || 1,
        domainVoId: vm?.storageDomainVo?.id || "",
      });
      setFormBootState({
        firstDevice: vm?.firstDevice || "hd",
        secDevice: vm?.secDevice || "",
        bootingMenu: vm?.bootingMenu || false,
        cdConn: vm?.connVo?.id,
      });
      setDataCenterName(vm?.dataCenterVo?.name);
      setDataCenterId(vm?.dataCenterVo?.id);
      setClusterVoId(vm?.clusterVo?.id);
      setTemplateVoId(vm?.templateVo?.id || "");
      setOsSystem(vm?.osSystem || "other_linux");
      setChipsetOption(vm?.chipsetFirmwareType || "Q35_OVMF");
      setOptimizeOption(vm?.optimizeOption || "SERVER");

      const initialNicState = vm?.nicVos?.length? 
        vm?.nicVos?.map((nic, index) => ({
          id: nic?.id || "",
          name: nic?.name || `nic${index + 1}`,
          vnicProfileVo: {
            id: nic?.vnicProfileVo?.id || "",
            name: nic?.vnicProfileVo?.name || "",
          },
          networkVo: {
            id: nic.networkVo?.id || "",
            name: nic.networkVo?.name || "",
          },
        }))
        : [
            {
              id: "",
              name: "nic1",
              vnicProfileVo: { id: "" },
              networkVo: { id: "", name: "" },
            },
          ];
      setNicListState(initialNicState);

      const initialDiskState =
        vm?.diskAttachmentVos?.map((d) => ({
          id: d?.id,
          alias: d?.diskImageVo?.alias,
          virtualSize: d?.diskImageVo?.virtualSize
            ? d?.diskImageVo?.virtualSize / (1024 * 1024 * 1024): 0,
          interface_: d?.interface_ || "VIRTIO_SCSI",
          readOnly: d?.readOnly || false,
          bootable: d?.bootable || false,
          storageDomainVo: { id: d?.diskImageVo?.storageDomainVo?.id || "" },
          isExisting: true,
        })) || [];

      setDiskListState(initialDiskState);
    } 
  }, [isOpen, editMode, vm]);

  // 클러스터 변경에 따른 결과
  useEffect(() => {
    if (clusterVoId) {
      const selectedCluster = clusters.find((c) => c.id === clusterVoId);
      if (selectedCluster) {
        setDataCenterId(selectedCluster.dataCenterVo?.id || "");
        setDataCenterName(selectedCluster.dataCenterVo?.name || "");
        setArchitecture(selectedCluster.cpuArc || "");
      }
    }
  }, [clusterVoId, clusters]);

  // 초기화 작업
  useEffect(() => {
    if (!editMode && clusters.length > 0) {
      const firstCluster = clusters[0];
      setClusterVoId(firstCluster.id);
      setDataCenterId(firstCluster.dataCenterVo?.id || "");
      setDataCenterName(firstCluster.dataCenterVo?.name || "");
      setArchitecture(firstCluster.cpuArc);
    }
  }, [isOpen, clusters, editMode]);

  useEffect(() => {
    if (osList && osList.length > 0) {
      setOsSystem(osList[0].name);
    }
  }, [osList]);  

  useEffect(() => {
    if (!editMode && templates.length > 0) {
      setTemplateVoId("00000000-0000-0000-0000-000000000000"); // 기본 템플릿으로
    }
  }, [isOpen, templates, editMode]);



  const dataToSubmit = {
    // VmInfo
    clusterVo: { id: clusterVoId },
    templateVo: { id: templateVoId },
    name: formInfoState.name,
    description: formInfoState.description,
    comment: formInfoState.comment,
    stateless: formInfoState.stateless,
    startPaused: formInfoState.startPaused,
    deleteProtected: formInfoState.deleteProtected,
    chipsetFirmwareType: chipsetOption,
    optimizeOption: optimizeOption,

    // VmSystem
    memorySize: formSystemState.memorySize * 1024 * 1024,  // mb -> byte
    memoryMax: formSystemState.memoryMax * 1024 * 1024,
    memoryActual: formSystemState.memoryActual * 1024 * 1024,
    cpuTopologyCore: formSystemState.cpuTopologyCore,
    cpuTopologySocket: formSystemState.cpuTopologySocket,
    cpuTopologyThread: formSystemState.cpuTopologyThread,

    // VmInit
    cloudInit: formCloudState.cloudInit,
    script: formCloudState.script,
    // hostName: '',
    timeStandard: "Asia/Seoul",

    // VmHost
    hostInCluster: formHostState.hostInCluster,
    hostVos: formHostState.hostVos.map((host) => ({ id: host.id })),
    migrationMode: formHostState.migrationMode,
    // migrationEncrypt: formHostState.migrationEncrypt,

    // VmHa
    ha: formHaState.ha,
    priority: formHaState.priority,
    storageDomainVo: { id: formHaState.storageDomainVo },

    // VmBoot
    firstDevice: formBootState.firstDevice,
    secDevice: formBootState.secDevice,
    osSystem: osSystem,
    connVo: { id: formBootState.cdConn },

    // nic 목록
    nicVos: nicListState.map((nic) => ({ 
      name: nic.name,
      vnicProfileVo: {id: nic.vnicProfileVo.id }
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
        appendSize: 0,
        alias: disk?.alias,
        description: disk?.description || "",
        storageDomainVo: { id: disk?.storageDomainVo?.id || "" },
        diskProfileVo: { id: disk?.diskProfileVo?.id || "" },
        sparse: disk?.sparse,
        wipeAfterDelete: disk?.wipeAfterDelete || false,
        sharable: disk?.sharable || false,
        backup: disk?.backup || false,
        // format: "RAW",
        // virtualSize: disk.size * 1024 * 1024 * 1024,
        // actualSize: disk.size * 1024 * 1024 * 1024, // 편집일때
        // contentType: "DATA",
        // storageType: "IMAGE",
      },
    })),
  };

  const validateForm = () => {
    if (!formInfoState.name) return "이름을 입력해주세요.";
    if (!clusterVoId) return "클러스터를 선택해주세요.";
    if (formSystemState.memorySize > "9223372036854775807") return "메모리 크기가 너무 큽니다.";
    return null;
  };

  const handleFormSubmit = () => {
    // 디스크  연결은 id값 보내기 생성은 객체로 보내기
    const error = validateForm();
    if (error) return toast.error(error);

    const onSuccess = () => {
      onClose();
      toast.success(`가상머신 ${vLabel} 완료`);
    };
    const onError = (err) => toast.error(`Error ${vLabel} vm: ${err}`);
    
    console.log("가상머신 데이터 확인:", dataToSubmit);

    editMode
      ? editVM({ vmId: vmId, vmdata: dataToSubmit },{ onSuccess, onError })
      : addVM(dataToSubmit, { onSuccess, onError });
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} targetName={"가상머신"} submitTitle={vLabel} onSubmit={handleFormSubmit}>
      <div className="vm-edit-popup-content flex">
        <div className="vm-new-nav"style={{height: "71vh",width: "30%",}}>
            {tabs.map((tab) => (
              <div
                key={tab.id} id={tab.id}
                className={ selectedModalTab === tab.value ? "active-tab" : "inactive-tab"}
                onClick={() => setSelectedModalTab(tab.value)}
              >
                {tab.label}
              </div>
            ))}
          </div>

          <div className="vm-edit-select-tab">
            <div className="edit-first-content">
              <LabelSelectOptionsID
                label="클러스터"
                value={clusterVoId}
                onChange={(e) => setClusterVoId(e.target.value)}
                disabled={editMode} // 편집 모드일 경우 비활성화
                loading={isClustersLoading}
                options={clusters}
              />
              <div>
                <span>데이터센터: {dataCenterName}</span>
              </div>
              <LabelSelectOptionsID
                label="템플릿"
                value={templateVoId}
                onChange={(e) => setTemplateVoId(e.target.value)}
                disabled={editMode} // 편집 모드일 경우 비활성화
                loading={isTemplatesLoading}
                options={templates}
              />      
              <div className={`flex justify-center items-center mb-1 w-full px-[25px]`}>
                <label className="flex justify-end items-center mx-1 w-[60px] max-w-[100px] text-end" >
                  운영 시스템
                </label>
                <select className="w-full min-w-30 max-w-xl"
                  value={osSystem}
                  onChange={(e) => setOsSystem(e.target.value)}
                >
                  {osList.map((opt) => (
                    <option key={opt.name} value={opt.description}>
                      {opt.description}
                    </option>
                  ))}
                </select>
              </div>
              <LabelSelectOptions
                label="칩셋/펌웨어 유형"
                value={chipsetOption}
                onChange={(e) => setChipsetOption(e.target.value)}
                options={chipsetOptionList}
                disabled={architecture === "PPC64" || architecture === "S390X"}
              />
              <LabelSelectOptions
                label="최적화 옵션"
                value={optimizeOption}
                onChange={(e) => setOptimizeOption(e.target.value)}
                options={optimizeOptionList}
              />
            </div>

            {selectedModalTab === "common" && (
              <>
                <VmCommon
                  formInfoState={formInfoState}
                  setFormInfoState={setFormInfoState}
                />
                <VmDisk
                  editMode={editMode}
                  vmName={formInfoState.name}
                  dataCenterId={dataCenterId}
                  diskListState={diskListState}
                  setDiskListState={setDiskListState}
                />
                <VmNic
                  nicsState={nicListState}
                  setNicsState={setNicListState}
                  nics={nics}
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
                editMode={editMode}
                formCloudState={formCloudState}
                setFormCloudState={setFormCloudState}
              />
            )}
            {selectedModalTab === "host" && (
              <VmHost
                editMode={editMode}
                hosts={hosts}
                formHostState={formHostState}
                setFormHostState={setFormHostState}
              />
            )}
            {selectedModalTab === "ha_mode" && (
              <VmHa
                editMode={editMode}
                domains={domains}
                formHaState={formHaState}
                setFormHaState={setFormHaState}
              />
            )}
            {selectedModalTab === "boot_outer" && (
              <VmBoot
                editMode={editMode}
                isos={isos}
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
