import React from "react";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import TemplateDupl from "../../../components/dupl/TemplateDupl";
import HeaderButton from "../../../components/button/HeaderButton";
import { useAllTemplates } from "../../../api/RQHook";
import { rvi24Template } from "../../../components/icons/RutilVmIcons";

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
  } = useAllTemplates((e) => ({ ...e }));

  return (
    <div id="section">
      <HeaderButton titleIcon={rvi24Template}
        title={"템플릿"}
      />
      <div className="w-full section-content">
        <TemplateDupl
          columns={TableColumnsInfo.TEMPLATES}
          templates={templates}
          showSearchBox={true}
          isLoading={isTemplatesLoading} isError={isTemplatesError} isSuccess={isTemplatesSuccess}
        />
      </div>
    </div>
  );
};

export default AllTemplates;
