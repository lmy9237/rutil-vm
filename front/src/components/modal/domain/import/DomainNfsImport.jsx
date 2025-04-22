import React from 'react';
import LabelInput from '../../../label/LabelInput';

const DomainNfsImport = ({
  nfsAddress, setNfsAddress
}) => {
  return (
    <>
      <LabelInput label={"내보내기 경로"}
        value={nfsAddress}
        onChange={(e) => { setNfsAddress(e.target.value) }} 
      />
      <div className="text-xs text-gray-500 my-2">
        예: <b>myserver.mydomain.com:/my/local/path</b>
      </div>
    </>
  )
};

export default DomainNfsImport;