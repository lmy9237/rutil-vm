import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import useUIState                          from "@/hooks/useUIState";
import useGlobal                           from "@/hooks/useGlobal";
import VmDeleteModal                       from "./VmDeleteModal";
import VmActionModal                       from "./VmActionModal";
import VmSnapshotModal                     from "./VmSnapshotModal";
import VmModal                             from "./VmModal";
import TemplateModal                       from "@/components/modal/template/TemplateModal";
import DomainImportVmTemplateModal         from "@/components/modal/domain/DomainImportVmTemplateModal";
import VmExportOVAModal                    from "./VmExportOVAModal";
import VmMigrationModal                    from "./VmMigrationModal";
import VmStartOnceModal                    from "./VmStartOnceModal";
import VmUpdateCdromModal                  from "./VmUpdateCdromModal";
import VmImportModal                       from "./VmImportModal";
import VmVncClipboardPasteModal            from "./VmVncClipboardPasteModal";
import Localization                        from "@/utils/Localization";
import Logger                              from "@/utils/Logger";
import "./MVm.css";

/**
 * @name VmModals
 * @description 가상머신 모달 모음
 * 
 * @returns {JSX.Element} VmModals
 */
const VmModals = ({ 
  vm,
}) => {
  const ACTIONS = useMemo(() => ([
    "vm:start",
    "vm:pause",
    "vm:reboot",
    "vm:reset",
    "vm:shutdown",
    "vm:powerOff",
  ]), [])
  const { activeModal, closeModal, } = useUIState()
  const { vmsSelected } = useGlobal()
  const { id: templateId } = useParams();
  const modals = {
    create: (
      <VmModal key={"vm:create"} isOpen={activeModal().includes("vm:create")}
        onClose={() => closeModal("vm:create")}
        templateId={templateId}
      />
    ), update: (
      <VmModal key={"vm:update"} isOpen={activeModal().includes("vm:update")} editMode 
        onClose={() => closeModal("vm:update")}
      />
    ), remove: (
      <VmDeleteModal key={"vm:remove"} isOpen={activeModal().includes("vm:remove")} 
        onClose={() => closeModal("vm:remove")}
      />
    ), templates: (
      <TemplateModal key={"vm:templates"} isOpen={activeModal().includes("vm:templates")}
        onClose={() => closeModal("vm:templates")}
      /> 
      // NOTE: 안쓰는 것 같음
    ), snapshot: (
      <VmSnapshotModal key={"vm:snapshot"} isOpen={activeModal().includes("vm:snapshot")} 
        onClose={() => closeModal("vm:snapshot")}
      />
    ), import: (
      <VmImportModal key={"vm:import"} isOpen={activeModal().includes("vm:import")} 
        onClose={() => closeModal("vm:import")}
      />
    ), domainvmimport: (
      <DomainImportVmTemplateModal
        key="vm:domainvmimport"
        isOpen={activeModal().includes("vm:domainvmimport")}
        onClose={() => closeModal("vm:domainvmimport")}
        type="vm"
        data={vmsSelected}
      />
    ), copy: ( // 수정필요
      <VmModal key={"vm:copy"} isOpen={activeModal().includes("vm:copy")} 
        onClose={() => closeModal("vm:copy")}
        copyMode 
      />
    ), updateCdrom: (
      <VmUpdateCdromModal key={"vm:updateCdrom"} isOpen={activeModal().includes("vm:updateCdrom")} 
        onClose={() => closeModal("vm:updateCdrom")}
        vmId={vmsSelected[0]?.id}
      />
    ), migration: (
      <VmMigrationModal key={"vm:migration"} isOpen={activeModal().includes("vm:migration")} 
        onClose={() => closeModal("vm:migration")}
        vmId={vmsSelected[0]?.id}
      />
    ), ova: (
      <VmExportOVAModal key={"vm:ova"} isOpen={activeModal().includes("vm:ova")}
        onClose={() => closeModal("vm:ova")}     
      />
    ), action: (
      <VmActionModal key={activeModal()[0]} isOpen={ACTIONS.includes(activeModal()[0])}
        onClose={() => closeModal(activeModal()[0])}     
        action={activeModal()[0]}
        data={vmsSelected}
      />
    ), startOnce: ( // 수정필요
      <VmStartOnceModal key={"vm:startOnce"} isOpen={activeModal().includes("vm:startOnce")} 
        onClose={() => closeModal("vm:startOnce")}
        copyMode 
      />
    ), vncClipboardPaste: (
      <VmVncClipboardPasteModal key={"vm:vncClipboardPaste"} isOpen={activeModal().includes("vm:vncClipboardPaste")} 
        onClose={() => closeModal("vm:vncClipboardPaste")}
      />
    )
  };

  return (
    <>
      {Object.keys(modals).filter((key) => 
        activeModal().includes(`vm:${key}`) ||
        ACTIONS.includes(activeModal()[0])
      ).map((key) => (
        <React.Fragment key={key}>{modals[key]}</React.Fragment>
      ))}
    </>
  );
};

export default React.memo(VmModals);
