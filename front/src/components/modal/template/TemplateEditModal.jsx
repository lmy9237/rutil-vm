import React, { useEffect, useMemo, useState } from "react";
import { useToast }           from "@/hooks/use-toast";
import useUIState             from "@/hooks/useUIState";
import useGlobal              from "@/hooks/useGlobal";
import BaseModal              from "../BaseModal";
import TabNavButtonGroup      from "@/components/common/TabNavButtonGroup";
import LabelInput             from "@/components/label/LabelInput";
import LabelCheckbox          from "@/components/label/LabelCheckbox";
import LabelSelectOptions     from "@/components/label/LabelSelectOptions";
import { 
  useEditTemplate, 
  useTemplate
} from "@/api/RQHook";
import Localization            from "@/utils/Localization";
import Logger                  from "@/utils/Logger";

const TemplateEditModal = ({
  isOpen,
  onClose,
  editMode = false,
}) => {
  const { toast } = useToast();
  // const { closeModal } = useUIState()
  const { templatesSelected } = useGlobal()
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [comment, setComment] = useState("");
  const [osSystem, setOsSystem] = useState(""); // 운영체제 string
  const [chipsetFirmwareType, setChipsetFirmwareType] = useState(""); // string
  const [stateless, setStateless] = useState(false); // 상태비저장
  const [startPaused, setStartPaused] = useState(false); // 일시정지상태에서시작
  const [deleteProtected, setDeleteProtected] = useState(false); // 일시정지상태에서시작
  const [clsuterVoId, setClsuterVoId] = useState("");
  const [clsuterVoName, setClsuterVoName] = useState("");
  const [monitor, setMonitor] = useState(1); // 숫자 타입

  const { mutate: editTemplate } = useEditTemplate(onClose, onClose);
  
  // 최적화옵션(영어로 값바꿔야됨)
  const [optimizeOption, setOptimizeOption] = useState([
    { value: "desktop", label: "데스크톱" },
    { value: "high_performance", label: "고성능" },
    { value: "server", label: "서버" },
  ]);
  const monitorOptions = [
    { value: 1, label: "1개" },
    { value: 2, label: "2개" },
    { value: 3, label: "3개" },
  ];
  const tabs = useMemo(() => ([
    { id: "general", label: Localization.kr.GENERAL, onClick: () => setActiveTab("general") },
    { id: "console", label: Localization.kr.CONSOLE, onClick: () => setActiveTab("console") },
  ]), []);

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
useEffect(() => {
  if (isOpen && templateData) {
    console.log("🧩 선택한 템플릿 정보:", templateData); 
  }
}, [isOpen, templateData]);

useEffect(() => {
  if (isOpen && templateData) {
    console.log("🧩 templateData startPaused:", templateData.startPaused)
    console.log("🧩 templateData stateless:", templateData.stateless)
    console.log("🧩 templateData deleteProtected:", templateData.deleteProtected)
  }
}, [isOpen, templateData]);

  // 초기값설정
  useEffect(() => {
    if (isOpen) {
      const template = templateData;
      if (template) {
        setId(template?.id || "");
        setName(template?.name || ""); 
        setDescription(template?.description || "");
        setComment(template?.comment || "");
        setOsSystem(template?.osSystem || "");
      
        setClsuterVoId(template.clusterVo?.id || "");
        setClsuterVoName(template.clusterVo?.name || "");
        setMonitor(Number(template?.monitor ?? 1)); // ✅
 setStateless(Boolean(template?.stateless));
setStartPaused(Boolean(template?.startPaused));
setDeleteProtected(Boolean(template?.deleteProtected));
        setSelectedOptimizeOption(template?.optimizeOption || "server");
    //  setSelectedChipset(template?.chipsetFirmwareType || "Q35_OVMF");
      }
    }
  }, [isOpen, templateData]);

  const validateForm = () => {
    Logger.debug(`TemplateEditModal > validateForm ... `)
    if (name === "") return `${Localization.kr.NAME}을 입력해주세요.`
    return null
  }

  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) {
      toast({
        variant: "destructive",
        title: "문제가 발생하였습니다.",
        description: error,
      });
      return;
    }
    
    const dataToSubmit = {
      clusterVo: {
        id: clsuterVoId || "",
        name: clsuterVoName || "",
      },
      id,
      name,
      description,
      comment,
      optimizeOption: selectedOptimizeOption,
      osSystem,
      stateless,
      startPaused,
      deleteProtected,
      monitor: Number(monitor)
    };
    
    Logger.debug(`ddddddddddTemplateEditModal > handleFormSubmit ... dataToSubmit: `, dataToSubmit);
    if (editMode) {
      dataToSubmit.id = id;
      editTemplate({
        templateId: id,
        templateData: dataToSubmit,
      });
    }
  };

  return (
    
    <BaseModal targetName={Localization.kr.TEMPLATE} submitTitle={editMode ? Localization.kr.UPDATE : Localization.kr.CREATE}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "800px", height: "450px" }} 
    >
  
      <div className="popup-content-outer flex">
        {/* 왼쪽 네비게이션 */}
        <TabNavButtonGroup 
          tabs={tabs} 
          tabActive={activeTab}
        />

        <div className="w-full px-7">
          <div>
            <LabelSelectOptions
              id="optimization"
              label="최적화 옵션"
              value={selectedOptimizeOption}
              onChange={(e) => setSelectedOptimizeOption(e.target.value)}
              options={optimizeOption}
            />
          </div>
          <hr/>
          {activeTab === "general" && (
            <>
              <LabelInput id="template_name"
                label={Localization.kr.NAME}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
              <LabelInput id="description"
                label={Localization.kr.DESCRIPTION}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <LabelInput id="comment"
                label={Localization.kr.COMMENT}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
     
              <LabelCheckbox id="stateless"
                label={Localization.kr.STATELESS}
                checked={stateless}
                onChange={(e) => setStateless(e.target.checked)}
              />
              
              <LabelCheckbox
                id="start_in_pause_mode"
                label="일시정지 모드에서 시작"
                checked={startPaused}
                onChange={(e) => setStartPaused(e.target.checked)}
              />

              <LabelCheckbox
                id="prevent_deletion"
                label="삭제 방지"
                checked={deleteProtected}
                onChange={(e) => setDeleteProtected(e.target.checked)}
              />
           
            </>
          )}
          {activeTab  === "console" && (
           <>
            <div className="graphic-console font-bold pt-3">그래픽 콘솔</div>
            <LabelSelectOptions
              id="monitor"
              label="모니터 수"
              value={monitor} 
              onChange={(e) => setMonitor(Number(e.target.value))}
              options={monitorOptions}
              disabled
            />
          </>
          )}
        </div>
      </div>
    </BaseModal>
  );
};

export default TemplateEditModal;
