import React from "react";
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
    refetch: refetchTemplates,
  } = useAllTemplates((e) => ({ ...e }));

  return (
    <TemplateDupl columns={TableColumnsInfo.TEMPLATES}
      templates={templates}
      refetch={refetchTemplates}
      isLoading={isTemplatesLoading} isError={isTemplatesError} isSuccess={isTemplatesSuccess}
    />
  );
};

export default Templates;
