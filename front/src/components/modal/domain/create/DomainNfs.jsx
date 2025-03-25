import React from 'react';

const DomainNfs = ({ mode, nfsAddress, setNfsAddress, domain }) => {
  const editMode = mode === 'edit';

  return (
    <>
      <div className="storage-popup-iSCSI">
        <div className='domain-num-box center'>
          <label htmlFor="NFSPath" className='label_font_body'>NFS 서버 경로</label>
          {editMode ? (
            <input type="text" value={domain?.storageAddress} disabled/>
          ): (          
            <input 
              type="text" 
              value={nfsAddress}  
              onChange={(e) => { setNfsAddress(e.target.value) }} 
              placeholder="예: myserver.mydomain.com:/my/local/path" 
            />
          )}
        </div>
      </div>
    </>
  )
};

export default DomainNfs;