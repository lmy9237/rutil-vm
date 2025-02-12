import { useTemplate } from '../../../api/RQHook';
import { convertBytesToGB } from '../../../util';

const TemplateGeneral = ({ templateId }) => {
  const { data: template } = useTemplate(templateId);

  const tableRows = [
    { label: "템플릿 ID", value: template?.id },
    { label: "이름", value: template?.name },
    { label: "설명", value: template?.description },
    { label: "호스트 클러스터", value: template?.clusterVo?.name },
    { label: "운영 시스템", value: template?.osSystem },
    { label: "칩셋/펌웨어 유형", value: template?.chipsetFirmwareType },
    { label: "그래픽 프로토콜", value: '' },
    { label: "비디오 유형", value: '' },
    { label: "최적화 옵션", value: template?.optimizeOption },
    { label: "", value: '' },
    { label: "설정된 메모리", value: convertBytesToGB(template?.memorySize)+' GB' },
    { label: "CPU 코어 수", value: template?.cpuTopologyCore },
    { label: "모니터 수", value: template?.monitor },
    { label: "고가용성", value: template?.ha ? "예" : "아니오" },
    { label: "우선 순위", value: template?.priority },
    { label: "USB", value: template?.usb ? "사용" : "사용 안 함" },
    { label: "소스", value: 'N/A' },
    { label: "상태 비저장", value: template?.stateless ? "예" : "아니오" },
  ];

  return (
    <>
      <table className="table">
        <tbody>
          {tableRows.map((row, index) => (
            <tr key={index}>
              <th>{row.label}</th>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default TemplateGeneral;
