import React, { useEffect, useState } from 'react';
import { useValidationToast }           from "@/hooks/useSimpleToast";
import useGlobal                        from "@/hooks/useGlobal";
import { Textarea }                     from "@/components/ui/textarea";
import BaseModal                        from "@/components/modal/BaseModal";
import { handleInputChange }            from '@/components/label/HandleInput';
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";

/**
 * @name VmVncClipboardPasteModal
 * @description 가상머신 VNC에서 클립보드 내용 붙여넣기 모달
 * 
 * @returns {JSX.Element} CD변경 모달
 */
const VmVncClipboardPasteModal = ({
  isOpen,
  onClose,
}) => {
  const { currentVncRfb } = useGlobal();
  const { validationToast } = useValidationToast();
  const KEY_TEXT2PASTE = "text2Patse"
  const [formState, setFormState] = useState({[KEY_TEXT2PASTE]: ""})
  
  const validateForm = () => {    
    Logger.debug(`VmVncClipboardPasteModal > validateForm ... formState: `, formState)
    return null;
  }

  const handleFormSubmit = () => {
    Logger.debug(`VmVncClipboardPasteModal > handleFormSubmit ...`)
    const error = validateForm();
    if (error) {
      validationToast.fail(error);
      return;
    }
    const txt2Paste = formState[KEY_TEXT2PASTE]
    if (!currentVncRfb) return
    currentVncRfb?.clipboardPasteFrom(txt2Paste);
    currentVncRfb?.sendKey("a");
    validationToast.debug(`${Localization.kr.PASTE} ${Localization.kr.REQ_COMPLETE}`);
    onClose && onClose()
  }

  useEffect(() => {
    Logger.debug(`VmVncClipboardPasteModal > useEffect ...`)

  }, [])

  return (
    <BaseModal targetName={Localization.kr.VM_VNC} submitTitle={`${Localization.kr.CLIPBOARD} ${Localization.kr.PASTE}`}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "600px" }}
    >
      <Textarea id="vnc-text2paste" 
        placeholder={`${Localization.kr.PASTE}할 내용을 적어주세요.`}
        onChange={handleInputChange(setFormState, KEY_TEXT2PASTE, validationToast)}
      />
    </BaseModal>
  );
};

export default VmVncClipboardPasteModal;
