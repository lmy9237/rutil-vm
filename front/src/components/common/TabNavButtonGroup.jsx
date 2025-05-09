import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Logger from "../../utils/Logger";
import "./TabNavButtonGroup.css";

/**
 * @name TabNavButtonGroup
 * @description 네비게이션 탭 그룹
 * 
 * @returns {JSX.Element} TabNavButtonGroup
 */
const TabNavButtonGroup = React.memo(({ 
  tabs = [],
  tabActive, setTabActive
}) => {
  const { pathname } = useLocation(); // 현재 URL 경로 가져오기

  useEffect(() => {
    Logger.debug(`TabNavButtonGroup > useEffect ... `)
    const pathParts = pathname.split("/");
    const lastPart = pathParts[pathParts.length-1];
    const isUrlPathChanged = [...tabs].some((tab) => tab?.id === lastPart)
    const _tabActive = isUrlPathChanged 
      ? lastPart 
      : [...tabs][0]?.id || ""
    // URL이 변경될 때 첫 번째 요소를 active 상태로 설정
    setTabActive && setTabActive(_tabActive);
  }, [pathname, tabs]); // pathname 또는 sections가 변경될 때마다 실행

  return (
    <div className="btn-tab-nav-group">
      {[...tabs].map((tab) => ( 
        <TabNavButton 
          tab={tab}
          isActive={tabActive === tab?.id} 
        />
      ))}
    </div>
  )
})

/**
 * @name TabNavButton
 * @description 네비게이션 탭
 * 
 * @returns {JSX.Element} TabNavButton
 */
export const TabNavButton = ({ 
  tab, isActive,
  ...props 
}) => (
  <span id={`btn-tab-nav-${tab?.id}`} key={tab?.id}
    className={`btn-tab-nav f-start fw-500 ${isActive ? "active" : ""}`}
    onClick={() => tab?.onClick()}
    {...props}
  >
    {tab.label}
  </span>
);

export default TabNavButtonGroup;
