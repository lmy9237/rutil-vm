import Localization from "../../../../utils/Localization";
import LabelInput from "../../../label/LabelInput";

const VmCommon = ({ 
  formInfoState,
  setFormInfoState
}) => {
  const handleInputChange = (field) => (e) => {
    setFormInfoState((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <>
      <div className="edit-second-content mb-1">
        <LabelInput id="name" label={Localization.kr.NAME}
          value={formInfoState.name}
          onChange={handleInputChange("name") }
        />
        <LabelInput id="description" label={Localization.kr.DESCRIPTION}
          value={formInfoState.description}
          onChange={handleInputChange("description") }
        />
        <LabelInput id="comment" label={Localization.kr.COMMENT}
           value={formInfoState.comment}
           onChange={handleInputChange("comment") }
        />
      </div>
    </>
  );
};

export default VmCommon;