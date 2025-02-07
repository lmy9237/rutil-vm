import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useHostsForMigration, useMigration } from '../../../../api/RQHook';
import '../css/MVm.css';

const VmMigrationModal = ({ isOpen, onRequestClose, selectedVm = {},selectedVms }) => {
  const [selectedHost, setSelectedHost] = useState();
  const [isHaMode, setIsHaMode] = useState(false);


  // 연결가능한 호스트목록
  const { data: ableHost } = useHostsForMigration(selectedVm.id);

  useEffect(() => {
    if (selectedVm.id) {
      console.log('VM id:', selectedVm.id);
      console.log('ABLEHOST:', ableHost);
    }
  }, [selectedVm.id, ableHost]);
  
  
  const { mutate: migration } = useMigration();


  // 되는지 안되는지모름
  const handleSave = () => {
    migration({
      vmId: selectedVm.id,
      hostId: selectedHost,
    }, {
      onSuccess: () => {
        console.log('Migration successful');
        onRequestClose();
      },
      onError: (error) => {
        console.error('Migration error:', error);
      }
    });
  };

 

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="마이그레이션"
      className="Modal"
      overlayClassName="Overlay"
      shouldCloseOnOverlayClick={false}
    >
      <div className="migration-popup-content">
        <div className="popup-header">
          <h1>가상머신 마이그레이션</h1>
          <button onClick={onRequestClose}>
            <FontAwesomeIcon icon={faTimes} fixedWidth />
          </button>
        </div>
        <div className="migration-article-outer">
          <span>1대의 가상 머신이 마이그레이션되는 호스트를 선택하십시오.</span>

          <div className="migration-article">
            <div>
              <div className="migration-dropdown">
                <label htmlFor="host">
                  대상 호스트 <FontAwesomeIcon icon={faInfoCircle} fixedWidth />
                </label>

                <select
                  id="host"
                  value={selectedHost}
                  onChange={(e) => setSelectedHost(e.target.value)}
                  disabled={!ableHost || ableHost.length === 0}
                >
                  {ableHost && ableHost.length > 0 ? (
                    ableHost.map(host => (
                      <option key={host.id} value={host.id}>{host.name}</option>
                    ))
                  ) : (
                    <option value="">사용 가능한 호스트가 없습니다</option>
                  )}
                </select>
              </div>
            </div>

            <div className="checkbox_group mb-2">
              <input
                className="check_input"
                type="checkbox"
                id="ha_mode_box"
                checked={isHaMode}
                onChange={() => setIsHaMode(!isHaMode)}
              />
              <label className="check_label" htmlFor="ha_mode_box">
                선택한 가상 머신을 사용하여 양극 강제 연결 그룹의 모든 가상 시스템을 마이그레이션합니다.
              </label>
              <FontAwesomeIcon
                icon={faInfoCircle}
                style={{ color: 'rgb(83, 163, 255)' }}
                fixedWidth
              />
            </div>

            <div>
              <div className="font-bold">가상머신</div>
              <div>{selectedVm?.name || 'N/A'}</div>
            </div>
          </div>
        </div>

        <div className="edit-footer">
          <button style={{ display: 'none' }}></button>
          <button onClick={handleSave}>OK</button>
          <button onClick={onRequestClose}>취소</button>
        </div>
      </div>
    </Modal>
  );
};

export default VmMigrationModal;
