import React from 'react';
import LabelInput from '../../../../../utils/LabelInput';

const VmCommon = ({ formInfoState, setFormInfoState }) => { 

  return (
    <>
    <div className="edit-second-content mb-1">
      <LabelInput
        label="이름"
        id='name'
        value={formInfoState.name}
        onChange={(e) => setFormInfoState((prev) => ({ ...prev, name: e.target.value }))}
      />
      <LabelInput
        label="설명"
        id='description'
        value={formInfoState.description}
        onChange={(e) => setFormInfoState((prev) => ({ ...prev, description: e.target.value }))}
      />
      <LabelInput
        label="코멘트"
        id='comment'
        value={formInfoState.comment}
        onChange={(e) => setFormInfoState((prev) => ({ ...prev, comment: e.target.value }))}
      />
    </div>
    </>
  );
};

export default VmCommon;
