import Logger                 from "@/utils/Logger";

/**
 * @name handleInputChange
 * 
 * 일반 input 필드용 핸들러 생성
 */
export function handleInputChange(setState, field, validationToastHook=null) {
  return (e) => {
    const value = e?.target?.value ?? e?.id ?? e;
    // TODO: LabelSelectOptionsID에서 처리 될 때는 event를 넘기지 않음
    // 어떤 곳에서는 selecftIdChange를 쓸때 vo대신 prop을 바꿈
    Logger.debug(`handleInputChange ... field: ${field}, value: ${value}`)
    import.meta.env.DEV && validationToastHook?.debug(`field: ${field}, value: ${value}`)
    setState((prev) => ({ 
      ...prev,
      [field]: value
    }));
  };
}

/**
 * @name handleInputCheck
 * 체크 input 변경 핸들러
 * 
 * @param {*} setState 
 * @param {string} field 필드 명
 * @param {*} validationToastHook 토스트 훅
 * @returns 
 */
export function handleInputCheck(setState, field, validationToastHook=null) {
  return (e) => {
    const value = e?.target?.checked ?? e?.id ?? e;
    Logger.debug(`handleInputCheck ... field: ${field}, value: ${value}`) 
    import.meta.env.DEV && validationToastHook?.debug(`field: ${field}, value: ${value}`)
    setState((prev) => ({
      ...prev, 
      [field]: value
    }));
  };
}

/**
 * @name handleSelectIdChange
 * select 필드에서 id 기반 객체 선택 시 핸들러
 * 
 * @param {*} validationToastHook 토스트 훅
 */
export function handleSelectIdChange(setVo, voList, validationToastHook=null) {
  return (selectedOption) => {
    const selected = voList?.find((item) => item.id === selectedOption?.id);
    import.meta.env.DEV && validationToastHook.debug(`이 값으로 변경 ... \n\n ${JSON.stringify(selected, 2, 0)}`)
    setVo((prev) => ({ 
      ...prev, 
      id: selected?.id, 
      name: selected?.name
    }));
  };
}
