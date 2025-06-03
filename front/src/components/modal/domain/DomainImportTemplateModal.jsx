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

/**
 * @name DomainImportTemplateModal
 * @description 도메인 템플릿 가져오기 모달
 *
 * @prop {boolean} isOpen
 *
 * @returns {JSX.Element} DomainImportTemplateModal
 */
const DomainImportTemplateModal = ({ 
  isOpen, onClose,
}) => {
  const { validationToast } = useValidationToast();

  const [activeFilter, setActiveFilter] = useState("general");
  const { 
    domainsSelected, 
    templatesSelected, setTemplatesSelected 
  } = useGlobal();
  
  const [templateList, setTemplateList] = useState([]);
  const [clusterList, setClusterList] = useState({}); // 해당 도메인이 가진 데이터센터가 가지고 있는 클러스터 리스트
  const [selectedTmpId, setSelectedTmpId] = useState(null);

  const selectedTmp = templateList.find(tmp => tmp.id === selectedTmpId) || templateList[0];

  useEffect(() => {
    if (isOpen && templatesSelected.length > 0) {
      setTemplateList(templatesSelected);
      setSelectedTmpId(templateList[0]?.id);
    }
  }, [isOpen]);

  const {
    data: clusters = [],
    isLoading: isDcClustersLoading,
  } = useClustersFromDataCenter(domainsSelected[0]?.dataCenterVo?.id, (e) => ({...e,}));
  
  useEffect(() => {
    if (templateList?.length && clusters.length) {
      setClusterList((prev) => {
        const next = { ...prev };
        templateList.forEach(temp => {
          if (!next[temp.id]) {
            next[temp.id] = clusters[0].id;
          }
        });
        return next;
      });
    }
  }, [templateList, clusters]);

  useEffect(()=>{
    console.log("$ domainsSelected ", domainsSelected)
    console.log("$ templatesSelected ", templatesSelected)
  }, []);

  const handleClusterChange = (tempId) => (selected) => {
    setClusterList(prev => ({ ...prev, [tempId]: selected.id }));
  };

  // 개별 템플릿 row 반환
  const templateTableRows = (template) => [
    { label: "ID", value: template.id || "" },
    { label: Localization.kr.NAME, value: template.name || "" },
    { label: Localization.kr.DESCRIPTION, value: template.description || "" },
    { label: `${Localization.kr.HOST} ${Localization.kr.CLUSTER}`, value: "" },
    { label: "운영 시스템", value: template.osSystem || "" },
    { label: "칩셋/펌웨어 유형", value: template.chipsetFirmwareType || "" },
    { label: "그래픽 프로토콜", value: template.displayType || "" },
    { label: "최적화 옵션", value: template.optimizeOption || "" },
    { label: `설정된 ${Localization.kr.MEMORY}`, value: template.memory || "" },
    { label: "CPU 코어 수", value: `${template.cpuTopologyCnt} (${template.cpuTopologySocket}:${template.cpuTopologyCore}:${template.cpuTopologyThread})` || "" },
    { label: "모니터 수", value: template.monitor || "" },
    { label: Localization.kr.HA, value: template.ha === true ? "예":"아니요" || "" },
    { label: "우선 순위", value: template.haPriority || "" },
    { label: "USB", value: template.usb === true ? "활성화":"비활성화" || "" },
    { label: Localization.kr.STATELESS, value: template.stateless === true ? "예":"아니요" || "" },
  ];


  const validateForm = () => {
    // 템플릿은 이름 지정 없음
       
    return null;
  };

  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) {
      validationToast.fail(error);
      return;
    }
    onClose()
  };

  return (
    <BaseModal targetName={Localization.kr.TEMPLATE} submitTitle={Localization.kr.IMPORT}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "780px" }} 
    >
      <div className="section-table-outer">
        {/* <TablesOuter target={"template"}
          columns={TableColumnsInfo.TEMPLATES_IMPORT_NAMES}
          data={transformedData}
          shouldHighlight1stCol={true}
          // onRowClick={{  }}
          multiSelect={true}
        /> */}
        <table>
          <thead>
            <tr>
              <th>{Localization.kr.ALIAS}</th>
              <th>{Localization.kr.MEMORY}</th>
              <th>CPU</th>
              <th>아키텍처</th>
              <th>{Localization.kr.DISK}</th>
              <th>{Localization.kr.CLUSTER}</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(templateList) && templateList.map((t) => (
              <tr 
                key={t.id} 
                onClick={() => setSelectedTmpId(t?.id)}
              >
                <td>{t.name}</td>
                <td>{t.memory}</td>
                <td>{t.cpu}</td>
                <td>{t.cpuArc}</td>
                <td>디스크 개수</td>
                <td className="w-[230px]">
                  <LabelSelectOptionsID
                    value={clusterList[t.id] || ""}
                    loading={isDcClustersLoading}
                    options={clusters}
                    onChange={handleClusterChange(t.id)}
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
          <div className="get-template-info f-btw three-columns">
            {Array.from({ length: 3 }, (_, groupIndex) => {
              const splitRows = templateTableRows.filter((_, index) => index % 3 === groupIndex);
              return (
                <InfoTable tableRows={splitRows} />
              );
            })}
          </div>
        )} */}
        {activeFilter === "general" && selectedTmp && (
          <div className="get-template-info f-btw three-columns">
            <div style={{ flex: 1, margin: "0 8px" }}>
              <InfoTable tableRows={templateTableRows(selectedTmp)} />
            </div>
          </div>
        )}
        {activeFilter === "disk" && (
          <TablesOuter target={"disk"}
            columns={TableColumnsInfo.GET_DISK_TEMPLATES}
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

export default DomainImportTemplateModal;

const filterOptions = [
  { key: "general", label: Localization.kr.GENERAL },
  { key: "disk", label: "디스크" },
  { key: "network", label: Localization.kr.NICS },
];