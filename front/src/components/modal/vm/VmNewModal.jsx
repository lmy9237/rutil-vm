// 안씀!

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import BaseModal from "../BaseModal";
import VmCommon from "./create/VmCommon";
import VmNic from "./create/VmNic";
import VmDisk from "./create/VmDisk";
import VmSystem from "./create/VmSystem";
import VmInit from "./create/VmInit";
import VmHost from "./create/VmHost";
import VmHa from "./create/VmHa";
import VmBoot from "./create/VmBoot";
import LabelSelectOptions from "../../label/LabelSelectOptions";
import LabelSelectOptionsID from "../../label/LabelSelectOptionsID";
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
} from "../../../api/RQHook";
import "./MVm.css";
import Localization from "../../../utils/Localization";

const VmNewModal = ({ isOpen, editMode = false, vmId, onClose }) => {
  const { mutate: addVM } = useAddVm();
  const { mutate: editVM } = useEditVm();

  const [selectedModalTab, setSelectedModalTab] = useState("common");

  // 일반
  const [formInfoState, setFormInfoState] = useState({
    id: "",
    name: "",
    comment: "",
    description: "",
    stateless: false, // 무상태
    startPaused: false, // 일시중지상태로시작
    deleteProtected: false, //삭제보호
  });

  //시스템
  const [formSystemState, setFormSystemState] = useState({
    memorySize: 1024, // 메모리 크기
    memoryMax: 1024, // 최대 메모리
    memoryActual: 1024, // 할당할 실제메모리
    cpuTopologyCnt: 1, //총cpu
    cpuTopologyCore: 1, // 가상 소켓 당 코어
    cpuTopologySocket: 1, // 가상소켓
    cpuTopologyThread: 1, //코어당 스레드
  });

  // 초기실행
  const [formCloudInitState, setFormCloudInitState] = useState({
    cloudInit: false, // Cloud-lnit
    script: "", // 스크립트
  });

  // 호스트
  const [formHostState, setFormHostState] = useState({
    hostInCluster: true, // 클러스터 내 호스트 버튼
    hostVos: [],
    migrationMode: "migratable", // 마이그레이션 모드
    // migrationEncrypt: 'INHERIT',  // 암호화
    // migrationPolicy: 'minimal_downtime',// 마이그레이션 정책
  });

  // 고가용성
  const [formHaState, setFormHaState] = useState({
    ha: false, // 고가용성(체크박스)
    priority: 1, // 초기값
    storageDomainVo: "",
  });

  // 부트옵션
  const [formBootState, setFormBootState] = useState({
    firstDevice: "hd", // 첫번째 장치
    secDevice: "", // 두번째 장치
    isCdDvdChecked: false, // cd/dvd 연결 체크박스
    cdConn: "", // iso 파일
    bootingMenu: false, // 부팅메뉴 활성화
  });

  const [dataCenterName, setDataCenterName] = useState(""); // 단순 dc 이름출력용
  const [dataCenterId, setDataCenterId] = useState(""); // 데이터센터 id
  const [clusterVoId, setClusterVoId] = useState(""); // 클러스터 id
  const [templateVoId, setTemplateVoId] = useState(""); // 템플릿 id
  const [osSystem, setOsSystem] = useState("other_linux"); // 운영 시스템
  const [chipsetOption, setChipsetOption] = useState("Q35_OVMF"); // 칩셋
  const [optimizeOption, setOptimizeOption] = useState("SERVER"); // 최적화옵션

  // 초기 vnicprofile 세팅 (배열)
  const [nicListState, setNicListState] = useState([
    { id: "", name: "nic1", vnicProfileVo: { id: "" } },
  ]);
  // 디스크 목록, 연결+생성 (배열)
  const [diskListState, setDiskListState] = useState([]);

  // 초기화 코드
  const resetForm = () => {
    setFormInfoState({
      id: "",
      name: "",
      comment: "",
      description: "",
      stateless: false,
      startPaused: false,
      deleteProtected: false,
    });
    setFormSystemState({
      memorySize: 1024,
      memoryMax: 1024,
      memoryActual: 1024,
      cpuTopologyCnt: 1,
      cpuTopologyCore: 1,
      cpuTopologySocket: 1,
      cpuTopologyThread: 1,
    });
    setFormCloudInitState({
      cloudInit: false,
      script: "",
    });
    setFormHostState({
      hostInCluster: true,
      hostVos: [],
      migrationMode: "migratable",
      // migrationPolicy: 'minimal_downtime',
      // migrationEncrypt: 'INHERIT',
    });
    setFormHaState({
      ha: false,
      priority: 1,
      storageDomainVo: "",
    });
    setFormBootState({
      firstDevice: "hd",
      secDevice: "",
      bootingMenu: false,
      cdConn: "",
    });
    setDataCenterName("");
    setDataCenterId("");
    setClusterVoId("");
    setTemplateVoId("");
    setOsSystem("other_linux");
    setChipsetOption("Q35_OVMF");
    setOptimizeOption("SERVER");
    setNicListState([{ id: "", name: "nic1", vnicProfileVo: { id: "" } }]);
    setDiskListState([]);
  };

  // 가상머신 상세데이터 가져오기
  const { data: vm, refetch: refetchvms } = useVmById(vmId);

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
  const { data: disks = [], isLoading: isDisksLoading } = useDisksFromVM(
    vmId,
    (e) => ({ ...e })
  );

  const { data: hosts = [], isLoading: isHostsLoading } = useHostFromCluster(
    clusterVoId,
    (e) => ({ ...e })
  );

  const { data: domains = [], isLoading: isDomainsLoading } =
    useAllActiveDomainFromDataCenter(dataCenterId, (e) => ({ ...e }));

  const { data: isos = [], isLoading: isIsoLoading } = useCDFromDataCenter(
    dataCenterId,
    (e) => ({ ...e })
  );

  // 탭 메뉴
  const tabs = [
    { id: "common_tab", value: "common", label: Localization.kr.GENERAL },
    { id: "system_tab", value: "system", label: "시스템" },
    { id: "beginning_tab", value: "beginning", label: "초기 실행" },
    { id: "host_tab", value: "host", label: Localization.kr.HOST },
    { id: "ha_mode_tab", value: "ha_mode", label: Localization.kr.HA },
    { id: "boot_option_tab", value: "boot_outer", label: "부트 옵션" },
  ];

  // 운영 시스템
  const osSystemList = [
    { value: "debian_7", label: "Debian 7+" },
    { value: "debian_9", label: "Debian 9+" },
    { value: "freebsd", label: "FreeBSD 9.2" },
    { value: "freebsdx64", label: "FreeBSD 9.2 x64" },
    { value: "other_linux", label: "Linux" },
    // { value: 'other_linux_s390x', label: 'Linux' },
    // { value: 'other_linux_ppc64', label: 'Linux' },
    { value: "other", label: "Other OS" },
    // { value: 'other_s390x', label: 'Other OS' },
    // { value: 'other_ppc64', label: 'Other OS' },
    { value: "other_linux_kernel_4", label: "Other Linux (kernel 4.x)" },
    { value: "windows_xp", label: "Windows XP" },
    { value: "windows_2003", label: "Windows 2003" },
    { value: "windows_2003x64", label: "Windows 2003 x64" },
    { value: "windows_2008x64", label: "Windows 2008 x64" },
    { value: "windows_2008R2x64", label: "Windows 2008 R2 x64" },
    { value: "windows_2008", label: "Windows 2008" },
    { value: "windows_2012x64", label: "Windows 2012 x64" },
    { value: "windows_2012R2x64", label: "Windows 2012R2 x64" },
    { value: "windows_2016x64", label: "Windows 2016 x64" },
    { value: "windows_2019x64", label: "Windows 2019 x64" },
    { value: "windows_2022", label: "Windows 2022" },
    { value: "windows_7", label: "Windows 7" },
    { value: "windows_7x64", label: "Windows 7 x64" },
    { value: "windows_8", label: "Windows 8" },
    { value: "windows_8x64", label: "Windows 8 x64" },
    { value: "windows_10", label: "Windows 10" },
    { value: "windows_10x64", label: "Windows 10 x64" },
    { value: "windows_11", label: "Windows 11" },
    { value: "rhel_atomic7x64", label: "Red Hat Atomic 7.x x64" },
    { value: "rhel_3", label: "Red Hat Enterprise Linux 3.x" },
    { value: "rhel_3x64", label: "Red Hat Enterprise Linux 3.x x64" },
    { value: "rhel_4", label: "Red Hat Enterprise Linux 4.x" },
    { value: "rhel_4x64", label: "Red Hat Enterprise Linux 4.x x64" },
    { value: "rhel_5", label: "Red Hat Enterprise Linux 5.x" },
    { value: "rhel_5x64", label: "Red Hat Enterprise Linux 5.x x64" },
    { value: "rhel_6", label: "Red Hat Enterprise Linux 6.x" },
    { value: "rhel_6x64", label: "Red Hat Enterprise Linux 6.x x64" },
    { value: "rhel_6_ppc64", label: "Red Hat Enterprise Linux up to 6.8" },
    { value: "rhel_6_9_plus_ppc64", label: "Red Hat Enterprise Linux 6.9+" },
    { value: "rhel_7_s390x", label: "Red Hat Enterprise Linux 7.x" },
    { value: "rhel_7x64", label: "Red Hat Enterprise Linux 7.x x64" },
    { value: "rhel_7_ppc64", label: "Red Hat Enterprise Linux 7.x" },
    { value: "rhel_8x64", label: "Red Hat Enterprise Linux 8.x x64" },
    { value: "rhel_8_ppc64", label: "Red Hat Enterprise Linux 8.x" },
    { value: "rhel_9x64", label: "Red Hat Enterprise Linux 9.x x64" },
    { value: "rhel_9_ppc64", label: "Red Hat Enterprise Linux 9.x" },
    { value: "rhcos_x64", label: "Red Hat Enterprise Linux CoreOS" },
    { value: "sles_11", label: "SUSE Linux Enterprise Server 11+" },
    { value: "sles_11_ppc64", label: "SUSE Linux Enterprise Server 11" },
    { value: "sles_12_s390x", label: "SUSE Linux Enterprise Server 12" },
    { value: "ubuntu_12_04", label: "Ubuntu Precise Pangolin LTS" },
    { value: "ubuntu_12_10", label: "Ubuntu Quantal Quetzal" },
    { value: "ubuntu_13_04", label: "Ubuntu Raring Ringtails" },
    { value: "ubuntu_13_10", label: "Ubuntu Saucy Salamander" },
    { value: "ubuntu_14_04", label: "Ubuntu Trusty Tahr LTS+" },
    { value: "ubuntu_14_04_ppc64", label: "Ubuntu Trusty Tahr LTS+" },
    { value: "ubuntu_16_04_s390x", label: "Ubuntu Xenial Xerus LTS+" },
    { value: "ubuntu_18_04", label: "Ubuntu Bionic Beaver LTS+" },
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

  useEffect(() => {
    if (!isOpen) {
      resetForm(); // 모달이 닫힐 때만 초기화
      setSelectedModalTab("common"); // 탭 상태 초기화
    }
  }, [isOpen]);

  // 초기값 설정
  useEffect(() => {
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
      setFormCloudInitState({
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

      const initialNicState = vm?.nicVos?.length
        ? vm?.nicVos?.map((nic, index) => ({
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
            ? d?.diskImageVo?.virtualSize / (1024 * 1024 * 1024)
            : 0,
          interface_: d?.interface_ || "VIRTIO_SCSI",
          readOnly: d?.readOnly || false,
          bootable: d?.bootable || false,
          storageDomainVo: { id: d?.diskImageVo?.storageDomainVo?.id || "" },
          isExisting: true,
        })) || [];

      setDiskListState(initialDiskState);
    } else if (!editMode) {
      resetForm();
    }
  }, [editMode, vm]);

  // 클러스터 변경에 따른 결과
  useEffect(() => {
    if (clusterVoId) {
      const selectedCluster = clusters.find((c) => c.id === clusterVoId);
      if (selectedCluster) {
        setDataCenterId(selectedCluster.dataCenterVo?.id || "");
        setDataCenterName(selectedCluster.dataCenterVo?.name || "");
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
    }
  }, [isOpen, clusters, editMode]);

  useEffect(() => {
    if (!editMode && templates.length > 0) {
      setTemplateVoId(templates[0].id);
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
    memorySize: formSystemState.memorySize * 1024 * 1024,
    memoryMax: formSystemState.memoryMax * 1024 * 1024,
    memoryActual: formSystemState.memoryActual * 1024 * 1024,
    cpuTopologyCore: formSystemState.cpuTopologyCore,
    cpuTopologySocket: formSystemState.cpuTopologySocket,
    cpuTopologyThread: formSystemState.cpuTopologyThread,

    // VmInit
    cloudInit: formCloudInitState.cloudInit,
    script: formCloudInitState.script,
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

    // vnicProfile 목록
    vnicProfileVos: nicListState.map((vnic) => ({ id: vnic.vnicProfileVo.id })),

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
  // diskAttachmentVos: formInfoState.diskVoList.map((disk) => ({ id: disk.id })),

  const validateForm = () => {
    if (!formInfoState.name) 
      return `${Localization.kr.NAME}을 입력해주세요.`;
    if (!clusterVoId) 
      return `${Localization.kr.CLUSTER}를 선택해주세요.`;
    if (formSystemState.memorySize > "9223372036854775807")
      return `${Localization.kr.MEMORY} 크기가 너무 큽니다.`;
    return null;
  };

  const handleFormSubmit = () => {
    // 디스크  연결은 id값 보내기 생성은 객체로 보내기
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }
    console.log("가상머신 데이터 확인:", dataToSubmit);

    if (editMode) {
      editVM(
        { vmId: vmId, vmdata: dataToSubmit },
        {
          onSuccess: () => {
            onClose();
            toast.success("가상머신 편집 완료");
          },
          onError: (error) => toast.error("Error editing vm:", error),
        }
      );
    } else {
      addVM(dataToSubmit, {
        onSuccess: () => {
          onClose();
          toast.success("가상머신 생성 완료");
        },
        onError: (error) => toast.error("Error adding vm:", error),
      });
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      contentLabel={"가상머신"}
      submitTitle={editMode ? "편집" : "생성"}
      onSubmit={handleFormSubmit}
    >
      <div className="vm_edit_popup_content flex">
        <div
          className="vm-new-nav"
          style={{
            height: "71vh",
            width: "30%",
          }}
        >
          {tabs.map((tab) => (
            <div
              key={tab.id}
              id={tab.id}
              className={
                selectedModalTab === tab.value ? "active-tab" : "inactive-tab"
              }
              onClick={() => setSelectedModalTab(tab.value)}
            >
              {tab.label}
            </div>
          ))}
        </div>

        <div className="vm-edit-select-tab">
          <div className="edit-first-content pb-0.5">
            <LabelSelectOptionsID id="cluster"
              label={Localization.kr.CLUSTER}
              value={clusterVoId}
              onChange={(e) => setClusterVoId(e.target.value)}
              disabled={editMode} // 편집 모드일 경우 비활성화
              loading={isClustersLoading}
              options={clusters}
            />

            <LabelSelectOptionsID
              label="템플릿"
              value={templateVoId}
              onChange={(e) => setTemplateVoId(e.target.value)}
              disabled={editMode} // 편집 모드일 경우 비활성화
              loading={isTemplatesLoading}
              options={templates}
            />

            <LabelSelectOptions
              label="운영 시스템"
              value={osSystem}
              onChange={(e) => setOsSystem(e.target.value)}
              options={osSystemList}
            />
            <LabelSelectOptions
              label="칩셋/펌웨어 유형"
              value={chipsetOption}
              onChange={(e) => setChipsetOption(e.target.value)}
              options={chipsetOptionList}
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
              formCloudInitState={formCloudInitState}
              setFormCloudInitState={setFormCloudInitState}
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

export default VmNewModal;
