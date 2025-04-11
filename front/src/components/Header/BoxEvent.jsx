import React, { useEffect, useRef } from "react";
import useUIState from "../../hooks/useUIState";
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
} from "../icons/RutilVmIcons";
import { useAllEventsNormal, useAllNotiEvents, useRemoveEvent } from "../../api/RQHook";
import Logger from "../../utils/Logger";
import useClickOutside from "../../hooks/useClickOutside";
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
    data: eventsNormal = [],
    isLoading: isEventsNormalLoading,
    isError: isEventsNormalError,
    isSuccess: isEventsNormalSuccess,
    refetch: refetchEvents
  } = useAllEventsNormal((e) => ({
    ...e,
  }));

  const {
    data: notiEvents = [],
    isLoading: isNotiEventsLoading,
    isError: isNotiEventsError,
    isSuccess: isNotiEventsSuccess,
    refetch: refetchNotiEvents
  } = useAllNotiEvents((e) => ({
      ...e,
    })
  );

  useEffect(() => {
    const badgeNum = Array.isArray(notiEvents) ? notiEvents.length : 0;
    setEventBadgeNum(badgeNum);
  }, [notiEvents])

  const {
    setEventBadgeNum,
    eventBoxVisible, setEventBoxVisible,
    eventBoxExpanded, toggleEventBoxExpanded,
    eventBoxSectionActive, setEventBoxSectionActive
  } = useUIState();

  const bellBoxRef = useRef(null);
  useClickOutside(bellBoxRef, (e) => {
    Logger.debug(`BoxEvent > useClickOutside ...`);
    if (eventBoxVisible) setEventBoxVisible(false);
  })
  const handleSectionClick = (section) => setEventBoxSectionActive(eventBoxSectionActive === section ? "" : section);
  const stopPropagation = (e) => e.stopPropagation();
  
  return (
    <div 
      ref={bellBoxRef}
      className={`bell-box ${eventBoxExpanded ? "expanded" : ""}`}
      onClick={stopPropagation}
      {...props}
    >
      <div className="f-btw bell-cate">
        <span className="bell-header-icon f-center">
        <RVI16 iconDef={eventBoxExpanded ? rvi16ArrowRight : rvi16ArrowLeft}
          className="hover-icon"
          onClick={() => toggleEventBoxExpanded()}
        />
        </span>
        통지함
        <span className="bell-header-icon f-center">
        <RVI16 iconDef={rvi16CloseMenu}
          className="hover-icon"
          onClick={() => setEventBoxVisible(false)}
        />
        </span>
      </div>
      {/* 알림 탭 */}
      <div className={`bell-cate bell-cate-section  ${eventBoxSectionActive === "알림" ? "active" : ""} f-start`}
        onClick={() => handleSectionClick("알림")}
      >
        <span className="bell-header-icon f-center">
          <RVI24 iconDef={eventBoxSectionActive === "알림" ? rvi24DownArrow() : rvi24RightArrow()}/>
        </span>
        <span className="bell-section-title ml-1">알림</span>
      </div>

      {/* 알림 내용 */}
      {eventBoxSectionActive === "알림" && (
        <>
          <div className="bell-content-outer">
            <BoxEventItems events={notiEvents} />
          </div>

          <div className="bell-btns">
            <div className="mr-3">모두 삭제</div>
            <div>모두 출력</div>
          </div>
        </>
      )}

      {/* 이벤트 탭 */}
      <div
        className={`bell-cate bell-cate-section ${eventBoxSectionActive === "이벤트" ? "active" : ""} f-start`}
        onClick={() => handleSectionClick("이벤트")}
      >
        <span className="bell-header-icon f-center">
          <RVI24
            iconDef={eventBoxSectionActive === "이벤트" ? rvi24DownArrow() : rvi24RightArrow()}
          />
        </span>
        <span className="bell-section-title ml-1">이벤트</span>
      </div>

      {/* 이벤트 내용 (알림 아래로 깔리도록 설정) */}
      {eventBoxSectionActive === "이벤트" && (
        <>
          <div className="bell-content-outer event-section">
            <BoxEventItems events={eventsNormal} />
          </div>

          <div className="bell-btns">
            <div className="mr-3">모두 삭제</div>
            <div>모두 출력</div>
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
  events=[]
}) => {
  Logger.debug(`BoxEventItems ...`)
  return events.map((e) => <BoxEventItem event={e} />)
}

const BoxEventItem = ({
  event,
  onDelete,
  ...props
}) => {
  const {
    mutate: removeEvent
  } = useRemoveEvent(event?.id)

  return (
    <div key={event?.id} 
      className="bell-content f-start"
      {...props}
    >
      {event?.severity && (
        <span className="bell-icon f-center">
          <RVI16 iconDef={severity2Icon(event?.severity, true)} />
        </span>
      )}
        <div className="bell-mid v-start">
          <p className="v-start">{event?.description}</p>
          <div className="mt-0.5">{event?.time}</div>
        </div>
      <span className="bell-icon bell-icon-trash f-center">
        <RVI16 iconDef={rvi16Trash()}
          onClick={() => removeEvent(event?.id)}
        />
      </span>

    </div>
  )
}

export default BoxEvent;
