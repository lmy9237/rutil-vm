import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../css/MHost.css';
import {
  useAddHost,
  useEditHost,
  useHost, 
  useAllClusters,
} from '../../../../api/RQHook';
import toast from 'react-hot-toast';
import LabelSelectOptionsID from '../../../../utils/LabelSelectOptionsID';
import LabelInput from '../../../../utils/LabelInput';
import LabelInputNum from '../../../../utils/LabelInputNum';
import { xButton } from '../../../../utils/Icon';
import LabelSelectOptions from '../../../../utils/LabelSelectOptions';

const initialFormState = {
  id: '',
  name: '',
  comment: '',
  address: '',
  sshPort: '22',
  sshPassWord: '',
  vgpu: 'consolidated',
  hostedEngine: false,
};

const hostEngines = [
  { value: 'false', label: '없음' },
  { value: 'true', label: '배포' },
];

const HostModal = ({ isOpen, editMode = false, hId, clusterId, onClose }) => {
  const hLabel = editMode ? '편집' : '생성';
  const [formState, setFormState] = useState(initialFormState);
  const [clusterVoId, setClusterVoId] = useState('');

  const { mutate: addHost } = useAddHost();
  const { mutate: editHost } = useEditHost();
 
  const { data: host} = useHost(hId);
  const { data: clusters=[], isLoading: isClustersLoading} = useAllClusters((e) => ({...e,}));

  useEffect(() => {
    if (!isOpen)
      setFormState(initialFormState);
    if (editMode && host) {
      console.log('hostModal', host);
      setFormState({
        id:host.id,
        name: host.name,
        comment: host.comment,
        address: host.address,
        sshPort: host.sshPort, 
        sshPassWord: host.sshPassWord,
        vgpu: host.vgpu,
        hostedEngine: host.hostedEngine,
      });
      setClusterVoId(host?.clusterVo?.id);   
    } 
  }, [isOpen, editMode, host]);
  
  useEffect(() => {
    if(clusterId){
      setClusterVoId(clusterId);
    } else if (!editMode && clusters && clusters.length > 0) {
      setClusterVoId(clusters[0].id);
    }
  }, [clusters, clusterId, editMode]);

  const handleInputChange = (field) => (e) => {
    setFormState((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validateForm = () => {
    if (!formState.name) return '이름을 입력해주세요.';
    if (!editMode && !formState.sshPassWord) return '비밀번호를 입력해주세요.';
    if (!clusterVoId) return '클러스터를 선택해주세요.';
    return null;
  };

  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) return toast.error(error);

    const selectedCluster = clusters.find((c) => c.id === clusterVoId);
    const dataToSubmit = {
      ...formState,
      clusterVo: { id: selectedCluster.id },
    };

    const onSuccess = () => {
      onClose();
      toast.success(`호스트 ${hLabel} 완료`);
    };
    const onError = (err) => toast.error(`Error ${hLabel} host: ${err}`);
  
    console.log("Form Data: ", dataToSubmit); // 데이터를 확인하기 위한 로그

    editMode
      ? editHost({ hostId: formState.id, hostData: dataToSubmit }, { onSuccess, onError })
      : addHost({ hostData: dataToSubmit, deploy_hosted_engine: formState.hostedEngine}, { onSuccess, onError });
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel={hLabel} className="Modal" overlayClassName="Overlay" shouldCloseOnOverlayClick={false}>
      <div className="host-new-popup modal">
        <div className="popup-header">
          <h1>호스트 {hLabel}</h1>
          <button onClick={onClose}> { xButton() } </button>
        </div>

        <div className="host-new-content modal-content">
          <LabelSelectOptionsID
            label="호스트 클러스터"
            value={clusterVoId}
            onChange={(e) => setClusterVoId(e.target.value)}
            disabled={editMode}
            loading={isClustersLoading}
            options={clusters}
          />
          <hr/>

          <LabelInput label="이름" id="name" value={formState.name} onChange={handleInputChange('name')} autoFocus />
          <LabelInput label="코멘트" id="comment" value={formState.comment} onChange={handleInputChange('comment')} />
          <LabelInput label="호스트 이름/IP" id="address" value={formState.address} onChange={handleInputChange('address')} disabled={editMode} />
          <LabelInputNum label="SSH 포트" id="sshPort" value={formState.sshPort} onChange={handleInputChange('sshPort')} disabled={editMode} />
          <hr/>

        {!editMode && (
          <>
            <div className='font-semibold'><label>인증</label></div>
            <LabelInput label="사용자 이름" value="root" disabled={true} />
            <div>            
              <label htmlFor="sshPassWord">암호</label>
              <input type="password" id="sshPassWord" value={formState.sshPassWord} onChange={handleInputChange('sshPassWord')} />
            </div>
          </>
        )}

          <div>
            <div>vGPU 배치</div>
            <div className='flex'>
              <input 
                type="radio" 
                id="vgpu" 
                name="consolidated" 
                value="consolidated"
                checked={formState.vgpu === 'consolidated'}
                onChange={handleInputChange('vgpu')}
              />
              <label htmlFor="consolidated" style={{marginRight:'0.2rem'}}>통합</label>
              <input 
                type="radio" 
                id="vgpu" 
                name="separated" 
                value="separated"
                checked={formState.vgpu === 'separated'}
                onChange={handleInputChange('vgpu')}
              />
              <label htmlFor="separated">분산</label>
            </div>
          </div>
          <LabelSelectOptions label="호스트 엔진 배포 작업 선택" value={String(formState.hostedEngine)} onChange={handleInputChange('hostedEngine')} options={hostEngines} />          
        </div>

        <div className="edit-footer">
          <button style={{ display: 'none' }}></button>
          <button onClick={handleFormSubmit}>{hLabel}</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </Modal>
  );
};

export default HostModal;