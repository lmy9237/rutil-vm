import React from "react";
import { faDesktop } from "@fortawesome/free-solid-svg-icons";
import TableColumnsInfo from "../../components/table/TableColumnsInfo";
import TemplateDupl from "../../components/dupl/TemplateDupl";
import { useAllTemplates } from "../../api/RQHook";

/**
 * @name Templates
 * @description 탬플릿 전체
 *
 * @returns
 */
const Templates = () => {
  const {
    data: templates = [],
    isLoading: isTemplatesLoading,
    isError: isTemplatesError,
    isSuccess: isTemplatesSuccess,
  } = useAllTemplates((e) => ({ ...e }));

  return (
    <>
      <TemplateDupl
        templates={templates}
        columns={TableColumnsInfo.TEMPLATES}
        isLoading={isTemplatesLoading}
        isError={isTemplatesError}
        isSuccess={isTemplatesSuccess}
      />
    </>
  );
};

export default Templates;
