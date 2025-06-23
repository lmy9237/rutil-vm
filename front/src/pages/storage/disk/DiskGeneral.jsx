import { InfoTable }              from "@/components/table/InfoTable";
import {
  useDisk
} from "@/api/RQHook";
import {
  checkZeroSizeToGiB,
  convertBytesToGB
} from "@/util";
import Localization               from "@/utils/Localization";
import GeneralLayout from "@/components/GeneralLayout";
import GeneralBoxProps from "@/components/common/GeneralBoxProps";
import VmGeneralBarChart from "@/pages/computing/vm/VmGeneralBarChart";
import OVirtWebAdminHyperlink from "@/components/common/OVirtWebAdminHyperlink";
import useGlobal from "@/hooks/useGlobal";

/**
 * @name DiskGeneral
 * @description 디스크 일반정보
 * (/storages/disks/<diskId>)
 *
 * @param {string} diskId 디스크ID
 * @returns
 */
const DiskGeneral = ({
  diskId
}) => {
  const { disksSelected } = useGlobal()
  const {
    data: disk,
    isLoading: isDiskLoading,
    isError: isDiskError,
    isSuccess: isDiskSuccess,
  } = useDisk(diskId);

  const tableRows = [
    { label: Localization.kr.ALIAS, value: disk?.alias },
    { label: "ID", value: disk?.id },
    { label: Localization.kr.DESCRIPTION, value: disk?.description },
    { label: Localization.kr.DOMAIN, value: disk?.storageDomainVo?.name },
    { label: "가상 디스크 크기", value: `${convertBytesToGB(disk?.virtualSize)} GB` },
    { label: "실제 가상 디스크 크기", value: checkZeroSizeToGiB(disk?.actualSize) },
    { label: "할당 정책", value: disk?.sparse ? "씬 프로비저닝" : disk?.sparse === false ? "사전 할당" : "-" },
  ];

  // return <InfoTable tableRows={tableRows} />;
    return (
    <>
    {/* <div className="vm-detail-grid">
      <div className="vm-section section-top">
        <div className="grid-col-span-2 vm-box-default box-content">
          <h3 className="box-title">게스트 운영체제</h3>
          <hr className="w-full" />
            <InfoTable tableRows={tableRows} />
        </div>
        <GeneralBoxProps title="용량 및 사용량">
          <DomainStorageUsageBarChart />
        </GeneralBoxProps>
      </div>
    </div> */}
    <GeneralLayout
      top={
      <>
      <div className="grid-col-span-2 vm-box-default box-content">
        <h3 className="box-title">일반</h3>
        <hr className="w-full" />
        <InfoTable tableRows={tableRows} />
      </div>
      <GeneralBoxProps title="용량 및 사용량">
        <VmGeneralBarChart type="domain" />
      </GeneralBoxProps>
      </>
    }
    bottom={
      <>
      </>
      }
    />
    {/* <OVirtWebAdminHyperlink
      name={`${Localization.kr.DOMAIN}>${Localization.kr.DOMAIN}>${disksSelected[0]?.name}`}
      path={`storage-general;name=${disksSelected[0]?.name}`}
    /> */}
    </>
  );
};

export default DiskGeneral;
