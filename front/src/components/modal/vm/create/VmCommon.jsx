import { useValidationToast }           from "@/hooks/useSimpleToast";
import LabelInput                       from '@/components/label/LabelInput';
import { 
  handleInputChange, handleSelectIdChange
} from "@/components/label/HandleInput";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";

const VmCommon = ({ 
  formInfoState,
  setFormInfoState
}) => {
  const { validationToast } = useValidationToast()
  return (
    <>
      <div className="edit-second-content mb-1">
        <LabelInput id="name" label={Localization.kr.NAME}
          value={formInfoState.name}
          onChange={handleInputChange(setFormInfoState, "name", validationToast) }
        />
        <LabelInput id="description" label={Localization.kr.DESCRIPTION}
          value={formInfoState.description}
          onChange={handleInputChange(setFormInfoState, "description", validationToast) }
        />
        <LabelInput id="comment" label={Localization.kr.COMMENT}
           value={formInfoState.comment}
           onChange={handleInputChange(setFormInfoState, "comment", validationToast) }
        />
      </div>
    </>
  );
};

export default VmCommon;