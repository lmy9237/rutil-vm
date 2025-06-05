import { useState, useEffect } from "react";
import BaseModal from "../BaseModal";
import TablesOuter from "../../table/TablesOuter";
import TableColumnsInfo from "../../table/TableColumnsInfo";
import FilterButtons from "../../button/FilterButtons";
import Localization from "../../../utils/Localization";
import InfoTable from "../../table/InfoTable";
import "./MDomain.css";
import useGlobal from "@/hooks/useGlobal";
import { useValidationToast } from "@/hooks/useSimpleToast";
import { useClustersFromDataCenter } from "@/api/RQHook";
import LabelSelectOptionsID from "@/components/label/LabelSelectOptionsID";
import LabelInput from "@/components/label/LabelInput";
import { checkZeroSizeToMB } from "@/util";
import LabelCheckbox from "@/components/label/LabelCheckbox";

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
    vmsSelected, setVmsSelected 
  } = useGlobal();
  
  const [vmList, setVmList] = useState([]);
  const [clusterList, setClusterList] = useState({}); // 해당 도메인이 가진 데이터센터가 가지고 있는 클러스터 리스트
  const [selectedVmId, setSelectedVmId] = useState(null);
  const [editVmNames, setEditVmNames] = useState({}); //변경된 이름저장
  const [relocation, setRelocation] = useState({}); // 불량 mac 재배치
  const [partialAllow, setPartialAllow] = useState({}); // 부분 허용
  
  const selectedVm = vmList.find(vm => vm.id === selectedVmId) || vmList[0];

  useEffect(() => {
    if (isOpen && vmsSelected.length > 0) {
      setVmList(vmsSelected);
      setSelectedVmId(vmList[0]?.id);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) setEditVmNames({});
  }, [isOpen]);

  const {
    data: clusters = [],
    isLoading: isDcClustersLoading,
  } = useClustersFromDataCenter(domainsSelected[0]?.dataCenterVo?.id, (e) => ({...e,}));
  
  useEffect(()=>{
    console.log("$ domainsSelected ", domainsSelected)
    console.log("$ vmsSelected ", vmsSelected)
  }, []);

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

  // 개별 가상머신 row 반환
  const vmTableRows = (vm) => [
    {
      label: Localization.kr.NAME,
      value: (
        <LabelInput
          id={`vm-name-${vm.id}`}
          label={""}
          value={editVmNames[vm.id] !== undefined ? editVmNames[vm.id] : vm.name || ""}
          onChange={e => {
            const newName = e.target.value;
            setEditVmNames(prev => ({ ...prev, [vm.id]: newName }));
          }}
        />
      ),
    },
    { label: Localization.kr.DESCRIPTION, value: vm.description || "" },
    { label: Localization.kr.TEMPLATE, value: vm.templateVo?.name || "" },
    { label: "운영 시스템", value: vm.osType || "" },
    { label: "칩셋/펌웨어 유형", value: vm.biosType || "" },
    { label: "그래픽 프로토콜", value: vm.displayType || "" },
    { label: "최적화 옵션", value: vm.type || "" },
    { label: `설정된 ${Localization.kr.MEMORY}`, value: checkZeroSizeToMB(vm.memoryGuaranteed) || "" },
    { label: `할당할 실제 ${Localization.kr.MEMORY}`, value: checkZeroSizeToMB(vm.memorySize) || "" },
    { label: "CPU 코어 수", value: `${vm.cpuTopologyCnt} (${vm.cpuTopologySocket}:${vm.cpuTopologyCore}:${vm.cpuTopologyThread})` || "" },
    { label: "모니터 수", value: vm.monitor || "" },
    { label: Localization.kr.HA, value: vm.ha === true ? "예":"아니요" || "" },
    { label: "우선 순위", value: vm.haPriority || "" },
    { label: "USB", value: vm.usb === true ? "활성화":"비활성화" || "" },
    { label: Localization.kr.STATELESS, value: vm.stateless === true ? "예":"아니요" || "" },
    { label: "ID", value: vm.id || "" },
  ];


  const validateForm = () => {
    // const nameError = checkName(formState.name);
    // if (nameError) return nameError;
    
    return null;
  };

  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) {
      validationToast.fail(error);
      return;
    }
    
    const mergedVmList = vmList.map(vm => ({
      id: vm.id,
      name: editVmNames[vm.id] !== undefined ? editVmNames[vm.id] : vm.name,
      clusterId: clusterList[vm.id] || "",
      relocation: !!relocation[vm.id],
      partialAllow: !!partialAllow[vm.id],
    }));

    console.log("IMPORT DATA:", mergedVmList);

  };

  return (
    <BaseModal targetName={Localization.kr.VM} submitTitle={Localization.kr.IMPORT}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "780px" }} 
    >
      <div className="section-table-outer">
        {/* <TablesOuter target={"vm"}
          columns={TableColumnsInfo.vmS_IMPORT_NAMES}
          data={transformedData}
          shouldHighlight1stCol={true}
          // onRowClick={{  }}
          multiSelect={true}
        /> */}
        <table>
          <thead>
            <tr>
              <th>{Localization.kr.NAME}</th>
              <th>{Localization.kr.MEMORY}</th>
              <th>CPU</th>
              <th>아키텍처</th>
              <th>{Localization.kr.DISK}</th>
              <th>불량 MAC 재배치</th>
              <th>부분 허용</th>
              <th>{Localization.kr.CLUSTER}</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(vmList) && vmList.map((vm) => (
              <tr
                key={vm.id}
                onClick={() => setSelectedVmId(vm?.id)}
                style={{
                  background: vm.id === selectedVmId ? "#e6f4ff" : "inherit",
                  cursor: "pointer"
                }}
              >
                <td>{vm.name}</td>
                <td>{vm.memory}</td>
                <td>{vm.cpu}</td>
                <td>{vm.cpuArc}</td>
                <td>디스크 개수</td>
                <td>
                  <LabelCheckbox id={`relocation-${vm.id}`}
                    label={""}
                    checked={!!relocation[vm.id]}
                    onChange={e => {
                      setRelocation(prev => ({ ...prev, [vm.id]: e.target.checked }));
                    }}
                  />
                </td>
                <td>
                  <LabelCheckbox id={`allow-${vm.id}`}
                    label={""}
                    checked={!!partialAllow[vm.id]}
                    onChange={e => {setPartialAllow(prev => ({ ...prev, [vm.id]: e.target.checked }));}}
                  />
                </td>
                <td>
                  <LabelSelectOptionsID
                    className="w-[280px]"
                    value={clusterList[vm.id] || ""}
                    loading={isDcClustersLoading}
                    options={clusters}
                    onChange={handleClusterChange(vm.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
          <div className="get-template-info f-btw three-columns">
            <div style={{ flex: 1, margin: "0 8px" }}>
              <InfoTable tableRows={vmTableRows(selectedVm)} />
            </div>
          </div>
        )}
        {activeFilter === "disk" && (
          <TablesOuter target={"disk"}
            columns={TableColumnsInfo.DISKS}
            data={[]}
            shouldHighlight1stCol={true}
            onRowClick={{ console }}
            multiSelect={true}
          />
        )}
        {activeFilter === "network" && (
          <TablesOuter target={"network"}
            columns={TableColumnsInfo.NETWORK_INTERFACE_FROM_HOST}
            data={[]}
            shouldHighlight1stCol={true}
            onRowClick={{ console }}
            multiSelect={true}
          />
        )}
      </div>
    </BaseModal>
  );
};

export default DomainImportVmModal;

const filterOptions = [
  { key: "general", label: Localization.kr.GENERAL },
  { key: "disk", label: "디스크" },
  { key: "network", label: Localization.kr.NICS },
];