import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import SectionLayout from "../../../components/SectionLayout";
import NavButton from "../../../components/navigation/NavButton";
import HeaderButton from "../../../components/button/HeaderButton";
import { useTemplate } from "../../../api/RQHook";
import Path from "../../../components/Header/Path";
import TemplateGeneral from "./TemplateGeneral";
import TemplateVms from "./TemplateVms";
import TemplateEvents from "./TemplateEvents";
import TemplateNics from "./TemplateNics";
import TemplateDisks from "./TemplateDisks";
import Localization from "../../../utils/Localization";
import { rvi24Template } from "../../../components/icons/RutilVmIcons";
import Logger from "../../../utils/Logger";

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
  const {
    data: template,
    isError: isTemplateError,
    isLoading: isTemplateLoading,
  } = useTemplate(templateId);
  const { templatesSelected, setTemplatesSelected } = useGlobal()

  const [activeTab, setActiveTab] = useState("general")

  useEffect(() => {
    if (isTemplateError || (!isTemplateLoading && !template)) {
      navigate("/computing/templates");
    }
    setTemplatesSelected(template)
  }, [template]);

  const handleTabClick = useCallback((tab) => {
    Logger.debug(`TemplateInfo > handleTabClick ... templateId: ${templateId}`)
    const path = tab === "general"
      ? `/computing/templates/${templateId}`
      : `/computing/templates/${templateId}/${tab}`;
    navigate(path);
    setActiveTab(tab);
  }, [templateId]);

  const sections = useMemo(() => ([
    { id: "general", label: Localization.kr.GENERAL },
    { id: "vms", label: Localization.kr.VM },
    { id: "nics", label: Localization.kr.NICS },
    { id: "disks", label: "디스크" },
    // { id: "storageDomains", label: "스토리지" },
    { id: "events", label: Localization.kr.EVENT },
  ]), []);

  const pathData = useMemo(() => ([
    template?.name,
    sections.find((section) => section.id === activeTab)?.label,
  ]), [template, sections, activeTab]);

  useEffect(() => {
    setActiveTab(section || "general");
  }, [section]);

  const renderSectionContent = useCallback(() => {
    Logger.debug(`TemplateInfo > renderSectionContent ...`)
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
  }, [activeTab, templateId]);

  const sectionHeaderButtons = useMemo(() => [
    { type: "update", onClick: () => setActiveModal("template:update"), label: Localization.kr.UPDATE,  },
    { type: "remove", onClick: () => setActiveModal("template:remove"), label: Localization.kr.REMOVE,  },
    { type: "addVm",  onClick: () => setActiveModal("vm:create"),  label: `새 ${Localization.kr.VM}`, },
  ], [])

  return (
    <SectionLayout>
      <HeaderButton title={template?.name}
        titleIcon={rvi24Template()}
        buttons={sectionHeaderButtons}
      />
      <div className="content-outer">
        <NavButton
          sections={sections}
          activeSection={activeTab}
          handleSectionClick={handleTabClick}
        />
        <div className="info-content v-start gap-8 w-full">
          <Path pathElements={pathData} basePath={`/computing/templates/${templateId}`} />
          {renderSectionContent()}
        </div>
      </div>
    </SectionLayout>
  );
};

export default TemplateInfo;
