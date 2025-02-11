import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import NavButton from '../../../components/navigation/NavButton';
import HeaderButton from '../../../components/button/HeaderButton';
import Footer from '../../../components/footer/Footer';
import Path from '../../../components/Header/Path';
import DataCenterModals from '../../../components/modal/datacenter/DataCenterModals';
import DataCenterClusters from './DataCenterClusters';
import DataCenterHosts from './DataCenterHosts';
import DataCenterVms from './DataCenterVms';
import DataCenterDomains from './DataCenterDomains';
import DataCenterNetworks from './DataCenterNetworks';
import DataCenterEvents from './DataCenterEvents';
import { useDataCenter } from '../../../api/RQHook';

const DataCenterInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: dataCenterId, section } = useParams();
  const {
    data: dataCenter, status, isRefetching, refetch, isError, error, isLoading
  } = useDataCenter(dataCenterId, (e) => ({ ...e, }));

  const [activeTab, setActiveTab] = useState('clusters');
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);

  useEffect(() => {
    if (isError || (!isLoading && !dataCenter)) {
      navigate('/computing/rutil-manager/datacenters');
    }
  }, [isError, isLoading, dataCenter, navigate]);

  const sections = [
    { id: 'clusters', label: '클러스터' },
    { id: 'hosts', label: '호스트' },
    { id: 'vms', label: '가상머신' },
    { id: 'storageDomains', label: '스토리지' },
    { id: 'networks', label: '논리 네트워크' },
    { id: 'events', label: '이벤트' },
  ];

  useEffect(() => {
    setActiveTab(section || 'clusters');
  }, [section]);

  const handleTabClick = (tab) => {
    // 현재 경로에서 섹션 추출: computing, storages, networks 중 하나
    const section = location.pathname.split('/')[1]; // 첫 번째 세그먼트가 섹션 정보

    // 섹션이 유효한 값인지 확인 (예외 처리 포함)
    const validSections = ['computing', 'storages', 'networks'];
    const currentSection = validSections.includes(section) ? section : 'computing'; // 기본값을 'computing'으로 설정

    // 동적 경로 생성 및 이동
    const path = `/${currentSection}/datacenters/${dataCenterId}/${tab}`;
    navigate(path);
    setActiveTab(tab);
  };

  const pathData = [dataCenter?.name, sections.find((section) => section.id === activeTab)?.label];

  const renderSectionContent = () => {
    const SectionComponent = {
      clusters: DataCenterClusters,
      hosts: DataCenterHosts,
      vms: DataCenterVms,
      storageDomains: DataCenterDomains,
      networks: DataCenterNetworks,
      events: DataCenterEvents
    }[activeTab];
    return SectionComponent ? <SectionComponent datacenterId={dataCenterId} /> : null;
  };

  const sectionHeaderButtons = [
    { type: 'edit', label: '편집', onClick: () => openModal("edit") },
    { type: 'delete', label: '삭제', onClick: () => openModal("delete") },
  ];

  return (
    <div id="section">
      <HeaderButton
        titleIcon={faLayerGroup}
        title={dataCenter?.name}
        buttons={sectionHeaderButtons}
      />
      <div className="content-outer">
        <NavButton
          sections={sections}
          activeSection={activeTab}
          handleSectionClick={handleTabClick}
        />
        <div className="host-btn-outer">
          <Path pathElements={pathData} />
          {renderSectionContent()}
        </div>
      </div>

      {/* 데이터센터 모달창 */}
      <DataCenterModals
        activeModal={activeModal}
        dataCenter={dataCenter}
        selectedDataCenters={dataCenter}
        onClose={closeModal}
      />
      <Footer />
    </div>
  );
};

export default DataCenterInfo;