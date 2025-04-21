import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import NavButton from "../../../components/navigation/NavButton";
import HeaderButton from "../../../components/button/HeaderButton";
import { useTemplate } from "../../../api/RQHook";
import Path from "../../../components/Header/Path";
import TemplateModals from "../../../components/modal/template/TemplateModals";
import TemplateGeneral from "./TemplateGeneral";
import TemplateVms from "./TemplateVms";
import TemplateEvents from "./TemplateEvents";
import TemplateNics from "./TemplateNics";
import TemplateDisks from "./TemplateDisks";
import Localization from "../../../utils/Localization";
import { rvi24Template } from "../../../components/icons/RutilVmIcons";


/**
 * @name TemplateInfo
 * @description 탬플릿 전체
 *
 * @returns {JSX.Element} TemplateInfo
 */
const TemplateInfo = () => {
  const navigate = useNavigate();
  const { activeModal, setActiveModal, } = useUIState()
  const { id: templateId, section } = useParams();
  const { data: template, isError, isLoading } = useTemplate(templateId);
  const { templatesSelected, setTemplatesSelected } = useGlobal()

  const [activeTab, setActiveTab] = useState("general")

  useEffect(() => {
    if (isError || (!isLoading && !template)) {
      navigate("/computing/templates");
    }
    setTemplatesSelected(template)
  }, [isError, isLoading, template, navigate]);

  const handleTabClick = useCallback((tab) => {
    const path =
      tab === "general"
        ? `/computing/templates/${templateId}`
        : `/computing/templates/${templateId}/${tab}`;
    navigate(path);
    setActiveTab(tab);
  }, [templateId]);

  const pathData = useMemo(() => {
    return [
      template?.name,
      sections.find((section) => section.id === activeTab)?.label,
    ]
  }, [template, sections, activeTab]);

  const sections = useMemo(() => {
    return [
      { id: "general", label: Localization.kr.GENERAL },
      { id: "vms", label: Localization.kr.VM },
      { id: "nics", label: Localization.kr.NICS },
      { id: "disks", label: "디스크" },
      // { id: "storageDomains", label: "스토리지" },
      { id: "events", label: Localization.kr.EVENT },
    ]
  }, []);

  useEffect(() => {
    setActiveTab(section || "general");
  }, [section]);

  const renderSectionContent = () => {
    const SectionComponent = {
      general: TemplateGeneral,
      vms: TemplateVms,
      nics: TemplateNics,
      disks: TemplateDisks,
      // storageDomains: TemplateStorage,
      events: TemplateEvents,
    }[activeTab];
    return SectionComponent ? (
      <SectionComponent templateId={templateId} />
    ) : null;
  };

  const sectionHeaderButtons = useMemo(() => {
    return [
      { type: "update", onClick: () => setActiveModal("template:update"), label: Localization.kr.UPDATE,  },
      { type: "remove", onClick: () => setActiveModal("template:remove"), label: Localization.kr.REMOVE,  },
      { type: "addVm", onClick: () => setActiveModal("template:addVm"), label: "새 가상머신", },
    ];
  }, [])

  return (
    <div id="section">
      <HeaderButton titleIcon={rvi24Template()}
        title={template?.name}
        buttons={sectionHeaderButtons}
      />
      <div className="content-outer">
        <NavButton
          sections={sections}
          activeSection={activeTab}
          handleSectionClick={handleTabClick}
        />
        <div className="w-full info-content">
          <Path pathElements={pathData} basePath={`/computing/templates/${templateId}`}/>
          {renderSectionContent()}
        </div>
      </div>

      {/* template 모달창 */}
      <TemplateModals template={template} />
    </div>
  );
};

export default TemplateInfo;
