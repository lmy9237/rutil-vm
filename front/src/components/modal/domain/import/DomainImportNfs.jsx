import React from 'react';
import { useValidationToast }           from "@/hooks/useSimpleToast";
import LabelInput                       from "@/components/label/LabelInput";
import Localization                     from "@/utils/Localization";

/**
 * @name DomainImportNfs
 * @param {boolean} param0 
 * @param {[string, string]} nfsAddress, nfsAddress
 * 
 * @returns {JSX.Element} DomainImportNfs
 * 
 * @see DomainNfs
 */
const DomainImportNfs = ({ 
  nfsAddress, setNfsAddress
}) => {
  const { validationToast } = useValidationToast();
  
  return (
    <>
      <LabelInput label={Localization.kr.NFS_SHARE_PATH}
        value={nfsAddress}
        onChange={(e) => {
          setNfsAddress(e.target.value)
          import.meta.env.DEV && validationToast?.debug(`field: nfsAddress, value: ${e.target.value}`)
        }}
      />
      <div className="text-xs text-gray-500 mb-2 f-end">
        예: <b>myserver.mydomain.com:/my/local/path</b>
      </div>
    </>
  )
};

export default DomainImportNfs;