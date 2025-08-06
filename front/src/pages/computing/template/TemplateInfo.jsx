import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useUIState             from "@/hooks/useUIState";
import useGlobal              from "@/hooks/useGlobal";
import SectionLayout          from "@/components/SectionLayout";
import TabNavButtonGroup      from "@/components/common/TabNavButtonGroup";
import HeaderButton           from "@/components/button/HeaderButton";
import Path                   from "@/components/Header/Path";
import { rvi24Template }      from "@/components/icons/RutilVmIcons";
import {
  useTemplate
} from "@/api/RQHook";
import Localization           from "@/utils/Localization";
import Logger                 from "@/utils/Logger";
import TemplateGeneral        from "./TemplateGeneral";
import TemplateVms            from "./TemplateVms";
import TemplateEvents         from "./TemplateEvents";
import TemplateNics           from "./TemplateNics";
import TemplateDisks          from "./TemplateDisks";

/**
 * @name TemplateInfo
 * @description 탬플릿 전체
 *
 * @returns {JSX.Element} TemplateInfo
 */
const TemplateInfo = () => {
  const navigate = useNavigate();
  const { 
    activeModal, setActiveModal,
    tabInPage, setTabInPage,
  } = useUIState()
  const { id: templateId, section } = useParams();
  const {
    data: template,
    isLoading: isTemplateLoading,
    isError: isTemplateError,
    isSuccess: isTemplateSuccess,
    isRefetching: isTemplateRefetching,
    refetch: refetchTemplate,
  } = useTemplate(templateId);
  const { templatesSelected, setTemplatesSelected } = useGlobal()

  const [activeTab, setActiveTab] = useState("general")

  const tabs = useMemo(() => ([
    { id: "general",  label: Localization.kr.GENERAL, onClick: () => handleTabClick("general") },
    { id: "vms",      label: Localization.kr.VM,      onClick: () => handleTabClick("vms") },
    { id: "nics",     label: Localization.kr.NICS,    onClick: () => handleTabClick("nics") },
    { id: "disks",    label: Localization.kr.DISK,    onClick: () => handleTabClick("disks") },
    // { id: "storageDomains", label: Localization.kr.DOMAIN, onClick: () => handleTabClick("storageDomains") },
    { id: "events",   label: Localization.kr.EVENT,   onClick: () => handleTabClick("events") },
  ]), [templateId]);

  const pathData = useMemo(() => ([
    template?.name,
    [...tabs].find((section) => section.id === activeTab)?.label,
  ]), [template, tabs, activeTab]);

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
    { type: "addVm",  onClick: () => setActiveModal("vm:create"), label: `새 ${Localization.kr.VM}`, disabled: true},
  ], [])

  const handleTabClick = useCallback((tab) => {
    Logger.debug(`TemplateInfo > handleTabClick ... templateId: ${templateId}`)
    const path = tab === "general"
      ? `/computing/templates/${templateId}`
      : `/computing/templates/${templateId}/${tab}`;
    navigate(path);
    setTabInPage("/computing/templates", tab);
    setActiveTab(tab);
  }, [templateId]);

  useEffect(() => {
    Logger.debug(`TemplateInfo > useEffect ... section: ${section}`)
    setActiveTab(section || "general");
  }, [section]);

  useEffect(() => {
    Logger.debug(`TemplateInfo > useEffect ... (for Automatic Tab Switch)`)
    if (isTemplateError || (!isTemplateLoading && !template)) {
      navigate("/computing/templates");
    }
    const currentTabInPage = tabInPage("/computing/templates")
    handleTabClick(currentTabInPage === "" ? "general" : currentTabInPage);
    //setActiveTab(currentTabInPage)
    setTemplatesSelected(template)
  }, [template]);

  return (
    <SectionLayout>
      <HeaderButton title={template?.name} titleIcon={rvi24Template()}
        isLoading={isTemplateLoading} isRefetching={isTemplateRefetching} refetch={refetchTemplate}
        buttons={sectionHeaderButtons}
      />
      <div className="content-outer">
        {/* 왼쪽 네비게이션 */}
        <TabNavButtonGroup
          tabs={tabs}
          tabActive={activeTab} setTabActive={setActiveTab}
        />
        <div className="info-content v-start gap-8 w-full h-full">
          <Path pathElements={pathData} basePath={`/computing/templates/${templateId}`} />
          {renderSectionContent()}
        </div>
      </div>
    </SectionLayout>
  );
};

export default TemplateInfo;
