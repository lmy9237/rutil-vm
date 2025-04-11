import { useState } from "react";
import LabelInputNum from "../../../label/LabelInputNum";
import LabelSelectOptions from "../../../label/LabelSelectOptions";
import { RVI16, rvi16ChevronDown, rvi16ChevronUp } from "../../../icons/RutilVmIcons";
import Logger from "../../../../utils/Logger";

const VmSystem = ({ 
  formSystemState,
  setFormSystemState
}) => {
  
  const calculateFactors = (num) => {
    // 총 가산 CPU 계산
    Logger.debug(`VmSystem > calculateFactors ... num: ${num}`)
    const factors = [];
    for (let i = 1; i <= num; i++) {
      if (num % i === 0) factors.push(i);
    }
    return factors;
  };

  const handleCpuChange = (e) => {
    Logger.debug(`VmSystem > handleCpuChange ... value: ${e.target.value}`)
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
    if (isNaN(totalCpu) || totalCpu <= 0) {
      return;
    }
    setFormSystemState((prev) => ({
      ...prev,
      cpuTopologyCnt: totalCpu,
      cpuTopologySocket: totalCpu,
      cpuTopologyCore: 1,
      cpuTopologyThread: 1,
    }));
  };
  

  const handleSocketChange = (e) => {
    const value = e.target.value
    Logger.debug(`VmSystem > handleSocketChange ... value: ${value}`)
    const socket = parseInt(value, 10);
    const core = formSystemState.cpuTopologyCnt / socket;
    const thread = formSystemState.cpuTopologyCnt / (socket * core)

    setFormSystemState((prev) => ({
      ...prev,
      cpuTopologySocket: socket,
      cpuTopologyCore: core, // 나머지 값은 코어로 설정
      cpuTopologyThread: thread, // 스레드는 기본적으로 1
    }));
  };

  const handleCorePerSocketChange = (e) => {
    const value = e.target.value
    Logger.debug(`VmSystem > handleCorePerSocketChange ... value: ${value}`)
    const core = parseInt(value, 10);
    const thread = formSystemState.cpuTopologyCnt / core;
    const socket = formSystemState.cpuTopologyCnt / (core * thread)

    setFormSystemState((prev) => ({
      ...prev,
      cpuTopologySocket: socket,
      cpuTopologyCore: core,
      cpuTopologyThread: thread, // 나머지 값은 스레드로 설정
    }));
  };

  const handleThreadPerCoreChange = (e) => {
    const value = e.target.value
    Logger.debug(`VmSystem > handleThreadPerCoreChange ... value: ${value}`)
    const thread = parseInt(value, 10);
    const core = formSystemState.cpuTopologyCnt / thread;
    const socket = formSystemState.cpuTopologyCnt / (thread * core);

    setFormSystemState((prev) => ({
      ...prev,
      cpuTopologySocket: socket,
      cpuTopologyCore: core,
      cpuTopologyThread: thread, // 나머지 값은 스레드로 설정
    }));
  }
  

  // 최대메모리: 메모리크기 x 4 , 할당할 실제 메모리: 메모리크기와 같음
  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    Logger.debug(`VmSystem > handleInputChange ... field: ${field}, value: ${value}`)
  
    setFormSystemState((prev) => {
      const updatedState = { ...prev, [field]: value };
  
      if (field === "memorySize") {
        const memSize = parseInt(value, 10);
        if (!isNaN(memSize)) {
          updatedState.memoryMax = memSize * 4;
          updatedState.memoryActual = memSize;
        } else {
          updatedState.memoryMax = "";
          updatedState.memoryActual = "";
        }
      }
  
      return updatedState;
    });
  };

  // 토글 상태
  const [showCpuDetail, setShowCpuDetail] = useState(false); 
  const toggleCpuDetail = () => setShowCpuDetail(prev => !prev);

  const selectionNumPredicate = (v) => ({ value: v, label: v, })
  const selectionsSockets = () => calculateFactors(formSystemState.cpuTopologyCnt).map(selectionNumPredicate)
  const selectionsCoresPerSocket = () => selectionsSockets()
  const selectionsThreadsPerCore = () => {
    let threads = selectionsSockets()
    threads.pop()
    return threads;
  }

  return (
    <>
      <div className="edit-second-content">
        <LabelInputNum id="mem" label="메모리 크기(MB)"
          value={formSystemState.memorySize} 
          onChange={ handleInputChange("memorySize") }
        />
        <LabelInputNum id="mem-max"label="최대 메모리(MB)"
          value={formSystemState.memoryMax} 
          onChange={ handleInputChange("memoryMax") }
        />
        <LabelInputNum id="mem-actual" label="할당할 실제 메모리(MB)"
          value={formSystemState.memoryActual} 
          onChange={ handleInputChange("memoryActual") }
        />
        <LabelInputNum id="cpu-total" label="총 가상 CPU"
          value={
            formSystemState.cpuTopologyCnt !== undefined &&
            formSystemState.cpuTopologyCnt !== null &&
            !isNaN(formSystemState.cpuTopologyCnt)
              ? formSystemState.cpuTopologyCnt
              : ""
          }
          onChange={handleCpuChange}
        />

        <button className="btn-toggle-cpu" onClick={toggleCpuDetail}>
          <RVI16 iconDef={showCpuDetail ? rvi16ChevronUp : rvi16ChevronDown} className="mr-1.5" />
          {showCpuDetail ? "CPU 상세 옵션 닫기" : "CPU 상세 옵션 열기(체크박스형식?)"}
        </button>
        
        {showCpuDetail && (
          <div>
            <LabelSelectOptions id="virtual_socket" label="가상 소켓"              
              value={formSystemState.cpuTopologySocket}
              options={selectionsSockets()}
              onChange={handleSocketChange}
            />
            <LabelSelectOptions id="core_per_socket" label="가상 소켓 당 코어"
              value={formSystemState.cpuTopologyCore}
              options={selectionsCoresPerSocket()}
              onChange={handleCorePerSocketChange}
            />
            <LabelSelectOptions id="thread_per_core" label="코어당 스레드"
              value={formSystemState.cpuTopologyThread}
              options={selectionsThreadsPerCore()}
              onChange={handleThreadPerCoreChange}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default VmSystem;