import React from 'react';

const DiskActionButtons = ({ openModal, isEditDisabled, isDeleteDisabled, status,type = 'default'}) => {
  const isOk = status === "OK"

  const basicActions = [
    { type: 'create', label: '생성', disabled: false },
    { type: 'edit', label: '편집', disabled: isEditDisabled },
    { type: 'delete', label: '삭제', disabled: isDeleteDisabled },
    { type: 'move', label: '이동', disabled: isEditDisabled },
    { type: 'copy', label: '복사', disabled: isEditDisabled },
    { type: 'upload', label: '업로드' },
  ];

  const wrapperClass = type === 'context' ? 'right-click-menu-box' : 'header-right-btns';
  return (
    <div className={wrapperClass}>
      {basicActions.map(({ type, label, disabled }) => (
        <button key={type} className='right-click-menu-btn' onClick={() => openModal(type)} disabled={disabled}>
          {label}
        </button>
      ))}
    </div>
  );
};

export default DiskActionButtons;