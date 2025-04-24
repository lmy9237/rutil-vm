/**
 * 일반 input 필드용 핸들러 생성
 */
export function handleInputChange(setState, field) {
  return (e) => {
    const value = e?.target?.value;
    setState((prev) => ({ ...prev, [field]: value }));
  };
}

/**
 * select 필드에서 id 기반 객체 선택 시 핸들러
 */
export function handleSelectIdChange(setVo, voList) {
  return (selectedOption) => {
    const selected = voList?.find((item) => item.id === selectedOption?.id);
    if (selected) {
      setVo({ id: selected.id, name: selected.name });
    }
  };
}
