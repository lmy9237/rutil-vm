import React, { useState, useEffect, Suspense, useCallback, useMemo } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import Loading from "../../../components/common/Loading";
import NavButton from "../../../components/navigation/NavButton";
import HeaderButton from "../../../components/button/HeaderButton";
import Path from "../../../components/Header/Path";
import DataCenterClusters from "./DataCenterClusters";
import DataCenterHosts from "./DataCenterHosts";
import DataCenterVms from "./DataCenterVms";
import DataCenterDomains from "./DataCenterDomains";
import DataCenterNetworks from "./DataCenterNetworks";
import DataCenterEvents from "./DataCenterEvents";
import { useDataCenter } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";
import { rvi24Datacenter } from "../../../components/icons/RutilVmIcons";
import Logger from "../../../utils/Logger";
import SectionLayout from "../../../components/SectionLayout";

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
  } = useDataCenter(dataCenterId, (e) => ({ ...e }));
  const { activeModal, setActiveModal, } = useUIState()
  const { setDatacentersSelected, setSourceContext } = useGlobal()
  const [activeTab, setActiveTab] = useState("clusters");

  useEffect(() => {
    if (isDataCenterError || (!isDataCenterLoading && !dataCenter)) {
      navigate("/computing/rutil-manager/datacenters");
    }
    setDatacentersSelected(dataCenter)
    setSourceContext("fromDatacenter")
  }, [dataCenter]);

  const handleTabClick = useCallback((tab) => {
    Logger.debug(`DataCenterInfo > handleTabClick ... tab: ${tab}`)
    // 현재 경로에서 섹션 추출: computing, storages, networks 중 하나
    const section = location.pathname.split("/")[1]; // 첫 번째 세그먼트가 섹션 정보

    // 섹션이 유효한 값인지 확인 (예외 처리 포함)
    const validSections = ["computing", "storages", "networks"];
    const currentSection = validSections.includes(section)
      ? section
      : "computing"; // 기본값을 'computing'으로 설정

    // 동적 경로 생성 및 이동
    const path = `/${currentSection}/datacenters/${dataCenterId}/${tab}`;
    navigate(path);
    setActiveTab(tab);
  }, [dataCenterId]);

  const sections = useMemo(() => ([
    { id: "clusters", label: Localization.kr.CLUSTER },
    { id: "hosts", label: Localization.kr.HOST },
    { id: "vms", label: Localization.kr.VM },
    { id: "storageDomains", label: "스토리지" },
    { id: "network", label: "논리 네트워크" },
    { id: "events", label: Localization.kr.EVENT },
  ]), []);

  const pathData = useMemo(() => ([
    dataCenter?.name,
    sections.find((section) => section.id === activeTab)?.label,
  ]), [dataCenter, activeTab]);

  useEffect(() => {
    setActiveTab(section || "clusters");
  }, [section]);

  const renderSectionContent = useCallback(() => {
    const SectionComponent = {
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

  return (
    <SectionLayout>
      <HeaderButton titleIcon={rvi24Datacenter()}
        title={dataCenter?.name}
        buttons={sectionHeaderButtons}
      />
      <div className="content-outer">
        <NavButton
          sections={sections}
          activeSection={activeTab}
          handleSectionClick={handleTabClick}
        />
        <div className="px-[0.5rem] py-[0.5rem] w-full info-content">
          <Path pathElements={pathData}  basePath={`/computing/datacenters/${dataCenterId}/clusters`}/>
          <Suspense fallback={<Loading />}>{renderSectionContent()}</Suspense>
        </div>
      </div>
    </SectionLayout>
  );
};

export default DataCenterInfo;
