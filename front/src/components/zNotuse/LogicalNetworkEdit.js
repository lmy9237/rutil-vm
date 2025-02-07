import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useEditNetwork, useNetworkById, useAllDataCenters } from '../../api/RQHook';

const LogicalNetworkEdit = ({
    isOpen, 
    onRequestClose, 
    editMode = false,
    networkId // 네트워크 ID를 받아서 편집 모드에서 사용
  }) => {
    const [id, setId] = useState('');
    const [datacenterVoId, setDatacenterVoId] = useState('');  
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [comment, setComment] = useState('');
    const [valnTagging, setValnTagging] = useState(false);
    const [vmNetwork, setVmNetwork] = useState(true);
    const [photoSeparation, setPhotoSeparation] = useState(false);
    const [mtu, setMtu] = useState('default');
    const [dnsSettings, setDnsSettings] = useState(false);
    const [dnsServer, setDnsServer] = useState('');
    const [quotaMode, setQuotaMode] = useState();


    const { mutate: editNetwork } = useEditNetwork();
  
    //  네트워크 데이터
    const { 
        data: network, 
        isLoading, 
        isError 
    } = useNetworkById(networkId);

    // 데이터센터 가져오기
    const {
      data: datacenters,
      status: datacentersStatus,
      isRefetching: isDatacentersRefetching,
      refetch: refetchDatacenters,
      isError: isDatacentersError,
      error: datacentersError,
      isLoading: isDatacentersLoading
    } = useAllDataCenters((e) => ({
      ...e,
    }));
  
    // 모달이 열릴 때 기존 데이터를 상태에 설정
    useEffect(() => {

        if (editMode && network) {
          console.log('Setting edit mode state with network:', network); // 디버깅 로그
          setId(network.id);
          setDatacenterVoId(network?.datacenterVo?.id || '');
          setName(network.name);
          setDescription(network.description);
          setComment(network.comment);
          setValnTagging(network.valnTagging);
          setVmNetwork(network.vmNetwork);
          setPhotoSeparation(network.photoSeparation);
          setMtu(network.mtu);
          setDnsSettings(network.dnsSettings);
          setDnsServer(network.dnsServer);
        } else {
          console.log('Resetting form for create mode');
          resetForm();
          if (datacenters && datacenters.length > 0) {
            setDatacenterVoId(datacenters[0].id);
          }
        }
      
    }, [isOpen, editMode, network, datacenters]);
  
    const resetForm = () => {
      setName('');
      setDescription('');
      setComment('');
      setValnTagging(false);
      setVmNetwork(true);
      setPhotoSeparation(false);
      setMtu('default');
      setDnsSettings(false);
      setDnsServer('');
    };
  
    const handleFormSubmit = () => {
      
      const dataToSubmit = {
        name,
        description,
        comment,
        valnTagging,
        vmNetwork,
        photoSeparation,
        mtu,
        dnsSettings,
        dnsServer,
        datacenterVoId // 추가된 부분
      };
    
      if (editMode) {
        dataToSubmit.id = id;
    
        editNetwork({
          networkId: id,
          networkData: dataToSubmit
        }, {
          onSuccess: () => {
            console.log('Edit success'); // 성공 로그
            console.log('Updated network data:', network); // network 데이터 출력
            alert('네트워크 편집 완료');
            onRequestClose();
          },
          onError: (error) => {
            console.error('Error editing network:', error);
          }
        });
      } 
    };
    
    
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="논리 네트워크 수정"
      className="Modal"
      overlayClassName="Overlay"
      shouldCloseOnOverlayClick={false}
    >
      <div className="network_edit_popup">
        <div className="popu-header">
          <h1>논리 네트워크 수정</h1>
          <button onClick={onRequestClose}>
            <FontAwesomeIcon icon={faTimes} fixedWidth />
          </button>
        </div>

        <form id="network_new_common_form">
          <div className="network_first_contents">
            <div className="network_form_group">
              <label htmlFor="cluster">데이터 센터</label>
              <select
                id="data_center"
                value={datacenterVoId}
                onChange={(e) => setDatacenterVoId(e.target.value)}
                disabled
              >
                {datacenters &&
                  datacenters.map((dc) => (
                    <option key={dc.id} value={dc.id}>
                      {dc.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="network_form_group">
              <div className="checkbox_group">
                <label htmlFor="name">이름</label>
                <FontAwesomeIcon icon={faInfoCircle} style={{ color: '#1ba4e4' }} fixedWidth />
              </div>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="network_form_group">
              <label htmlFor="description">설명</label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="network_form_group">
              <label htmlFor="comment">코멘트</label>
              <input
                type="text"
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>

          <div className="network_second_contents">
            <div className="network_checkbox_type1">
              <div className="checkbox_group">
                <input
                  type="checkbox"
                  id="valn_tagging"
                  name="valn_tagging"
                  checked={valnTagging}
                  onChange={(e) => setValnTagging(e.target.checked)}
                />
                <label htmlFor="valn_tagging">VALN 태깅 활성화</label>
              </div>
              <input type="text" id="valn_tagging_input" disabled />
            </div>
            <div className="network_checkbox_type2">
              <input
                type="checkbox"
                id="vm_network"
                name="vm_network"
                checked={vmNetwork}
                onChange={(e) => setVmNetwork(e.target.checked)}
              />
              <label htmlFor="vm_network">가상 머신 네트워크</label>
            </div>
            <div className="network_checkbox_type2">
              <input
                type="checkbox"
                id="photo_separation"
                name="photo_separation"
                checked={photoSeparation}
                onChange={(e) => setPhotoSeparation(e.target.checked)}
              />
              <label htmlFor="photo_separation">포토 분리</label>
            </div>
            <div className="network_radio_group">
              <div style={{ marginTop: '0.2rem' }}>MTU</div>
              <div>
                <div className="radio_option">
                  <input
                    type="radio"
                    id="default_mtu"
                    name="mtu"
                    value="default"
                    checked={mtu === 'default'}
                    onChange={() => setMtu('default')}
                  />
                  <label htmlFor="default_mtu">기본값 (1500)</label>
                </div>
                <div className="radio_option">
                  <input
                    type="radio"
                    id="user_defined_mtu"
                    name="mtu"
                    value="user_defined"
                    checked={mtu === 'user_defined'}
                    onChange={() => setMtu('user_defined')}
                  />
                  <label htmlFor="user_defined_mtu">사용자 정의</label>
                </div>
              </div>
            </div>
            <div className="network_checkbox_type2">
              <input
                type="checkbox"
                id="dns_settings"
                name="dns_settings"
                checked={dnsSettings}
                onChange={(e) => setDnsSettings(e.target.checked)}
              />
              <label htmlFor="dns_settings">DNS 설정</label>
            </div>
            <span>DNS서버</span>
            <div className="network_checkbox_type3">
              <input
                type="text"
                id="dns_server"
                value={dnsServer}
                onChange={(e) => setDnsServer(e.target.value)}
              />
              <div>
                <button type="button">+</button>
                <button type="button">-</button>
              </div>
            </div>
          </div>
        </form>

        <div className="edit-footer">
          <button style={{ display: 'none' }}></button>
          <button onClick={handleFormSubmit}>편집</button>
          <button onClick={onRequestClose}>취소</button>
        </div>
      </div>
    </Modal>
  );
};

export default LogicalNetworkEdit;
