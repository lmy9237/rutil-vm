import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import DomainActionButtons from './button/DomainActionButtons';
import TablesOuter from '../../../components/table/TablesOuter';
import DomainModals from '../../../components/modal/domain/DomainModals';
import { renderDomainStatus, renderDomainStatusIcon } from '../../../components/Icon';
import { convertBytesToGB } from '../../../util';

const DomainDupl = ({ domains = [], columns = [], actionType = 'domain', datacenterId }) => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const selectedIds = (Array.isArray(selectedDomains) ? selectedDomains : []).map(sd => sd.id).join(', ');

  const handleNameClick = (id) => navigate(`/storages/domains/${id}`);

  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);

  return (
    <>
      <DomainActionButtons
        openModal={openModal}
        isEditDisabled={selectedDomains.length !== 1}
        isDeleteDisabled={selectedDomains.length === 0}
        status={selectedDomains[0]?.status}
        actionType={actionType} // 도메인인지, 데이터센터인지
      />
      <span>ID: {selectedIds || ''}</span>

      <TablesOuter
        columns={columns}
        data={domains.map((domain) => ({
          ...domain,
          icon: renderDomainStatusIcon(domain.status),
          status: renderDomainStatus(domain?.status),
          hostedEngine: domain?.hostedEngine === true ? (
            <FontAwesomeIcon icon={faPencil} fixedWidth style={{ color: 'gold', fontSize: '0.3rem', transform: 'rotate(90deg)' }} />) : '',
          domainType:
            domain?.domainType === 'data' ? '데이터'
              : domain?.domainType === 'iso' ? 'ISO'
                : 'EXPORT',
          storageType:
            domain?.storageType === 'nfs' ? 'NFS'
              : domain?.storageType === 'iscsi' ? 'iSCSI'
                : 'Fibre Channel',
          diskSize: convertBytesToGB(domain?.diskSize) + ' GB',
          availableSize: convertBytesToGB(domain?.availableSize) + ' GB',
          usedSize: convertBytesToGB(domain?.usedSize) + ' GB',
        }))}
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setSelectedDomains(selectedRows)}
        clickableColumnIndex={[2]}
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        multiSelect={true}
      />

      {/* 도메인 모달창 */}
      <DomainModals
        activeModal={activeModal}
        domain={selectedDomains[0]}
        selectedDomains={selectedDomains}
        datacenterId={datacenterId}
        onClose={closeModal}
      />
    </>
  );
};

export default DomainDupl;