import React, { useState, useEffect, Suspense, useCallback, useMemo } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import useUIState              from "@/hooks/useUIState";
import useGlobal               from "@/hooks/useGlobal";
import { rvi24Datacenter }     from "@/components/icons/RutilVmIcons";
import SectionLayout           from "@/components/SectionLayout";
import TabNavButtonGroup       from "@/components/common/TabNavButtonGroup";
import HeaderButton            from "@/components/button/HeaderButton";
import Path                    from "@/components/Header/Path";
import DataCenterClusters      from "./DataCenterClusters";
import DataCenterHosts         from "./DataCenterHosts";
import DataCenterVms           from "./DataCenterVms";
import DataCenterDomains       from "./DataCenterDomains";
import DataCenterNetworks      from "./DataCenterNetworks";
import DataCenterEvents        from "./DataCenterEvents";
import DataCenterGeneral       from "./DataCenterGeneral";
import {
  useDataCenter
} from "@/api/RQHook";
import {
  refetchIntervalInMilli
} from "@/util";
import Localization            from "@/utils/Localization";
import Logger                  from "@/utils/Logger";

/**
 * @name DataCenterInfo
 * @description 데이터센터 종합 페이지
 * (/computing/datacenters)
 *
 * @returns
 *
 * @see DataCenterClusters
 * @see DataCenterHosts
 * @see DataCenterVms
 * @see DataCenterDomains
 * @see DataCenterNetworks
 * @see DataCenterEvents
 * @see DataCenterModals
 */
const DataCenterInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: dataCenterId, section } = useParams();
  const {
    data: dataCenter,
    isLoading: isDataCenterLoading,
    isError: isDataCenterError,
    isSuccess: isDataCenterSuccess,
    isRefetching: isDataCenterRefetching,
    refetch: refetchDataCenter,
  } = useDataCenter(dataCenterId, (e) => ({ ...e }));
  const {
    activeModal, setActiveModal,
    tabInPage, setTabInPage,
  } = useUIState()
  const { setDatacentersSelected, setSourceContext } = useGlobal()
  const [activeTab, setActiveTab] = useState("general");

  const _baseHomePath = useMemo(() => {
    const section = location.pathname.split("/")[1]; // 첫 번째 세그먼트가 섹션 정보
    const validSections = ["computing", "storages", "networks"];
    const res = validSections.includes(section)
      ? section
      : "computing"; // 기본값을 'computing'으로 설정
    Logger.debug(`DataCenterInfo > _baseHomePath ... section: ${section}, res: ${res}`)
    return res;
  }, [location, dataCenterId])

  const homePath = useMemo(() => {
    return `/${_baseHomePath}/datacenters/${dataCenterId}`
  }, [location, dataCenterId, _baseHomePath])

  const tabs = useMemo(() => ([
    { id: "general",        label: Localization.kr.GENERAL, onClick: () => handleTabClick("general") },
    { id: "clusters",       label: Localization.kr.CLUSTER, onClick: () => handleTabClick("clusters") },
    { id: "hosts",          label: Localization.kr.HOST,    onClick: () => handleTabClick("hosts") },
    { id: "vms",            label: Localization.kr.VM,      onClick: () => handleTabClick("vms") },
    { id: "storageDomains", label: Localization.kr.DOMAIN,  onClick: () => handleTabClick("storageDomains") },
    { id: "network",        label: "논리 네트워크", onClick: () => handleTabClick("network") },
    { id: "events",         label: Localization.kr.EVENT,   onClick: () => handleTabClick("events") },
  ]), [dataCenterId]);

  const pathData = useMemo(() => ([
    dataCenter?.name,
    tabs.find((section) => section.id === activeTab)?.label,
  ]), [dataCenter, activeTab]);

  const renderSectionContent = useCallback(() => {
    const SectionComponent = {
      general: DataCenterGeneral,
      clusters: DataCenterClusters,
      hosts: DataCenterHosts,
      vms: DataCenterVms,
      storageDomains: DataCenterDomains,
      network: DataCenterNetworks,
      events: DataCenterEvents,
    }[activeTab];
    return SectionComponent ? (
      <SectionComponent datacenterId={dataCenterId} />
    ) : null;
  }, [activeTab, dataCenterId]);

  const sectionHeaderButtons = useMemo(() => ([
    { type: "update", onClick: () => setActiveModal("datacenter:update"), label: Localization.kr.UPDATE, },
    { type: "remove", onClick: () => setActiveModal("datacenter:remove"), label: Localization.kr.REMOVE, },
  ]), []);

  const handleTabClick = useCallback((tab) => {
    Logger.debug(`DataCenterInfo > handleTabClick ... tab: ${tab}`)
    const path = `${homePath}/${tab}`;
    navigate(path);
    setTabInPage(`/${_baseHomePath}/datacenters`, tab);
    setActiveTab(tab);
  }, [homePath]);

  useEffect(() => {
    Logger.debug(`DataCenterInfo > useEffect ... section: ${section}`)
    setActiveTab(section || "general");
  }, [section]);

  useEffect(() => {
    Logger.debug(`DataCenterInfo > useEffect ... (for Automatic Tab Switch)`)
    if (isDataCenterError || (!isDataCenterLoading && !dataCenter)) {
      navigate("/computing/rutil-manager/datacenters");
    }
    const currentTabInPage = tabInPage(`/${_baseHomePath}/datacenters`);
    handleTabClick(currentTabInPage === "" ? "general" : currentTabInPage);
    //setActiveTab(currentTabInPage === "" ? "general" : currentTabInPage)    
    setDatacentersSelected(dataCenter)
    setSourceContext("fromDatacenter")
  }, [dataCenter, navigate]);

  useEffect(() => {
    Logger.debug(`DataCenterInfo > useEffect ... (for DataCenter status check)`)
    if ([...activeModal()].length > 0) return // 모달이 켜져 있을 떄 조회 및 렌더링 일시적으로 방지
    const intervalInMilli = refetchIntervalInMilli(dataCenter?.status)
    Logger.debug(`DataCenterInfo > useEffect ... look for DataCenter (${dataCenter?.status}) status in ${intervalInMilli/1000} second(s)`)
    const intervalId = setInterval(() => {
      refetchDataCenter()
    }, intervalInMilli) // 주기적 조회
    return () => {clearInterval(intervalId)}
  }, [dataCenter, dataCenterId])

  return (
    <SectionLayout>
      <HeaderButton titleIcon={rvi24Datacenter()} title={dataCenter?.name}
        buttons={sectionHeaderButtons}
        isLoading={isDataCenterLoading} isRefetching={isDataCenterRefetching} refetch={refetchDataCenter}
      />
      <div className="content-outer">
        {/* 왼쪽 네비게이션 */}
        <TabNavButtonGroup
          tabs={tabs}
          tabActive={activeTab} setTabActive={setActiveTab}
        />
        <div className="info-content v-start gap-8 w-full h-full">
          <Path type={"datacenter"}
            pathElements={pathData}
            basePath={`${homePath}`}
          />
          {renderSectionContent()}
        </div>
      </div>
    </SectionLayout>
  );
};

export default DataCenterInfo;
