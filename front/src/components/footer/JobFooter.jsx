import React, { useCallback, useEffect, useMemo, useState } from "react";
import useGlobal              from "@/hooks/useGlobal";
import useSearch              from "@/hooks/useSearch";
import useFooterState         from "@/hooks/useFooterState";
import {
  RVI24,
  rvi24Refresh,
  rvi24ChevronUp,
  rvi24DownArrow
} from "@/components/icons/RutilVmIcons";
import Spinner                from "@/components/common/Spinner";
import SelectedIdView         from "@/components/common/SelectedIdView";
import { BadgeStatus, BadgeNumber } from "@/components/common/Badges";
import SearchBox              from "@/components/button/SearchBox";
import TablesOuter            from "@/components/table/TablesOuter";
import TableRowClick          from "@/components/table/TableRowClick";
import TableColumnsInfo       from "@/components/table/TableColumnsInfo";
import {
  useAllJobs
} from "@/api/RQHook";
import Localization           from "@/utils/Localization";
import Logger                 from "@/utils/Logger";
import "./JobFooter.css";
import IconButton from "../Input/IconButton";
import CONSTANT from "@/Constants";

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
    footerHeightInPx, setFooterHeightInPx,
    footerJobRefetchInterval
  } = useFooterState();
  const { jobsSelected, setJobsSelected } = useGlobal()

  const {
    data: jobs = [],
    isLoading: isJobsLoading,
    isError: isJobsError,
    isSuccess: isJobsSuccess,
    refetch: refetchJobs,
    isRefetching: isJobsRefetching,
  } = useAllJobs((e) => ({ ...e }), parseInt(footerJobRefetchInterval()))

  // job 데이터 변환
  const transformedData = useMemo(() => ([...jobs].map((e) => ({
    ...e,
    isFinished: e?.status === "FINISHED" || e?.status === "FAILED" ,
    _description: [...e?.steps]?.length > 1 ? (
      <TableRowClick type="job" id={e?.id} onClick={() => handleDescriptionClick(e)}>
        {e?.description}
      </TableRowClick>
    ) : e?.description,
    // steps: e?.steps,
    numSteps: [...e?.steps]?.length > 1 
      ? <BadgeNumber 
        text={`${[...e?.steps]?.filter((s) => s?.status === "FINISHED" || s?.status === "FAILED")?.length}/${[...e?.steps].length}`}
        status={e?.status === "FAILED" ? "alert" : "number"}
      /> : "",
    /* 
    status: (e?.status === "FINISHED" || e?.status === "FAILED") 
      ? <BadgeStatus status={
        e?.status === "FINISHED" 
          ? "running"
          : "default"
      } text={e?.status} />
      : <Spinner />,
    */
    status: (e?.status === "FINISHED" || e?.status === "FAILED")
    ? (e?.status === "FINISHED" ? "성공" : "실패")
    : <Spinner />,
    startTime: e?.startTime,
    endTime: e?.endTime === "" 
      ? Localization.kr.NOT_ASSOCIATED
      : e?.endTime,
    timestamp: isNaN(e?.timestamp) 
      ? Localization.kr.NOT_ASSOCIATED
      : Localization.kr.renderTime(e?.timestamp),
  }))), [jobs]);
 
  const handleDescriptionClick = useCallback((job) => {
    // toast({ description: job?.description})
  }, [jobs])
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
  }, [footerVisible, footerHeight])

  useEffect(() => {
    Logger.debug(`JobFooter > useEffect ... footerHeight: ${footerHeight}`)
    if (footerHeight !== footerHeightInPx()) setTimeout(() => {
      return () => {
        setFooterHeightInPx(footerHeight)
      }
    }, 300)
  }, [footerHeight])

  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);

  return (
    <>
      {/* 드래그바 */}
      <div className="footer-resizer f-center"
        onMouseDown={handleMouseDown}
        style={{ bottom: `${footerHeight}px` }}
      />
      <div
        className={`footer-outer v-start w-full`}
        style={{ height: `${footerHeight}px` }}
      >
        {/* 상단 "최근작업" 바 */}
        <div
          className="footer f-start fs-16 w-full px-2"
          style={{ height: `40px` }}
          // onClick={(e) => {
          //   e.stopPropagation()
          //   toggleFooterVisible()
          // }}
        >
          <RVI24 className={`footer-opener${footerVisible() ? " open" : ""}`}
            iconDef={footerVisible() 
              ? rvi24DownArrow(CONSTANT.color.black)
              : rvi24ChevronUp(CONSTANT.color.black)
            }
            onClick={(e) => {
              e.stopPropagation()
              toggleFooterVisible()
            }}
          />
          <span className="f-start w-full"
            onClick={(e) => {
              e.stopPropagation()
              toggleFooterVisible()
            }}
          >
            최근 작업
          </span>
          <RVI24 className="footer-ico footer-ico-refresh ml-auto" 
            iconDef={rvi24Refresh(CONSTANT.color.black)} 
            onClick={(e) => {
              e.stopPropagation()
              if (footerVisible()) refetchJobs()
            }}
          />(위치)
          {/* <IconButton iconDef={rvi16Refresh("#717171")} 
                onClick={handleRefresh}
                 onClick={() =>  window.location.reload()}
          /> */}
        </div>

        {/* 테이블 */}
        <div
          className={`footer-content v-center w-full`}
          style={{ height: `${footerHeight - 40}px` }}
        >
          <div className="footer-nav v-start gap-8 w-full h-full">
            {/* <div className="dupl-header-group f-start gap-4 w-full">
              {transformedData.length > 0 && 
                <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} refetch={refetchJobs} />
              }
            </div> */}
            <TablesOuter target={"job"}
              columns={TableColumnsInfo.JOB_HISTORY_COLUMNS}
              style={{ paddingLeft:'30px' }}
              data={filteredData}
              searchQuery={searchQuery} setSearchQuery={setSearchQuery}
              onRowClick={(row) => setJobsSelected(row)}
              onClickableColumnClick={(row) => handleDescriptionClick(row)}
              isLoading={isJobsLoading} isRefetching={isJobsRefetching} isError={isJobsError} isSuccess={isJobsSuccess}
            />
            <SelectedIdView items={jobsSelected} />
          </div>
        </div>
      </div>
    </>
  );
};

export default JobFooter;
