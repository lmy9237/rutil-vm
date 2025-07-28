import { useState, useEffect } from "react";
import { useValidationToast }     from "@/hooks/useSimpleToast";
import useGlobal                  from "@/hooks/useGlobal";
import FilterButtons              from "@/components/button/FilterButtons";
import BaseModal                  from "@/components/modal/BaseModal";
import LabelSelectOptionsID       from "@/components/label/LabelSelectOptionsID";
import TablesOuter                from "@/components/table/TablesOuter";
import TableColumnsInfo           from "@/components/table/TableColumnsInfo";
import { InfoTable }              from "@/components/table/InfoTable";
import {
  useClustersFromDataCenter
} from "@/api/RQHook";
import { 
  checkKoreanName, 
  checkName
} from "@/util";
import Localization               from "@/utils/Localization";
import Logger                     from "@/utils/Logger";
import "./MDomain.css";

const initialFormState = {
  id: "",
  name: "",
  comment: "",
  description: "",
};

/**
 * @name DomainImportVmTemplateModal
 * @description 도메인 가상머신/템플릿 가져오기 모달
 *
 * @prop {boolean} isOpen
 *
 * @returns {JSX.Element} DomainImportVmTemplateModal
 */
const DomainImportVmTemplateModal = ({ 
  isOpen,
  onClose,
  type="vm", 
}) => {
  const isVmMode = type === "vm"; // true면 "가상머신", false면 "템플릿"
  const { validationToast } = useValidationToast();

  const [activeFilter, setActiveFilter] = useState("general");
  const { 
    domainsSelected, 
    vmsSelected, setVmsSelected, 
    templatesSelected, setTemplatesSelected 
  } = useGlobal();
  
  const [vmsList, setVmsList] = useState([]);
  const [templateList, setTemplateList] = useState([]);
  const [clusterList, setClusterList] = useState({}); // 해당 도메인이 가진 데이터센터가 가지고 있는 클러스터 리스트
  
  const {
    data: clusters = [],
    isLoading: isDcClustersLoading,
  } = useClustersFromDataCenter(domainsSelected[0]?.dataCenterVo?.id, (e) => ({...e,}));

  useEffect(() => {
    if (isOpen && templatesSelected.length > 0) {
      setTemplateList(templatesSelected);
    }
  }, [isOpen]);
  
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
    Logger.debug(`DomainImportVmTemplateModal > useEffect ... domainsSelected: `, domainsSelected)
    Logger.debug(`DomainImportVmTemplateModal > useEffect ... templatesSelected: `, templatesSelected)
  }, []);


  // 임시 데이터 (데이터가 없을 경우 기본값 사용)
  const placeholderData = [
    {
      alias: "001",
      virtualSize: "100GB",
      profiles: [
        { value: "profile1", label: "Profile A" },
        { value: "profile2", label: "Profile B" },
      ],
    }
  ];

  const templateTableRows = [
    { label: "ID", value: "" },
    { label: Localization.kr.NAME, value: "이름" },
    { label: Localization.kr.DESCRIPTION, value: "설명" },
    { label: `${Localization.kr.HOST} ${Localization.kr.CLUSTER}`, value: "Cluster-01" },
    { label: Localization.kr.OPERATING_SYSTEM, value: "" },
    { label: "칩셋/펌웨어 유형", value: "" },
    { label: "그래픽 프로토콜", value: "" },
    { label: "비디오 유형", value: "" },
    { label: Localization.kr.OPTIMIZATION_OPTION, value: "" },
    { label: `설정된 ${Localization.kr.MEMORY}`, value: "" },
    { label: "CPU 코어 수", value: "4" },
    { label: "모니터 수", value: "1" },
    { label: Localization.kr.HA, value: "" },
    { label: "우선 순위", value: "" },
    { label: "USB", value: "" },
    { label: Localization.kr.STATELESS, value: "" },
  ];

  const vmTableRows = [
    { label: "ID", value: "" },
    { label: Localization.kr.NAME, value: "이름" },
    { label: Localization.kr.DESCRIPTION, value: "설명" },
    { label: `실행 ${Localization.kr.HOST}`, value: "Cluster-01" },
    { label: `${Localization.kr.TEMPLATE}`, value: "Template" },
    { label: Localization.kr.OPERATING_SYSTEM, value: "" },
    { label: "칩셋/펌웨어 유형", value: "" },
    { label: "그래픽 프로토콜", value: "" },
    { label: "비디오 유형", value: "" },
    { label: Localization.kr.OPTIMIZATION_OPTION, value: "" },
    { label: `설정된 ${Localization.kr.MEMORY}`, value: "" },
    { label: "CPU 코어 수", value: "4" },
    { label: "모니터 수", value: "1" },
    { label: Localization.kr.HA, value: "" },
    { label: "우선 순위", value: "" },
    { label: "USB", value: "" },
    { label: Localization.kr.STATELESS, value: "" },
  ];
  
  const validateForm = () => {
    Logger.debug(`DomainImportVmTemplateModal > validateForm ... `)
    /*
    const nameError = checkName(formState.name);
    if (nameError) return nameError;
    */
    
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
    <BaseModal targetName={ isVmMode ? Localization.kr.VM : Localization.kr.TEMPLATE}
      submitTitle={Localization.kr.IMPORT}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "880px" }} 
    >
      <div className="section-table-outer">
        {isVmMode ? (
          <TablesOuter
            columns={TableColumnsInfo.VMS_IMPORT_NAMES}
            data={[]}
            shouldHighlight1stCol={true}
            onRowClick={{  }}
          />
        ): (
          <TablesOuter
            columns={TableColumnsInfo.TEMPLATES_IMPORT_NAMES}
            data={[]}
            shouldHighlight1stCol={true}
            onRowClick={{  }}
          />
        )}
      </div>
      <br/>
      <div className="filter-table">
        <div className="mb-2">
          <FilterButtons options={filterOptions} activeOption={activeFilter} onClick={setActiveFilter} />
        </div>

        {/* 섹션 변경 */}
        {activeFilter === "general" && (
          <div className="get-template-info f-btw three-columns">
            {Array.from({ length: 3 }, (_, groupIndex) => {
              const splitRows = isVmMode
                ? vmTableRows.filter((_, index) => index % 3 === groupIndex)
                : templateTableRows.filter((_, index) => index % 3 === groupIndex);
              return (
                <InfoTable tableRows={splitRows} />
              );
            })}
          </div>
        )}
        {activeFilter === "disk" && (
          <TablesOuter target={"disk"}
            columns={TableColumnsInfo.GET_DISK_TEMPLATES}
            data={[]}
            shouldHighlight1stCol={true}
            onRowClick={{ console }}
          />
        )}
        {activeFilter === "network" && (
          <TablesOuter target={"network"}
            columns={TableColumnsInfo.NETWORK_INTERFACE_FROM_HOST}
            data={[]}
            shouldHighlight1stCol={true}
            onRowClick={{ console }}
          />
        )}
      </div>
    </BaseModal>
  );
};

export default DomainImportVmTemplateModal;

const filterOptions = [
  { key: "general", label: Localization.kr.GENERAL },
  { key: "disk", label: "디스크" },
  { key: "network", label: Localization.kr.NICS },
];