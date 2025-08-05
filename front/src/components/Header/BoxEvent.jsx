import React, { useEffect, useMemo, useRef } from "react";
import useBoxState                  from "@/hooks/useBoxState";
import { Loading, LoadingFetch }    from "@/components/common/Loading";
import useClickOutside              from "@/hooks/useClickOutside";
import useFooterState               from "@/hooks/useFooterState";
import { BadgeNumber }              from "@/components/common/Badges";
import {
  RVI24,
  RVI16,
  rvi16Trash,
  rvi16ArrowLeft,
  rvi16ArrowRight,
  rvi16CloseMenu,
  rvi24RightArrow,
  rvi24DownArrow,
  severity2Icon,
} from "@/components/icons/RutilVmIcons";
import { 
  useAllEventsNormal,
  useAllEventsAlert,
  useRemoveEvent,
  useRemoveEvents
} from "@/api/RQHook";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";
import "./BoxEvent.css";

/**
 * @name BoxEvent
 * 
 * @returns 
 */
const BoxEvent = ({
  ...props
}) => {
  const {
    eventBadgeNum, setEventBadgeNum,
    eventBoxVisible, setEventBoxVisible,
    eventBoxExpanded, toggleEventBoxExpanded,
    eventBoxSectionActive, setEventBoxSectionActive
  } = useBoxState();
  const {
    footerHeightInPx
  } = useFooterState()

  const {
    data: eventsNormal = [],
    isLoading: isEventsNormalLoading,
    isError: isEventsNormalError,
    isSuccess: isEventsNormalSuccess,
    isRefetching: isEventsNormalRefetching,
    refetch: refetchEventsNormal
  } = useAllEventsNormal((e) => ({ ...e, }));

  const {
    data: eventsAlert = [],
    isLoading: isEventsAlertLoading,
    isError: isEventsAlertError,
    isSuccess: isEventsAlertSuccess,
    isRefetching: isEventsAlertRefetching,
    refetch: refetchEventsAlert
  } = useAllEventsAlert((e) => ({ ...e, }));

  useEffect(() => {
    const badgeNum = [...eventsAlert]?.length ?? 0;
    Logger.debug(`BoxEvent > useEffect ... eventBadgeNum: ${badgeNum}`)
    setEventBadgeNum(badgeNum);
  }, [eventsAlert])

  const bellBoxRef = useRef(null);
  useClickOutside(bellBoxRef, (e) => {
    Logger.debug(`BoxEvent > useClickOutside ...`);
    if (eventBoxVisible()) setEventBoxVisible(false);
  })
  const handleSectionClick = (section) => setEventBoxSectionActive(eventBoxSectionActive() === section ? "" : section);
  const stopPropagation = (e) => e.stopPropagation();
  const bellHeaderHeights = useMemo(() => (
    (120) /* 각 bell-header 높이 */ + 50 /* bell-btns 높이 */
  ) ,[])
  const headerHeight = useMemo(() => (
    63 /* 헤더 높이 */
  ), [])
  const currentEventBoxHeightInPx = useMemo(() => {
    Logger.debug(`BoxEvent > currentEventBoxHeightInPx ... window.innerHeight: ${window.innerHeight}, footerHeightInPx: ${footerHeightInPx()}`)
    return window.innerHeight - footerHeightInPx() - headerHeight;
  }, [footerHeightInPx])

  useEffect(() => {
    Logger.debug(`BoxEvent > useEffect ... eventBoxVisible: ${eventBoxVisible}`)
    if (eventBoxVisible) {
      !isEventsNormalLoading && refetchEventsNormal()
      !isEventsAlertLoading && refetchEventsAlert();
    }
  }, [eventBoxVisible, setEventBoxVisible,])

  return (
    <div ref={bellBoxRef}
      className={`bell-box fs-16 ${eventBoxExpanded() ? "expanded" : ""}`}
      onClick={stopPropagation}
      style={{
        height: currentEventBoxHeightInPx
      }}
      {...props}
    >
      <div className="bell-cate f-btw fs-16">
        <span className="bell-header-icon f-center">
        <RVI16 iconDef={eventBoxExpanded() ? rvi16ArrowRight() : rvi16ArrowLeft()}
          className="hover-icon"
          onClick={() => toggleEventBoxExpanded()}
        />
        </span>
        통지함
        <span className="bell-header-icon f-center">
        <RVI16 iconDef={rvi16CloseMenu()}
          className="hover-icon"
          onClick={() => setEventBoxVisible(false)}
        />
        </span>
      </div>
      {/* 알림 탭 */}
      <div className={`bell-cate bell-cate-section ${eventBoxSectionActive() === Localization.kr.ALERT ? "active" : ""} f-start gap-4`}
        onClick={() => handleSectionClick("알림")}
      >
        <span className="bell-header-icon f-center">
          <RVI24 iconDef={eventBoxSectionActive() === Localization.kr.ALERT 
            ? rvi24DownArrow(`${eventBoxSectionActive() === Localization.kr.ALERT ? "currentColor" : "currentColor"}`) 
            : rvi24RightArrow("currentColor")}
          />
        </span>
        {(eventBadgeNum() > 0) && 
          <BadgeNumber status={"alert"} text={eventBadgeNum()} />
        }
        <span className="bell-section-title fs-16 ml-1.5">{Localization.kr.ALERT}</span>
        <LoadingFetch isLoading={isEventsAlertLoading} isRefetching={isEventsAlertRefetching} />
      </div>

      {/* 알림 내용 */}
      {eventBoxSectionActive() === Localization.kr.ALERT && (
        <>
          <div className="bell-content-outer"
            style={{
              minHeight: currentEventBoxHeightInPx - bellHeaderHeights,
              height: currentEventBoxHeightInPx - bellHeaderHeights,
            }}
          >
            {isEventsAlertLoading && <Loading />}
            {isEventsAlertSuccess && <BoxEventItems events={eventsAlert} />}
          </div>

          <RemoveAllEventsButton events={eventsAlert} />
        </>
      )}

      {/* 이벤트 탭 */}
      <div
        className={`bell-cate bell-cate-section ${eventBoxSectionActive() === "이벤트" ? "active" : ""} f-start gap-4`}
        onClick={() => handleSectionClick("이벤트")}
      >
        <span className="bell-header-icon f-center">
          <RVI24
            iconDef={eventBoxSectionActive() === "이벤트" 
              ? rvi24DownArrow("currentColor") 
              : rvi24RightArrow("currentColor")}
          />
        </span>
        <span className="bell-section-title fs-16 ml-1">이벤트</span>
        <LoadingFetch isLoading={isEventsNormalLoading} isRefetching={isEventsNormalRefetching} />
      </div>

      {/* 이벤트 내용 (알림 아래로 깔리도록 설정) */}
      {eventBoxSectionActive() === "이벤트" && (
        <>
          <div className="bell-content-outer event-section"
            style={{
              minHeight: currentEventBoxHeightInPx - bellHeaderHeights,
              height: currentEventBoxHeightInPx - bellHeaderHeights,
            }}
          >
            {isEventsNormalLoading && <Loading />}
            {isEventsNormalSuccess && <BoxEventItems events={eventsNormal} />}
          </div>
          <RemoveAllEventsButton events={eventsNormal} />
        </>
      )}
    </div>
  )
};

const RemoveAllEventsButton = ({
  events=[],
}) => {
  // 모두 삭제
  const { 
    mutate: removeEvents,
  } = useRemoveEvents();

  const handleClick = (e) => {
    Logger.debug(`RemoveAllEventsButton > handleClick ... `)
    e.stopPropagation();
    e.preventDefault();
    const ids = [...events].map(e => e.id);  
    if (ids.length === 0) {
      return;
    }
    removeEvents && removeEvents(ids); 
  }

  return (
    <div className="bell-btns f-center">
      <div className="f-center fs-14"
          onClick={handleClick}
        >
          <RVI16 iconDef={rvi16Trash("currentColor")} />
          <span>모두 삭제</span>
        </div>
      {/* <div className="f-center fs-14">모두 출력</div> */}
    </div>
  )
}

const BoxEventTab = () => {

}

const BoxEventContent = () => {

}

const BoxEventItems = ({
  events=[],
  ...props
}) => (
  events.map((e) => 
    <BoxEventItem event={e} 
      {...props}
    />
  )
)


const BoxEventItem = ({
  event,
  onDelete,
  ...props
}) => {
  const {
    mutate: removeEvent
  } = useRemoveEvent(() => {}, () => {})

  return (
    <div key={event?.id} 
      className="bell-content f-center"
      {...props}
    >
      {event?.severity && (
        <span className="bell-icon f-center mr-1.5">
          {severity2Icon(event?.severity, true)}
        </span>
      )}
        <div className="bell-mid v-start gap-8">
          <p className="f-start w-full txt-multiline">{event?.description}</p>
          <div className="mt-0.5">{event?.time}</div>
        </div>
      <span className="bell-icon bell-icon-trash f-center">
        <RVI16 iconDef={rvi16Trash()} onClick={() => removeEvent(event?.id)} />
      </span>

    </div>
  )
}

export default BoxEvent;
