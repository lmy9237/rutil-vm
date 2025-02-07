// 새로만들기 버튼 별 모달
import React, { useState, useEffect } from 'react';

const CreateButton = ({
  initialValues, // 초기 값
  onSubmit, // 제출 핸들러
  fields, // 필드 정의
  title, // 폼 제목
  isEditMode, // 편집 모드 여부
  onClose, // 닫기 핸들러
}) => {
  const [formState, setFormState] = useState(initialValues);

  useEffect(() => {
    setFormState(initialValues);
  }, [initialValues]);

  const handleChange = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formState);
  };

  return (
    <div className="generic-form">
      <h1>{title}</h1>
      <div className="form-content">
        {fields.map(({ label, name, type, options, disabled }) => (
          <div key={name} className="form-group">
            <label>{label}</label>
            {type === 'select' ? (
              <select
                value={formState[name]}
                onChange={(e) => handleChange(name, e.target.value)}
                disabled={disabled}
              >
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={type}
                value={formState[name]}
                onChange={(e) => handleChange(name, e.target.value)}
                disabled={disabled}
              />
            )}
          </div>
        ))}
      </div>
      <div className="form-footer">
        <button onClick={handleSubmit}>{isEditMode ? '편집' : '생성'}</button>
        <button onClick={onClose}>취소</button>
      </div>
    </div>
  );
};

export default CreateButton;
