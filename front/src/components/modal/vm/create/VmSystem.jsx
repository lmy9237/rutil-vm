import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "react-tooltip";
import LabelInputNum from "../../../label/LabelInputNum";

const InfoTooltip = ({ tooltipId, message }) => (
  <>
    <FontAwesomeIcon
      icon={faInfoCircle}
      style={{ color: "rgb(83, 163, 255)", marginLeft: "5px" }}
      data-tooltip-id={tooltipId}
    />
    <Tooltip id={tooltipId} className="icon_tooltip" place="top" effect="solid">
      {message}
    </Tooltip>
  </>
);

const VmSystem = ({
  editMode,
  formSystemState,
  setFormSystemState,
}) => {
  // 총 cpu 계산
  const calculateFactors = (num) => {
    const factors = [];
    for (let i = 1; i <= num; i++) {
      if (num % i === 0) factors.push(i);
    }
    return factors;
  };

  const handleCpuChange = (e) => {
    const totalCpu = parseInt(e.target.value, 10);
    if (!isNaN(totalCpu) && totalCpu > 0) {
      setFormSystemState((prev) => ({
        ...prev, // 기존 상태 유지
        cpuTopologyCnt: totalCpu,
        cpuTopologySocket: totalCpu, // 기본적으로 소켓을 총 CPU로 설정
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

  return (
    <>
      <div className="edit-second-content">
        <LabelInputNum
          label="메모리 크기(MB)"
          id="memory_size"
          value={formSystemState.memorySize}
          onChange={(e) =>
            setFormSystemState((prev) => ({
              ...prev,
              memorySize: e.target.value,
            }))
          }
        />
        <LabelInputNum
          label="최대 메모리(MB)"
          id="max_memory"
          value={formSystemState.memoryMax}
          onChange={(e) =>
            setFormSystemState((prev) => ({
              ...prev,
              memoryMax: e.target.value,
            }))
          }
        />
        <LabelInputNum
          label="할당할 실제 메모리(MB)"
          id="actual_memory"
          value={formSystemState.memoryActual}
          onChange={(e) =>
            setFormSystemState((prev) => ({
              ...prev,
              memoryActual: e.target.value,
            }))
          }
        />

        <LabelInputNum
          label="총 가상 CPU"
          id="total_cpu"
          value={formSystemState.cpuTopologyCnt}
          onChange={handleCpuChange}
        />
        <div className="network_form_group">
          <label htmlFor="virtual_socket">가상 소켓</label>
          <select
            id="virtual_socket"
            value={formSystemState.cpuTopologySocket}
            onChange={handleSocketChange}
          >
            {calculateFactors(formSystemState.cpuTopologyCnt).map((factor) => (
              <option key={factor.value} value={factor}>
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
            {calculateFactors(
              formSystemState.cpuTopologyCnt / formSystemState.cpuTopologySocket
            ).map((factor) => (
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
              formSystemState.cpuTopologyCnt /
                (formSystemState.cpuTopologySocket *
                  formSystemState.cpuTopologyCore)
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