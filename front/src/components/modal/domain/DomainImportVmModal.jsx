import { useState, useEffect } from "react";
import { useValidationToast }     from "@/hooks/useSimpleToast";
import useGlobal                  from "@/hooks/useGlobal";
import FilterButtons              from "@/components/button/FilterButtons";
import BaseModal                  from "@/components/modal/BaseModal";
import TablesOuter                from "@/components/table/TablesOuter";
import TableColumnsInfo           from "@/components/table/TableColumnsInfo";
import { InfoTable }              from "@/components/table/InfoTable";
import LabelSelectOptionsID       from "@/components/label/LabelSelectOptionsID";
import LabelCheckbox              from "@/components/label/LabelCheckbox";
import LabelInput                 from "@/components/label/LabelInput";
import {
  useClustersFromDataCenter,
  useRegisteredVmFromDomain
} from "@/api/RQHook";
import { checkZeroSizeToMB }      from "@/util";
import Localization               from "@/utils/Localization";
import "./MDomain.css";

/**
 * @name DomainImportVmModal
 * @description 도메인 가상머신 가져오기 모달
 *
 * @prop {boolean} isOpen
 *
 * @returns {JSX.Element} DomainImportVmModal
 */
const DomainImportVmModal = ({ 
  isOpen, onClose,
}) => {
  const { validationToast } = useValidationToast();
  const [activeFilter, setActiveFilter] = useState("general");
  const { 
    domainsSelected, 
    vmsSelected, setVmsSelected,
  } = useGlobal();

  const { mutate: registerVm } = useRegisteredVmFromDomain(onClose, onClose);
  
  const {
    data: clusters = [],
    isLoading: isDcClustersLoading,
  } = useClustersFromDataCenter(domainsSelected[0]?.dataCenterVo?.id, (e) => ({...e,}));
  
  const [vmList, setVmList] = useState([]);
  const [clusterList, setClusterList] = useState({}); // 해당 도메인이 가진 데이터센터가 가지고 있는 클러스터 리스트
  const [selectedVmId, setSelectedVmId] = useState(null);

  const selectedVm = vmList.find(vm => vm.id === selectedVmId) || vmList[0];

  const [editVmNames, setEditVmNames] = useState({}); //변경된 이름저장
  const [relocation, setRelocation] = useState({}); // 불량 mac 재배치
  const [partialAllow, setPartialAllow] = useState({}); // 부분 허용
  
  const handleClusterChange = (vmId) => (selected) => {
    setClusterList(prev => ({ ...prev, [vmId]: selected.id }));
  };

  const handleVmNameChange = (vmId) => (e) => {
    const newName = e.target.value;
    setVmList((prev) =>
      prev.map((vm) =>
        vm.id === vmId ? { ...vm, name: newName } : vm
      )
    );
  };

  useEffect(() => {
    if (isOpen && vmsSelected.length > 0) {
      setVmList(vmsSelected);
      setSelectedVmId(vmsSelected[0].id || vmList[0].id);
      setActiveFilter("general");
    }
    if (!isOpen) {
      setEditVmNames({});
    }
  }, [isOpen, vmsSelected]);


  useEffect(() => {
    if (vmList?.length && clusters.length) {
      setClusterList((prev) => {
        const next = { ...prev };
        vmList.forEach(vm => {
          if (!next[vm.id]) {
            next[vm.id] = clusters[0].id;
          }
        });
        return next;
      });
    }
  }, [vmList, clusters]);
  
  const transformedData = vmList.map((vm) => ({
    ...vm, 
    name: vm.name, 
    memory: vm.memory, 
    cpu: vm.cpuTopologyCnt, 
    cpuArc: vm.cpuArc,
    diskCnt: vm?.diskAttachmentVos?.length ?? 0,
    mac: 
      <LabelCheckbox id={`relocation-${vm.id}`} label={""}
        checked={!!relocation[vm.id]}
        onChange={(checked) => {
          import.meta.env.DEV && validationToast.debug(`relocation[${vm.id}]: ${checked}`);
          setRelocation(prev => ({ ...prev, [vm.id]: checked }));
        }}
        /*
        onChange={e => {
          setRelocation(prev => ({ ...prev, [vm.id]: e.target.checked }));
        }}
        */
      />,
    allow:
      <LabelCheckbox id={`allow-${vm.id}`} label={""}
        checked={!!partialAllow[vm.id]}
        onChange={(checked) => {
          import.meta.env.DEV && validationToast.debug(`partialAllow[${vm.id}]: ${checked}`);
          setPartialAllow(prev => ({ ...prev, [vm.id]: checked }));
        }}
        /*
        onChange={e => {
          setPartialAllow(prev => ({ ...prev, [vm.id]: e.target.checked }));
        }}
        */
      />,
    cluster: 
      <LabelSelectOptionsID className="w-[280px]"
        value={clusterList[vm.id] || ""}
        loading={isDcClustersLoading}
        options={clusters}
        onChange={handleClusterChange(vm.id)}
      />,
  }));

  const mapDiskAttachments = (
    diskAttachmentVos = []
  ) => [...diskAttachmentVos].map(diskAttach => {
      const disk = diskAttach?.diskImageVo || {};
      return {
        ...disk,
        _alias: disk?.alias || '',
        // id: disk.id || '',
        virtualSize: disk?.size + " GiB" || 0,
        actualSize: disk?.actualSize + " GiB" || 0,
        status: disk?.status || '',
        sparse: (disk?.sparse === true ? Localization.kr.THIN_PROVISIONING : Localization.kr.PREALLOCATED) || '',
        storageType: disk?.storageTypeKr || disk?.storageType || '',
        description: disk?.description || '',
        creationTime: disk?.dateCreated
      };
  });

  const mapNics = (
    nicVos = []
  ) => [...nicVos].map((nic) => {
    return {
      ...nic,
    }
  })


  // 개별 가상머신 row 반환
  const vmTableRows = (vm) => [
    {
      label: Localization.kr.NAME,
      value: (
        <LabelInput id={`vm-name-${vm.id}`}
          label={""}
          value={editVmNames[vm.id] !== undefined ? editVmNames[vm.id] : vm.name || ""}
          onChange={e => {
            const newName = e.target.value;
            setEditVmNames(prev => ({ ...prev, [vm.id]: newName }));
          }}
        />
      ),
    },
    {
      label: "현재 이름",
      value: editVmNames[vm.id] !== undefined ? editVmNames[vm.id] : vm.name || ""
    },
    { label: Localization.kr.DESCRIPTION,          value: vm.description || "" },
    { label: Localization.kr.TEMPLATE,             value: vm.templateVo?.name || "" },
    { label: Localization.kr.OPERATING_SYSTEM,     value: vm.osTypeName || vm.osType },
    { label: "칩셋/펌웨어 유형",                      value: vm.biosTypeKr || vm.biosType },
    { label: "그래픽 프로토콜",                       value: vm.displayTypeKr || vm.displayType },
    { label: Localization.kr.OPTIMIZATION_OPTION,   value: vm.optimizeOptionKr || vm.optimizeOption },
    { label: `설정된 ${Localization.kr.MEMORY}`,     value: checkZeroSizeToMB(vm.memoryGuaranteed) || "" },
    { label: `할당할 실제 ${Localization.kr.MEMORY}`, value: checkZeroSizeToMB(vm.memorySize) || "" },
    { label: "CPU 코어 수", value: `${vm.cpuTopologyCnt} (${vm.cpuTopologySocket}:${vm.cpuTopologyCore}:${vm.cpuTopologyThread})` || "" },
    { label: "모니터 수",                             value: vm.monitor || "" },
    { label: Localization.kr.HA,                     value: vm.ha === true ? "예":"아니요" || "" },
    { label: "우선 순위",                              value: vm.haPriority || "" },
    { label: "USB",                                  value: vm.usb === true ? "활성화":"비활성화" || "" },
    { label: Localization.kr.STATELESS,              value: vm.stateless === true ? "예":"아니요" || "" },
    { label: "ID", value: vm.id || "" },
  ];


  const validateForm = () => {
    Logger.debug(`DomainImportVmModal > validateForm ... `)
    // const nameError = checkName(formState.name);
    // if (nameError) return nameError;
    
    // 전체 가상머신목록에서 이름빼와서 이름비교(없는 항목만 생성되게)
    return null;
  };

  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) {
      validationToast.fail(error);
      return;
    }
  
    Logger.debug(`DomainImportVmModal > handleFormSubmit ... `)
    vmList.forEach((vm) => {
      const clusterId = clusterList[vm.id];
      if (!clusterId) return;

      Logger.debug(`DomainImportVmModal > handleFormSubmit ... vm.id: ${vmsSelected[0]?.id}`)
      Logger.debug(`DomainImportVmModal > handleFormSubmit ... vm.name: ${editVmNames[vm.id]}`)

      registerVm({
        storageDomainId: domainsSelected[0]?.id,
        vmVo: {
          id: vm?.id,
          name: editVmNames[vm.id],
          clusterVo: { id: clusterId }
        },
        partialAllow: !!partialAllow[vm.id],
        relocation: !!relocation[vm.id]
      });
    });

  };

  return (
    <BaseModal targetName={Localization.kr.VM} submitTitle={Localization.kr.IMPORT}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "980px" }} 
    >
      <div className="section-table-outer">
        <TablesOuter target={"vm"}
          columns={TableColumnsInfo.VMS_IMPORT_NAMES}
          data={transformedData}
          shouldHighlight1stCol={true}
          isSuccess={true}
          onRowClick={(selectedRows) => setSelectedVmId(selectedRows[0].id)}
        />
      </div>
      <br/>

      <div className="filter-table">
        <div className="mb-2">
          <FilterButtons options={filterOptions} activeOption={activeFilter} onClick={setActiveFilter} />
        </div>

        {/* 섹션 변경 */}
        {/* {activeFilter === "general" && (
          <div className="get-vm-info f-btw three-columns">
            {Array.from({ length: 3 }, (_, groupIndex) => {
              const splitRows = vmTableRows.filter((_, index) => index % 3 === groupIndex);
              return (
                <InfoTable tableRows={splitRows} />
              );
            })}
          </div>
        )} */}
        {activeFilter === "general" && selectedVm && (
          <div>
            <InfoTable tableRows={vmTableRows(selectedVm)} />
          </div>
        )}
        {activeFilter === "disk" && (
          <TablesOuter
            target={"disk"}
            columns={TableColumnsInfo.VMS_DISKS_IMPORT_FROM_STORAGE_DOMAIN}
            data={mapDiskAttachments(selectedVm?.diskAttachmentVos || [])}
            isSuccess={true}
            shouldHighlight1stCol={true}
            onRowClick={{ console }}
          />
        )}

        {activeFilter === "network" && (
          <TablesOuter target={"network"}
            columns={TableColumnsInfo.NETWORK_INTERFACE_FROM_HOST}
            data={mapNics(selectedVm?.nicVos || [])}
            shouldHighlight1stCol={true}
            onRowClick={{ console }}
          />
        )}
        
        {activeFilter === "vnicProfile" && (
          <TablesOuter target={"vnicProfile"}
            columns={TableColumnsInfo.VMS_VNICPROFILES_IMPORT_FROM_STORAGE_DOMAIN}
            data={[]}
            shouldHighlight1stCol={true}
            onRowClick={{ console }}
            isSuccess={true}
          />
        )}
      </div>
    </BaseModal>
  );
};

export default DomainImportVmModal;

const filterOptions = [
  { key: "general", label: Localization.kr.GENERAL },
  { key: "disk", label: Localization.kr.DISK },
  { key: "network", label: Localization.kr.NICS },
  { key: "vnicProfile", label: Localization.kr.VNIC_PROFILE },
];