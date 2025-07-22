import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useUIState             from "@/hooks/useUIState";
import useGlobal              from "@/hooks/useGlobal";
import SectionLayout          from "@/components/SectionLayout";
import TabNavButtonGroup      from "@/components/common/TabNavButtonGroup";
import HeaderButton           from "@/components/button/HeaderButton";
import Path                   from "@/components/Header/Path";
import { rvi24HardDrive }     from "@/components/icons/RutilVmIcons";
import DiskGeneral            from "./DiskGeneral";
import DiskVms                from "./DiskVms";
import DiskDomains            from "./DiskDomains";
import {
  useDisk
} from "@/api/RQHook";
import Localization           from "@/utils/Localization";
import Logger                 from "@/utils/Logger";
/**
 * @name DiskInfo
 * @description 디스크 종합정보
 * (/storages/disks)
 *
 * @returns
 */
const DiskInfo = () => {
  const navigate = useNavigate();
  const {
    activeModal, setActiveModal,
    tabInPage, setTabInPage,
  } = useUIState()
  const { setDisksSelected } = useGlobal()
  const { id: diskId, section } = useParams();
  const {
    data: disk,
    isLoading: isDiskLoading,
    isError: isDiskError,
    isSuccess: isDiskSuccess,
  } = useDisk(diskId);

  const [activeTab, setActiveTab] = useState("general");

  const tabs = useMemo(() => ([
    { id: "general",  label: Localization.kr.GENERAL,  onClick: () => handleTabClick("general") },
    { id: "vms",      label: Localization.kr.VM,       onClick: () => handleTabClick("vms") },
    { id: "domains",  label: Localization.kr.DOMAIN,   onClick: () => handleTabClick("domains") },
  ].filter((tab) => 
    !(disk?.contentType === "OVF_STORE" && tab.id === "vms")) /* OVF_STORE 유형일 때 가상머신 탭 보여줄 필요 없음 */
  ), [disk, diskId]);
  
  const pathData = useMemo(() => ([
    disk?.alias,
    tabs.find((section) => section.id === activeTab)?.label,
  ]), [disk, tabs, activeTab]);

  const renderSectionContent = useCallback(() => {
    Logger.debug(`DiskInfo > renderSectionContent ...`)
    const SectionComponent = {
      general: DiskGeneral,
      vms: DiskVms,
      domains: DiskDomains,
    }[activeTab];
    return SectionComponent ? <SectionComponent diskId={diskId} /> : null;
  }, [activeTab, diskId]);

  const sectionHeaderButtons = [
    { type: "update", label: Localization.kr.UPDATE,   onClick: () => setActiveModal("disk:update") },
    { type: "remove", label: Localization.kr.REMOVE,   onClick: () => setActiveModal("disk:remove") },
    { type: "move",   label: Localization.kr.MOVE,     onClick: () => setActiveModal("disk:move") },
    { type: "copy",   label: Localization.kr.COPY,     onClick: () => setActiveModal("disk:copy") },
    // { type: 'upload', label: Localization.kr.UPDATE, onClick: () => setActiveModal("disk:restart") },
  ];

  const handleTabClick = useCallback((tab) => {
    const path = tab === "general"
        ? `/storages/disks/${diskId}`
        : `/storages/disks/${diskId}/${tab}`;
    navigate(path);
    setTabInPage("/storages/disks", tab);
    setActiveTab(tab);
  }, [diskId]);

  useEffect(() => {
    setActiveTab(section || "general");
  }, [section]);

  useEffect(() => {
    if (isDiskError || (!isDiskLoading && !disk)) {
      navigate("/storages/disks");
    }
    const currentTabInPage = tabInPage("/storages/disks")
    setActiveTab(currentTabInPage)
    setDisksSelected(disk)
  }, [disk]);

  return (
    <SectionLayout>
      <HeaderButton title={disk?.alias}
        titleIcon={rvi24HardDrive()}
        buttons={sectionHeaderButtons}
      />
      <div className="content-outer">
        {/* 왼쪽 네비게이션 */}
        <TabNavButtonGroup
          tabs={tabs}
          tabActive={activeTab} setTabActive={setActiveTab}
        />
        <div className="info-content v-start gap-8 w-full h-full">
          <Path pathElements={pathData} basePath={`/storages/disks/${diskId}`}/>
          {renderSectionContent()}
        </div>
      </div>
    </SectionLayout>
  );
};

export default DiskInfo;
