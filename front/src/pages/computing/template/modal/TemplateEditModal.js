import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useEditTemplate, useTemplate } from '../../../../api/RQHook';
import toast from 'react-hot-toast';
import '../css/MTemplate.css';

const TemplateEditModal = ({ isOpen, editMode = false, templateId, onClose }) => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [comment, setComment] = useState('');
  const [osSystem, setOsSystem] = useState(''); // 운영체제 string
  const [chipsetFirmwareType, setChipsetFirmwareType] = useState('');// string
  const [stateless, setStateless] = useState(false); // 상태비저장
  const [startPaused, setStartPaused] = useState(false); // 일시정지상태에서시작
  const [deleteProtected, setDeleteProtected] = useState(false); // 일시정지상태에서시작
  const [clsuterVoId, setClsuterVoId] = useState(''); 
  const [clsuterVoName, setClsuterVoName] = useState('');


  const { mutate: editTemplate } = useEditTemplate();


  // 최적화옵션(영어로 값바꿔야됨)
  const [optimizeOption, setOptimizeOption] = useState([
    { value: 'desktop', label: '데스크톱' },
    { value: 'high_performance', label: '고성능' },
    { value: 'server', label: '서버' }
  ]);

  
  const [selectedModalTab, setSelectedModalTab] = useState('general');

  //해당데이터 상세정보 가져오기
  const { data: templateData } = useTemplate(templateId);
  const [selectedOptimizeOption, setSelectedOptimizeOption] = useState('server'); // 칩셋 선택
  const [selectedChipset, setSelectedChipset] = useState('Q35_OVMF'); // 칩셋 선택

  // 초기값설정
  useEffect(() => {
    if (isOpen) {
      const template = templateData;
      if (template) {
        setId(template?.id || '');
        setName(template?.name || ''); // 이름안뜸
        setDescription(template?.description || '');
        setComment(template?.comment || '');
        setOsSystem(template?.osSystem || '');
        setStateless(template?.stateless || false);
        setClsuterVoId(template.clusterVo?.id || '');
        setClsuterVoName(template.clusterVo?.name || '');
        setStartPaused(template?.startPaused || false);
        setDeleteProtected(template?.deleteProtected || false);
        setSelectedOptimizeOption(template?.optimizeOption || 'server');
        setSelectedChipset(template?.chipsetFirmwareType || 'Q35_OVMF');
      }
    }
  }, [isOpen, templateData]);

  const handleFormSubmit = () => {
    if (name === '') {
      toast.error("이름을 입력해주세요.");
      return;
    }
    const dataToSubmit = {
      clusterVo: {
        id : clsuterVoId || '',
        name : clsuterVoName || '',
      },
      id,
      name,
      description,
      comment,
      optimizeOption:selectedOptimizeOption,
      osSystem
    };
    console.log('템플릿 Data:', dataToSubmit); 
    if (editMode) {
      dataToSubmit.id = id;
      editTemplate(
        {
          templateId: id,
          templateData: dataToSubmit,
        },
        {
          onSuccess: () => {
            onClose();
            toast.success("템플릿 편집 완료");
          },
          onError: (error) => {
            toast.error('Error editing cluster:', error);
          },
        }
      );
    }
  };


  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={editMode ? '템플릿 수정' : '템플릿 생성'}
      className="Modal"
      overlayClassName="Overlay newRolePopupOverlay"
      shouldCloseOnOverlayClick={false}
    >
      <div className="template-eidt-popup">
        <div className="popup-header">
          <h1>{editMode ? '템플릿 수정' : '템플릿 생성'}</h1>
          <button onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} fixedWidth />
          </button>
        </div>

        <div className="flex">
          {/* 왼쪽 네비게이션 */}
          <div className="network-backup-edit-nav">
            <div
              id="general_tab"
              className={selectedModalTab === 'general' ? 'active-tab' : 'inactive-tab'}
              onClick={() => setSelectedModalTab('general')}
            >
              일반
            </div>
            <div
              id="console_tab"
              className={selectedModalTab === 'console' ? 'active-tab' : 'inactive-tab'}
              onClick={() => setSelectedModalTab('console')}
            >
              콘솔
            </div>
          </div>

          <div className="backup-edit-content">
            <div className="template-option-box" style={{ borderBottom: '1px solid gray', paddingBottom: '0.3rem' }}>
                <label htmlFor="optimization">최적화 옵션</label>
                  <select
                    id="optimization"
                    value={selectedOptimizeOption} // 선택된 값과 동기화
                    onChange={(e) => setSelectedOptimizeOption(e.target.value)} // 값 변경 핸들러
                  >
                    {optimizeOption.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label} {/* UI에 표시되는 값 */}
                      </option>
                    ))}
                  </select>
                  {/* <span>선택된 최적화 옵션: {optimizeOption.find(opt => opt.value === selectedOptimizeOption)?.value || ''}</span> */}
            </div>
            {selectedModalTab === 'general' && (
              <>
                <div className="template-edit-texts">
                  <div className="host-textbox">
                    <label htmlFor="template_name">이름</label>
                    <input
                      type="text"
                      id="template_name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="host-textbox">
                    <label htmlFor="description">설명</label>
                    <input
                        type="text"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)} 
                      />
                  </div>
                  <div className="host-textbox">
                    <label htmlFor="comment">코멘트</label>
                    <input
                        type="text"
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)} 
                      />
                  </div>
                </div>

                <div className="flex">
                  <div className="t-new-checkbox">
                    <input
                      type="checkbox"
                      id="stateless"
                      checked={stateless} // 상태에 따라 체크 상태 설정
                      onChange={(e) => setStateless(e.target.checked)} // 값 변경 핸들러
                    />
                    <label htmlFor="stateless">상태 비저장</label>
                  </div>
                  <div className="t-new-checkbox">
                    <input
                      type="checkbox"
                      id="start_in_pause_mode"
                      checked={startPaused} // 상태에 따라 체크 상태 설정
                      onChange={(e) => setStartPaused(e.target.checked)} // 값 변경 핸들러
                    />
                    <label htmlFor="start_in_pause_mode">일시정지 모드에서 시작</label>
                  </div>
                  <div className="t-new-checkbox">
                    <input
                      type="checkbox"
                      id="prevent_deletion"
                      checked={deleteProtected} // 상태에 따라 체크 상태 설정
                      onChange={(e) => setDeleteProtected(e.target.checked)} // 값 변경 핸들러
                    />
                    <label htmlFor="prevent_deletion">삭제 방지</label>
                  </div>
                </div>
              </>
            )}
            {selectedModalTab === 'console' && (
              <>
                <div className="p-1.5">
                  <div className="font-bold">그래픽 콘솔</div>
                  <div className="monitor">
                    <label htmlFor="monitor_select">모니터</label>
                    <select id="monitor_select">
                      <option value="1">1</option>
                    </select>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="edit-footer">
          <button onClick={() => {handleFormSubmit();}}>OK</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </Modal>
  );
};

export default TemplateEditModal;
