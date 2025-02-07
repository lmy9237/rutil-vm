import React from 'react';

const DomainNfs = ({ 
  editMode, 
  // importMode=false,
  nfsAddress, 
  setNfsAddress, 
  domain 
}) => {

  return (
    <>
      <div className="storage_popup_iSCSI">
        <div>
          <div className='domain-num-box center'>
            <label htmlFor="NFSPath" className='label_font_body'>NFS 서버 경로</label>
            {editMode ? (
              <input
                type="text"
                placeholder="예: myserver.mydomain.com"
                value={domain?.storageAddress}
                disabled
              />
            ): (
              <>                  
                <input
                  type="text"
                  placeholder="예: myserver.mydomain.com:/my/local/path"
                  value={nfsAddress}
                  onChange={(e) => setNfsAddress(e.target.value)}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
};

export default DomainNfs;