import React, { useEffect, useMemo, useState } from "react";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import useGlobal                        from "@/hooks/useGlobal";
import BaseModal                        from "../BaseModal";
import TabNavButtonGroup                from "@/components/common/TabNavButtonGroup";
import LabelInput                       from "@/components/label/LabelInput";
import LabelSelectOptions               from "@/components/label/LabelSelectOptions";
import {
  handleInputChange
} from "@/components/label/HandleInput";
import { 
  useAllTemplates,
  useAllVmTypes,
  useEditTemplate, 
  useTemplate
} from "@/api/RQHook";
import { 
  checkDuplicateName, 
  checkName, 
  emptyIdNameVo
} from "@/util";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";

const initialFormState = {
  id: "",
  name: "",
  description: "",
  comment: "",
  optimizeOption: "server",
  biosType: "q35_ovmf",
  // stateless: false,
  // startPaused: false,
  // deleteProtected: false,
  monitor: 1
};

const TemplateEditModal = ({
  isOpen, onClose,
}) => {
  const { validationToast } = useValidationToast();
  const { templatesSelected } = useGlobal()
  const templateId = templatesSelected[0]?.id;

  const [formState, setFormState] = useState(initialFormState);
  const [clusterVo, setClusterVo] = useState(emptyIdNameVo());

  const { mutate: editTemplate } = useEditTemplate(onClose, onClose);

  const {
    data: template,
    isLoading: isTemplateLoading,
    isSuccess: isTemplateSuccess,
  } = useTemplate(templateId);
  const {
    data: templates=[],
    isLoading: isTemplatesLoading,
    isSuccess: isTemplatesSuccess,
  } = useAllTemplates();

  // 최적화 옵션 가져오기
  const {
    data: vmTypes = [],
    isLoading: isVmTypesLoading,
    isSuccess: isVmTypesSuccess,
  } = useAllVmTypes((e) => ({ 
    ...e,
    value: e?.id?.toLowerCase(),
    label: e?.kr
  }))

  const [activeTab, setActiveTab] = useState("general");
  const tabs = useMemo(() => ([
    { id: "general", label: Localization.kr.GENERAL, onClick: () => setActiveTab("general") },
    { id: "console", label: Localization.kr.CONSOLE, onClick: () => setActiveTab("console") },
  ]), []);
/*
   useEffect(() => {
     if (isOpen) {
       setActiveTab("general"); // 모달이 열릴 때 기본적으로 "general" 설정
     }
   }, [isOpen]);
   const [activeTab, setActiveTab] = useState("general");

   //해당데이터 상세정보 가져오기
   const { data: templateData } = useTemplate(templatesSelected[0]?.id);
   const [selectedOptimizeOption, setSelectedOptimizeOption] = useState("server"); // 칩셋 선택
  // const [selectedChipset, setSelectedChipset] = useState("Q35_OVMF"); // 칩셋 선택
*/

  // 초기값설정
  useEffect(() => {
    if (!isOpen) {
      setFormState(initialFormState);
      setClusterVo(emptyIdNameVo());
      setActiveTab("general");
    }
    if (isOpen && template) {
      setFormState({
        id: template?.id || "",
        name: template?.name || "",
        description: template?.description || "",
        comment: template?.comment || "",
        optimizeOption: template?.optimizeOption?.toLowerCase() || "server",
        biosType: template?.biosType || "q35_ovmf",
        // stateless: Boolean(template?.stateless),
        // startPaused: Boolean(template?.startPaused),
        // deleteProtected: Boolean(template?.deleteProtected),
        monitor: Number(template?.monitor?? 1),
      });
      setClusterVo({
        id: template?.clusterVo?.id,
        name: template?.clusterVo?.name
      })
    }
  }, [isOpen, template]);

  const dataToSubmit = {
    ...formState,
    clusterVo,
    // monitor: Number(monitor)
  };
      
  const validateForm = () => {
    const nameError = checkName(formState.name);
    if (nameError) return nameError;
    const duplicateError = checkDuplicateName(templates, formState.name, formState.id);
    if (duplicateError) return duplicateError;
    return null
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      validationToast.fail(error);
      return;
    }
    
    Logger.debug(`TemplateEditModal > handleFormSubmit ... dataToSubmit: `, dataToSubmit);

    editTemplate({
      templateId: formState.id,
      templateData: dataToSubmit,
    });
  };

  return (
    <BaseModal targetName={Localization.kr.TEMPLATE} submitTitle={Localization.kr.UPDATE}
      isOpen={isOpen} onClose={onClose} 
      isReady={
        isTemplateSuccess && isTemplatesSuccess && isVmTypesSuccess
      }
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "750px", height: "400px" }} 
    >
      <div className="popup-content-outer flex">
        {/* 왼쪽 네비게이션 */}
        <TabNavButtonGroup tabs={tabs} tabActive={activeTab} />

        <div className="w-full px-7">
          <div>
            <LabelSelectOptions id="optimization" label={Localization.kr.OPTIMIZATION_OPTION}
              value={formState.optimizeOption}
              options={vmTypes}
              loading={isVmTypesLoading}
              onChange={handleInputChange(setFormState, "optimizeOption", validationToast)}
            />
          </div>
          <hr/>
          {activeTab === "general" && (
            <>
              <LabelInput id="name" label={Localization.kr.NAME}
                value={formState.name}
                onChange={handleInputChange(setFormState, "name", validationToast) }
              />
              <LabelInput id="description" label={Localization.kr.DESCRIPTION}
                value={formState.description}
                onChange={handleInputChange(setFormState, "description", validationToast) }
              />
              <LabelInput id="comment" label={Localization.kr.COMMENT}
                value={formState.comment}
                onChange={handleInputChange(setFormState, "comment", validationToast) }
              />
              {/*      
              <LabelCheckbox id="stateless"
                label={Localization.kr.STATELESS}
                checked={stateless}
                onChange={(checked) => setStateless(checked)}
              />
              <LabelCheckbox
                id="start_in_pause_mode"
                label="일시정지 모드에서 시작"
                checked={startPaused}
                onChange={(checked) => setStartPaused(checked)}
              />
              <LabelCheckbox
                id="prevent_deletion"
                label="삭제 방지"
                checked={deleteProtected}
                onChange={(checked) => setDeleteProtected(checked)}
              />
              */}
            </>
          )}
          {activeTab  === "console" && (
           <>
            <div className="graphic-console font-bold pt-3">그래픽 콘솔</div>
            <LabelInput id="name" label="모니터 수"
              value={formState.monitor}
              disabled
              onChange={handleInputChange(setFormState, "monitor", validationToast) }
            />
            {/* <LabelSelectOptions label="모니터 수"
              id="monitor"              
              disabled
              value={formState.monitor} 
              options={monitorOptions}
              onChange={handleInputChange(setFormState, "monitor")}
            /> */}
          </>
          )}
        </div>
      </div>
    </BaseModal>
  );
};

export default TemplateEditModal;
