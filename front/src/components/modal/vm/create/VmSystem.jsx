import Localization from "../../../../utils/Localization";
import LabelInputNum from "../../../label/LabelInputNum";
import { useState } from "react";

const VmSystem = ({ editMode, formSystemState, setFormSystemState}) => {

  // 소켓 보이기/숨기기 토글 함수
  const [isSocketVisible, setSocketVisible] = useState(false);
  const toggleSocketVisibility = () => {
    setSocketVisible((prev) => !prev);
  };

  // 총 cpu 계산
  const calculateFactors = (num) => {
    const factors = [];
    for (let i = 1; i <= num; i++) {
      if (num % i === 0) factors.push(i);
    }
    return factors;
  };

  const handleCpuChange = (e) => {
    console.log("VmSystem > handleCpuChange ... ")
    const totalCpu = parseInt(e.target.value, 10);
    if (!isNaN(totalCpu) && totalCpu > 0) {
      setFormSystemState((prev) => ({
        ...prev, // 기존 상태 유지
        cpuTopologyCnt: totalCpu,
        cpuTopologySocket: null,
        cpuTopologyCore: 1,
        cpuTopologyThread: 1,
      }));
    }else {
      setFormSystemState((prev) => ({
        ...prev,
        cpuTopologyCnt: null,
        cpuTopologySocket: null,
        cpuTopologyCore: 1,
        cpuTopologyThread: 1,
      }));
    }
  };

  const handleSocketChange = (e) => {
    console.log("VmSystem > handleSocketChange ... ")
    const socket = parseInt(e.target.value, 10);
    const remaining = formSystemState.cpuTopologyCnt / socket;

    setFormSystemState((prev) => ({
      ...prev,
      cpuTopologySocket: socket,
      cpuTopologyCore: remaining,
      cpuTopologyThread: 1, 
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

  return (
    <>
      <div className="edit-second-content">
        <LabelInputNum id="memory_size"
          label={`${Localization.kr.MEMORY} 크기(MB)`} value={formSystemState.memorySize}
          onChange={ handleInputChange("memorySize") }
        />
        <LabelInputNum id="max_memory"
          label="최대 메모리(MB)" value={formSystemState.memoryMax}
          onChange={ handleInputChange("memoryMax") }
        />
        <LabelInputNum id="actual_memory"
          label="할당할 실제 메모리(MB)" value={formSystemState.memoryActual}
          onChange={ handleInputChange("memoryActual") }
        />
        <LabelInputNum id="total_cpu"
          label="총 가상 CPU"
          value={formSystemState.cpuTopologyCnt || ""}
          onChange={handleCpuChange}
        />

        {/* 소켓 보이기/숨기기 버튼 */}
        {/* <button onClick={toggleSocketVisibility}>가상 소켓 설정</button>

        {isSocketVisible && (
          <>
          <LabelSelectOptions label="가상 소켓"
            id="virtual_socket"
            value={formSystemState.cpuTopologySocket}
            onChange={handleSocketChange}
            options={calculateFactors(formSystemState.cpuTopologyCnt).map((factor) => ({
              value: factor,
              label: factor,
            }))}
          />   
      
          <LabelSelectOptions label="가상 소켓 당 코어"
            id="core_per_socket"
            value={formSystemState.cpuTopologyCore}
            onChange={handleCoreChange}
            options={calculateFactors(
              formSystemState.cpuTopologyCnt / formSystemState.cpuTopologySocket
            ).map((factor) => ({
              value: factor,
              label: factor,
            }))}
          />

          <LabelSelectOptions label="코어당 스레드"
            id="thread_per_core"
            value={formSystemState.cpuTopologyThread}
            onChange={(e) =>
              setFormSystemState((prev) => ({
                ...prev,
                cpuTopologyThread: parseInt(e.target.value, 10),
              }))
            }
            options={calculateFactors(
              formSystemState.cpuTopologyCnt /
                (formSystemState.cpuTopologySocket * formSystemState.cpuTopologyCore)
            ).map((factor) => ({
              value: factor,
              label: factor,
            }))}
          />
          </>
        )} */}
        {/* 삭제예정 */}
        <div className="network_form_group">
          <label htmlFor="virtual_socket">가상 소켓</label>
          <select
            id="virtual_socket"
            value={formSystemState.cpuTopologySocket}
            onChange={handleSocketChange}
          >
            {calculateFactors(formSystemState.cpuTopologyCnt).map((factor) => (
              <option key={factor} value={factor}>
                {factor}
              </option>
            ))}
          </select>
        </div>
        <div className="network_form_group">
          <label htmlFor="core_per_socket">가상 소켓 당 코어</label>
          <select
            id="core_per_socket"
            value={formSystemState.cpuTopologyCore}
            onChange={handleCoreChange}
          >
            {calculateFactors(formSystemState.cpuTopologyCnt / formSystemState.cpuTopologySocket).map((factor) => (
              <option key={factor} value={factor}>
                {factor}
              </option>
            ))}
          </select>
        </div>
        <div className="network_form_group">
          <label htmlFor="thread_per_core">코어당 스레드</label>
          <select
            id="thread_per_core"
            value={formSystemState.cpuTopologyThread}
            onChange={(e) =>
              setFormSystemState((prev) => ({
                ...prev,
                cpuTopologyThread: parseInt(e.target.value, 10),
              }))
            }
          >
            {calculateFactors(
              formSystemState.cpuTopologyCnt /(formSystemState.cpuTopologySocket * formSystemState.cpuTopologyCore)
            ).map((factor) => (
              <option key={factor} value={factor}>
                {factor}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
};

export default VmSystem;