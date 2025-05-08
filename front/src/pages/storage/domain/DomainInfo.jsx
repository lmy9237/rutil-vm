import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavButton from "../../../components/navigation/NavButton";
import HeaderButton from "../../../components/button/HeaderButton";
import Path from "../../../components/Header/Path";
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
  useStroageDomain,
  useOvfUpdateDomain,
  useRefreshLunDomain,
} from "../../../api/RQHook";
import { rvi24Cloud, rvi24Storage } from "../../../components/icons/RutilVmIcons";
import Logger from "../../../utils/Logger";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import SectionLayout from "../../../components/SectionLayout";

/**
 * @name DomainInfo
 * @description 도메인 정보
 *
 * @prop {string} domainId 도메인ID
 * @returns {JSX.Element} DomainInfo
 */
const DomainInfo = () => {
  const navigate = useNavigate();
  const { activeModal, setActiveModal, } = useUIState()
  const { id: domainId, section } = useParams();
  const { setDomainsSelected, setSourceContext } = useGlobal()

  const { data: domain } = useStroageDomain(domainId);
  const { mutate: refreshDomain } = useRefreshLunDomain();
  const { mutate: ovfUpdateDomain } = useOvfUpdateDomain();

  const isACTIVE = domain?.status === "ACTIVE";
  const isUNKNOWN = domain?.status === "UNKNOWN";
  const isMaintenance = domain?.status === "MAINTENANCE";
  const isUnattached = domain?.status === "UNATTACHED";

  const [activeTab, setActiveTab] = useState("general");
  useEffect(() => {
    setDomainsSelected(domain)
    setSourceContext("fromDomain")
  }, [domain])

  // const sections = useMemo(() => ([
  //   { id: "general", label: Localization.kr.GENERAL },
  //   { id: "datacenters", label: Localization.kr.DATA_CENTER },
  //   { id: "vms", label: Localization.kr.VM },
  //   { id: "importVms", label: `${Localization.kr.VM} ${Localization.kr.IMPORT}` },
  //   { id: "templates", label: Localization.kr.TEMPLATE },
  //   { id: "importTemplates", label: `${Localization.kr.TEMPLATE} ${Localization.kr.IMPORT}` },
  //   { id: "disks", label: Localization.kr.DISK },
  //   { id: "importDisks", label: `${Localization.kr.DISK} ${Localization.kr.IMPORT}` },
  //   { id: "diskSnapshots", label: "디스크 스냅샷" },
  //   { id: "events", label: Localization.kr.EVENT },
  // ]), []);
  
  const sections = useMemo(() => {
    const baseSections = [
      { id: "general", label: Localization.kr.GENERAL },
      { id: "datacenters", label: Localization.kr.DATA_CENTER },
      { id: "vms", label: Localization.kr.VM },
      { id: "templates", label: Localization.kr.TEMPLATE },
      { id: "disks", label: Localization.kr.DISK },
      { id: "diskSnapshots", label: "디스크 스냅샷" },
      { id: "events", label: Localization.kr.EVENT },
    ];
  
    if (domain?.status !== "UNATTACHED") {
      baseSections.splice(3, 0, { id: "importVms", label: `${Localization.kr.VM} ${Localization.kr.IMPORT}` });
      baseSections.splice(5, 0, { id: "importTemplates", label: `${Localization.kr.TEMPLATE} ${Localization.kr.IMPORT}` });
      baseSections.splice(7, 0, { id: "importDisks", label: `${Localization.kr.DISK} ${Localization.kr.IMPORT}` });
    }
  
    return baseSections;
  }, [domain?.status]);
  

  const pathData = useMemo(() => ([
    domain?.name,
    sections.find((section) => section.id === activeTab)?.label,
  ]), [domain, sections, activeTab]);

  const handleTabClick = useCallback((tab) => {
    const path = tab === "general"
      ? `/storages/domains/${domainId}`
      : `/storages/domains/${domainId}/${tab}`;
    navigate(path);
    setActiveTab(tab);
  }, [domainId]);
  
  useEffect(() => {
    setActiveTab(section || "general");
  }, [section]);

  const renderSectionContent = useCallback(() => {
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
  }, [activeTab, domainId]);

  const handleUpdateOvf = useCallback(async () => {
    if (!domainId) return;
    ovfUpdateDomain(domainId);
    Logger.info("DomainInfo > OVF 업데이트 ...");
  }, [domainId]);

  const handleRefresh = useCallback(async () => {
    if (!domainId) return;
    refreshDomain(domainId);
    Logger.info("DomainInfo > 디스크 검사 ...");
  }, [domainId]);

  const sectionHeaderButtons = useMemo(() => ([
    { type: "update", label: `도메인 ${Localization.kr.UPDATE}`, onClick: () => setActiveModal("domain:update") },
    { type: "remove", label: Localization.kr.REMOVE, disabled: !isACTIVE || !isUnattached, onClick: () => setActiveModal("domain:remove") },
    { type: "destroy", label: Localization.kr.DESTROY, disabled: !isACTIVE || !(isUnattached || isMaintenance), onClick: () => setActiveModal("domain:destroy") },
  ]), [isACTIVE]);

  const popupItems = useMemo(() => ([
    { type: "updateOvf", label: "OVF 업데이트", onClick: handleUpdateOvf },
    { type: "refreshlun", label: "디스크 검사", onClick: handleRefresh },
  ]), []);

  return (
    <SectionLayout>
      <HeaderButton titleIcon={rvi24Storage()} 
        title={domain?.name}
        status={Localization.kr.renderStatus(domain?.status)}
        buttons={sectionHeaderButtons}
        popupItems={popupItems}
      />
      <div className="content-outer">
        <NavButton
          sections={sections}
          activeSection={activeTab}
          handleSectionClick={handleTabClick}
        />
        <div className="info-content v-start gap-8 w-full">
          <Path pathElements={pathData} basePath={`/storages/domains/${domainId}`} />
          {renderSectionContent()}          
        </div>
      </div>

    </SectionLayout>
  );
};

export default DomainInfo;
