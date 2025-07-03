import React from "react";
import InfoTable from "@/components/table/InfoTable";
import useGlobal from "@/hooks/useGlobal";
import { useProvider } from "@/api/RQHook";
import Localization from "@/utils/Localization";

const SettingProvidersGeneral = ({ provider }) => {
  if (!provider) return <div>로딩 중...</div>;

  const tableRows = [
    { label: Localization.kr.NAME, value: provider?.name },
    { label: Localization.kr.TYPE, value: provider.providerTypeKr || provider.providerType },
    { label: Localization.kr.DESCRIPTION, value: provider.description || "-" },
    { label: "공급자 URL", value: provider.url },
  ];

  return <InfoTable tableRows={tableRows} />;
};


export default SettingProvidersGeneral;
