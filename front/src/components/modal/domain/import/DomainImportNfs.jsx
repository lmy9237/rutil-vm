import React from 'react';
import LabelInput from '../../../label/LabelInput';

const DomainImportNfs = ({ nfsAddress, setNfsAddress }) => {
  return (
    <>
      <LabelInput label={`NFS 공유 경로`}
        value={nfsAddress}
        onChange={(e) => { setNfsAddress(e.target.value) }} 
      />
      <div className="text-xs text-gray-500 my-2">
        예: <b>myserver.mydomain.com:/my/local/path</b>
      </div>
    </>
  )
};

export default DomainImportNfs;