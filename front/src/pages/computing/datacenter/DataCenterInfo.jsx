import React, { useState, useEffect, Suspense } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import NavButton from "../../../components/navigation/NavButton";
import HeaderButton from "../../../components/button/HeaderButton";
import Path from "../../../components/Header/Path";
import DataCenterModals from "../../../components/modal/datacenter/DataCenterModals";
import DataCenterClusters from "./DataCenterClusters";
import DataCenterHosts from "./DataCenterHosts";
import DataCenterVms from "./DataCenterVms";
import DataCenterDomains from "./DataCenterDomains";
import DataCenterNetworks from "./DataCenterNetworks";
import DataCenterEvents from "./DataCenterEvents";
import { useDataCenter } from "../../../api/RQHook";
import Loading from "../../../components/common/Loading";
import Localization from "../../../utils/Localization";
import { rvi24Datacenter } from "../../../components/icons/RutilVmIcons";
import Logger from "../../../utils/Logger";

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

  const [activeTab, setActiveTab] = useState("clusters");
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);

  useEffect(() => {
    if (isDataCenterError || (!isDataCenterLoading && !dataCenter)) {
      navigate("/computing/rutil-manager/datacenters");
    }
  }, [isDataCenterError, isDataCenterLoading, dataCenter, navigate]);

  const sections = [
    { id: "clusters", label: Localization.kr.CLUSTER },
    { id: "hosts", label: Localization.kr.HOST },
    { id: "vms", label: Localization.kr.VM },
    { id: "storageDomains", label: "스토리지" },
    { id: "network", label: "논리 네트워크" },
    { id: "events", label: Localization.kr.EVENT },
  ];

  useEffect(() => {
    setActiveTab(section || "clusters");
  }, [section]);

  const handleTabClick = (tab) => {
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
  };

  const pathData = [
    dataCenter?.name,
    sections.find((section) => section.id === activeTab)?.label,
  ];

  const renderSectionContent = () => {
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
  };

  const sectionHeaderButtons = [
    { type: "edit", label: Localization.kr.UPDATE, onClick: () => openModal("edit") },
    { type: "delete", label: Localization.kr.REMOVE, onClick: () => openModal("delete") },
  ];

  Logger.debug("DataCenterInfo ...")
  return (
    <div id="section">
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
        <div className="px-[0.5rem] py-[0.5rem] info-content">
          <Path pathElements={pathData}  basePath={`/computing/datacenters/${dataCenterId}/clusters`}/>
          <Suspense fallback={<Loading />}>{renderSectionContent()}</Suspense>
        </div>
      </div>

      {/* 데이터센터 모달창 */}
      <DataCenterModals
        activeModal={activeModal}
        dataCenter={dataCenter}
        selectedDataCenters={dataCenter}
        onClose={closeModal}
      />
    </div>
  );
};

export default DataCenterInfo;
