import React, { useMemo } from "react";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import useGlobal                        from "../../../../hooks/useGlobal";
import SelectedIdView                   from "../../../common/SelectedIdView";
import LabelCheckbox                    from "../../../label/LabelCheckbox";
import TableColumnsInfo                 from "../../../table/TableColumnsInfo";
import Tables                           from "../../../table/Tables";
import {
  checkZeroSizeToGiB
} from "@/util";
import Logger                           from "@/utils/Logger";

/**
 * @name DomainFibre
 * @description 생성을 위한 Fibre Channel 스토리지 도메인 내 LUN 목록 출력
 * 
 * @param {boolean} editMode 편집여부
 * @returns {JSX.Element} DomainFibre
 * 
 * @see DomainModal
 */
const DomainFibre = ({ 
  editMode,
  domain,
  fibres,
  lunId, setLunId,
  isFibresLoading, isFibresError, isFibresSuccess
}) => {
  const { validationToast } = useValidationToast();
  const {
    hostsSelected, 
    lunsSelected, setLunsSelected
  } = useGlobal()
  
  // 편집일 때
  const transDomainData = useMemo(() => {
    const storage = domain?.storageVo?.volumeGroupVo?.logicalUnitVos[0];
    if (!storage) return [];
  
    return [{
      id: storage.id,
      able: <LabelCheckbox checked disabled />,
      status: storage.status,
      size: checkZeroSizeToGiB(storage.size),
      paths: storage.paths,
      vendorId: storage.vendorId,
      productId: storage.productId,
      serial: storage.serial,
      storageDomainId: storage.storageDomainId,
    }];
  }, [domain]);

  // 생성일 때
  const transFibreData = useMemo(() => {
    if (isFibresLoading || !fibres) return [];

    return [...fibres].map((f) => {
      const fc = f?.logicalUnitVos[0];
      if (!fc) return null;

      // fc가 켜져있고 스토리지도메인에 연결되지 않았을때
      const isSelectable = fc.serial && fc.storageDomainId === "";
      const isUsed = fc.status?.toUpperCase() === "USED";

      return {
        id: fc.id,
        able: isSelectable ? (
          <LabelCheckbox
            checked={lunId === fc.id}
            // onChange={() => setLunId(prev => prev === fc.id ? "" : fc.id)}
            onChange={(checked) => {
              import.meta.env.DEV && validationToast.debug(`approved: ${checked}`);
              setLunId(prev => prev === fc.id ? "" : fc.id)
            }}
          />
        ) : (
          <LabelCheckbox checked disabled />
        ),
        status: fc.status,
        check: isSelectable ? (isUsed ? "OVERWRITE" : "OK") : "NO",
        size: checkZeroSizeToGiB(fc.size),
        paths: fc.paths,
        vendorId: fc.vendorId,
        productId: fc.productId,
        serial: fc.serial,
        storageDomainId: fc.storageDomainId,
      };
    }).filter(Boolean);
  }, [fibres, isFibresLoading, lunId, setLunId]);
  
  return (
    <div className="storage-popup-iSCSI">
      <div className="section-table-outer">
        <br/>
        <Tables target={"lun"}
          columns={editMode 
            ? TableColumnsInfo.UPDATE_FIBRE
            : TableColumnsInfo.FIBRE
          }
          data={editMode 
            ? transDomainData
            : transFibreData
          }
          onRowClick={(selectedRows) => setLunsSelected(selectedRows)}
          isLoading={isFibresLoading} isError={isFibresError} 
          isSuccess={true}
        />
        <SelectedIdView items={lunsSelected} />
      </div>
    </div>
  )
};

export default DomainFibre;