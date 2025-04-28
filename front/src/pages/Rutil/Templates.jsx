import React, { useEffect } from "react";
import useGlobal from "../../hooks/useGlobal";
import TableColumnsInfo from "../../components/table/TableColumnsInfo";
import TemplateDupl from "../../components/dupl/TemplateDupl";
import { useAllTemplates } from "../../api/RQHook";
import Logger from "../../utils/Logger";

/**
 * @name Templates
 * @description 탬플릿 전체
 *
 * @returns
 */
const Templates = () => {
  const { setTemplatesSelected } = useGlobal()
  const {
    data: templates = [],
    isLoading: isTemplatesLoading,
    isError: isTemplatesError,
    isSuccess: isTemplatesSuccess,
    refetch: refetchTemplates,
  } = useAllTemplates((e) => ({ ...e }));

  useEffect(() => {
    return () => {
      Logger.debug("Templates > useEffect ... CLEANING UP");
      setTemplatesSelected([])
    }
  }, []);

  return (
    <TemplateDupl columns={TableColumnsInfo.TEMPLATES}
      templates={templates}
      refetch={refetchTemplates}
      isLoading={isTemplatesLoading} isError={isTemplatesError} isSuccess={isTemplatesSuccess}
    />
  );
};

export default Templates;
