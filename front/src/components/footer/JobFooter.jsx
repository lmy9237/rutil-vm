import React, { useRef, useState } from "react";
import { RVI24, rvi24ChevronUp, rvi24DownArrow } from "../icons/RutilVmIcons";
import Localization from "../../utils/Localization";
import useUIState from "../../hooks/useUIState";
import { useAllJobs } from "../../api/RQHook";
import Spinner from "../common/Spinner";
import TableRowNoData from "../table/TableRowNoData";
import "./JobFooter.css";
import SelectedIdView from "../common/SelectedIdView";
import { formatNumberWithCommas } from "../../util";


/**
 * @name JobFooter
 * @description Footer
 *
 * @returns {JSX.Element} Footer
 */
const JobFooter = () => {
  const {
    data: jobs = [],
    isLoading: isJobsLoading,
    isError: isJobsError,
    isSuccess: isJobsSuccess,
    refetch: refetchJobs
  } = useAllJobs((e) => ({ ...e }))


  // job 데이터 변환
  const transformedData = (!Array.isArray(jobs) ? [] : jobs).map((e) => ({
    ...e,
    isFinished: e?.status === "FINISHED" || e?.status === "FAILED" ,
    duration: '',
    description: e?.description,
    status: e?.status,
    startTime: e?.startTime,
    endTime: e?.endTime,
  }));
  
  const [selectedJobs, setSelectedJobs] = useState([]);

  const {
    footerVisible, toggleFooterVisible 
  } = useUIState();

  // 드레그
  const footerBarHeight = 40;
  const [footerHeight, setFooterHeight] = useState(300);
  const isResizing = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);
  
  const handleResizeStart = (e) => {
    isResizing.current = true;
    startYRef.current = e.clientY;
    startHeightRef.current = footerHeight;
  
    document.addEventListener("mousemove", handleResizeMove);
    document.addEventListener("mouseup", handleResizeEnd);
  
    document.body.style.userSelect = "none";
    document.body.style.cursor = "row-resize";
  };
  
  const handleResizeMove = (e) => {
    if (!isResizing.current) return;
  
    requestAnimationFrame(() => {
      const dy = startYRef.current - e.clientY; // 아래로 내리면 양수
      const newHeight = startHeightRef.current + dy;
  
      if (newHeight >= 184 && newHeight <= 600) {
        setFooterHeight(newHeight);
      }
    });
  };
  
  const handleResizeEnd = () => {
    isResizing.current = false;
  
    document.removeEventListener("mousemove", handleResizeMove);
    document.removeEventListener("mouseup", handleResizeEnd);
  
    document.body.style.userSelect = "auto";
    document.body.style.cursor = "default";
  };
  

  return (
    <>
    {/* 드래그바 */}
    {footerVisible && (
      <div className="footer-resizer" onMouseDown={handleResizeStart} />
    )}
    <div
      className={`footer-outer v-start${footerVisible ? " open" : ""}`}
      style={{
        height: footerVisible ? `${footerHeight + footerBarHeight}px` : "auto",
      }}
    >
      {/* 상단 "최근작업" 바 */}
      <div
        className="footer f-start"
        style={{ height: `${footerBarHeight}px` }}
        onClick={() => toggleFooterVisible()}
      >
        <RVI24 iconDef={footerVisible ? rvi24DownArrow() : rvi24ChevronUp()}/>
        <span>최근 작업</span>
      </div>

      {/* 테이블 */}
      <div
        className={`footer-content${footerVisible ? " open" : ""}`}
      >
        <div className="footer-nav">
          <div className="section-table-outer p-0.5">
            <table id="table-job">
              <thead>
                <tr>
                  {/* <th>{Localization.kr.TARGET} <FontAwesomeIcon icon={faFilter} fixedWidth /></th> */}
                  <th>작업명</th>
                  <th>{Localization.kr.STATUS}</th>
                  <th>시작 {Localization.kr.TIME}</th>
                  <th>종료 {Localization.kr.TIME}</th>
                  <th>총 소요 {Localization.kr.TIME}</th>
                </tr>
              </thead>
              <tbody>
                {transformedData.length === 0 ? (
                  <TableRowNoData colLen={4} />
                ) : transformedData.map((job) => (
                  <tr key={job?.id}>
                    <td className="f-start">{!job?.isFinished && <Spinner/>}{job?.description}</td>
                    <td>{Localization.kr.renderStatus(job?.status)}</td>
                    <td>{job?.startTime}</td>
                    <td>{job?.endTime}</td>
                    <td>{Localization.kr.renderTime(job?.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <SelectedIdView items={selectedJobs} />
        </div>
      </div>
    </div>
    </>
  );
};

export default JobFooter;
