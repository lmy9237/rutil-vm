import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CONSTANT                from "@/Constants";
import useUIState              from "@/hooks/useUIState";
import useGlobal               from "@/hooks/useGlobal";
import SectionLayout           from "@/components/SectionLayout";
import TabNavButtonGroup       from "@/components/common/TabNavButtonGroup";
import HeaderButton            from "@/components/button/HeaderButton";
import Path                    from "@/components/Header/Path";
import {
  rvi24Cloud,
  rvi24Storage
} from "@/components/icons/RutilVmIcons";
import DomainGeneral           from "./DomainGeneral";
import DomainDatacenters       from "./DomainDatacenters";
import DomainVms               from "./DomainVms";
import DomainEvents            from "./DomainEvents";
import DomainDisks             from "./DomainDisks";
import DomainTemplates         from "./DomainTemplates";
import DomainDiskSnapshots     from "./DomainDiskSnapshots";
import DomainImportVms         from "./DomainImportVms";
import DomainImportTemplates   from "./DomainImportTemplates";
import DomainImportDisks       from "./DomainImportDisks";
import {
  useStorageDomain,
  useOvfUpdateDomain,
  useRefreshLunDomain,
  useAllUnregisteredDisksFromDomain,
  useAllUnregisteredVMsFromDomain,
  useAllUnregisteredTemplatesFromDomain,
} from "@/api/RQHook";
import Localization            from "@/utils/Localization";
import Logger                  from "@/utils/Logger";

/**
 * @name DomainInfo
 * @description 도메인 정보
 *
 * @prop {string} domainId 도메인ID
 * @returns {JSX.Element} DomainInfo
 */
const DomainInfo = () => {
  const navigate = useNavigate();
  const { 
    activeModal, setActiveModal,
    tabInPage, setTabInPage,
  } = useUIState()
  const { 
    setDomainsSelected, setDatacentersSelected,
    setSourceContext
  } = useGlobal()
  const { id: domainId, section } = useParams();

  const { 
    data: domain,
    isLoading: isDomainLoading,
    isError: isDomainError,
    isSuccess: isDomainSuccess,
    isRefetching: isDomainRefetching,
    refetch: refetchDomain,
  } = useStorageDomain(domainId);

  const { data: importVms = [], refetch: importVmsRefetch } = useAllUnregisteredVMsFromDomain(domainId, (e) => ({ ...e }));
  const { data: importTemplates = [], refetch: importTemplatesRefetch } = useAllUnregisteredTemplatesFromDomain(domainId, (e) => ({ ...e }));
  const { data: importDisks = [], refetch: importDisksRefetch } = useAllUnregisteredDisksFromDomain(domainId, (e) => ({ ...e }));

  const { mutate: refreshDomain } = useRefreshLunDomain();
  const { mutate: ovfUpdateDomain } = useOvfUpdateDomain();

  const isACTIVE = domain?.status?.toLowerCase() === "ACTIVE".toLowerCase();
  const isUnknown = domain?.status?.toLowerCase() === "UNKNOWN".toLowerCase();
  const isMaintenance = domain?.status?.toLowerCase() === "MAINTENANCE".toLowerCase();
  const isUnattached = domain?.status?.toLowerCase() === "UNATTACHED".toLowerCase();

  const [activeTab, setActiveTab] = useState("general");
/* 가져오기에 따른 탭 메뉴 활성화 */
  const tabs = useMemo(() => {
    const isImportExport = domain?.storageDomainType?.toLowerCase() === "import_export";

    if (isImportExport) {
      return [
        { id: "general",         label: Localization.kr.GENERAL,     onClick: () => handleTabClick("general") },
        { id: "datacenters",     label: Localization.kr.DATA_CENTER, onClick: () => handleTabClick("datacenters") },
        { id: "importVms",       label: `${Localization.kr.VM} ${Localization.kr.IMPORT}`,       onClick: () => handleTabClick("importVms") },
        { id: "importTemplates", label: `${Localization.kr.TEMPLATE} ${Localization.kr.IMPORT}`, onClick: () => handleTabClick("importTemplates") },
        { id: "events",          label: Localization.kr.EVENT,       onClick: () => handleTabClick("events") },
      ];
    }

    const baseSections = [
      { id: "general",           label: Localization.kr.GENERAL,     onClick: () => handleTabClick("general") },
      { id: "datacenters",       label: Localization.kr.DATA_CENTER, onClick: () => handleTabClick("datacenters") },
      { id: "vms",               label: Localization.kr.VM,          onClick: () => handleTabClick("vms") },
      { id: "templates",         label: Localization.kr.TEMPLATE,    onClick: () => handleTabClick("templates") },
      { id: "disks",             label: Localization.kr.DISK,        onClick: () => handleTabClick("disks") },
      { id: "diskSnapshots",     label: "디스크 스냅샷",              onClick: () => handleTabClick("diskSnapshots") },
      { id: "events",            label: Localization.kr.EVENT,       onClick: () => handleTabClick("events") },
    ];

    if (!(isUnknown || isUnattached)) {
      if (importVms.length > 0 || importTemplates.length > 0 || importDisks.length > 0) {
        baseSections.splice(3, 0, { id: "importVms", label: `${Localization.kr.VM} ${Localization.kr.IMPORT}`, onClick: () => handleTabClick("importVms") });
        baseSections.splice(5, 0, { id: "importTemplates", label: `${Localization.kr.TEMPLATE} ${Localization.kr.IMPORT}`, onClick: () => handleTabClick("importTemplates") });
        baseSections.splice(7, 0, { id: "importDisks", label: `${Localization.kr.DISK} ${Localization.kr.IMPORT}`, onClick: () => handleTabClick("importDisks") });
      }
    }

    return baseSections;
}, [domainId, domain?.status, domain?.storageDomainType, importVms, importTemplates, importDisks]);

  const handleTabClick = useCallback((tab) => {
    const path = tab === "general"
      ? `/storages/domains/${domainId}`
      : `/storages/domains/${domainId}/${tab}`;
    navigate(path);
    setActiveTab(tab);
    setTabInPage("/storages/domains", tab)
  }, [domainId]);

  const pathData = useMemo(() => ([
    domain?.name,
    tabs.find((section) => section.id === activeTab)?.label,
  ]), [domain, tabs, activeTab]);

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
    await ovfUpdateDomain(domainId);
    Logger.info("DomainInfo > OVF 업데이트 ...");
  }, [domainId]);

  const handleRefresh = useCallback(async () => {
    if (!domainId) return;
    await refreshDomain(domainId);
    Logger.info("DomainInfo > 디스크 검사 ...");
  }, [domainId]);

  const sectionHeaderButtons = useMemo(() => ([
    { type: "update",   label: `${Localization.kr.DOMAIN} ${Localization.kr.UPDATE}`, onClick: () => setActiveModal("domain:update"), },
    { type: "remove",   label: Localization.kr.REMOVE,                                onClick: () => setActiveModal("domain:remove"),   disabled: !isUnattached,  },
    /* { type: "destroy",  label: Localization.kr.DESTROY,                               onClick: () => setActiveModal("domain:destroy"),  disabled: isACTIVE || !(isMaintenance || isUnattached), }, */
  ]), [domain?.status]);

  const popupItems = useMemo(() => ([
    { type: "updateOvf", label: "OVF 업데이트", onClick: handleUpdateOvf,  disabled: !isACTIVE || (isMaintenance || isUnattached) },
    { type: "refreshlun", label: "디스크 검사", onClick: handleRefresh,     disabled: !isACTIVE || (isMaintenance || isUnattached) },
  ]), [domain?.status]);

  useEffect(() => {
    Logger.debug(`DomainInfo > useEffect ... section: ${section}`)
    setActiveTab(section || "general");
  }, [section]);

  useEffect(() => {
    Logger.debug(`DomainInfo > useEffect ... (for Automatic Tab Switch)`)
    if (isDomainError || (!isDomainLoading && !domain)) {
      navigate("/computing/vms");
    }
    const currentTabInPage = tabInPage("/storages/domains");
    handleTabClick(currentTabInPage === "" ? "general" : currentTabInPage);
    setDomainsSelected(domain);
    // setDatacentersSelected(domain?.dataCenterVo)
    setDatacentersSelected([]); 
    setSourceContext("fromDomain");
    // const currentTabInPage = ((importVms.length > 0 || importTemplates.length > 0 || importDisks.length > 0)) ? tabInPage("/storages/domains") : "general" 
    /* 
    const currentTabInPage = tabInPage("/storages/domains")
    setActiveTab(currentTabInPage)
    */
    importVmsRefetch();
    importTemplatesRefetch();
    importDisksRefetch();
  }, [domain]);

  // 탭 유효성 체크(템플릿 가져오기 등등 없으면 일반페이지로 이동)
  useEffect(() => {
    Logger.debug(`DomainInfo > useEffect ... (for Automatic Tab Switch)`)
    if (!tabs || tabs.length === 0 || !activeTab) return;
    const isTabValid = tabs.some((t) => t.id === activeTab);
    if (!isTabValid) {
      Logger.warn(`DomainInfo > Invalid activeTab "${activeTab}" → fallback to "general"`);
      handleTabClick("general");
    }
  }, [tabs, activeTab]);

  useEffect(() => {
    Logger.debug(`DomainInfo > useEffect ... (for Domain status check)`)
    if (!!activeModal) return // 모달이 켜져 있을 떄 조회 및 렌더링 일시적으로 방지
    const intervalInMilli = refetchIntervalInMilli(domain?.status)
    Logger.debug(`DomainInfo > useEffect ... look for Domain status (${domain?.status}) in ${intervalInMilli/1000} second(s)`)
    const intervalId = setInterval(() => {
      refetchDomain()
    }, intervalInMilli) // 주기적 조회
    return () => {clearInterval(intervalId)}
  }, [domain, domainId, activeModal])

  return (
    <SectionLayout>
      <HeaderButton title={domain?.name} titleIcon={rvi24Storage()} 
        status={Localization.kr.renderStatus(domain?.status)}
        isLoading={isDomainLoading} isRefetching={isDomainRefetching} refetch={refetchDomain}
        buttons={sectionHeaderButtons}
        popupItems={popupItems}
      />
      <div className="content-outer">
        {/* 왼쪽 네비게이션 */}
        <TabNavButtonGroup
          tabs={tabs}
          tabActive={activeTab} setTabActive={setActiveTab}
        />
        <div className="info-content v-start gap-8 w-full h-full">
          <Path pathElements={pathData} basePath={`/storages/domains/${domainId}`} />
          {renderSectionContent()}          
        </div>
      </div>

    </SectionLayout>
  );
};

export default DomainInfo;
