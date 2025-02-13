import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { useDeleteNetworkFromTemplate } from "../../../api/RQHook";

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
      console.log("➡️ handleFormSubmit - Deleting NIC with templateId:", templateId, "nicId:", nicId);

      if (!templateId || !nicId) {
        console.error("❌ handleFormSubmit - templateId 또는 nicId가 없습니다.", { templateId, nicId });
        return;
      }
      try {
        await deleteNicFromTemplate({ templateId, nicId });
        console.log(`✅ NIC ${nicId} deleted successfully from Template ${templateId}.`);
      } catch (error) {
        console.error(`❌ Error deleting NIC ${nicId} from Template ${templateId}:`, error);
      }
    }
  
    console.log("✅ All NIC deletion attempts completed.");
    onClose();
  };
  
  

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="Modal"
      overlayClassName="Overlay"
      shouldCloseOnOverlayClick={false}
    >
      <div className="storage-delete-popup modal">
        <div className="popup-header">
          <h1>NIC 삭제</h1>
          <button onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} fixedWidth />
          </button>
        </div>

        <div className="disk-delete-box">
          <div>
            <FontAwesomeIcon
              style={{ marginRight: "0.3rem" }}
              icon={faExclamationTriangle}
            />
            <span> {names.join(", ")} 를(을) 삭제하시겠습니까? </span>
          </div>
        </div>

        <div className="edit-footer">
          <button style={{ display: "none" }}></button>
          <button onClick={handleFormSubmit}>OK</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </Modal>
  );
};

export default TemplateNicDeleteModal;
