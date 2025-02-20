import LabelInput from "../../../label/LabelInput";

const VmCommon = ({ formInfoState, setFormInfoState }) => {
  const handleInputChange = (field) => (e) => {
    setFormInfoState((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <>
      <div className="edit-second-content mb-1">
        <LabelInput label="이름" id="name" value={formInfoState.name} onChange={ handleInputChange("name") }/>
        <LabelInput label="설명" id="description" value={formInfoState.description} onChange={ handleInputChange("description") } />
        <LabelInput label="코멘트" id="comment" value={formInfoState.comment} onChange={ handleInputChange("comment") }/>
      </div>
    </>
  );
};

export default VmCommon;