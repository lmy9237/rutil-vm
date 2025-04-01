import { useState } from "react";
import LabelInputNum from "../../../label/LabelInputNum";
import LabelSelectOptions from "../../../label/LabelSelectOptions";
import { RVI16, rvi16ChevronDown, rvi16ChevronUp } from "../../../icons/RutilVmIcons";


const VmSystem = ({ formSystemState, setFormSystemState}) => {
  // 총 cpu 계산
  const calculateFactors = (num) => {
    const factors = [];
    for (let i = 1; i <= num; i++) {
      if (num % i === 0) factors.push(i);
    }
    return factors;
  };

  // const handleCpuChange = (e) => {
  //   const totalCpu = parseInt(e.target.value, 10);
  //   if (!isNaN(totalCpu)) {
  //     setFormSystemState((prev) => ({
  //       ...prev,
  //       cpuTopologyCnt: totalCpu,
  //       cpuTopologySocket: totalCpu, // 기본적으로 소켓을 총 CPU로 설정
  //       cpuTopologyCore: 1,
  //       cpuTopologyThread: 1,
  //     }));
  //   }
  // };
  const handleCpuChange = (e) => {
    const value = e.target.value;
  
    // 입력값이 빈 문자열이면 그대로 상태 업데이트만 (렌더링은 반영 안 함)
    if (value === "") {
      setFormSystemState((prev) => ({
        ...prev,
        cpuTopologyCnt: "",
      }));
      return;
    }
  
    const totalCpu = parseInt(value, 10);
    if (!isNaN(totalCpu) && totalCpu > 0) {
      setFormSystemState((prev) => ({
        ...prev,
        cpuTopologyCnt: totalCpu,
        cpuTopologySocket: totalCpu,
        cpuTopologyCore: 1,
        cpuTopologyThread: 1,
      }));
    }
  };
  

  const handleSocketChange = (e) => {
    const socket = parseInt(e.target.value, 10);
    const remaining = formSystemState.cpuTopologyCnt / socket;

    setFormSystemState((prev) => ({
      ...prev,
      cpuTopologySocket: socket,
      cpuTopologyCore: remaining, // 나머지 값은 코어로 설정
      cpuTopologyThread: 1, // 스레드는 기본적으로 1
    }));
  };

  const handleCoreChange = (e) => {
    const core = parseInt(e.target.value, 10);
    const remaining =
      formSystemState.cpuTopologyCnt /
      (formSystemState.cpuTopologySocket * core);

    setFormSystemState((prev) => ({
      ...prev,
      cpuTopologyCore: core,
      cpuTopologyThread: remaining, // 나머지 값은 스레드로 설정
    }));
  };

  const handleInputChange = (field) => (e) => {
    setFormSystemState((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // 토글 상태
  const [showCpuDetail, setShowCpuDetail] = useState(false); 
  const toggleCpuDetail = () => setShowCpuDetail(prev => !prev);

  return (
    <>
      <div className="edit-second-content">
        <LabelInputNum id="memory_size" label="메모리 크기(MB)"
          value={formSystemState.memorySize} 
          onChange={ handleInputChange("memorySize") }
        />
        <LabelInputNum id="max_memory"label="최대 메모리(MB)"
          value={formSystemState.memoryMax} 
          onChange={ handleInputChange("memoryMax") }
        />
        <LabelInputNum id="actual_memory" label="할당할 실제 메모리(MB)"
          value={formSystemState.memoryActual} 
          onChange={ handleInputChange("memoryActual") }
        />
        <LabelInputNum
          id="total_cpu"
          label="총 가상 CPU"
          value={
            formSystemState.cpuTopologyCnt !== undefined &&
            formSystemState.cpuTopologyCnt !== null &&
            !isNaN(formSystemState.cpuTopologyCnt)
              ? formSystemState.cpuTopologyCnt
              : ""
          }
          onChange={handleCpuChange}
        />
        {/* <label>총 가상 CPU</label>
        <input id="total_cpu"
          type="number"
          value={formSystemState.cpuTopologyCnt}
          onChange={handleCpuChange}
          min={1}
        /> */}

        <button className="btn-toggle-cpu" onClick={toggleCpuDetail}>
          <RVI16 iconDef={showCpuDetail ? rvi16ChevronUp : rvi16ChevronDown} className="mr-1.5" />
          {showCpuDetail ? "CPU 상세 옵션 닫기" : "CPU 상세 옵션 열기(체크박스형식?)"}
        </button>
        
        {showCpuDetail && (
          <div>
            <LabelSelectOptions id="virtual_socket" label="가상 소켓"              
              value={formSystemState.cpuTopologySocket}
              options={calculateFactors(formSystemState.cpuTopologyCnt).map((v) => ({
                value: v, label: v,
              }))}
              onChange={handleSocketChange}
            />
            <LabelSelectOptions id="core_per_socket" label="가상 소켓 당 코어"
              value={formSystemState.cpuTopologyCore}
              options={calculateFactors(formSystemState.cpuTopologyCnt / formSystemState.cpuTopologySocket).map((v) => ({
                value: v, label: v,
              }))}
              onChange={handleCoreChange}
            />
            <LabelSelectOptions id="thread_per_core" label="코어당 스레드"
              value={formSystemState.cpuTopologyThread}
              options={calculateFactors(formSystemState.cpuTopologyCnt /(formSystemState.cpuTopologySocket * formSystemState.cpuTopologyCore)).map((v) => ({
                value: v, label: v,
              }))}
              onChange={(e) => setFormSystemState((prev) => ({...prev, cpuTopologyThread: parseInt(e.target.value, 10)}))}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default VmSystem;