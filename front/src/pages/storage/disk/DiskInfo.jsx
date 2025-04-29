import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavButton from "../../../components/navigation/NavButton";
import HeaderButton from "../../../components/button/HeaderButton";
import Path from "../../../components/Header/Path";
import DiskGeneral from "./DiskGeneral";
import DiskVms from "./DiskVms";
import DiskDomains from "./DiskDomains";
import Localization from "../../../utils/Localization";
import { useDisk } from "../../../api/RQHook";
import { rvi24HardDrive } from "../../../components/icons/RutilVmIcons";
import Logger from "../../../utils/Logger";
import useUIState from "../../../hooks/useUIState";
import SectionLayout from "../../../components/SectionLayout";
import useGlobal from "../../../hooks/useGlobal";

/**
 * @name DiskDomains
 * @description 디스크 종합정보
 * (/storages/disks)
 *
 * @returns
 */
const DiskInfo = () => {
  const navigate = useNavigate();
  const { activeModal, setActiveModal, } = useUIState()
  const { disksSelected, setDisksSelected } = useGlobal()

  const { id: diskId, section } = useParams();
  const {
    data: disk,
    isLoading: isDiskLoading,
    isError: isDiskError,
    isSuccess: isDiskSuccess,
  } = useDisk(diskId);

  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    if (isDiskError || (!isDiskLoading && !disk)) {
      navigate("/storages/disks");
    }
    setDisksSelected(disk)
  }, [disk]);

  const sections = useMemo(() => ([
    { id: "general", label: Localization.kr.GENERAL },
    { id: "vms", label: "가상머신" },
    { id: "domains", label: "스토리지" },
  ]), []);

  useEffect(() => {
    setActiveTab(section || "general");
  }, [section]);

  const handleTabClick = useCallback((tab) => {
    const path = tab === "general"
        ? `/storages/disks/${diskId}`
        : `/storages/disks/${diskId}/${tab}`;
    navigate(path);
    setActiveTab(tab);
  }, [diskId]);

  
  const pathData = useMemo(() => ([
    disk?.alias,
    sections.find((section) => section.id === activeTab)?.label,
  ]), [disk, sections, activeTab]);

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
    { type: "update", label: Localization.kr.UPDATE, onClick: () => setActiveModal("disk:update") },
    { type: "remove", label: Localization.kr.REMOVE, onClick: () => setActiveModal("disk:remove") },
    { type: "move", label: Localization.kr.MOVE, onClick: () => setActiveModal("disk:move") },
    { type: "copy", label: Localization.kr.COPY, onClick: () => setActiveModal("disk:copy") },
    // { type: 'upload', label: '업로드', onClick: () => setActiveModal("disk:restart") },
  ];

  Logger.debug("DiskInfo ...")
  return (
    <SectionLayout>
      <HeaderButton title={disk?.alias}
        titleIcon={rvi24HardDrive()}
        buttons={sectionHeaderButtons}
      />
      <div className="content-outer">
        <NavButton
          sections={sections}
          activeSection={activeTab}
          handleSectionClick={handleTabClick}
        />
        <div className="info-content v-start gap-8 w-full">
          <Path pathElements={pathData} basePath={`/storages/disks/${diskId}`}/>
          {renderSectionContent()}
        </div>
      </div>
    </SectionLayout>
  );
};

export default DiskInfo;
