import React from "react";
import { faDesktop } from "@fortawesome/free-solid-svg-icons";
import Footer from "../../../components/footer/Footer";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import TemplateDupl from "../../../components/dupl/TemplateDupl";
import HeaderButton from "../../../components/button/HeaderButton";
import { useAllTemplates } from "../../../api/RQHook";

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
      <div>
        <HeaderButton titleIcon={faDesktop} title={"템플릿"} />
      </div>
      <div className="w-full px-[0.5rem] py-[0.5rem]">
        <TemplateDupl
          templates={templates || []}
          columns={TableColumnsInfo.TEMPLATES}
          isLoading={isTemplatesLoading}
          isError={isTemplatesError}
          isSuccess={isTemplatesSuccess}
        />
      </div>
      <Footer />
    </div>
  );
};

export default AllTemplates;
