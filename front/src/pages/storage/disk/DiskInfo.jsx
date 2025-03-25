import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavButton from "../../../components/navigation/NavButton";
import HeaderButton from "../../../components/button/HeaderButton";
import Path from "../../../components/Header/Path";
import DiskGeneral from "./DiskGeneral";
import DiskVms from "./DiskVms";
import DiskDomains from "./DiskDomains";
import DiskModals from "../../../components/modal/disk/DiskModals";
import Localization from "../../../utils/Localization";
import { useDiskById } from "../../../api/RQHook";
import { rvi24HardDrive } from "../../../components/icons/RutilVmIcons";

/**
 * @name DiskDomains
 * @description 디스크 종합정보
 * (/storages/disks)
 *
 * @returns
 */
const DiskInfo = () => {
  const navigate = useNavigate();
  const { id: diskId, section } = useParams();
  const {
    data: disk,
    isLoading: isDiskLoading,
    isError: isDiskError,
    isSuccess: isDiskSuccess,
  } = useDiskById(diskId);

  const [activeTab, setActiveTab] = useState("general");
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);

  useEffect(() => {
    if (isDiskError || (!isDiskLoading && !disk)) {
      navigate("/storages/disks");
    }
  }, [isDiskError, isDiskLoading, disk, navigate]);

  const sections = [
    { id: "general", label: Localization.kr.GENERAL },
    { id: "vms", label: "가상머신" },
    { id: "domains", label: "스토리지" },
  ];

  useEffect(() => {
    setActiveTab(section || "general");
  }, [section]);

  const handleTabClick = (tab) => {
    const path =
      tab === "general"
        ? `/storages/disks/${diskId}`
        : `/storages/disks/${diskId}/${tab}`;
    navigate(path);
    setActiveTab(tab);
  };

  const pathData = [
    disk?.alias,
    sections.find((section) => section.id === activeTab)?.label,
  ];

  const renderSectionContent = () => {
    const SectionComponent = {
      general: DiskGeneral,
      vms: DiskVms,
      domains: DiskDomains,
    }[activeTab];
    return SectionComponent ? <SectionComponent diskId={diskId} /> : null;
  };

  const sectionHeaderButtons = [
    { type: "edit", label: "편집", onClick: () => openModal("edit") },
    { type: "delete", label: "삭제", onClick: () => openModal("delete") },
    { type: "move", label: "이동", onClick: () => openModal("move") },
    { type: "copy", label: "복사", onClick: () => openModal("copy") },
    // { type: 'upload', label: '업로드', onClick: () => openModal('restart') },
  ];

  console.log("...")
  return (
    <div id="section">
      <HeaderButton titleIcon={rvi24HardDrive()}
        title={disk?.alias}
        buttons={sectionHeaderButtons}
      />
      <div className="content-outer">
        <NavButton
          sections={sections}
          activeSection={activeTab}
          handleSectionClick={handleTabClick}
        />
        <div className="w-full info-content">
          <Path pathElements={pathData} basePath={`/storages/disks/${diskId}`}/>
          {renderSectionContent()}
        </div>
      </div>

      {/* 디스크 모달창 */}
      <DiskModals
        activeModal={activeModal}
        disk={disk}
        selectedDisks={disk}
        onClose={closeModal}
      />
    </div>
  );
};

export default DiskInfo;
