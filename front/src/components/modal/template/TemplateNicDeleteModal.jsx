import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle, } from "@fortawesome/free-solid-svg-icons";
import BaseModal from "../BaseModal";
import { useDeleteNetworkFromTemplate } from "../../../api/RQHook";
import Logger from "../../../utils/Logger";

const TemplateNicDeleteModal = ({ isOpen, onClose, data, templateId }) => {
  const [ids, setIds] = useState([]);
  const [names, setNames] = useState([]);
  const { mutateAsync: deleteNicFromTemplate } = useDeleteNetworkFromTemplate(); 
  
  useEffect(() => {
    if (Array.isArray(data)) {
      setIds(data.map((item) => ({ templateId, nicId: item.nicId }))); 
      setNames(data.map((item) => item.name || "Unnamed NIC"));
    } else if (data) {
      setIds([{ templateId, nicId: data.id }]);
      setNames([data.name || "Unnamed NIC"]);
    }
  }, [data]);

  const handleFormSubmit = async () => {
    if (!ids.length) {
      console.error("❌ 삭제할 NIC ID가 없습니다.");
      return;
    }  
    for (const { templateId, nicId } of ids) {
      Logger.debug("➡️ handleFormSubmit - Deleting NIC with templateId:", templateId, "nicId:", nicId);

      if (!templateId || !nicId) {
        Logger.error("❌ handleFormSubmit - templateId 또는 nicId가 없습니다.", { templateId, nicId });
        return;
      }
      try {
        await deleteNicFromTemplate({ templateId, nicId });
        Logger.debug(`✅ NIC ${nicId} deleted successfully from Template ${templateId}.`);
      } catch (error) {
        Logger.error(`❌ Error deleting NIC ${nicId} from Template ${templateId}:`, error);
      }
    }
    Logger.debug("✅ All NIC deletion attempts completed.");
    onClose();
  };
  
  Logger.debug("...")
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={"NIC"}
      submitTitle={"삭제"}
      onSubmit={handleFormSubmit}
    >
      {/* <div className="storage-delete-popup modal"> */}
      <div className="disk-delete-box">
        <div>
          <FontAwesomeIcon
            style={{ marginRight: "0.3rem" }}
            icon={faExclamationTriangle}
          />
          <span> {names.join(", ")} 를(을) 삭제하시겠습니까? </span>
        </div>
      </div>
    </BaseModal>
  );
};

export default TemplateNicDeleteModal;
