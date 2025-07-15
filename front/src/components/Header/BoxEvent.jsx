import React, { useEffect, useMemo, useRef } from "react";
import useBoxState            from "@/hooks/useBoxState";
import useClickOutside        from "@/hooks/useClickOutside";
import useFooterState         from "@/hooks/useFooterState";
import { BadgeNumber }        from "@/components/common/Badges";
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
import Logger                 from "@/utils/Logger";
import "./BoxEvent.css";
import Localization from "@/utils/Localization";

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
    refetch: refetchEvents
  } = useAllEventsNormal((e) => ({ ...e, }));

  const {
    data: eventAlerts = [],
    isLoading: isEventAlertsLoading,
    isError: isEventAlertsError,
    isSuccess: isEventAlertsSuccess,
    refetch: refetchEventAlerts
  } = useAllEventsAlert((e) => ({ ...e, }));

  useEffect(() => {
    const badgeNum = [...eventAlerts]?.length ?? 0;
    Logger.debug(`BoxEvent > useEffect ... eventBadgeNum: ${badgeNum}`)
    setEventBadgeNum(badgeNum);
  }, [eventAlerts])

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
  
  // 모두 삭제
  const { mutate: removeEvents } = useRemoveEvents(() => {}, () => {});

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
            <BoxEventItems events={eventAlerts} />
          </div>

          <div className="bell-btns f-center">
            <div
                className="f-center fs-14"
                onClick={() => {
                  const ids = [...eventAlerts].map(e => e.id);
                  if (ids.length === 0) return;
                  removeEvents(ids); 
                }}
              >
                모두 삭제
              </div>
            <div className="f-center fs-14">모두 출력</div>
          </div>
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
            <BoxEventItems events={eventsNormal} />
          </div>

          <div className="bell-btns f-center">
            <div
              className="f-center fs-14"
              onClick={() => {
                const ids = [...eventsNormal].map(e => e.id);
                if (ids.length === 0) return;
                removeEvents(ids);
              }}
            >
              모두 삭제
            </div>
            <div className="f-center fs-14">모두 출력</div>
          </div>
        </>
      )}
    </div>
  )
};

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
