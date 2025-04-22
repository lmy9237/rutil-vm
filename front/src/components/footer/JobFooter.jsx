import React, { useEffect, useMemo, useRef, useState } from "react";
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
const JobFooter = ({
  ...props
}) => {
  const {
    footerVisible, toggleFooterVisible,
    setFooterHeightInPx,
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
  const transformedData = useMemo(() => ([...jobs].map((e) => ({
    ...e,
    isFinished: e?.status === "FINISHED" || e?.status === "FAILED" ,
    description: e?.description,
    status: e?.status,
    startTime: e?.startTime,
    endTime: e?.endTime,
  }))), [jobs]);

  const FOOTER_TOP_HORIZ_BAR_HEIGHT = 40
  const [footerHeight, setFooterHeight] = useState(FOOTER_TOP_HORIZ_BAR_HEIGHT)
  const handleMouseDown = (mouseDownEvent) => {
    Logger.debug(`JobFooter > handleMouseDown ... `)
    
    function onMouseMove(mouseMoveEvent) {
      const totalHeight = window.innerHeight;
      Logger.debug(`JobFooter > handleMouseDown > onMouseMove ... totalHeight: ${totalHeight}, clientY: ${mouseMoveEvent.clientY}`)
      setFooterHeight(totalHeight - mouseMoveEvent.clientY);
    }
    function onMouseUp() {
      Logger.debug(`JobFooter > handleMouseDown > onMouseUp ... `)
      document.body.removeEventListener("mousemove", onMouseMove);
    }

    document.body.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseup", onMouseUp, { once: true });
  }

  useEffect(() => {
    Logger.debug(`JobFooter > useEffect ... footerVisible: ${footerVisible()}`)
    if (!footerVisible()) {
      /* 닫아야 할 때 */
      setFooterHeight(40)
    } else if (footerVisible() && footerHeight === FOOTER_TOP_HORIZ_BAR_HEIGHT) { 
      /* 최초로 눌러서 열 때 */
      setFooterHeight(168)
    }
  }, [footerVisible])

  return (
    <>
      {/* 드래그바 */}
      <div className="footer-resizer f-center"
        onMouseDown={handleMouseDown}
        style={{ bottom: `${footerHeight}px` }}
      />
      <div
        // className={`footer-outer v-start${footerVisible() ? " open" : ""}`}
        className={`footer-outer v-start`}
        style={{ height: `${footerHeight}px` }}
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
          // className={`footer-content${footerVisible() ? " open" : ""}`}
          className={`footer-content v-center`}
          style={{ height: `${footerHeight - 40}px` }}
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
