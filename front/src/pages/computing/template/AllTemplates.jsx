import React from "react";
import SectionLayout from "../../../components/SectionLayout";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import TemplateDupl from "../../../components/dupl/TemplateDupl";
import HeaderButton from "../../../components/button/HeaderButton";
import { useAllTemplates } from "../../../api/RQHook";
import { rvi24Template } from "../../../components/icons/RutilVmIcons";
import Localization from "../../../utils/Localization";
import Logger from "../../../utils/Logger";

/**
 * @name AllTemplates
 * @description 탬플릿 전체
 *
 * @returns {JSX.Element} AllTemplates
 */
const AllTemplates = () => {
  const {
    data: templates = [],
    isLoading: isTemplatesLoading,
    isError: isTemplatesError,
    isSuccess: isTemplatesSuccess,
    refetch: refetchTemplates,
  } = useAllTemplates((e) => ({ ...e }));

  return (
    <SectionLayout>
      <HeaderButton titleIcon={rvi24Template()}
        title={Localization.kr.TEMPLATE}
      />
      <div className="section-content v-start gap-8 w-full">
        <TemplateDupl columns={TableColumnsInfo.TEMPLATES}
          templates={templates}
          showSearchBox={true}
          refetch={refetchTemplates}
          isLoading={isTemplatesLoading} isError={isTemplatesError} isSuccess={isTemplatesSuccess}
        />
      </div>
    </SectionLayout>
  );
};

export default AllTemplates;
