import React from "react";
import useUIState             from "@/hooks/useUIState";
import useGlobal              from "@/hooks/useGlobal";
import {
  useRemoveDataCenter,
} from "@/api/RQHook";
import DeleteModal            from "@/utils/DeleteModal";
import Localization           from "@/utils/Localization";
import Logger                 from "@/utils/Logger";
import DataCenterModal        from "./DataCenterModal";

/**
 * @name DataCenterModals
 * @description 데이터센터 모달 모음
 * 
 * @returns {JSX.Element} DataCenterModals
 */
const DataCenterModals = ({
}) => {
  const { activeModal, closeModal } = useUIState()
  const { datacentersSelected } = useGlobal()

  const modals = {
    create: (
      <DataCenterModal key={activeModal()} isOpen={activeModal().includes("datacenter:create")} 
        onClose={() => closeModal("datacenter:create")}
      />
    ), update: (
      <DataCenterModal key={activeModal()} isOpen={activeModal().includes("datacenter:update")}
        onClose={() => closeModal("datacenter:update")}
        editMode
      />
    ), remove: (
      <DeleteModal key={activeModal()} isOpen={activeModal().includes("datacenter:remove")}
        onClose={() => closeModal("datacenter:remove")}
        label={Localization.kr.DATA_CENTER}
        data={datacentersSelected}
        api={useRemoveDataCenter()}
        // navigation={'/computing/rutil-manager/datacenters'}
      />
    )
  };

  return (
    <>
      {Object.keys(modals).filter((key) => 
        activeModal().includes(`datacenter:${key}`)
      ).map((key) => 
        <React.Fragment key={key}>{modals[key]}</React.Fragment>
      )}
    </>
  );
};

export default DataCenterModals;