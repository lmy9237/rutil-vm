import React from 'react';
import LabelInput from '../../../label/LabelInput';
import Localization from '../../../../utils/Localization';

const DomainNfs = ({ 
  editMode=false,
  nfsAddress,
  setNfsAddress
}) => {
  return (
    <>
      <LabelInput label={`${Localization.kr.EXPORT} 경로`}
        value={nfsAddress}
        disabled={editMode}
        onChange={(e) => { setNfsAddress(e.target.value)}} 
      />
      {!editMode && (
        <div className="text-xs text-gray-500 my-2">
          예: <b>myserver.mydomain.com:/my/local/path</b>
        </div>
      )}
      
    </>
  )
};

export default DomainNfs;