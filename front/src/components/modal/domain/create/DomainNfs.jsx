import React from 'react';
import { useValidationToast }           from "@/hooks/useSimpleToast";
import LabelInput                       from "@/components/label/LabelInput";
import Localization                     from "@/utils/Localization";

/**
 * @name DomainNfs
 * @param {boolean} param0 
 * @param {[string, string]} nfsAddress, nfsAddress
 * 
 * @returns {JSX.Element} DomainNfs
 * 
 * @see DomainImportNfs
 */
const DomainNfs = ({ 
  editMode=false,
  nfsAddress, setNfsAddress
}) => {
  const { validationToast } = useValidationToast();

  return (
    <>
      <LabelInput label={Localization.kr.NFS_SHARE_PATH}
        value={nfsAddress}
        disabled={editMode}
        onChange={(e) => {
          const value = e.target.value
          setNfsAddress(value)
          import.meta.env.DEV && validationToast?.debug(`field: nfsAddress, value: ${value}`)
        }}
      />
      {!editMode && (
        <div className="text-xs text-gray-500 mb-2 f-end">
          예: <b>myserver.mydomain.com:/my/local/path</b>
        </div>
      )}
      
    </>
  )
};

export default DomainNfs;