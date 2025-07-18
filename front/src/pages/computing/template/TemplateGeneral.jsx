import { InfoTable }              from "@/components/table/InfoTable";
import {
  useTemplate
} from "@/api/RQHook";
import { checkZeroSizeToMB }      from "@/util";
import Localization               from "@/utils/Localization";

/**
 * @name TemplateGeneral
 * @description 탬플릿 일반정보
 *
 * @prop {string} templateId 탬플릿 ID
 * @returns {JSX.Element} TemplateGeneral
 */
const TemplateGeneral = ({ 
  templateId 
}) => {
  const { data: template } = useTemplate(templateId);

  const tableRows = [
    { label: `ID`, value: template?.id },
    { label: Localization.kr.NAME,                 value: template?.name },
    { label: Localization.kr.DESCRIPTION,          value: template?.description },
    { label: `${Localization.kr.HOST} ${Localization.kr.CLUSTER}`, value: template?.clusterVo?.name },
    { label: Localization.kr.OPERATING_SYSTEM,     value: template?.osTypeName },
    { label: "칩셋/펌웨어 유형",                      value: template?.biosTypeKr },
    { label: "그래픽 프로토콜",                       value: template?.displayType.toUpperCase() },
    { 
      label: "최적화 옵션", 
      value: 
        template?.optimizeOption.toLowerCase() === "server"
          ? "서버"
          : template?.optimizeOption.toLowerCase() === "high_performance"
            ? "고성능"
            : "데스크톱"
    },
    { label: "설정된 메모리",    value: checkZeroSizeToMB(template?.memorySize) },
    { label: "CPU 코어 수",    value: `${template?.cpuTopologyCnt} (${template?.cpuTopologySocket}:${template?.cpuTopologyCore}:${template?.cpuTopologyThread})` || "" },
    { label: Localization.kr.HA, value: template?.ha ? Localization.kr.YES : Localization.kr.NO },
    { label: "우선 순위", value: template?.haPriority },
    { label: "모니터 수",       value: template?.monitor },
    { label: "USB", value: template?.usb === true ? "활성화":"비활성화" || "" },
    // { label: Localization.kr.STATELESS, value: template?.stateless ? Localization.kr.YES : Localization.kr.NO },
  ];

  return (
    <InfoTable tableRows={tableRows} />
  )
};

export default TemplateGeneral;
