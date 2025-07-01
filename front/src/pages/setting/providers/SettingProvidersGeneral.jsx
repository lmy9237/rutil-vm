import InfoTable from "@/components/table/InfoTable";
import React from "react";

const SettingProvidersGeneral = () => {
  const tableRows = [ // 샘플 데이터
    { label: "이름", value: "ovirt-image-repository" },
    { label: "유형", value: "OpenStack Image" },
    { label: "설명", value: "Public Glance repository for oVirt" },
    { label: "공급자 URL", value: "http://glance.ovirt.org:9292" },
  ];

  return <InfoTable tableRows={tableRows} />;
};

export default SettingProvidersGeneral;