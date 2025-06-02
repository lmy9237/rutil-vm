import InfoTable from "@/components/table/InfoTable";
import {
  useTemplate
} from "@/api/RQHook";
import { convertBytesToGB }   from "@/util";
import Localization           from "@/utils/Localization";

/**
 * @name TemplateGeneral
 * @description 탬플릿 일반정보
 *
 * @prop {string} templateId 탬플릿 ID
 * @returns {JSX.Element} TemplateGeneral
 */
const TemplateGeneral = ({ templateId }) => {
  const { data: template } = useTemplate(templateId);

  const tableRows = [
    { label: `${Localization.kr.TEMPLATE} ID`, value: template?.id },
    { label: Localization.kr.NAME,             value: template?.name },
    { label: Localization.kr.DESCRIPTION,      value: template?.description },
    { label: `${Localization.kr.HOST} ${Localization.kr.CLUSTER}`, value: template?.clusterVo?.name },
    { label: "운영 시스템",     value: template?.osSystem },
    { label: "칩셋/펌웨어 유형", value: template?.chipsetFirmwareType },
    { label: "그래픽 프로토콜",  value: "" },
    { label: "비디오 유형",     value: "" },
    { label: "최적화 옵션",     value: template?.optimizeOption },
    { label: "설정된 메모리",    value: `${convertBytesToGB(template?.memorySize)} GB` },
    { label: "CPU 코어 수",    value: template?.cpuTopologyCore },
    { label: "모니터 수",       value: template?.monitor },
    { label: Localization.kr.HA, value: template?.ha ? Localization.kr.YES : Localization.kr.NO },
    { label: "우선 순위", value: template?.haPriority },
    { label: "USB", value: template?.usb ? "사용" : "사용 안 함" },
    { label: "소스", value: Localization.kr.NOT_ASSOCIATED },
    { label: Localization.kr.STATELESS, value: template?.stateless ? Localization.kr.YES : Localization.kr.NO },
  ];

  return (
    <InfoTable tableRows={tableRows} />
  )
};

export default TemplateGeneral;
