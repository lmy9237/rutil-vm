import React from 'react';
import LabelInput from '../../../label/LabelInput';

const DomainNfs = ({ mode, nfsAddress, setNfsAddress }) => {
  const editMode = mode === 'edit';

  return (
    <>
      <LabelInput label={"내보내기 경로"}
        value={nfsAddress}
        disabled={editMode}
        onChange={(e) => { setNfsAddress(e.target.value) }} 
      />
      {!editMode && (
        <div className="text-xs text-gray-500 mt-1">
          예: <b>myserver.mydomain.com:/my/local/path</b>
        </div>
      )}
      
    </>
  )
};

export default DomainNfs;