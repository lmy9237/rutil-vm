import { useState, useMemo } from "react";
import BaseModal from "../BaseModal";
import { useDeleteDiskFromVM } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";
import LabelCheckbox from "../../label/LabelCheckbox";
import Logger from "../../../utils/Logger";
import useGlobal from "@/hooks/useGlobal";
import { useValidationToast } from "@/hooks/useSimpleToast";
import { RVI16, rvi16ChevronRight } from "@/components/icons/RutilVmIcons";

/**
 * @name VmDiskDeleteModal
 * @description ...
 * 
 * @param {boolean} isOpen ..
 * @returns
 */
const VmDiskDeleteModal = ({ 
  isOpen, 
  onClose,
}) => {
  const { validationToast } = useValidationToast();
  const { vmsSelected, disksSelected } = useGlobal()
  const vmId = useMemo(() => [...vmsSelected][0]?.id, [vmsSelected]);
  const diskList = useMemo(() => [...disksSelected], [disksSelected]);
  
  const { mutate: deleteDisk } = useDeleteDiskFromVM(onClose, onClose);

  const { ids, aliases } = useMemo(() => {
    return {
      ids: [...disksSelected].map((item) => item?.id),
      aliases: [...disksSelected].map((item) => item?.diskImageVo?.alias || ""),
    };
  }, [disksSelected]);

  const [detachOnlyList, setDetachOnlyList] = useState({});

  const validateForm = () => {
    if (!ids.length) return `삭제할 ${Localization.kr.DISK} ID가 없습니다.`
    return null
  }

  const handleFormSubmit = (e) => {
    const error = validateForm();
    if (error) {
      validationToast.fail(error);
      return;
    }

    Logger.debug(`VmDiskDeleteModal ... data: `, disksSelected);

    diskList.forEach((disk) => {
      deleteDisk({ 
        vmId, 
        diskAttachmentId: disk.id, 
        detachOnly: !detachOnlyList[disk.id],
      });
    });
  };

  return (
    <BaseModal targetName={`${Localization.kr.VM} ${Localization.kr.DISK}`} submitTitle={Localization.kr.REMOVE}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleFormSubmit}
      promptText={`다음 항목을 삭제하시겠습니까?`}
      contentStyle={{ width: "660px" }}
      shouldWarn={true}
    >
      {diskList.map((disk) => {
        const diskId = disk?.id;
        const alias = disk?.diskImageVo?.alias || "";

        return (
          <div key={diskId} className="f-btw mb-3">
            <div className="f-center">
              <RVI16 iconDef={rvi16ChevronRight("black")} className="mr-2"/>
              <span className="font-bold flex f-start fs-13">{alias} {disk?.bootable? "(부팅)" : ""}</span>
            </div>
            <LabelCheckbox label={`완전 ${Localization.kr.REMOVE}`}
              id={`diskDelete-${diskId}`}
              checked={!!detachOnlyList[diskId]}
              onChange={(checked) =>
                setDetachOnlyList(prev => ({
                  ...prev,
                  [diskId]: !prev[diskId],
                }))
              }
            />
          </div>
        );
      })}
    </BaseModal>
  );
};

export default VmDiskDeleteModal;
