import React, { useEffect } from "react";
import useGlobal from "../../hooks/useGlobal";
import TableColumnsInfo from "../../components/table/TableColumnsInfo";
import TemplateDupl from "../../components/dupl/TemplateDupl";
import { useAllTemplates } from "../../api/RQHook";
import Logger from "../../utils/Logger";

/**
 * @name RutilTemplates
 * @description 탬플릿 전체
 * 경로: <메뉴>/rutil-manager/templates
 *
 * @returns {JSX.Element} RutilTemplates
 */
const RutilTemplates = ({

}) => {
  const { setTemplatesSelected } = useGlobal()
  const {
    data: templates = [],
    isLoading: isTemplatesLoading,
    isError: isTemplatesError,
    isSuccess: isTemplatesSuccess,
    refetch: refetchTemplates,
    isRefetching: isTemplatesRefetching,
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
      refetch={refetchTemplates} isRefetching={isTemplatesRefetching}
      isLoading={isTemplatesLoading} isError={isTemplatesError} isSuccess={isTemplatesSuccess}
    />
  );
};

export default RutilTemplates;
