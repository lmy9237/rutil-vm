import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavButton from "../../../components/navigation/NavButton";
import HeaderButton from "../../../components/button/HeaderButton";
import Path from "../../../components/Header/Path";
import DomainModals from "../../../components/modal/domain/DomainModals";
import DomainGeneral from "./DomainGeneral";
import DomainDatacenters from "./DomainDatacenters";
import DomainVms from "./DomainVms";
import DomainEvents from "./DomainEvents";
import DomainDisks from "./DomainDisks";
import DomainTemplates from "./DomainTemplates";
import DomainDiskSnapshots from "./DomainDiskSnapshots";
import Localization from "../../../utils/Localization";
import DomainImportVms from "./DomainImportVms";
import DomainImportTemplates from "./DomainImportTemplates";
import DomainImportDisks from "./DomainImportDisks";
import {
  useDomainById,
  useOvfUpdateDomain,
  useRefreshLunDomain,
} from "../../../api/RQHook";
import { rvi24Cloud } from "../../../components/icons/RutilVmIcons";

/**
 * @name DomainInfo
 * @description 도메인 정보
 *
 * @prop {string} domainId 도메인ID
 * @returns {JSX.Element} DomainInfo
 */
const DomainInfo = () => {
  const navigate = useNavigate();
  const { id: domainId, section } = useParams();
  const { data: domain } = useDomainById(domainId);
  const { mutate: refreshDomain } = useRefreshLunDomain();
  const { mutate: ovfUpdateDomain } = useOvfUpdateDomain();

  const [activeTab, setActiveTab] = useState("general");
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);

  const sections = [
    { id: "general", label: Localization.kr.GENERAL },
    { id: "datacenters", label: Localization.kr.DATA_CENTER },
    { id: "vms", label: Localization.kr.VM },
    { id: "getVms", label: `${Localization.kr.VM} 가져오기` },
    { id: "templates", label: "템플릿" },
    { id: "importTemplates", label: "템플릿 가져오기" },
    { id: "disks", label: "디스크" },
    { id: "importDisks", label: "디스크 불러오기" },
    { id: "diskSnapshots", label: "디스크 스냅샷" },
    { id: "events", label: Localization.kr.EVENT },
  ];

  useEffect(() => {
    setActiveTab(section || "general");
  }, [section]);

  const handleTabClick = (tab) => {
    const path =
      tab === "general"
        ? `/storages/domains/${domainId}`
        : `/storages/domains/${domainId}/${tab}`;
    navigate(path);
    setActiveTab(tab);
  };

  const pathData = [
    domain?.name,
    sections.find((section) => section.id === activeTab)?.label,
  ];

  const renderSectionContent = () => {
    const SectionComponent = {
      general: DomainGeneral,
      datacenters: DomainDatacenters,
      vms: DomainVms,
      importVms: DomainImportVms,
      templates: DomainTemplates,
      importTemplates: DomainImportTemplates,
      disks: DomainDisks,
      importDisks: DomainImportDisks,
      diskSnapshots: DomainDiskSnapshots,
      events: DomainEvents,
    }[activeTab];
    return SectionComponent ? <SectionComponent domainId={domainId} /> : null;
  };

  const handleUpdateOvf = async () => {
    if (!domainId) return;
    ovfUpdateDomain(domainId);
    console.error("OVF 업데이트");
  };

  const handleRefresh = async () => {
    if (!domainId) return;
    refreshDomain(domainId);
    console.error("디스크 검사");
  };

  const sectionHeaderButtons = [
    { type: "edit", label: "도메인 편집", onClick: () => openModal("edit") },
    { type: "delete", label: "삭제", onClick: () => openModal("delete") },
    { type: "destroy", label: "파괴", onClick: () => openModal("destroy") },
  ];

  const popupItems = [
    { type: "updateOvf", label: "OVF 업데이트", onClick: handleUpdateOvf },
    { type: "refreshlun", label: "디스크 검사", onClick: handleRefresh },
  ];

  return (
    <div id="section">
      <HeaderButton titleIcon={rvi24Cloud()} 
        title={domain?.name}
        buttons={sectionHeaderButtons}
        popupItems={popupItems}
      />
      <div className="content-outer">
        <NavButton
          sections={sections}
          activeSection={activeTab}
          handleSectionClick={handleTabClick}
        />
        <div className="w-full px-[0.5rem] py-[0.5rem] info-content">
          <Path
            pathElements={pathData}
            basePath={`/storages/domains/${domainId}`}
          />
          {renderSectionContent()}
        </div>
      </div>

      {/* domain 모달창 */}
      <DomainModals
        activeModal={activeModal}
        domain={domain}
        selectedClusters={domain}
        onClose={closeModal}
      />
    </div>
  );
};

export default DomainInfo;
