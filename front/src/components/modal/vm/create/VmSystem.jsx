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
    const value = e.target.value;
    if (value === "") {
      setFormSystemState((prev) => ({
        ...prev,
        cpuTopologyCnt: "",
        cpuTopologySocket: "",
        cpuTopologyCore: "",
        cpuTopologyThread: "",
      }));
      return;
    }
    const totalCpu = parseInt(value, 10);
    if (isNaN(totalCpu) || totalCpu <= 0) return;
  
    Logger.debug(`VmSystem > handleCpuChange ... value:${e.target.value}\ntotalCpu:${totalCpu}`)
    const _formSystemState = {

    }
    setFormSystemState((prev) => {
      Logger.debug(`VmSystem > handleCpuChange ... prev: `, prev)
      return {
        ...prev,
        cpuTopologyCnt: totalCpu,
        cpuTopologySocket: totalCpu,
        cpuTopologyCore: 1,
        cpuTopologyThread: 1,
      }
    });
    Logger.debug(`VmSystem > handleCpuChange ... formState: `, formSystemState)
  }
  
  const handleSocketChange = (e) => {
    const socket = parseInt(e.target.value, 10);
    const totalCpu = formSystemState.cpuTopologyCnt;
    /*if (!socket || socket <= 0 || !totalCpu) return;
    let core = 1;
    let thread = 1;
    if (totalCpu % socket === 0) {
      core = totalCpu / socket;
    } else {
      core = 1;
      thread = totalCpu / socket;
    }
    */
    const core = totalCpu / socket
    const thread = Math.round(totalCpu / (socket * core));
    Logger.debug(`VmSystem > handleSocketChange ... value: ${e.target.value}\ntotolCpu:${totalCpu}\nsocket:${socket}\ncore:${core}\nthread:${thread}`)
    setFormSystemState((prev) => ({
      ...prev,
      cpuTopologySocket: socket,
      cpuTopologyCore: core,
      cpuTopologyThread: thread > 0 ? thread : 1,
    }));
  };
  
  const handleCorePerSocketChange = (e) => {
    const core = parseInt(e.target.value, 10);
    const totalCpu = formSystemState.cpuTopologyCnt;
    /*
    const socket = formSystemState.cpuTopologySocket || 1;

    if (!core || core <= 0 || !totalCpu) return;
    */
    const socket = (totalCpu / core) || 1;
    const thread = Math.round(totalCpu / (socket * core)) || 1;

    Logger.debug(`VmSystem > handleCorePerSocketChange ... value: ${e.target.value}\ntotolCpu:${totalCpu}\nsocket:${socket}\ncore:${core}\nthread:${thread}`)
    setFormSystemState((prev) => ({
      ...prev,
      cpuTopologySocket: socket,
      cpuTopologyCore: core,
      cpuTopologyThread: thread,
    }));
  };
  
  const handleThreadPerCoreChange = (e) => {
    const thread = parseInt(e.target.value, 10);
    const totalCpu = formSystemState.cpuTopologyCnt;
    const socket = (totalCpu / thread) || 1;  
    const core = Math.round(totalCpu / (socket * thread)) || 1;
  
    Logger.debug(`VmSystem > handleThreadPerCoreChange ... value: ${e.target.value}\ntotolCpu:${totalCpu}\nsocket:${socket}\ncore:${core}\nthread:${thread}`)
    setFormSystemState((prev) => ({
      ...prev,
      cpuTopologySocket: socket,
      cpuTopologyCore: core,
      cpuTopologyThread: thread,
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
  }

  // 토글 상태
  const [showCpuDetail, setShowCpuDetail] = useState(false); 
  const toggleCpuDetail = () => setShowCpuDetail(prev => !prev);
  const selectionNumPredicate = (v) => ({ value: v, label: v.toString() });
  const selectionsSockets = () => {
    Logger.debug(`VmSystem > selectionsSockets ... `)
    const cpuCnt = formSystemState.cpuTopologyCnt;
    if (!cpuCnt || isNaN(cpuCnt)) return [];
    return calculateFactors(cpuCnt).map(selectionNumPredicate);
  }
  
  const selectionsCoresPerSocket = () => {
    Logger.debug(`VmSystem > selectionsSockets ... `)
    return selectionsSockets()
  }

  const selectionsThreadsPerCore = () => {
    const cpuCnt = formSystemState.cpuTopologyCnt;
    if (!cpuCnt || isNaN(cpuCnt)) return [];
    return calculateFactors(cpuCnt).map(selectionNumPredicate);
  }

  return (
    <>
      <div className="edit-second-content">
        <LabelInputNum id="mem" label="메모리 크기(MB)"
          value={formSystemState.memorySize} 
          onChange={handleInputChange("memorySize")}
        />
        <LabelInputNum id="mem-max"label="최대 메모리(MB)"
          value={formSystemState.memoryMax} 
          onChange={handleInputChange("memoryMax")}
        />
        <LabelInputNum id="mem-actual" label="할당할 실제 메모리(MB)"
          value={formSystemState.memoryActual} 
          onChange={handleInputChange("memoryActual") }
        />
        <LabelInputNum id="cpu-total" label="총 가상 CPU"
          value={formSystemState.cpuTopologyCnt}
          onChange={handleCpuChange}
        />

        <button className="btn-toggle-cpu" onClick={toggleCpuDetail}>
          <RVI16 iconDef={showCpuDetail ? rvi16ChevronUp("#1D1D1D") : rvi16ChevronDown("#1D1D1D")} 
            className="mr-1.5"
          />
          {showCpuDetail ? "CPU 상세 옵션 닫기" : "CPU 상세 옵션 열기"}
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