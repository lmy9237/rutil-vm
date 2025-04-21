import React, { useEffect, useRef, useState } from "react";
import useGlobal from "../../hooks/useGlobal";
import useFooterState from "../../hooks/useFooterState";
import SelectedIdView from "../common/SelectedIdView";
import { RVI24, rvi24ChevronUp, rvi24DownArrow } from "../icons/RutilVmIcons";
import { useAllJobs } from "../../api/RQHook";
import Logger from "../../utils/Logger";
import TableColumnsInfo from "../table/TableColumnsInfo";
import TablesOuter from "../table/TablesOuter";
import "./JobFooter.css";

/**
 * @name JobFooter
 * @description Footer
 *
 * @returns {JSX.Element} Footer
 */
const JobFooter = () => {
  const {
    footerVisible, toggleFooterVisible,
    footerDragging, setFooterDragging,
    footerOffsetY, setFooterOffsetY,
    footerJobRefetchInterval
  } = useFooterState();
  const { jobsSelected, setJobsSelected } = useGlobal()

  const {
    data: jobs = [],
    isLoading: isJobsLoading,
    isError: isJobsError,
    isSuccess: isJobsSuccess,
    refetch: refetchJobs
  } = useAllJobs((e) => ({ ...e }), parseInt(footerJobRefetchInterval()))


  // job 데이터 변환
  const transformedData = [...jobs].map((e) => ({
    ...e,
    isFinished: e?.status === "FINISHED" || e?.status === "FAILED" ,
    description: e?.description,
    status: e?.status,
    startTime: e?.startTime,
    endTime: e?.endTime,
  }));

  Logger.debug(`JobFooter ... `)
  return (
    <>
      <div
        className={`footer-outer v-start${footerVisible() ? " open" : ""}`}
      >
        {/* 상단 "최근작업" 바 */}
        <div
          className="footer f-start"
          style={{ height: `40px` }}
          onClick={(e) => {
            e.stopPropagation()
            toggleFooterVisible()
          }}
        >
          <RVI24 iconDef={footerVisible() ? rvi24DownArrow() : rvi24ChevronUp()}/>
          <span>최근 작업</span>
        </div>

        {/* 테이블 */}
        <div
          className={`footer-content${footerVisible() ? " open" : ""}`}
        >
          <div className="footer-nav">
            <TablesOuter columns={TableColumnsInfo.JOB_HISTORY_COLUMNS}
              data={transformedData}
              onRowClick={(row) => setJobsSelected(row)}
              showSearchBox={false}
              isLoading={isJobsLoading} isError={isJobsError} isSuccess={isJobsSuccess}
            />
            <SelectedIdView items={jobsSelected} />
          </div>
        </div>
      </div>
    </>
  );
};

export default JobFooter;
