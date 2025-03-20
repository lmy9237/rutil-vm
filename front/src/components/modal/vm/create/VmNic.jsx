import React from "react";
import DynamicInputList from "../../../label/DynamicInputList";
import Localization from "../../../../utils/Localization";


const VmNic = ({ nicsState, setNicsState, nics }) => {
  // vNIC 변경 핸들러
  const handleNicChange = (index, value) => {
    const updatedNics = [...nicsState];
    updatedNics[index] = {
      ...updatedNics[index],
      vnicProfileVo: { id: value },
    };
    setNicsState(updatedNics);
  };

  return (
    <div className="host-second-content py-2">
      <p className="mb-0.5">
        {Localization.kr.VNIC_PROFILE} 을 선택하여 가상 머신 네트워크 인터페이스를 설정하세요.
      </p>
      
      <DynamicInputList
        maxCount={10} // 최대 10개까지 추가 가능
        inputType="select"
        options={nics.map((profile) => profile.name)} // ✅ vNIC 드롭다운 옵션
        disabled={false} // 비활성화 X
        onChange={handleNicChange} // ✅ vNIC 변경 핸들러 적용
      />
    </div>
  );
};

export default VmNic;
