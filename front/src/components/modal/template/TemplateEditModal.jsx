import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import BaseModal from "../BaseModal";
import TabNavButtonGroup from "../../common/TabNavButtonGroup";
import LabelInput from "../../label/LabelInput";
import LabelCheckbox from "../../label/LabelCheckbox";
import LabelSelectOptions from "../../label/LabelSelectOptions";
import { useEditTemplate, useTemplate } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";
import Logger from "../../../utils/Logger";
import "./MTemplate.css";

const TemplateEditModal = ({
  isOpen,
  editMode = false,
  templateId,
  onClose,
}) => {
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

  const { mutate: editTemplate } = useEditTemplate();
  
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
  const { data: templateData } = useTemplate(templateId);
  const [selectedOptimizeOption, setSelectedOptimizeOption] = useState("server"); // 칩셋 선택
 // const [selectedChipset, setSelectedChipset] = useState("Q35_OVMF"); // 칩셋 선택

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
        setStateless(template?.stateless || false); // 상태비저장
        setClsuterVoId(template.clusterVo?.id || "");
        setClsuterVoName(template.clusterVo?.name || "");
        setMonitor(Number(template?.monitor ?? 1)); // ✅
        setStartPaused(template?.startPaused || false);  // 일시정지 모드에서 시작
        setDeleteProtected(template?.deleteProtected || false); //  삭제 방지
        setSelectedOptimizeOption(template?.optimizeOption || "server");
    //  setSelectedChipset(template?.chipsetFirmwareType || "Q35_OVMF");
      }
    }
  }, [isOpen, templateData]);

  const handleFormSubmit = () => {
    if (name === "") {
      toast.error(`${Localization.kr.NAME}을 입력해주세요.`);
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
    
    Logger.debug(`템플릿: ${JSON.stringify(dataToSubmit, null, 2)}`);
    if (editMode) {
      dataToSubmit.id = id;
      editTemplate(
        {
          templateId: id,
          templateData: dataToSubmit,
        }, {
          onSuccess: () => {
            onClose();
            toast.success("템플릿 편집 완료");
          },
          onError: (error) => {
            toast.error("Error editing cluster:", error);
          },
        }
      );
    }
  };

  return (
    
    <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={"템플릿"}
      submitTitle={editMode ? Localization.kr.UPDATE : Localization.kr.CREATE}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "800px", height: "470px" }} 
    >
  
      <div className="popup-content-outer flex">
        {/* 왼쪽 네비게이션 */}
        <TabNavButtonGroup 
          tabs={tabs} 
          tabActive={activeTab}
        />

        <div className="backup-edit-content">
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
          {activeTab  === "general" && (
            <>
            <div className="template-edit-texts">
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
            </div>

            <div >
              <LabelCheckbox id="stateless"
                className="t-new-checkbox"
                label={Localization.kr.STATELESS}
                checked={stateless}
                onChange={(e) => setStateless(e.target.checked)}
              />
              
              <LabelCheckbox
                className="t-new-checkbox"
                id="start_in_pause_mode"
                label="일시정지 모드에서 시작"
                checked={startPaused}
                onChange={(e) => setStartPaused(e.target.checked)}
              />

              <LabelCheckbox
                className="t-new-checkbox"
                id="prevent_deletion"
                label="삭제 방지"
                checked={deleteProtected}
                onChange={(e) => setDeleteProtected(e.target.checked)}
              />
            </div>
            </>
          )}
          {activeTab  === "console" && (
            <div className="p-1">
            <div className="graphic-console">그래픽 콘솔</div>
            <div className="monitor f-btw">
              <LabelSelectOptions
                id="monitor"
                label="모니터 수"
                value={monitor} 
                onChange={(e) => setMonitor(Number(e.target.value))}
                options={monitorOptions}
                disabled
              />
            </div>
          </div>
          )}
        </div>
      </div>
    </BaseModal>
  );
};

export default TemplateEditModal;
