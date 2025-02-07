import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComputer, faEarthAmericas, faPlus, faServer, faUser } from "@fortawesome/free-solid-svg-icons";
import VmGeneralChart from "./VmGeneralChart";
import { useVmById } from "../../../api/RQHook";
import { formatBytesToMB } from "../../../utils/format";

// 애플리케이션 섹션
const VmGeneral = ({ vmId }) => {
  const { data: vm } = useVmById(vmId);

  const generalTableRows = [
    { label: "전원상태", value: vm?.status },
    { label: "IP 주소", value: vm?.ipv4 },
    { label: "게스트 운영 체제", value: vm?.osSystem },
    { label: "게스트 에이전트", value: vm?.guestInterfaceName },
    { label: "업타임", value: vm?.upTime },
    { label: "FQDN", value: vm?.fqdn },
    // { label: "실행 호스트", value: vm?.hostVo?.name },
    { label: "", value: ' ' },
    { label: "클러스터", 
      value: 
        <div className='related_object'>
          <FontAwesomeIcon icon={faEarthAmericas} fixedWidth className="mr-0.5"/>
          <span className="text-blue-500 font-bold">{vm?.clusterVo?.name}</span>
        </div>
    },
    { label: "호스트", 
      value:  
        <div className='related_object'>
          <FontAwesomeIcon icon={faUser} fixedWidth className="mr-0.5"/>
          <span className="text-blue-500 font-bold"> {vm?.hostVo?.name}</span>
        </div>
    },
    { label: "네트워크", 
      value:  
        <div className='related_object'>
          <FontAwesomeIcon icon={faServer} fixedWidth className="mr-0.5"/>
          <span className="text-blue-500 font-bold"> {vm?.hostVo?.name}</span>
        </div>
    },
    // { label: "스토리지 도메인", 
    //   value:  
    //     <div className='related_object'>
    //       <FontAwesomeIcon icon={faDatabase} fixedWidth className="mr-0.5"/>
    //       <span>{vm?.storageDomainVo?.name}</span>
    //     </div>
    // }
  ];

  const hardwareTableRows = [
    { label: "CPU", value: `${vm?.cpuTopologyCnt}(${vm?.cpuTopologySocket}:${vm?.cpuTopologyCore}:${vm?.cpuTopologyThread})` },
    { label: "메모리", value: formatBytesToMB(vm?.memorySize) +' MB' ?? '0'},
    { label: "하드 디스크", value: vm?.storageDomainVo?.name },
    { label: "네트워크 어댑터", value: vm?.nicVos?.[0]?.name },
    { label: "칩셋/펌웨어 유형", value: vm?.chipsetFirmwareType }
  ];

  const typeTableRows = [
    { label: "유형", value: vm?.osSystem },
    { label: "아키텍처", value: vm?.cpuArc },
    { label: "운영체제", value: vm?.osSystem },
    { label: "커널 버전", value: vm?.kernelVersion },
    { label: "시간대", value: vm?.timeOffset },
    { label: "로그인된 사용자", value: vm?.loggedInUser },
    { label: "콘솔 사용자", value: vm?.consoleUser },
    { label: "콘솔 클라이언트 IP", value: vm?.consoleClientIp },
    
  ];
  
  return (
    <>
      <div className='vm-detail-general-boxs'>
        <div className='detail-general-box'>
          <table className="table">
            <tbody>
              {generalTableRows.map((row, index) => (
                <tr key={index}>
                  <th>{row.label}</th>
                  <td>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
          
        <div className='detail-general-box'>
          <div>VM 하드웨어</div>
          <table className="table">
            <tbody>
              {hardwareTableRows.map((row, index) => (
                <tr key={index}>
                  <th>{row.label}</th>
                  <td>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
          
        <div className='detail_general_mini_box'>
          <div>용량 및 사용량</div>
          <div className='capacity_outer'>
            <div className='capacity'>
              <div>CPU</div>
              <div className='capacity_box'>
                <div>{vm?.usageDto?.cpuPercent}% 사용됨</div>
                <div>{vm?.cpuTopologyCnt} CPU 할당됨</div>
              </div>
            </div>
            <div className='capacity'>
              <div>메모리</div>
              <div className='capacity_box'>
                <div>{vm?.usageDto?.memoryPercent}% 사용됨</div>
                <div>{Math.round(vm?.memoryActual / 1024 / 1024) || '0'} MB 할당됨</div>
              </div>
            </div>
            <div className='capacity'>
              <div>스토리지</div>
              <div className='capacity_box'>
                <div></div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='detail-general-boxs-bottom'>
        <div className="vm-general-bottom-box">     
          <div className="vm_table_container">
            <table className="table">
              <tbody>
                {typeTableRows.map((row, index) => (
                  <tr key={index}>
                    <th>{row.label}:</th>
                    <td>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="vm-general-bottom-box">
          <div className="vm-general-box">
            <FontAwesomeIcon icon={faComputer} className="mr-0.5"/>
            <div className="mr-0.5">스냅샷</div>
            <div>2</div>
          </div>
          <div className="vm-add-snapshot-btn">
            <FontAwesomeIcon icon={faPlus} className="mr-0.5"/>
            <div className="mr-0.5">스냅샷 생성</div>
          </div>
        </div>
        <div className="vm-general-bottom-box">
          <div className="vm-general-box">
            <FontAwesomeIcon icon={faComputer} className="mr-0.5"/>
            <div>디스크</div>
          </div>
          <div className="disk-bar">
            <VmGeneralChart /> 
          </div>
        </div>
      </div>
    </>
  );
};

export default VmGeneral;
